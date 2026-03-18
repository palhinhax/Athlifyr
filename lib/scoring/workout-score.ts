/**
 * Workout Score Calculator
 *
 * Computes a product-facing score (0-100) for a single logged workout.
 * The score has three pillars — Strength, Endurance, Engine — plus
 * bonus points for volume and personal records.
 *
 * This module is a pure function layer with no database dependencies.
 * Data should be mapped to the input types before calling `calculateWorkoutScore`.
 */

import {
  BLOCK_TYPE_PILLAR,
  CATEGORY_PILLAR,
  MAX_PR_BONUS,
  MAX_VOLUME_BONUS,
  PR_BONUS_PER_PR,
  SCORE_MAX,
  SCORE_MIN,
  WORKOUT_PILLAR_WEIGHTS,
} from "./constants";
import {
  calculateE1rm,
  clamp,
  effortMultiplier,
  normalizeEndurance,
  normalizeEnduranceByCalories,
  normalizeEngine,
  normalizeStrength,
  normalizeVolumeBonus,
} from "./normalizers";
import type {
  ExerciseResultInput,
  WorkoutLogInput,
  WorkoutScoreResult,
} from "./types";
import { SCORE_VERSION } from "./types";

// ─── Internal Accumulators ──────────────────────────────────────────────────

interface PillarAccumulator {
  /** Sum of normalised scores × weight for this pillar. */
  weightedSum: number;
  /** Sum of weights. */
  totalWeight: number;
}

function emptyAccumulator(): PillarAccumulator {
  return { weightedSum: 0, totalWeight: 0 };
}

