/**
 * Workout Score & Hybrid Score — Public API
 *
 * Barrel export for the scoring module.
 * Import from `@/lib/scoring` in the rest of the application.
 */

// Types
export type {
  BlockResultInput,
  ExerciseResultInput,
  ExerciseSetInput,
  HybridScoreBreakdown,
  HybridScoreResult,
  PerformanceHistoryEntry,
  ScoreConfidence,
  WorkoutLogInput,
  WorkoutScoreBreakdown,
  WorkoutScoreHistoryEntry,
  WorkoutScoreResult,
} from "./types";

// Constants
export {
  BLOCK_TYPE_PILLAR,
  EFFORT_MULTIPLIER_MAX,
  EFFORT_MULTIPLIER_MIN,
  ENGINE_DENSITY_REF_MINUTES,
  ENGINE_MAX_DENSITY_FACTOR,
  HYBRID_HISTORY_WINDOW_DAYS,
  HYBRID_MIN_WORKOUTS_HIGH,
  HYBRID_MIN_WORKOUTS_MEDIUM,
  HYBRID_PILLAR_WEIGHTS,
  HYBRID_RECENCY_HALF_LIFE_DAYS,
  HYBRID_SCORE_VERSION,
  MAX_E1RM_KG_CAP,
  MAX_ENGINE_REPS_PER_EXERCISE,
  MAX_PR_BONUS,
  MAX_VOLUME_BONUS,
  NORMALIZATION_REFS,
  PR_BONUS_PER_PR,
  SCORE_MAX,
  SCORE_MIN,
  WORKOUT_PILLAR_WEIGHTS,
  WORKOUT_SCORE_VERSION,
} from "./constants";

// Normalizers
export {
  calculateE1rm,
  clamp,
  effortMultiplier,
  normalizeEndurance,
  normalizeEnduranceByCalories,
  normalizeEngine,
  normalizeStrength,
  normalizeVolumeBonus,
  recencyWeight,
} from "./normalizers";

// Score calculators
export { calculateWorkoutScore } from "./workout-score";
export { calculateHybridScore } from "./hybrid-score";

// Service layer (DB-connected)
export {
  computeAndPersistWorkoutScore,
  computeAndPersistHybridScore,
} from "./score-service";
