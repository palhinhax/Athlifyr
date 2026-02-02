"use client";

/**
 * WorkoutRunner Component
 *
 * Displays a workout in execution mode with:
 * - Large wall timer at the top with multiple modes (STOPWATCH, COUNTDOWN, EMOM, TABATA, AMRAP, FOR_TIME)
 * - Timer controls directly below the clock
 * - Workout blocks and exercises in read-only view
 * - Submit results button at the bottom of the page
 * - Audio alerts for countdown, transitions, and finish
 * - Fullscreen mode hides sidebar and topbar, keeping the same layout
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { WorkoutWithBlocks } from "@/types/workout";
import { WallClock } from "@/components/wall-clock";

import { useTimer } from "./hooks/use-timer";
import { useAudioAlerts } from "./hooks/use-audio-alerts";
import { useClockVisibility } from "./hooks/use-clock-visibility";
import { TimerHeader } from "./timer-header";
import { TimerSettings } from "./timer-settings";
import { TimerControls } from "./timer-controls";
import { WorkoutBlocks } from "./workout-blocks";
import { SubmitSection } from "./submit-section";
import type { TimerModeConfig } from "./types";
import { DEFAULT_TIMER_CONFIG } from "./types";

interface WorkoutRunnerProps {
  workout: WorkoutWithBlocks;
  onFinish?: (elapsedSeconds: number) => void;
}

export function WorkoutRunner({ workout, onFinish }: WorkoutRunnerProps) {
  const router = useRouter();

  // Audio alerts
  const audioAlerts = useAudioAlerts();

  // Clock visibility
  const clockVisibility = useClockVisibility();

  // Store audio functions in refs to prevent callback recreation
  const audioAlertsRef = useRef(audioAlerts);
  audioAlertsRef.current = audioAlerts;

  // Timer mode configuration
  const [timerConfig, setTimerConfig] =
    useState<TimerModeConfig>(DEFAULT_TIMER_CONFIG);
  const [showModeSettings, setShowModeSettings] = useState(false);

  // Audio callback handlers - use refs to avoid recreating on every render
  const handlePrepCountdownTick = useCallback(() => {
    audioAlertsRef.current.playCountdownBeep();
  }, []);

  const handleTimerStart = useCallback(() => {
    audioAlertsRef.current.playGoBeep();
  }, []);

  const handlePhaseChange = useCallback(() => {
    audioAlertsRef.current.playTransitionBeep();
  }, []);

  const handleTimerFinish = useCallback(() => {
    audioAlertsRef.current.playFinishBeep();
  }, []);

  // Timer hook with audio callbacks
  const timer = useTimer({
    config: timerConfig,
    onPrepCountdownTick: handlePrepCountdownTick,
    onTimerStart: handleTimerStart,
    onPhaseChange: handlePhaseChange,
    onTimerFinish: handleTimerFinish,
  });

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle reset - direct reset without confirmation
  const handleReset = useCallback(() => {
    timer.confirmReset();
  }, [timer]);

  // Submit results
  const handleSubmitResults = useCallback(() => {
    if (onFinish) {
      onFinish(timer.elapsedTime);
    } else {
      router.push(`/workouts/${workout.id}/log?elapsed=${timer.elapsedTime}`);
    }
  }, [timer.elapsedTime, onFinish, router, workout.id]);

  // Handle play block - auto-configure and start timer
  const handlePlayBlock = useCallback(
    (config: TimerModeConfig) => {
      // Reset current timer if running
      if (timer.hasStarted) {
        timer.confirmReset();
      }
      // Apply the block's config
      setTimerConfig(config);
      // Start the timer after a short delay to allow config to apply
      setTimeout(() => {
        timer.start();
      }, 100);
    },
    [timer]
  );

  // Get mode label for display
  const getModeLabel = useCallback((): string => {
    switch (timerConfig.mode) {
      case "STOPWATCH":
        return "STOPWATCH";
      case "COUNTDOWN":
        return `COUNTDOWN ${Math.floor((timerConfig.duration || 600) / 60)}:${String((timerConfig.duration || 600) % 60).padStart(2, "0")}`;
      case "EMOM":
        return `EMOM x${timerConfig.emomMinutes || 10}`;
      case "TABATA":
        return `TABATA x${timerConfig.tabataRounds || 8}`;
      case "AMRAP":
        return `AMRAP ${Math.floor((timerConfig.duration || 600) / 60)}`;
      case "FOR_TIME": {
        const cap = timerConfig.forTimeCap || 0;
        if (timer.isCapReached) {
          return "FOR TIME • CAP";
        }
        if (cap > 0) {
          const capMinutes = Math.floor(cap / 60);
          const capSeconds = cap % 60;
          return `FOR TIME CAP ${capMinutes}:${String(capSeconds).padStart(2, "0")}`;
        }
        return "FOR TIME";
      }
      default:
        return timerConfig.mode;
    }
  }, [timerConfig, timer.isCapReached]);

  // Get left display value (2 green digits)
  const getLeftDisplayValue = useCallback((): number | "inactive" => {
    // During prep countdown, don't show left display
    if (timer.isPreparing) {
      return "inactive";
    }
    if (
      timerConfig.mode === "TABATA" ||
      timerConfig.mode === "EMOM" ||
      timerConfig.mode === "INTERVALS"
    ) {
      return timer.hasStarted ? timer.currentRound : "inactive";
    }
    return "inactive";
  }, [
    timerConfig.mode,
    timer.hasStarted,
    timer.currentRound,
    timer.isPreparing,
  ]);

  // Get display time (prep countdown or actual timer)
  const getDisplaySeconds = useCallback((): number => {
    if (timer.isPreparing) {
      return timer.prepCountdown;
    }
    return timer.getDisplayTime();
  }, [timer]);

  // Get status label
  const getStatusLabel = useCallback((): string => {
    if (timer.isPreparing) {
      return "GET READY";
    }
    if (timer.isFinished) {
      return "DONE";
    }
    if (timer.isRunning) {
      return timer.currentPhase === "REST" ? "REST" : "GO";
    }
    return "READY";
  }, [
    timer.isPreparing,
    timer.isFinished,
    timer.isRunning,
    timer.currentPhase,
  ]);

  // Single layout - fullscreen just adds overlay styling to hide sidebar/topbar
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-background",
        isFullscreen && "fixed inset-0 z-[100] overflow-auto"
      )}
    >
      {/* Timer Header - Fixed at top */}
      <div className="sticky top-0 z-10 bg-background">
        <TimerHeader
          workoutName={workout.name}
          isFullscreen={isFullscreen}
          hasStarted={timer.hasStarted}
          isMuted={audioAlerts.isMuted}
          isClockVisible={clockVisibility.isClockVisible}
          onToggleMute={audioAlerts.toggleMute}
          onToggleClockVisibility={clockVisibility.toggleClockVisibility}
          onToggleSettings={() => setShowModeSettings(!showModeSettings)}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* Mode Selection (only when not started and not preparing and clock visible) */}
        {clockVisibility.isClockVisible &&
          !timer.hasStarted &&
          !timer.isPreparing &&
          showModeSettings && (
            <TimerSettings
              config={timerConfig}
              onConfigChange={setTimerConfig}
              disabled={timer.hasStarted || timer.isPreparing}
            />
          )}

        {/* WallClock Display - Timer Mode (only when clock is visible) */}
        {clockVisibility.isClockVisible && (
          <div className="flex flex-col items-center justify-center p-2 py-4 sm:p-4 sm:py-6">
            <div className="w-full max-w-full">
              <WallClock
                size="responsive"
                className="mx-auto w-full max-w-[calc(100vw-2rem)] scale-[0.85] transform sm:w-auto sm:max-w-none sm:scale-100"
                timerMode={{
                  seconds: getDisplaySeconds(),
                  // Map "preparing" to "running" for WallClock (it animates)
                  status: (timer.getTimerStatus() === "preparing"
                    ? "running"
                    : timer.getTimerStatus()) as
                    | "idle"
                    | "running"
                    | "paused"
                    | "done",
                  phase:
                    timer.currentPhase === "IDLE"
                      ? "work"
                      : (timer.currentPhase.toLowerCase() as "work" | "rest"),
                  statusLabel: getStatusLabel(),
                  modeLabel: timer.isPreparing ? "GET READY" : getModeLabel(),
                  leftDisplayValue: getLeftDisplayValue(),
                  isWarning:
                    (timer.remainingTime > 0 && timer.remainingTime <= 10) ||
                    (timer.isPreparing && timer.prepCountdown <= 3),
                }}
              />
            </div>

            {/* Timer Controls */}
            <TimerControls
              hasStarted={timer.hasStarted}
              isRunning={timer.isRunning}
              isFinished={timer.isFinished}
              isPreparing={timer.isPreparing}
              isFullscreen={isFullscreen}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={handleReset}
              onFinish={timer.finish}
            />
          </div>
        )}
      </div>

      {/* Workout Content - Scrollable */}
      <div className="flex-1 space-y-4 bg-background p-4">
        <WorkoutBlocks
          workout={workout}
          onPlayBlock={handlePlayBlock}
          isTimerRunning={timer.isRunning || timer.isPreparing}
          showPlayButtons={clockVisibility.isClockVisible}
        />
        <SubmitSection onSubmit={handleSubmitResults} />
      </div>
    </div>
  );
}
