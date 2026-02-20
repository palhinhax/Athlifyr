/**
 * Motion Analysis — External API client.
 *
 * Sends the video to the centralized Athlifyr API for full body pose estimation.
 * All video processing happens server-side via /api/motion-analysis/process
 * (same API endpoint used by the web application).
 */

import { API_URL } from "@/src/lib/api";

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

// ── Health check ─────────────────────────────────────────────────────

/**
 * Check if the motion analysis API is online.
 * @returns true if healthy, false otherwise
 */
export async function checkMotionApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    const res = await fetch(`${API_URL}/api/motion-analysis/process`, {
      method: "OPTIONS",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return res.ok || res.status === 405;
  } catch {
    return false;
  }
}

// ── Main analysis function ───────────────────────────────────────────

/**
 * Send video to the centralized motion analysis API for full body pose estimation.
 * This is the same API endpoint used by the web application.
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
  // ── 1. Build multipart form data ─────────────────────────────────────────
  onProgress?.({ progress: 0, step: "uploading" });

  const formData = new FormData();

  // Append video file
  formData.append("video", {
    uri: videoUri,
    type: "video/mp4",
    name: "motion-video.mp4",
  } as unknown as Blob);

  formData.append("show_angles", "true");
  formData.append("max_duration_sec", "30");

  // Server-side trim — if the user selected a sub-clip
  if (trimRange) {
    formData.append("trim_start_sec", trimRange.startSec.toString());
    formData.append("trim_end_sec", trimRange.endSec.toString());
  }

  // ── 2. Send to API ───────────────────────────────────────────────────────
  onProgress?.({ progress: 10, step: "uploading" });

  const controller = new AbortController();
  // 5 minute timeout for video processing
  const timeout = setTimeout(() => controller.abort(), 300_000);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/motion-analysis/process`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout. Video processing took too long.");
    }

    throw new Error("Failed to connect to video processing service");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      (errorData as { error?: string }).error ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  // ── 3. Parse response ────────────────────────────────────────────────────
  onProgress?.({ progress: 100, step: "processing" });

  const result = (await response.json()) as MotionAnalysisResult;

  if (!result.success) {
    throw new Error(result.message || "Analysis failed");
  }

  return result;
}
