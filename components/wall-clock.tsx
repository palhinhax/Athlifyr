"use client";

/**
 * Wall Clock - Small LED Clock Display
 *
 * Small 7-segment LED clock for navigation bar
 * Shows current time in HH:MM format, updating every second
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { dseg7 } from "@/app/fonts/dseg7";
import { Clock } from "lucide-react";

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
          "relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-800 bg-black px-4 py-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-600" />
          <span className={cn(dseg7.className, "text-xl text-gray-800")}>
            --:--
          </span>
        </div>
        <span className="text-[9px] font-semibold tracking-wide text-white opacity-60">
          Athlifyr
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-800 bg-black px-4 py-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300",
        "hover:border-gray-700",
        className
      )}
      title="Current time"
    >
      {/* Clock icon and LED time */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-600" />
        <span
          className={cn(
            dseg7.className,
            "text-xl font-bold tracking-wider text-green-400",
            // LED glow effect - enhanced
            "drop-shadow-[0_0_10px_currentColor] drop-shadow-[0_0_20px_currentColor]",
            "[text-shadow:0_0_8px_currentColor]"
          )}
        >
          {time}
        </span>
      </div>

      {/* Athlifyr branding */}
      <span className="text-[9px] font-semibold tracking-wide text-white opacity-60">
        Athlifyr
      </span>
    </div>
  );
}
