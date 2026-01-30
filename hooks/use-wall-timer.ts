"use client";

/**
 * Wall Timer Hook
 *
 * React hook wrapper for WallTimerEngine
 * Manages timer state and provides controls
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { WallTimerEngine } from "@/lib/timer-engine";
import type {
  TimerConfig,
  TimerDisplayState,
  TimerPhase,
  TimerState,
  SoundSettings,
  SoundType,
} from "@/types/timer";

export interface UseWallTimerOptions {
  config?: TimerConfig;
  soundSettings?: SoundSettings;
  onComplete?: () => void;
}

export interface UseWallTimerReturn {
  // State
  displayState: TimerDisplayState;
  timerState: TimerState;
  phase: TimerPhase;

  // Controls
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;

  // Configuration
  configure: (config: TimerConfig) => void;

  // Sound
  playSound: (type: SoundType) => void;
}

export function useWallTimer(
  options: UseWallTimerOptions = {}
): UseWallTimerReturn {
  const engineRef = useRef<WallTimerEngine | null>(null);

  // State
  const [displayState, setDisplayState] = useState<TimerDisplayState>({
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
  });

  const [timerState, setTimerState] = useState<TimerState>("READY");
  const [phase, setPhase] = useState<TimerPhase>("IDLE");

  // Track previous phase for sound triggers
  const prevPhaseRef = useRef<TimerPhase>("IDLE");
  const prevRoundRef = useRef<number>(0);
  const soundSettingsRef = useRef<SoundSettings>(
    options.soundSettings || {
      volume: 3,
      enableCountdown: true,
      enableTransitions: true,
      enableCompletion: true,
    }
  );

  // ============================================================================
  // Sound System
  // ============================================================================

  const playSound = useCallback((type: SoundType) => {
    const settings = soundSettingsRef.current;

    if (settings.volume === 0) return;

    // Create appropriate sound based on type
    const audioContext = new (
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Volume scaling (0-5 -> 0.0-1.0)
    const volumeScale = settings.volume / 5;

    switch (type) {
      case "beep-short":
        if (!settings.enableTransitions) return;
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3 * volumeScale;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;

      case "beep-long":
        if (!settings.enableCompletion) return;
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.4 * volumeScale;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        break;

      case "countdown-3":
      case "countdown-2":
      case "countdown-1":
        if (!settings.enableCountdown) return;
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.2 * volumeScale;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;

      case "countdown-go":
        if (!settings.enableCountdown) return;
        oscillator.frequency.value = 1200;
        gainNode.gain.value = 0.4 * volumeScale;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
    }
  }, []);

  // ============================================================================
  // Timer Engine Setup
  // ============================================================================

  useEffect(() => {
    // Create timer engine
    const engine = new WallTimerEngine();
    engineRef.current = engine;

    // Configure if initial config provided
    if (options.config) {
      engine.configure(options.config);
    }

    // Setup callbacks
    engine.onTick((state) => {
      setDisplayState(state);

      // Handle countdown sounds (3, 2, 1 before phase change)
      if (
        state.state === "RUNNING" &&
        state.remaining > 0 &&
        state.remaining <= 3000
      ) {
        const seconds = Math.ceil(state.remaining / 1000);
        const prevSeconds = Math.ceil((state.remaining + 16) / 1000); // ~60fps

        if (seconds !== prevSeconds) {
          if (seconds === 3) playSound("countdown-3");
          else if (seconds === 2) playSound("countdown-2");
          else if (seconds === 1) playSound("countdown-1");
        }
      }
    });

    engine.onStateChange((state) => {
      setTimerState(state);

      if (state === "FINISHED" && options.onComplete) {
        options.onComplete();
      }
    });

    engine.onPhaseChange((newPhase) => {
      setPhase(newPhase);

      // Play sound on phase change
      if (prevPhaseRef.current !== newPhase && newPhase !== "IDLE") {
        playSound("beep-short");
      }

      prevPhaseRef.current = newPhase;
    });

    engine.onRoundChange((round) => {
      // Play sound on round change
      if (prevRoundRef.current !== round && round > 0) {
        playSound("countdown-go");
      }

      prevRoundRef.current = round;
    });

    engine.onComplete(() => {
      playSound("beep-long");
    });

    // Cleanup
    return () => {
      engine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playSound]);

  // Update sound settings when changed
  useEffect(() => {
    if (options.soundSettings) {
      soundSettingsRef.current = options.soundSettings;
    }
  }, [options.soundSettings]);

  // ============================================================================
  // Controls
  // ============================================================================

  const start = useCallback(() => {
    engineRef.current?.start();
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
    prevPhaseRef.current = "IDLE";
    prevRoundRef.current = 0;
  }, []);

  const configure = useCallback((config: TimerConfig) => {
    engineRef.current?.configure(config);
  }, []);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    displayState,
    timerState,
    phase,
    start,
    pause,
    resume,
    reset,
    configure,
    playSound,
  };
}
