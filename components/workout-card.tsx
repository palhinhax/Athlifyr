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
  DropdownMenuSeparator,
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
  ClockIcon,
  DumbbellIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  GlobeIcon,
  BookmarkIcon,
  Loader2Icon,
  CalendarPlusIcon,
  EyeIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import type { WorkoutWithBlocks } from "@/types/workout";
import { BLOCK_TYPE_INFO } from "@/types/workout";
import { useUserVenues } from "@/hooks/use-user-venues";
import { AssignWorkoutToSessionsDialog } from "@/components/assign-workout-to-sessions-dialog";
import { WorkoutPreviewDialog } from "@/components/workout-preview-dialog";

interface WorkoutCardProps {
  workout: WorkoutWithBlocks & { isSaved?: boolean };
  onEdit?: () => void;
  onDelete?: () => void;
  onSaveToggle?: (isSaved: boolean) => void;
  canEdit?: boolean;
  canSave?: boolean;
}

export function WorkoutCard({
  workout,
  onEdit,
  onDelete,
  onSaveToggle,
  canEdit = false,
  canSave = false,
}: WorkoutCardProps) {
  const t = useTranslations("workouts");
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(workout.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user can assign workouts to sessions (OWNER, ADMIN, or COACH)
  const { venues } = useUserVenues();
  const canAssignToSessions = venues.some(
    (v) => v.role === "OWNER" || v.role === "ADMIN" || v.role === "COACH"
  );

  const totalExercises = workout.blocks.reduce(
    (sum, block) => sum + block.exercises.length,
    0
  );

  const blockTypes = [...new Set(workout.blocks.map((b) => b.type))];

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(`/api/workouts/${workout.id}/save`, {
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
      <Card className="flex flex-col transition-colors hover:border-accent/30 hover:shadow-md">
        <CardHeader className="pb-3">
          {/* Actions row — always top right */}
          <div className="-mr-1 -mt-2 mb-1 flex justify-end gap-1">
            <WorkoutPreviewDialog workout={workout}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title={t("preview.title")}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </WorkoutPreviewDialog>
            {canSave && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleToggleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <BookmarkIcon
                    className={`h-4 w-4 ${isSaved ? "fill-current text-accent" : ""}`}
                  />
                )}
              </Button>
            )}
            {(canEdit || canAssignToSessions) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canAssignToSessions && (
                    <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                      <CalendarPlusIcon className="mr-2 h-4 w-4" />
                      {t("assignToSessions")}
                    </DropdownMenuItem>
                  )}
                  {canAssignToSessions && canEdit && <DropdownMenuSeparator />}
                  {canEdit && (
                    <>
                      <DropdownMenuItem onClick={onEdit}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        {t("editWorkout")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        {t("deleteWorkout")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* Title & description below icons */}
          <CardTitle className="line-clamp-1 text-lg">{workout.name}</CardTitle>
          {workout.description && (
            <CardDescription className="mt-1 line-clamp-2">
              {workout.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pb-3">
          {/* Block types */}
          <div className="flex flex-wrap gap-1.5">
            {blockTypes.map((type) => {
              const blockInfo = BLOCK_TYPE_INFO[type];
              return (
                <Badge
                  key={type}
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: `${blockInfo.color}20`,
                    color: blockInfo.color,
                  }}
                >
                  {t(`blocks.types.${type}`)}
                </Badge>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {workout.estimatedTime && (
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4 text-p-info" />
                <span>{workout.estimatedTime} min</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <DumbbellIcon className="h-4 w-4 text-p-brand" />
              <span>
                {totalExercises}{" "}
                {totalExercises === 1
                  ? t("exercises.title").slice(0, -1)
                  : t("exercises.title").toLowerCase()}
              </span>
            </div>
            {workout.isPublic && (
              <div className="flex items-center gap-1">
                <GlobeIcon className="h-4 w-4 text-p-golden" />
              </div>
            )}
          </div>

          {/* Difficulty */}
          {workout.difficulty && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const difficultyColor =
                  workout.difficulty! <= 2
                    ? "bg-p-brand"
                    : workout.difficulty! <= 3
                      ? "bg-p-golden"
                      : "bg-destructive";
                return (
                  <div
                    key={i}
                    className={`h-2 w-4 rounded-sm ${
                      i < workout.difficulty! ? difficultyColor : "bg-muted"
                    }`}
                  />
                );
              })}
              <span className="ml-2 text-xs text-muted-foreground">
                {t(`form.difficultyLevels.${workout.difficulty}`)}
              </span>
            </div>
          )}

          {/* Tags */}
          {workout.tags && workout.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workout.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {workout.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{workout.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Creator info - only show for public workouts from other users */}
          {workout.isPublic && workout.createdBy && (
            <Link
              href={`/user/${workout.createdBy.id}`}
              className="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-muted"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={workout.createdBy.image || undefined} />
                <AvatarFallback className="text-[10px]">
                  {workout.createdBy.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {t("createdBy")}{" "}
                <span className="font-medium text-foreground">
                  {workout.createdBy.name}
                </span>
              </span>
            </Link>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            asChild
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href={`/workouts/${workout.id}/run`}>
              <PlayIcon className="mr-2 h-4 w-4" />
              {t("log.startWorkout")}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteWorkout")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("form.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deleteWorkout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AssignWorkoutToSessionsDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        workoutId={workout.id}
        workoutName={workout.name}
      />
    </>
  );
}
