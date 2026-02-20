/**
 * Video upload & processing limits for Athlifyr.
 * These values must stay in sync with the Railway API limits.
 * Single source of truth — imported by both client and server code.
 */

/** Maximum allowed file size in bytes (100 MB) */
export const MAX_FILE_BYTES = 100 * 1024 * 1024;

/** Human-readable max file size */
export const MAX_FILE_LABEL = "100 MB";

/** Maximum video duration in seconds for /analyze/full and /analyze/body (lift + motion) */
export const MAX_DURATION_LIFT_SEC = 30;

/** Maximum video duration in seconds for /track (barbell-only) */
export const MAX_DURATION_TRACK_SEC = 60;

/** Default max_duration_sec sent to the API for lift + motion */
export const DEFAULT_DURATION_LIFT_SEC = 20;

/** Default max_duration_sec sent to the API for barbell-only track */
export const DEFAULT_DURATION_TRACK_SEC = 30;

/** Accepted MIME types */
export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
  "video/x-matroska", // .mkv
  "video/webm",
] as const;

/** Human-readable accepted formats */
export const ACCEPTED_FORMATS_LABEL = "MP4, MOV, AVI, MKV, WEBM";

/**
 * Returns the max duration (in seconds) for the given analysis type.
 */
export function maxDurationForType(type: "lift" | "motion" | "track"): number {
  return type === "track" ? MAX_DURATION_TRACK_SEC : MAX_DURATION_LIFT_SEC;
}
