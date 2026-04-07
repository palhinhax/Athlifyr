"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Trophy,
  Medal,
  Clock,
  MapPin,
  Wifi,
  WifiOff,
  Users,
  CloudOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type {
  LeaderboardEntry,
  AthleteStatus,
  EventLiveStatus,
} from "@/hooks/use-live-race";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimeMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getStatusBadge(
  status: AthleteStatus,
  t: ReturnType<typeof useTranslations>
): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  switch (status) {
    case "ACTIVE":
      return { label: t("statusActive"), variant: "default" };
    case "INACTIVE":
      return { label: t("offline"), variant: "secondary" };
    case "OFF_ROUTE":
      return { label: t("statusOffRoute"), variant: "destructive" };
    case "FINISHED":
      return { label: t("statusFinished"), variant: "default" };
    case "DNF":
      return { label: t("statusDnf"), variant: "destructive" };
    case "DSQ":
      return { label: t("statusDsq"), variant: "destructive" };
    default:
      return { label: status, variant: "outline" };
  }
}

function getRankIcon(rank: number): React.ReactNode {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return (
    <span className="text-sm font-bold text-muted-foreground">{rank}</span>
  );
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface LiveLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  status: EventLiveStatus;
  spectatorCount: number;
  connected: boolean;
  /** True while socket.io is retrying after an unexpected drop */
  reconnecting?: boolean;
  maxDisplay?: number;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function LiveLeaderboard({
  leaderboard,
  status,
  spectatorCount,
  connected,
  reconnecting = false,
  maxDisplay = 20,
  className,
}: LiveLeaderboardProps) {
  const t = useTranslations("liveRace");

  // ── Variant filter tabs ──────────────────────────────────────────────────
  const variants = useMemo(() => {
    const seen = new Map<string, string>();
    for (const e of leaderboard) {
      if (e.variantId && !seen.has(e.variantId)) {
        seen.set(e.variantId, e.variantName ?? e.variantId);
      }
    }
    return Array.from(seen, ([id, name]) => ({ id, name }));
  }, [leaderboard]);

  const [activeVariant, setActiveVariant] = useState<string | null>(null);

  const filteredLeaderboard =
    activeVariant === null
      ? leaderboard
      : leaderboard.filter((e) => e.variantId === activeVariant);

  const displayEntries = filteredLeaderboard.slice(0, maxDisplay);

  // Show a skeleton while we're connected to an active race but haven't
  // received the first leaderboard payload yet — otherwise the user briefly
  // sees a confusing "no athletes" empty state on every page load.
  const showLoadingSkeleton =
    connected &&
    leaderboard.length === 0 &&
    (status === "LIVE" || status === "PAUSED" || status === "WARMUP");

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* Live pulse indicator */}
      {status === "LIVE" && connected && (
        <div
          className="absolute right-4 top-4 flex items-center gap-1.5"
          aria-label="Live"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="text-xs font-medium text-red-500">LIVE</span>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" aria-hidden="true" />
          {t("leaderboardTitle")}
        </CardTitle>

        <div
          className="flex items-center gap-3 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {status !== "FINISHED" && status !== "CANCELLED" && (
            <>
              <div className="flex items-center gap-1">
                {connected ? (
                  <Wifi className="h-3 w-3 text-green-500" aria-hidden="true" />
                ) : (
                  <WifiOff
                    className={cn(
                      "h-3 w-3",
                      reconnecting
                        ? "animate-pulse text-amber-500"
                        : "text-red-500"
                    )}
                    aria-hidden="true"
                  />
                )}
                <span>
                  {connected
                    ? t("connected")
                    : reconnecting
                      ? t("reconnecting")
                      : t("disconnected")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" aria-hidden="true" />
                <span>{t("spectatorCount", { count: spectatorCount })}</span>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-1 pt-0">
        {/* Variant filter tabs — only when >1 variant */}
        {variants.length > 1 && (
          <div
            className="mb-3 flex gap-1 overflow-x-auto"
            role="tablist"
            aria-label={t("filterByVariant")}
          >
            <button
              role="tab"
              aria-selected={activeVariant === null}
              onClick={() => setActiveVariant(null)}
              className={cn(
                "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                activeVariant === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t("allVariants")}
            </button>
            {variants.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={activeVariant === v.id}
                onClick={() => setActiveVariant(v.id)}
                className={cn(
                  "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  activeVariant === v.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        {/* Status Banner */}
        {status === "WARMUP" && (
          <div className="mb-3 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            {t("warmupMessage")}
          </div>
        )}

        {status === "PAUSED" && (
          <div className="mb-3 rounded-lg bg-orange-50 p-3 text-center text-sm text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
            {t("pausedMessage")}
          </div>
        )}

        {status === "FINISHED" && (
          <div className="mb-3 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
            {t("finishedMessage")}
          </div>
        )}

        {!connected && reconnecting && (
          <div className="mb-3 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            {t("reconnectingMessage")}
          </div>
        )}

        {/* Loading skeleton — shown on first connect before leaderboard arrives */}
        {showLoadingSkeleton && (
          <div className="space-y-2 py-2" aria-label={t("loading")}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg px-3 py-2"
              >
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-12 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state — only when we're definitely not loading */}
        {displayEntries.length === 0 && !showLoadingSkeleton && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {status === "WARMUP"
              ? t("waitingForAthletes")
              : status === "FINISHED"
                ? t("noResults")
                : t("noAthletes")}
          </div>
        )}

        {/* Leaderboard entries */}
        <div role="list" aria-label={t("leaderboardTitle")}>
          {displayEntries.map((entry) => {
            const statusBadge = getStatusBadge(entry.status, t);
            const displayName = entry.name ?? t("unknownAthlete");
            const distanceLabel =
              entry.distanceAlongRouteM > 1000
                ? `${(entry.distanceAlongRouteM / 1000).toFixed(1)}km`
                : `${Math.round(entry.distanceAlongRouteM)}m`;

            return (
              <div
                key={entry.userId}
                role="listitem"
                aria-label={`${t("rank")} ${entry.rank}, ${displayName}, ${statusBadge.label}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  entry.rank <= 3 && "bg-muted/50",
                  entry.status === "FINISHED" &&
                    "border border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20",
                  entry.status === "INACTIVE" && "opacity-60"
                )}
              >
                {/* Rank */}
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar + Name */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={entry.image ?? undefined}
                      alt={displayName}
                    />
                    <AvatarFallback className="text-xs" aria-hidden="true">
                      {entry.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium">
                        {displayName}
                      </span>
                      {entry.bibNumber && (
                        <span className="flex-shrink-0 text-xs text-muted-foreground">
                          #{entry.bibNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {entry.status === "FINISHED" && entry.finishTimeMs ? (
                        <span className="flex items-center gap-0.5 font-medium text-green-600 dark:text-green-400">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {formatTimeMs(entry.finishTimeMs)}
                        </span>
                      ) : (
                        <>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            {distanceLabel}
                          </span>
                          <span>{Math.round(entry.progressPercent)}%</span>
                        </>
                      )}
                      {entry.lastCheckpointName && (
                        <span className="truncate">
                          {entry.lastCheckpointName}
                        </span>
                      )}
                    </div>
                    {/* Visual progress bar */}
                    {entry.status !== "FINISHED" && (
                      <div
                        className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-valuenow={Math.round(entry.progressPercent)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${t("progress")} ${Math.round(entry.progressPercent)}%`}
                      >
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            entry.progressPercent < 25
                              ? "bg-red-400"
                              : entry.progressPercent < 50
                                ? "bg-orange-400"
                                : entry.progressPercent < 75
                                  ? "bg-yellow-400"
                                  : "bg-green-500"
                          )}
                          style={{
                            width: `${Math.min(100, entry.progressPercent)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status badge + Gap */}
                <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1">
                    {entry.status === "INACTIVE" && (
                      <CloudOff
                        className="h-3 w-3 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <Badge
                      variant={statusBadge.variant}
                      className="text-[10px]"
                    >
                      {statusBadge.label}
                    </Badge>
                  </div>
                  {entry.gap && (
                    <span className="text-xs text-muted-foreground">
                      {entry.gap}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more indicator */}
        {filteredLeaderboard.length > maxDisplay && (
          <div className="pt-2 text-center text-xs text-muted-foreground">
            {t("moreAthletes", {
              count: filteredLeaderboard.length - maxDisplay,
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
