/**
 * Barbell Path Tracker — External API client.
 *
 * Sends the video + seed point to the centralized Athlifyr API
 * which forwards to the barbell-path-tracker service.
 *
 * All video processing happens externally via /api/lift-analysis/process
 */

import type { BarPathPoint } from "@/src/types/lift-analysis";
import { API_URL } from "@/src/lib/api";

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

// ── Raw API response types ───────────────────────────────────────────

interface RawApiResponse {
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

    const res = await fetch(`${API_URL}/api/lift-analysis/process`, {
      method: "OPTIONS",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    // Accept 200 OK or 405 Method Not Allowed (OPTIONS not implemented)
    return res.ok || res.status === 405;
  } catch {
    return false;
  }
}

// ── Main tracking function ───────────────────────────────────────────

/**
 * Extract bar path from skeleton frames using wrist positions.
 * The barbell position is approximated as the midpoint between left and right wrists.
 */
function extractBarPathFromSkeletonFrames(
  skeletonFrames: RawApiResponse["skeletonFrames"],
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
      // Midpoint between wrists as bar position (normalized coords)
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
 * Send video to the centralized lift analysis API for processing.
 * Combines barbell tracking + pose estimation.
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
  trimRange?: { startSec: number; endSec: number }
): Promise<TrackingResult> {
  // ── 1. Build multipart form data ─────────────────────────────────
  onProgress?.({ current: 0, total: 100, step: "uploading" });

  // API expects seed as percentage (0–100) of video dimensions
  const seedXPercent = Math.min(100, Math.max(0, Math.round(seedNorm.x * 100)));
  const seedYPercent = Math.min(100, Math.max(0, Math.round(seedNorm.y * 100)));

  const formData = new FormData();

  // Append video file
  formData.append("video", {
    uri: videoUri,
    type: "video/mp4",
    name: "lift-video.mp4",
  } as unknown as Blob);

  formData.append("seed_x", seedXPercent.toString());
  formData.append("seed_y", seedYPercent.toString());
  formData.append("seed_frame", "0");
  formData.append("show_angles", "true");
  formData.append("auto_detect", "true");
  formData.append("max_duration_sec", "30");

  // Server-side trim — if the user selected a sub-clip
  if (trimRange) {
    formData.append("trim_start_sec", trimRange.startSec.toString());
    formData.append("trim_end_sec", trimRange.endSec.toString());
  }

  // ── 2. Send to API ───────────────────────────────────────────────
  onProgress?.({ current: 10, total: 100, step: "uploading" });

  const controller = new AbortController();
  // 5 minute timeout for video processing
  const timeout = setTimeout(() => controller.abort(), 300_000);

  let response: Response;
  try {
    // NOTE: Do NOT set Content-Type header manually — fetch must auto-generate
    // the multipart/form-data boundary. Setting it manually breaks the body.
    response = await fetch(`${API_URL}/api/lift-analysis/process`, {
      method: "POST",
      body: formData,
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
      `Failed to connect to the analysis service. Check your internet connection and try again.`
    );
  }
  clearTimeout(timeout);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  // ── 3. Parse response ────────────────────────────────────────────
  onProgress?.({ current: 100, total: 100, step: "processing" });

  const rawResult = (await response.json()) as RawApiResponse;

  if (!rawResult.success) {
    throw new Error(rawResult.message || "Analysis failed");
  }

  // ── 4. Transform response to expected format ─────────────────────
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
