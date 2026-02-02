"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Dumbbell,
  Search,
  Loader2,
  Clock,
  X,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface Workout {
  id: string;
  name: string;
  description?: string | null;
  estimatedTime?: number | null;
  difficulty?: number | null;
  tags: string[];
  isTemplate: boolean;
  isPublic: boolean;
  blocks?: WorkoutBlock[];
}

interface WorkoutBlock {
  id: string;
  name?: string | null;
  type: string;
  exercises: WorkoutBlockExercise[];
}

interface WorkoutBlockExercise {
  id: string;
  exercise: {
    id: string;
    name: string;
    translations?: { language: string; name: string }[];
  };
}

interface SessionWorkoutSelectorProps {
  venueId: string;
  sessionId?: string;
  selectedWorkoutIds: string[];
  onSelectionChange: (workoutIds: string[]) => void;
  locale?: string;
}

export function SessionWorkoutSelector({
  venueId,
  sessionId: _sessionId,
  selectedWorkoutIds,
  onSelectionChange,
  locale = "en",
}: SessionWorkoutSelectorProps) {
  const t = useTranslations("venues.sessions");
  const tWorkout = useTranslations("workouts");
  const tCommon = useTranslations("common");

  const [open, setOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch available workouts for this venue
  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        venueId,
        includePublic: "true",
      });

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const response = await fetch(`/api/workouts?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch workouts");

      const data = await response.json();
      setWorkouts(data.workouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  }, [venueId, debouncedSearch]);

  // Fetch selected workouts details
  const fetchSelectedWorkouts = useCallback(async () => {
    if (selectedWorkoutIds.length === 0) {
      setSelectedWorkouts([]);
      return;
    }

    try {
      const promises = selectedWorkoutIds.map((id) =>
        fetch(`/api/workouts/${id}`).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      setSelectedWorkouts(results.filter((w) => w && !w.error));
    } catch (error) {
      console.error("Error fetching selected workouts:", error);
    }
  }, [selectedWorkoutIds]);

  useEffect(() => {
    if (open) {
      fetchWorkouts();
    }
  }, [open, fetchWorkouts]);

  useEffect(() => {
    fetchSelectedWorkouts();
  }, [fetchSelectedWorkouts]);

  const handleToggleWorkout = (workout: Workout) => {
    const isSelected = selectedWorkoutIds.includes(workout.id);
    if (isSelected) {
      onSelectionChange(selectedWorkoutIds.filter((id) => id !== workout.id));
    } else {
      onSelectionChange([...selectedWorkoutIds, workout.id]);
    }
  };

  const handleRemoveWorkout = (workoutId: string) => {
    onSelectionChange(selectedWorkoutIds.filter((id) => id !== workoutId));
  };

  const getExerciseName = (exercise: WorkoutBlockExercise["exercise"]) => {
    const translation = exercise.translations?.find(
      (t) => t.language === locale
    );
    return translation?.name || exercise.name;
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["easy", "medium", "hard", "veryHard", "extreme"];
    return labels[difficulty - 1] || labels[0];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{t("assignedWorkouts")}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
          {t("selectWorkouts")}
        </Button>
      </div>

      {/* Selected Workouts Display */}
      {selectedWorkouts.length > 0 ? (
        <div className="space-y-2">
          {selectedWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Dumbbell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{workout.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {workout.estimatedTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {workout.estimatedTime} min
                      </span>
                    )}
                    {workout.blocks && (
                      <span>
                        {workout.blocks.length}{" "}
                        {workout.blocks.length === 1
                          ? tWorkout("block")
                          : tWorkout("blocks")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemoveWorkout(workout.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("noWorkoutsAssigned")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("noWorkoutsAssignedHint")}
          </p>
        </div>
      )}

      {/* Selection Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("selectWorkouts")}</DialogTitle>
            <DialogDescription>
              {t("selectWorkoutsDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={tWorkout("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Workouts List */}
          <div className="h-[400px] overflow-y-auto pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : workouts.length === 0 ? (
              <div className="py-12 text-center">
                <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {tWorkout("noWorkoutsFound")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {workouts.map((workout) => {
                  const isSelected = selectedWorkoutIds.includes(workout.id);
                  return (
                    <div
                      key={workout.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                        isSelected && "border-primary bg-primary/5"
                      )}
                      onClick={() => handleToggleWorkout(workout)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleWorkout(workout)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{workout.name}</p>
                          {workout.isTemplate && (
                            <Badge variant="secondary" className="text-xs">
                              {tWorkout("template")}
                            </Badge>
                          )}
                        </div>
                        {workout.description && (
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                            {workout.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {workout.estimatedTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {workout.estimatedTime} min
                            </span>
                          )}
                          {workout.difficulty && (
                            <Badge variant="outline" className="text-xs">
                              {tWorkout(
                                `difficulty.${getDifficultyLabel(workout.difficulty)}`
                              )}
                            </Badge>
                          )}
                          {workout.blocks && workout.blocks.length > 0 && (
                            <span>
                              {workout.blocks.reduce(
                                (acc, b) => acc + b.exercises.length,
                                0
                              )}{" "}
                              {tWorkout("exercises")}
                            </span>
                          )}
                        </div>
                        {/* Preview exercises */}
                        {workout.blocks &&
                          workout.blocks.length > 0 &&
                          workout.blocks[0].exercises.length > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <ChevronRight className="h-3 w-3" />
                              <span className="line-clamp-1">
                                {workout.blocks[0].exercises
                                  .slice(0, 3)
                                  .map((e) => getExerciseName(e.exercise))
                                  .join(", ")}
                                {workout.blocks[0].exercises.length > 3 &&
                                  ` +${workout.blocks[0].exercises.length - 3}`}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex w-full items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("selectedCount", { count: selectedWorkoutIds.length })}
              </p>
              <Button onClick={() => setOpen(false)}>{tCommon("done")}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
