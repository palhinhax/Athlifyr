"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  Loader2Icon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import type { TrainingPlanWeekWithWorkouts } from "@/types/training-plan";
import { TrainingPlanWeekDays } from "./training-plan-week-days";

interface WeekFormData {
  name?: string;
  description?: string;
}

interface TrainingPlanWeekEditorProps {
  week: TrainingPlanWeekWithWorkouts;
  weekNumber: number;
  planId: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onUpdate: (weekId: string, data: WeekFormData) => Promise<void>;
  onDelete: (weekId: string) => Promise<void>;
  onDuplicate: (weekId: string) => Promise<void>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onWorkoutAdded?: () => void;
  onWorkoutRemoved?: () => void;
}

export function TrainingPlanWeekEditor({
  week,
  weekNumber,
  planId,
  isExpanded = false,
  onToggleExpand,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  onWorkoutAdded,
  onWorkoutRemoved,
}: TrainingPlanWeekEditorProps) {
  const t = useTranslations("workouts.plans");

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState(week.name ?? "");
  const [description, setDescription] = useState(week.description ?? "");

  const workoutsCount = week.workouts.length;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(week.id, {
        name: name.trim() || undefined,
        description: description.trim() || undefined,
      });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(week.id);
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      await onDuplicate(week.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div
              className="flex flex-1 cursor-pointer items-center gap-3"
              onClick={onToggleExpand}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {weekNumber}
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">
                  {week.name || t("weeks.weekNumber", { number: weekNumber })}
                </CardTitle>
                {week.description && (
                  <p className="text-sm text-muted-foreground">
                    {week.description}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="ml-2">
                {t("stats.totalWorkouts", { count: workoutsCount })}
              </Badge>
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-1">
              {canMoveUp && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp?.();
                  }}
                >
                  <ChevronUpIcon className="h-4 w-4" />
                </Button>
              )}
              {canMoveDown && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown?.();
                  }}
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate();
                }}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(true);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <TrainingPlanWeekDays
              planId={planId}
              weekId={week.id}
              workouts={week.workouts}
              onWorkoutAdded={onWorkoutAdded}
              onWorkoutRemoved={onWorkoutRemoved}
            />
          </CardContent>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("weeks.editWeek")}</DialogTitle>
            <DialogDescription>
              {t("weeks.weekNumber", { number: weekNumber })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekName">{t("weeks.name")}</Label>
              <Input
                id="weekName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("weeks.namePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekDescription">{t("weeks.description")}</Label>
              <Textarea
                id="weekDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("weeks.descriptionPlaceholder")}
                className="min-h-[80px] resize-y"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              {t("form.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("form.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("weeks.deleteWeek")}</AlertDialogTitle>
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
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("weeks.deleteWeek")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
