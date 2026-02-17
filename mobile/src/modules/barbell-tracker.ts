/**
 * BarbellTracker – TypeScript interface for the native OpenCV barbell tracking module.
 *
 * This module will be implemented as a native module (Swift on iOS, Kotlin on Android)
 * that uses OpenCV for robust 2D bar tracking in lateral lift videos.
 *
 * Current status: Interface definition only. Native implementation requires EAS dev build.
 */

import type {
  BarPositionSample,
  BarTrackerConfig,
} from "@/src/types/lift-analysis";

export interface BarbellTrackerModule {
  /**
   * Initialize the tracker on the first frame with the given ROI.
   * @param videoUri URI of the video to analyze.
   * @param config Tracker configuration including initial ROI.
   * @returns Promise that resolves when the tracker is initialized.
   */
  initialize(videoUri: string, config: BarTrackerConfig): Promise<void>;

  /**
   * Run tracking across all frames of the video.
   * @param onProgress Callback with progress percentage (0–100).
   * @returns Array of bar position samples over time.
   */
  track(
    onProgress?: (progress: number) => void
  ): Promise<BarPositionSample[]>;

  /**
   * Re-acquire the bar at a specific frame with a new ROI.
   * Used when tracking is lost.
   * @param frameMs Timestamp in milliseconds.
   * @param roi New region of interest.
   */
  reacquire(
    frameMs: number,
    roi: { x: number; y: number; width: number; height: number }
  ): Promise<void>;

  /**
   * Release native resources.
   */
  dispose(): Promise<void>;
}

/**
 * Placeholder factory until native module is available.
 * Throws an informative error when called in a non-native environment.
 */
export function createBarbellTracker(): BarbellTrackerModule {
  const notAvailable = (): never => {
    throw new Error(
      "BarbellTracker native module is not available. " +
        "This feature requires an EAS dev build with OpenCV native module installed."
    );
  };

  return {
    initialize: () => Promise.reject(notAvailable()),
    track: () => Promise.reject(notAvailable()),
    reacquire: () => Promise.reject(notAvailable()),
    dispose: () => Promise.reject(notAvailable()),
  };
}
