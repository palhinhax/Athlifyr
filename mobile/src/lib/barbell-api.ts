/**
 * Barbell Path Tracker — External API client.
 *
 * New flow (bypasses Vercel's 4.5 MB body limit):
 *   1. POST /api/uploads/presign → get a presigned PUT URL for B2
 *   2. PUT video directly to Backblaze B2
 *   3. POST /api/lift-analysis/process-b2 with just the B2 key + metadata
 *
 * All video processing happens externally via Railway; Vercel only proxies
 * lightweight JSON — zero video bytes through Vercel.
 */

import type { BarPathPoint } from "@/src/types/lift-analysis";
import { BASE_URL } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";
import * as VideoThumbnails from "expo-video-thumbnails";

// ── Types ────────────────────────────────────────────────────────────

export interface TrackingProgress {
  /** Current step number */
  current: number;
  /** Total steps */
  total: number;
  /** Label for the current step */
  step: "uploading" | "processing";
}

export interface PoseAngles {
  leftKnee?: number;
  rightKnee?: number;
  leftHip?: number;
  rightHip?: number;
  leftElbow?: number;
  rightElbow?: number;
  leftShoulder?: number;
  rightShoulder?: number;
  leftAnkle?: number;
  rightAnkle?: number;
  torsoInclination?: number;
}

export interface TrackingSummary {
  trackingSuccessRate: number;
  trackedFrames: number;
  totalFrames: number;
}

export interface TrackingResult {
  /** Tracked bar path points (normalized coordinates) */
  barPath: BarPathPoint[];
  /** URL to the processed video with overlay */
  processedVideoUrl: string | null;
  /** Tracking summary statistics */
  summary: TrackingSummary | null;
}

// ── Raw API response types (from process-b2 endpoint) ────────────────

interface ProcessB2Response {
  success: boolean;
  message: string;
  videoUrl: string | null;
  tracking: {
    success: boolean;
    autoDetected: boolean;
    detectedCenter: { x: number | null; y: number | null };
    detectedRadius: number | null;
    totalTravelPx: number | null;
    maxVerticalDisplacementPx: number | null;
    maxHorizontalDisplacementPx: number | null;
  };
  pose: {
    framesProcessed: number;
    framesWithPose: number;
    detectionRate: number;
    durationSec: number;
    averageAngles: PoseAngles | null;
  };
  skeletonFrames?: Array<{
    frameWidth: number;
    frameHeight: number;
    landmarks: Array<{
      name: string;
      index: number;
      x: number;
      y: number;
      z: number;
      visibility: number;
      pixelX: number;
      pixelY: number;
    }>;
  }>;
  aiAnalysis?: unknown;
}

// ── Presign response ─────────────────────────────────────────────────

interface PresignResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

// ── Health check ─────────────────────────────────────────────────────

/**
 * Check if the lift analysis API is online.
 * @returns true if healthy, false otherwise
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    const res = await fetch(`${BASE_URL}/lift-analysis/process-b2`, {
      method: "OPTIONS",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return res.ok || res.status === 405;
  } catch {
    return false;
  }
}

// ── Debug Detect (disc detection feedback) ───────────────────────────

/** Circle detected by the debug/detect endpoint. */
export interface DebugDetectCircle {
  center_x: number;
  center_y: number;
  radius: number;
  center_x_pct: number;
  center_y_pct: number;
  radius_pct: number;
  confidence: number;
  area_px: number;
}

/** Response from the debug/detect endpoint. */
export interface DebugDetectResult {
  detected: boolean;
  circle: DebugDetectCircle | null;
  frame_size: { width: number; height: number };
}

/**
 * Extract a frame from the video at the given time and call the
 * debug/detect endpoint to check if a disc/plate is detected at the
 * seed point.
 *
 * @param videoUri     Local video URI
 * @param seedNorm     Normalised {x, y} of the tap (0–1)
 * @param timeSec      Time in seconds of the current frame
 * @returns            Detection result, or null on failure
 */
