"use client";

import { useTranslations } from "next-intl";
import { Flag, Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CheckpointEvent, FinishEvent } from "@/hooks/use-live-race";

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

function isFinishEvent(
  event: CheckpointEvent | FinishEvent
): event is FinishEvent {
  return "rank" in event && "finishTimeMs" in event;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface LiveEventFeedProps {
  events: (CheckpointEvent | FinishEvent)[];
  className?: string;
}

export function LiveEventFeed({ events, className }: LiveEventFeedProps) {
  const t = useTranslations("liveRace");

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          {t("feedTitle")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {events.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {t("noEvents")}
          </div>
        )}

        {events.map((event, idx) => {
          if (isFinishEvent(event)) {
            return (
              <div
                key={`finish-${event.userId}-${idx}`}
                className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50/50 p-2 dark:border-green-800 dark:bg-green-950/20"
              >
                <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {t("finishEvent", {
                      name: event.athleteName ?? t("unknownAthlete"),
                      rank: event.rank,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeMs(event.finishTimeMs)}
                  </p>
                </div>
              </div>
            );
          }

          // Checkpoint event
          return (
            <div
              key={`cp-${event.userId}-${event.checkpoint.checkpointId}-${idx}`}
              className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted/50"
            >
              <Flag className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">
                    {event.athleteName ?? t("unknownAthlete")}
                  </span>{" "}
                  {t("checkpointEvent", {
                    checkpoint: event.checkpoint.checkpointName,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeMs(event.checkpoint.splitTimeMs)} ·{" "}
                  {formatTimestamp(event.checkpoint.reachedAt)}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
