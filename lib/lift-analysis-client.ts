/**
 * Client-side helpers to call the centralized video analysis APIs.
 *
 * New flow (bypasses Vercel's 4.5 MB body limit):
 *   1. POST /api/uploads/presign → get a presigned PUT URL for B2
 *   2. PUT video directly to Backblaze B2 (with XHR progress)
 *   3. POST /api/{lift,motion}-analysis/process-b2 with just the key + metadata
 *
 * Falls back to the legacy direct-upload endpoint for localhost dev if the
 * presign endpoint is not configured.
 */

import type {
  LiftAnalysisProcessRequest,
  LiftAnalysisProcessResponse,
  MotionAnalysisProcessRequest,
  MotionAnalysisProcessResponse,
} from "@/types/lift-analysis";

// ── Presign types ─────────────────────────────────────────────────────────

interface PresignResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

// ── Internal: presign + direct upload to B2 ──────────────────────────────

/**
 * Step 1 + 2: Request a presigned URL, then upload the video directly to B2.
 * Returns the B2 object key.
 */
async function uploadVideoToB2(
  video: File | Blob,
  apiBaseUrl: string,
  onProgress?: (progress: { loaded: number; total: number }) => void,
  signal?: AbortSignal
): Promise<{ key: string; contentType: string }> {
  const contentType =
    video instanceof File ? video.type || "video/mp4" : "video/mp4";
  const fileExt =
    video instanceof File ? (video.name.split(".").pop() ?? "mp4") : "mp4";

  // Step 1: Get presigned URL
  const presignRes = await fetch(`${apiBaseUrl}/api/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, fileExt }),
    signal,
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ||
        `Presign failed: HTTP ${presignRes.status}`
    );
  }

  const { uploadUrl, key } = (await presignRes.json()) as PresignResponse;

  // Step 2: Upload directly to B2 (with progress via XHR if available)
  if (onProgress && typeof XMLHttpRequest !== "undefined") {
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (signal) {
        if (signal.aborted) {
          reject(new Error("Cancelled"));
          return;
        }
        signal.addEventListener("abort", () => {
          xhr.abort();
          reject(new Error("Cancelled"));
        });
      }

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress({ loaded: e.loaded, total: e.total });
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(
            new Error(`B2 upload failed: HTTP ${xhr.status} ${xhr.statusText}`)
          );
        }
      });

      xhr.addEventListener("error", () =>
        reject(new Error("Network error during B2 upload"))
      );
      xhr.addEventListener("timeout", () =>
        reject(new Error("B2 upload timeout"))
      );

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.send(video);
    });
  } else {
    // Fallback: fetch (no progress tracking)
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: video,
      signal,
    });
    if (!putRes.ok) {
      throw new Error(`B2 upload failed: HTTP ${putRes.status}`);
    }
  }

  return { key, contentType };
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Process a lift video with barbell tracking + pose estimation.
 *
 * Flow: presign → upload to B2 → POST key + metadata to process-b2
 */
export async function processLiftAnalysis(
  params: LiftAnalysisProcessRequest,
  apiBaseUrl: string,
  onProgress?: (progress: { loaded: number; total: number }) => void,
  signal?: AbortSignal
): Promise<LiftAnalysisProcessResponse> {
  console.log("[LiftClient] Starting B2 upload flow…", {
    videoSize:
      params.video instanceof File
        ? `${(params.video.size / (1024 * 1024)).toFixed(2)} MB`
        : "unknown",
    seedX: params.seedX,
    seedY: params.seedY,
  });

  // Step 1+2: Upload video to B2
  const { key, contentType } = await uploadVideoToB2(
    params.video,
    apiBaseUrl,
    onProgress,
    signal
  );

  console.log("[LiftClient] B2 upload complete, key:", key);

  // Step 3: Send key + metadata to process-b2 endpoint
  const processBody = {
    key,
    contentType,
    seed_x: params.seedX,
    seed_y: params.seedY,
    seed_frame: params.seedFrame ?? 0,
    show_angles: params.showAngles ?? true,
    max_duration_sec: params.maxDurationSec,
    auto_detect: params.autoDetect ?? true,
    enable_ai: params.enableAi ?? false,
    language: params.language,
  };

  const response = await fetch(`${apiBaseUrl}/api/lift-analysis/process-b2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(processBody),
    signal,
  });

  const data = await response.json();

  if (!response.ok) {
    const errData = data as Record<string, unknown>;
    const msg =
      typeof errData.error === "string"
        ? errData.error
        : typeof errData.detail === "string"
          ? errData.detail
          : "Processing failed";
    throw new Error(msg);
  }

  return data as LiftAnalysisProcessResponse;
}

/**
 * Process a motion video with full body pose estimation (no barbell tracking).
 *
 * Flow: presign → upload to B2 → POST key + metadata to process-b2
 */
export async function processMotionAnalysis(
  params: MotionAnalysisProcessRequest,
  apiBaseUrl: string,
  onProgress?: (progress: { loaded: number; total: number }) => void,
  signal?: AbortSignal
): Promise<MotionAnalysisProcessResponse> {
  console.log("[MotionClient] Starting B2 upload flow…", {
    videoSize:
      params.video instanceof File
        ? `${(params.video.size / (1024 * 1024)).toFixed(2)} MB`
        : "unknown",
  });

  // Step 1+2: Upload video to B2
  const { key, contentType } = await uploadVideoToB2(
    params.video,
    apiBaseUrl,
    onProgress,
    signal
  );

  console.log("[MotionClient] B2 upload complete, key:", key);

  // Step 3: Send key + metadata to process-b2 endpoint
  const processBody = {
    key,
    contentType,
    show_angles: params.showAngles ?? true,
    max_duration_sec: params.maxDurationSec,
    enable_ai: params.enableAi ?? false,
    language: params.language,
  };

  const response = await fetch(`${apiBaseUrl}/api/motion-analysis/process-b2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(processBody),
    signal,
  });

  const data = await response.json();

  if (!response.ok) {
    const errData = data as Record<string, unknown>;
    const msg =
      typeof errData.error === "string"
        ? errData.error
        : typeof errData.detail === "string"
          ? errData.detail
          : "Processing failed";
    throw new Error(msg);
  }

  return data as MotionAnalysisProcessResponse;
}

/**
 * Check if the lift analysis API is available.
 */
export async function checkLiftAnalysisApiHealth(
  apiBaseUrl: string
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${apiBaseUrl}/api/lift-analysis/process-b2`, {
      method: "OPTIONS",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok || response.status === 405;
  } catch {
    return false;
  }
}
