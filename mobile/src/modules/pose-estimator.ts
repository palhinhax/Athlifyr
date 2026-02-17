/**
 * PoseEstimator – TypeScript interface for the native pose estimation module.
 *
 * This module will be implemented as a native module using MediaPipe Pose
 * (or MoveNet TFLite as an alternative) for body joint detection.
 *
 * Current status: Interface definition only. Native implementation requires EAS dev build.
 */

import type {
  PoseFrameData,
  PoseEstimatorConfig,
} from "@/src/types/lift-analysis";

export interface PoseEstimatorModule {
  /**
   * Initialize the pose model.
   * @param config Estimator configuration.
   */
  initialize(config: PoseEstimatorConfig): Promise<void>;

  /**
   * Run pose estimation across all frames of a video.
   * @param videoUri URI of the video to analyze.
   * @param onProgress Callback with progress percentage (0–100).
   * @returns Array of pose data per frame.
   */
  estimatePoses(
    videoUri: string,
    onProgress?: (progress: number) => void
  ): Promise<PoseFrameData[]>;

  /**
   * Release native resources.
   */
  dispose(): Promise<void>;
}

/**
 * Placeholder factory until native module is available.
 * Returns a module that rejects all operations with informative errors.
 */
export function createPoseEstimator(): PoseEstimatorModule {
  const errorMessage =
    "PoseEstimator native module is not available. " +
    "This feature requires an EAS dev build with MediaPipe/TFLite native module installed.";

  return {
    initialize: () => Promise.reject(new Error(errorMessage)),
    estimatePoses: () => Promise.reject(new Error(errorMessage)),
    dispose: () => Promise.reject(new Error(errorMessage)),
  };
}
