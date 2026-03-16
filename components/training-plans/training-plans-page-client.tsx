"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveTabs,
  ResponsiveTabsContent,
} from "@/components/ui/responsive-tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookmarkIcon,
  CalendarDaysIcon,
  DumbbellIcon,
  GlobeIcon,
  Loader2Icon,
  PlusIcon,
  LayoutTemplateIcon,
  UserCheckIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "@/i18n/routing";
import { TrainingPlanCard } from "./training-plan-card";
import {
  TrainingPlanForm,
  type TrainingPlanFormData,
} from "./training-plan-form";
import { AssignPlanDialog } from "./assign-plan-dialog";
import type {
  TrainingPlanWithDetails,
  UserTrainingPlanWithDetails,
} from "@/types/training-plan";
import { useRouter } from "@/i18n/routing";

type TrainingPlanWithSaved = TrainingPlanWithDetails & {
  isSaved?: boolean;
};

interface TrainingPlansPageClientProps {
  initialPlans?: TrainingPlanWithSaved[];
  userId?: string;
}

export function TrainingPlansPageClient({
  initialPlans = [],
  userId,
}: TrainingPlansPageClientProps) {
  const t = useTranslations("workouts.plans");
  const tWorkouts = useTranslations("workouts");
  const { toast } = useToast();
  const router = useRouter();

  const [plans, setPlans] = useState<TrainingPlanWithSaved[]>(initialPlans);
  const [assignedPlans, setAssignedPlans] = useState<
    UserTrainingPlanWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(!initialPlans.length);
  const [isLoadingAssigned, setIsLoadingAssigned] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("my-plans");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedPlanForAssign, setSelectedPlanForAssign] =
    useState<TrainingPlanWithDetails | null>(null);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/training-plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch {
      toast({
        title: t("errors.loadFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  const fetchAssignedPlans = useCallback(async () => {
    setIsLoadingAssigned(true);
    try {
      const response = await fetch("/api/training-plans?assignedToMe=true");
      if (response.ok) {
        const data = await response.json();
        setAssignedPlans(data.userPlans || []);
      }
    } catch {
      toast({
        title: t("errors.loadFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingAssigned(false);
    }
  }, [t, toast]);

  useEffect(() => {
    if (!initialPlans.length) {
      fetchPlans();
    }
    // Always fetch assigned plans when component mounts
    fetchAssignedPlans();
  }, [initialPlans.length, fetchPlans, fetchAssignedPlans]);

  const handleCreatePlan = async (data: TrainingPlanFormData) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/training-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create plan");
      }

      const { plan } = await response.json();
      toast({
        title: t("success.created"),
      });
      setIsCreateOpen(false);
      router.push(`/workouts/plans/${plan.id}`);
    } catch {
      toast({
        title: t("errors.saveFailed"),
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/training-plans/${planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
        toast({
          title: t("success.deleted"),
        });
      }
    } catch {
      toast({
        title: t("errors.deleteFailed"),
        variant: "destructive",
      });
    }
  };

  const handleDuplicatePlan = async (_planId: string) => {
    // TODO: Implement duplication
    toast({
      title: "Coming soon",
      description: "Plan duplication will be available soon.",
    });
  };

  const handleOpenAssignDialog = (plan: TrainingPlanWithDetails) => {
    setSelectedPlanForAssign(plan);
    setIsAssignOpen(true);
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
        toast({
          title: t("success.assigned"),
        });
        // Refresh plans to update assigned count
        fetchPlans();
        return true;
      } else {
        const data = await response.json();
        if (response.status === 400 && data.error?.includes("already")) {
          toast({
            title: t("assignment.alreadyAssigned"),
            variant: "destructive",
          });
        } else {
          toast({
            title: t("errors.assignFailed"),
            variant: "destructive",
          });
        }
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

  const handleSaveToggle = () => {
    // Refresh to update the lists
    fetchPlans();
  };

  // Filter plans by ownership and save status
  const myCreatedPlans = plans.filter(
    (p) => p.createdById === userId && !p.isTemplate
  );
  const savedPlans = plans.filter((p) => p.createdById !== userId && p.isSaved);
  const templates = plans.filter((p) => p.isTemplate);
  const publicPlans = plans.filter(
    (p) => p.isPublic && p.createdById !== userId && !p.isSaved
  );

  // Combined count for "My Plans" tab
  const myPlansCount = myCreatedPlans.length + savedPlans.length;

  const tabs = [
    {
      value: "my-plans",
      label: t("myPlans"),
      icon: <CalendarDaysIcon />,
      badge:
        myPlansCount > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({myPlansCount})
          </span>
        ) : undefined,
    },
    {
      value: "assigned",
      label: t("assignedPlans"),
      icon: <UserCheckIcon />,
      badge:
        assignedPlans.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({assignedPlans.length})
          </span>
        ) : undefined,
    },
    {
      value: "templates",
      label: t("templates"),
      icon: <LayoutTemplateIcon />,
      badge:
        templates.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({templates.length})
          </span>
        ) : undefined,
    },
    {
      value: "public",
      label: t("publicPlans"),
      icon: <GlobeIcon />,
      badge:
        publicPlans.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({publicPlans.length})
          </span>
        ) : undefined,
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
            <Link href="/workouts">
              <DumbbellIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{tWorkouts("title")}</span>
            </Link>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("createPlan")}</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <ResponsiveTabs
            tabs={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />

          <ResponsiveTabsContent value="my-plans" activeValue={activeTab}>
            {myPlansCount === 0 ? (
              <EmptyState
                title={t("noPlans")}
                description={t("noPlansDescription")}
                onAction={() => setIsCreateOpen(true)}
                actionLabel={t("createPlan")}
              />
            ) : (
              <div className="space-y-6">
                {/* My created plans */}
                {myCreatedPlans.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <CalendarDaysIcon className="h-5 w-5" />
                      {t("createdByMe")}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {myCreatedPlans.map((plan) => (
                        <TrainingPlanCard
                          key={plan.id}
                          plan={plan}
                          canEdit
                          canAssign
                          onEdit={() =>
                            router.push(`/workouts/plans/${plan.id}`)
                          }
                          onDelete={() => handleDeletePlan(plan.id)}
                          onDuplicate={() => handleDuplicatePlan(plan.id)}
                          onAssign={() => handleOpenAssignDialog(plan)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved plans */}
                {savedPlans.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <BookmarkIcon className="h-5 w-5" />
                      {t("savedPlans")}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {savedPlans.map((plan) => (
                        <TrainingPlanCard
                          key={plan.id}
                          plan={plan}
                          canSave
                          onEdit={() =>
                            router.push(`/workouts/plans/${plan.id}`)
                          }
                          onSaveToggle={handleSaveToggle}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="assigned" activeValue={activeTab}>
            {isLoadingAssigned ? (
              <div className="flex items-center justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : assignedPlans.length === 0 ? (
              <EmptyState
                title={t("noAssignedPlans")}
                description={t("noAssignedPlansDescription")}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {assignedPlans.map((userPlan) => (
                  <TrainingPlanCard
                    key={userPlan.id}
                    plan={userPlan.plan as TrainingPlanWithDetails}
                    onEdit={() =>
                      router.push(`/workouts/plans/${userPlan.plan.id}`)
                    }
                  />
                ))}
              </div>
            )}
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="templates" activeValue={activeTab}>
            {templates.length === 0 ? (
              <EmptyState
                title={t("noPlans")}
                description={t("noPlansDescription")}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((plan) => (
                  <TrainingPlanCard
                    key={plan.id}
                    plan={plan}
                    canEdit
                    onEdit={() => router.push(`/workouts/plans/${plan.id}`)}
                    onDelete={() => handleDeletePlan(plan.id)}
                    onDuplicate={() => handleDuplicatePlan(plan.id)}
                  />
                ))}
              </div>
            )}
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="public" activeValue={activeTab}>
            {publicPlans.length === 0 ? (
              <EmptyState
                title={t("noPlans")}
                description={t("noPlansDescription")}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {publicPlans.map((plan) => (
                  <TrainingPlanCard
                    key={plan.id}
                    plan={plan}
                    canSave
                    onEdit={() => router.push(`/workouts/plans/${plan.id}`)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}
          </ResponsiveTabsContent>
        </>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("createPlan")}</DialogTitle>
            <DialogDescription>{t("subtitle")}</DialogDescription>
          </DialogHeader>
          <TrainingPlanForm
            onSubmit={handleCreatePlan}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Assign Plan Dialog */}
      <AssignPlanDialog
        plan={selectedPlanForAssign}
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        onAssign={handleAssignPlan}
      />
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

function EmptyState({
  title,
  description,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {onAction && actionLabel && (
        <Button className="mt-4" onClick={onAction}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
