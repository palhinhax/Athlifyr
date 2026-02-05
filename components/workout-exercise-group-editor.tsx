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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  PlusIcon,
  TrashIcon,
  GripVerticalIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RepeatIcon,
} from "lucide-react";
import { WeightUnit, DistanceUnit, ExerciseCategory } from "@prisma/client";
import type { ExerciseGroupState, WorkoutExerciseState } from "@/types/workout";

interface ExerciseOption {
  id: string;
  name: string;
  category: ExerciseCategory;
}

interface ExerciseGroupEditorProps {
  group: ExerciseGroupState;
  onChange: (group: ExerciseGroupState) => void;
  onDelete: () => void;
}

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
      return {
        showReps: false,
        showWeight: false,
        showSets: false,
        showDistance: true,
        showTime: true,
        showCalories: true,
      };
    case "BODYWEIGHT":
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
      return {
        showReps: true,
        showWeight: true,
        showSets: true,
        showDistance: false,
        showTime: false,
        showCalories: false,
      };
    case "CROSSFIT":
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

export function ExerciseGroupEditor({
  group,
  onChange,
  onDelete,
}: ExerciseGroupEditorProps) {
  const t = useTranslations("workouts");
  const [exercises, setExercises] = useState<ExerciseOption[]>([]);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

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

  // Update group field
  const updateField = <K extends keyof ExerciseGroupState>(
    field: K,
    value: ExerciseGroupState[K]
  ) => {
    onChange({ ...group, [field]: value });
  };

  // Add exercise to group
  const addExercise = (exercise: ExerciseOption) => {
    const newExercise: WorkoutExerciseState = {
      id: `temp-gex-${Date.now()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseCategory: exercise.category,
      groupId: group.id,
      prescribedReps: null,
      prescribedWeight: null,
      prescribedWeightUnit: "KG",
      prescribedWeightPercent: null,
      prescribedDistance: null,
      prescribedDistanceUnit: "M",
      prescribedTime: null,
      prescribedCalories: null,
      prescribedSets: null,
      notes: "",
    };
    onChange({
      ...group,
      exercises: [...group.exercises, newExercise],
    });
    setExerciseDialogOpen(false);
    setSearchQuery("");
  };

  // Remove exercise from group
  const removeExercise = (index: number) => {
    const newExercises = group.exercises.filter((_, i) => i !== index);
    onChange({ ...group, exercises: newExercises });
  };

  // Update exercise in group
  const updateExercise = (
    index: number,
    field: keyof WorkoutExerciseState,
    value: unknown
  ) => {
    const newExercises = [...group.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    onChange({ ...group, exercises: newExercises });
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3">
        {/* Group Header */}
        <div className="flex items-center gap-2">
          <GripVerticalIcon className="h-4 w-4 cursor-grab text-muted-foreground" />
          <RepeatIcon className="h-4 w-4 text-primary" />

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              {isExpanded ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <div className="flex flex-1 items-center gap-2">
            <Input
              value={group.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("exerciseGroups.groupNamePlaceholder")}
              className="h-7 flex-1 text-sm"
            />

            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={1}
                value={group.rounds}
                onChange={(e) =>
                  updateField("rounds", parseInt(e.target.value) || 1)
                }
                className="h-7 w-14 text-center text-sm"
              />
              <span className="text-xs text-muted-foreground">
                {t("exerciseGroups.rounds")}
              </span>
            </div>

            <Badge variant="secondary" className="text-xs">
              {group.exercises.length} ex
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-7 w-7 text-destructive hover:text-destructive"
          >
            <TrashIcon className="h-3 w-3" />
          </Button>
        </div>

        {/* Group Content */}
        <CollapsibleContent>
          <div className="mt-3 space-y-3 pl-10">
            {/* Rest between rounds */}
            <div className="flex items-center gap-2">
              <Label className="text-xs">
                {t("exerciseGroups.restBetweenRounds")}
              </Label>
              <Input
                type="number"
                min={0}
                value={group.restBetweenRounds || ""}
                onChange={(e) =>
                  updateField(
                    "restBetweenRounds",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="h-7 w-20 text-sm"
                placeholder="30"
              />
            </div>

            {/* Exercises in group */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">
                  {t("exerciseGroups.exercises")}
                </Label>
                <Dialog
                  open={exerciseDialogOpen}
                  onOpenChange={setExerciseDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      <PlusIcon className="mr-1 h-3 w-3" />
                      {t("exerciseGroups.addExerciseToGroup")}
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

              {group.exercises.length === 0 ? (
                <div className="rounded border border-dashed p-3 text-center text-xs text-muted-foreground">
                  {t("exerciseGroups.emptyGroup")}
                </div>
              ) : (
                <div className="space-y-1">
                  {group.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-start gap-2 rounded border bg-background p-2"
                    >
                      <GripVerticalIcon className="mt-1 h-3 w-3 cursor-grab text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {exercise.exerciseName}
                            </span>
                            {exercise.exerciseCategory && (
                              <Badge variant="outline" className="text-[10px]">
                                {exercise.exerciseCategory}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExercise(index)}
                            className="h-5 w-5 text-destructive"
                          >
                            <TrashIcon className="h-2.5 w-2.5" />
                          </Button>
                        </div>

                        {(() => {
                          const category =
                            (exercise.exerciseCategory as ExerciseCategory) ||
                            "OTHER";
                          const fields = getFieldsForCategory(category);
                          return (
                            <div className="flex flex-wrap gap-2">
                              {fields.showReps && (
                                <div className="flex items-center gap-1">
                                  <Label className="text-[10px]">
                                    {t("exercises.prescribedReps")}
                                  </Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-6 w-14 text-xs"
                                    value={exercise.prescribedReps || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
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
                                <div className="flex items-center gap-1">
                                  <Label className="text-[10px]">
                                    {t("exercises.prescribedWeight")}
                                  </Label>
                                  <Input
                                    type="number"
                                    min={0}
                                    className="h-6 w-14 text-xs"
                                    value={exercise.prescribedWeight || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        "prescribedWeight",
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : null
                                      )
                                    }
                                    placeholder="60"
                                  />
                                  <Select
                                    value={
                                      exercise.prescribedWeightUnit || "KG"
                                    }
                                    onValueChange={(v) =>
                                      updateExercise(
                                        index,
                                        "prescribedWeightUnit",
                                        v as WeightUnit
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-6 w-12 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="KG">kg</SelectItem>
                                      <SelectItem value="LB">lb</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {fields.showDistance && (
                                <div className="flex items-center gap-1">
                                  <Label className="text-[10px]">
                                    {t("exercises.prescribedDistance")}
                                  </Label>
                                  <Input
                                    type="number"
                                    min={0}
                                    className="h-6 w-14 text-xs"
                                    value={exercise.prescribedDistance || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        "prescribedDistance",
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : null
                                      )
                                    }
                                    placeholder="400"
                                  />
                                  <Select
                                    value={
                                      exercise.prescribedDistanceUnit || "M"
                                    }
                                    onValueChange={(v) =>
                                      updateExercise(
                                        index,
                                        "prescribedDistanceUnit",
                                        v as DistanceUnit
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-6 w-12 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="M">m</SelectItem>
                                      <SelectItem value="KM">km</SelectItem>
                                      <SelectItem value="MI">mi</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {fields.showTime && (
                                <div className="flex items-center gap-1">
                                  <Label className="text-[10px]">
                                    {t("exercises.prescribedTime")}
                                  </Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-6 w-14 text-xs"
                                    value={exercise.prescribedTime || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
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
                                <div className="flex items-center gap-1">
                                  <Label className="text-[10px]">
                                    {t("exercises.prescribedCalories")}
                                  </Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-6 w-14 text-xs"
                                    value={exercise.prescribedCalories || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Group notes */}
            <div className="space-y-1">
              <Label className="text-xs">{t("exerciseGroups.notes")}</Label>
              <Textarea
                value={group.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder={t("exerciseGroups.notesPlaceholder")}
                rows={1}
                className="text-xs"
              />
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
