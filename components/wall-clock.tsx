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
          "relative flex flex-col overflow-hidden rounded-lg border border-gray-900 bg-black px-6 py-2 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]",
          className
        )}
      >
        <span
          className={cn(
            dseg7.className,
            "text-3xl font-bold tracking-[0.15em] text-gray-900"
          )}
        >
          --:--
        </span>
        <span className="absolute bottom-0.5 left-1.5 text-[8px] font-bold tracking-wider text-white opacity-50">
          ATHLIFYR
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border border-gray-900 bg-black px-6 py-2 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] transition-all duration-300",
        "hover:shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]",
        className
      )}
      title="Current time"
    >
      {/* LED Time Display - Rogue style red */}
      <span
        className={cn(
          dseg7.className,
          "text-3xl font-bold tracking-[0.15em] text-red-600",
          // Intense red LED glow effect
          "drop-shadow-[0_0_12px_rgba(220,38,38,0.8)] drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]",
          "[text-shadow:0_0_10px_rgba(220,38,38,0.9)]"
        )}
      >
        {time}
      </span>

      {/* Athlifyr branding - Rogue style */}
      <span className="absolute bottom-0.5 left-1.5 text-[8px] font-bold tracking-wider text-white opacity-50">
        ATHLIFYR
      </span>
    </div>
  );
}
