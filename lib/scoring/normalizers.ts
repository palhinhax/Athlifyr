/**
 * Workout Score & Hybrid Score — Normalization Utilities
 *
 * Functions that convert raw performance metrics (kg, pace, reps, etc.)
 * into a 0-100 normalised score.  All normalizers are pure functions
 * with no side effects.
 */

import { NORMALIZATION_REFS, SCORE_MAX, SCORE_MIN } from "./constants";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── Strength Normalization ─────────────────────────────────────────────────

/**
 * Normalise a strength result to 0-100.
 *
 * Uses a diminishing-returns curve so that:
 * - 0 kg   → 0
 * - ref kg → ~70
 * - 2×ref  → ~90
 *
 * Formula: score = 100 × (1 − e^(−k × e1rm))
 * where k = −ln(1 − 0.70) / ref  (so that ref maps to 70).
 *
 * @param e1rmKg Estimated 1-rep max in kilograms.
 */
export function normalizeStrength(e1rmKg: number): number {
  if (e1rmKg <= 0) return SCORE_MIN;

  const ref = NORMALIZATION_REFS.strengthE1rmKgRef;
  const k = -Math.log(1 - 0.7) / ref; // ≈ 1.204 / ref
  const raw = 100 * (1 - Math.exp(-k * e1rmKg));
  return clamp(Math.round(raw * 10) / 10, SCORE_MIN, SCORE_MAX);
}

/**
 * Calculate e1RM using the Epley formula.
 * Re-exported from lib/performance/scoring for convenience.
 *
 * e1rm = weight × (1 + reps / 30)
 */
export function calculateE1rm(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

// ─── Endurance Normalization ────────────────────────────────────────────────

/**
 * Normalise a running/cardio result to 0-100.
 *
 * Faster pace → higher score.  Uses the inverse of pace so that
 * lower sec/km yields a higher score.
 *
 * - ref pace (e.g. 300 s/km) → ~70
 * - 240 s/km (4:00)          → ~85
 * - 360 s/km (6:00)          → ~55
 *
 * Formula: score = 100 × (1 − e^(−k × (ref / pace)))
 * where k = −ln(1 − 0.70)  (so that pace = ref maps to 70).
 *
 * @param paceSecPerKm  Pace in seconds per kilometre.
 */
export function normalizeEndurance(paceSecPerKm: number): number {
  if (paceSecPerKm <= 0) return SCORE_MIN;

  const ref = NORMALIZATION_REFS.endurancePaceSecPerKmRef;
  const ratio = ref / paceSecPerKm; // > 1 means faster than ref
  const k = -Math.log(1 - 0.7); // ≈ 1.204
  const raw = 100 * (1 - Math.exp(-k * ratio));
  return clamp(Math.round(raw * 10) / 10, SCORE_MIN, SCORE_MAX);
}

/**
 * Normalise a time-based endurance exercise (e.g. rowing, assault bike)
 * using calories-per-minute as intensity proxy.
 *
 * @param calories  Total calories burned.
 * @param timeSeconds  Duration in seconds.
 */
export function normalizeEnduranceByCalories(
  calories: number,
  timeSeconds: number
): number {
  if (calories <= 0 || timeSeconds <= 0) return SCORE_MIN;

  // ~10 cal/min = decent effort ≈ 70 score
  const calPerMin = (calories / timeSeconds) * 60;
  const ref = 10; // cal/min reference
  const k = -Math.log(1 - 0.7) / ref;
  const raw = 100 * (1 - Math.exp(-k * calPerMin));
  return clamp(Math.round(raw * 10) / 10, SCORE_MIN, SCORE_MAX);
}

// ─── Engine Normalization ───────────────────────────────────────────────────

/**
 * Normalise engine/conditioning output to 0-100.
 *
 * Engine score is derived from total work (weighted reps) performed
 * in conditioning blocks (AMRAP, EMOM, FOR_TIME, TABATA, CHIPPER).
 *
 * @param weightedReps  Sum of (reps × effort multiplier) across all exercises
 *                      in engine blocks.
 */
export function normalizeEngine(weightedReps: number): number {
  if (weightedReps <= 0) return SCORE_MIN;

  const ref = NORMALIZATION_REFS.engineTotalRepsRef;
  const k = -Math.log(1 - 0.7) / ref;
  const raw = 100 * (1 - Math.exp(-k * weightedReps));
  return clamp(Math.round(raw * 10) / 10, SCORE_MIN, SCORE_MAX);
}

// ─── Effort Multiplier ──────────────────────────────────────────────────────

/**
 * Convert an exercise effort score (1-10) to a multiplier (0-2).
 * A higher effort score means the exercise is more demanding and
 * its reps/weight contribute more to the overall score.
 *
 * Linear mapping: effortScore 1 → 0.2,  5 → 1.0,  10 → 2.0
 */
export function effortMultiplier(effortScore: number): number {
  const clamped = clamp(effortScore, 1, 10);
  return 0.2 + ((clamped - 1) / 9) * 1.8;
}

// ─── Volume Normalization ───────────────────────────────────────────────────

/**
 * Normalise total volume load to a bonus score (0-20).
 *
 * Volume load = Σ (reps × weight in kg) across all sets.
 * Returns a bonus between 0 and MAX_VOLUME_BONUS.
 *
 * @param volumeLoadKg  Total volume load in kg.
 * @param maxBonus  Maximum bonus points (default 20).
 */
export function normalizeVolumeBonus(
  volumeLoadKg: number,
  maxBonus: number = 20
): number {
  if (volumeLoadKg <= 0) return 0;

  const ref = NORMALIZATION_REFS.volumeLoadRef;
  const ratio = volumeLoadKg / ref;
  // Diminishing returns: bonus = maxBonus × (1 - e^(-1.2 × ratio))
  const raw = maxBonus * (1 - Math.exp(-1.2 * ratio));
  return clamp(Math.round(raw * 10) / 10, 0, maxBonus);
}

// ─── Recency Weight ─────────────────────────────────────────────────────────

/**
 * Compute a recency weight (0-1) for a historical entry based on
 * exponential decay with a configurable half-life.
 *
 * @param performedAt  Date the workout was performed.
 * @param halfLifeDays  Number of days for the weight to halve.
 * @param now  Optional reference date (defaults to Date.now()).
 */
export function recencyWeight(
  performedAt: Date,
  halfLifeDays: number,
  now?: Date
): number {
  const refTime = now ? now.getTime() : Date.now();
  const daysAgo = Math.max(
    0,
    (refTime - performedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.exp((-daysAgo * Math.LN2) / halfLifeDays);
}
