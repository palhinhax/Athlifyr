/**
 * analysis-cloud.ts
 *
 * Client-side helpers for saving analyses to the backend (cloud).
 *
 * Flow (both lift and motion):
 *   1. Upload video to B2 via presigned URL (bypasses Vercel's 4.5 MB limit)
 *   2. POST metadata + B2 videoUrl to /api/analyses/{lift,motion}
 *
 * Auth:
 *   The caller must pass the JWT Bearer token.
 *   If the token is missing/invalid the server returns 401.
 *
 * Idempotency:
 *   The device-generated `localId` (UUID) is used as idempotency key.
 *   Calling save twice with the same localId returns the existing record.
 */

import * as FileSystem from "expo-file-system";
import { Paths, File as FSFile } from "expo-file-system";
import { API_URL } from "@/src/lib/api";
import type {
  PoseFrame,
  PoseMetrics,
  PoseVideoMeta,
  VideoSegment,
} from "@/src/types/motion-analysis";
import type { BarPathPoint, LiftMetrics } from "@/src/types/lift-analysis";
import type { MotionAnalysisResult } from "@/src/lib/motion-api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SaveMotionPayload {
  localId: string;
  label?: string;
  videoUri: string;
  /** Full server response — when provided, sent as `analysisData` (Mode 1)
   *  which includes skeletonFrames / pose / videoUrl, same as the web flow. */
  analysisResult?: MotionAnalysisResult | null;
  /** @deprecated Legacy individual fields (Mode 2) — kept for backward compat */
  segment?: VideoSegment;
  sampleFps?: number;
  videoMeta?: PoseVideoMeta | null;
  poseFrames?: PoseFrame[];
  metrics?: PoseMetrics;
}

export interface SaveLiftPayload {
  localId: string;
  label?: string;
  videoUri: string;
  /** URL of the processed video from Railway — if provided, the server
   *  uses it directly (if it's already a B2 URL, skip download). */
  processedVideoUrl?: string | null;
  durationMs: number;
  fpsSample: number;
  seedPoint: { x: number; y: number };
  barPath: BarPathPoint[];
  metrics: LiftMetrics;
}

export interface CloudSaveResult {
  id: string;
  videoUrl: string;
  createdAt: string;
}

// ─── Presign response ─────────────────────────────────────────────────────────

interface PresignResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Resolve a local or content URI to a file:// path the OS can read */
async function resolveVideoUri(videoUri: string): Promise<string> {
  if (videoUri.startsWith("content://")) {
    const dest = new FSFile(
      Paths.cache,
      `athlifyr_cloud_src_${Date.now()}.mp4`
    );
    const src = new FSFile(videoUri);
    await src.copy(dest);
    return dest.uri;
  }
  return videoUri;
}

/**
 * Upload a local video to B2 via presigned URL.
 * Returns the public B2 URL of the uploaded file.
 */
