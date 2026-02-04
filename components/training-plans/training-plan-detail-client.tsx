"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "@/i18n/routing";
import {
  TrainingPlanForm,
  TrainingPlanWeekEditor,
  AssignPlanDialog,
  type TrainingPlanFormData,
} from "@/components/training-plans";
import type { TrainingPlanWithDetails } from "@/types/training-plan";

interface TrainingPlanDetailClientProps {
  userId: string;
}

export function TrainingPlanDetailClient({
  userId,
}: TrainingPlanDetailClientProps) {
  const t = useTranslations("workouts.plans");
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const [plan, setPlan] = useState<TrainingPlanWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingWeek, setIsAddingWeek] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(() => {
    // Restore expanded weeks from localStorage on initial load
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`plan-expanded-weeks-${planId}`);
      if (saved) {
        try {
          return new Set(JSON.parse(saved) as string[]);
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  const fetchPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/training-plans/${planId}`);
      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan);
      } else if (response.status === 404) {
        router.push("/workouts/plans");
      }
    } catch {
      toast({
        title: t("errors.loadFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [planId, router, t, toast]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleUpdatePlan = async (data: TrainingPlanFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/training-plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { plan: updatedPlan } = await response.json();
        setPlan((prev: TrainingPlanWithDetails | null) =>
          prev ? { ...prev, ...updatedPlan } : null
        );
        setIsEditing(false);
        toast({ title: t("success.updated") });
      }
    } catch {
      toast({
        title: t("errors.saveFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/training-plans/${planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({ title: t("success.deleted") });
        router.push("/workouts/plans");
      }
    } catch {
      toast({
        title: t("errors.deleteFailed"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddWeek = async () => {
    setIsAddingWeek(true);
    try {
      const nextWeekNumber = (plan?.weeks.length ?? 0) + 1;
      const response = await fetch(`/api/training-plans/${planId}/weeks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekNumber: nextWeekNumber,
        }),
      });

      if (response.ok) {
        toast({ title: t("success.weekAdded") });
        fetchPlan();
      }
    } catch {
      toast({
        title: t("errors.saveFailed"),
        variant: "destructive",
      });
    } finally {
      setIsAddingWeek(false);
    }
  };

  const handleUpdateWeek = async (
    weekId: string,
    data: { name?: string; description?: string }
  ) => {
    try {
      const response = await fetch(
        `/api/training-plans/${planId}/weeks/${weekId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast({ title: t("success.weekUpdated") });
        fetchPlan();
      }
    } catch {
      toast({
        title: t("errors.saveFailed"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteWeek = async (weekId: string) => {
    try {
      const response = await fetch(
        `/api/training-plans/${planId}/weeks/${weekId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast({ title: t("success.weekDeleted") });
        fetchPlan();
      }
    } catch {
      toast({
        title: t("errors.deleteFailed"),
        variant: "destructive",
      });
    }
  };

  const handleAssignPlan = async (
    planId: string,
    userId: string,
    startDate: Date,
    notes?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/training-plans/${planId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          startDate: startDate.toISOString(),
          notes,
        }),
      });

      if (response.ok) {
        toast({ title: t("success.assigned") });
        fetchPlan(); // Refresh to update assigned count
        return true;
      } else {
        const error = await response.json();
        toast({
          title: t("errors.assignFailed"),
          description: error.error || t("errors.assignFailed"),
          variant: "destructive",
        });
        return false;
      }
    } catch {
      toast({
        title: t("errors.assignFailed"),
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDuplicateWeek = async (_weekId: string) => {
    // TODO: Implement week duplication
    toast({
      title: "Coming soon",
      description: "Week duplication will be available soon.",
    });
  };

  const toggleWeekExpanded = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `plan-expanded-weeks-${planId}`,
          JSON.stringify(Array.from(next))
        );
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">{t("errors.notFound")}</p>
          <Button asChild className="mt-4">
            <Link href="/workouts/plans">{t("title")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalWorkouts = plan.weeks.reduce(
    (sum: number, week: { workouts: unknown[] }) => sum + week.workouts.length,
    0
  );

  // Check if user is the owner of the plan (can edit)
  const isOwner = plan.createdById === userId;

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 2:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case 4:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6">
        {/* Back button - Icon only on mobile */}
        <Button variant="ghost" asChild className="-ml-2 mb-4">
          <Link href="/workouts/plans">
            <ArrowLeftIcon className="mr-0 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t("title")}</span>
          </Link>
        </Button>

        {/* Title and actions row */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-xl font-bold sm:text-2xl">
              {plan.name}
            </h1>
            {plan.description && (
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {plan.description}
              </p>
            )}
          </div>

          {/* Action buttons - Responsive */}
          {isOwner && (
            <div className="flex shrink-0 gap-2">
              {/* Mobile: Icon buttons only */}
              <Button
                variant="default"
                size="icon"
                onClick={() => setIsAssignDialogOpen(true)}
                className="sm:hidden"
              >
                <UsersIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="sm:hidden"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setIsDeleting(true)}
                className="sm:hidden"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>

              {/* Desktop: Full buttons with text */}
              <Button
                variant="default"
                onClick={() => setIsAssignDialogOpen(true)}
                className="hidden sm:flex"
              >
                <UsersIcon className="mr-2 h-4 w-4" />
                {t("assignPlan")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="hidden sm:flex"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                {t("editPlan")}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setIsDeleting(true)}
                className="hidden sm:flex"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Creator info - Stacked on mobile */}
        {plan.createdBy && (
          <Link
            href={`/user/${plan.createdBy.id}`}
            className="mb-3 inline-flex w-full items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 transition-colors hover:bg-muted sm:w-auto sm:rounded-full"
          >
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={plan.createdBy.image || undefined} />
              <AvatarFallback className="text-xs">
                {plan.createdBy.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 text-sm">
              <span className="text-muted-foreground">{t("createdBy")}</span>{" "}
              <span className="font-medium">{plan.createdBy.name}</span>
            </span>
          </Link>
        )}

        {/* Stats - Grid layout on mobile */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDaysIcon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">
              {t("stats.totalWeeks", { count: plan.duration ?? 0 })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ClipboardListIcon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">
              {t("stats.totalWorkouts", { count: totalWorkouts })}
            </span>
          </div>
          {isOwner && plan._count?.assignedToUsers > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <UsersIcon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">
                {t("stats.assignedAthletes", {
                  count: plan._count.assignedToUsers,
                })}
              </span>
            </div>
          )}
          <Badge
            variant="secondary"
            className={getDifficultyColor(plan.difficulty ?? 1)}
          >
            {t(`difficulty.${plan.difficulty ?? 1}`)}
          </Badge>
        </div>
      </div>

      {/* Weeks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("weeks.title")}</CardTitle>
          {isOwner && (
            <Button onClick={handleAddWeek} disabled={isAddingWeek}>
              {isAddingWeek ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusIcon className="mr-2 h-4 w-4" />
              )}
              {t("weeks.addWeek")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {plan.weeks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">{t("weeks.noWeeks")}</p>
              <p className="text-sm text-muted-foreground">
                {t("weeks.noWeeksDescription")}
              </p>
              {isOwner && (
                <Button className="mt-4" onClick={handleAddWeek}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  {t("weeks.addWeek")}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {plan.weeks.map(
                (
                  week: TrainingPlanWithDetails["weeks"][number],
                  index: number
                ) => (
                  <TrainingPlanWeekEditor
                    key={week.id}
                    week={week}
                    weekNumber={week.weekNumber}
                    planId={planId}
                    isExpanded={expandedWeeks.has(week.id)}
                    onToggleExpand={() => toggleWeekExpanded(week.id)}
                    onUpdate={handleUpdateWeek}
                    onDelete={handleDeleteWeek}
                    onDuplicate={handleDuplicateWeek}
                    canMoveUp={index > 0}
                    canMoveDown={index < plan.weeks.length - 1}
                    onWorkoutAdded={fetchPlan}
                    onWorkoutRemoved={fetchPlan}
                    canEdit={isOwner}
                  />
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("editPlan")}</DialogTitle>
            <DialogDescription>{t("subtitle")}</DialogDescription>
          </DialogHeader>
          <TrainingPlanForm
            plan={plan}
            onSubmit={handleUpdatePlan}
            onCancel={() => setIsEditing(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deletePlan")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("progress.leavePlanConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("form.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deletePlan")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Plan Dialog */}
      <AssignPlanDialog
        plan={plan}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={handleAssignPlan}
      />
    </div>
  );
}
