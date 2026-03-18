/**
 * Workout Score & Hybrid Score — Type Definitions
 *
 * These types define the product-facing scoring system.
 * They are intentionally separate from the internal scoring types
 * (qualityScore, predictionWeight) in lib/performance/scoring.ts.
 */

// ─── Score Version ──────────────────────────────────────────────────────────

/** Current scoring algorithm version. Bump when the formula changes. */
export const SCORE_VERSION = 1;

// ─── Confidence ─────────────────────────────────────────────────────────────

export type ScoreConfidence = "LOW" | "MEDIUM" | "HIGH";

// ─── Workout Score ──────────────────────────────────────────────────────────

/** Breakdown of a single workout's score by pillar. */
export interface WorkoutScoreBreakdown {
  /** Points from strength-oriented exercises (0-100). */
  strength: number;
  /** Points from endurance/cardio exercises (0-100). */
  endurance: number;
  /** Points from mixed/engine work like EMOM, AMRAP, FOR_TIME (0-100). */
  engine: number;
  /** Extra credit for high total volume (0-20). */
  volumeBonus: number;
  /** Extra credit for achieving a personal record (0-10). */
  prBonus: number;
}

/** Result of calculating a Workout Score. */
export interface WorkoutScoreResult {
  /** Algorithm version that produced this score. */
  version: number;
  /** Final composite workout score (0-100). */
  totalScore: number;
  /** Per-pillar breakdown. */
  breakdown: WorkoutScoreBreakdown;
  /** Human-readable highlights (e.g. "PR bonus applied"). */
  highlights: string[];
  /** ISO-8601 timestamp of when the score was calculated. */
  calculatedAt: string;
}

// ─── Hybrid Score ───────────────────────────────────────────────────────────

/** Breakdown of a user's Hybrid Score by pillar. */
export interface HybridScoreBreakdown {
  /** Strength pillar (0-100). */
  strength: number;
  /** Endurance pillar (0-100). */
  endurance: number;
  /** Engine / conditioning pillar (0-100). */
  engine: number;
}

/** Result of calculating a user's Hybrid Score. */
export interface HybridScoreResult {
  /** Algorithm version that produced this score. */
  version: number;
  /** Final composite hybrid score (0-100). */
  totalScore: number;
  /** Per-pillar breakdown. */
  breakdown: HybridScoreBreakdown;
  /** Confidence based on how much data was available. */
  confidence: ScoreConfidence;
  /** ISO-8601 timestamp of when the score was calculated. */
  calculatedAt: string;
}

// ─── Score Input Types ──────────────────────────────────────────────────────

/**
 * A single exercise result as consumed by the workout score calculator.
 * This is an abstraction layer so the scorer does not depend on Prisma types.
 */
export interface ExerciseResultInput {
  exerciseId: string;
  /** Exercise category from the database. */
  category:
    | "CROSSFIT"
    | "GYM"
    | "WEIGHTLIFTING"
    | "BODYWEIGHT"
    | "CARDIO"
    | "OTHER";
  /** The effort score from Exercise model (1-10). */
  effortScore: number;
  /** Whether this exercise measures reps. */
  hasReps: boolean;
  /** Whether this exercise measures weight. */
  hasWeight: boolean;
  /** Whether this exercise measures distance. */
  hasDistance: boolean;
  /** Whether this exercise measures time. */
  hasTime: boolean;
  /** Whether this exercise measures calories. */
  hasCalories: boolean;
  /** Actual reps performed. */
  actualReps?: number | null;
  /** Actual weight in kg. */
  actualWeightKg?: number | null;
  /** Actual distance in meters. */
  actualDistanceM?: number | null;
  /** Actual time in seconds. */
  actualTimeSeconds?: number | null;
  /** Actual calories. */
  actualCalories?: number | null;
  /** Whether this result is a personal record. */
  isPR: boolean;
  /** Individual sets for strength exercises. */
  sets?: ExerciseSetInput[];
}

/** A single set within a strength exercise result. */
export interface ExerciseSetInput {
  reps: number;
  /** Weight in kg. */
  weightKg: number;
  isPR: boolean;
}

/**
 * Block-level information consumed by the workout score calculator.
 */
export interface BlockResultInput {
  blockType:
    | "WARMUP"
    | "STRENGTH"
    | "AMRAP"
    | "EMOM"
    | "FOR_TIME"
    | "TABATA"
    | "CHIPPER"
    | "REST"
    | "COOLDOWN"
    | "SKILL";
  /** For AMRAP — rounds completed. */
  completedRounds?: number | null;
  /** For AMRAP — extra reps in partial round. */
  extraReps?: number | null;
  /** For FOR_TIME — time in seconds. */
  completedTime?: number | null;
  /** Exercise results within this block. */
  exerciseResults: ExerciseResultInput[];
}

/**
 * Full workout log data consumed by the workout score calculator.
 */
export interface WorkoutLogInput {
  /** User's perceived effort (RPE 1-10). */
  perceivedEffort?: number | null;
  /** User's feeling (1-5). */
  feeling?: number | null;
  /** Block results within the workout. */
  blockResults: BlockResultInput[];
}

// ─── Hybrid Score Input Types ───────────────────────────────────────────────

/**
 * A historical workout score entry used to compute the Hybrid Score.
 */
export interface WorkoutScoreHistoryEntry {
  totalScore: number;
  breakdown: WorkoutScoreBreakdown;
  performedAt: Date;
}

/**
 * A historical performance entry used to compute the Hybrid Score.
 * These come from UserPerformanceEntry (runs, strength, etc.).
 */
export interface PerformanceHistoryEntry {
  type: "RUN" | "TRAIL" | "STRENGTH" | "HYROX";
  performedAt: Date;
  /** Running: distance in km. */
  distanceKm?: number | null;
  /** Running: time in seconds. */
  timeSeconds?: number | null;
  /** Strength: weight in kg. */
  weightKg?: number | null;
  /** Strength: reps. */
  reps?: number | null;
}