async function uploadVideoToB2ForSave(
  videoUri: string,
  authToken: string
): Promise<string> {
  const contentType = "video/mp4";
  const fileExt = "mp4";

  // Step 1: Get presigned URL
  const presignRes = await fetch(`${API_URL}/api/uploads/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
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

  // Step 2: Read file and upload to B2
  const resolvedUri = await resolveVideoUri(videoUri);
  const fileResponse = await fetch(resolvedUri);
  const fileBlob = await fileResponse.blob();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: fileBlob,
  });

  if (!putRes.ok) {
    throw new Error(`B2 upload failed: HTTP ${putRes.status}`);
  }

  // Return the public B2 URL that the save endpoint can detect as "already on B2"
  // The save endpoint checks for "backblazeb2.com/file/" in the URL
  // We construct it the same way as getB2PublicUrl() on the server
  // Key format: "uploads/<userId>/<uuid>.mp4"
  const bucketName = "athlifyr";
  const b2BaseUrl =
    process.env.EXPO_PUBLIC_B2_BUCKET_URL || "https://f003.backblazeb2.com";
  return `${b2BaseUrl}/file/${bucketName}/${key}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Save a motion analysis to the cloud (B2 + DB).
 * Throws on network/auth errors — caller must handle.
 *
 * Flow:
 *   1. Upload video to B2 via presigned URL
 *   2. POST metadata + B2 videoUrl to /api/analyses/motion
 *
 * @param payload   Analysis data
 * @param authToken  JWT Bearer token from SecureStore
 */
export async function saveMotionAnalysisToCloud(
  payload: SaveMotionPayload,
  authToken: string
): Promise<CloudSaveResult> {
  // Upload video to B2 first
  const b2VideoUrl = await uploadVideoToB2ForSave(payload.videoUri, authToken);

  const form = new FormData();

  // Pass B2 URL instead of raw video file — server detects "backblazeb2.com/file/"
  // and skips download+re-upload
  form.append("videoUrl", b2VideoUrl);

  form.append("localId", payload.localId);
  if (payload.label) form.append("label", payload.label);
  form.append("segment", JSON.stringify(payload.segment));
  form.append("sampleFps", String(payload.sampleFps));
  form.append("videoMeta", JSON.stringify(payload.videoMeta ?? null));
  form.append("poseFrames", JSON.stringify(payload.poseFrames));
  form.append("metrics", JSON.stringify(payload.metrics));

  const res = await fetch(`${API_URL}/api/analyses/motion`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: form,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const json = await res.json();
      detail = (json as { error?: string }).error ?? "";
    } catch {
      // ignore parse errors
    }
    throw new Error(
      `Cloud save failed (${res.status})${detail ? ": " + detail : ""}`
    );
  }

  return res.json() as Promise<CloudSaveResult>;
}

/**
 * Save a lift analysis to the cloud (B2 + DB).
 * Throws on network/auth errors — caller must handle.
 *
 * Flow:
 *   1. If processedVideoUrl is already a B2 URL → use it directly
 *   2. Otherwise, upload local video to B2 via presigned URL
 *   3. POST metadata + B2 videoUrl to /api/analyses/lift
 *
 * @param payload   Analysis data
 * @param authToken  JWT Bearer token from SecureStore
 */
export async function saveLiftAnalysisToCloud(
  payload: SaveLiftPayload,
  authToken: string
): Promise<CloudSaveResult> {
  const form = new FormData();

  if (
    payload.processedVideoUrl &&
    payload.processedVideoUrl.includes("backblazeb2.com/file/")
  ) {
    // Processed video already on B2 (uploaded by Railway) — pass URL directly
    form.append("videoUrl", payload.processedVideoUrl);
  } else if (payload.processedVideoUrl) {
    // Processed video is on Railway — pass URL, server will download and upload to B2
    form.append("videoUrl", payload.processedVideoUrl);
  } else {
    // No processed video — upload local video to B2 first
    const b2VideoUrl = await uploadVideoToB2ForSave(
      payload.videoUri,
      authToken
    );
    form.append("videoUrl", b2VideoUrl);
  }

  form.append("localId", payload.localId);
  if (payload.label) form.append("label", payload.label);
  form.append("durationMs", String(payload.durationMs));
  form.append("fpsSample", String(payload.fpsSample));
  form.append("seedPoint", JSON.stringify(payload.seedPoint));
  form.append("barPath", JSON.stringify(payload.barPath));
  form.append("metrics", JSON.stringify(payload.metrics));

  const res = await fetch(`${API_URL}/api/analyses/lift`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: form,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const json = await res.json();
      detail = (json as { error?: string }).error ?? "";
    } catch {
      // ignore parse errors
    }
    throw new Error(
      `Cloud save failed (${res.status})${detail ? ": " + detail : ""}`
    );
  }

  return res.json() as Promise<CloudSaveResult>;
}

/**
 * Check if a video file URI is accessible on the device.
 * Returns the file size in bytes, or null if not accessible.
 */
export async function getVideoFileSize(uri: string): Promise<number | null> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && !info.isDirectory) {
      return (info as FileSystem.FileInfo & { size?: number }).size ?? null;
    }
    return null;
  } catch {
    return null;
  }
}
