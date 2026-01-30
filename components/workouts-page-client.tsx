"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { PlusIcon } from "lucide-react";
import { WorkoutCard } from "@/components/workout-card";
import { WorkoutBuilder } from "@/components/workout-builder";
import { WorkoutHistory } from "@/components/workout-history";
import type { WorkoutWithBlocks } from "@/types/workout";

interface WorkoutsPageClientProps {
  userId: string;
}

interface WorkoutApiResponse extends WorkoutWithBlocks {
  createdById: string;
}

export function WorkoutsPageClient({ userId }: WorkoutsPageClientProps) {
  const t = useTranslations("workouts");
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<WorkoutWithBlocks[]>([]);
  const [publicWorkouts, setPublicWorkouts] = useState<WorkoutWithBlocks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] =
    useState<WorkoutWithBlocks | null>(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch user's workouts
      const myResponse = await fetch(`/api/workouts?creatorId=${userId}`);
      if (myResponse.ok) {
        const myData = await myResponse.json();
        setWorkouts(myData.workouts || []);
      }

      // Fetch public workouts
      const publicResponse = await fetch("/api/workouts?isPublic=true");
      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        setPublicWorkouts(
          publicData.workouts?.filter(
            (w: WorkoutApiResponse) => w.createdById !== userId
          ) || []
        );
      }
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
      toast({
        title: t("errors.loadFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, t, toast]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleCreateWorkout = () => {
    setEditingWorkout(null);
    setShowBuilder(true);
  };

  const handleEditWorkout = (workout: WorkoutWithBlocks) => {
    setEditingWorkout(workout);
    setShowBuilder(true);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: t("success.deleted"),
        });
        fetchWorkouts();
      } else {
        toast({
          title: t("errors.deleteFailed"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete workout:", error);
      toast({
        title: t("errors.deleteFailed"),
        variant: "destructive",
      });
    }
  };

  const handleSaveWorkout = async () => {
    setShowBuilder(false);
    setEditingWorkout(null);
    await fetchWorkouts();
  };

  const handleCancelBuilder = () => {
    setShowBuilder(false);
    setEditingWorkout(null);
  };

  if (showBuilder) {
    return (
      <div className="container py-8">
        <WorkoutBuilder
          workout={editingWorkout}
          onSave={handleSaveWorkout}
          onCancel={handleCancelBuilder}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={handleCreateWorkout}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("createWorkout")}
        </Button>
      </div>

      <Tabs defaultValue="my-workouts">
        <TabsList>
          <TabsTrigger value="my-workouts">{t("myWorkouts")}</TabsTrigger>
          <TabsTrigger value="public">{t("publicWorkouts")}</TabsTrigger>
          <TabsTrigger value="history">{t("history.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-workouts" className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-lg font-medium">{t("noWorkouts")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("noWorkoutsDescription")}
              </p>
              <Button onClick={handleCreateWorkout} className="mt-4">
                <PlusIcon className="mr-2 h-4 w-4" />
                {t("createWorkout")}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onEdit={() => handleEditWorkout(workout)}
                  onDelete={() => handleDeleteWorkout(workout.id)}
                  canEdit={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public" className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : publicWorkouts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">
                No public workouts available yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {publicWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  canEdit={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <WorkoutHistory userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
