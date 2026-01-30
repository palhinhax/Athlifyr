"use client";

/**
 * Wall Clock - LED Clock Display (Rogue-style)
 *
 * Professional 7-segment LED clock for navigation bar
 * Inspired by Rogue Fitness gym timers with red LED display
 * Shows current time in HH:MM format, updating every second
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { dseg7 } from "@/app/fonts/dseg7";

interface WallClockProps {
  className?: string;
  show24Hour?: boolean;
}

export function WallClock({ className, show24Hour = true }: WallClockProps) {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();

      // Convert to 12-hour format if needed
      if (!show24Hour) {
        hours = hours % 12 || 12;
      }

      const hoursStr = hours.toString().padStart(2, "0");
      const minutesStr = minutes.toString().padStart(2, "0");

      setTime(`${hoursStr}:${minutesStr}`);
    };

    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [show24Hour]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-lg border-2 border-gray-950 bg-gradient-to-b from-gray-950 to-black px-6 py-2",
          // 3D depth effect
          "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(0,0,0,0.9),inset_0_-2px_8px_rgba(0,0,0,0.6)]",
          // Subtle top highlight for plastic shine
          "before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-gray-700/30 before:to-transparent",
          className
        )}
      >
        <span
          className={cn(
            dseg7.className,
            "relative z-10 text-3xl font-bold tracking-[0.15em] text-gray-900"
          )}
        >
          --:--
        </span>
        <span className="absolute bottom-0.5 left-1.5 z-10 text-[8px] font-bold tracking-wider text-white opacity-50">
          ATHLIFYR
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border-2 border-gray-950 bg-gradient-to-b from-gray-950 to-black px-6 py-2",
        // 3D depth effect - multiple shadows for realistic plastic depth
        "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(0,0,0,0.9),inset_0_-2px_8px_rgba(0,0,0,0.6)]",
        // Subtle top highlight for plastic shine
        "before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-gray-700/30 before:to-transparent",
        "transition-all duration-300",
        "hover:shadow-[0_6px_8px_-1px_rgba(0,0,0,0.4),0_4px_6px_-2px_rgba(0,0,0,0.4),0_10px_20px_-4px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(0,0,0,0.8),inset_0_-2px_8px_rgba(0,0,0,0.6)]",
        className
      )}
      title="Current time"
    >
      {/* LED Time Display - Rogue style red */}
      <span
        className={cn(
          dseg7.className,
          "relative z-10 text-3xl font-bold tracking-[0.15em] text-red-600",
          // Intense red LED glow effect
          "drop-shadow-[0_0_12px_rgba(220,38,38,0.8)] drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]",
          "[text-shadow:0_0_10px_rgba(220,38,38,0.9)]"
        )}
      >
        {time}
      </span>

      {/* Athlifyr branding - Rogue style */}
      <span className="absolute bottom-0.5 left-1.5 z-10 text-[8px] font-bold tracking-wider text-white opacity-50">
        ATHLIFYR
      </span>
    </div>
  );
}
