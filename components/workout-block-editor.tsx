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
  RepeatIcon,
} from "lucide-react";
import { WeightUnit, DistanceUnit, ExerciseCategory } from "@prisma/client";
import type {
  WorkoutBlockWithExercises,
  WorkoutBlockExerciseWithDetails,
  CreateSetPrescriptionInput,
  ExerciseGroupState,
} from "@/types/workout";
import { SetPrescriptionEditor } from "@/components/workout-set-prescription-editor";
import { ExerciseGroupEditor } from "@/components/workout-exercise-group-editor";

interface ExerciseOption {
  id: string;
  name: string;
  category: ExerciseCategory;
}

interface WorkoutBlockEditorProps {
  block: WorkoutBlockWithExercises;
  onChange: (block: WorkoutBlockWithExercises) => void;
}

// Block item can be either an exercise or a group
type BlockItem =
  | {
      type: "exercise";
      data: WorkoutBlockExerciseWithDetails;
      orderIndex: number;
    }
  | { type: "group"; data: ExerciseGroupState; orderIndex: number };

// Helper to determine which fields to show based on exercise category
function getFieldsForCategory(category: ExerciseCategory): {
  showReps: boolean;
  showWeight: boolean;
  showSets: boolean;
  showDistance: boolean;
  showTime: boolean;
  showCalories: boolean;
} {
  switch (category) {
    case "CARDIO":
      // Cardio: distance, time, calories (no reps/weight/sets)
      return {
        showReps: false,
        showWeight: false,
        showSets: false,
        showDistance: true,
        showTime: true,
        showCalories: true,
      };
    case "BODYWEIGHT":
      // Bodyweight: reps, sets, time (no weight/distance)
      return {
        showReps: true,
        showWeight: false,
        showSets: true,
        showDistance: false,
        showTime: true,
        showCalories: false,
      };
    case "WEIGHTLIFTING":
    case "GYM":
      // Weightlifting/Gym: reps, weight, sets (no distance/time/calories)
      return {
        showReps: true,
        showWeight: true,
        showSets: true,
        showDistance: false,
        showTime: false,
        showCalories: false,
      };
    case "CROSSFIT":
      // CrossFit: can have everything except distance (unless it's a run/row)
      return {
        showReps: true,
        showWeight: true,
        showSets: true,
        showDistance: true,
        showTime: true,
        showCalories: true,
      };
    case "OTHER":
    default:
      // Show all fields for flexibility
      return {
        showReps: true,
        showWeight: true,
        showSets: true,
        showDistance: true,
        showTime: true,
        showCalories: true,
      };
  }
}

