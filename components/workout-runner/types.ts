/**
 * Workout Runner Types
 */

import type { TimerPhase } from "@/types/timer";

export type WorkoutTimerMode =
  | "STOPWATCH"
  | "COUNTDOWN"
  | "EMOM"
  | "TABATA"
  | "AMRAP"
  | "FOR_TIME"
  | "INTERVALS";

export interface TimerModeConfig {
  mode: WorkoutTimerMode;
  // COUNTDOWN / AMRAP
  duration?: number; // seconds
  // FOR_TIME
  forTimeCap?: number; // optional cap in seconds (0 = no cap)
  forTimeContinueAfterCap?: boolean; // continue counting after cap is reached
  // EMOM - Every Minute On the Minute
  emomMinutes?: number; // total minutes (e.g., 10, 12, 20)
  emomIntervalSeconds?: number; // interval duration in seconds (default: 60, use 120 for E2MOM, 180 for E3MOM)
  // TABATA
  tabataWork?: number;
  tabataRest?: number;
  tabataRounds?: number;
  // INTERVALS - Work/Rest cycles
  intervalsRounds?: number; // number of rounds (e.g., 10)
  intervalsWork?: number; // work time in seconds (e.g., 120)
  intervalsRest?: number; // rest time in seconds (e.g., 60)
  // Generic intervals (legacy)
  workTime?: number;
  restTime?: number;
  rounds?: number;
}

export interface TimerState {
  elapsedTime: number;
  remainingTime: number;
  isRunning: boolean;
  hasStarted: boolean;
  isFinished: boolean;
  currentRound: number;
  currentPhase: TimerPhase;
  isCapReached: boolean;
  // Preparation countdown
  isPreparing: boolean;
  prepCountdown: number;
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  finish: () => void;
  confirmReset: () => void;
}

export const DEFAULT_TIMER_CONFIG: TimerModeConfig = {
  mode: "STOPWATCH",
  duration: 600, // 10 min default for countdown modes
  forTimeCap: 0, // no cap by default
  forTimeContinueAfterCap: true, // continue counting after cap (CrossFit standard)
  emomMinutes: 10,
  emomIntervalSeconds: 60, // default 60s per interval (standard EMOM)
  tabataWork: 20,
  tabataRest: 10,
  tabataRounds: 8,
  // INTERVALS defaults
  intervalsRounds: 10,
  intervalsWork: 120, // 2 minutes work
  intervalsRest: 60, // 1 minute rest
};