function pillarAverage(acc: PillarAccumulator): number {
  if (acc.totalWeight === 0) return 0;
  return acc.weightedSum / acc.totalWeight;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Calculate the Workout Score for a logged workout.
 *
 * @param input  The mapped workout log data.
 * @returns  A `WorkoutScoreResult` with total score, breakdown and highlights.
 */
export function calculateWorkoutScore(
  input: WorkoutLogInput
): WorkoutScoreResult {
  const highlights: string[] = [];
  const strengthAcc = emptyAccumulator();
  const enduranceAcc = emptyAccumulator();
  const engineAcc = emptyAccumulator();
  let totalVolumeLoad = 0;
  let prCount = 0;

  for (const block of input.blockResults) {
    const pillar = BLOCK_TYPE_PILLAR[block.blockType] ?? null;

    // Skip non-scoring blocks
    if (pillar === null) continue;

    for (const ex of block.exerciseResults) {
      const effort = effortMultiplier(ex.effortScore);

      // ── Strength contribution ────────────────────────────────────
      if (pillar === "strength" || isStrengthExercise(ex)) {
        const e1rm = bestE1rmFromResult(ex);
        if (e1rm > 0) {
          const norm = normalizeStrength(e1rm);
          strengthAcc.weightedSum += norm * effort;
          strengthAcc.totalWeight += effort;
        }
      }

      // ── Endurance contribution ───────────────────────────────────
      if (isEnduranceExercise(ex)) {
        const endScore = scoreEnduranceExercise(ex);
        if (endScore > 0) {
          enduranceAcc.weightedSum += endScore * effort;
          enduranceAcc.totalWeight += effort;
        }
      }

      // ── Engine contribution (from engine blocks) ─────────────────
      if (pillar === "engine") {
        const reps = effectiveReps(ex);
        const weighted = reps * effort;
        engineAcc.weightedSum += weighted;
        // For engine we accumulate raw weighted reps, then normalise once
        engineAcc.totalWeight = 1; // sentinel to indicate data present
      }

      // ── Volume load ──────────────────────────────────────────────
      totalVolumeLoad += volumeLoad(ex);

      // ── PR counting ──────────────────────────────────────────────
      prCount += countPRs(ex);
    }
  }

  // ── Normalise engine pillar ────────────────────────────────────────────
  // Engine accumulator holds raw weighted reps; normalise them now.
  const engineRawScore =
    engineAcc.totalWeight > 0 ? normalizeEngine(engineAcc.weightedSum) : 0;

  // ── Pillar averages (0-100) ────────────────────────────────────────────
  const strengthScore = clamp(
    Math.round(pillarAverage(strengthAcc) * 10) / 10,
    SCORE_MIN,
    SCORE_MAX
  );
  const enduranceScore = clamp(
    Math.round(pillarAverage(enduranceAcc) * 10) / 10,
    SCORE_MIN,
    SCORE_MAX
  );
  const engineScore = clamp(
    Math.round(engineRawScore * 10) / 10,
    SCORE_MIN,
    SCORE_MAX
  );

  // ── Bonuses ────────────────────────────────────────────────────────────
  const volumeBonus = normalizeVolumeBonus(totalVolumeLoad, MAX_VOLUME_BONUS);
  const prBonus = clamp(prCount * PR_BONUS_PER_PR, 0, MAX_PR_BONUS);

  // ── Total score ────────────────────────────────────────────────────────
  const pillarTotal =
    strengthScore * WORKOUT_PILLAR_WEIGHTS.strength +
    enduranceScore * WORKOUT_PILLAR_WEIGHTS.endurance +
    engineScore * WORKOUT_PILLAR_WEIGHTS.engine;

  // Pillar total is 0-100 (since each pillar is 0-100 and weights sum to 1).
  // Add bonuses on top, then cap at 100.
  const rawTotal = pillarTotal + volumeBonus + prBonus;
  const totalScore = clamp(
    Math.round(rawTotal * 10) / 10,
    SCORE_MIN,
    SCORE_MAX
  );

  // ── Highlights ─────────────────────────────────────────────────────────
  if (strengthScore >= 70) highlights.push("High strength contribution");
  if (enduranceScore >= 70) highlights.push("Strong endurance performance");
  if (engineScore >= 70) highlights.push("Great engine output");
  if (prBonus > 0) highlights.push(`PR bonus applied (+${prBonus})`);
  if (volumeBonus >= 10) highlights.push("High volume session");
  if (totalScore === 0) highlights.push("No scored exercises recorded");

  return {
    version: SCORE_VERSION,
    totalScore,
    breakdown: {
      strength: strengthScore,
      endurance: enduranceScore,
      engine: engineScore,
      volumeBonus,
      prBonus,
    },
    highlights,
    calculatedAt: new Date().toISOString(),
  };
}

// ─── Private Helpers ────────────────────────────────────────────────────────

function isStrengthExercise(ex: ExerciseResultInput): boolean {
  return ex.hasWeight && CATEGORY_PILLAR[ex.category] === "strength";
}

function isEnduranceExercise(ex: ExerciseResultInput): boolean {
  return (
    ex.hasDistance ||
    ex.hasCalories ||
    (ex.hasTime && CATEGORY_PILLAR[ex.category] === "endurance")
  );
}

/**
 * Best e1RM from either individual sets or the summary result.
 */
function bestE1rmFromResult(ex: ExerciseResultInput): number {
  let best = 0;

  if (ex.sets && ex.sets.length > 0) {
    for (const s of ex.sets) {
      if (s.weightKg > 0 && s.reps > 0) {
        const e1rm = calculateE1rm(s.weightKg, s.reps);
        if (e1rm > best) best = e1rm;
      }
    }
  } else if (
    ex.actualWeightKg != null &&
    ex.actualWeightKg > 0 &&
    ex.actualReps != null &&
    ex.actualReps > 0
  ) {
    best = calculateE1rm(ex.actualWeightKg, ex.actualReps);
  }

  return best;
}

/**
 * Score an endurance exercise from pace or calories.
 */
function scoreEnduranceExercise(ex: ExerciseResultInput): number {
  // Pace-based (distance + time)
  if (
    ex.actualDistanceM != null &&
    ex.actualDistanceM > 0 &&
    ex.actualTimeSeconds != null &&
    ex.actualTimeSeconds > 0
  ) {
    const distKm = ex.actualDistanceM / 1000;
    const paceSecPerKm = ex.actualTimeSeconds / distKm;
    return normalizeEndurance(paceSecPerKm);
  }

  // Calorie-based (calories + time)
  if (
    ex.actualCalories != null &&
    ex.actualCalories > 0 &&
    ex.actualTimeSeconds != null &&
    ex.actualTimeSeconds > 0
  ) {
    return normalizeEnduranceByCalories(
      ex.actualCalories,
      ex.actualTimeSeconds
    );
  }

  return 0;
}

/**
 * Effective reps for engine scoring.  Returns total reps from sets
 * or the summary actualReps, falling back to 0.
 */
function effectiveReps(ex: ExerciseResultInput): number {
  if (ex.sets && ex.sets.length > 0) {
    return ex.sets.reduce((sum, s) => sum + s.reps, 0);
  }
  return ex.actualReps ?? 0;
}

/**
 * Total volume load (reps × weight in kg) for this exercise result.
 */
function volumeLoad(ex: ExerciseResultInput): number {
  let total = 0;
  if (ex.sets && ex.sets.length > 0) {
    for (const s of ex.sets) {
      total += s.reps * s.weightKg;
    }
  } else if (ex.actualReps != null && ex.actualWeightKg != null) {
    total = ex.actualReps * ex.actualWeightKg;
  }
  return total;
}

/**
 * Count the number of PRs in a result (exercise-level + set-level).
 */
function countPRs(ex: ExerciseResultInput): number {
  let count = ex.isPR ? 1 : 0;
  if (ex.sets) {
    count += ex.sets.filter((s) => s.isPR).length;
  }
  return count;
}
