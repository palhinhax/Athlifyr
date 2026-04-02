"use client";

import { useTranslations } from "next-intl";
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
  EyeIcon,
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
import Image from "next/image";

// All available images for plan cards
const PLAN_IMAGES = [
  "/images/workouts/strength.jpg",
  "/images/workouts/crossfit.jpg",
  "/images/workouts/running.jpg",
  "/images/workouts/kettlebell.jpg",
  "/images/workouts/endurance.jpg",
  "/images/workouts/hiit.jpg",
  "/images/workouts/boxing.jpg",
  "/images/workouts/rowing.jpg",
  "/images/workouts/gym-dark.jpg",
  "/images/workouts/sprinting.jpg",
  "/images/workouts/pullups.jpg",
  "/images/workouts/battle-ropes.jpg",
  "/images/workouts/deadlift.jpg",
  "/images/workouts/jumping.jpg",
];

// Simple hash to get a consistent pseudo-random index from an id
function hashIndex(id: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % length;
}

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

  const cardImage = PLAN_IMAGES[hashIndex(plan.id, PLAN_IMAGES.length)];

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

  return (
    <>
      <div className="group relative flex h-[420px] flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Background image */}
        <Image
          src={cardImage}
          alt=""
          fill
          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Top action bar */}
        <div className="relative z-10 flex items-center justify-between p-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge className="border-none bg-white/20 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {t(`difficulty.${plan.difficulty ?? 1}`)}
            </Badge>
            {plan.isPublic && (
              <Badge className="border-none bg-white/20 text-[10px] font-semibold text-white backdrop-blur-sm">
                <GlobeIcon className="mr-1 h-3 w-3" />
                {t("publicPlans")}
              </Badge>
            )}
            {plan.isTemplate && (
              <Badge className="border-none bg-white/20 text-[10px] font-semibold text-white backdrop-blur-sm">
                {t("templates")}
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {canSave && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:bg-white/20 hover:text-white"
                onClick={handleToggleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <BookmarkIcon
                    className={`h-4 w-4 ${isSaved ? "fill-current text-white" : ""}`}
                  />
                )}
              </Button>
            )}
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/80 hover:bg-white/20 hover:text-white"
                  >
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

        {/* Creator badge */}
        {plan.isPublic && plan.createdBy && (
          <Link
            href={`/user/${plan.createdBy.id}`}
            className="relative z-10 mx-4 flex w-fit items-center gap-2 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm transition-colors hover:bg-black/30"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={plan.createdBy.image || undefined} />
              <AvatarFallback className="bg-white/20 text-[10px] text-white">
                {plan.createdBy.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-white/90">
              {plan.createdBy.name}
            </span>
          </Link>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Glass overlay bottom section */}
        <div className="relative z-10 mx-3 mb-3 flex flex-col gap-3 rounded-xl border-t border-white/20 bg-white/15 p-4 backdrop-blur-md">
          {/* Title */}
          <div>
            <h3 className="line-clamp-1 font-headline text-lg font-bold leading-tight text-white">
              {plan.name}
            </h3>
            {plan.description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-white/70">
                {plan.description}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs font-medium text-white/90">
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              {plan.duration ?? 0} {t("weeksCount")}
            </span>
            <span className="flex items-center gap-1">
              <ClipboardListIcon className="h-3.5 w-3.5" />
              {totalWorkouts}{" "}
              {t("stats.totalWorkouts", { count: totalWorkouts })
                .replace(String(totalWorkouts), "")
                .trim()}
            </span>
            {canEdit &&
              plan._count?.assignedToUsers &&
              plan._count.assignedToUsers > 0 && (
                <span className="flex items-center gap-1">
                  <UsersIcon className="h-3.5 w-3.5" />
                  {plan._count.assignedToUsers}
                </span>
              )}
          </div>

          {/* Bottom row: Difficulty bars + View button */}
          <div className="flex items-center justify-between">
            {/* Difficulty bars */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {t(`difficulty.${plan.difficulty ?? 1}`)}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-5 rounded-full ${
                      i < (plan.difficulty ?? 1)
                        ? "bg-orange-400"
                        : "bg-white/25"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                asChild
                size="sm"
                className="rounded-full bg-white/25 text-white backdrop-blur-sm hover:bg-white/35"
              >
                <Link href={`/workouts/plans/${plan.id}`}>
                  <EyeIcon className="mr-1.5 h-3.5 w-3.5" />
                  {t("viewPlan")}
                </Link>
              </Button>
              {canAssign && (
                <Button
                  size="sm"
                  className="rounded-full bg-white/25 text-white backdrop-blur-sm hover:bg-white/35"
                  onClick={onAssign}
                >
                  <UserPlusIcon className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

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
