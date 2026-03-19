/**
 * Hybrid Score Calculator
 *
 * Computes a user-level Hybrid Score (0-100) that aggregates multiple
 * dimensions of athletic performance across recent workout history.
 *
 * Pillars:
 *   - Strength:  derived from best e1RM values in recent strength results
 *   - Endurance: derived from best paces in recent running/cardio results
 *   - Engine:    derived from best engine scores in recent workout scores
 *
 * The score uses recency-weighted averages so that recent performance
 * counts more, and it degrades gracefully when data is sparse.
 */

import {
  HYBRID_HISTORY_WINDOW_DAYS,
  HYBRID_MIN_WORKOUTS_HIGH,
  HYBRID_MIN_WORKOUTS_MEDIUM,
  HYBRID_PILLAR_WEIGHTS,
  HYBRID_RECENCY_HALF_LIFE_DAYS,
  HYBRID_SCORE_VERSION,
  SCORE_MAX,
  SCORE_MIN,
} from "./constants";
import {
  calculateE1rm,
  clamp,
  normalizeEndurance,
  normalizeStrength,
  recencyWeight,
} from "./normalizers";
import type {
  HybridScoreResult,
  PerformanceHistoryEntry,
  ScoreConfidence,
  WorkoutScoreHistoryEntry,
} from "./types";

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Calculate the Hybrid Score for a user based on their recent workout
 * scores and performance entries.
 *
 * @param workoutScores   Recent WorkoutScoreResults (already computed).
 * @param performanceEntries  Recent UserPerformanceEntries.
 * @param now  Optional reference date (defaults to current time).
 */
export function calculateHybridScore(
  workoutScores: WorkoutScoreHistoryEntry[],
  performanceEntries: PerformanceHistoryEntry[],
  now?: Date
): HybridScoreResult {
  const refDate = now ?? new Date();
  const cutoff = new Date(
    refDate.getTime() - HYBRID_HISTORY_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );

  // ── Filter to history window ───────────────────────────────────────────
  const recentWorkouts = workoutScores.filter((w) => w.performedAt >= cutoff);
  const recentPerformance = performanceEntries.filter(
    (p) => p.performedAt >= cutoff
  );

  // ── Strength pillar ────────────────────────────────────────────────────
  const strengthScore = computeStrengthPillar(recentPerformance, refDate);

  // ── Endurance pillar ───────────────────────────────────────────────────
  const enduranceScore = computeEndurancePillar(recentPerformance, refDate);

  // ── Engine pillar ──────────────────────────────────────────────────────
  const engineScore = computeEnginePillar(recentWorkouts, refDate);

  // ── Total score ────────────────────────────────────────────────────────
  const rawTotal =
    strengthScore * HYBRID_PILLAR_WEIGHTS.strength +
    enduranceScore * HYBRID_PILLAR_WEIGHTS.endurance +
    engineScore * HYBRID_PILLAR_WEIGHTS.engine;

  const totalScore = clamp(
    Math.round(rawTotal * 10) / 10,
    SCORE_MIN,
    SCORE_MAX
  );

  // ── Confidence ─────────────────────────────────────────────────────────
  const dataPoints = recentWorkouts.length + recentPerformance.length;
  const confidence = deriveConfidence(dataPoints);

  return {
    version: HYBRID_SCORE_VERSION,
    totalScore,
    breakdown: {
      strength: strengthScore,
      endurance: enduranceScore,
      engine: engineScore,
    },
    confidence,
    calculatedAt: refDate.toISOString(),
  };
}

// ─── Pillar Computations ────────────────────────────────────────────────────

/**
 * Strength pillar: recency-weighted average of normalised e1RM scores
 * from STRENGTH performance entries.
 */
function computeStrengthPillar(
  entries: PerformanceHistoryEntry[],
  now: Date
): number {
  const strengthEntries = entries.filter(
    (e) =>
      e.type === "STRENGTH" &&
      e.weightKg != null &&
      e.weightKg > 0 &&
      e.reps != null &&
      e.reps > 0
  );

  if (strengthEntries.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const entry of strengthEntries) {
    const wKg = entry.weightKg ?? 0;
    const reps = entry.reps ?? 0;
    const e1rm = calculateE1rm(wKg, reps);
    const norm = normalizeStrength(e1rm);
    const w = recencyWeight(
      entry.performedAt,
      HYBRID_RECENCY_HALF_LIFE_DAYS,
      now
    );
    weightedSum += norm * w;
    totalWeight += w;
  }

  if (totalWeight === 0) return 0;

  const avg = weightedSum / totalWeight;
  return clamp(Math.round(avg * 10) / 10, SCORE_MIN, SCORE_MAX);
}

/**
 * Endurance pillar: recency-weighted average of normalised pace scores
 * from RUN / TRAIL performance entries.
 */
function computeEndurancePillar(
  entries: PerformanceHistoryEntry[],
  now: Date
): number {
  const runEntries = entries.filter(
    (e) =>
      (e.type === "RUN" || e.type === "TRAIL") &&
      e.distanceKm != null &&
      e.distanceKm > 0 &&
      e.timeSeconds != null &&
      e.timeSeconds > 0
  );

  if (runEntries.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const entry of runEntries) {
    const timeSec = entry.timeSeconds ?? 0;
    const distKm = entry.distanceKm ?? 0;
    const paceSecPerKm = timeSec / distKm;
    const norm = normalizeEndurance(paceSecPerKm);
    const w = recencyWeight(
      entry.performedAt,
      HYBRID_RECENCY_HALF_LIFE_DAYS,
      now
    );
    weightedSum += norm * w;
    totalWeight += w;
  }

  if (totalWeight === 0) return 0;

  const avg = weightedSum / totalWeight;
  return clamp(Math.round(avg * 10) / 10, SCORE_MIN, SCORE_MAX);
}

/**
 * Engine pillar: recency-weighted average of engine breakdown scores
 * from recent WorkoutScores.
 */
function computeEnginePillar(
  workoutScores: WorkoutScoreHistoryEntry[],
  now: Date
): number {
  // Only include workouts that actually have engine content
  const withEngine = workoutScores.filter((w) => w.breakdown.engine > 0);

  if (withEngine.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const ws of withEngine) {
    const w = recencyWeight(ws.performedAt, HYBRID_RECENCY_HALF_LIFE_DAYS, now);
    weightedSum += ws.breakdown.engine * w;
    totalWeight += w;
  }

  if (totalWeight === 0) return 0;

  const avg = weightedSum / totalWeight;
  return clamp(Math.round(avg * 10) / 10, SCORE_MIN, SCORE_MAX);
}

// ─── Confidence ─────────────────────────────────────────────────────────────

function deriveConfidence(dataPoints: number): ScoreConfidence {
  if (dataPoints >= HYBRID_MIN_WORKOUTS_HIGH) return "HIGH";
  if (dataPoints >= HYBRID_MIN_WORKOUTS_MEDIUM) return "MEDIUM";
  return "LOW";
}
