"use client";

/**
 * Wall Timer Display
 *
 * Large, high-visibility timer display inspired by CrossFit box wall timers
 * Supports multiple brightness levels and high contrast mode
 */

import { cn } from "@/lib/utils";
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

  // Glow effect (stronger at higher brightness)
  const glowClasses = {
    1: "",
    2: "drop-shadow-[0_0_5px_currentColor]",
    3: "drop-shadow-[0_0_10px_currentColor]",
    4: "drop-shadow-[0_0_15px_currentColor]",
    5: "drop-shadow-[0_0_25px_currentColor]",
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center",
        "select-none bg-black",
        brightnessClasses[brightness],
        className
      )}
    >
      {/* Main Timer Display */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 sm:gap-4",
          "font-mono font-bold tracking-wider",
          "transition-all duration-300",
          phaseColors[phase],
          glowClasses[brightness]
        )}
      >
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <span className="text-[15vw] leading-none sm:text-[12vw] md:text-[10vw]">
            {minutesStr}
          </span>
        </div>

        {/* Separator */}
        <span className="animate-pulse text-[12vw] leading-none sm:text-[10vw] md:text-[8vw]">
          :
        </span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <span className="text-[15vw] leading-none sm:text-[12vw] md:text-[10vw]">
            {secondsStr}
          </span>
        </div>

        {/* Milliseconds (smaller) */}
        <div className="flex flex-col items-center">
          <span className="text-[8vw] leading-none opacity-70 sm:text-[6vw] md:text-[5vw]">
            .{millisecondsStr}
          </span>
        </div>
      </div>

      {/* Round Counter (if applicable) */}
      {totalRounds > 0 && (
        <div
          className={cn(
            "mt-4 sm:mt-6 md:mt-8",
            "text-3xl font-bold sm:text-4xl md:text-5xl",
            "font-mono tracking-wider",
            phaseColors[phase],
            glowClasses[brightness]
          )}
        >
          <span className="opacity-70">Round</span>{" "}
          <span className="text-5xl sm:text-6xl md:text-7xl">
            {currentRound}
          </span>
          <span className="opacity-70"> / {totalRounds}</span>
        </div>
      )}

      {/* Phase Label */}
      <div
        className={cn(
          "mt-4 sm:mt-6 md:mt-8",
          "text-2xl font-bold uppercase sm:text-3xl md:text-4xl",
          "font-mono tracking-[0.3em]",
          phaseColors[phase],
          glowClasses[brightness]
        )}
      >
        {phase !== "IDLE" && phase}
      </div>

      {/* Progress Bar (optional) */}
      {displayState.progress > 0 && (
        <div className="mt-8 w-full max-w-4xl px-4">
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-linear",
                phase === "WORK" ? "bg-green-400" : "bg-blue-400"
              )}
              style={{ width: `${displayState.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
