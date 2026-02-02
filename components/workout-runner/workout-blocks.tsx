"use client";

/**
 * WorkoutBlocks Component
 *
 * Displays workout blocks and exercises in read-only view.
 */

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WorkoutWithBlocks } from "@/types/workout";
import { BLOCK_TYPE_INFO, formatTime } from "@/types/workout";

interface WorkoutBlocksProps {
  workout: WorkoutWithBlocks;
}

export function WorkoutBlocks({ workout }: WorkoutBlocksProps) {
  const t = useTranslations("workouts");

  return (
    <>
      {workout.blocks.map((block) => (
        <Card
          key={block.id}
          style={{
            borderLeftColor: BLOCK_TYPE_INFO[block.type].color,
            borderLeftWidth: "4px",
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                style={{
                  backgroundColor: `${BLOCK_TYPE_INFO[block.type].color}20`,
                  color: BLOCK_TYPE_INFO[block.type].color,
                }}
              >
                {t(`blocks.types.${block.type}`)}
              </Badge>
              {block.name && <span className="font-medium">{block.name}</span>}
              {block.rounds && (
                <span className="text-sm text-muted-foreground">
                  {block.rounds} {t("blocks.rounds")}
                </span>
              )}
              {block.timeCap && (
                <span className="text-sm text-muted-foreground">
                  {t("blocks.timeCap")}: {formatTime(block.timeCap)}
                </span>
              )}
              {block.workTime && (
                <span className="text-sm text-muted-foreground">
                  {t("blocks.workTime")}: {formatTime(block.workTime)}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {block.exercises.map((exercise, exerciseIndex) => (
                <div
                  key={exercise.id}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {exerciseIndex + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{exercise.exercise.name}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {exercise.prescribedReps && (
                        <span>
                          {exercise.prescribedReps} {t("exercises.reps")}
                        </span>
                      )}
                      {exercise.prescribedSets && (
                        <span>
                          {exercise.prescribedSets} {t("exercises.sets")}
                        </span>
                      )}
                      {exercise.prescribedWeight && (
                        <span>
                          {exercise.prescribedWeight}{" "}
                          {exercise.prescribedWeightUnit || "kg"}
                        </span>
                      )}
                      {exercise.prescribedTime && (
                        <span>{formatTime(exercise.prescribedTime)}</span>
                      )}
                      {exercise.prescribedDistance && (
                        <span>
                          {exercise.prescribedDistance}{" "}
                          {exercise.prescribedDistanceUnit || "m"}
                        </span>
                      )}
                      {exercise.prescribedCalories && (
                        <span>{exercise.prescribedCalories} cal</span>
                      )}
                    </div>
                    {exercise.notes && (
                      <p className="mt-1 text-sm italic text-muted-foreground">
                        {exercise.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {block.notes && (
              <p className="mt-3 text-sm italic text-muted-foreground">
                {block.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
