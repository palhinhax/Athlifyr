/**
 * VideoTrimmer – TypeScript interface for the native video trimming module.
 *
 * This module will be implemented using FFmpegKit (native) for precise
 * video trimming with minimal re-encoding latency.
 *
 * Current status: Interface definition only. Native implementation requires EAS dev build.
 */

import type { VideoTrimConfig } from "@/src/types/lift-analysis";

export interface VideoTrimmerModule {
  /**
   * Trim a video to the specified start/end range.
   * @param config Trim configuration (source URI, start/end).
   * @returns URI of the trimmed output video.
   */
  trim(config: VideoTrimConfig): Promise<string>;

  /**
   * Extract a single frame from a video at a given timestamp.
   * @param videoUri URI of the video.
   * @param timeMs Timestamp in milliseconds.
   * @returns URI of the extracted frame image.
   */
  extractFrame(videoUri: string, timeMs: number): Promise<string>;

  /**
   * Get video metadata (duration, fps, resolution).
   * @param videoUri URI of the video.
   */
  getMetadata(videoUri: string): Promise<{
    durationMs: number;
    fps: number;
    width: number;
    height: number;
  }>;
}

/**
 * Placeholder factory until native module is available.
 * Returns a module that rejects all operations with informative errors.
 */
export function createVideoTrimmer(): VideoTrimmerModule {
  const errorMessage =
    "VideoTrimmer native module is not available. " +
    "This feature requires an EAS dev build with FFmpegKit native module installed.";

  return {
    trim: () => Promise.reject(new Error(errorMessage)),
    extractFrame: () => Promise.reject(new Error(errorMessage)),
    getMetadata: () => Promise.reject(new Error(errorMessage)),
  };
}
