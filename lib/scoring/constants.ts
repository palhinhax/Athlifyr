/**
 * Workout Score & Hybrid Score — Constants
 *
 * Centralised constants for the product-facing scoring system.
 * All "magic numbers" live here so they can be tuned and tested in isolation.
 */

// ─── Score Range ────────────────────────────────────────────────────────────

/** Minimum possible score for any pillar or total. */
export const SCORE_MIN = 0;

/** Maximum possible score for any pillar or total. */
export const SCORE_MAX = 100;

// ─── Pillar Weights — Workout Score ────────────────────────────────────────

/**
 * How much each pillar contributes to the total Workout Score.
 * Strength + Endurance + Engine must equal 1.0.
 */
export const WORKOUT_PILLAR_WEIGHTS = {
  strength: 0.35,
  endurance: 0.35,
  engine: 0.3,
} as const;

/** Maximum volume bonus added on top of pillars (absolute points). */
export const MAX_VOLUME_BONUS = 20;

/** Maximum PR bonus added on top of pillars (absolute points). */
export const MAX_PR_BONUS = 10;

/** Points per PR detected in the workout. */
export const PR_BONUS_PER_PR = 5;

// ─── Pillar Weights — Hybrid Score ─────────────────────────────────────────

/**
 * How each pillar contributes to the total Hybrid Score.
 * Equal weight by default; can be tuned later.
 */
export const HYBRID_PILLAR_WEIGHTS = {
  strength: 1 / 3,
  endurance: 1 / 3,
  engine: 1 / 3,
} as const;

// ─── Hybrid Score History Window ───────────────────────────────────────────

/** Only workouts within this many days are considered for hybrid scoring. */
export const HYBRID_HISTORY_WINDOW_DAYS = 90;

/** Minimum workouts required for MEDIUM confidence. */
export const HYBRID_MIN_WORKOUTS_MEDIUM = 5;

/** Minimum workouts required for HIGH confidence. */
export const HYBRID_MIN_WORKOUTS_HIGH = 15;

// ─── Block Type → Pillar Mapping ───────────────────────────────────────────

/**
 * Which pillar each WorkoutBlockType primarily contributes to.
 * REST, WARMUP, COOLDOWN do not contribute score.
 */
export const BLOCK_TYPE_PILLAR: Record<
  string,
  "strength" | "endurance" | "engine" | null
> = {
  WARMUP: null,
  STRENGTH: "strength",
  AMRAP: "engine",
  EMOM: "engine",
  FOR_TIME: "engine",
  TABATA: "engine",
  CHIPPER: "engine",
  REST: null,
  COOLDOWN: null,
  SKILL: null,
};

// ─── Exercise Category → Pillar Mapping ────────────────────────────────────

/**
 * How exercise categories map to scoring pillars.
 * Used within engine blocks to distinguish strength-like vs cardio-like exercises.
 */
export const CATEGORY_PILLAR: Record<string, "strength" | "endurance"> = {
  CROSSFIT: "strength",
  GYM: "strength",
  WEIGHTLIFTING: "strength",
  BODYWEIGHT: "strength",
  CARDIO: "endurance",
  OTHER: "strength",
};

// ─── Normalization Reference Points ────────────────────────────────────────

/**
 * Reference values used to normalise raw metrics into 0-100 scores.
 * These represent what we consider a "good" (score ≈ 70) performance
 * for an average recreational athlete.
 */
export const NORMALIZATION_REFS = {
  /** Reference e1RM in kg that corresponds to ~70/100 strength score. */
  strengthE1rmKgRef: 100,

  /** Reference run pace in sec/km that corresponds to ~70/100 endurance score.
   *  5:00/km = 300 s/km. */
  endurancePaceSecPerKmRef: 300,

  /** Reference total reps in an engine block for ~70/100 engine score. */
  engineTotalRepsRef: 100,

  /** Effort score at which an exercise earns full normalised credit (1-10 scale). */
  effortScoreFullCredit: 7,

  /** Reference volume load (reps × weight in kg) for volume bonus calculation. */
  volumeLoadRef: 5000,
} as const;

// ─── Recency Decay ─────────────────────────────────────────────────────────

/** Half-life in days for hybrid score recency weighting. */
export const HYBRID_RECENCY_HALF_LIFE_DAYS = 30;