export function WorkoutBlockEditor({
  block,
  onChange,
}: WorkoutBlockEditorProps) {
  const t = useTranslations("workouts");
  const [exercises, setExercises] = useState<ExerciseOption[]>([]);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Local state for exercise groups within this block
  // Initialize from block.exerciseGroups if available
  const [exerciseGroups, setExerciseGroups] = useState<ExerciseGroupState[]>(
    () => {
      if (block.exerciseGroups && block.exerciseGroups.length > 0) {
        return block.exerciseGroups.map((g) => ({
          id: g.id,
          name: g.name || "",
          orderIndex: g.orderIndex,
          rounds: g.rounds,
          restBetweenRounds: g.restBetweenRounds,
          notes: g.notes || "",
          exercises: g.exercises.map((ex) => ({
            id: ex.id,
            exerciseId: ex.exerciseId,
            exerciseName: ex.exercise.name,
            exerciseCategory: ex.exercise.category,
            groupId: ex.groupId || undefined,
            prescribedReps: ex.prescribedReps,
            prescribedWeight: ex.prescribedWeight,
            prescribedWeightUnit: ex.prescribedWeightUnit || "KG",
            prescribedWeightPercent: ex.prescribedWeightPercent,
            prescribedDistance: ex.prescribedDistance,
            prescribedDistanceUnit: ex.prescribedDistanceUnit || "M",
            prescribedTime: ex.prescribedTime,
            prescribedCalories: ex.prescribedCalories,
            prescribedSets: ex.prescribedSets,
            notes: ex.notes || "",
          })),
        }));
      }
      return [];
    }
  );

  // Propagate exercise groups changes to parent
  const updateExerciseGroups = useCallback(
    (newGroups: ExerciseGroupState[]) => {
      setExerciseGroups(newGroups);
      // Convert to the format expected by the parent
      const groupsForParent = newGroups.map((g) => ({
        id: g.id,
        blockId: block.id,
        name: g.name || null,
        orderIndex: g.orderIndex,
        rounds: g.rounds,
        restBetweenRounds: g.restBetweenRounds,
        notes: g.notes || null,
        exercises: g.exercises.map((ex) => ({
          id: ex.id,
          blockId: block.id,
          groupId: g.id,
          exerciseId: ex.exerciseId,
          orderIndex: 0,
          prescribedReps: ex.prescribedReps,
          prescribedWeight: ex.prescribedWeight,
          prescribedWeightUnit: ex.prescribedWeightUnit || null,
          prescribedWeightPercent: ex.prescribedWeightPercent,
          prescribedDistance: ex.prescribedDistance,
          prescribedDistanceUnit: ex.prescribedDistanceUnit || null,
          prescribedTime: ex.prescribedTime,
          prescribedCalories: ex.prescribedCalories,
          prescribedSets: ex.prescribedSets,
          prescribedRepsFemale: null,
          prescribedWeightFemale: null,
          prescribedWeightUnitFemale: null,
          prescribedWeightPercentFemale: null,
          prescribedDistanceFemale: null,
          prescribedDistanceUnitFemale: null,
          prescribedTimeFemale: null,
          prescribedCaloriesFemale: null,
          prescribedSetsFemale: null,
          notes: ex.notes || null,
          exercise: {
            id: ex.exerciseId,
            name: ex.exerciseName,
            category: ex.exerciseCategory,
          },
        })),
      })) as import("@/types/workout").ExerciseGroupWithExercises[];
      onChange({ ...block, exerciseGroups: groupsForParent });
    },
    [block, onChange]
  );

  // Build unified list of items (exercises and groups) sorted by orderIndex
  const buildBlockItems = useCallback((): BlockItem[] => {
    const items: BlockItem[] = [];

    // Add standalone exercises (those without a groupId)
    block.exercises
      .filter((ex) => !ex.groupId)
      .forEach((ex) => {
        items.push({ type: "exercise", data: ex, orderIndex: ex.orderIndex });
      });

    // Add groups
    exerciseGroups.forEach((group) => {
      items.push({ type: "group", data: group, orderIndex: group.orderIndex });
    });

    // Sort by orderIndex
    return items.sort((a, b) => a.orderIndex - b.orderIndex);
  }, [block.exercises, exerciseGroups]);

  const blockItems = buildBlockItems();

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

  // Get next orderIndex for new items
  const getNextOrderIndex = useCallback(() => {
    const maxExerciseIndex = Math.max(
      -1,
      ...block.exercises.filter((ex) => !ex.groupId).map((ex) => ex.orderIndex)
    );
    const maxGroupIndex = Math.max(
      -1,
      ...exerciseGroups.map((g) => g.orderIndex)
    );
    return Math.max(maxExerciseIndex, maxGroupIndex) + 1;
  }, [block.exercises, exerciseGroups]);

  // Add exercise to block
  const addExercise = (exercise: ExerciseOption) => {
    const newExercise: WorkoutBlockExerciseWithDetails = {
      id: `temp-ex-${Date.now()}`,
      blockId: block.id,
      exerciseId: exercise.id,
      orderIndex: getNextOrderIndex(),
      groupId: null, // Not in a group
      // Male/Rx
      prescribedReps: null,
      prescribedWeight: null,
      prescribedWeightUnit: null,
      prescribedWeightPercent: null,
      prescribedDistance: null,
      prescribedDistanceUnit: null,
      prescribedTime: null,
      prescribedCalories: null,
      prescribedSets: null,
      // Female (optional)
      prescribedRepsFemale: null,
      prescribedWeightFemale: null,
      prescribedWeightUnitFemale: null,
      prescribedWeightPercentFemale: null,
      prescribedDistanceFemale: null,
      prescribedDistanceUnitFemale: null,
      prescribedTimeFemale: null,
      prescribedCaloriesFemale: null,
      prescribedSetsFemale: null,
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
        // Blocos REST não precisam de campos de timing
        // O descanso é definido adicionando o exercício "Rest" com prescribedTime
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Block name and timing */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("blocks.name")}</Label>
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

      {/* Exercises and Groups - Unified List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("exercises.title")}</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newGroup: ExerciseGroupState = {
                  id: `temp-group-${Date.now()}`,
                  name: "",
                  orderIndex: getNextOrderIndex(),
                  rounds: 2,
                  restBetweenRounds: null,
                  notes: "",
                  exercises: [],
                };
                updateExerciseGroups([...exerciseGroups, newGroup]);
              }}
            >
              <RepeatIcon className="mr-1 h-3 w-3" />
              {t("exerciseGroups.addGroup")}
            </Button>
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
        </div>

        {blockItems.length === 0 ? (
          <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">
            {t("exercises.noExercises")}
          </div>
        ) : (
          <div className="space-y-2">
            {blockItems.map((item) => {
              if (item.type === "group") {
                const group = item.data;
                const groupIndex = exerciseGroups.findIndex(
                  (g) => g.id === group.id
                );
                return (
                  <ExerciseGroupEditor
                    key={group.id}
                    group={group}
                    onChange={(updatedGroup) => {
                      const newGroups = [...exerciseGroups];
                      newGroups[groupIndex] = updatedGroup;
                      updateExerciseGroups(newGroups);
                    }}
                    onDelete={() => {
                      updateExerciseGroups(
                        exerciseGroups.filter((g) => g.id !== group.id)
                      );
                    }}
                  />
                );
              }

              // Exercise item
              const exercise = item.data;
              const exerciseIndex = block.exercises.findIndex(
                (ex) => ex.id === exercise.id
              );

              return (
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
                        onClick={() => removeExercise(exerciseIndex)}
                        className="h-6 w-6 text-destructive"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>

                    {(() => {
                      const fields = getFieldsForCategory(
                        exercise.exercise.category
                      );
                      return (
                        <div className="grid gap-2 sm:grid-cols-4">
                          {fields.showReps && (
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
                                    exerciseIndex,
                                    "prescribedReps",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="10"
                              />
                            </div>
                          )}

                          {fields.showWeight && (
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
                                      exerciseIndex,
                                      "prescribedWeight",
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : null
                                    )
                                  }
                                  placeholder="60"
                                />
                                <Select
                                  value={exercise.prescribedWeightUnit || "KG"}
                                  onValueChange={(v) =>
                                    updateExercise(
                                      exerciseIndex,
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
                          )}

                          {fields.showSets && (
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
                                    exerciseIndex,
                                    "prescribedSets",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="3"
                              />
                            </div>
                          )}

                          {fields.showDistance && (
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
                                      exerciseIndex,
                                      "prescribedDistance",
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : null
                                    )
                                  }
                                  placeholder="400"
                                />
                                <Select
                                  value={exercise.prescribedDistanceUnit || "M"}
                                  onValueChange={(v) =>
                                    updateExercise(
                                      exerciseIndex,
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
                          )}

                          {fields.showTime && (
                            <div className="space-y-1">
                              <Label className="text-xs">
                                {t("exercises.prescribedTime")}
                              </Label>
                              <Input
                                type="number"
                                min={1}
                                className="h-8"
                                value={exercise.prescribedTime || ""}
                                onChange={(e) =>
                                  updateExercise(
                                    exerciseIndex,
                                    "prescribedTime",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="60"
                              />
                            </div>
                          )}

                          {fields.showCalories && (
                            <div className="space-y-1">
                              <Label className="text-xs">
                                {t("exercises.prescribedCalories")}
                              </Label>
                              <Input
                                type="number"
                                min={1}
                                className="h-8"
                                value={exercise.prescribedCalories || ""}
                                onChange={(e) =>
                                  updateExercise(
                                    exerciseIndex,
                                    "prescribedCalories",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="20"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Set Prescriptions - for STRENGTH/EMOM blocks with variable sets */}
                    {(block.type === "STRENGTH" || block.type === "EMOM") && (
                      <SetPrescriptionEditor
                        exerciseName={exercise.exercise.name}
                        sets={
                          (exercise.setPrescriptions as CreateSetPrescriptionInput[]) ||
                          []
                        }
                        onChange={(sets) =>
                          updateSetPrescriptions(exerciseIndex, sets)
                        }
                        blockType={block.type}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
