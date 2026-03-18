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

export { SCORE_VERSION } from "./types";

// Constants
export {
  BLOCK_TYPE_PILLAR,
  CATEGORY_PILLAR,
  HYBRID_HISTORY_WINDOW_DAYS,
  HYBRID_MIN_WORKOUTS_HIGH,
  HYBRID_MIN_WORKOUTS_MEDIUM,
  HYBRID_PILLAR_WEIGHTS,
  HYBRID_RECENCY_HALF_LIFE_DAYS,
  MAX_PR_BONUS,
  MAX_VOLUME_BONUS,
  NORMALIZATION_REFS,
  PR_BONUS_PER_PR,
  SCORE_MAX,
  SCORE_MIN,
  WORKOUT_PILLAR_WEIGHTS,
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
