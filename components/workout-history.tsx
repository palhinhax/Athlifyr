"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CalendarIcon,
  TrophyIcon,
  DumbbellIcon,
  RepeatIcon,
  TimerIcon,
  FlameIcon,
  GaugeIcon,
  ClockIcon,
  RulerIcon,
} from "lucide-react";
import type { WorkoutLogWithDetails } from "@/types/workout";
import { BLOCK_TYPE_INFO, formatTime } from "@/types/workout";
import type { WorkoutBlockType } from "@prisma/client";

// Feeling emojis for visual feedback
const FEELING_CONFIG: Record<number, { emoji: string; color: string }> = {
  1: {
    emoji: "😫",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  2: {
    emoji: "😕",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  3: {
    emoji: "😐",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  4: {
    emoji: "😊",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  5: {
    emoji: "🤩",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
};

// RPE color coding
function getRpeColor(rpe: number): string {
  if (rpe <= 3)
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (rpe <= 5)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  if (rpe <= 7)
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
}

// Map app locale to BCP 47 locale tag for Intl date formatting
const LOCALE_MAP: Record<string, string> = {
  pt: "pt-PT",
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

interface WorkoutHistoryProps {
  userId: string;
}

export function WorkoutHistory({ userId: _userId }: WorkoutHistoryProps) {
  const t = useTranslations("workouts");
  const locale = useLocale();
  const dateLocale = LOCALE_MAP[locale] ?? locale;
  const [logs, setLogs] = useState<WorkoutLogWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workouts/logs`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch workout logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(dateLocale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t("history.noLogs")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const feelingConfig = log.feeling ? FEELING_CONFIG[log.feeling] : null;
        const hasPRs = log.blockResults.some((br) =>
          br.exerciseResults.some(
            (er) => er.isPR || er.sets.some((s) => s.isPR)
          )
        );

        return (
          <Card key={log.id} className="overflow-hidden">
            {/* PR highlight banner */}
            {hasPRs && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 px-4 py-1.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                <TrophyIcon className="h-3.5 w-3.5" />
                {t("log.prDetected")}
              </div>
            )}

            <CardHeader className="px-4 py-3">
              {/* Single compact row: name + session | badges | date */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: name, session title, badges */}
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                  <CardTitle className="text-base leading-tight">
                    {log.workout.name}
                  </CardTitle>
                  {log.session?.title && (
                    <span className="text-xs text-muted-foreground">
                      {log.session.title}
                    </span>
                  )}
                  {log.feeling && feelingConfig && (
                    <Badge
                      variant="secondary"
                      className={`${feelingConfig.color} h-5 border-0 px-1.5 text-[11px]`}
                    >
                      <span className="mr-0.5">{feelingConfig.emoji}</span>
                      {t(`log.feelingLevels.${log.feeling}`)}
                    </Badge>
                  )}
                  {log.perceivedEffort && (
                    <Badge
                      variant="secondary"
                      className={`${getRpeColor(log.perceivedEffort)} h-5 border-0 px-1.5 text-[11px]`}
                    >
                      <GaugeIcon className="mr-0.5 h-2.5 w-2.5" />
                      RPE {log.perceivedEffort}
                    </Badge>
                  )}
                </div>

                {/* Right: date */}
                <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 text-primary" />
                  <span>{formatDate(log.performedAt)}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span>{formatDateTime(log.performedAt)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-4 pt-0">
              {log.notes && (
                <p className="mb-3 rounded-md bg-muted/50 px-3 py-2 text-sm italic text-muted-foreground">
                  &ldquo;{log.notes}&rdquo;
                </p>
              )}

              {/* Block Results */}
              {log.blockResults.length > 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="details" className="border-b-0">
                    <AccordionTrigger className="rounded-md px-3 py-2 text-sm hover:bg-muted/50 hover:no-underline">
                      {t("history.viewDetails")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {log.blockResults.map((blockResult) => {
                          const blockType = blockResult.block
                            .type as WorkoutBlockType;
                          const blockInfo = BLOCK_TYPE_INFO[blockType];

                          return (
                            <div
                              key={blockResult.id}
                              className="overflow-hidden rounded-lg border"
                            >
                              {/* Block header */}
                              <div
                                className={`flex items-center justify-between px-3 py-2 ${blockInfo?.color || "bg-muted"}`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {blockInfo?.icon}
                                  </span>
                                  <span className="text-sm font-semibold">
                                    {blockResult.block.name ||
                                      blockInfo?.label ||
                                      blockResult.block.type}
                                  </span>
                                </div>
                                {blockResult.completedTime && (
                                  <Badge
                                    variant="outline"
                                    className="border-current bg-white/50 dark:bg-black/20"
                                  >
                                    <ClockIcon className="mr-1 h-3 w-3" />
                                    {formatTime(blockResult.completedTime)}
                                  </Badge>
                                )}
                              </div>

                              {/* AMRAP / FOR_TIME summary */}
                              {(blockResult.completedRounds !== null ||
                                blockResult.extraReps !== null) && (
                                <div className="flex items-center gap-3 border-b bg-muted/30 px-3 py-2">
                                  {blockResult.completedRounds !== null && (
                                    <div className="flex items-center gap-1.5 text-sm">
                                      <RepeatIcon className="h-3.5 w-3.5 text-primary" />
                                      <span className="font-medium">
                                        {blockResult.completedRounds}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {t("log.completedRounds")}
                                      </span>
                                    </div>
                                  )}
                                  {blockResult.extraReps !== null &&
                                    blockResult.extraReps > 0 && (
                                      <div className="flex items-center gap-1.5 text-sm">
                                        <span className="text-muted-foreground">
                                          +
                                        </span>
                                        <span className="font-medium">
                                          {blockResult.extraReps}
                                        </span>
                                        <span className="text-muted-foreground">
                                          {t("log.extraReps")}
                                        </span>
                                      </div>
                                    )}
                                </div>
                              )}

                              {/* Exercise results */}
                              {blockResult.exerciseResults.length > 0 && (
                                <div className="divide-y">
                                  {blockResult.exerciseResults.map(
                                    (exResult) => {
                                      const hasData =
                                        exResult.actualReps ||
                                        exResult.actualWeight ||
                                        exResult.actualTime ||
                                        exResult.actualDistance ||
                                        exResult.actualCalories ||
                                        exResult.sets.length > 0;
                                      const exercisePR =
                                        exResult.isPR ||
                                        exResult.sets.some((s) => s.isPR);

                                      return (
                                        <div
                                          key={exResult.id}
                                          className={`px-3 py-2 ${exercisePR ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}`}
                                        >
                                          {/* Exercise name + inline metrics */}
                                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <div className="flex items-center gap-1.5">
                                              <DumbbellIcon className="h-3 w-3 text-muted-foreground" />
                                              <span className="text-sm font-medium">
                                                {exResult.exercise.name}
                                              </span>
                                              {exercisePR && (
                                                <Badge className="h-4 border-0 bg-gradient-to-r from-yellow-400 to-amber-500 px-1 text-[10px] text-white">
                                                  <TrophyIcon className="mr-0.5 h-2.5 w-2.5" />
                                                  PR
                                                </Badge>
                                              )}
                                            </div>

                                            {/* Inline simple metrics (non-strength) */}
                                            {exResult.sets.length === 0 &&
                                              hasData && (
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                  {exResult.actualReps && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                      <RepeatIcon className="h-2.5 w-2.5" />
                                                      <span className="font-medium text-foreground">
                                                        {exResult.actualReps}
                                                      </span>
                                                      reps
                                                    </span>
                                                  )}
                                                  {exResult.actualWeight && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                      <DumbbellIcon className="h-2.5 w-2.5" />
                                                      <span className="font-medium text-foreground">
                                                        {exResult.actualWeight}
                                                      </span>
                                                      {exResult.actualWeightUnit?.toLowerCase() ||
                                                        "kg"}
                                                    </span>
                                                  )}
                                                  {exResult.actualTime && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                      <TimerIcon className="h-2.5 w-2.5" />
                                                      <span className="font-medium text-foreground">
                                                        {formatTime(
                                                          exResult.actualTime
                                                        )}
                                                      </span>
                                                    </span>
                                                  )}
                                                  {exResult.actualDistance && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                      <RulerIcon className="h-2.5 w-2.5" />
                                                      <span className="font-medium text-foreground">
                                                        {
                                                          exResult.actualDistance
                                                        }
                                                      </span>
                                                      {exResult.actualDistanceUnit?.toLowerCase() ||
                                                        "m"}
                                                    </span>
                                                  )}
                                                  {exResult.actualCalories && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                      <FlameIcon className="h-2.5 w-2.5" />
                                                      <span className="font-medium text-foreground">
                                                        {
                                                          exResult.actualCalories
                                                        }
                                                      </span>
                                                      cal
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                          </div>

                                          {/* Sets display (for strength) */}
                                          {exResult.sets.length > 0 && (
                                            <div className="mt-1.5 flex flex-wrap gap-1 pl-4">
                                              {exResult.sets.map((set, idx) => (
                                                <Badge
                                                  key={set.id}
                                                  variant="outline"
                                                  className={`font-mono text-xs ${
                                                    set.isPR
                                                      ? "border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                                      : ""
                                                  }`}
                                                >
                                                  <span className="mr-1 text-muted-foreground">
                                                    S{idx + 1}
                                                  </span>
                                                  {set.reps && (
                                                    <span>{set.reps}×</span>
                                                  )}
                                                  {set.weight && (
                                                    <span>
                                                      {set.weight}
                                                      {set.weightUnit?.toLowerCase() ||
                                                        "kg"}
                                                    </span>
                                                  )}
                                                  {set.isPR && (
                                                    <TrophyIcon className="ml-1 h-2.5 w-2.5 text-yellow-500" />
                                                  )}
                                                </Badge>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
          </Card>
        );
      })}

      {logs.length >= 10 && (
        <div className="text-center">
          <Button variant="outline">{t("history.loadMore")}</Button>
        </div>
      )}
    </div>
  );
}
