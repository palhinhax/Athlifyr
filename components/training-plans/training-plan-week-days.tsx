"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  DumbbellIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Prisma } from "@prisma/client";
import { BLOCK_TYPE_INFO } from "@/types/workout";

type PlanWorkout = Prisma.TrainingPlanWorkoutGetPayload<{
  include: {
    workout: {
      include: {
        blocks: true;
      };
    };
  };
}>;

interface TrainingPlanWeekDaysProps {
  planId: string;
  weekId: string;
  workouts: PlanWorkout[];
  onWorkoutAdded?: () => void;
  onWorkoutRemoved?: () => void;
  canEdit?: boolean;
}

const DAYS = [
  { day: 1, key: "monday" },
  { day: 2, key: "tuesday" },
  { day: 3, key: "wednesday" },
  { day: 4, key: "thursday" },
  { day: 5, key: "friday" },
  { day: 6, key: "saturday" },
  { day: 0, key: "sunday" },
] as const;

export function TrainingPlanWeekDays({
  planId,
  weekId,
  workouts,
  onWorkoutAdded,
  onWorkoutRemoved,
  canEdit = true,
}: TrainingPlanWeekDaysProps) {
  const t = useTranslations("workouts.plans");
  const tWorkouts = useTranslations("workouts");
  const [addingToDay, setAddingToDay] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  const [availableWorkouts, setAvailableWorkouts] = useState<
    Array<{ id: string; name: string; description: string | null }>
  >([]);

  // Group workouts by day
  const workoutsByDay = DAYS.map(({ day, key }) => ({
    day,
    key,
    workouts: workouts.filter((w) => w.dayOfWeek === day),
  }));

  const fetchWorkouts = async () => {
    setIsLoadingWorkouts(true);
    try {
      const response = await fetch("/api/workouts?limit=50");
      if (response.ok) {
        const data = await response.json();
        // API returns 'items', not 'workouts'
        setAvailableWorkouts(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const handleOpenAddWorkout = async (day: number) => {
    setAddingToDay(day);
    setSearchQuery("");
    await fetchWorkouts();
  };

  const handleAddWorkout = async (workoutId: string) => {
    if (addingToDay === null) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/training-plans/${planId}/weeks/${weekId}/workouts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workoutId,
            dayOfWeek: addingToDay,
          }),
        }
      );

      if (response.ok) {
        setAddingToDay(null);
        onWorkoutAdded?.();
      }
    } catch (error) {
      console.error("Error adding workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveWorkout = async (planWorkoutId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/training-plans/${planId}/weeks/${weekId}/workouts/${planWorkoutId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        onWorkoutRemoved?.();
      }
    } catch (error) {
      console.error("Error removing workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorkouts = availableWorkouts.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-2 sm:grid-cols-7">
      {workoutsByDay.map(({ day, key, workouts: dayWorkouts }) => (
        <div
          key={day}
          className="min-h-[100px] rounded-lg border bg-muted/30 p-2"
        >
          <div className="mb-2 text-center text-xs font-medium text-muted-foreground">
            {t(`days.${key}`)}
          </div>

          <div className="space-y-2">
            {dayWorkouts.length === 0 ? (
              <p className="py-2 text-center text-xs text-muted-foreground">
                {t("days.rest")}
              </p>
            ) : (
              dayWorkouts.map((planWorkout) => {
                const blockTypes = [
                  ...new Set(planWorkout.workout.blocks.map((b) => b.type)),
                ];
                const totalBlocks = planWorkout.workout.blocks.length;

                return (
                  <Link
                    key={planWorkout.id}
                    href={`/workouts/${planWorkout.workout.id}/run?returnTo=/workouts/plans/${planId}`}
                    className="group relative block cursor-pointer rounded-lg border bg-background p-2.5 text-xs shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    {/* Header with name and actions */}
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                          <PlayIcon className="h-3 w-3 text-primary" />
                        </div>
                        <span className="line-clamp-2 font-semibold">
                          {planWorkout.workout.name}
                        </span>
                      </div>
                      {canEdit && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVerticalIcon className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveWorkout(planWorkout.id);
                              }}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              {t("workouts.removeFromDay")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Block types badges */}
                    {blockTypes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {blockTypes.slice(0, 2).map((type) => {
                          const blockInfo = BLOCK_TYPE_INFO[type];
                          return (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="px-1.5 py-0 text-[10px]"
                              style={{
                                backgroundColor: `${blockInfo.color}20`,
                                color: blockInfo.color,
                              }}
                            >
                              {tWorkouts(`blocks.types.${type}`)}
                            </Badge>
                          );
                        })}
                        {blockTypes.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            +{blockTypes.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-0.5">
                        <DumbbellIcon className="h-3 w-3" />
                        <span>
                          {t("stats.totalBlocks", { count: totalBlocks })}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {planWorkout.notes && (
                      <p className="mt-1.5 line-clamp-1 text-[10px] italic text-muted-foreground">
                        {planWorkout.notes}
                      </p>
                    )}
                  </Link>
                );
              })
            )}

            {canEdit && (
              <Dialog
                open={addingToDay === day}
                onOpenChange={(open) => !open && setAddingToDay(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-full text-xs"
                    onClick={() => handleOpenAddWorkout(day)}
                  >
                    <PlusIcon className="mr-1 h-3 w-3" />
                    {t("days.addWorkout")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("workouts.addToDay")}</DialogTitle>
                    <DialogDescription>{t(`days.${key}`)}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Input
                      placeholder={t("workouts.searchWorkouts")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="max-h-[300px] space-y-2 overflow-y-auto">
                      {isLoadingWorkouts ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : filteredWorkouts.length > 0 ? (
                        filteredWorkouts.map((workout) => (
                          <div
                            key={workout.id}
                            className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-muted"
                            onClick={() => handleAddWorkout(workout.id)}
                          >
                            <div>
                              <p className="font-medium">{workout.name}</p>
                              {workout.description && (
                                <p className="line-clamp-1 text-sm text-muted-foreground">
                                  {workout.description}
                                </p>
                              )}
                            </div>
                            {isLoading && (
                              <Loader2Icon className="h-4 w-4 animate-spin" />
                            )}
                          </div>
                        ))
                      ) : availableWorkouts.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          {t("workouts.noWorkoutsAvailable")}
                        </p>
                      ) : (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          {t("workouts.noResults")}
                        </p>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddingToDay(null)}
                    >
                      {t("form.cancel")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
