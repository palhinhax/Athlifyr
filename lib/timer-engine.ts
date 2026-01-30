/**
 * Wall Timer Engine
 *
 * High-precision timer implementation using performance.now()
 * Designed for CrossFit workout timing with minimal drift
 */

import type {
  TimerConfig,
  TimerState,
  TimerPhase,
  TimerDisplayState,
  TimerEngine,
} from "@/types/timer";

export class WallTimerEngine implements TimerEngine {
  // State
  private state: TimerState = "READY";
  private phase: TimerPhase = "IDLE";
  private config: TimerConfig | null = null;

  // Timing (high precision)
  private startTime: number = 0;
  private pauseTime: number = 0;
  private accumulatedPauseTime: number = 0;
  private animationFrameId: number | null = null;

  // Round tracking
  private currentRound: number = 0;
  private totalRounds: number = 0;

  // Callbacks
  private tickCallback: ((state: TimerDisplayState) => void) | null = null;
  private stateChangeCallback: ((state: TimerState) => void) | null = null;
  private phaseChangeCallback: ((phase: TimerPhase) => void) | null = null;
  private roundChangeCallback: ((round: number) => void) | null = null;
  private completeCallback: (() => void) | null = null;

  // ============================================================================
  // Public API
  // ============================================================================

  configure(config: TimerConfig): void {
    this.config = config;
    this.reset();

    // Calculate total rounds based on mode
    switch (config.mode) {
      case "INTERVAL":
        this.totalRounds = config.config.rounds;
        break;
      case "TABATA":
        this.totalRounds = config.config.rounds;
        break;
      case "EMOM":
        this.totalRounds = config.config.duration;
        break;
      default:
        this.totalRounds = 0;
    }
  }

  start(): void {
    if (this.state === "RUNNING") return;
    if (!this.config) throw new Error("Timer not configured");

    this.startTime = performance.now();
    this.accumulatedPauseTime = 0;
    this.currentRound = 1;
    this.changeState("RUNNING");
    this.changePhase("WORK");
    this.tick();
  }

  pause(): void {
    if (this.state !== "RUNNING") return;

    this.pauseTime = performance.now();
    this.changeState("PAUSED");

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume(): void {
    if (this.state !== "PAUSED") return;

    this.accumulatedPauseTime += performance.now() - this.pauseTime;
    this.changeState("RUNNING");
    this.tick();
  }

  reset(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.startTime = 0;
    this.pauseTime = 0;
    this.accumulatedPauseTime = 0;
    this.currentRound = 0;
    this.changeState("READY");
    this.changePhase("IDLE");

    // Emit initial state
    if (this.tickCallback) {
      this.tickCallback(this.getDisplayState());
    }
  }

  getState(): TimerState {
    return this.state;
  }

  getDisplayState(): TimerDisplayState {
    if (!this.config) {
      return this.getIdleDisplayState();
    }

    const elapsed = this.getElapsedTime();

    switch (this.config.mode) {
      case "INTERVAL":
        return this.getIntervalDisplayState(elapsed);
      case "EMOM":
        return this.getEMOMDisplayState(elapsed);
      case "TABATA":
        return this.getTabataDisplayState(elapsed);
      case "AMRAP":
        return this.getAMRAPDisplayState(elapsed);
      case "FOR_TIME":
        return this.getForTimeDisplayState(elapsed);
      case "STOPWATCH":
        return this.getStopwatchDisplayState(elapsed);
      case "CLOCK":
        return this.getClockDisplayState();
      default:
        return this.getIdleDisplayState();
    }
  }

  onTick(callback: (state: TimerDisplayState) => void): void {
    this.tickCallback = callback;
  }

  onStateChange(callback: (state: TimerState) => void): void {
    this.stateChangeCallback = callback;
  }

  onPhaseChange(callback: (phase: TimerPhase) => void): void {
    this.phaseChangeCallback = callback;
  }

  onRoundChange(callback: (round: number) => void): void {
    this.roundChangeCallback = callback;
  }

  onComplete(callback: () => void): void {
    this.completeCallback = callback;
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.tickCallback = null;
    this.stateChangeCallback = null;
    this.phaseChangeCallback = null;
    this.roundChangeCallback = null;
    this.completeCallback = null;
  }

  // ============================================================================
  // Private Methods - Core Timing
  // ============================================================================

  private getElapsedTime(): number {
    if (this.state === "READY") return 0;
    if (this.state === "PAUSED") {
      return this.pauseTime - this.startTime - this.accumulatedPauseTime;
    }
    return performance.now() - this.startTime - this.accumulatedPauseTime;
  }

  private tick(): void {
    if (this.state !== "RUNNING") return;

    const displayState = this.getDisplayState();

    // Emit tick event
    if (this.tickCallback) {
      this.tickCallback(displayState);
    }

    // Check completion
    if (this.checkCompletion(displayState)) {
      this.complete();
      return;
    }

    // Schedule next tick
    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }

  private checkCompletion(displayState: TimerDisplayState): boolean {
    if (!this.config) return false;

    switch (this.config.mode) {
      case "INTERVAL":
      case "TABATA":
        return (
          displayState.currentRound >= displayState.totalRounds &&
          displayState.remaining <= 0
        );

      case "EMOM":
        return displayState.remaining <= 0;

      case "AMRAP":
        return displayState.remaining <= 0;

      case "FOR_TIME":
        if (this.config.config.countDown) {
          return displayState.remaining <= 0;
        }
        return false; // count up never ends automatically

      default:
        return false;
    }
  }

  private complete(): void {
    this.changeState("FINISHED");
    this.changePhase("IDLE");

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.completeCallback) {
      this.completeCallback();
    }
  }

