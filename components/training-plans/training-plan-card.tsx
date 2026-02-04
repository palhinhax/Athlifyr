"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  BookmarkIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  CopyIcon,
  GlobeIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import type { TrainingPlanWithDetails } from "@/types/training-plan";

interface TrainingPlanCardProps {
  plan: TrainingPlanWithDetails & { isSaved?: boolean };
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onAssign?: () => void;
  onSaveToggle?: (isSaved: boolean) => void;
  canEdit?: boolean;
  canAssign?: boolean;
  canSave?: boolean;
}

export function TrainingPlanCard({
  plan,
  onEdit,
  onDelete,
  onDuplicate,
  onAssign,
  onSaveToggle,
  canEdit = false,
  canAssign = false,
  canSave = false,
}: TrainingPlanCardProps) {
  const t = useTranslations("workouts.plans");
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(plan.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const totalWorkouts = (plan.weeks || []).reduce(
    (sum: number, week: { workouts?: unknown[] }) =>
      sum + (week.workouts?.length || 0),
    0
  );

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(`/api/training-plans/${plan.id}/save`, {
        method,
      });

      if (response.ok) {
        setIsSaved(!isSaved);
        onSaveToggle?.(!isSaved);
        toast({
          title: isSaved ? t("unsaved") : t("saved"),
        });
      } else {
        throw new Error("Failed to toggle save");
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
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-1 text-lg">
                <Link
                  href={`/workouts/plans/${plan.id}`}
                  className="hover:underline"
                >
                  {plan.name}
                </Link>
              </CardTitle>
              {plan.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {plan.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-1">
              {canSave && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mr-1 -mt-2"
                  onClick={handleToggleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <BookmarkIcon
                      className={`h-4 w-4 ${isSaved ? "fill-current text-primary" : ""}`}
                    />
                  )}
                </Button>
              )}
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      {t("editPlan")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDuplicate}>
                      <CopyIcon className="mr-2 h-4 w-4" />
                      {t("duplicatePlan")}
                    </DropdownMenuItem>
                    {canAssign && (
                      <DropdownMenuItem onClick={onAssign}>
                        <UserPlusIcon className="mr-2 h-4 w-4" />
                        {t("assignPlan")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      {t("deletePlan")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pt-0">
          {/* Stats */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>
                {t("stats.totalWeeks", { count: plan.duration ?? 0 })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ClipboardListIcon className="h-4 w-4" />
              <span>{t("stats.totalWorkouts", { count: totalWorkouts })}</span>
            </div>
            {canEdit &&
              plan._count?.assignedToUsers &&
              plan._count.assignedToUsers > 0 && (
                <div className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>
                    {t("stats.assignedAthletes", {
                      count: plan._count.assignedToUsers,
                    })}
                  </span>
                </div>
              )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={getDifficultyColor(plan.difficulty ?? 1)}
            >
              {t(`difficulty.${plan.difficulty ?? 1}`)}
            </Badge>
            {plan.isPublic && (
              <Badge variant="outline" className="gap-1">
                <GlobeIcon className="h-3 w-3" />
                {t("publicPlans")}
              </Badge>
            )}
            {plan.isTemplate && (
              <Badge variant="outline">{t("templates")}</Badge>
            )}
          </div>

          {/* Creator info - only show for public plans */}
          {plan.isPublic && plan.createdBy && (
            <Link
              href={`/profile/${plan.createdBy.id}`}
              className="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-muted"
            >
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
                {t("createdBy")}{" "}
                <span className="font-medium text-foreground">
                  {plan.createdBy.name}
                </span>
              </span>
            </Link>
          )}
        </CardContent>

        <CardFooter className="pt-3">
          <div className="flex w-full gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/workouts/plans/${plan.id}`}>{t("viewPlan")}</Link>
            </Button>
            {canAssign && (
              <Button variant="default" size="icon" onClick={onAssign}>
                <UserPlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deletePlan")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
