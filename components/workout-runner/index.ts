/**
 * Workout Runner Module
 *
 * Modular workout execution timer with multiple modes:
 * - STOPWATCH: Simple count up
 * - COUNTDOWN: Count down from a set time
 * - FOR_TIME: Count up with optional CAP
 * - AMRAP: As Many Rounds As Possible (countdown)
 * - EMOM: Every Minute On the Minute
 * - TABATA: Work/Rest intervals
 */

// Main component
export { WorkoutRunner } from "./workout-runner";

// Sub-components
export { TimerHeader } from "./timer-header";
export { TimerSettings } from "./timer-settings";
export { TimerControls } from "./timer-controls";
export { WorkoutBlocks } from "./workout-blocks";
export { SubmitSection } from "./submit-section";

// Hooks
export { useTimer } from "./hooks/use-timer";

// Types
export type {
  WorkoutTimerMode,
  TimerModeConfig,
  TimerState,
  TimerActions,
} from "./types";

export { DEFAULT_TIMER_CONFIG } from "./types";
