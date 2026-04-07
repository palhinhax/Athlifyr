"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Clock, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveCountdownProps {
  /** Target unix-ms timestamp to count down to. `null` = loading. */
  targetMs: number | null;
  /** Clock offset (ms): server time - client time. Sourced from the WebSocket hook. */
  serverOffset: number;
  className?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function computeTimeLeft(targetMs: number, serverOffset: number): TimeLeft {
  const now = Date.now() + serverOffset;
  const diff = targetMs - now;
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    total: diff,
  };
}

function padTwo(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Countdown timer driven by the Live Race WebSocket hook.
 *
 * Both the target timestamp and the server clock offset come from the hook
 * (`scheduledStartTimes`, `serverTimeOffset`) so there is exactly one source
 * of truth per page. Previously this component fetched its own time sync,
 * which could diverge from the hook after any reconnect.
 */
export function LiveCountdown({
  targetMs,
  serverOffset,
  className,
}: LiveCountdownProps) {
  const t = useTranslations("liveRace");
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    targetMs !== null ? computeTimeLeft(targetMs, serverOffset) : null
  );

  useEffect(() => {
    if (targetMs === null) {
      setTimeLeft(null);
      return;
    }

    const tick = () => {
      setTimeLeft(computeTimeLeft(targetMs, serverOffset));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetMs, serverOffset]);

  // Loading skeleton while the hook is still syncing with the server.
  if (timeLeft === null || targetMs === null) {
    return (
      <div
        role="status"
        aria-label={t("loading")}
        className={cn(
          "flex flex-col items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/20",
          className
        )}
      >
        <div className="h-4 w-24 animate-pulse rounded bg-amber-200/60 dark:bg-amber-900/40" />
        <div className="h-10 w-40 animate-pulse rounded bg-amber-200/60 dark:bg-amber-900/40" />
      </div>
    );
  }

  if (timeLeft.total <= 0) {
    return (
      <div
        role="status"
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20",
          className
        )}
      >
        <Timer className="h-5 w-5 text-green-600" aria-hidden="true" />
        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
          {t("countdownReady")}
        </span>
      </div>
    );
  }

  const countdownText = `${padTwo(timeLeft.hours)}:${padTwo(timeLeft.minutes)}:${padTwo(timeLeft.seconds)}`;

  return (
    <div
      role="timer"
      aria-label={`${t("countdownLabel")} ${countdownText}`}
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/20",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-600" aria-hidden="true" />
        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
          {t("countdownLabel")}
        </span>
      </div>
      <div
        className="flex items-baseline gap-1 font-mono text-4xl font-bold tabular-nums text-amber-800 dark:text-amber-300"
        aria-hidden="true"
      >
        <span>{padTwo(timeLeft.hours)}</span>
        <span className="animate-pulse">:</span>
        <span>{padTwo(timeLeft.minutes)}</span>
        <span className="animate-pulse">:</span>
        <span>{padTwo(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
