"use client";

/**
 * Timer Controls
 *
 * Control panel for wall timer with start/pause/reset buttons
 */

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimerState } from "@/types/timer";

interface TimerControlsProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSettings?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onResume,
  onReset,
  onSettings,
  disabled = false,
  className,
}: TimerControlsProps) {
  const handlePrimaryAction = () => {
    if (timerState === "READY" || timerState === "FINISHED") {
      onStart();
    } else if (timerState === "RUNNING") {
      onPause();
    } else if (timerState === "PAUSED") {
      onResume();
    }
  };

  const getPrimaryButtonLabel = () => {
    switch (timerState) {
      case "READY":
        return "Start";
      case "RUNNING":
        return "Pause";
      case "PAUSED":
        return "Resume";
      case "FINISHED":
        return "Start Again";
      default:
        return "Start";
    }
  };

  const getPrimaryIcon = () => {
    if (timerState === "RUNNING") {
      return <Pause className="h-6 w-6" />;
    }
    return <Play className="h-6 w-6" />;
  };

  const canReset = timerState !== "READY";

  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {/* Reset Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={onReset}
        disabled={disabled || !canReset}
        className={cn(
          "h-14 w-14 rounded-full",
          "hover:bg-destructive hover:text-destructive-foreground",
          "transition-all duration-200"
        )}
      >
        <RotateCcw className="h-6 w-6" />
        <span className="sr-only">Reset</span>
      </Button>

      {/* Primary Action Button (Start/Pause/Resume) */}
      <Button
        size="lg"
        onClick={handlePrimaryAction}
        disabled={disabled}
        className={cn(
          "h-16 w-16 rounded-full",
          "text-lg font-bold",
          timerState === "RUNNING"
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-green-500 hover:bg-green-600",
          "transform transition-all duration-200 hover:scale-105"
        )}
      >
        {getPrimaryIcon()}
        <span className="sr-only">{getPrimaryButtonLabel()}</span>
      </Button>

      {/* Settings Button */}
      {onSettings && (
        <Button
          variant="outline"
          size="lg"
          onClick={onSettings}
          disabled={disabled}
          className={cn(
            "h-14 w-14 rounded-full",
            "hover:bg-accent",
            "transition-all duration-200"
          )}
        >
          <Settings className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </Button>
      )}
    </div>
  );
}
