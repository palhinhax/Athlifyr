"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  ResponsiveTabs,
  ResponsiveTabsContent,
} from "@/components/ui/responsive-tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusIcon,
  DumbbellIcon,
  GlobeIcon,
  HistoryIcon,
  CalendarDaysIcon,
  BookmarkIcon,
} from "lucide-react";
import { WorkoutCard } from "@/components/workout-card";
import { WorkoutBuilder } from "@/components/workout-builder";
import { WorkoutHistory } from "@/components/workout-history";
import { Link } from "@/i18n/routing";
import type { WorkoutWithBlocks } from "@/types/workout";

interface WorkoutsPageClientProps {
  userId: string;
}

interface WorkoutApiResponse extends WorkoutWithBlocks {
  createdById: string;
  isPublic: boolean;
  isSaved?: boolean;
}

export function WorkoutsPageClient({ userId }: WorkoutsPageClientProps) {
  const t = useTranslations("workouts");
  const { toast } = useToast();
  const [myWorkouts, setMyWorkouts] = useState<WorkoutApiResponse[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutApiResponse[]>([]);
  const [publicWorkouts, setPublicWorkouts] = useState<WorkoutApiResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] =
    useState<WorkoutWithBlocks | null>(null);
  const [activeTab, setActiveTab] = useState("my-workouts");

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch all workouts (user's own + public + saved)
      const response = await fetch("/api/workouts");
      if (response.ok) {
        const data = await response.json();
        const allWorkouts: WorkoutApiResponse[] = data.items || [];

        // Separate workouts into categories
        // My workouts: created by me
        setMyWorkouts(allWorkouts.filter((w) => w.createdById === userId));

        // Saved workouts: not created by me but saved
        setSavedWorkouts(
          allWorkouts.filter((w) => w.createdById !== userId && w.isSaved)
        );

        // Public workouts: not created by me and not saved (for discovery)
        setPublicWorkouts(
          allWorkouts.filter(
            (w) => w.createdById !== userId && w.isPublic && !w.isSaved
          )
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

  const handleSaveToggle = () => {
    // Refresh to update the lists
    fetchWorkouts();
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

  // Combined count: my workouts + saved workouts
  const myWorkoutsCount = myWorkouts.length + savedWorkouts.length;

  const tabs = [
    {
      value: "my-workouts",
      label: t("myWorkouts"),
      icon: <DumbbellIcon />,
      badge:
        myWorkoutsCount > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({myWorkoutsCount})
          </span>
        ) : undefined,
    },
    {
      value: "public",
      label: t("publicWorkouts"),
      icon: <GlobeIcon />,
      badge:
        publicWorkouts.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({publicWorkouts.length})
          </span>
        ) : undefined,
    },
    {
      value: "history",
      label: t("history.title"),
      icon: <HistoryIcon />,
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/workouts/plans">
              <CalendarDaysIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("plans.title")}</span>
            </Link>
          </Button>
          <Button onClick={handleCreateWorkout}>
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("createWorkout")}</span>
          </Button>
        </div>
      </div>

      <ResponsiveTabs
        tabs={tabs}
        value={activeTab}
        onValueChange={setActiveTab}
      />

      <ResponsiveTabsContent value="my-workouts" activeValue={activeTab}>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : myWorkoutsCount === 0 ? (
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
          <div className="space-y-6">
            {/* My created workouts */}
            {myWorkouts.length > 0 && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <DumbbellIcon className="h-5 w-5" />
                  {t("createdByMe")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {myWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      onEdit={() => handleEditWorkout(workout)}
                      onDelete={() => handleDeleteWorkout(workout.id)}
                      canEdit={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Saved workouts */}
            {savedWorkouts.length > 0 && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <BookmarkIcon className="h-5 w-5" />
                  {t("savedWorkouts")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {savedWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      canEdit={false}
                      canSave={true}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ResponsiveTabsContent>

      <ResponsiveTabsContent value="public" activeValue={activeTab}>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : publicWorkouts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">{t("noPublicWorkouts")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                canEdit={false}
                canSave={true}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}
      </ResponsiveTabsContent>

      <ResponsiveTabsContent value="history" activeValue={activeTab}>
        <WorkoutHistory userId={userId} />
      </ResponsiveTabsContent>
    </div>
  );
}
