"use client";

/**
 * useWallTimer Hook
 *
 * Timer engine for wall timer display with support for:
 * - INTERVAL, EMOM, TABATA, AMRAP, FOR_TIME, STOPWATCH modes
 * - Sound notifications
 * - Precise timestamp-based timing
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  TimerConfig,
  TimerState,
  TimerPhase,
  TimerDisplayState,
  SoundSettings,
} from "@/types/timer";

interface UseWallTimerOptions {
  config?: TimerConfig;
  soundSettings?: SoundSettings;
  onComplete?: () => void;
}

interface UseWallTimerReturn {
  displayState: TimerDisplayState;
  timerState: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  configure: (config: TimerConfig) => void;
}

const DEFAULT_DISPLAY_STATE: TimerDisplayState = {
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
  currentRound: 0,
  totalRounds: 0,
  phase: "IDLE",
  state: "READY",
  progress: 0,
  elapsed: 0,
  remaining: 0,
};

export function useWallTimer({
  config: initialConfig,
  soundSettings,
  onComplete,
}: UseWallTimerOptions = {}): UseWallTimerReturn {
  const [config, setConfig] = useState<TimerConfig | undefined>(initialConfig);
  const [timerState, setTimerState] = useState<TimerState>("READY");
  const [displayState, setDisplayState] = useState<TimerDisplayState>(
    DEFAULT_DISPLAY_STATE
  );

  // Refs for precise timing
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Calculate total duration based on config
  const getTotalDuration = useCallback((): number => {
    if (!config) return 0;

    switch (config.mode) {
      case "INTERVAL": {
        const { workTime, restTime, rounds } = config.config;
        return (workTime + restTime) * rounds * 1000;
      }
      case "EMOM": {
        return config.config.duration * 60 * 1000;
      }
      case "TABATA": {
        const { workTime, restTime, rounds } = config.config;
        return (workTime + restTime) * rounds * 1000;
      }
      case "AMRAP": {
        return config.config.duration * 1000;
      }
      case "FOR_TIME": {
        if (config.config.countDown && config.config.duration) {
          return config.config.duration * 1000;
        }
        return 0; // Unlimited for count up
      }
      case "STOPWATCH":
      case "CLOCK":
        return 0; // Unlimited
    }
  }, [config]);

  // Get current phase and round based on elapsed time
  const getPhaseAndRound = useCallback(
    (
      elapsed: number
    ): { phase: TimerPhase; round: number; totalRounds: number } => {
      if (!config) {
        return { phase: "IDLE", round: 0, totalRounds: 0 };
      }

      const elapsedSeconds = Math.floor(elapsed / 1000);

      switch (config.mode) {
        case "INTERVAL": {
          const { workTime, restTime, rounds } = config.config;
          const cycleTime = workTime + restTime;
          const round = Math.floor(elapsedSeconds / cycleTime) + 1;
          const positionInCycle = elapsedSeconds % cycleTime;
          const phase: TimerPhase =
            positionInCycle < workTime ? "WORK" : "REST";
          return { phase, round: Math.min(round, rounds), totalRounds: rounds };
        }
        case "EMOM": {
          const totalMinutes = config.config.duration;
          const workTime = config.config.workTime || 50;
          const round = Math.floor(elapsedSeconds / 60) + 1;
          const positionInMinute = elapsedSeconds % 60;
          const phase: TimerPhase =
            positionInMinute < workTime ? "WORK" : "REST";
          return {
            phase,
            round: Math.min(round, totalMinutes),
            totalRounds: totalMinutes,
          };
        }
        case "TABATA": {
          const { workTime, restTime, rounds } = config.config;
          const cycleTime = workTime + restTime;
          const round = Math.floor(elapsedSeconds / cycleTime) + 1;
          const positionInCycle = elapsedSeconds % cycleTime;
          const phase: TimerPhase =
            positionInCycle < workTime ? "WORK" : "REST";
          return { phase, round: Math.min(round, rounds), totalRounds: rounds };
        }
        case "AMRAP":
        case "FOR_TIME":
          return { phase: "WORK", round: 1, totalRounds: 1 };
        case "STOPWATCH":
        case "CLOCK":
          return { phase: "IDLE", round: 0, totalRounds: 0 };
      }
    },
    [config]
  );

  // Update display state
  const updateDisplay = useCallback(
    (elapsed: number) => {
      const totalDuration = getTotalDuration();
      const { phase, round, totalRounds } = getPhaseAndRound(elapsed);

      // Calculate remaining time for countdown modes
      const remaining =
        totalDuration > 0 ? Math.max(0, totalDuration - elapsed) : 0;

      // Calculate display time
      let displayMs = elapsed;
      if (config?.mode === "FOR_TIME" && config.config.countDown) {
        displayMs = remaining;
      } else if (
        ["AMRAP", "INTERVAL", "TABATA", "EMOM"].includes(config?.mode || "")
      ) {
        displayMs = remaining;
      }

      const totalSeconds = Math.floor(displayMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const milliseconds = Math.floor((displayMs % 1000) / 10);

      // Calculate progress
      const progress = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;

      setDisplayState({
        minutes,
        seconds,
        milliseconds,
        currentRound: round,
        totalRounds,
        phase,
        state: timerState,
        progress: Math.min(100, progress),
        elapsed,
        remaining,
      });

      // Check for completion
      if (totalDuration > 0 && elapsed >= totalDuration) {
        setTimerState("FINISHED");
        onComplete?.();
        return true; // Timer finished
      }

      return false;
    },
    [config, getTotalDuration, getPhaseAndRound, timerState, onComplete]
  );

  // Animation loop
  useEffect(() => {
    if (timerState !== "RUNNING") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = () => {
      if (startTimeRef.current === null) return;

      const now = Date.now();
      const elapsed = now - startTimeRef.current + pausedTimeRef.current;

      const finished = updateDisplay(elapsed);

      if (!finished && timerState === "RUNNING") {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timerState, updateDisplay]);

  // Play sound (placeholder - implement with actual audio)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _playSound = useCallback(
    (_type: string) => {
      if (!soundSettings || soundSettings.volume === 0) return;
      // TODO: Implement actual sound playback
      // Could use Web Audio API or preloaded audio elements
    },
    [soundSettings]
  );

  // Controls
  const start = useCallback(() => {
    if (timerState === "READY" || timerState === "FINISHED") {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      setTimerState("RUNNING");
    }
  }, [timerState]);

  const pause = useCallback(() => {
    if (timerState === "RUNNING" && startTimeRef.current !== null) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
      setTimerState("PAUSED");
    }
  }, [timerState]);

  const resume = useCallback(() => {
    if (timerState === "PAUSED") {
      startTimeRef.current = Date.now();
      setTimerState("RUNNING");
    }
  }, [timerState]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    setTimerState("READY");
    setDisplayState(DEFAULT_DISPLAY_STATE);
  }, []);

  const configure = useCallback(
    (newConfig: TimerConfig) => {
      setConfig(newConfig);
      reset();
    },
    [reset]
  );

  return {
    displayState,
    timerState,
    start,
    pause,
    resume,
    reset,
    configure,
  };
}
