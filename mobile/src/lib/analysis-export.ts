/**
 * analysis-export.ts
 *
 * Client-side helpers for the backend video-composition endpoint.
 *
 * Flow:
 *   1. Copy video to cache if needed (content:// URIs)
 *   2. POST multipart/form-data to /api/export/video  →  { jobId }
 *   3. Poll /api/export/video/:jobId  →  { status, progress, downloadUrl? }
 *   4. Download the composed MP4 to cache
 *   5. Share with expo-sharing
 *
 * Backend contract
 * ────────────────
 * POST /api/export/video
 *   Body: multipart/form-data
 *     - video          : file (video/mp4)
 *     - type           : "motion" | "lift"
 *     - segment        : JSON { startMs, endMs }          (motion only)
 *     - videoMeta      : JSON { videoWidth, videoHeight }  (motion only)
 *     - poseFrames     : JSON PoseFrame[]                  (motion only)
 *     - metrics        : JSON PoseMetrics                  (motion only)
 *     - barPath        : JSON BarPathPoint[]               (lift only)
 *     - durationMs     : string (number)                   (lift only)
 *   Response 202: { jobId: string }
 *
 * GET /api/export/video/:jobId
 *   Response 200:
 *     { status: "pending" | "processing" | "done" | "error",
 *       progress: number,          // 0-100
 *       downloadUrl?: string,      // present when status === "done"
 *       error?: string }
 *
 * Overlay rendering rules (for backend implementors)
 * ──────────────────────────────────────────────────
 * The backend renders overlay PNGs at the native video resolution
 * (videoWidth × videoHeight), so NO "contain-fit" offset is required.
 *
 * Motion analysis — stickman + angles:
 *   pixelX = keypoint.x * videoMeta.videoWidth
 *   pixelY = keypoint.y * videoMeta.videoHeight
 *
 * Lift analysis — bar path:
 *   pixelX = barPathPoint.x * videoMeta.videoWidth
 *   pixelY = barPathPoint.y * videoMeta.videoHeight
 *   (videoMeta inferred from the uploaded video's actual resolution)
 *
 * FFmpeg composition command (reference):
 *   ffmpeg \
 *     -i input.mp4 \
 *     -framerate {outputFps} -i overlay_%05d.png \
 *     -filter_complex "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p" \
 *     -c:v libx264 -crf 18 -preset veryfast \
 *     -c:a copy \
 *     output.mp4
 */

import * as Sharing from "expo-sharing";
import { Paths, File as FSFile } from "expo-file-system";
import { API_URL } from "@/src/lib/api";
import type {
  PoseFrame,
  PoseMetrics,
  PoseVideoMeta,
  VideoSegment,
} from "@/src/types/motion-analysis";
import type { BarPathPoint } from "@/src/types/lift-analysis";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExportMotionPayload {
  type: "motion";
  videoUri: string;
  segment: VideoSegment;
  videoMeta: PoseVideoMeta;
  poseFrames: PoseFrame[];
  metrics: PoseMetrics;
}

export interface ExportLiftPayload {
  type: "lift";
  videoUri: string;
  durationMs: number;
  barPath: BarPathPoint[];
}

export type ExportPayload = ExportMotionPayload | ExportLiftPayload;

