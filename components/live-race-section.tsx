"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  // Terminal states — render static results without connecting to the live server
  const isTerminal = dbStatus === "FINISHED" || dbStatus === "CANCELLED";

  // Fetch persisted final results for terminal races
  const [finalLeaderboard, setFinalLeaderboard] = useState<LeaderboardEntry[]>(
    []
  );

  useEffect(() => {
    if (!isTerminal) return;

    async function fetchFinalResults() {
      try {
        const res = await fetch(`/api/events/${eventId}/final-leaderboard`);
        if (!res.ok) return;
        const data = (await res.json()) as { entries: LeaderboardEntry[] };
        setFinalLeaderboard(data.entries ?? []);
      } catch {
        // Silently fail — empty leaderboard is acceptable
      }
    }

    fetchFinalResults();
  }, [isTerminal, eventId]);

  const { connected, status, leaderboard, spectatorCount, recentEvents } =
    useLiveRace({
      eventId,
      role: "spectator",
      autoConnect: !isTerminal,
      initialStatus: dbStatus,
    });

  // Use the DB status for terminal races (no WebSocket needed)
  const effectiveStatus = isTerminal ? dbStatus : status;
  // Use persisted results for terminal races, live data otherwise
  const effectiveLeaderboard = isTerminal ? finalLeaderboard : leaderboard;

  // Don't render anything if the race hasn't been prepared yet
  if (effectiveStatus === "SCHEDULED" && !connected) {
    return null;
  }

  const showCountdown =
    effectiveStatus === "CHECK_IN_OPEN" || effectiveStatus === "WARMUP";

  return (
    <div className={cn("space-y-4", className)}>
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
          <h2 className="text-xl font-bold">{t("sectionTitle")}</h2>
        </div>

        <div className="flex items-center gap-2">
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
      {showCountdown && <LiveCountdown eventId={eventId} />}

      {/* Leaderboard + Feed side by side on desktop */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Leaderboard — 2 cols */}
        <LiveLeaderboard
          leaderboard={effectiveLeaderboard}
          status={effectiveStatus}
          spectatorCount={isTerminal ? 0 : spectatorCount}
          connected={isTerminal ? false : connected}
          maxDisplay={20}
          className="lg:col-span-2"
        />

        {/* Event Feed — 1 col */}
        <LiveEventFeed events={recentEvents} className="lg:col-span-1" />
      </div>
    </div>
  );
}
