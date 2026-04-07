"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Eye, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  useLiveRace,
  type EventLiveStatus,
  type LeaderboardEntry,
} from "@/hooks/use-live-race";
import { LiveLeaderboard } from "@/components/live-leaderboard";
import { LiveEventFeed } from "@/components/live-event-feed";
import { LiveCountdown } from "@/components/live-countdown";
import { cn } from "@/lib/utils";

interface LiveRaceSectionProps {
  eventId: string;
  /** DB liveStatus — used as fallback until WebSocket connects */
  dbStatus?: EventLiveStatus;
  /** Route points for map rendering (per variant) */
  variants?: {
    variantId: string;
    variantName: string;
    routePoints: [number, number][];
  }[];
  className?: string;
}

/**
 * LiveRace section for the event page.
 * Connects to the Live Service as a spectator and renders:
 *   - Connection status
 *   - Countdown timer (during CHECK_IN_OPEN / WARMUP)
 *   - Live leaderboard
 *   - Recent events feed (checkpoint, finish notifications)
 *
 * Auto-activates when mounted (spectator-driven lazy activation).
 */
export function LiveRaceSection({
  eventId,
  dbStatus,
  className,
}: LiveRaceSectionProps) {
  const t = useTranslations("liveRace");
  const { toast } = useToast();

  // Terminal states — render static results without connecting to the live server
  const isTerminalFromDb = dbStatus === "FINISHED" || dbStatus === "CANCELLED";

  // Fetch persisted final results for terminal races
  const [finalLeaderboard, setFinalLeaderboard] = useState<LeaderboardEntry[]>(
    []
  );
  const [finalResultsError, setFinalResultsError] = useState(false);

  useEffect(() => {
    if (!isTerminalFromDb) return;
    let cancelled = false;

    async function fetchFinalResults() {
      try {
        const res = await fetch(`/api/events/${eventId}/final-leaderboard`);
        if (!res.ok) {
          if (!cancelled) setFinalResultsError(true);
          return;
        }
        const data = (await res.json()) as { entries: LeaderboardEntry[] };
        if (!cancelled) {
          setFinalLeaderboard(data.entries ?? []);
          setFinalResultsError(false);
        }
      } catch {
        if (!cancelled) setFinalResultsError(true);
      }
    }

    fetchFinalResults();
    return () => {
      cancelled = true;
    };
  }, [isTerminalFromDb, eventId]);

  const {
    connected,
    reconnecting,
    status,
    leaderboard,
    spectatorCount,
    recentEvents,
    error,
    scheduledStartTimes,
    serverTimeOffset,
  } = useLiveRace({
    eventId,
    role: "spectator",
    autoConnect: !isTerminalFromDb,
    initialStatus: dbStatus,
  });

  // Surface server-emitted errors and connection errors via toast. Without
  // this the user saw no feedback at all when the live server refused the
  // join or dropped the connection with an error payload.
  const lastShownError = useRef<string | null>(null);
  useEffect(() => {
    if (error && error !== lastShownError.current) {
      lastShownError.current = error;
      toast({
        title: t("errorTitle"),
        description: error,
        variant: "destructive",
      });
    } else if (!error) {
      lastShownError.current = null;
    }
  }, [error, toast, t]);

  // Treat a live-resolved FINISHED/CANCELLED status as terminal as well:
  // if the race finishes while the spectator is on-page, we should stop
  // reconnecting and rely on persisted results.
  const isTerminal =
    isTerminalFromDb || status === "FINISHED" || status === "CANCELLED";

  // Use the DB status for terminal races (no WebSocket needed)
  const effectiveStatus = isTerminalFromDb ? dbStatus : status;
  // Use persisted results for terminal races, live data otherwise
  const effectiveLeaderboard = isTerminalFromDb
    ? finalLeaderboard
    : leaderboard;

  // Earliest scheduled variant start time — drives the countdown display.
  const countdownTargetMs = useMemo(() => {
    if (!scheduledStartTimes) return null;
    const times = Object.values(scheduledStartTimes);
    return times.length > 0 ? Math.min(...times) : null;
  }, [scheduledStartTimes]);

  // Don't render anything if the race hasn't been prepared yet
  if (effectiveStatus === "SCHEDULED" && !connected) {
    return null;
  }

  const showCountdown =
    effectiveStatus === "CHECK_IN_OPEN" || effectiveStatus === "WARMUP";

  return (
    <section
      className={cn("space-y-4", className)}
      aria-label={t("sectionTitle")}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/liverace.png"
            alt="LiveRace"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <h2 className="text-xl font-semibold">{t("sectionTitle")}</h2>
        </div>

        <div
          className="flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          {effectiveStatus === "LIVE" && (
            <Badge className="animate-pulse bg-red-500 text-white">LIVE</Badge>
          )}
          {effectiveStatus === "CHECK_IN_OPEN" && (
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-600"
            >
              {t("checkInOpen")}
            </Badge>
          )}
          {effectiveStatus === "WARMUP" && (
            <Badge
              variant="outline"
              className="border-amber-500 text-amber-600"
            >
              {t("warmup")}
            </Badge>
          )}
          {effectiveStatus === "PAUSED" && (
            <Badge
              variant="outline"
              className="border-orange-500 text-orange-600"
            >
              {t("paused")}
            </Badge>
          )}
          {effectiveStatus === "CANCELLED" && (
            <Badge variant="outline" className="border-red-500 text-red-600">
              {t("cancelled")}
            </Badge>
          )}
          {effectiveStatus === "FINISHED" && (
            <Badge
              variant="outline"
              className="border-green-500 text-green-600"
            >
              {t("finished")}
            </Badge>
          )}
        </div>

        {/* Only show spectator count for active races (connected to live server) */}
        {!isTerminal && spectatorCount > 0 && (
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            <span>{t("watching", { count: spectatorCount })}</span>
          </div>
        )}
      </div>

      {/* Countdown Timer — shown during CHECK_IN_OPEN and WARMUP */}
      {showCountdown && (
        <LiveCountdown
          targetMs={countdownTargetMs}
          serverOffset={serverTimeOffset}
        />
      )}

      {/* Final-results fetch failure banner — otherwise spectators on a
          terminal race would see an empty leaderboard with no explanation. */}
      {isTerminalFromDb && finalResultsError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{t("finalResultsError")}</span>
        </div>
      )}

      {/* Leaderboard + Feed side by side on desktop */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Leaderboard — 2 cols */}
        <LiveLeaderboard
          leaderboard={effectiveLeaderboard}
          status={effectiveStatus}
          spectatorCount={isTerminal ? 0 : spectatorCount}
          connected={isTerminal ? false : connected}
          reconnecting={isTerminal ? false : reconnecting}
          maxDisplay={20}
          className="lg:col-span-2"
        />

        {/* Event Feed — 1 col */}
        <LiveEventFeed events={recentEvents} className="lg:col-span-1" />
      </div>
    </section>
  );
}
