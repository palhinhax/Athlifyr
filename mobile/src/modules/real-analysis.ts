/**
 * RealAnalysis – Converts raw MediaPipe pose landmarks into the app's
 * analysis data format (bar path, skeleton, angles).
 *
 * MediaPipe Pose Landmarker returns 33 normalized (0–1) landmarks per frame.
 * This module:
 *   1. Maps landmarks to our 4-joint model (ankle, knee, hip, shoulder)
 *   2. Derives barbell position from wrist landmarks
 *   3. Computes knee and hip angles
 *   4. Builds a full LiftAnalysisResult
 */

import type {
  BarPositionSample,
  PoseFrameData,
  FrameAngles,
  JointPosition,
  LiftAnalysisResult,
} from "@/src/types/lift-analysis";

// ─── MediaPipe Pose Landmark Indices ────────────────────────────
// Reference: https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker

const LANDMARK = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

/** Raw landmark from MediaPipe Pose Landmarker. */
export interface MediaPipeLandmark {
  x: number; // Normalized 0–1
  y: number; // Normalized 0–1
  z: number;
  visibility: number; // 0–1 confidence
}

/** Circle detected by the Hough Circle Transform (barbell plate). */
export interface DetectedCircle {
  x: number; // Normalized 0–1 centre x
  y: number; // Normalized 0–1 centre y
  votes: number; // Accumulator vote count (strength)
}

/** Result for a single processed frame. */
export interface PoseResult {
  frameIndex: number;
  tMs: number;
  landmarks: MediaPipeLandmark[] | null;
  /** Circles detected via Hough Circle Transform (weight plates). */
  barCircles: DetectedCircle[] | null;
}

// ─── Landmark → Joint Mapping ───────────────────────────────────

/**
 * Merge left/right landmarks into a single joint, weighted by visibility.
 * In a lateral view, the visible side's landmark dominates.
 */
function mergeLeftRight(
  landmarks: MediaPipeLandmark[],
  leftIdx: number,
  rightIdx: number
): JointPosition {
  const left = landmarks[leftIdx];
  const right = landmarks[rightIdx];
  const visSum = left.visibility + right.visibility;

  if (visSum === 0) {
    return {
      x: (left.x + right.x) / 2,
      y: (left.y + right.y) / 2,
      confidence: 0,
    };
  }

  const wL = left.visibility / visSum;
  const wR = right.visibility / visSum;

  return {
    x: left.x * wL + right.x * wR,
    y: left.y * wL + right.y * wR,
    confidence: Math.max(left.visibility, right.visibility),
  };
}

/** Extract our 4-joint skeleton from full MediaPipe landmarks. */
function landmarksToJoints(
  landmarks: MediaPipeLandmark[]
): PoseFrameData["joints"] {
  return {
    shoulder: mergeLeftRight(
      landmarks,
      LANDMARK.LEFT_SHOULDER,
      LANDMARK.RIGHT_SHOULDER
    ),
    hip: mergeLeftRight(landmarks, LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP),
    knee: mergeLeftRight(landmarks, LANDMARK.LEFT_KNEE, LANDMARK.RIGHT_KNEE),
    ankle: mergeLeftRight(landmarks, LANDMARK.LEFT_ANKLE, LANDMARK.RIGHT_ANKLE),
  };
}

/**
 * Derive barbell position from detected plate circles (Hough Circle Transform).
 * Returns the vote-weighted centroid of the detected circles.
 * Falls back to `null` when no circles were detected.
 */
function circlesToBarPosition(
  circles: DetectedCircle[] | null,
  tMs: number
): BarPositionSample | null {
  if (!circles || circles.length === 0) return null;

  let sumX = 0;
  let sumY = 0;
  let sumW = 0;

  for (const c of circles) {
    sumX += c.x * c.votes;
    sumY += c.y * c.votes;
    sumW += c.votes;
  }

  if (sumW === 0) return null;

  return { tMs, x: sumX / sumW, y: sumY / sumW };
}

/**
 * Derive barbell position from wrist landmarks (fallback).
 * In a lateral squat/deadlift view, the bar aligns with the wrists.
 */
function landmarksToBarPosition(
  landmarks: MediaPipeLandmark[],
  tMs: number
): BarPositionSample {
  const wrist = mergeLeftRight(
    landmarks,
    LANDMARK.LEFT_WRIST,
    LANDMARK.RIGHT_WRIST
  );
  return { tMs, x: wrist.x, y: wrist.y };
}

// ─── Angle Computation ──────────────────────────────────────────

/** Compute the angle (degrees) at vertex between vectors a→vertex and b→vertex. */
function angleBetween(
  a: { x: number; y: number },
  vertex: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const v1x = a.x - vertex.x;
  const v1y = a.y - vertex.y;
  const v2x = b.x - vertex.x;
  const v2y = b.y - vertex.y;
  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);
  if (mag1 === 0 || mag2 === 0) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/** Compute knee and hip joint angles for a single frame. */
