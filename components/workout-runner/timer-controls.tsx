"use client";

/**
 * TimerControls Component
 *
 * Renders the timer control buttons:
 * - Start, Pause, Resume, Reset, Finish
 */

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  CheckCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerControlsProps {
  hasStarted: boolean;
  isRunning: boolean;
  isFinished: boolean;
  isPreparing: boolean;
  isFullscreen: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFinish: () => void;
}

export function TimerControls({
  hasStarted,
  isRunning,
  isFinished,
  isPreparing,
  isFullscreen,
  onStart,
  onPause,
  onReset,
  onFinish,
}: TimerControlsProps) {
  const t = useTranslations("workouts");

  // During preparation countdown, show a waiting message
  if (isPreparing) {
    return (
      <div
        className={cn(
          "mt-6 flex flex-wrap items-center justify-center gap-3",
          isFullscreen && "mt-12 gap-4"
        )}
      >
        <span className="animate-pulse text-lg font-semibold text-yellow-500">
          {t("runner.getReady")}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-6 flex flex-wrap items-center justify-center gap-3",
        isFullscreen && "mt-12 gap-4"
      )}
    >
      {/* Not started yet - Start button */}
      {!hasStarted && !isFinished && (
        <Button
          size="lg"
          className="gap-2 bg-green-600 px-8 text-lg hover:bg-green-700"
          onClick={onStart}
        >
          <PlayIcon className="h-5 w-5" />
          {t("runner.start")}
        </Button>
      )}

      {/* Running - Pause only */}
      {hasStarted && isRunning && !isFinished && (
        <Button
          size="lg"
          variant="outline"
          className="gap-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/20"
          onClick={onPause}
        >
          <PauseIcon className="h-5 w-5" />
          {t("runner.pause")}
        </Button>
      )}

      {/* Paused - Resume, Reset, Finish */}
      {hasStarted && !isRunning && !isFinished && (
        <>
          <Button
            size="lg"
            className="gap-2 bg-green-600 hover:bg-green-700"
            onClick={onStart}
          >
            <PlayIcon className="h-5 w-5" />
            {t("runner.resume")}
          </Button>
          <Button size="lg" variant="outline" onClick={onReset}>
            <RotateCcwIcon className="h-5 w-5" />
            {t("runner.reset")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
            onClick={onFinish}
          >
            <CheckCircleIcon className="h-5 w-5" />
            {t("runner.finish")}
          </Button>
        </>
      )}

      {/* Finished - only Reset (Submit is at bottom) */}
      {isFinished && (
        <Button size="lg" variant="outline" onClick={onReset}>
          <RotateCcwIcon className="h-5 w-5" />
          {t("runner.reset")}
        </Button>
      )}
    </div>
  );
}
