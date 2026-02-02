"use client";

/**
 * WorkoutBlocks Component
 *
 * Displays workout blocks and exercises in read-only view.
 * Each block can have a play button to auto-configure and start the timer.
 */

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import type {
  WorkoutWithBlocks,
  WorkoutBlockWithExercises,
} from "@/types/workout";
import { BLOCK_TYPE_INFO, formatTime } from "@/types/workout";
import type { TimerModeConfig, WorkoutTimerMode } from "./types";

interface WorkoutBlocksProps {
  workout: WorkoutWithBlocks;
  /** Callback when play button is clicked - receives config for the block */
  onPlayBlock?: (config: TimerModeConfig) => void;
  /** Whether a timer is currently running (disables play buttons) */
  isTimerRunning?: boolean;
}

/**
 * Maps a workout block type to a timer mode
 */
function getTimerModeForBlock(blockType: string): WorkoutTimerMode | null {
  switch (blockType) {
    case "AMRAP":
      return "AMRAP";
    case "EMOM":
      return "EMOM";
    case "FOR_TIME":
    case "CHIPPER":
      return "FOR_TIME";
    case "TABATA":
      return "TABATA";
    case "REST":
      return "COUNTDOWN";
    default:
      // WARMUP, STRENGTH, COOLDOWN, SKILL - use stopwatch or no timer
      return null;
  }
}

/**
 * Creates a timer config from a workout block
 */
function createTimerConfigFromBlock(
  block: WorkoutBlockWithExercises
): TimerModeConfig | null {
  const mode = getTimerModeForBlock(block.type);
  if (!mode) return null;

  const config: TimerModeConfig = { mode };

  switch (mode) {
    case "AMRAP":
      // AMRAP uses timeCap as duration
      config.duration = block.timeCap || 600; // default 10 min
      break;

    case "EMOM":
      // EMOM uses rounds as minutes/intervals, workTime as interval duration
      config.emomMinutes = block.rounds || 10;
      // Use workTime if specified, otherwise default to 60s intervals
      config.emomIntervalSeconds = block.workTime || 60;
      break;

    case "FOR_TIME":
      // FOR_TIME uses timeCap as optional cap
      config.forTimeCap = block.timeCap || 0;
      config.forTimeContinueAfterCap = true;
      break;

    case "TABATA":
      // TABATA uses workTime and rounds (rest is standard 10s for Tabata)
      config.tabataWork = block.workTime || 20;
      config.tabataRest = 10; // Standard Tabata rest
      config.tabataRounds = block.rounds || 8;
      break;

    case "COUNTDOWN":
      // REST block uses timeCap or workTime as countdown duration
      config.duration = block.timeCap || block.workTime || 60;
      break;
  }

  return config;
}

export function WorkoutBlocks({
  workout,
  onPlayBlock,
  isTimerRunning = false,
}: WorkoutBlocksProps) {
  const t = useTranslations("workouts");

  const handlePlayBlock = (block: WorkoutBlockWithExercises) => {
    const config = createTimerConfigFromBlock(block);
    if (config && onPlayBlock) {
      onPlayBlock(config);
    }
  };

  return (
    <>
      {workout.blocks.map((block) => {
        const canAutoPlay = getTimerModeForBlock(block.type) !== null;

        return (
          <Card
            key={block.id}
            style={{
              borderLeftColor: BLOCK_TYPE_INFO[block.type].color,
              borderLeftWidth: "4px",
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    style={{
                      backgroundColor: `${BLOCK_TYPE_INFO[block.type].color}20`,
                      color: BLOCK_TYPE_INFO[block.type].color,
                    }}
                  >
                    {t(`blocks.types.${block.type}`)}
                  </Badge>
                  {block.name && (
                    <span className="font-medium">{block.name}</span>
                  )}
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
                {/* Play button for compatible blocks */}
                {canAutoPlay && onPlayBlock && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
                    onClick={() => handlePlayBlock(block)}
                    disabled={isTimerRunning}
                    title={t("runner.playBlock")}
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t("runner.playBlock")}
                    </span>
                  </Button>
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
                      <div className="font-medium">
                        {exercise.exercise.name}
                      </div>
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
        );
      })}
    </>
  );
}
