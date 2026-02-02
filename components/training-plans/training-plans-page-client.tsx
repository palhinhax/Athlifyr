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
  CalendarDaysIcon,
  DumbbellIcon,
  GlobeIcon,
  Loader2Icon,
  PlusIcon,
  LayoutTemplateIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "@/i18n/routing";
import { TrainingPlanCard } from "./training-plan-card";
import {
  TrainingPlanForm,
  type TrainingPlanFormData,
} from "./training-plan-form";
import type { TrainingPlanWithDetails } from "@/types/training-plan";
import { useRouter } from "@/i18n/routing";

interface TrainingPlansPageClientProps {
  initialPlans?: TrainingPlanWithDetails[];
}

export function TrainingPlansPageClient({
  initialPlans = [],
}: TrainingPlansPageClientProps) {
  const t = useTranslations("workouts.plans");
  const tWorkouts = useTranslations("workouts");
  const { toast } = useToast();
  const router = useRouter();

  const [plans, setPlans] = useState<TrainingPlanWithDetails[]>(initialPlans);
  const [isLoading, setIsLoading] = useState(!initialPlans.length);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("my-plans");

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

  useEffect(() => {
    if (!initialPlans.length) {
      fetchPlans();
    }
  }, [initialPlans.length, fetchPlans]);

  const handleCreatePlan = async (data: TrainingPlanFormData) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/training-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { plan } = await response.json();
        toast({
          title: t("success.created"),
        });
        setIsCreateOpen(false);
        router.push(`/workouts/plans/${plan.id}`);
      } else {
        throw new Error("Failed to create plan");
      }
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

  const myPlans = plans.filter((p) => !p.isTemplate);
  const templates = plans.filter((p) => p.isTemplate);
  const publicPlans = plans.filter((p) => p.isPublic);

  const tabs = [
    {
      value: "my-plans",
      label: t("myPlans"),
      icon: <CalendarDaysIcon />,
      badge:
        myPlans.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            ({myPlans.length})
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
            {myPlans.length === 0 ? (
              <EmptyState
                title={t("noPlans")}
                description={t("noPlansDescription")}
                onAction={() => setIsCreateOpen(true)}
                actionLabel={t("createPlan")}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myPlans.map((plan) => (
                  <TrainingPlanCard
                    key={plan.id}
                    plan={plan}
                    canEdit
                    canAssign
                    onEdit={() => router.push(`/workouts/plans/${plan.id}`)}
                    onDelete={() => handleDeletePlan(plan.id)}
                    onDuplicate={() => handleDuplicatePlan(plan.id)}
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
                    onEdit={() => router.push(`/workouts/plans/${plan.id}`)}
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
