/**
 * Barbell Path Tracker — External API client.
 *
 * Sends the video + seed point to the remote barbell-path-tracker API
 * and returns the tracked bar path and summary metrics.
 *
 * Replaces the previous on-device OpenCV implementation.
 */

import type { BarPathPoint } from "@/src/types/lift-analysis";
import { smoothPath } from "./bar-path-utils";

// ── API base URL ─────────────────────────────────────────────────────

const BARBELL_API_URL =
  "https://barbell-path-tracker-production.up.railway.app";

// ── Types ────────────────────────────────────────────────────────────

export interface TrackingProgress {
  current: number;
  total: number;
  /** Label for the current step */
  step: "uploading" | "processing";
}

export interface TrackingResult {
  barPath: BarPathPoint[];
  durationMs: number;
  /** URL of the processed video with overlay (hosted on the API) */
  processedVideoUrl: string | null;
  /** Summary stats from the API */
  summary: ApiTrackingSummary | null;
}

export interface ApiTrackingSummary {
  totalTravelPx: number;
  maxVerticalDisplacementPx: number;
  maxHorizontalDisplacementPx: number;
  trackingSuccessRate: number;
  totalFrames: number;
  trackedFrames: number;
}

interface ApiFrame {
  frame: number;
  t_ms: number;
  x: number;
  y: number;
  confidence: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  video_url: string | null;
  frames: ApiFrame[];
  summary: {
    total_travel_px: number;
    max_vertical_displacement_px: number;
    max_horizontal_displacement_px: number;
    tracking_success_rate: number;
    total_frames: number;
    tracked_frames: number;
  } | null;
  error: string | null;
}

// ── Health check ─────────────────────────────────────────────────────

/**
 * Check if the barbell tracking API is online.
 * @returns true if healthy, false otherwise
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(`${BARBELL_API_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return false;
    const data = (await res.json()) as { status?: string };
    return data.status === "healthy";
  } catch {
    return false;
  }
}

// ── Main tracking function ───────────────────────────────────────────

/**
 * Send video to the external barbell-path-tracker API for processing.
 *
 * @param videoUri       Local URI of the recorded video
 * @param seedNorm       Normalised {x, y} of the user tap (0–1)
 * @param durationMs     Total video duration in ms
 * @param videoWidth     Width of the video frame in pixels
 * @param videoHeight    Height of the video frame in pixels
 * @param onProgress     Optional progress callback
 * @returns              Tracked bar path + API summary
 */
export async function trackBarbell(
  videoUri: string,
  seedNorm: { x: number; y: number },
  durationMs: number,
  videoWidth: number,
  videoHeight: number,
  onProgress?: (p: TrackingProgress) => void
): Promise<TrackingResult> {
  // ── 1. Build multipart form data ─────────────────────────────────
  onProgress?.({ current: 0, total: 2, step: "uploading" });

  const seedX = Math.round(seedNorm.x * videoWidth);
  const seedY = Math.round(seedNorm.y * videoHeight);

  const formData = new FormData();

  // Append video file
  formData.append("video", {
    uri: videoUri,
    type: "video/mp4",
    name: "video.mp4",
  } as unknown as Blob);

  formData.append("seed_x", seedX.toString());
  formData.append("seed_y", seedY.toString());
  formData.append("seed_frame", "0");
  formData.append("direction", "both");
  formData.append("overlay", "both");
  formData.append("smoothing", "true");

  // ── 2. Send to API ───────────────────────────────────────────────
  onProgress?.({ current: 1, total: 2, step: "uploading" });

  const controller = new AbortController();
  // 3 minute timeout for large videos
  const timeout = setTimeout(() => controller.abort(), 180_000);

  let response: Response;
  try {
    response = await fetch(`${BARBELL_API_URL}/track`, {
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
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  // ── 3. Parse response ────────────────────────────────────────────
  onProgress?.({ current: 2, total: 2, step: "processing" });

  const result = (await response.json()) as ApiResponse;

  if (!result.success) {
    throw new Error(result.error ?? result.message ?? "Tracking failed");
  }

  // ── 4. Convert API frames to normalised BarPathPoint[] ───────────
  // The API returns pixel coordinates — normalize to 0..1
  const rawPath: BarPathPoint[] = result.frames.map((f) => ({
    t: f.t_ms,
    x: f.x / videoWidth,
    y: f.y / videoHeight,
  }));

  // Smooth the path (same as before)
  const barPath = rawPath.length >= 3 ? smoothPath(rawPath, 2) : rawPath;

  // ── 5. Build processed video URL ─────────────────────────────────
  const processedVideoUrl = result.video_url
    ? `${BARBELL_API_URL}${result.video_url}`
    : null;

  // ── 6. Map summary ──────────────────────────────────────────────
  const summary: ApiTrackingSummary | null = result.summary
    ? {
        totalTravelPx: result.summary.total_travel_px,
        maxVerticalDisplacementPx: result.summary.max_vertical_displacement_px,
        maxHorizontalDisplacementPx:
          result.summary.max_horizontal_displacement_px,
        trackingSuccessRate: result.summary.tracking_success_rate,
        totalFrames: result.summary.total_frames,
        trackedFrames: result.summary.tracked_frames,
      }
    : null;

  return {
    barPath,
    durationMs,
    processedVideoUrl,
    summary,
  };
}
