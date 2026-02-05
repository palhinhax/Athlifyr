"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { WeightUnit, DistanceUnit } from "@prisma/client";
import type { WorkoutWithBlocks, CreateWorkoutLogInput } from "@/types/workout";
import { TimeInput } from "@/components/time-input";
import { BLOCK_TYPE_INFO, formatTime } from "@/types/workout";

interface WorkoutLoggerProps {
  workout: WorkoutWithBlocks;
  sessionId?: string;
}

interface ExerciseSetData {
  setNumber: number;
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
  notes?: string;
}

interface ExerciseResultData {
  blockExerciseId: string;
  exerciseId: string;
  actualReps?: number;
  actualWeight?: number;
  actualWeightUnit?: WeightUnit;
  actualTime?: number;
  actualDistance?: number;
  actualDistanceUnit?: DistanceUnit;
  actualCalories?: number;
  sets: ExerciseSetData[];
}

interface BlockResultData {
  blockId: string;
  completedRounds?: number;
  extraReps?: number;
  completedTime?: number;
  notes?: string;
  exerciseResults: ExerciseResultData[];
}

export function WorkoutLogger({ workout, sessionId }: WorkoutLoggerProps) {
  const t = useTranslations("workouts");
  const { toast } = useToast();
  const router = useRouter();

  // Form state
  const [notes, setNotes] = useState("");
  const [feeling, setFeeling] = useState<number | undefined>();
  const [perceivedEffort, setPerceivedEffort] = useState<number | undefined>();
  const [blockResults, setBlockResults] = useState<BlockResultData[]>(
    workout.blocks.map((block) => ({
      blockId: block.id,
      completedRounds: undefined,
      extraReps: undefined,
      completedTime: undefined,
      notes: undefined,
      exerciseResults: block.exercises.map((ex) => ({
        blockExerciseId: ex.id,
        exerciseId: ex.exercise.id,
        actualReps: ex.prescribedReps || undefined,
        actualWeight: ex.prescribedWeight || undefined,
        actualWeightUnit: ex.prescribedWeightUnit || undefined,
        sets: [],
      })),
    }))
  );

  const [isSaving, setIsSaving] = useState(false);

  // Update block result
  const updateBlockResult = (
    blockIndex: number,
    field: keyof BlockResultData,
    value: unknown
  ) => {
    const newResults = [...blockResults];
    newResults[blockIndex] = { ...newResults[blockIndex], [field]: value };
    setBlockResults(newResults);
  };

  // Update exercise result
  const updateExerciseResult = (
    blockIndex: number,
    exerciseIndex: number,
    field: keyof ExerciseResultData,
    value: unknown
  ) => {
    const newResults = [...blockResults];
    const exerciseResults = [...newResults[blockIndex].exerciseResults];
    exerciseResults[exerciseIndex] = {
      ...exerciseResults[exerciseIndex],
      [field]: value,
    };
    newResults[blockIndex].exerciseResults = exerciseResults;
    setBlockResults(newResults);
  };

  // Add set to exercise
  const addSet = (blockIndex: number, exerciseIndex: number) => {
    const newResults = [...blockResults];
    const exercise = newResults[blockIndex].exerciseResults[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSetNumber = exercise.sets.length + 1;
    exercise.sets.push({
      setNumber: newSetNumber,
      reps: lastSet?.reps || exercise.actualReps || 10,
      weight: lastSet?.weight || exercise.actualWeight || 0,
      weightUnit: lastSet?.weightUnit || exercise.actualWeightUnit || "KG",
    });
    setBlockResults(newResults);
  };

  // Remove set from exercise
  const removeSet = (
    blockIndex: number,
    exerciseIndex: number,
    setIndex: number
  ) => {
    const newResults = [...blockResults];
    newResults[blockIndex].exerciseResults[exerciseIndex].sets.splice(
      setIndex,
      1
    );
    setBlockResults(newResults);
  };

  // Update set
  const updateSet = (
    blockIndex: number,
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSetData,
    value: unknown
  ) => {
    const newResults = [...blockResults];
    const sets = [
      ...newResults[blockIndex].exerciseResults[exerciseIndex].sets,
    ];
    sets[setIndex] = { ...sets[setIndex], [field]: value };
    newResults[blockIndex].exerciseResults[exerciseIndex].sets = sets;
    setBlockResults(newResults);
  };

  // Save workout log
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const logData: CreateWorkoutLogInput = {
        workoutId: workout.id,
        sessionId,
        notes: notes || undefined,
        feeling,
        perceivedEffort,
        blockResults: blockResults.map((br) => ({
          blockId: br.blockId,
          completedRounds: br.completedRounds,
          extraReps: br.extraReps,
          completedTime: br.completedTime,
          notes: br.notes,
          exerciseResults: br.exerciseResults.map((er) => ({
            blockExerciseId: er.blockExerciseId,
            exerciseId: er.exerciseId,
            actualReps: er.actualReps,
            actualWeight: er.actualWeight,
            actualWeightUnit: er.actualWeightUnit,
            actualTime: er.actualTime,
            actualDistance: er.actualDistance,
            actualDistanceUnit: er.actualDistanceUnit,
            actualCalories: er.actualCalories,
            sets: er.sets,
          })),
        })),
      };

      const response = await fetch("/api/workouts/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        throw new Error("Failed to save workout log");
      }

      const data = await response.json();

      toast({
        title: t("success.logged"),
        description:
          data.performanceEntriesCreated > 0
            ? t("log.performanceEntriesCreated", {
                count: data.performanceEntriesCreated,
              })
            : undefined,
      });

      router.push("/workouts");
    } catch (error) {
      console.error("Failed to save workout log:", error);
      toast({
        title: t("errors.logFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/workouts">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p className="text-muted-foreground">{t("log.title")}</p>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        {workout.blocks.map((block, blockIndex) => (
          <Card
            key={block.id}
            style={{
              borderLeftColor: BLOCK_TYPE_INFO[block.type].color,
              borderLeftWidth: "4px",
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
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
                {block.timeCap && (
                  <span className="text-sm text-muted-foreground">
                    {t("blocks.timeCap")}: {formatTime(block.timeCap)}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Block-level results based on type */}
              {(block.type === "AMRAP" || block.type === "CHIPPER") && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("log.completedRounds")}</Label>
                    <Input
                      type="number"
                      min={0}
                      value={blockResults[blockIndex].completedRounds || ""}
                      onChange={(e) =>
                        updateBlockResult(
                          blockIndex,
                          "completedRounds",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("log.extraReps")}</Label>
                    <Input
                      type="number"
                      min={0}
                      value={blockResults[blockIndex].extraReps || ""}
                      onChange={(e) =>
                        updateBlockResult(
                          blockIndex,
                          "extraReps",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {block.type === "FOR_TIME" && (
                <div className="space-y-2">
                  <Label>{t("log.completedTime")}</Label>
                  <TimeInput
                    value={blockResults[blockIndex].completedTime ?? null}
                    onChange={(seconds) =>
                      updateBlockResult(
                        blockIndex,
                        "completedTime",
                        seconds ?? undefined
                      )
                    }
                    size="sm"
                  />
                </div>
              )}

              {/* Exercise results */}
              {block.exercises.map((exercise, exerciseIndex) => (
                <div
                  key={exercise.id}
                  className="space-y-3 rounded border bg-muted/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {exercise.exercise.name}
                      </span>
                      {exercise.prescribedReps && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({exercise.prescribedReps} reps
                          {exercise.prescribedWeight &&
                            ` @ ${exercise.prescribedWeight}${exercise.prescribedWeightUnit || "kg"}`}
                          )
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Simple result (for non-strength) - fields based on exercise settings */}
                  {block.type !== "STRENGTH" && (
                    <div className="grid gap-2 sm:grid-cols-3">
                      {/* Reps - when exercise has reps */}
                      {exercise.exercise.hasReps && (
                        <div className="space-y-1">
                          <Label className="text-xs">
                            {t("log.actualReps")}
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            className="h-8"
                            value={
                              blockResults[blockIndex].exerciseResults[
                                exerciseIndex
                              ].actualReps || ""
                            }
                            onChange={(e) =>
                              updateExerciseResult(
                                blockIndex,
                                exerciseIndex,
                                "actualReps",
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </div>
                      )}
                      {/* Weight - when exercise has weight */}
                      {exercise.exercise.hasWeight && (
                        <div className="space-y-1">
                          <Label className="text-xs">
                            {t("log.actualWeight")}
                          </Label>
                          <div className="flex gap-1">
                            <Input
                              type="number"
                              min={0}
                              className="h-8"
                              value={
                                blockResults[blockIndex].exerciseResults[
                                  exerciseIndex
                                ].actualWeight || ""
                              }
                              onChange={(e) =>
                                updateExerciseResult(
                                  blockIndex,
                                  exerciseIndex,
                                  "actualWeight",
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                            <Select
                              value={
                                blockResults[blockIndex].exerciseResults[
                                  exerciseIndex
                                ].actualWeightUnit || "KG"
                              }
                              onValueChange={(v) =>
                                updateExerciseResult(
                                  blockIndex,
                                  exerciseIndex,
                                  "actualWeightUnit",
                                  v as WeightUnit
                                )
                              }
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="KG">kg</SelectItem>
                                <SelectItem value="LB">lb</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {/* Distance - when exercise has distance */}
                      {exercise.exercise.hasDistance && (
                        <div className="space-y-1">
                          <Label className="text-xs">
                            {t("log.actualDistance")}
                          </Label>
                          <div className="flex gap-1">
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              className="h-8"
                              value={
                                blockResults[blockIndex].exerciseResults[
                                  exerciseIndex
                                ].actualDistance || ""
                              }
                              onChange={(e) =>
                                updateExerciseResult(
                                  blockIndex,
                                  exerciseIndex,
                                  "actualDistance",
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                            <Select
                              value={
                                blockResults[blockIndex].exerciseResults[
                                  exerciseIndex
                                ].actualDistanceUnit || "KM"
                              }
                              onValueChange={(v) =>
                                updateExerciseResult(
                                  blockIndex,
                                  exerciseIndex,
                                  "actualDistanceUnit",
                                  v as DistanceUnit
                                )
                              }
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="KM">km</SelectItem>
                                <SelectItem value="M">m</SelectItem>
                                <SelectItem value="MI">mi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {/* Time - when exercise has time */}
                      {exercise.exercise.hasTime && (
                        <div className="space-y-1">
                          <Label className="text-xs">
                            {t("log.actualTime")}
                          </Label>
                          <TimeInput
                            value={
                              blockResults[blockIndex].exerciseResults[
                                exerciseIndex
                              ].actualTime ?? null
                            }
                            onChange={(seconds) =>
                              updateExerciseResult(
                                blockIndex,
                                exerciseIndex,
                                "actualTime",
                                seconds ?? undefined
                              )
                            }
                            hideHours
                            size="sm"
                          />
                        </div>
                      )}
                      {/* Calories - when exercise has calories */}
                      {exercise.exercise.hasCalories && (
                        <div className="space-y-1">
                          <Label className="text-xs">
                            {t("log.actualCalories")}
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            className="h-8"
                            value={
                              blockResults[blockIndex].exerciseResults[
                                exerciseIndex
                              ].actualCalories || ""
                            }
                            onChange={(e) =>
                              updateExerciseResult(
                                blockIndex,
                                exerciseIndex,
                                "actualCalories",
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sets (for strength) */}
                  {block.type === "STRENGTH" && (
                    <div className="space-y-2">
                      {blockResults[blockIndex].exerciseResults[
                        exerciseIndex
                      ].sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-2">
                          <span className="w-16 text-sm font-medium">
                            {t("log.set")} {setIndex + 1}
                          </span>
                          <Input
                            type="number"
                            min={0}
                            className="h-8 w-20"
                            placeholder="Reps"
                            value={set.reps || ""}
                            onChange={(e) =>
                              updateSet(
                                blockIndex,
                                exerciseIndex,
                                setIndex,
                                "reps",
                                e.target.value ? parseInt(e.target.value) : 0
                              )
                            }
                          />
                          <span className="text-muted-foreground">×</span>
                          <Input
                            type="number"
                            min={0}
                            className="h-8 w-20"
                            placeholder="Weight"
                            value={set.weight || ""}
                            onChange={(e) =>
                              updateSet(
                                blockIndex,
                                exerciseIndex,
                                setIndex,
                                "weight",
                                e.target.value ? parseFloat(e.target.value) : 0
                              )
                            }
                          />
                          <Select
                            value={set.weightUnit || "KG"}
                            onValueChange={(v) =>
                              updateSet(
                                blockIndex,
                                exerciseIndex,
                                setIndex,
                                "weightUnit",
                                v as WeightUnit
                              )
                            }
                          >
                            <SelectTrigger className="h-8 w-16">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KG">kg</SelectItem>
                              <SelectItem value="LB">lb</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              removeSet(blockIndex, exerciseIndex, setIndex)
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSet(blockIndex, exerciseIndex)}
                      >
                        <PlusIcon className="mr-1 h-3 w-3" />
                        {t("log.addSet")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>{t("log.notes")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("log.feeling")}</Label>
              <Select
                value={feeling?.toString() || ""}
                onValueChange={(v) => setFeeling(v ? parseInt(v) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("log.feeling")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {t(`log.feelingLevels.${level}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("log.perceivedEffort")}</Label>
              <Select
                value={perceivedEffort?.toString() || ""}
                onValueChange={(v) =>
                  setPerceivedEffort(v ? parseInt(v) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="RPE" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("log.notes")}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("log.notesPlaceholder")}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/workouts">{t("form.cancel")}</Link>
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <CheckCircleIcon className="mr-2 h-4 w-4" />
          {isSaving ? "..." : t("log.saveLog")}
        </Button>
      </div>
    </div>
  );
}
