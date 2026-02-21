/**
 * TypeScript types for Video Analysis (Lift + Motion)
 *
 * These types are used for the centralized video analysis features:
 * - Lift Analysis: Barbell tracking + pose estimation (/analyze/full)
 * - Motion Analysis: Full body pose estimation (/analyze/body)
 *
 * Both endpoints return skeleton_frames with 3D landmark data per frame,
 * allowing frontend 3D skeleton rendering (e.g., Three.js, SceneKit).
 */

// ── Request Types ────────────────────────────────────────────────────────

export interface LiftAnalysisProcessRequest {
  video: File | Blob;
  seedX: number;
  seedY: number;
  seedFrame?: number;
  showAngles?: boolean;
  showBody?: boolean;
  maxDurationSec?: number;
  autoDetect?: boolean;
  enableAi?: boolean;
  language?: string;
  trimStartSec?: number | null;
  trimEndSec?: number | null;
}

export interface MotionAnalysisProcessRequest {
  video: File | Blob;
  showAngles?: boolean;
  showBody?: boolean;
  maxDurationSec?: number;
  enableAi?: boolean;
  language?: string;
  trimStartSec?: number | null;
  trimEndSec?: number | null;
}

// ── 3D Skeleton Types ────────────────────────────────────────────────────

/** A single 3D landmark (body point) detected by MediaPipe Pose. */
export interface Landmark3D {
  /** Landmark name (e.g., "left_shoulder", "right_knee") */
  name: string;
  /** Landmark index (0-32, MediaPipe Pose indices) */
  index: number;

  /** Normalized x coordinate (0 = left, 1 = right) */
  x: number;
  /** Normalized y coordinate (0 = top, 1 = bottom) */
  y: number;
  /** Normalized z coordinate (negative = closer to camera) */
  z: number;

  /** Detection confidence (0-1, use threshold of 0.5) */
  visibility: number;

  /** Pixel x coordinate in the original frame */
  pixelX: number;
  /** Pixel y coordinate in the original frame */
  pixelY: number;

  /** World x coordinate in meters (null if unavailable) */
  worldX: number | null;
  /** World y coordinate in meters, origin = hip center (null if unavailable) */
  worldY: number | null;
  /** World z coordinate in meters (null if unavailable) */
  worldZ: number | null;
}

/** A bone connection between two landmarks. */
export interface SkeletonBone {
  /** Index of the start landmark */
  startIndex: number;
  /** Index of the end landmark */
  endIndex: number;
  /** Name of the start landmark */
  startName: string;
  /** Name of the end landmark */
  endName: string;
}

/** Skeleton data for a single frame. */
export interface SkeletonFrame {
  /** 33 landmarks (or empty array if no pose detected in this frame) */
  landmarks: Landmark3D[];
  /** 35 bone connections */
  bones: SkeletonBone[];
  /** Width of the original video frame in pixels */
  frameWidth: number;
  /** Height of the original video frame in pixels */
  frameHeight: number;
}

// ── Response Types ───────────────────────────────────────────────────────

// ── AI Analysis Types ────────────────────────────────────────────────────

/** Analysis of a single repetition. */
export interface RepAnalysis {
  repNumber: number;
  startFrame: number | null;
  endFrame: number | null;
  phaseEccentricFrames: [number, number] | null;
  phaseConcentricFrames: [number, number] | null;
  minKneeAngle: number | null;
  minHipAngle: number | null;
  romDegrees: number | null;
  formScore: number | null;
  notes: string[];
}

/** AI-powered exercise analysis (GPT). */
export interface AIAnalysis {
  exercise: string | null;
  exerciseEn: string | null;
  confidence: number | null;
  totalReps: number | null;
  durationSec: number | null;
  tempoAvgSec: number | null;
  overallScore: number | null;
  overallNotes: string | null;
  reps: RepAnalysis[];
  strengths: string[];
  improvements: string[];
  safetyFlags: string[];
}

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
  /** 3D skeleton data per frame for rendering */
  skeletonFrames: SkeletonFrame[];
  /** AI-powered exercise analysis (null when enable_ai=false or unavailable) */
  aiAnalysis: AIAnalysis | null;
}

export interface MotionAnalysisProcessResponse {
  success: boolean;
  message: string;
  videoUrl: string | null;
  pose: PoseData;
  /** 3D skeleton data per frame for rendering */
  skeletonFrames: SkeletonFrame[];
  /** AI-powered exercise analysis (null when enable_ai=false or unavailable) */
  aiAnalysis: AIAnalysis | null;
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

// ── Debug Detect Types ───────────────────────────────────────────────────

/** Circle detected by the /debug/detect endpoint. */
export interface DebugDetectCircle {
  center_x: number;
  center_y: number;
  radius: number;
  center_x_pct: number;
  center_y_pct: number;
  radius_pct: number;
  confidence: number;
  area_px: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/** Response from the /debug/detect endpoint. */
export interface DebugDetectResponse {
  detected: boolean;
  seed_px: { x: number; y: number };
  seed_pct: { x: number; y: number };
  frame_size: { width: number; height: number };
  circle: DebugDetectCircle | null;
  message?: string;
}