export async function detectDisc(
  videoUri: string,
  seedNorm: { x: number; y: number },
  timeSec: number
): Promise<DebugDetectResult | null> {
  try {
    // 1. Extract frame thumbnail at the given time
    const timeMs = Math.round(timeSec * 1000);
    const { uri: frameUri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      { time: timeMs, quality: 0.85 }
    );

    // 2. Build FormData for the API
    const seedXPct = Math.min(100, Math.max(0, seedNorm.x * 100));
    const seedYPct = Math.min(100, Math.max(0, seedNorm.y * 100));

    const formData = new FormData();
    formData.append("image", {
      uri: frameUri,
      type: "image/jpeg",
      name: "frame.jpg",
    } as unknown as Blob);
    formData.append("seed_x", seedXPct.toFixed(2));
    formData.append("seed_y", seedYPct.toFixed(2));

    // 4. Call API
    const authToken = await SecureStore.getItemAsync("auth-token");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(`${BASE_URL}/lift-analysis/debug-detect`, {
      method: "POST",
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn("[detectDisc] API error:", res.status);
      return null;
    }

    const data = (await res.json()) as DebugDetectResult;
    console.log("[detectDisc] Result:", {
      detected: data.detected,
      confidence: data.circle?.confidence,
    });
    return data;
  } catch (err) {
    console.warn("[detectDisc] Error:", err);
    return null;
  }
}

// ── Internal: upload video to B2 via presigned URL ───────────────────

/**
 * Step 1+2: Request a presigned URL from the API, then PUT the video
 * directly to Backblaze B2.
 *
 * Returns the B2 object key and content type.
 */
async function uploadVideoToB2(
  videoUri: string,
  onProgress?: (p: TrackingProgress) => void
): Promise<{ key: string; contentType: string }> {
  const contentType = "video/mp4";
  const fileExt = "mp4";

  // Get auth token for the presign request
  const authToken = await SecureStore.getItemAsync("auth-token");

  // Step 1: Get presigned URL
  onProgress?.({ current: 5, total: 100, step: "uploading" });

  const presignRes = await fetch(`${BASE_URL}/uploads/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ contentType, fileExt }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ||
        `Presign failed: HTTP ${presignRes.status}`
    );
  }

  const { uploadUrl, key } = (await presignRes.json()) as PresignResponse;

  // Step 2: Upload video directly to B2
  onProgress?.({ current: 10, total: 100, step: "uploading" });

  // React Native: read local file as blob for upload
  const fileResponse = await fetch(videoUri);
  const fileBlob = await fileResponse.blob();

  onProgress?.({ current: 20, total: 100, step: "uploading" });

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: fileBlob,
  });

  if (!putRes.ok) {
    throw new Error(`B2 upload failed: HTTP ${putRes.status}`);
  }

  onProgress?.({ current: 50, total: 100, step: "uploading" });

  return { key, contentType };
}

// ── Main tracking function ───────────────────────────────────────────

/**
 * Extract bar path from skeleton frames using wrist positions.
 * The barbell position is approximated as the midpoint between left and right wrists.
 */
function extractBarPathFromSkeletonFrames(
  skeletonFrames: ProcessB2Response["skeletonFrames"],
  durationSec: number
): BarPathPoint[] {
  if (!skeletonFrames || skeletonFrames.length === 0) {
    return [];
  }

  const barPath: BarPathPoint[] = [];
  const frameInterval = (durationSec * 1000) / skeletonFrames.length;

  for (let i = 0; i < skeletonFrames.length; i++) {
    const frame = skeletonFrames[i];
    const leftWrist = frame.landmarks.find((lm) => lm.name === "left_wrist");
    const rightWrist = frame.landmarks.find((lm) => lm.name === "right_wrist");

    if (leftWrist && rightWrist) {
      const x = (leftWrist.x + rightWrist.x) / 2;
      const y = (leftWrist.y + rightWrist.y) / 2;
      barPath.push({ t: Math.round(i * frameInterval), x, y });
    } else if (leftWrist) {
      barPath.push({
        t: Math.round(i * frameInterval),
        x: leftWrist.x,
        y: leftWrist.y,
      });
    } else if (rightWrist) {
      barPath.push({
        t: Math.round(i * frameInterval),
        x: rightWrist.x,
        y: rightWrist.y,
      });
    }
  }

  return barPath;
}

/**
 * Send video to B2 and then trigger the centralized lift analysis API.
 *
 * Flow:
 *   1. POST /api/uploads/presign → presigned PUT URL
 *   2. PUT video to B2 directly
 *   3. POST /api/lift-analysis/process-b2 with B2 key + analysis params
 *
 * @param videoUri       Local URI of the recorded video
 * @param seedNorm       Normalised {x, y} of the user tap (0–1)
 * @param videoWidth     Width of the video frame in pixels
 * @param videoHeight    Height of the video frame in pixels
 * @param onProgress     Optional progress callback
 * @param trimRange      Optional trim range { startSec, endSec } for server-side trimming
 * @returns              Full analysis result with tracking + pose data
 */
export async function trackBarbell(
  videoUri: string,
  seedNorm: { x: number; y: number },
  videoWidth: number,
  videoHeight: number,
  onProgress?: (p: TrackingProgress) => void,
  trimRange?: { startSec: number; endSec: number },
  showBody?: boolean
): Promise<TrackingResult> {
  // ── 1+2. Upload video to B2 via presigned URL ────────────────
  onProgress?.({ current: 0, total: 100, step: "uploading" });

  const { key, contentType } = await uploadVideoToB2(videoUri, onProgress);

  console.log("[LiftAnalysis] B2 upload complete, key:", key);

  // ── 3. Send B2 key + metadata to process-b2 endpoint ────────
  onProgress?.({ current: 60, total: 100, step: "processing" });

  // API expects seed as percentage (0–100) of video dimensions
  const seedXPercent = Math.min(100, Math.max(0, Math.round(seedNorm.x * 100)));
  const seedYPercent = Math.min(100, Math.max(0, Math.round(seedNorm.y * 100)));

  const processBody = {
    key,
    contentType,
    seed_x: seedXPercent,
    seed_y: seedYPercent,
    seed_frame: 0,
    show_angles: true,
    show_body: showBody ?? true,
    max_duration_sec: 30,
    auto_detect: true,
    enable_ai: false,
    // Railway validates trimmed duration >= max_duration_sec, so shave 0.1s
    // off the trim end to avoid rejecting videos trimmed to exactly 30.0s.
    ...(trimRange
      ? {
          trim_start_sec: trimRange.startSec,
          trim_end_sec: Math.max(
            trimRange.startSec + 1,
            trimRange.endSec - 0.1
          ),
        }
      : {}),
  };

  const controller = new AbortController();
  // 5 minute timeout for video processing
  const timeout = setTimeout(() => controller.abort(), 300_000);

  let response: Response;
  try {
    const authToken = await SecureStore.getItemAsync("auth-token");

    response = await fetch(`${BASE_URL}/lift-analysis/process-b2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(processBody),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        "Request timed out. The video may be too large or the server is busy."
      );
    }
    throw new Error(
      "Failed to connect to the analysis service. Check your internet connection and try again."
    );
  }
  clearTimeout(timeout);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      (errorData as { error?: string }).error ||
      (errorData as { detail?: string }).detail ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  // ── 4. Parse response ────────────────────────────────────────
  onProgress?.({ current: 100, total: 100, step: "processing" });

  const rawResult = (await response.json()) as ProcessB2Response;

  if (!rawResult.success) {
    throw new Error(rawResult.message || "Analysis failed");
  }

  // ── 5. Transform response to expected format ─────────────────
  const barPath = extractBarPathFromSkeletonFrames(
    rawResult.skeletonFrames,
    rawResult.pose.durationSec
  );

  const summary: TrackingSummary | null = rawResult.tracking
    ? {
        trackingSuccessRate: rawResult.pose.detectionRate * 100,
        trackedFrames: rawResult.pose.framesWithPose,
        totalFrames: rawResult.pose.framesProcessed,
      }
    : null;

  return {
    barPath,
    processedVideoUrl: rawResult.videoUrl,
    summary,
  };
}
