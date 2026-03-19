/**
 * Workout Score & Hybrid Score — Normalization Utilities
 *
 * Functions that convert raw performance metrics (kg, pace, reps, etc.)
 * into a 0-1000 normalised score.  All normalizers are pure functions
 * with no side effects.
 */

import {
  EFFORT_MULTIPLIER_MAX,
  EFFORT_MULTIPLIER_MIN,
  NORMALIZATION_REFS,
  SCORE_MAX,
  SCORE_MIN,
} from "./constants";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── Strength Normalization ─────────────────────────────────────────────────

/**
 * Normalise a strength result to 0-1000.
 *
 * Uses a diminishing-returns curve so that:
 * - 0 kg   → 0
 * - ref kg → ~700
 * - 2×ref  → ~900
 *
 * Formula: score = 1000 × (1 − e^(−k × e1rm))
 * where k = −ln(1 − 0.70) / ref  (so that ref maps to 700).
 *
 * @param e1rmKg  Estimated 1-rep max in kilograms.
 * @param ref     Optional custom reference e1RM (defaults to global constant).
 *                Allows per-exercise or per-exercise-family calibration.
 */
export function normalizeStrength(e1rmKg: number, ref?: number): number {
  if (e1rmKg <= 0) return SCORE_MIN;

  const effectiveRef = ref ?? NORMALIZATION_REFS.strengthE1rmKgRef;
  const k = -Math.log(1 - 0.7) / effectiveRef;
  const raw = SCORE_MAX * (1 - Math.exp(-k * e1rmKg));
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
 * Normalise a running/cardio result to 0-1000.
 *
 * Faster pace → higher score.  Uses the inverse of pace so that
 * lower sec/km yields a higher score.
 *
 * - ref pace (e.g. 300 s/km) → ~700
 * - 240 s/km (4:00)          → ~850
 * - 360 s/km (6:00)          → ~550
 *
 * Formula: score = 1000 × (1 − e^(−k × (ref / pace)))
 * where k = −ln(1 − 0.70)  (so that pace = ref maps to 700).
 *
 * @param paceSecPerKm  Pace in seconds per kilometre.
 */
export function normalizeEndurance(paceSecPerKm: number): number {
  if (paceSecPerKm <= 0) return SCORE_MIN;

  const ref = NORMALIZATION_REFS.endurancePaceSecPerKmRef;
  const ratio = ref / paceSecPerKm; // > 1 means faster than ref
  const k = -Math.log(1 - 0.7); // ≈ 1.204
  const raw = SCORE_MAX * (1 - Math.exp(-k * ratio));
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

  // ~10 cal/min = decent effort ≈ 700 score
  const calPerMin = (calories / timeSeconds) * 60;
  const ref = 10; // cal/min reference
  const k = -Math.log(1 - 0.7) / ref;
  const raw = SCORE_MAX * (1 - Math.exp(-k * calPerMin));
  return clamp(Math.round(raw * 10) / 10, SCORE_MIN, SCORE_MAX);
}

// ─── Engine Normalization ───────────────────────────────────────────────────

/**
 * Normalise engine/conditioning output to 0-1000.
 *
 * Engine score is derived from **work-units** performed in conditioning
 * blocks (AMRAP, EMOM, FOR_TIME, TABATA, CHIPPER).  Work-units combine
 * effort-weighted reps with an optional density factor (reps/time).
 *
 * @param workUnits  Σ(reps × effortMultiplier [× densityFactor]) across
 *                   exercises in engine blocks.
 */
export function normalizeEngine(workUnits: number): number {
  if (workUnits <= 0) return SCORE_MIN;

  const ref = NORMALIZATION_REFS.engineWorkUnitsRef;
  const k = -Math.log(1 - 0.7) / ref;
  const raw = SCORE_MAX * (1 - Math.exp(-k * workUnits));
  return clamp(Math.round(raw * 10) / 10, SCORE_MIN, SCORE_MAX);
}

// ─── Effort Multiplier ──────────────────────────────────────────────────────

/**
 * Convert an exercise effort score (1-10) to a **light** multiplier.
 *
 * The multiplier tilts contributions slightly without being a primary
 * scoring driver:
 *   effortScore 1  → 0.8
 *   effortScore 5  → 1.0
 *   effortScore 10 → 1.2
 */
export function effortMultiplier(effortScore: number): number {
  const clamped = clamp(effortScore, 1, 10);
  const range = EFFORT_MULTIPLIER_MAX - EFFORT_MULTIPLIER_MIN;
  return EFFORT_MULTIPLIER_MIN + ((clamped - 1) / 9) * range;
}

// ─── Volume Normalization ───────────────────────────────────────────────────

/**
 * Normalise total volume load to a bonus score (0-maxBonus).
 *
 * Volume load = Σ (reps × weight in kg) across all sets.
 * Returns a bonus between 0 and maxBonus.
 *
 * @param volumeLoadKg  Total volume load in kg.
 * @param maxBonus  Maximum bonus points (default 50).
 */
export function normalizeVolumeBonus(
  volumeLoadKg: number,
  maxBonus: number = 50
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
