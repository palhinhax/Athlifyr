"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarIcon, TrophyIcon } from "lucide-react";
import type { WorkoutLogWithDetails } from "@/types/workout";
import { formatTime } from "@/types/workout";

interface WorkoutHistoryProps {
  userId: string;
}

export function WorkoutHistory({ userId }: WorkoutHistoryProps) {
  const t = useTranslations("workouts");
  const [logs, setLogs] = useState<WorkoutLogWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workouts/logs?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Failed to fetch workout logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
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
      {logs.map((log) => (
        <Card key={log.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{log.workout.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                {formatDate(log.performedAt)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {log.feeling && (
                <Badge variant="secondary">
                  {t(`log.feelingLevels.${log.feeling}`)}
                </Badge>
              )}

              {log.perceivedEffort && (
                <Badge variant="outline">RPE: {log.perceivedEffort}</Badge>
              )}
            </div>

            {log.notes && (
              <p className="mt-3 text-sm text-muted-foreground">{log.notes}</p>
            )}

            {/* Block Results */}
            {log.blockResults.length > 0 && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-sm">
                    {t("history.viewDetails")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {log.blockResults.map((blockResult) => (
                        <div
                          key={blockResult.id}
                          className="rounded border bg-muted/50 p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">
                              {blockResult.block.name || blockResult.block.type}
                            </span>
                            {blockResult.completedTime && (
                              <span className="text-sm text-muted-foreground">
                                {formatTime(blockResult.completedTime)}
                              </span>
                            )}
                          </div>

                          {(blockResult.completedRounds !== null ||
                            blockResult.extraReps !== null) && (
                            <div className="mb-2 text-sm">
                              {blockResult.completedRounds !== null && (
                                <span>
                                  {blockResult.completedRounds}{" "}
                                  {t("log.completedRounds")}
                                </span>
                              )}
                              {blockResult.extraReps !== null && (
                                <span className="ml-2">
                                  +{blockResult.extraReps} {t("log.extraReps")}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Exercise Results */}
                          {blockResult.exerciseResults.length > 0 && (
                            <div className="space-y-2">
                              {blockResult.exerciseResults.map((exResult) => (
                                <div
                                  key={exResult.id}
                                  className="flex items-start justify-between text-sm"
                                >
                                  <span>{exResult.exercise.name}</span>
                                  <div className="text-right">
                                    {exResult.sets.length > 0 ? (
                                      <div className="flex flex-wrap justify-end gap-1">
                                        {exResult.sets.map((set, idx) => (
                                          <Badge
                                            key={set.id}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {idx + 1}:{" "}
                                            {set.reps && `${set.reps}r`}
                                            {set.weight &&
                                              ` @ ${set.weight}${set.weightUnit || "kg"}`}
                                            {set.isPR && (
                                              <TrophyIcon className="ml-1 inline h-3 w-3 text-yellow-500" />
                                            )}
                                          </Badge>
                                        ))}
                                      </div>
                                    ) : (
                                      <>
                                        {exResult.actualReps && (
                                          <span>
                                            {exResult.actualReps} reps
                                          </span>
                                        )}
                                        {exResult.actualWeight && (
                                          <span className="ml-1">
                                            @ {exResult.actualWeight}
                                            {exResult.actualWeightUnit || "kg"}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      ))}

      {logs.length >= 10 && (
        <div className="text-center">
          <Button variant="outline">Load more</Button>
        </div>
      )}
    </div>
  );
}
