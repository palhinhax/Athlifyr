/**
 * Workout Score & Hybrid Score — Service Layer
 *
 * Connects the pure scoring functions to the database via Prisma.
 * Responsible for:
 *   - Fetching workout log data with the right includes
 *   - Mapping Prisma models to scoring input types
 *   - Calculating scores
 *   - Persisting results to WorkoutScore / UserHybridScore tables
 */

import { prisma } from "@/lib/prisma";
import type {
  WeightUnit,
  DistanceUnit,
  ExerciseCategory,
  WorkoutBlockType,
} from "@prisma/client";
import { calculateWorkoutScore } from "./workout-score";
import { calculateHybridScore } from "./hybrid-score";
import { HYBRID_HISTORY_WINDOW_DAYS, WORKOUT_SCORE_VERSION } from "./constants";
import type {
  BlockResultInput,
  ExerciseResultInput,
  ExerciseSetInput,
  PerformanceHistoryEntry,
  WorkoutLogInput,
  WorkoutScoreHistoryEntry,
  WorkoutScoreResult,
  HybridScoreResult,
} from "./types";

// ─── Unit Conversion ────────────────────────────────────────────────────────

function convertWeightToKg(weight: number, unit: WeightUnit): number {
  if (unit === "KG") return weight;
  return weight / 2.20462; // LB → KG
}

function convertDistanceToM(distance: number, unit: DistanceUnit): number {
  switch (unit) {
    case "M":
      return distance;
    case "KM":
      return distance * 1000;
    case "MI":
      return distance * 1609.344;
    case "FT":
      return distance * 0.3048;
    default:
      return distance;
  }
}

// ─── Explicit types for the DB-fetched workout log ──────────────────────────

interface FetchedExercise {
  id: string;
  category: ExerciseCategory;
  effortScore: number;
  hasReps: boolean;
  hasWeight: boolean;
  hasDistance: boolean;
  hasTime: boolean;
  hasCalories: boolean;
}

interface FetchedSet {
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
  isPR: boolean;
}

interface FetchedExerciseResult {
  actualReps: number | null;
  actualWeight: number | null;
  actualWeightUnit: WeightUnit | null;
  actualDistance: number | null;
  actualDistanceUnit: DistanceUnit | null;
  actualTime: number | null;
  actualCalories: number | null;
  isPR: boolean;
  exercise: FetchedExercise;
  sets: FetchedSet[];
}

interface FetchedBlockResult {
  completedRounds: number | null;
  completedTime: number | null;
  block: { type: WorkoutBlockType; timeCap: number | null };
  exerciseResults: FetchedExerciseResult[];
}

interface FetchedLog {
  id: string;
  userId: string;
  perceivedEffort: number | null;
  feeling: number | null;
  blockResults: FetchedBlockResult[];
}

// ─── Mapping: Prisma → Score Input ──────────────────────────────────────────

function mapSetToInput(set: FetchedSet): ExerciseSetInput {
  return {
    reps: set.reps,
    weightKg: convertWeightToKg(set.weight, set.weightUnit),
    isPR: set.isPR,
  };
}

function mapExerciseResultToInput(
  er: FetchedExerciseResult
): ExerciseResultInput {
  const ex = er.exercise;
  return {
    exerciseId: ex.id,
    category: ex.category,
    effortScore: ex.effortScore,
    hasReps: ex.hasReps,
    hasWeight: ex.hasWeight,
    hasDistance: ex.hasDistance,
    hasTime: ex.hasTime,
    hasCalories: ex.hasCalories,
    actualReps: er.actualReps,
    actualWeightKg:
      er.actualWeight != null && er.actualWeightUnit != null
        ? convertWeightToKg(er.actualWeight, er.actualWeightUnit)
        : null,
    actualDistanceM:
      er.actualDistance != null && er.actualDistanceUnit != null
        ? convertDistanceToM(er.actualDistance, er.actualDistanceUnit)
        : null,
    actualTimeSeconds: er.actualTime,
    actualCalories: er.actualCalories,
    isPR: er.isPR,
    sets: er.sets.map(mapSetToInput),
  };
}

function mapBlockResultToInput(br: FetchedBlockResult): BlockResultInput {
  return {
    blockType: br.block.type,
    completedRounds: br.completedRounds,
    completedTime: br.completedTime,
    timeCap: br.block.timeCap,
    exerciseResults: br.exerciseResults.map(mapExerciseResultToInput),
  };
}

function mapLogToScoringInput(log: FetchedLog): WorkoutLogInput {
  return {
    perceivedEffort: log.perceivedEffort,
    feeling: log.feeling,
    blockResults: log.blockResults.map(mapBlockResultToInput),
  };
}

// ─── Compute & Persist: Workout Score ───────────────────────────────────────

/**
 * Fetch a workout log, compute its score, and persist to the database.
 *
 * @param workoutLogId  The workout log to score.
 * @param userId  The user who owns the log (for data integrity).
 * @returns The computed WorkoutScoreResult, or null if the log was not found.
 */
