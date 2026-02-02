"use client";

/**
 * Status Badges Component
 *
 * LED-style badges for WORK/REST/PAUSED/DONE states
 */

import { cn } from "@/lib/utils";
import type { StatusBadgesProps } from "./types";

export function StatusBadges({ phase, status, badgeSize }: StatusBadgesProps) {
  const isPreparing = status === "preparing";
  const isWorkPhase = phase === "work" || (!phase && status === "running");
  const isRestPhase = phase === "rest";
  const isPaused = status === "paused";

  return (
    <div className="flex gap-1">
      {/* PREP badge - only shows during preparation countdown */}
      {isPreparing && (
        <span
          className={cn(
            "animate-pulse rounded-sm bg-yellow-600 font-bold leading-none text-yellow-100 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
            badgeSize
          )}
        >
          READY
        </span>
      )}
      {/* WORK badge */}
      {!isPreparing && (
        <span
          className={cn(
            "rounded-sm font-bold leading-none transition-all",
            badgeSize,
            isWorkPhase && !isPaused && status !== "done"
              ? "bg-red-600 text-red-100 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              : "bg-red-950/50 text-red-900/50"
          )}
        >
          WORK
        </span>
      )}
      {/* REST badge */}
      {!isPreparing && (
        <span
          className={cn(
            "rounded-sm font-bold leading-none transition-all",
            badgeSize,
            isRestPhase && !isPaused && status !== "done"
              ? "bg-green-600 text-green-100 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
              : "bg-green-950/50 text-green-900/50"
          )}
        >
          REST
        </span>
      )}
      {/* PAUSED badge - only shows when paused */}
      {isPaused && (
        <span
          className={cn(
            "animate-pulse rounded-sm bg-yellow-600 font-bold leading-none text-yellow-100 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
            badgeSize
          )}
        >
          PAUSED
        </span>
      )}
      {/* DONE badge - only shows when done */}
      {status === "done" && (
        <span
          className={cn(
            "rounded-sm bg-green-600 font-bold leading-none text-green-100 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
            badgeSize
          )}
        >
          DONE
        </span>
      )}
    </div>
  );
}
