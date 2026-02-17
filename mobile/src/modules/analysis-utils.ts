/**
 * Shared utility functions for lift analysis overlay rendering.
 */

/**
 * Get the frame index closest to a given timestamp,
 * assuming evenly distributed frames across the duration.
 *
 * @param tMs  Current playback time in milliseconds.
 * @param totalFrames  Total number of frames in the dataset.
 * @param durationMs  Total duration in milliseconds.
 * @returns Frame index (0-based).
 */
export function getFrameAtTime(
  tMs: number,
  totalFrames: number,
  durationMs: number
): number {
  if (durationMs <= 0 || totalFrames <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, tMs / durationMs));
  return Math.min(Math.round(ratio * (totalFrames - 1)), totalFrames - 1);
}
