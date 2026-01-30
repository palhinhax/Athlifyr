/**
 * Wall Timer Types
 *
 * Sistema de timer para CrossFit inspirado em relógios físicos de box
 * Suporta múltiplos modos de treino com precisão baseada em timestamps
 */

// ============================================================================
// Timer States
// ============================================================================

export type TimerState = "READY" | "RUNNING" | "PAUSED" | "FINISHED";

export type TimerPhase = "WORK" | "REST" | "TRANSITION" | "IDLE";

// ============================================================================
// Timer Modes
// ============================================================================

export type TimerMode =
  | "INTERVAL" // Custom intervals (work/rest)
  | "EMOM" // Every Minute On the Minute
  | "TABATA" // 20s/10s classic
  | "AMRAP" // As Many Rounds As Possible
  | "FOR_TIME" // Countdown / Countup
  | "CLOCK" // Wall clock display
  | "STOPWATCH"; // Simple stopwatch

// ============================================================================
// Timer Configuration
// ============================================================================

export interface IntervalConfig {
  workTime: number; // seconds
  restTime: number; // seconds
  rounds: number;
}

export interface EMOMConfig {
  duration: number; // total minutes
  workTime?: number; // optional work time per minute (default: 60s)
}

export interface TabataConfig {
  workTime: number; // default: 20s
  restTime: number; // default: 10s
  rounds: number; // default: 8
}

export interface AMRAPConfig {
  duration: number; // total seconds
}

export interface ForTimeConfig {
  countDown: boolean; // true = countdown, false = count up
  duration?: number; // if countdown
}

export type TimerConfig =
  | { mode: "INTERVAL"; config: IntervalConfig }
  | { mode: "EMOM"; config: EMOMConfig }
  | { mode: "TABATA"; config: TabataConfig }
  | { mode: "AMRAP"; config: AMRAPConfig }
  | { mode: "FOR_TIME"; config: ForTimeConfig }
  | { mode: "STOPWATCH"; config: null }
  | { mode: "CLOCK"; config: null };

// ============================================================================
// Timer Preset (saved programs)
// ============================================================================

export interface TimerPreset {
  id: string;
  name: string;
  timerConfig: TimerConfig;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Timer Display State
// ============================================================================

export interface TimerDisplayState {
  // Time display
  minutes: number;
  seconds: number;
  milliseconds: number;

  // Round tracking
  currentRound: number;
  totalRounds: number;

  // Phase tracking
  phase: TimerPhase;
  state: TimerState;

  // Progress
  progress: number; // 0-100 percentage
  elapsed: number; // total elapsed time in ms
  remaining: number; // remaining time in ms
}

// ============================================================================
// Sound Settings
// ============================================================================

export type SoundVolume = 0 | 1 | 2 | 3 | 4 | 5; // 0 = mute, 5 = max

export interface SoundSettings {
  volume: SoundVolume;
  enableCountdown: boolean; // 3-2-1 countdown
  enableTransitions: boolean; // beep on work/rest change
  enableCompletion: boolean; // long beep on finish
}

export type SoundType =
  | "beep-short" // Work/Rest transition
  | "beep-long" // Finish
  | "countdown-3"
  | "countdown-2"
  | "countdown-1"
  | "countdown-go";

// ============================================================================
// Brightness Settings
// ============================================================================

export type BrightnessLevel = 1 | 2 | 3 | 4 | 5;

export interface DisplaySettings {
  brightness: BrightnessLevel;
  highContrast: boolean;
  show24Hour: boolean; // for clock mode
}

// ============================================================================
// Timer Engine Interface
// ============================================================================

export interface TimerEngine {
  // State
  getState(): TimerState;
  getDisplayState(): TimerDisplayState;

  // Controls
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;

  // Configuration
  configure(config: TimerConfig): void;

  // Callbacks
  onTick(callback: (state: TimerDisplayState) => void): void;
  onStateChange(callback: (state: TimerState) => void): void;
  onPhaseChange(callback: (phase: TimerPhase) => void): void;
  onRoundChange(callback: (round: number) => void): void;
  onComplete(callback: () => void): void;

  // Cleanup
  destroy(): void;
}

// ============================================================================
// Helper Types
// ============================================================================

export interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface TimerEvent {
  type: "tick" | "stateChange" | "phaseChange" | "roundChange" | "complete";
  timestamp: number;
  data?: unknown;
}