  // ============================================================================
  // Private Methods - State Changes
  // ============================================================================

  private changeState(newState: TimerState): void {
    if (this.state === newState) return;
    this.state = newState;
    if (this.stateChangeCallback) {
      this.stateChangeCallback(newState);
    }
  }

  private changePhase(newPhase: TimerPhase): void {
    if (this.phase === newPhase) return;
    this.phase = newPhase;
    if (this.phaseChangeCallback) {
      this.phaseChangeCallback(newPhase);
    }
  }

  private changeRound(newRound: number): void {
    if (this.currentRound === newRound) return;
    this.currentRound = newRound;
    if (this.roundChangeCallback) {
      this.roundChangeCallback(newRound);
    }
  }

  // ============================================================================
  // Private Methods - Display State Calculators
  // ============================================================================

  private getIdleDisplayState(): TimerDisplayState {
    return {
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      currentRound: 0,
      totalRounds: 0,
      phase: "IDLE",
      state: this.state,
      progress: 0,
      elapsed: 0,
      remaining: 0,
    };
  }

  private getIntervalDisplayState(elapsed: number): TimerDisplayState {
    if (!this.config || this.config.mode !== "INTERVAL") {
      return this.getIdleDisplayState();
    }

    const { workTime, restTime, rounds } = this.config.config;
    const roundDuration = (workTime + restTime) * 1000;
    const totalDuration = roundDuration * rounds;

    const currentRound = Math.min(
      Math.floor(elapsed / roundDuration) + 1,
      rounds
    );
    const timeInRound = elapsed % roundDuration;
    const isWorkPhase = timeInRound < workTime * 1000;
    const phase: TimerPhase = isWorkPhase ? "WORK" : "REST";

    // Update phase and round
    this.changePhase(phase);
    this.changeRound(currentRound);

    const phaseElapsed = isWorkPhase
      ? timeInRound
      : timeInRound - workTime * 1000;
    const phaseDuration = isWorkPhase ? workTime * 1000 : restTime * 1000;
    const remaining = phaseDuration - phaseElapsed;

    const time = this.millisecondsToTime(remaining);
    const progress = (elapsed / totalDuration) * 100;

    return {
      minutes: time.minutes,
      seconds: time.seconds,
      milliseconds: time.milliseconds,
      currentRound,
      totalRounds: rounds,
      phase,
      state: this.state,
      progress,
      elapsed,
      remaining: totalDuration - elapsed,
    };
  }

  private getEMOMDisplayState(elapsed: number): TimerDisplayState {
    if (!this.config || this.config.mode !== "EMOM") {
      return this.getIdleDisplayState();
    }

    const { duration, workTime = 60 } = this.config.config;
    const totalDuration = duration * 60 * 1000;
    const roundDuration = workTime * 1000;

    const currentRound = Math.min(
      Math.floor(elapsed / roundDuration) + 1,
      duration
    );
    const timeInRound = elapsed % roundDuration;
    const remaining = roundDuration - timeInRound;

    // Update round
    this.changeRound(currentRound);
    this.changePhase("WORK");

    const time = this.millisecondsToTime(remaining);
    const progress = (elapsed / totalDuration) * 100;

    return {
      minutes: time.minutes,
      seconds: time.seconds,
      milliseconds: time.milliseconds,
      currentRound,
      totalRounds: duration,
      phase: "WORK",
      state: this.state,
      progress,
      elapsed,
      remaining: totalDuration - elapsed,
    };
  }

