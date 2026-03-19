/**
 * Workout Score Calculator
 *
 * Computes a product-facing score (0-1000) for a single logged workout.
 * The score has three pillars — Strength, Endurance, Engine — plus
 * bonus points for volume and personal records.
 *
 * Pillar determination is **metric-driven**:
 *   - Exercises with weight data → strength
 *   - Exercises with distance/calorie data → endurance
 *   - Exercises with reps in engine-type blocks → engine
 *
 * Block type is a default hint (not final truth) used to identify
 * engine/conditioning blocks and to skip non-scoring blocks.
 *
 * This module is a pure function layer with no database dependencies.
 * Data should be mapped to the input types before calling `calculateWorkoutScore`.
 */

import {
  BLOCK_TYPE_PILLAR,
  ENGINE_DENSITY_REF_MINUTES,
  ENGINE_MAX_DENSITY_FACTOR,
  ENGINE_MIN_DENSITY_DURATION_SEC,
  MAX_E1RM_KG_CAP,
  MAX_ENGINE_REPS_PER_EXERCISE,
  MAX_ENGINE_WORK_UNITS_PER_BLOCK,
  MAX_PR_BONUS,
  MAX_VOLUME_BONUS,
  PR_BONUS_PER_PR,
  SCORE_MAX,
  SCORE_MIN,
  WORKOUT_PILLAR_WEIGHTS,
  WORKOUT_SCORE_VERSION,
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

// ─── Block-level helpers ────────────────────────────────────────────────────

interface BlockAccumulationResult {
  blockEngineWorkUnits: number;
  volumeLoad: number;
  prCount: number;
}

function accumulateExercise(
  ex: ExerciseResultInput,
  isEngineBlock: boolean,
  strengthAcc: PillarAccumulator,
  enduranceAcc: PillarAccumulator
): BlockAccumulationResult {
  const effort = effortMultiplier(ex.effortScore);

  if (hasStrengthData(ex)) {
    const e1rm = bestE1rmFromResult(ex);
    if (e1rm > 0) {
      const norm = normalizeStrength(e1rm);
      strengthAcc.weightedSum += norm * effort;
      strengthAcc.totalWeight += effort;
    }
  }

  if (hasEnduranceData(ex)) {
    const endScore = scoreEnduranceExercise(ex);
    if (endScore > 0) {
      enduranceAcc.weightedSum += endScore * effort;
      enduranceAcc.totalWeight += effort;
    }
  }

  let blockEngineWorkUnits = 0;
  if (isEngineBlock) {
    const reps = effectiveReps(ex);
    blockEngineWorkUnits =
      Math.min(reps, MAX_ENGINE_REPS_PER_EXERCISE) * effort;
  }

  return {
    blockEngineWorkUnits,
    volumeLoad: volumeLoad(ex),
    prCount: countPRs(ex),
  };
}

function applyEngineDensity(
  workUnits: number,
  blockTime: number | null
): number {
  if (
    blockTime != null &&
    blockTime > 0 &&
    blockTime >= ENGINE_MIN_DENSITY_DURATION_SEC
  ) {
    const minutes = blockTime / 60;
    const density = ENGINE_DENSITY_REF_MINUTES / Math.max(minutes, 1);
    return workUnits * Math.min(density, ENGINE_MAX_DENSITY_FACTOR);
  }
  return workUnits;
}

function buildHighlights(
  strengthScore: number,
  enduranceScore: number,
  engineScore: number,
  volumeBonus: number,
  prBonus: number,
  totalScore: number
): string[] {
  const highlights: string[] = [];
  if (strengthScore >= 700) highlights.push("High strength contribution");
  if (enduranceScore >= 700) highlights.push("Strong endurance performance");
  if (engineScore >= 700) highlights.push("Great engine output");
  if (prBonus > 0) highlights.push(`PR bonus applied (+${prBonus})`);
  if (volumeBonus >= 25) highlights.push("High volume session");
  if (totalScore === 0) highlights.push("No scored exercises recorded");
  return highlights;
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
  const strengthAcc = emptyAccumulator();
  const enduranceAcc = emptyAccumulator();
  let engineWorkUnits = 0;
  let hasEngineData = false;
  let totalVolumeLoad = 0;
  let prCount = 0;

  for (const block of input.blockResults) {
    const blockHint = BLOCK_TYPE_PILLAR[block.blockType] ?? null;
    if (blockHint === null) continue;

    const isEngineBlock = blockHint === "engine";
    let blockEngineWorkUnits = 0;

    for (const ex of block.exerciseResults) {
      const result = accumulateExercise(
        ex,
        isEngineBlock,
        strengthAcc,
        enduranceAcc
      );
      blockEngineWorkUnits += result.blockEngineWorkUnits;
      totalVolumeLoad += result.volumeLoad;
      prCount += result.prCount;
    }

    if (isEngineBlock && blockEngineWorkUnits > 0) {
      const blockTime = block.completedTime ?? block.timeCap ?? null;
      const adjustedUnits = applyEngineDensity(blockEngineWorkUnits, blockTime);
      engineWorkUnits += Math.min(
        adjustedUnits,
        MAX_ENGINE_WORK_UNITS_PER_BLOCK
      );
      hasEngineData = true;
    }
  }

  const engineRawScore = hasEngineData ? normalizeEngine(engineWorkUnits) : 0;

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

  const volumeBonus = normalizeVolumeBonus(totalVolumeLoad, MAX_VOLUME_BONUS);
  const prBonus = clamp(prCount * PR_BONUS_PER_PR, 0, MAX_PR_BONUS);

  const pillarTotal =
    strengthScore * WORKOUT_PILLAR_WEIGHTS.strength +
    enduranceScore * WORKOUT_PILLAR_WEIGHTS.endurance +
    engineScore * WORKOUT_PILLAR_WEIGHTS.engine;

  const totalScore = clamp(
    Math.round((pillarTotal + volumeBonus + prBonus) * 10) / 10,
    SCORE_MIN,
    SCORE_MAX
  );

  const highlights = buildHighlights(
    strengthScore,
    enduranceScore,
    engineScore,
    volumeBonus,
    prBonus,
    totalScore
  );

  return {
    version: WORKOUT_SCORE_VERSION,
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

/**
 * Does this exercise have strength-relevant data (weight)?
 * Metric-driven — no category mapping.
 */
function hasStrengthData(ex: ExerciseResultInput): boolean {
  return ex.hasWeight;
}

/**
 * Does this exercise have endurance-relevant data (distance or calories)?
 * Metric-driven — no category mapping.
 */
function hasEnduranceData(ex: ExerciseResultInput): boolean {
  return ex.hasDistance || ex.hasCalories;
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

  // Cap at MAX_E1RM_KG_CAP to protect against data-entry errors
  return Math.min(best, MAX_E1RM_KG_CAP);
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
