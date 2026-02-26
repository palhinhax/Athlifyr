"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveTabs,
  ResponsiveTabsContent,
} from "@/components/ui/responsive-tabs";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusIcon,
  DumbbellIcon,
  GlobeIcon,
  HistoryIcon,
  CalendarDaysIcon,
  BookmarkIcon,
  SearchIcon,
  UserCheckIcon,
} from "lucide-react";
import { WorkoutCard } from "@/components/workout-card";
import { WorkoutBuilder } from "@/components/workout-builder";
import { WorkoutHistory } from "@/components/workout-history";
import { Link } from "@/i18n/routing";
import type { WorkoutWithBlocks } from "@/types/workout";
import type { UserTrainingPlanWithDetails } from "@/types/training-plan";

interface WorkoutsPageClientProps {
  userId: string;
  isStaff?: boolean;
}

interface WorkoutApiResponse extends WorkoutWithBlocks {
  createdById: string;
  isPublic: boolean;
  isSaved?: boolean;
}

export function WorkoutsPageClient({
  userId,
  isStaff = false,
}: WorkoutsPageClientProps) {
  const t = useTranslations("workouts");
  const { toast } = useToast();

  const [myWorkouts, setMyWorkouts] = useState<WorkoutApiResponse[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutApiResponse[]>([]);
  const [publicWorkouts, setPublicWorkouts] = useState<WorkoutApiResponse[]>(
    []
  );
  const [assignedPlans, setAssignedPlans] = useState<
    UserTrainingPlanWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAssigned, setIsLoadingAssigned] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] =
    useState<WorkoutWithBlocks | null>(null);
  const [activeTab, setActiveTab] = useState(isStaff ? "my-workouts" : "saved");

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch all workouts with pagination (user's own + public + saved)
      const allWorkouts: WorkoutApiResponse[] = [];
      let cursor: string | null = null;
      let hasMore = true;

      while (hasMore) {
        const params = new URLSearchParams({ limit: "50" });
        if (cursor) params.set("cursor", cursor);

        const response = await fetch(`/api/workouts?${params.toString()}`);
        if (!response.ok) break;

        const data = await response.json();
        const items: WorkoutApiResponse[] = data.items || [];
        allWorkouts.push(...items);
        hasMore = data.hasMore ?? false;
        cursor = data.nextCursor ?? null;
      }

      // Separate workouts into categories
      // My workouts: created by me
      setMyWorkouts(allWorkouts.filter((w) => w.createdById === userId));

      // Saved workouts: not created by me but saved
      setSavedWorkouts(allWorkouts.filter((w) => w.isSaved));

      // Public workouts: all public workouts not yet saved (for discovery)
      setPublicWorkouts(allWorkouts.filter((w) => w.isPublic && !w.isSaved));
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

  // Fetch assigned training plans (for normal users)
  const fetchAssignedPlans = useCallback(async () => {
    if (isStaff) return; // Pro users don't need this

    try {
      setIsLoadingAssigned(true);
      const response = await fetch("/api/training-plans?assignedToMe=true");
      if (response.ok) {
        const data = await response.json();
        setAssignedPlans(data.userPlans || []);
      }
    } catch (error) {
      console.error("Failed to fetch assigned plans:", error);
    } finally {
      setIsLoadingAssigned(false);
    }
  }, [isStaff]);

  useEffect(() => {
    fetchWorkouts();
    fetchAssignedPlans();
  }, [fetchWorkouts, fetchAssignedPlans]);

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

  // Pro users can use the workout builder
  if (showBuilder && isStaff) {
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

  // Combined count for saved workouts (for normal users)
  const savedWorkoutsCount = savedWorkouts.length;
  // Combined count: my workouts + saved workouts (for Pro users)
  const myWorkoutsCount = myWorkouts.length + savedWorkouts.length;

  // Tabs for Pro users - full functionality
  const proTabs = [
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

  // Tabs for normal users - limited functionality (saved + assigned + public + history)
  const normalTabs = [
    {
      value: "saved",
      label: t("savedWorkouts"),
      icon: <BookmarkIcon />,
      badge:
        savedWorkoutsCount > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({savedWorkoutsCount})
          </span>
        ) : undefined,
    },
    {
      value: "assigned",
      label: t("plans.assignedPlans"),
      icon: <UserCheckIcon />,
      badge:
        assignedPlans.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({assignedPlans.length})
          </span>
        ) : undefined,
    },
    {
      value: "public",
      label: t("publicTab"),
      icon: <GlobeIcon />,
    },
    {
      value: "history",
      label: t("history.title"),
      icon: <HistoryIcon />,
    },
  ];

  const tabs = isStaff ? proTabs : normalTabs;

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {isStaff ? t("subtitle") : t("subtitleBasic")}
          </p>
        </div>
        {isStaff && (
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
        )}
      </div>

      <ResponsiveTabs
        tabs={tabs}
        value={activeTab}
        onValueChange={setActiveTab}
      />

      {/* PRO USER: My Workouts Tab */}
      {isStaff && (
        <ResponsiveTabsContent value="my-workouts" activeValue={activeTab}>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-lg bg-muted"
                />
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
                    <DumbbellIcon className="h-5 w-5 text-p-brand" />
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
                    <BookmarkIcon className="h-5 w-5 text-p-golden" />
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
      )}

      {/* PRO USER: Public Workouts Tab */}
      {isStaff && (
        <ResponsiveTabsContent value="public" activeValue={activeTab}>
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
      )}

      {/* NORMAL USER: Saved Tab (Saved Workouts + Saved Plans) */}
      {!isStaff && (
        <ResponsiveTabsContent value="saved" activeValue={activeTab}>
          <SavedContentTab
            savedWorkouts={savedWorkouts}
            isLoading={isLoading}
            onSaveToggle={handleSaveToggle}
          />
        </ResponsiveTabsContent>
      )}

      {/* NORMAL USER: Assigned Plans Tab */}
      {!isStaff && (
        <ResponsiveTabsContent value="assigned" activeValue={activeTab}>
          <AssignedPlansTab
            assignedPlans={assignedPlans}
            isLoading={isLoadingAssigned}
          />
        </ResponsiveTabsContent>
      )}

      {/* NORMAL USER: Public Tab (Discover workouts and plans) */}
      {!isStaff && (
        <ResponsiveTabsContent value="public" activeValue={activeTab}>
          <PublicContentTab
            userId={userId}
            publicWorkouts={publicWorkouts}
            isLoading={isLoading}
            onSaveToggle={handleSaveToggle}
          />
        </ResponsiveTabsContent>
      )}

      {/* History Tab - Both users */}
      <ResponsiveTabsContent value="history" activeValue={activeTab}>
        <WorkoutHistory userId={userId} />
      </ResponsiveTabsContent>
    </div>
  );
}

