"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Clock, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveCountdownProps {
  eventId: string;
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
 * Countdown timer that syncs with server time.
 * Displays HH:MM:SS until the event start time.
 */
export function LiveCountdown({ eventId, className }: LiveCountdownProps) {
  const t = useTranslations("liveRace");
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [serverOffset, setServerOffset] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  // Fetch server time and compute offset
  const syncTime = useCallback(async () => {
    try {
      const beforeFetch = Date.now();
      const res = await fetch(`/api/events/${eventId}/live-time`);
      if (!res.ok) return;
      const afterFetch = Date.now();
      const data = (await res.json()) as {
        serverTime: string;
        eventStartDate: string;
        variantStartTimes: Record<string, string | null>;
      };

      // Estimate one-way latency
      const roundTrip = afterFetch - beforeFetch;
      const serverTimeMs = new Date(data.serverTime).getTime();
      const clientAtReceive = beforeFetch + roundTrip / 2;
      const offset = serverTimeMs - clientAtReceive;
      setServerOffset(offset);

      // Use earliest variant start time (or event start)
      const times = Object.values(data.variantStartTimes)
        .filter((v): v is string => v !== null)
        .map((v) => new Date(v).getTime());

      const earliest =
        times.length > 0
          ? Math.min(...times)
          : new Date(data.eventStartDate).getTime();

      setTargetTime(earliest);
    } catch {
      // Ignore — countdown will show nothing
    }
  }, [eventId]);

  // Sync on mount
  useEffect(() => {
    void syncTime();
  }, [syncTime]);

  // Tick every second
  useEffect(() => {
    if (targetTime === null) return;

    const tick = () => {
      setTimeLeft(computeTimeLeft(targetTime, serverOffset));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTime, serverOffset]);

  if (timeLeft === null || targetTime === null) {
    return null;
  }

  if (timeLeft.total <= 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20",
          className
        )}
      >
        <Timer className="h-5 w-5 text-green-600" />
        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
          {t("countdownReady")}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/20",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
          {t("countdownLabel")}
        </span>
      </div>
      <div className="flex items-baseline gap-1 font-mono text-4xl font-bold tabular-nums text-amber-800 dark:text-amber-300">
        <span>{padTwo(timeLeft.hours)}</span>
        <span className="animate-pulse">:</span>
        <span>{padTwo(timeLeft.minutes)}</span>
        <span className="animate-pulse">:</span>
        <span>{padTwo(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
