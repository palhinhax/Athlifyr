"use client";

/**
 * useTimer Hook
 *
 * Manages all timer logic including:
 * - Elapsed/remaining time tracking
 * - Round and phase management for TABATA/EMOM
 * - FOR_TIME cap handling
 *
 * EMOM Specification:
 * - COUNT DOWN per interval (not total)
 * - Display shows remaining seconds of current minute (59→0)
 * - Green digits show current minute (01..totalMinutes)
 * - No WORK/REST phases - athlete works at start, rests remainder
 * - Beep on each minute transition
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { TimerModeConfig, TimerState, TimerActions } from "../types";
import type { TimerPhase } from "@/types/timer";

interface UseTimerOptions {
  config: TimerModeConfig;
  onConfigChange?: (config: TimerModeConfig) => void;
  // Audio callbacks
  onPrepCountdownTick?: (secondsRemaining: number) => void;
  onTimerStart?: () => void;
  onPhaseChange?: (phase: TimerPhase) => void;
  onTimerFinish?: () => void;
}

// Preparation countdown duration in seconds
const PREP_COUNTDOWN_SECONDS = 10;

// ─── Pure timer computation helpers ─────────────────────────────────────────

function computeTabataState(
  elapsed: number,
  work: number,
  rest: number
): { round: number; phase: TimerPhase } {
  const cycleTime = work + rest;
  const positionInCycle = elapsed % cycleTime;
  return {
    round: Math.floor(elapsed / cycleTime) + 1,
    phase: positionInCycle < work ? "WORK" : "REST",
  };
}

function computeEmomState(
  elapsed: number,
  intervalSeconds: number,
  totalMinutes: number
): { round: number; intervalRemaining: number; minuteTransition: boolean } {
  const currentMinute = Math.floor(elapsed / intervalSeconds) + 1;
  const positionInInterval = elapsed % intervalSeconds;
  const prevMinute = Math.floor((elapsed - 1) / intervalSeconds) + 1;
  return {
    round: Math.min(currentMinute, totalMinutes),
    intervalRemaining: intervalSeconds - positionInInterval,
    minuteTransition:
      currentMinute > prevMinute && currentMinute <= totalMinutes,
  };
}

function computeIntervalsState(
  elapsed: number,
  work: number,
  rest: number,
  totalRounds: number
): { round: number; phase: TimerPhase; intervalRemaining: number } {
  const cycleTime = work + rest;
  const completedCycles = Math.floor(elapsed / cycleTime);
  const positionInCycle = elapsed % cycleTime;
  const isWorkPhase = positionInCycle < work;
  return {
    round: Math.min(completedCycles + 1, totalRounds),
    phase: isWorkPhase ? "WORK" : "REST",
    intervalRemaining: Math.max(
      0,
      isWorkPhase ? work - positionInCycle : rest - (positionInCycle - work)
    ),
  };
}

interface UseTimerReturn extends TimerState, TimerActions {
  getTotalDuration: () => number;
  getDisplayTime: () => number;
  getTimerStatus: () => "idle" | "running" | "paused" | "done" | "preparing";
  getIntervalRemaining: () => number; // For EMOM: seconds remaining in current interval
}

export function useTimer({
  config,
  onPrepCountdownTick,
  onTimerStart,
  onPhaseChange,
  onTimerFinish,
}: UseTimerOptions): UseTimerReturn {
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isCapReached, setIsCapReached] = useState(false);

  // Preparation countdown state
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepCountdown, setPrepCountdown] = useState(PREP_COUNTDOWN_SECONDS);

  // Round/interval tracking
  const [currentRound, setCurrentRound] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("IDLE");

  // EMOM specific: remaining seconds in current interval
  const [intervalRemaining, setIntervalRemaining] = useState(0);

  // Timer refs
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const prepStartTimeRef = useRef<number | null>(null);

  // Calculate total time for countdown modes
  const getTotalDuration = useCallback((): number => {
    switch (config.mode) {
      case "COUNTDOWN":
      case "AMRAP":
        return config.duration || 600;
      case "FOR_TIME":
        return config.forTimeCap || 0;
      case "EMOM": {
        // Total duration = minutes * intervalSeconds
        const minutes = config.emomMinutes || 10;
        const intervalSeconds = config.emomIntervalSeconds || 60;
        return minutes * intervalSeconds;
      }
      case "TABATA": {
        const work = config.tabataWork || 20;
        const rest = config.tabataRest || 10;
        const rounds = config.tabataRounds || 8;
        return (work + rest) * rounds;
      }
      case "INTERVALS": {
        const work = config.intervalsWork || 120;
        const rest = config.intervalsRest || 60;
        const rounds = config.intervalsRounds || 10;
        return (work + rest) * rounds;
      }
      default:
        return 0;
    }
  }, [config]);

  // Get display time based on mode
  const getDisplayTime = useCallback((): number => {
    // EMOM: show remaining seconds in current interval (countdown per interval)
    if (config.mode === "EMOM") {
      return intervalRemaining;
    }
    // TABATA: show remaining seconds in current phase (work or rest)
    if (config.mode === "TABATA") {
      const work = config.tabataWork || 20;
      const rest = config.tabataRest || 10;
      const cycleTime = work + rest;
      const positionInCycle = elapsedTime % cycleTime;
      const isWorkPhase = positionInCycle < work;
      // Show countdown within current phase
      if (isWorkPhase) {
        return work - positionInCycle;
      } else {
        return rest - (positionInCycle - work);
      }
    }
    // INTERVALS: show remaining seconds in current phase (work or rest) - countdown
    if (config.mode === "INTERVALS") {
      return intervalRemaining;
    }
    // FOR_TIME and STOPWATCH count UP
    const countsUp = ["STOPWATCH", "FOR_TIME"].includes(config.mode);
    return countsUp ? elapsedTime : remainingTime;
  }, [
    config.mode,
    config.tabataWork,
    config.tabataRest,
    elapsedTime,
    remainingTime,
    intervalRemaining,
  ]);

  // Get remaining seconds in current interval (for EMOM)
  const getIntervalRemaining = useCallback((): number => {
    return intervalRemaining;
  }, [intervalRemaining]);

  // Get timer status for display
  const getTimerStatus = useCallback(():
    | "idle"
    | "running"
    | "paused"
    | "done"
    | "preparing" => {
    if (isPreparing) return "preparing";
    if (isFinished) return "done";
    if (isRunning) return "running";
    if (hasStarted) return "paused";
    return "idle";
  }, [isPreparing, isFinished, isRunning, hasStarted]);

  // Track previous prep countdown for detecting changes
  const prevPrepCountdownRef = useRef<number>(PREP_COUNTDOWN_SECONDS);

  // Track previous phase for detecting transitions
  const prevPhaseRef = useRef<TimerPhase>("IDLE");

  // Preparation countdown logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPreparing && prepStartTimeRef.current !== null) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - prepStartTimeRef.current!) / 1000
        );
        const remaining = PREP_COUNTDOWN_SECONDS - elapsed;

        if (remaining <= 0) {
          // Prep countdown finished - start the actual timer
          setIsPreparing(false);
          setPrepCountdown(PREP_COUNTDOWN_SECONDS);
          prepStartTimeRef.current = null;
          prevPrepCountdownRef.current = PREP_COUNTDOWN_SECONDS;

          // Now start the actual timer
          setHasStarted(true);
          startTimeRef.current = Date.now();
          pausedTimeRef.current = 0;
          setIsCapReached(false);
          setIsFinished(false);
          setCurrentRound(1);
          setCurrentPhase("WORK");

          // Initialize interval remaining based on mode
          if (config.mode === "EMOM") {
            setIntervalRemaining(config.emomIntervalSeconds || 60);
          } else if (config.mode === "INTERVALS") {
            setIntervalRemaining(config.intervalsWork || 120);
          }

          setIsRunning(true);

          // Callback: timer started (GO!)
          onTimerStart?.();
        } else {
          // Check if we crossed a second boundary for countdown beep
          if (remaining !== prevPrepCountdownRef.current && remaining <= 3) {
            onPrepCountdownTick?.(remaining);
          }
          prevPrepCountdownRef.current = remaining;
          setPrepCountdown(remaining);
        }
      }, 100); // Update frequently for smooth countdown
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    isPreparing,
    config.mode,
    config.emomIntervalSeconds,
    config.intervalsWork,
    onPrepCountdownTick,
    onTimerStart,
  ]);

  // Timer logic
  useEffect(() => {
    let animationFrameId: number;

    const updateTimer = () => {
      if (isRunning && startTimeRef.current !== null) {
        const now = Date.now();
        const elapsed = Math.floor(
          (now - startTimeRef.current + pausedTimeRef.current) / 1000
        );
        setElapsedTime(elapsed);

        const totalDuration = getTotalDuration();

        // FOR_TIME counts UP - handle CAP separately
        if (config.mode === "FOR_TIME") {
          const cap = config.forTimeCap || 0;
          if (cap > 0 && elapsed >= cap) {
            setIsCapReached(true);
            if (!config.forTimeContinueAfterCap) {
              setIsRunning(false);
              setIsFinished(true);
              return;
            }
          }
        } else if (totalDuration > 0) {
          // Countdown modes (COUNTDOWN, AMRAP, EMOM total, TABATA total, INTERVALS)
          const remaining = Math.max(0, totalDuration - elapsed);
          setRemainingTime(remaining);

          if (remaining <= 0 && config.mode !== "STOPWATCH") {
            setIsRunning(false);
            setIsFinished(true);
            // Ensure interval display shows 0 when finished
            setIntervalRemaining(0);
            // Callback: timer finished
            onTimerFinish?.();
            return;
          }
        }

        // Handle TABATA phase changes
        if (config.mode === "TABATA") {
          const tabata = computeTabataState(
            elapsed,
            config.tabataWork || 20,
            config.tabataRest || 10
          );
          setCurrentRound(tabata.round);
          if (
            tabata.phase !== prevPhaseRef.current &&
            prevPhaseRef.current !== "IDLE"
          ) {
            onPhaseChange?.(tabata.phase);
          }
          prevPhaseRef.current = tabata.phase;
          setCurrentPhase(tabata.phase);
        }

        // Handle EMOM - countdown per interval, no WORK/REST phases
        if (config.mode === "EMOM") {
          const emom = computeEmomState(
            elapsed,
            config.emomIntervalSeconds || 60,
            config.emomMinutes || 10
          );
          if (emom.minuteTransition) {
            onPhaseChange?.("WORK");
          }
          setCurrentRound(emom.round);
          setIntervalRemaining(emom.intervalRemaining);
          setCurrentPhase("WORK");
        }

        // Handle INTERVALS - work/rest cycles with countdown per phase
        if (config.mode === "INTERVALS") {
          const intervals = computeIntervalsState(
            elapsed,
            config.intervalsWork || 120,
            config.intervalsRest || 60,
            config.intervalsRounds || 10
          );
          if (
            intervals.phase !== prevPhaseRef.current &&
            prevPhaseRef.current !== "IDLE"
          ) {
            onPhaseChange?.(intervals.phase);
          }
          prevPhaseRef.current = intervals.phase;
          setCurrentRound(intervals.round);
          setIntervalRemaining(intervals.intervalRemaining);
          setCurrentPhase(intervals.phase);
        }

        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, config, getTotalDuration, onPhaseChange, onTimerFinish]);

  // Initialize remaining time when mode changes
  useEffect(() => {
    if (!hasStarted) {
      const totalDuration = getTotalDuration();
      setRemainingTime(totalDuration);
      setIsCapReached(false);
      // Initialize EMOM interval remaining
      if (config.mode === "EMOM") {
        setIntervalRemaining(config.emomIntervalSeconds || 60);
      }
      // Initialize INTERVALS interval remaining (starts with work phase)
      if (config.mode === "INTERVALS") {
        setIntervalRemaining(config.intervalsWork || 120);
      }
    }
  }, [
    config.mode,
    config.emomIntervalSeconds,
    config.intervalsWork,
    getTotalDuration,
    hasStarted,
  ]);

  // Actions
  const start = useCallback(() => {
    if (!hasStarted && !isPreparing) {
      // Start preparation countdown
      setIsPreparing(true);
      setPrepCountdown(PREP_COUNTDOWN_SECONDS);
      prepStartTimeRef.current = Date.now();
    } else if (hasStarted && startTimeRef.current === null) {
      // Resume from pause - no prep countdown needed
      startTimeRef.current = Date.now();
      setIsRunning(true);
    }
  }, [hasStarted, isPreparing]);

  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current !== null) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    // Direct reset - no confirmation needed
  }, []);

  const confirmReset = useCallback(() => {
    setIsRunning(false);
    setHasStarted(false);
    setIsFinished(false);
    setIsPreparing(false);
    setPrepCountdown(PREP_COUNTDOWN_SECONDS);
    prepStartTimeRef.current = null;
    setElapsedTime(0);
    setRemainingTime(getTotalDuration());
    setCurrentRound(0);
    setCurrentPhase("IDLE");
    setIsCapReached(false);
    // Reset interval remaining based on mode
    if (config.mode === "EMOM") {
      setIntervalRemaining(config.emomIntervalSeconds || 60);
    } else if (config.mode === "INTERVALS") {
      setIntervalRemaining(config.intervalsWork || 120);
    } else {
      setIntervalRemaining(0);
    }
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [
    getTotalDuration,
    config.mode,
    config.emomIntervalSeconds,
    config.intervalsWork,
  ]);

  const finish = useCallback(() => {
    setIsRunning(false);
    setIsFinished(true);
  }, []);

  return {
    // State
    elapsedTime,
    remainingTime,
    isRunning,
    hasStarted,
    isFinished,
    currentRound,
    currentPhase,
    isCapReached,
    isPreparing,
    prepCountdown,
    // Actions
    start,
    pause,
    reset,
    finish,
    confirmReset,
    // Computed
    getTotalDuration,
    getDisplayTime,
    getTimerStatus,
    getIntervalRemaining,
  };
}
