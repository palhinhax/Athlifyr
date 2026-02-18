// ── MoveNet keypoint names ─────────────────────────────────────────
export const MOVENET_KEYPOINTS = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
] as const;

export type KeypointName = (typeof MOVENET_KEYPOINTS)[number];

/** A single keypoint detected in one frame */
export interface PoseKeypoint {
  name: KeypointName;
  /** Normalized X (0..1, left→right) */
  x: number;
  /** Normalized Y (0..1, top→bottom) */
  y: number;
  /** Confidence score 0..1 */
  score: number;
}

/** All keypoints for one sampled frame */
export interface PoseFrame {
  /** Timestamp in ms relative to segment start */
  t: number;
  keypoints: PoseKeypoint[];
}

/** Video dimension metadata from the pose estimator */
export interface PoseVideoMeta {
  /** Original video width in pixels */
  videoWidth: number;
  /** Original video height in pixels */
  videoHeight: number;
}

/** Metrics computed from pose data */
export interface PoseMetrics {
  /** Duration of the analysed segment in ms */
  durationMs: number;
  /** Average confidence across all keypoints and frames */
  avgConfidence: number;
  /** Minimum knee angle (degrees) observed — more flexion = smaller */
  maxKneeFlexion: number | null;
  /** Range of torso lean angle (degrees) [min, max] */
  torsoAngleRange: [number, number] | null;
}

/** Segment boundaries within the original video */
export interface VideoSegment {
  startMs: number;
  endMs: number;
}

/** A saved motion analysis record */
export interface MotionAnalysis {
  id: string;
  videoUri: string;
  createdAt: string;
  segment: VideoSegment;
  sampleFps: number;
  poseFrames: PoseFrame[];
  metrics: PoseMetrics;
  videoMeta?: PoseVideoMeta;
  label?: string;
}