export async function computeAndPersistWorkoutScore(
  workoutLogId: string,
  userId: string
): Promise<WorkoutScoreResult | null> {
  const log = await prisma.workoutLog.findUnique({
    where: { id: workoutLogId, userId },
    include: {
      blockResults: {
        include: {
          block: {
            select: { type: true, timeCap: true },
          },
          exerciseResults: {
            include: {
              exercise: {
                select: {
                  id: true,
                  category: true,
                  effortScore: true,
                  hasReps: true,
                  hasWeight: true,
                  hasDistance: true,
                  hasTime: true,
                  hasCalories: true,
                },
              },
              sets: { orderBy: { setNumber: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!log) return null;

  const input = mapLogToScoringInput(log as unknown as FetchedLog);
  const result = calculateWorkoutScore(input);

  await prisma.workoutScore.upsert({
    where: { workoutLogId },
    create: {
      workoutLogId,
      userId,
      totalScore: Math.round(result.totalScore),
      strengthScore: Math.round(result.breakdown.strength),
      enduranceScore: Math.round(result.breakdown.endurance),
      engineScore: Math.round(result.breakdown.engine),
      volumeBonus: Math.round(result.breakdown.volumeBonus),
      prBonus: Math.round(result.breakdown.prBonus),
      scoreVersion: result.version,
      highlights: result.highlights,
      calculatedAt: new Date(result.calculatedAt),
    },
    update: {
      totalScore: Math.round(result.totalScore),
      strengthScore: Math.round(result.breakdown.strength),
      enduranceScore: Math.round(result.breakdown.endurance),
      engineScore: Math.round(result.breakdown.engine),
      volumeBonus: Math.round(result.breakdown.volumeBonus),
      prBonus: Math.round(result.breakdown.prBonus),
      scoreVersion: result.version,
      highlights: result.highlights,
      calculatedAt: new Date(result.calculatedAt),
    },
  });

  return result;
}

// ─── Compute & Persist: Hybrid Score ────────────────────────────────────────

/**
 * Recalculate and persist the Hybrid Score for a user.
 *
 * @param userId  The user to score.
 * @returns The computed HybridScoreResult.
 */
export async function computeAndPersistHybridScore(
  userId: string
): Promise<HybridScoreResult> {
  const now = new Date();
  const cutoff = new Date(
    now.getTime() - HYBRID_HISTORY_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );

  // Fetch recent workout scores
  const recentScores = await prisma.workoutScore.findMany({
    where: {
      userId,
      calculatedAt: { gte: cutoff },
    },
    include: {
      workoutLog: {
        select: { performedAt: true },
      },
    },
    orderBy: { calculatedAt: "desc" },
  });

  const workoutScoreEntries: WorkoutScoreHistoryEntry[] = recentScores.map(
    (s) => ({
      totalScore: s.totalScore,
      breakdown: {
        strength: s.strengthScore,
        endurance: s.enduranceScore,
        engine: s.engineScore,
        volumeBonus: s.volumeBonus,
        prBonus: s.prBonus,
      },
      performedAt: s.workoutLog.performedAt,
    })
  );

  // Fetch recent performance entries (runs + strength)
  const recentPerformance = await prisma.userPerformanceEntry.findMany({
    where: {
      userId,
      performedAt: { gte: cutoff },
      type: { in: ["RUN", "TRAIL", "STRENGTH"] },
    },
    select: {
      type: true,
      performedAt: true,
      distanceKm: true,
      timeSeconds: true,
      weightKg: true,
      reps: true,
    },
    orderBy: { performedAt: "desc" },
  });

  const performanceEntries: PerformanceHistoryEntry[] = recentPerformance.map(
    (p) => ({
      type: p.type as "RUN" | "TRAIL" | "STRENGTH",
      performedAt: p.performedAt,
      distanceKm: p.distanceKm,
      timeSeconds: p.timeSeconds,
      weightKg: p.weightKg,
      reps: p.reps,
    })
  );

  const result = calculateHybridScore(
    workoutScoreEntries,
    performanceEntries,
    now
  );

  await prisma.userHybridScore.upsert({
    where: { userId },
    create: {
      userId,
      totalScore: Math.round(result.totalScore),
      strengthScore: Math.round(result.breakdown.strength),
      enduranceScore: Math.round(result.breakdown.endurance),
      engineScore: Math.round(result.breakdown.engine),
      confidence: result.confidence,
      scoreVersion: result.version,
      calculatedAt: new Date(result.calculatedAt),
    },
    update: {
      totalScore: Math.round(result.totalScore),
      strengthScore: Math.round(result.breakdown.strength),
      enduranceScore: Math.round(result.breakdown.endurance),
      engineScore: Math.round(result.breakdown.engine),
      confidence: result.confidence,
      scoreVersion: result.version,
      calculatedAt: new Date(result.calculatedAt),
    },
  });

  return result;
}

/**
 * Get the current Workout Score version constant.
 * Useful for API responses.
 */
export function getCurrentWorkoutScoreVersion(): number {
  return WORKOUT_SCORE_VERSION;
}
