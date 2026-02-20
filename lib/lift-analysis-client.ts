/**
 * Client-side helpers to call the centralized video analysis APIs.
 *
 * This can be used from both web and mobile (React Native) applications.
 * For React Native, ensure you're using a compatible FormData implementation.
 */

import type {
  LiftAnalysisProcessRequest,
  LiftAnalysisProcessResponse,
  MotionAnalysisProcessRequest,
  MotionAnalysisProcessResponse,
} from "@/types/lift-analysis";

/**
 * Process a lift video with barbell tracking + pose estimation.
 *
 * @param params - Video file and seed point coordinates
 * @param apiBaseUrl - Base URL of your API (e.g., 'https://athlifyr.com' or 'http://localhost:3000')
 * @param onProgress - Optional progress callback for upload tracking
 * @returns Processing results with video URL and analysis data
 * @throws Error if the request fails
 */
export async function processLiftAnalysis(
  params: LiftAnalysisProcessRequest,
  apiBaseUrl: string,
  onProgress?: (progress: { loaded: number; total: number }) => void,
  signal?: AbortSignal
): Promise<LiftAnalysisProcessResponse> {
  const formData = new FormData();

  // Add video file
  formData.append("video", params.video);

  // Add required parameters
  formData.append("seed_x", params.seedX.toString());
  formData.append("seed_y", params.seedY.toString());

  console.log("[LiftAnalysisClient] FormData built:", {
    seed_x_percent: params.seedX,
    seed_y_percent: params.seedY,
    seed_x_str: params.seedX.toString(),
    seed_y_str: params.seedY.toString(),
    videoName: params.video instanceof File ? params.video.name : "blob",
    videoType: params.video instanceof File ? params.video.type : "unknown",
    videoSize:
      params.video instanceof File
        ? `${(params.video.size / (1024 * 1024)).toFixed(2)} MB`
        : "unknown",
  });

  // Add optional parameters
  if (params.seedFrame !== undefined) {
    formData.append("seed_frame", params.seedFrame.toString());
  }
  if (params.showAngles !== undefined) {
    formData.append("show_angles", params.showAngles.toString());
  }
  if (params.maxDurationSec !== undefined) {
    formData.append("max_duration_sec", params.maxDurationSec.toString());
  }
  if (params.autoDetect !== undefined) {
    formData.append("auto_detect", params.autoDetect.toString());
  }

  // Create XMLHttpRequest for progress tracking (if callback provided)
  if (onProgress && typeof XMLHttpRequest !== "undefined") {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Wire up abort signal
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
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error("Failed to parse response"));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            const msg =
              typeof errorResponse.error === "string"
                ? errorResponse.error
                : typeof errorResponse.detail === "string"
                  ? errorResponse.detail
                  : `HTTP ${xhr.status} error`;
            reject(new Error(msg));
          } catch {
            reject(new Error(`HTTP ${xhr.status} error`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error"));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Request timeout"));
      });

      xhr.open("POST", `${apiBaseUrl}/api/lift-analysis/process`);
      xhr.send(formData);
    });
  }

  // Use fetch API (no progress tracking)
  const response = await fetch(`${apiBaseUrl}/api/lift-analysis/process`, {
    method: "POST",
    body: formData,
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
 * @param params - Video file and processing options
 * @param apiBaseUrl - Base URL of your API (e.g., 'https://athlifyr.com' or 'http://localhost:3000')
 * @param onProgress - Optional progress callback for upload tracking
 * @returns Processing results with video URL and pose analysis data
 * @throws Error if the request fails
 */
export async function processMotionAnalysis(
  params: MotionAnalysisProcessRequest,
  apiBaseUrl: string,
  onProgress?: (progress: { loaded: number; total: number }) => void,
  signal?: AbortSignal
): Promise<MotionAnalysisProcessResponse> {
  const formData = new FormData();

  // Add video file
  formData.append("video", params.video);

  // Add optional parameters
  if (params.showAngles !== undefined) {
    formData.append("show_angles", params.showAngles.toString());
  }
  if (params.maxDurationSec !== undefined) {
    formData.append("max_duration_sec", params.maxDurationSec.toString());
  }

  // Create XMLHttpRequest for progress tracking (if callback provided)
  if (onProgress && typeof XMLHttpRequest !== "undefined") {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Wire up abort signal
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
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error("Failed to parse response"));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            const msg =
              typeof errorResponse.error === "string"
                ? errorResponse.error
                : typeof errorResponse.detail === "string"
                  ? errorResponse.detail
                  : `HTTP ${xhr.status} error`;
            reject(new Error(msg));
          } catch {
            reject(new Error(`HTTP ${xhr.status} error`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error"));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Request timeout"));
      });

      xhr.open("POST", `${apiBaseUrl}/api/motion-analysis/process`);
      xhr.send(formData);
    });
  }

  // Use fetch API (no progress tracking)
  const response = await fetch(`${apiBaseUrl}/api/motion-analysis/process`, {
    method: "POST",
    body: formData,
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
 *
 * @param apiBaseUrl - Base URL of your API
 * @returns true if API is reachable
 */
export async function checkLiftAnalysisApiHealth(
  apiBaseUrl: string
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${apiBaseUrl}/api/lift-analysis/process`, {
      method: "OPTIONS",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok || response.status === 405; // 405 = Method Not Allowed (OPTIONS not implemented)
  } catch {
    return false;
  }
}
