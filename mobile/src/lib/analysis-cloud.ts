/**
 * analysis-cloud.ts
 *
 * Client-side helpers for saving analyses to the backend (cloud).
 *
 * Flow (motion):
 *   1. Copy video to cache if needed (content:// URIs on Android)
 *   2. POST multipart/form-data to /api/analyses/motion  →  { id, videoUrl, createdAt }
 *
 * Flow (lift):
 *   1. Copy video to cache if needed
 *   2. POST multipart/form-data to /api/analyses/lift  →  { id, videoUrl, createdAt }
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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SaveMotionPayload {
  localId: string;
  label?: string;
  videoUri: string;
  segment: VideoSegment;
  sampleFps: number;
  videoMeta?: PoseVideoMeta | null;
  poseFrames: PoseFrame[];
  metrics: PoseMetrics;
}

export interface SaveLiftPayload {
  localId: string;
  label?: string;
  videoUri: string;
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

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Save a motion analysis to the cloud (B2 + DB).
 * Throws on network/auth errors — caller must handle.
 *
 * @param payload   Analysis data
 * @param authToken  JWT Bearer token from SecureStore
 */
export async function saveMotionAnalysisToCloud(
  payload: SaveMotionPayload,
  authToken: string
): Promise<CloudSaveResult> {
  const localUri = await resolveVideoUri(payload.videoUri);

  const form = new FormData();
  form.append("video", {
    uri: localUri,
    name: "video.mp4",
    type: "video/mp4",
  } as unknown as Blob);

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
 * @param payload   Analysis data
 * @param authToken  JWT Bearer token from SecureStore
 */
export async function saveLiftAnalysisToCloud(
  payload: SaveLiftPayload,
  authToken: string
): Promise<CloudSaveResult> {
  const localUri = await resolveVideoUri(payload.videoUri);

  const form = new FormData();
  form.append("video", {
    uri: localUri,
    name: "video.mp4",
    type: "video/mp4",
  } as unknown as Blob);

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
