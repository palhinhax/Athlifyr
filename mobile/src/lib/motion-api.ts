/**
 * Motion Analysis — External API client.
 *
 * Sends the video to the centralized Athlifyr API for full body pose estimation.
 * All video processing happens externally via /api/motion-analysis/process
 *
 * Replaces the previous on-device TensorFlow.js + MoveNet implementation.
 */

// ── API base URL ─────────────────────────────────────────────────────

// Use the Athlifyr backend API
const API_BASE_URL = __DEV__
  ? "http://localhost:3000" // Development
  : "https://athlifyr.com"; // Production

// ── Types ────────────────────────────────────────────────────────────

export interface MotionAnalysisProgress {
  /** Upload progress 0-100 */
  progress: number;
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

export interface PoseData {
  framesProcessed: number;
  framesWithPose: number;
  detectionRate: number;
  durationSec: number;
  averageAngles: PoseAngles | null;
}

export interface MotionAnalysisResult {
  success: boolean;
  message: string;
  videoUrl: string | null;
  pose: PoseData;
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

    const res = await fetch(`${API_BASE_URL}/api/motion-analysis/process`, {
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

// ── Main analysis function ───────────────────────────────────────────

/**
 * Send video to the centralized motion analysis API for processing.
 * Full body pose estimation without barbell tracking.
 *
 * @param videoUri       Local URI of the recorded video
 * @param onProgress     Optional progress callback
 * @returns              Full analysis result with pose data
 */
export async function analyzeMotion(
  videoUri: string,
  onProgress?: (p: MotionAnalysisProgress) => void
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
  formData.append("max_duration_sec", "60");

  // ── 2. Send to API ───────────────────────────────────────────────────────
  onProgress?.({ progress: 10, step: "uploading" });

  const controller = new AbortController();
  // 5 minute timeout for video processing
  const timeout = setTimeout(() => controller.abort(), 300_000);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/motion-analysis/process`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData.error || `HTTP ${response.status}: ${response.statusText}`;
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
