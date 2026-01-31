"use client";

/**
 * WorkoutRunner Component
 *
 * Displays a workout in execution mode with:
 * - Large wall timer at the top (using WallClock style - 7-segment LED)
 * - Workout blocks and exercises in read-only view (no input fields)
 * - Start/Pause/Stop controls
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PlayIcon,
  PauseIcon,
  StopCircleIcon,
  ArrowLeftIcon,
  ExpandIcon,
  ShrinkIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { WorkoutWithBlocks } from "@/types/workout";
import { BLOCK_TYPE_INFO, formatTime } from "@/types/workout";
import { WallClock } from "@/components/wall-clock";

// ============================================================================
// Main Component
// ============================================================================

interface WorkoutRunnerProps {
  workout: WorkoutWithBlocks;
  onFinish?: (elapsedSeconds: number) => void;
}

export function WorkoutRunner({ workout, onFinish }: WorkoutRunnerProps) {
  const t = useTranslations("workouts");
  const router = useRouter();

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  // Timer logic
  useEffect(() => {
    let animationFrameId: number;

    const updateTimer = () => {
      if (isRunning && startTimeRef.current !== null) {
        const now = Date.now();
        const elapsed = Math.floor(
          (now - startTimeRef.current + pausedTimeRef.current) / 1000
        );
        setElapsedTime(elapsed);
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning]);

  const handleStart = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    setIsRunning(true);
  }, [hasStarted]);

  const handlePause = useCallback(() => {
    if (isRunning && startTimeRef.current !== null) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    setIsRunning(false);
  }, [isRunning]);

  const handleStop = useCallback(() => {
    setShowStopDialog(true);
  }, []);

  const confirmStop = useCallback(() => {
    setIsRunning(false);
    setShowStopDialog(false);

    if (onFinish) {
      onFinish(elapsedTime);
    } else {
      router.push(`/workouts/${workout.id}/log?elapsed=${elapsedTime}`);
    }
  }, [elapsedTime, onFinish, router, workout.id]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Timer Header - Fixed at top */}
      <div className="sticky top-0 z-50 bg-black">
        {/* Back button and title (only when not fullscreen) */}
        {!isFullscreen && (
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
                asChild
              >
                <Link href="/workouts">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {workout.name}
                </h1>
                <p className="text-sm text-gray-400">
                  {t("runner.inProgress")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <ShrinkIcon className="h-5 w-5" />
                ) : (
                  <ExpandIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* WallClock Display */}
        <div
          className={cn(
            "flex flex-col items-center justify-center bg-black p-4",
            isFullscreen ? "min-h-[60vh] p-8" : "py-6"
          )}
        >
          <WallClock size={isFullscreen ? "xl" : "lg"} />

          {/* Controls */}
          <div
            className={cn(
              "mt-6 flex items-center gap-4",
              isFullscreen && "mt-12"
            )}
          >
            {!hasStarted ? (
              <Button
                size="lg"
                className="gap-2 bg-green-600 px-8 text-lg hover:bg-green-700"
                onClick={handleStart}
              >
                <PlayIcon className="h-5 w-5" />
                {t("runner.start")}
              </Button>
            ) : (
              <>
                {isRunning ? (
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-yellow-500 px-6 text-yellow-500 hover:bg-yellow-500/20"
                    onClick={handlePause}
                  >
                    <PauseIcon className="h-5 w-5" />
                    {t("runner.pause")}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="gap-2 bg-green-600 px-6 hover:bg-green-700"
                    onClick={handleStart}
                  >
                    <PlayIcon className="h-5 w-5" />
                    {t("runner.resume")}
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-red-500 px-6 text-red-500 hover:bg-red-500/20"
                  onClick={handleStop}
                >
                  <StopCircleIcon className="h-5 w-5" />
                  {t("runner.finish")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Workout Content - Scrollable */}
      {!isFullscreen && (
        <div className="flex-1 space-y-4 bg-background p-4">
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
          ))}
        </div>
      )}

      {/* Stop Confirmation Dialog */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("runner.finishTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("runner.finishDescription", {
                time: formatTime(elapsedTime),
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("form.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStop}>
              {t("runner.finishAndLog")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
