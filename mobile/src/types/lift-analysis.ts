/**
 * Types for the Lift Analysis feature.
 * Covers barbell tracking, pose estimation, video analysis,
 * and the full data model for persisting analysis results.
 */

// ─── Bar Tracking ───────────────────────────────────────────────

/** A single barbell position sample at a given timestamp. */
export interface BarPositionSample {
  /** Timestamp in milliseconds relative to the trimmed video start. */
  tMs: number;
  /** X coordinate in pixels (video resolution space). */
  x: number;
  /** Y coordinate in pixels (video resolution space). */
  y: number;
}

// ─── Pose / Joint Data ──────────────────────────────────────────

/** 2D joint position with a confidence score. */
export interface JointPosition {
  x: number;
  y: number;
  /** Confidence score from the pose model (0–1). */
  confidence: number;
}

/** Joints extracted per frame (lateral view: one side of the body). */
export interface FrameJoints {
  ankle: JointPosition;
  knee: JointPosition;
  hip: JointPosition;
  shoulder: JointPosition;
}

/** Pose data for a single frame. */
export interface PoseFrameData {
  /** Timestamp in milliseconds relative to the trimmed video start. */
  tMs: number;
  joints: FrameJoints;
}

// ─── Angles ─────────────────────────────────────────────────────

/** Computed joint angles for a single frame. */
export interface FrameAngles {
  /** Timestamp in milliseconds relative to the trimmed video start. */
  tMs: number;
  /** Knee angle in degrees (angle at knee between ankle→knee and hip→knee). */
  kneeDeg: number;
  /** Hip angle in degrees (angle at hip between knee→hip and shoulder→hip). */
  hipDeg: number;
}

// ─── Analysis Metadata ──────────────────────────────────────────

export interface AnalysisMetadata {
  /** Device model/name. */
  device: string;
  /** Version of the pose/tracking model used. */
  modelVersion: string;
  /** Average confidence across all frames. */
  avgConfidence: number;
  /** Minimum confidence observed. */
  minConfidence: number;
}

// ─── Full Analysis Result ───────────────────────────────────────

/** The complete persisted analysis result for a single lift recording. */
export interface LiftAnalysisResult {
  /** Unique identifier. */
  id: string;
  /** URI of the original recorded video. */
  videoUriOriginal: string;
  /** URI of the trimmed video segment (if trimmed). */
  videoUriTrimmed: string;
  /** Start time of the trimmed segment in milliseconds. */
  startMs: number;
  /** End time of the trimmed segment in milliseconds. */
  endMs: number;
  /** Frames per second of the video. */
  fps: number;
  /** Bar path tracking data. */
  barPath: BarPositionSample[];
  /** Pose data per frame. */
  pose: PoseFrameData[];
  /** Computed angles per frame. */
  angles: FrameAngles[];
  /** Analysis metadata. */
  meta: AnalysisMetadata;
  /** ISO date string when the analysis was created. */
  createdAt: string;
}

// ─── Overlay Configuration ──────────────────────────────────────

/** Which overlays are currently visible during playback. */
export interface OverlayVisibility {
  barPath: boolean;
  skeleton: boolean;
  angles: boolean;
}

/** Supported playback speeds. */
export type PlaybackSpeed = 0.25 | 0.5 | 1;

// ─── Analysis Processing Status ─────────────────────────────────

export type AnalysisStatus =
  | "idle"
  | "extracting_frames"
  | "tracking_bar"
  | "estimating_pose"
  | "computing_angles"
  | "complete"
  | "error";

export interface AnalysisProgress {
  status: AnalysisStatus;
  /** Progress percentage (0–100). */
  progress: number;
  /** Human-readable message for the current step. */
  message: string;
}

// ─── Native Module Interfaces ───────────────────────────────────

/** Configuration for the barbell tracker (OpenCV). */
export interface BarTrackerConfig {
  /** Initial region of interest around the bar (pixels). */
  roi: { x: number; y: number; width: number; height: number };
  /** Tracker algorithm to use. */
  algorithm: "CSRT" | "KCF";
  /** Whether to apply Kalman filter smoothing. */
  kalmanSmoothing: boolean;
}

/** Configuration for the pose estimator. */
export interface PoseEstimatorConfig {
  /** Minimum joint confidence threshold to include a detection. */
  confidenceThreshold: number;
  /** Model variant. */
  model: "mediapipe" | "movenet";
}

/** Configuration for video trimming. */
export interface VideoTrimConfig {
  /** Source video URI. */
  sourceUri: string;
  /** Start time in milliseconds. */
  startMs: number;
  /** End time in milliseconds. */
  endMs: number;
}
