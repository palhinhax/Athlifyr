"use client";

/**
 * Wall Timer Display
 *
 * Large, high-visibility 7-segment LED display inspired by CrossFit box wall timers
 * Uses authentic DSEG7 font for realistic LED appearance
 * Supports multiple brightness levels and high contrast mode
 */

import { cn } from "@/lib/utils";
import { dseg7 } from "@/app/fonts/dseg7";
import type { TimerDisplayState, BrightnessLevel } from "@/types/timer";

interface WallTimerDisplayProps {
  displayState: TimerDisplayState;
  brightness?: BrightnessLevel;
  highContrast?: boolean;
  className?: string;
}

export function WallTimerDisplay({
  displayState,
  brightness = 3,
  highContrast = false,
  className,
}: WallTimerDisplayProps) {
  const { minutes, seconds, milliseconds, currentRound, totalRounds, phase } =
    displayState;

  // Format time components
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");
  const millisecondsStr = Math.floor(milliseconds / 10)
    .toString()
    .padStart(2, "0");

  // Brightness levels (opacity + glow intensity)
  const brightnessClasses = {
    1: "opacity-40",
    2: "opacity-60",
    3: "opacity-80",
    4: "opacity-90",
    5: "opacity-100",
  };

  // Phase colors
  const phaseColors = {
    WORK: highContrast
      ? "text-white border-white"
      : "text-green-400 border-green-400",
    REST: highContrast
      ? "text-white border-white"
      : "text-blue-400 border-blue-400",
    TRANSITION: "text-yellow-400 border-yellow-400",
    IDLE: highContrast
      ? "text-white border-white"
      : "text-gray-400 border-gray-400",
  };

  // LED glow effect (stronger at higher brightness) - multiple shadows for realistic LED
  const glowClasses = {
    1: "",
    2: "drop-shadow-[0_0_8px_currentColor]",
    3: "drop-shadow-[0_0_12px_currentColor] drop-shadow-[0_0_20px_currentColor]",
    4: "drop-shadow-[0_0_15px_currentColor] drop-shadow-[0_0_30px_currentColor]",
    5: "drop-shadow-[0_0_20px_currentColor] drop-shadow-[0_0_40px_currentColor] drop-shadow-[0_0_60px_currentColor]",
  };

  // Background glow for LED effect
  const bgGlowClasses = {
    1: "",
    2: "shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]",
    3: "shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]",
    4: "shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]",
    5: "shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]",
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center",
        "select-none bg-black",
        brightnessClasses[brightness],
        bgGlowClasses[brightness],
        className
      )}
    >
      {/* Main Timer Display - 7-Segment LED Style */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 sm:gap-4",
          dseg7.className,
          "font-bold tracking-[0.05em]",
          "transition-all duration-300",
          phaseColors[phase],
          glowClasses[brightness],
          // LED segment appearance
          "relative",
          "[text-shadow:0_0_10px_currentColor]"
        )}
        style={{
          letterSpacing: "0.1em",
        }}
      >
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <span className="text-[15vw] leading-[0.9] sm:text-[12vw] md:text-[10vw]">
            {minutesStr}
          </span>
        </div>

        {/* Separator - LED style colon */}
        <span className="animate-pulse text-[12vw] leading-[0.9] sm:text-[10vw] md:text-[8vw]">
          :
        </span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <span className="text-[15vw] leading-[0.9] sm:text-[12vw] md:text-[10vw]">
            {secondsStr}
          </span>
        </div>

        {/* Milliseconds (smaller) - LED style */}
        <div className="flex flex-col items-center">
          <span className="text-[8vw] leading-[0.9] opacity-70 sm:text-[6vw] md:text-[5vw]">
            .{millisecondsStr}
          </span>
        </div>
      </div>

      {/* Round Counter (if applicable) - LED style */}
      {totalRounds > 0 && (
        <div
          className={cn(
            "mt-4 sm:mt-6 md:mt-8",
            "text-3xl font-bold sm:text-4xl md:text-5xl",
            dseg7.className,
            "tracking-wider",
            phaseColors[phase],
            glowClasses[brightness],
            "[text-shadow:0_0_8px_currentColor]"
          )}
        >
          <span className="opacity-70">Round</span>{" "}
          <span className="text-5xl sm:text-6xl md:text-7xl">
            {currentRound}
          </span>
          <span className="opacity-70"> / {totalRounds}</span>
        </div>
      )}

      {/* Phase Label - LED style */}
      <div
        className={cn(
          "mt-4 sm:mt-6 md:mt-8",
          "text-2xl font-bold uppercase sm:text-3xl md:text-4xl",
          dseg7.className,
          "tracking-[0.3em]",
          phaseColors[phase],
          glowClasses[brightness],
          "[text-shadow:0_0_8px_currentColor]"
        )}
      >
        {phase !== "IDLE" && phase}
      </div>

      {/* Progress Bar (optional) - LED style */}
      {displayState.progress > 0 && (
        <div className="mt-8 w-full max-w-4xl px-4">
          <div className="h-2 overflow-hidden rounded-full bg-gray-900 shadow-[inset_0_0_10px_rgba(0,0,0,0.9)]">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-linear",
                phase === "WORK"
                  ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
                  : "bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
              )}
              style={{ width: `${displayState.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
