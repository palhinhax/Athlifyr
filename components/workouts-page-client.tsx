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
  const [activeTab, setActiveTab] = useState("my-workouts");

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch all workouts (user's own + public)
      const response = await fetch("/api/workouts");
      if (response.ok) {
        const data = await response.json();
        const allWorkouts = data.items || [];

        // Separate user's workouts from public workouts
        setWorkouts(
          allWorkouts.filter(
            (w: WorkoutApiResponse) => w.createdById === userId
          )
        );
        setPublicWorkouts(
          allWorkouts.filter(
            (w: WorkoutApiResponse) =>
              w.createdById !== userId && w.isPublic === true
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

  const tabs = [
    {
      value: "my-workouts",
      label: t("myWorkouts"),
      icon: <DumbbellIcon />,
      badge:
        workouts.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({workouts.length})
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
              <WorkoutCard key={workout.id} workout={workout} canEdit={false} />
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
