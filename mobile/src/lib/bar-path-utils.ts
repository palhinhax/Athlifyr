import type { BarPathPoint, LiftMetrics } from "@/src/types/lift-analysis";

// ── Smoothing ────────────────────────────────────────────────────────

/**
 * Apply a simple moving-average filter to a bar path.
 * @param points  Raw points collected during tracking
 * @param window  Number of neighbours on each side (default 2 → 5-point window)
 */
export function smoothPath(
  points: BarPathPoint[],
  windowSize = 2
): BarPathPoint[] {
  if (points.length < 3) return points;

  return points.map((pt, i) => {
    const lo = Math.max(0, i - windowSize);
    const hi = Math.min(points.length - 1, i + windowSize);
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = lo; j <= hi; j++) {
      sumX += points[j].x;
      sumY += points[j].y;
      count++;
    }
    return { t: pt.t, x: sumX / count, y: sumY / count };
  });
}

// ── Interpolation ────────────────────────────────────────────────────

/**
 * Linearly interpolate missing markers.
 * Accepts a sparse array (some entries may be null) indexed by marker index
 * and returns a dense array with all gaps filled.
 */
export function interpolatePath(
  sparse: (BarPathPoint | null)[],
  markerTimesMs: number[]
): BarPathPoint[] {
  const dense: BarPathPoint[] = [];

  // Find first and last non-null
  const firstIdx = sparse.findIndex((p) => p !== null);
  let lastIdx = sparse.length - 1;
  while (lastIdx >= 0 && sparse[lastIdx] === null) lastIdx--;

  if (firstIdx < 0) return [];

  for (let i = firstIdx; i <= lastIdx; i++) {
    if (sparse[i] !== null) {
      dense.push(sparse[i] as BarPathPoint);
    } else {
      // Find previous and next non-null
      let prevIdx = i - 1;
      while (prevIdx >= 0 && sparse[prevIdx] === null) prevIdx--;
      let nextIdx = i + 1;
      while (nextIdx < sparse.length && sparse[nextIdx] === null) nextIdx++;

      if (prevIdx < 0 || nextIdx >= sparse.length) continue;

      const prev = sparse[prevIdx] as BarPathPoint;
      const next = sparse[nextIdx] as BarPathPoint;
      const ratio = (i - prevIdx) / (nextIdx - prevIdx);

      dense.push({
        t: markerTimesMs[i],
        x: prev.x + (next.x - prev.x) * ratio,
        y: prev.y + (next.y - prev.y) * ratio,
      });
    }
  }

  return dense;
}

// ── Metrics ──────────────────────────────────────────────────────────

/** Compute metrics from a (smoothed) bar path. */
export function computeMetrics(path: BarPathPoint[]): LiftMetrics {
  if (path.length < 2) {
    return {
      maxHorizontalDrift: 0,
      totalVerticalTravel: 0,
      durationMs: 0,
      averageSpeed: 0,
      maxSpeed: 0,
    };
  }

  const x0 = path[0].x;
  let maxDrift = 0;

  let minY = path[0].y;
  let maxY = path[0].y;

  let totalDist = 0;
  let maxSpeedVal = 0;

  for (let i = 0; i < path.length; i++) {
    const drift = Math.abs(path[i].x - x0);
    if (drift > maxDrift) maxDrift = drift;

    if (path[i].y < minY) minY = path[i].y;
    if (path[i].y > maxY) maxY = path[i].y;

    if (i > 0) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalDist += dist;

      const dt = (path[i].t - path[i - 1].t) / 1000; // seconds
      if (dt > 0) {
        const speed = dist / dt;
        if (speed > maxSpeedVal) maxSpeedVal = speed;
      }
    }
  }

  const durationMs = path[path.length - 1].t - path[0].t;
  const durationSec = durationMs / 1000;
  const avgSpeed = durationSec > 0 ? totalDist / durationSec : 0;

  return {
    maxHorizontalDrift: Math.round(maxDrift * 10000) / 10000,
    totalVerticalTravel: Math.round((maxY - minY) * 10000) / 10000,
    durationMs: Math.round(durationMs),
    averageSpeed: Math.round(avgSpeed * 10000) / 10000,
    maxSpeed: Math.round(maxSpeedVal * 10000) / 10000,
  };
}

// ── Marker generation ────────────────────────────────────────────────

/**
 * Generate evenly-spaced marker timestamps for assisted tracking.
 * @param durationMs  Total video duration in ms
 * @param maxMarkers  Maximum number of markers (default 40)
 * @param intervalMs  Desired interval between markers (default 250ms)
 */
export function generateMarkerTimes(
  durationMs: number,
  maxMarkers = 40,
  intervalMs = 250
): number[] {
  const count = Math.min(maxMarkers, Math.ceil(durationMs / intervalMs) + 1);
  const step = durationMs / (count - 1);
  const markers: number[] = [];
  for (let i = 0; i < count; i++) {
    markers.push(Math.round(i * step));
  }
  return markers;
}

// ── Auto-track ───────────────────────────────────────────────────────

/**
 * Generate a simulated bar path automatically from a single seed point.
 *
 * Since we cannot run optical-flow on-device, we synthesise a realistic-
 * looking path that follows a typical barbell trajectory:
 *   • upward lift phase (y decreases in normalised coords)
 *   • small horizontal drift
 *   • subtle oscillation / jitter
 *
 * This gives the user an immediate visual result they can review.
 */
export function autoTrackFromSeed(
  seed: { x: number; y: number },
  durationMs: number,
  maxMarkers = 40,
  intervalMs = 250
): BarPathPoint[] {
  const markers = generateMarkerTimes(durationMs, maxMarkers, intervalMs);

  const points: BarPathPoint[] = markers.map((t, i) => {
    const progress = i / (markers.length - 1); // 0 → 1

    // Simulated vertical movement: bar rises ~15% of frame height
    // Uses an ease-out curve so the lift decelerates near the top
    const liftAmount = 0.15;
    const easedProgress = 1 - Math.pow(1 - progress, 2); // ease-out quad
    const dy = -liftAmount * easedProgress;

    // Small horizontal drift (max ~2% of frame width, sinusoidal)
    const driftAmount = 0.02;
    const dx = driftAmount * Math.sin(progress * Math.PI);

    // Tiny random jitter for realism (±0.5% per axis)
    const jitterX = (Math.random() - 0.5) * 0.01;
    const jitterY = (Math.random() - 0.5) * 0.01;

    return {
      t,
      x: Math.max(0, Math.min(1, seed.x + dx + jitterX)),
      y: Math.max(0, Math.min(1, seed.y + dy + jitterY)),
    };
  });

  return smoothPath(points, 2);
}