// Component for normal users to view saved workouts and plans
function SavedContentTab({
  savedWorkouts,
  isLoading: workoutsLoading,
  onSaveToggle,
}: {
  savedWorkouts: WorkoutApiResponse[];
  isLoading: boolean;
  onSaveToggle: () => void;
}) {
  const t = useTranslations("workouts");
  const tPlans = useTranslations("workouts.plans");
  const { toast } = useToast();

  const [contentType, setContentType] = useState<"workouts" | "plans">(
    "workouts"
  );
  const [savedPlans, setSavedPlans] = useState<
    Array<{
      id: string;
      name: string;
      description: string | null;
      weeks: Array<{ id: string }>;
      isPublic: boolean;
      createdById: string;
      isSaved?: boolean;
      createdBy?: { name: string | null; image: string | null };
    }>
  >([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  const fetchSavedPlans = useCallback(async () => {
    try {
      const response = await fetch("/api/training-plans");
      if (response.ok) {
        const data = await response.json();
        // Show only saved plans
        const saved = (data.plans || []).filter(
          (p: { isSaved?: boolean }) => p.isSaved
        );
        setSavedPlans(saved);
      }
    } catch {
      toast({
        title: tPlans("errors.loadFailed"),
        variant: "destructive",
      });
    } finally {
      setPlansLoading(false);
    }
  }, [tPlans, toast]);

  useEffect(() => {
    fetchSavedPlans();
  }, [fetchSavedPlans]);

  const handleUnsavePlan = async (e: React.MouseEvent, planId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setSavingPlanId(planId);
    try {
      const response = await fetch(`/api/training-plans/${planId}/save`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: tPlans("unsaved"),
        });
        // Remove from local state
        setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
        onSaveToggle();
      } else {
        toast({
          title: tPlans("errors.saveFailed"),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: tPlans("errors.saveFailed"),
        variant: "destructive",
      });
    } finally {
      setSavingPlanId(null);
    }
  };

  const isLoading = contentType === "workouts" ? workoutsLoading : plansLoading;
  const hasContent =
    contentType === "workouts"
      ? savedWorkouts.length > 0
      : savedPlans.length > 0;

  return (
    <div className="space-y-6">
      {/* Content Type Toggle */}
      <div className="flex gap-2">
        <Button
          variant={contentType === "workouts" ? "default" : "outline"}
          size="sm"
          onClick={() => setContentType("workouts")}
        >
          <DumbbellIcon className="mr-2 h-4 w-4" />
          {t("title")}
          {savedWorkouts.length > 0 && (
            <span className="ml-2 text-xs">({savedWorkouts.length})</span>
          )}
        </Button>
        <Button
          variant={contentType === "plans" ? "default" : "outline"}
          size="sm"
          onClick={() => setContentType("plans")}
        >
          <CalendarDaysIcon className="mr-2 h-4 w-4" />
          {tPlans("title")}
          {savedPlans.length > 0 && (
            <span className="ml-2 text-xs">({savedPlans.length})</span>
          )}
        </Button>
      </div>

      {/* Content Display */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !hasContent ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">
            {contentType === "workouts"
              ? t("noSavedWorkouts")
              : tPlans("noSavedPlans")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {contentType === "workouts"
              ? t("noSavedWorkoutsDescription")
              : tPlans("noSavedPlansDescription")}
          </p>
        </div>
      ) : contentType === "workouts" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              canEdit={false}
              canSave={true}
              onSaveToggle={onSaveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedPlans.map((plan) => (
            <div
              key={plan.id}
              className="group relative flex h-full flex-col rounded-lg border p-4 transition-colors hover:border-accent/30 hover:bg-muted/50 hover:shadow-md"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnsavePlan(e, plan.id);
                }}
                disabled={savingPlanId === plan.id}
                className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-muted"
                aria-label={tPlans("unsave")}
              >
                <BookmarkIcon
                  className={`h-5 w-5 fill-current text-accent transition-colors hover:text-muted-foreground ${
                    savingPlanId === plan.id ? "animate-pulse" : ""
                  }`}
                />
              </button>
              <Link
                href={`/workouts/plans/${plan.id}`}
                className="flex flex-1 cursor-pointer flex-col"
              >
                <div className="flex-1 pr-8">
                  <h3 className="line-clamp-1 font-semibold group-hover:text-accent">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  )}
                </div>
                <div className="mt-auto pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDaysIcon className="h-4 w-4 text-p-info" />
                    <span>
                      {plan.weeks?.length ?? 0} {tPlans("weeksCount")}
                    </span>
                  </div>
                  {plan.createdBy?.name && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={plan.createdBy.image || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {plan.createdBy.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {tPlans("createdByLabel")}{" "}
                        <span className="font-medium text-foreground">
                          {plan.createdBy.name}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Component for normal users to discover public workouts and plans
function PublicContentTab({
  userId: _userId,
  publicWorkouts,
  isLoading: workoutsLoading,
  onSaveToggle,
}: {
  userId: string;
  publicWorkouts: WorkoutApiResponse[];
  isLoading: boolean;
  onSaveToggle: () => void;
}) {
  const t = useTranslations("workouts");
  const tPlans = useTranslations("workouts.plans");
  const { toast } = useToast();

  const [contentType, setContentType] = useState<"workouts" | "plans">(
    "workouts"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [plans, setPlans] = useState<
    Array<{
      id: string;
      name: string;
      description: string | null;
      weeks: Array<{ id: string }>;
      isPublic: boolean;
      createdById: string;
      isSaved?: boolean;
      createdBy?: { name: string | null; image: string | null };
    }>
  >([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const response = await fetch("/api/training-plans");
      if (response.ok) {
        const data = await response.json();
        // Show all public plans
        const publicPlans = (data.plans || []).filter(
          (p: { isPublic: boolean; createdById: string }) => p.isPublic
        );
        setPlans(publicPlans);
      }
    } catch {
      toast({
        title: tPlans("errors.loadFailed"),
        variant: "destructive",
      });
    } finally {
      setPlansLoading(false);
    }
  }, [tPlans, toast]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSavePlan = async (
    e: React.MouseEvent,
    planId: string,
    isSaved: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setSavingPlanId(planId);
    try {
      const response = await fetch(`/api/training-plans/${planId}/save`, {
        method: isSaved ? "DELETE" : "POST",
      });

      if (response.ok) {
        toast({
          title: isSaved ? tPlans("unsaved") : tPlans("saved"),
        });
        // Update local state
        setPlans((prev) =>
          prev.map((p) => (p.id === planId ? { ...p, isSaved: !isSaved } : p))
        );
        onSaveToggle();
      } else {
        toast({
          title: tPlans("errors.saveFailed"),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: tPlans("errors.saveFailed"),
        variant: "destructive",
      });
    } finally {
      setSavingPlanId(null);
    }
  };

  // Filter content based on search
  const filteredWorkouts = publicWorkouts.filter((workout) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      workout.name.toLowerCase().includes(query) ||
      workout.description?.toLowerCase().includes(query) ||
      workout.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const filteredPlans = plans.filter((plan) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      plan.name.toLowerCase().includes(query) ||
      plan.description?.toLowerCase().includes(query)
    );
  });

  const isLoading = contentType === "workouts" ? workoutsLoading : plansLoading;
  const hasContent =
    contentType === "workouts"
      ? filteredWorkouts.length > 0
      : filteredPlans.length > 0;

  return (
    <div className="space-y-6">
      {/* Content Type Toggle and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={contentType === "workouts" ? "default" : "outline"}
            size="sm"
            onClick={() => setContentType("workouts")}
          >
            <DumbbellIcon className="mr-2 h-4 w-4" />
            {t("title")}
          </Button>
          <Button
            variant={contentType === "plans" ? "default" : "outline"}
            size="sm"
            onClick={() => setContentType("plans")}
          >
            <CalendarDaysIcon className="mr-2 h-4 w-4" />
            {tPlans("title")}
          </Button>
        </div>

        <div className="relative flex-1 sm:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Content Display */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !hasContent ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">
            {searchQuery ? t("noSearchResults") : t("noPublicContent")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? t("noSearchResultsDescription")
              : t("noPublicContentDescription")}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              {t("clearSearch")}
            </Button>
          )}
        </div>
      ) : contentType === "workouts" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              canEdit={false}
              canSave={true}
              onSaveToggle={onSaveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="group relative flex h-full flex-col rounded-lg border p-4 transition-colors hover:border-accent/30 hover:bg-muted/50 hover:shadow-md"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSavePlan(e, plan.id, !!plan.isSaved);
                }}
                disabled={savingPlanId === plan.id}
                className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-muted"
                aria-label={plan.isSaved ? tPlans("unsave") : tPlans("save")}
              >
                <BookmarkIcon
                  className={`h-5 w-5 transition-colors ${
                    plan.isSaved
                      ? "fill-current text-accent"
                      : "text-muted-foreground hover:text-accent"
                  } ${savingPlanId === plan.id ? "animate-pulse" : ""}`}
                />
              </button>
              <Link
                href={`/workouts/plans/${plan.id}`}
                className="flex flex-1 cursor-pointer flex-col"
              >
                <div className="flex-1 pr-8">
                  <h3 className="line-clamp-1 font-semibold group-hover:text-accent">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  )}
                </div>
                <div className="mt-auto pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDaysIcon className="h-4 w-4 text-p-info" />
                    <span>
                      {plan.weeks?.length ?? 0} {tPlans("weeksCount")}
                    </span>
                  </div>
                  {plan.createdBy?.name && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={plan.createdBy.image || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {plan.createdBy.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {tPlans("createdByLabel")}{" "}
                        <span className="font-medium text-foreground">
                          {plan.createdBy.name}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Component for normal users to view assigned training plans
function AssignedPlansTab({
  assignedPlans,
  isLoading,
}: {
  assignedPlans: UserTrainingPlanWithDetails[];
  isLoading: boolean;
}) {
  const t = useTranslations("workouts");
  const tPlans = useTranslations("workouts.plans");

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (assignedPlans.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <UserCheckIcon className="mx-auto h-12 w-12 text-p-info/50" />
        <p className="mt-4 text-lg font-medium">{tPlans("noAssignedPlans")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {tPlans("noAssignedPlansDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assignedPlans.map((userPlan) => (
        <Link key={userPlan.id} href={`/workouts/plans/${userPlan.plan.id}`}>
          <div className="group flex h-full cursor-pointer flex-col rounded-lg border p-4 transition-colors hover:border-p-info/30 hover:bg-muted/50 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <UserCheckIcon className="h-4 w-4 text-p-info" />
                  <span className="text-xs font-medium text-p-info">
                    {t("plans.assignedToYou")}
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-1 font-semibold group-hover:text-accent">
                  {userPlan.plan.name}
                </h3>
                {userPlan.plan.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {userPlan.plan.description}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDaysIcon className="h-4 w-4 text-p-info" />
                <span>
                  {userPlan.plan.weeks?.length || 0} {tPlans("weeksCount")}
                </span>
              </div>
              {userPlan.assignedBy?.name && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("plans.assignedByLabel")} {userPlan.assignedBy.name}
                </p>
              )}
              {userPlan.startDate && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("plans.startDateLabel")}{" "}
                  {new Date(userPlan.startDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