export interface ExportJobStatus {
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export type ExportProgressCallback = (
  phase: "uploading" | "processing" | "downloading",
  progress: number // 0-100
) => void;

// ─── Internal helpers ─────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 min max

/** Resolve a local or content URI to a file:// path the OS can read */
async function resolveVideoUri(videoUri: string): Promise<string> {
  if (videoUri.startsWith("content://")) {
    // Android content:// — copy to cache first
    const dest = new FSFile(
      Paths.cache,
      `athlifyr_export_src_${Date.now()}.mp4`
    );
    const src = new FSFile(videoUri);
    await src.copy(dest);
    return dest.uri;
  }
  return videoUri;
}

/** Build a FormData object from the export payload (video file + JSON fields) */
async function buildFormData(
  payload: ExportPayload,
  localVideoUri: string
): Promise<FormData> {
  const form = new FormData();

  // Append video as blob — React Native's fetch/FormData accepts this pattern
  form.append("video", {
    uri: localVideoUri,
    name: "video.mp4",
    type: "video/mp4",
  } as unknown as Blob);

  form.append("type", payload.type);

  if (payload.type === "motion") {
    form.append("segment", JSON.stringify(payload.segment));
    form.append("videoMeta", JSON.stringify(payload.videoMeta));
    form.append("poseFrames", JSON.stringify(payload.poseFrames));
    form.append("metrics", JSON.stringify(payload.metrics));
  } else {
    form.append("durationMs", String(payload.durationMs));
    form.append("barPath", JSON.stringify(payload.barPath));
  }

  return form;
}

/** Poll the job status until done / error / timeout */
async function pollUntilDone(
  jobId: string,
  onProgress: ExportProgressCallback
): Promise<string> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    const res = await fetch(`${API_URL}/api/export/video/${jobId}`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      throw new Error(`Poll request failed: ${res.status} ${res.statusText}`);
    }

    const data: ExportJobStatus = await res.json();

    if (data.status === "error") {
      throw new Error(data.error ?? "Backend export job failed");
    }

    if (data.status === "pending" || data.status === "processing") {
      onProgress("processing", data.progress ?? 0);
      continue;
    }

    if (data.status === "done") {
      if (!data.downloadUrl) {
        throw new Error("Job done but no downloadUrl in response");
      }
      return data.downloadUrl;
    }
  }

  throw new Error("Export timed out after 5 minutes");
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * exportAnalysisVideo
 *
 * Uploads the analysis payload to the backend, waits for the composed
 * MP4, downloads it to the device cache, and opens the system share sheet.
 *
 * Throws on error — the caller is responsible for showing a ConfirmModal.
 */
export async function exportAnalysisVideo(
  payload: ExportPayload,
  onProgress?: ExportProgressCallback
): Promise<void> {
  const progress: ExportProgressCallback = onProgress ?? (() => {});

  // ── 1. Check sharing ──────────────────────────────────────────────────────
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error("Sharing is not available on this device");
  }

  // ── 2. Resolve video URI ─────────────────────────────────────────────────
  progress("uploading", 0);
  const localUri = await resolveVideoUri(payload.videoUri);

  // ── 3. Build FormData ────────────────────────────────────────────────────
  const form = await buildFormData(payload, localUri);

  // ── 4. Upload ────────────────────────────────────────────────────────────
  // Note: Do NOT set Content-Type — fetch sets it automatically with boundary
  progress("uploading", 10);

  const uploadRes = await fetch(`${API_URL}/api/export/video`, {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    let detail = "";
    try {
      const json = await uploadRes.json();
      detail = json.message ?? json.error ?? "";
    } catch {}
    throw new Error(
      `Upload failed (${uploadRes.status})${detail ? ": " + detail : ""}`
    );
  }

  const { jobId } = (await uploadRes.json()) as { jobId: string };
  if (!jobId) {
    throw new Error("Backend did not return a jobId");
  }

  progress("uploading", 100);

  // ── 5. Poll until done ───────────────────────────────────────────────────
  progress("processing", 0);
  const downloadUrl = await pollUntilDone(jobId, progress);

  // ── 6. Download composed MP4 ─────────────────────────────────────────────
  progress("downloading", 0);

  const destFile = new FSFile(Paths.cache, `athlifyr_export_${Date.now()}.mp4`);

  // Use fetch + writableStream (new expo-file-system API; avoids deprecated downloadAsync)
  const downloadRes = await fetch(downloadUrl);
  if (!downloadRes.ok || !downloadRes.body) {
    throw new Error(`Download failed with status ${downloadRes.status}`);
  }
  const writer = destFile.writableStream();
  await downloadRes.body.pipeTo(writer);

  progress("downloading", 100);

  // ── 7. Share ──────────────────────────────────────────────────────────────
  await Sharing.shareAsync(destFile.uri, {
    mimeType: "video/mp4",
    dialogTitle: "Athlifyr Analysis",
    UTI: "public.movie",
  });
}
