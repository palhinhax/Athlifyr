import type {
  PoseFrame,
  PoseKeypoint,
  PoseMetrics,
  KeypointName,
} from "@/src/types/motion-analysis";

// ── Skeleton edges ───────────────────────────────────────────────────

export type SkeletonEdge = [KeypointName, KeypointName];

/** Edges that define the stickman skeleton */
export const SKELETON_EDGES: SkeletonEdge[] = [
  // Head → shoulders
  ["nose", "left_shoulder"],
  ["nose", "right_shoulder"],
  // Shoulder span
  ["left_shoulder", "right_shoulder"],
  // Left arm
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  // Right arm
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  // Torso
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  // Hip span
  ["left_hip", "right_hip"],
  // Left leg
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  // Right leg
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

/** Face-related keypoint names (drawn smaller / optional) */
export const FACE_KEYPOINTS: Set<KeypointName> = new Set([
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
]);

/** Minimum keypoint score to consider it visible */
export const MIN_KEYPOINT_SCORE = 0.2;

// ── Temporal smoothing ───────────────────────────────────────────────

/**
 * Apply temporal smoothing to a sequence of pose frames.
 *
 * Uses a weighted moving average with a Gaussian-like kernel to reduce
 * jitter while preserving fast movements. Low-confidence keypoints
 * receive heavier smoothing.
 *
 * @param frames  Raw pose frames from the detector
 * @param windowSize  Number of frames on each side to consider (default 2 → 5 frame window)
 * @returns  Smoothed copy of the frames (originals are not mutated)
 */
export function smoothPoseFrames(
  frames: PoseFrame[],
  windowSize: number = 2
): PoseFrame[] {
  if (frames.length <= 2) return frames;

  // Gaussian-ish weights: [1, 2, 3, 2, 1] for windowSize=2
  const makeWeights = (n: number): number[] => {
    const w: number[] = [];
    for (let i = -n; i <= n; i++) {
      w.push(n + 1 - Math.abs(i));
    }
    return w;
  };

  const weights = makeWeights(windowSize);

  return frames.map((frame, fIdx) => {
    const smoothedKeypoints: PoseKeypoint[] = frame.keypoints.map(
      (kp, kpIdx) => {
        // Don't smooth low-confidence keypoints that might be noise
        if (kp.score < MIN_KEYPOINT_SCORE) return kp;

        let sumX = 0;
        let sumY = 0;
        let sumWeight = 0;

        for (let offset = -windowSize; offset <= windowSize; offset++) {
          const nIdx = fIdx + offset;
          if (nIdx < 0 || nIdx >= frames.length) continue;

          const neighbour = frames[nIdx].keypoints[kpIdx];
          if (!neighbour || neighbour.score < MIN_KEYPOINT_SCORE) continue;

          const w = weights[offset + windowSize] * neighbour.score;
          sumX += neighbour.x * w;
          sumY += neighbour.y * w;
          sumWeight += w;
        }

        if (sumWeight === 0) return kp;

        return {
          name: kp.name,
          x: sumX / sumWeight,
          y: sumY / sumWeight,
          score: kp.score,
        };
      }
    );

    return { t: frame.t, keypoints: smoothedKeypoints };
  });
}

// ── Lookup helpers ───────────────────────────────────────────────────

/** Get a keypoint by name from a frame, returns undefined if missing or low score */
export function getKeypoint(
  frame: PoseFrame,
  name: KeypointName
): PoseKeypoint | undefined {
  const kp = frame.keypoints.find((k) => k.name === name);
  if (!kp || kp.score < MIN_KEYPOINT_SCORE) return undefined;
  return kp;
}

// ── Binary search for nearest frame ─────────────────────────────────

/** Find the index of the pose frame closest to a given time */
export function findClosestFrameIndex(
  frames: PoseFrame[],
  timeMs: number
): number {
  if (frames.length === 0) return -1;
  if (frames.length === 1) return 0;

  let lo = 0;
  let hi = frames.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (frames[mid].t === timeMs) return mid;
    if (frames[mid].t < timeMs) lo = mid + 1;
    else hi = mid - 1;
  }

  // lo is now the first frame with t > timeMs
  if (lo >= frames.length) return frames.length - 1;
  if (lo === 0) return 0;

  const dLo = Math.abs(frames[lo].t - timeMs);
  const dHi = Math.abs(frames[lo - 1].t - timeMs);
  return dLo < dHi ? lo : lo - 1;
}

