"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  TrashIcon,
  GripVerticalIcon,
  SearchIcon,
} from "lucide-react";
import { WeightUnit, DistanceUnit, ExerciseCategory } from "@prisma/client";
import type {
  WorkoutBlockWithExercises,
  WorkoutBlockExerciseWithDetails,
  CreateSetPrescriptionInput,
} from "@/types/workout";
import { SetPrescriptionEditor } from "@/components/workout-set-prescription-editor";

interface StrengthExerciseOption {
  id: string;
  name: string;
  category: ExerciseCategory;
}

interface WorkoutBlockEditorProps {
  block: WorkoutBlockWithExercises;
  onChange: (block: WorkoutBlockWithExercises) => void;
}

export function WorkoutBlockEditor({
  block,
  onChange,
}: WorkoutBlockEditorProps) {
  const t = useTranslations("workouts");
  const [exercises, setExercises] = useState<StrengthExerciseOption[]>([]);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch exercises for search
  const fetchExercises = useCallback(async (query: string) => {
    if (query.length < 2) {
      setExercises([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/exercises/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setExercises(data.exercises || []);
      }
    } catch (error) {
      console.error("Failed to search exercises:", error);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchExercises(searchQuery);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, fetchExercises]);

  // Update block field
  const updateField = <K extends keyof WorkoutBlockWithExercises>(
    field: K,
    value: WorkoutBlockWithExercises[K]
  ) => {
    onChange({ ...block, [field]: value });
  };

  // Add exercise to block
  const addExercise = (exercise: StrengthExerciseOption) => {
    const newExercise: WorkoutBlockExerciseWithDetails = {
      id: `temp-ex-${Date.now()}`,
      blockId: block.id,
      exerciseId: exercise.id,
      orderIndex: block.exercises.length,
      prescribedReps: null,
      prescribedWeight: null,
      prescribedWeightUnit: null,
      prescribedWeightPercent: null,
      prescribedDistance: null,
      prescribedDistanceUnit: null,
      prescribedTime: null,
      prescribedCalories: null,
      prescribedSets: null,
      notes: null,
      exercise: {
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
      },
      setPrescriptions: [], // Initialize empty set prescriptions
    };
    onChange({
      ...block,
      exercises: [...block.exercises, newExercise],
    });
    setExerciseDialogOpen(false);
    setSearchQuery("");
  };

  // Remove exercise
  const removeExercise = (index: number) => {
    const newExercises = block.exercises.filter((_, i) => i !== index);
    newExercises.forEach((ex, i) => {
      ex.orderIndex = i;
    });
    onChange({ ...block, exercises: newExercises });
  };

  // Update exercise
  const updateExercise = (
    index: number,
    field: keyof WorkoutBlockExerciseWithDetails,
    value: unknown
  ) => {
    const newExercises = [...block.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    onChange({ ...block, exercises: newExercises });
  };

  // Update set prescriptions for an exercise
  const updateSetPrescriptions = (
    exerciseIndex: number,
    setPrescriptions: CreateSetPrescriptionInput[]
  ) => {
    const newExercises = [...block.exercises];
    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      setPrescriptions,
      // Also update prescribedSets to match the number of set prescriptions
      prescribedSets: setPrescriptions.length || null,
    };
    onChange({ ...block, exercises: newExercises });
  };

  // Get timing fields based on block type
  const getTimingFields = () => {
    switch (block.type) {
      case "AMRAP":
      case "FOR_TIME":
        return (
          <div className="space-y-2">
            <Label>{t("blocks.timeCapMinutes")}</Label>
            <Input
              type="number"
              min={1}
              value={block.timeCap ? Math.floor(block.timeCap / 60) : ""}
              onChange={(e) =>
                updateField(
                  "timeCap",
                  e.target.value ? parseInt(e.target.value) * 60 : null
                )
              }
              placeholder="10"
            />
          </div>
        );

      case "EMOM":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("blocks.workTime")}</Label>
              <Input
                type="number"
                min={1}
                value={block.workTime || ""}
                onChange={(e) =>
                  updateField(
                    "workTime",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="60"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("blocks.rounds")}</Label>
              <Input
                type="number"
                min={1}
                value={block.rounds || ""}
                onChange={(e) =>
                  updateField(
                    "rounds",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="10"
              />
            </div>
          </div>
        );

      case "TABATA":
        return (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t("blocks.workTime")}</Label>
              <Input
                type="number"
                min={1}
                value={block.workTime || ""}
                onChange={(e) =>
                  updateField(
                    "workTime",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="20"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("blocks.restTime")}</Label>
              <Input
                type="number"
                min={1}
                value={block.restTime || ""}
                onChange={(e) =>
                  updateField(
                    "restTime",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("blocks.rounds")}</Label>
              <Input
                type="number"
                min={1}
                value={block.rounds || ""}
                onChange={(e) =>
                  updateField(
                    "rounds",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="8"
              />
            </div>
          </div>
        );

      case "STRENGTH":
        return (
          <div className="space-y-2">
            <Label>{t("blocks.rounds")}</Label>
            <Input
              type="number"
              min={1}
              value={block.rounds || ""}
              onChange={(e) =>
                updateField(
                  "rounds",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="5"
            />
          </div>
        );

      case "REST":
        return (
          <div className="space-y-2">
            <Label>{t("blocks.restTime")}</Label>
            <Input
              type="number"
              min={1}
              value={block.restTime || ""}
              onChange={(e) =>
                updateField(
                  "restTime",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="120"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Block name and timing */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("blocks.notes")}</Label>
          <Input
            value={block.name || ""}
            onChange={(e) => updateField("name", e.target.value || null)}
            placeholder={t(`blocks.types.${block.type}`)}
          />
        </div>
        {getTimingFields()}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>{t("blocks.notes")}</Label>
        <Textarea
          value={block.notes || ""}
          onChange={(e) => updateField("notes", e.target.value || null)}
          placeholder={t("blocks.notesPlaceholder")}
          rows={2}
        />
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("exercises.title")}</Label>
          <Dialog
            open={exerciseDialogOpen}
            onOpenChange={setExerciseDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusIcon className="mr-1 h-3 w-3" />
                {t("exercises.addExercise")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("exercises.addExercise")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("exercises.searchExercise")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {searchQuery.length < 2 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Type at least 2 characters to search...
                    </p>
                  ) : exercises.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No exercises found
                    </p>
                  ) : (
                    exercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        onClick={() => addExercise(exercise)}
                        className="w-full rounded-md p-2 text-left hover:bg-muted"
                      >
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {exercise.category}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {block.exercises.length === 0 ? (
          <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">
            {t("exercises.noExercises")}
          </div>
        ) : (
          <div className="space-y-2">
            {block.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="flex items-start gap-2 rounded border bg-muted/50 p-3"
              >
                <GripVerticalIcon className="mt-1 h-4 w-4 cursor-grab text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {exercise.exercise.name}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {exercise.exercise.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(index)}
                      className="h-6 w-6 text-destructive"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-xs">
                        {t("exercises.prescribedReps")}
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        className="h-8"
                        value={exercise.prescribedReps || ""}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "prescribedReps",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        placeholder="10"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">
                        {t("exercises.prescribedWeight")}
                      </Label>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min={0}
                          className="h-8"
                          value={exercise.prescribedWeight || ""}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "prescribedWeight",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          placeholder="60"
                        />
                        <Select
                          value={exercise.prescribedWeightUnit || "KG"}
                          onValueChange={(v) =>
                            updateExercise(
                              index,
                              "prescribedWeightUnit",
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

                    <div className="space-y-1">
                      <Label className="text-xs">
                        {t("exercises.prescribedSets")}
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        className="h-8"
                        value={exercise.prescribedSets || ""}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "prescribedSets",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        placeholder="3"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">
                        {t("exercises.prescribedDistance")}
                      </Label>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min={0}
                          className="h-8"
                          value={exercise.prescribedDistance || ""}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              "prescribedDistance",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          placeholder="400"
                        />
                        <Select
                          value={exercise.prescribedDistanceUnit || "M"}
                          onValueChange={(v) =>
                            updateExercise(
                              index,
                              "prescribedDistanceUnit",
                              v as DistanceUnit
                            )
                          }
                        >
                          <SelectTrigger className="h-8 w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">m</SelectItem>
                            <SelectItem value="KM">km</SelectItem>
                            <SelectItem value="MI">mi</SelectItem>
                            <SelectItem value="FT">ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Set Prescriptions - for STRENGTH/EMOM blocks with variable sets */}
                  {(block.type === "STRENGTH" || block.type === "EMOM") && (
                    <SetPrescriptionEditor
                      exerciseName={exercise.exercise.name}
                      sets={
                        (exercise.setPrescriptions as CreateSetPrescriptionInput[]) ||
                        []
                      }
                      onChange={(sets) => updateSetPrescriptions(index, sets)}
                      blockType={block.type}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
