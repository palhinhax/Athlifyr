/**
 * TypeScript types for Video Analysis (Lift + Motion)
 *
 * These types are used for the centralized video analysis features:
 * - Lift Analysis: Barbell tracking + pose estimation (/analyze/full)
 * - Motion Analysis: Full body pose estimation (/analyze/body)
 */

// ── Request Types ────────────────────────────────────────────────────────

export interface LiftAnalysisProcessRequest {
  video: File | Blob;
  seedX: number;
  seedY: number;
  seedFrame?: number;
  showAngles?: boolean;
  maxDurationSec?: number;
  autoDetect?: boolean;
}

export interface MotionAnalysisProcessRequest {
  video: File | Blob;
  showAngles?: boolean;
  maxDurationSec?: number;
}

// ── Response Types ───────────────────────────────────────────────────────

export interface PoseAngles {
  leftKnee: number | null;
  rightKnee: number | null;
  leftHip: number | null;
  rightHip: number | null;
  leftElbow: number | null;
  rightElbow: number | null;
  leftShoulder: number | null;
  rightShoulder: number | null;
  leftAnkle: number | null;
  rightAnkle: number | null;
  torsoInclination: number | null;
}

export interface TrackingData {
  success: boolean;
  autoDetected: boolean;
  detectedCenter: {
    x: number | null;
    y: number | null;
  };
  detectedRadius: number | null;
  totalTravelPx: number | null;
  maxVerticalDisplacementPx: number | null;
  maxHorizontalDisplacementPx: number | null;
}

export interface PoseData {
  framesProcessed: number;
  framesWithPose: number;
  detectionRate: number;
  durationSec: number;
  averageAngles: PoseAngles | null;
}

export interface LiftAnalysisProcessResponse {
  success: boolean;
  message: string;
  videoUrl: string | null;
  tracking: TrackingData;
  pose: PoseData;
}

export interface MotionAnalysisProcessResponse {
  success: boolean;
  message: string;
  videoUrl: string | null;
  pose: PoseData;
}

// ── Error Types ──────────────────────────────────────────────────────────

export interface LiftAnalysisError {
  error: string;
}

// ── Type Guards ──────────────────────────────────────────────────────────

export function isLiftAnalysisError(
  response: unknown
): response is LiftAnalysisError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof (response as LiftAnalysisError).error === "string"
  );
}

export function isLiftAnalysisProcessResponse(
  response: unknown
): response is LiftAnalysisProcessResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    "tracking" in response &&
    "pose" in response
  );
}

export function isMotionAnalysisProcessResponse(
  response: unknown
): response is MotionAnalysisProcessResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    "pose" in response &&
    !("tracking" in response) // Motion analysis doesn't have tracking
  );
}