  private getTabataDisplayState(elapsed: number): TimerDisplayState {
    if (!this.config || this.config.mode !== "TABATA") {
      return this.getIdleDisplayState();
    }

    const { workTime, restTime, rounds } = this.config.config;
    const roundDuration = (workTime + restTime) * 1000;
    const totalDuration = roundDuration * rounds;

    const currentRound = Math.min(
      Math.floor(elapsed / roundDuration) + 1,
      rounds
    );
    const timeInRound = elapsed % roundDuration;
    const isWorkPhase = timeInRound < workTime * 1000;
    const phase: TimerPhase = isWorkPhase ? "WORK" : "REST";

    // Update phase and round
    this.changePhase(phase);
    this.changeRound(currentRound);

    const phaseElapsed = isWorkPhase
      ? timeInRound
      : timeInRound - workTime * 1000;
    const phaseDuration = isWorkPhase ? workTime * 1000 : restTime * 1000;
    const remaining = phaseDuration - phaseElapsed;

    const time = this.millisecondsToTime(remaining);
    const progress = (elapsed / totalDuration) * 100;

    return {
      minutes: time.minutes,
      seconds: time.seconds,
      milliseconds: time.milliseconds,
      currentRound,
      totalRounds: rounds,
      phase,
      state: this.state,
      progress,
      elapsed,
      remaining: totalDuration - elapsed,
    };
  }

  private getAMRAPDisplayState(elapsed: number): TimerDisplayState {
    if (!this.config || this.config.mode !== "AMRAP") {
      return this.getIdleDisplayState();
    }

    const { duration } = this.config.config;
    const totalDuration = duration * 1000;
    const remaining = Math.max(0, totalDuration - elapsed);

    this.changePhase("WORK");

    const time = this.millisecondsToTime(remaining);
    const progress = (elapsed / totalDuration) * 100;

    return {
      minutes: time.minutes,
      seconds: time.seconds,
      milliseconds: time.milliseconds,
      currentRound: 0,
      totalRounds: 0,
      phase: "WORK",
      state: this.state,
      progress,
      elapsed,
      remaining,
    };
  }

  private getForTimeDisplayState(elapsed: number): TimerDisplayState {
    if (!this.config || this.config.mode !== "FOR_TIME") {
      return this.getIdleDisplayState();
    }

    const { countDown, duration = 0 } = this.config.config;

    this.changePhase("WORK");

    if (countDown) {
      const totalDuration = duration * 1000;
      const remaining = Math.max(0, totalDuration - elapsed);
      const time = this.millisecondsToTime(remaining);
      const progress = (elapsed / totalDuration) * 100;

      return {
        minutes: time.minutes,
        seconds: time.seconds,
        milliseconds: time.milliseconds,
        currentRound: 0,
        totalRounds: 0,
        phase: "WORK",
        state: this.state,
        progress,
        elapsed,
        remaining,
      };
    } else {
      // Count up
      const time = this.millisecondsToTime(elapsed);

      return {
        minutes: time.minutes,
        seconds: time.seconds,
        milliseconds: time.milliseconds,
        currentRound: 0,
        totalRounds: 0,
        phase: "WORK",
        state: this.state,
        progress: 0,
        elapsed,
        remaining: 0,
      };
    }
  }

  private getStopwatchDisplayState(elapsed: number): TimerDisplayState {
    const time = this.millisecondsToTime(elapsed);

    return {
      minutes: time.minutes,
      seconds: time.seconds,
      milliseconds: time.milliseconds,
      currentRound: 0,
      totalRounds: 0,
      phase: "WORK",
      state: this.state,
      progress: 0,
      elapsed,
      remaining: 0,
    };
  }

  private getClockDisplayState(): TimerDisplayState {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    return {
      minutes: hours * 60 + minutes,
      seconds,
      milliseconds,
      currentRound: 0,
      totalRounds: 0,
      phase: "IDLE",
      state: this.state,
      progress: 0,
      elapsed: 0,
      remaining: 0,
    };
  }

  // ============================================================================
  // Private Methods - Utilities
  // ============================================================================

  private millisecondsToTime(ms: number): {
    minutes: number;
    seconds: number;
    milliseconds: number;
  } {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.max(0, Math.floor(ms % 1000));

    return { minutes, seconds, milliseconds };
  }
}