// ── Angle computation ────────────────────────────────────────────────

/** Compute angle at point B given points A-B-C (in degrees) */
function angleDeg(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number
): number {
  const ba = { x: ax - bx, y: ay - by };
  const bc = { x: cx - bx, y: cy - by };
  const dot = ba.x * bc.x + ba.y * bc.y;
  const magBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y);
  const magBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);
  if (magBA === 0 || magBC === 0) return 180;
  const cosAngle = Math.max(-1, Math.min(1, dot / (magBA * magBC)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/** Angle between a vector and vertical (0 = upright) */
function angleFromVertical(dx: number, dy: number): number {
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return 0;
  // vertical is (0, -1) in screen coords (up)
  const dot = -dy; // dot with (0,-1)
  const cosAngle = Math.max(-1, Math.min(1, dot / mag));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

// ── Metrics ──────────────────────────────────────────────────────────

export function computePoseMetrics(frames: PoseFrame[]): PoseMetrics {
  if (frames.length === 0) {
    return {
      durationMs: 0,
      avgConfidence: 0,
      maxKneeFlexion: null,
      torsoAngleRange: null,
    };
  }

  const durationMs =
    frames.length > 1 ? frames[frames.length - 1].t - frames[0].t : 0;

  // Average confidence
  let totalScore = 0;
  let totalKps = 0;
  for (const frame of frames) {
    for (const kp of frame.keypoints) {
      if (kp.score > 0) {
        totalScore += kp.score;
        totalKps++;
      }
    }
  }
  const avgConfidence = totalKps > 0 ? totalScore / totalKps : 0;

  // Knee flexion (minimum angle = maximum flexion)
  let minKneeAngle: number | null = null;
  for (const frame of frames) {
    for (const side of ["left", "right"] as const) {
      const hip = getKeypoint(frame, `${side}_hip`);
      const knee = getKeypoint(frame, `${side}_knee`);
      const ankle = getKeypoint(frame, `${side}_ankle`);
      if (hip && knee && ankle) {
        const angle = angleDeg(hip.x, hip.y, knee.x, knee.y, ankle.x, ankle.y);
        if (minKneeAngle === null || angle < minKneeAngle) {
          minKneeAngle = angle;
        }
      }
    }
  }

  // Torso angle range
  let minTorso: number | null = null;
  let maxTorso: number | null = null;
  for (const frame of frames) {
    const ls = getKeypoint(frame, "left_shoulder");
    const rs = getKeypoint(frame, "right_shoulder");
    const lh = getKeypoint(frame, "left_hip");
    const rh = getKeypoint(frame, "right_hip");
    if (ls && rs && lh && rh) {
      const shoulderMidX = (ls.x + rs.x) / 2;
      const shoulderMidY = (ls.y + rs.y) / 2;
      const hipMidX = (lh.x + rh.x) / 2;
      const hipMidY = (lh.y + rh.y) / 2;
      const dx = shoulderMidX - hipMidX;
      const dy = shoulderMidY - hipMidY;
      const angle = angleFromVertical(dx, dy);
      if (minTorso === null || angle < minTorso) minTorso = angle;
      if (maxTorso === null || angle > maxTorso) maxTorso = angle;
    }
  }

  return {
    durationMs: Math.round(durationMs),
    avgConfidence: Math.round(avgConfidence * 1000) / 1000,
    maxKneeFlexion:
      minKneeAngle !== null ? Math.round(minKneeAngle * 10) / 10 : null,
    torsoAngleRange:
      minTorso !== null && maxTorso !== null
        ? [Math.round(minTorso * 10) / 10, Math.round(maxTorso * 10) / 10]
        : null,
  };
}

// ── Bounding box for replay centering ────────────────────────────────

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Compute bounding box of visible keypoints in a frame */
export function getFrameBoundingBox(frame: PoseFrame): BoundingBox | null {
  const visible = frame.keypoints.filter((k) => k.score >= MIN_KEYPOINT_SCORE);
  if (visible.length === 0) return null;

  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  for (const kp of visible) {
    if (kp.x < minX) minX = kp.x;
    if (kp.y < minY) minY = kp.y;
    if (kp.x > maxX) maxX = kp.x;
    if (kp.y > maxY) maxY = kp.y;
  }

  return { minX, minY, maxX, maxY };
}
