/**
 * Workout Score & Hybrid Score — Constants
 *
 * Centralised constants for the product-facing scoring system.
 * All "magic numbers" live here so they can be tuned and tested in isolation.
 */

// ─── Score Range ────────────────────────────────────────────────────────────

/** Minimum possible score for any pillar or total. */
export const SCORE_MIN = 0;

/** Maximum possible score for any pillar or total (0-1000 scale). */
export const SCORE_MAX = 1000;

// ─── Score Versions ─────────────────────────────────────────────────────────

/** Current Workout Score algorithm version.  Bump when the formula changes. */
export const WORKOUT_SCORE_VERSION = 1;

/** Current Hybrid Score algorithm version.  Bump when the formula changes. */
export const HYBRID_SCORE_VERSION = 1;

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

/** Maximum volume bonus added on top of pillars (absolute points, ~5% of max). */
export const MAX_VOLUME_BONUS = 50;

/** Maximum PR bonus added on top of pillars (absolute points, ~3% of max). */
export const MAX_PR_BONUS = 30;

/** Points per PR detected in the workout. */
export const PR_BONUS_PER_PR = 15;

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

// ─── Block Type → Default Pillar Hint ──────────────────────────────────────

/**
 * Default pillar hint per block type.
 *
 * This is a **hint**, not the final truth.  Exercises within a block
 * contribute to pillars based on their actual metrics:
 *   - weight data → strength
 *   - distance / calorie data → endurance
 *   - reps in engine-type blocks → engine
 *
 * Blocks mapped to `null` are not scored at all.
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

// ─── Normalization Reference Points ────────────────────────────────────────

/**
 * Reference values used to normalise raw metrics into 0-1000 scores.
 * These represent what we consider a "good" (score ≈ 700) performance
 * for an average recreational athlete.
 *
 * Strength reference is a **global default**.  Callers can override it
 * per-exercise or per-exercise-family via the optional `ref` parameter
 * on `normalizeStrength`.
 */
export const NORMALIZATION_REFS = {
  /** Default reference e1RM in kg that corresponds to ~700/1000. */
  strengthE1rmKgRef: 100,

  /** Reference run pace in sec/km that corresponds to ~700/1000.
   *  5:00/km = 300 s/km. */
  endurancePaceSecPerKmRef: 300,

  /** Reference work-units in an engine block for ~700/1000.
   *  Work-units = Σ(reps × effortMultiplier), scaled by density when time data is available. */
  engineWorkUnitsRef: 150,

  /** Reference volume load (reps × weight in kg) for volume bonus calculation. */
  volumeLoadRef: 5000,
} as const;

// ─── Anti-Outlier Caps ─────────────────────────────────────────────────────

/** Maximum e1RM (kg) that will be considered.  Protects against data-entry errors. */
export const MAX_E1RM_KG_CAP = 500;

/** Maximum reps credited per exercise for engine scoring. */
export const MAX_ENGINE_REPS_PER_EXERCISE = 500;

/**
 * Reference duration (minutes) for engine density calculation.
 * When a block has a known completion time, work-units are scaled by
 * `densityRefMinutes / actualMinutes` to reward faster work.
 */
export const ENGINE_DENSITY_REF_MINUTES = 15;

/** Maximum density multiplier to prevent extremely fast completions from exploding. */
export const ENGINE_MAX_DENSITY_FACTOR = 2;

/**
 * Minimum block duration (seconds) required for the density factor to apply.
 * Blocks shorter than this threshold use a density of 1.0 to avoid
 * over-rewarding very short efforts (e.g. 10 burpees in 30 seconds).
 */
export const ENGINE_MIN_DENSITY_DURATION_SEC = 120;

/**
 * Maximum engine work-units a single block can contribute.
 * Prevents one large conditioning block from dominating the engine pillar.
 * Roughly calibrated at ~2× the reference work-units.
 */
export const MAX_ENGINE_WORK_UNITS_PER_BLOCK = 300;

// ─── Effort Modifier ───────────────────────────────────────────────────────

/**
 * Effort multiplier range.  `effortScore` (1-10) is mapped linearly to
 * this range, making it a **light modifier** rather than a primary scoring driver.
 */
export const EFFORT_MULTIPLIER_MIN = 0.8;
export const EFFORT_MULTIPLIER_MAX = 1.2;

// ─── Recency Decay ─────────────────────────────────────────────────────────

/** Half-life in days for hybrid score recency weighting. */
export const HYBRID_RECENCY_HALF_LIFE_DAYS = 30;