function computeAngles(frame: PoseFrameData): FrameAngles {
  return {
    tMs: frame.tMs,
    kneeDeg: Math.round(
      angleBetween(frame.joints.ankle, frame.joints.knee, frame.joints.hip)
    ),
    hipDeg: Math.round(
      angleBetween(frame.joints.knee, frame.joints.hip, frame.joints.shoulder)
    ),
  };
}

// ─── Temporal Smoothing ─────────────────────────────────────────

/**
 * Apply an exponential moving average (EMA) to the bar path to remove
 * frame-to-frame jitter from detection noise. Alpha controls the
 * smoothing strength (lower = smoother, 0.35 is a good balance).
 */
function smoothBarPath(
  raw: BarPositionSample[],
  alpha: number = 0.35
): BarPositionSample[] {
  if (raw.length <= 1) return raw;

  const smoothed: BarPositionSample[] = [raw[0]];
  for (let i = 1; i < raw.length; i++) {
    const prev = smoothed[i - 1];
    smoothed.push({
      tMs: raw[i].tMs,
      x: alpha * raw[i].x + (1 - alpha) * prev.x,
      y: alpha * raw[i].y + (1 - alpha) * prev.y,
    });
  }
  return smoothed;
}

/**
 * Catmull-Rom spline interpolation – produces `subdivisions` extra
 * points between each pair of input samples, yielding a dense,
 * silky-smooth bar path.
 */
function catmullRomInterpolate(
  points: BarPositionSample[],
  subdivisions: number = 4
): BarPositionSample[] {
  if (points.length < 2) return points;

  const result: BarPositionSample[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    for (let s = 0; s < subdivisions; s++) {
      const t = s / subdivisions;
      const t2 = t * t;
      const t3 = t2 * t;

      // Catmull-Rom basis functions
      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      const tMs = p1.tMs + (p2.tMs - p1.tMs) * t;

      result.push({ tMs, x, y });
    }
  }

  // Add the last original point
  result.push(points[points.length - 1]);

  return result;
}

// ─── Build Full Result ──────────────────────────────────────────

/**
 * Build a complete LiftAnalysisResult from raw pose estimation results.
 *
 * @param videoUri  Source video URI.
 * @param durationMs  Video duration in milliseconds.
 * @param poseResults  Per-frame pose estimation results from the WebView.
 * @returns Complete analysis result ready for overlay rendering.
 * @throws If no valid poses were detected in any frame.
 */
export function buildAnalysisResult(
  videoUri: string,
  durationMs: number,
  poseResults: PoseResult[]
): LiftAnalysisResult {
  const validResults = poseResults.filter(
    (r): r is PoseResult & { landmarks: MediaPipeLandmark[] } =>
      r.landmarks !== null && r.landmarks.length >= 29
  );

  if (validResults.length === 0) {
    throw new Error("No poses detected in any frame");
  }

  const barPath: BarPositionSample[] = [];
  const poseData: PoseFrameData[] = [];
  const angleData: FrameAngles[] = [];
  let circleHits = 0;

  for (const result of validResults) {
    // Primary: bar position from detected plate circles (Hough Circle Transform)
    // Fallback: derive from wrist landmarks
    const circleBar = circlesToBarPosition(result.barCircles, result.tMs);
    if (circleBar) {
      barPath.push(circleBar);
      circleHits++;
    } else {
      barPath.push(landmarksToBarPosition(result.landmarks, result.tMs));
    }

    const joints = landmarksToJoints(result.landmarks);
    const frame: PoseFrameData = { tMs: result.tMs, joints };
    poseData.push(frame);

    angleData.push(computeAngles(frame));
  }

  // Compute aggregate confidence from the key joints (not all 33 landmarks)
  const keyIndices = [
    LANDMARK.LEFT_SHOULDER,
    LANDMARK.RIGHT_SHOULDER,
    LANDMARK.LEFT_HIP,
    LANDMARK.RIGHT_HIP,
    LANDMARK.LEFT_KNEE,
    LANDMARK.RIGHT_KNEE,
    LANDMARK.LEFT_ANKLE,
    LANDMARK.RIGHT_ANKLE,
    LANDMARK.LEFT_WRIST,
    LANDMARK.RIGHT_WRIST,
  ];
  const confidences = validResults.flatMap((r) =>
    keyIndices.map((idx) => r.landmarks[idx].visibility)
  );
  const avgConfidence =
    confidences.reduce((a, b) => a + b, 0) / confidences.length;
  const minConfidence = Math.min(...confidences);

  return {
    id: `analysis-${Date.now()}`,
    videoUriOriginal: videoUri,
    videoUriTrimmed: videoUri,
    startMs: 0,
    endMs: durationMs,
    fps: validResults.length / (durationMs / 1000),
    barPath: catmullRomInterpolate(smoothBarPath(barPath)),
    pose: poseData,
    angles: angleData,
    meta: {
      device: "MediaPipe Pose Landmarker + Hough Circle Transform",
      modelVersion: "pose_landmarker_lite-0.10.14",
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      minConfidence: Math.round(minConfidence * 100) / 100,
      barTrackingSource:
        circleHits > 0
          ? `circles:${circleHits}/${validResults.length}`
          : "wrists",
    },
    createdAt: new Date().toISOString(),
  };
}
