"use client";

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
  maxDisplay?: number;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function LiveLeaderboard({
  leaderboard,
  status,
  spectatorCount,
  connected,
  maxDisplay = 20,
  className,
}: LiveLeaderboardProps) {
  const t = useTranslations("liveRace");

  const displayEntries = leaderboard.slice(0, maxDisplay);

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* Live pulse indicator */}
      {status === "LIVE" && connected && (
        <div className="absolute right-4 top-4 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="text-xs font-medium text-red-500">LIVE</span>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          {t("leaderboardTitle")}
        </CardTitle>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {connected ? (
              <Wifi className="h-3 w-3 text-green-500" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500" />
            )}
            <span>{connected ? t("connected") : t("disconnected")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{t("spectatorCount", { count: spectatorCount })}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 pt-0">
        {/* Status Banner */}
        {status === "WARMUP" && (
          <div className="mb-3 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            {t("warmupMessage")}
          </div>
        )}

        {status === "FINISHED" && (
          <div className="mb-3 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
            {t("finishedMessage")}
          </div>
        )}

        {/* Empty state */}
        {displayEntries.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {status === "WARMUP" ? t("waitingForAthletes") : t("noAthletes")}
          </div>
        )}

        {/* Leaderboard entries */}
        {displayEntries.map((entry) => {
          const statusBadge = getStatusBadge(entry.status, t);

          return (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                entry.rank <= 3 && "bg-muted/50",
                entry.status === "FINISHED" &&
                  "border border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20",
                entry.status === "INACTIVE" && "opacity-60"
              )}
            >
              {/* Rank */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar + Name */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={entry.image ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {entry.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium">
                      {entry.name ?? t("unknownAthlete")}
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
                        <Clock className="h-3 w-3" />
                        {formatTimeMs(entry.finishTimeMs)}
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {entry.distanceAlongRouteM > 1000
                            ? `${(entry.distanceAlongRouteM / 1000).toFixed(1)}km`
                            : `${Math.round(entry.distanceAlongRouteM)}m`}
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
                </div>
              </div>

              {/* Status badge + Gap */}
              <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
                <div className="flex items-center gap-1">
                  {entry.status === "INACTIVE" && (
                    <CloudOff className="h-3 w-3 text-muted-foreground" />
                  )}
                  <Badge variant={statusBadge.variant} className="text-[10px]">
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

        {/* Show more indicator */}
        {leaderboard.length > maxDisplay && (
          <div className="pt-2 text-center text-xs text-muted-foreground">
            {t("moreAthletes", {
              count: leaderboard.length - maxDisplay,
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
