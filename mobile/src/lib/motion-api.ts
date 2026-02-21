/**
 * Motion Analysis — External API client.
 *
 * New flow (bypasses Vercel's 4.5 MB body limit):
 *   1. POST /api/uploads/presign → get a presigned PUT URL for B2
 *   2. PUT video directly to Backblaze B2
 *   3. POST /api/motion-analysis/process-b2 with just the B2 key + metadata
 *
 * All video processing happens externally via Railway; Vercel only proxies
 * lightweight JSON — zero video bytes through Vercel.
 */

import { API_URL } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";

// ── Types ────────────────────────────────────────────────────────────

export interface MotionAnalysisProgress {
  /** Upload progress 0-100 */
  progress: number;
  /** Label for the current step */
  step: "uploading" | "processing";
}

export interface PoseAngles {
  leftKnee: number | null;
  rightKnee: number | null;
  leftHip: number | null;
  rightHip: number | null;
  leftElbow: number | null;
  rightElbow: number | null;
  leftShoulder: number | null;
  rightShoulder: number | null;
  leftAnkle: number | null;
  rightAnkle: number | null;
  torsoInclination: number | null;
}

export interface PoseData {
  framesProcessed: number;
  framesWithPose: number;
  detectionRate: number;
  durationSec: number;
  averageAngles: PoseAngles | null;
}

export interface SkeletonLandmark {
  name: string;
  index: number;
  x: number;
  y: number;
  z: number;
  visibility: number;
  pixelX: number;
  pixelY: number;
  worldX: number | null;
  worldY: number | null;
  worldZ: number | null;
}

export interface SkeletonBone {
  startIndex: number;
  endIndex: number;
  startName: string;
  endName: string;
}

export interface SkeletonFrame {
  frameWidth: number;
  frameHeight: number;
  landmarks: SkeletonLandmark[];
  bones: SkeletonBone[];
}

export interface MotionAnalysisResult {
  success: boolean;
  message: string;
  videoUrl: string | null;
  pose: PoseData;
  skeletonFrames: SkeletonFrame[];
}

// ── Presign response ─────────────────────────────────────────────────

interface PresignResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

// ── Health check ─────────────────────────────────────────────────────

/**
 * Check if the motion analysis API is online.
 * @returns true if healthy, false otherwise
 */
export async function checkMotionApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    const res = await fetch(`${API_URL}/api/motion-analysis/process-b2`, {
      method: "OPTIONS",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return res.ok || res.status === 405;
  } catch {
    return false;
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
  onProgress?: (p: MotionAnalysisProgress) => void
): Promise<{ key: string; contentType: string }> {
  const contentType = "video/mp4";
  const fileExt = "mp4";

  // Get auth token for the presign request
  const authToken = await SecureStore.getItemAsync("auth-token");

  // Step 1: Get presigned URL
  onProgress?.({ progress: 5, step: "uploading" });

  const presignRes = await fetch(`${API_URL}/api/uploads/presign`, {
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
  onProgress?.({ progress: 10, step: "uploading" });

  // React Native: read local file as blob for upload
  const fileResponse = await fetch(videoUri);
  const fileBlob = await fileResponse.blob();

  onProgress?.({ progress: 20, step: "uploading" });

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: fileBlob,
  });

  if (!putRes.ok) {
    throw new Error(`B2 upload failed: HTTP ${putRes.status}`);
  }

  onProgress?.({ progress: 50, step: "uploading" });

  return { key, contentType };
}

// ── Main analysis function ───────────────────────────────────────────

/**
 * Send video to B2 and then trigger the centralized motion analysis API.
 *
 * Flow:
 *   1. POST /api/uploads/presign → presigned PUT URL
 *   2. PUT video to B2 directly
 *   3. POST /api/motion-analysis/process-b2 with B2 key + analysis params
 *
 * @param videoUri       Local URI of the recorded video
 * @param onProgress     Optional progress callback
 * @param trimRange      Optional trim range { startSec, endSec } for server-side trimming
 * @returns              Full analysis result with pose data and skeleton frames
 */
export async function analyzeMotion(
  videoUri: string,
  onProgress?: (p: MotionAnalysisProgress) => void,
  trimRange?: { startSec: number; endSec: number }
): Promise<MotionAnalysisResult> {
  // ── 1+2. Upload video to B2 via presigned URL ────────────────
  onProgress?.({ progress: 0, step: "uploading" });

  const { key, contentType } = await uploadVideoToB2(videoUri, onProgress);

  console.log("[MotionAnalysis] B2 upload complete, key:", key);

  // ── 3. Send B2 key + metadata to process-b2 endpoint ────────
  onProgress?.({ progress: 60, step: "processing" });

  const processBody = {
    key,
    contentType,
    show_angles: true,
    max_duration_sec: 30,
    enable_ai: false,
    ...(trimRange
      ? {
          trim_start_sec: trimRange.startSec,
          trim_end_sec: trimRange.endSec,
        }
      : {}),
  };

  const controller = new AbortController();
  // 5 minute timeout for video processing
  const timeout = setTimeout(() => controller.abort(), 300_000);

  let response: Response;
  try {
    const authToken = await SecureStore.getItemAsync("auth-token");

    response = await fetch(`${API_URL}/api/motion-analysis/process-b2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(processBody),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout. Video processing took too long.");
    }

    throw new Error("Failed to connect to video processing service");
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
  onProgress?.({ progress: 100, step: "processing" });

  const result = (await response.json()) as MotionAnalysisResult;

  if (!result.success) {
    throw new Error(result.message || "Analysis failed");
  }

  return result;
}
