/**
 * Athli AI Assistant - Barrel re-exports
 *
 * All module exports are re-exported here so consumers can continue
 * importing from "@/lib/athli-ai" without changes.
 */

// System prompt
export { getSystemPrompt } from "./system-prompt";
export type { AthliPageContext, AthliUserLocation } from "./system-prompt";

// Platform knowledge base
export { getPlatformInfo } from "./platform";
export type { PlatformInfoParams } from "./platform";

// Events
export { searchEvents, getEventDetails, getUserEvents } from "./events";
export type { EventSearchParams } from "./events";

// Venues
export { searchVenues, getVenueDetails } from "./venues";
export type { VenueSearchParams } from "./venues";

// Sessions
export {
  getAvailableSessions,
  bookSession,
  getSessionDetails,
} from "./sessions";
export type { AvailableSessionsParams } from "./sessions";

// Analyses
export { getUserAnalyses } from "./analyses";
export type { UserAnalysesParams } from "./analyses";

// Workout history
export {
  getUserWorkoutHistory,
  formatDuration,
  formatMetricParts,
  formatExerciseDetail,
} from "./workout-history";
export type {
  WorkoutHistoryParams,
  ExerciseResultSummary,
} from "./workout-history";

// Training plans & exercises
export { saveTrainingPlan, listAvailableExercises } from "./training-plans";
export type { SaveTrainingPlanParams } from "./training-plans";

// Workouts
export { saveWorkout } from "./workouts";
export type { SaveWorkoutParams } from "./workouts";

// Bookings
export { getUserBookings } from "./bookings";
export type { UserBookingsParams } from "./bookings";

// PRs
export { getUserPRs } from "./prs";
export type { UserPRsParams } from "./prs";

// Performance logging
export { logPerformanceEntry } from "./performance-log";
export type { LogPerformanceParams } from "./performance-log";

// Giveaways
export { searchGiveaways } from "./giveaways";

// Admin notes
export { submitAdminNote } from "./admin-notes";
export type { SubmitAdminNoteParams } from "./admin-notes";

// Tool definitions
export { athliTools } from "./tools";
