/**
 * MockAnalysis – Generates realistic simulated analysis data for demonstration.
 *
 * Since native modules (OpenCV + MediaPipe) require an EAS dev build,
 * this module provides mock bar path, skeleton, and angle data that
 * visualizes a typical squat movement pattern on any video.
 */

import type {
  BarPositionSample,
  PoseFrameData,
  FrameAngles,
  JointPosition,
  LiftAnalysisResult,
} from "@/src/types/lift-analysis";

const DEFAULT_FPS = 30;
const DEFAULT_DURATION_MS = 4000; // fallback if no duration provided

/**
 * Viewport dimensions for the overlay.
 * All coordinates are normalized 0–1 and scaled at render time.
 */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Generate a realistic barbell path for a squat.
 * The bar starts at shoulder height, descends (with slight forward shift),
 * and returns to the starting position.
 */
export function generateMockBarPath(
  durationMs: number = DEFAULT_DURATION_MS,
  fps: number = DEFAULT_FPS
): BarPositionSample[] {
  const frameCount = Math.round((durationMs / 1000) * fps);
  const samples: BarPositionSample[] = [];
  const startX = 0.5;
  const startY = 0.28;
  const bottomY = 0.52;
  const forwardShift = 0.04;

  for (let i = 0; i < frameCount; i++) {
    const t = i / (frameCount - 1);
    const tMs = Math.round((i / fps) * 1000);

    let phase: number;
    let x: number;
    let y: number;

    if (t < 0.1) {
      // Standing still at top
      phase = 0;
      x = startX;
      y = startY;
    } else if (t < 0.45) {
      // Descending
      phase = easeInOut((t - 0.1) / 0.35);
      x = lerp(startX, startX + forwardShift, phase);
      y = lerp(startY, bottomY, phase);
    } else if (t < 0.55) {
      // Pause at bottom
      phase = 1;
      x = startX + forwardShift;
      y = bottomY;
    } else if (t < 0.9) {
      // Ascending
      phase = 1 - easeInOut((t - 0.55) / 0.35);
      x = lerp(startX, startX + forwardShift, phase);
      y = lerp(startY, bottomY, phase);
    } else {
      // Standing still at top
      x = startX;
      y = startY;
    }

    // Add slight natural wobble
    x += Math.sin(i * 0.8) * 0.003;
    y += Math.cos(i * 1.1) * 0.002;

    samples.push({ tMs, x, y });
  }

  return samples;
}

function makeJoint(
  x: number,
  y: number,
  confidence: number = 0.92
): JointPosition {
  return { x, y, confidence };
}

/**
 * Generate mock skeleton pose data simulating a squat movement.
 * Joints: ankle, knee, hip, shoulder (lateral view).
 */
export function generateMockPoseData(
  durationMs: number = DEFAULT_DURATION_MS,
  fps: number = DEFAULT_FPS
): PoseFrameData[] {
  const frameCount = Math.round((durationMs / 1000) * fps);
  const frames: PoseFrameData[] = [];

  // Standing positions (normalized 0–1)
  const standAnkle = { x: 0.48, y: 0.88 };
  const standKnee = { x: 0.48, y: 0.68 };
  const standHip = { x: 0.5, y: 0.45 };
  const standShoulder = { x: 0.5, y: 0.25 };

  // Bottom squat positions
  const squatAnkle = { x: 0.44, y: 0.88 };
  const squatKnee = { x: 0.38, y: 0.72 };
  const squatHip = { x: 0.46, y: 0.62 };
  const squatShoulder = { x: 0.52, y: 0.42 };

  for (let i = 0; i < frameCount; i++) {
    const t = i / (frameCount - 1);
    const tMs = Math.round((i / fps) * 1000);

    let phase: number;

    if (t < 0.1) {
      phase = 0;
    } else if (t < 0.45) {
      phase = easeInOut((t - 0.1) / 0.35);
    } else if (t < 0.55) {
      phase = 1;
    } else if (t < 0.9) {
      phase = 1 - easeInOut((t - 0.55) / 0.35);
    } else {
      phase = 0;
    }

    const wobbleX = Math.sin(i * 0.7) * 0.002;
    const wobbleY = Math.cos(i * 0.9) * 0.002;

    frames.push({
      tMs,
      joints: {
        ankle: makeJoint(
          lerp(standAnkle.x, squatAnkle.x, phase) + wobbleX,
          lerp(standAnkle.y, squatAnkle.y, phase) + wobbleY,
          0.95
        ),
        knee: makeJoint(
          lerp(standKnee.x, squatKnee.x, phase) + wobbleX,
          lerp(standKnee.y, squatKnee.y, phase) + wobbleY,
          0.93
        ),
        hip: makeJoint(
          lerp(standHip.x, squatHip.x, phase) + wobbleX,
          lerp(standHip.y, squatHip.y, phase) + wobbleY,
          0.91
        ),
        shoulder: makeJoint(
          lerp(standShoulder.x, squatShoulder.x, phase) + wobbleX,
          lerp(standShoulder.y, squatShoulder.y, phase) + wobbleY,
          0.9
        ),
      },
    });
  }

  return frames;
}

/**
 * Compute angle (in degrees) between three 2D points.
 */
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

/**
 * Generate angle data from pose data.
 */
export function generateMockAngles(poseData: PoseFrameData[]): FrameAngles[] {
  return poseData.map((frame) => ({
    tMs: frame.tMs,
    kneeDeg: Math.round(
      angleBetween(frame.joints.ankle, frame.joints.knee, frame.joints.hip)
    ),
    hipDeg: Math.round(
      angleBetween(frame.joints.knee, frame.joints.hip, frame.joints.shoulder)
    ),
  }));
}

/**
 * Generate a complete mock analysis result.
 */
export function generateMockAnalysis(
  videoUri: string,
  videoDurationMs?: number
): LiftAnalysisResult {
  const durationMs = videoDurationMs ?? DEFAULT_DURATION_MS;
  const fps = DEFAULT_FPS;
  const barPath = generateMockBarPath(durationMs, fps);
  const pose = generateMockPoseData(durationMs, fps);
  const angles = generateMockAngles(pose);

  return {
    id: `mock-${Date.now()}`,
    videoUriOriginal: videoUri,
    videoUriTrimmed: videoUri,
    startMs: 0,
    endMs: durationMs,
    fps,
    barPath,
    pose,
    angles,
    meta: {
      device: "Mock Simulator",
      modelVersion: "mock-1.0",
      avgConfidence: 0.92,
      minConfidence: 0.85,
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get the frame index closest to a given timestamp.
 * @deprecated Import from '@/src/modules/analysis-utils' instead.
 */
export { getFrameAtTime } from "@/src/modules/analysis-utils";
