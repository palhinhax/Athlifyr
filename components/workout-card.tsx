"use client";

import { useTranslations } from "next-intl";
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
import type { WorkoutBlockType } from "@prisma/client";

// Gradient backgrounds per block type for the premium card look
const BLOCK_TYPE_GRADIENTS: Record<WorkoutBlockType, string> = {
  WARMUP: "from-orange-600 via-amber-700 to-orange-900",
  STRENGTH: "from-red-700 via-rose-800 to-red-950",
  AMRAP: "from-blue-700 via-indigo-800 to-blue-950",
  EMOM: "from-purple-700 via-violet-800 to-purple-950",
  FOR_TIME: "from-yellow-600 via-amber-700 to-yellow-900",
  TABATA: "from-green-700 via-emerald-800 to-green-950",
  CHIPPER: "from-indigo-700 via-blue-800 to-indigo-950",
  REST: "from-slate-600 via-gray-700 to-slate-900",
  COOLDOWN: "from-teal-700 via-cyan-800 to-teal-950",
  SKILL: "from-pink-700 via-rose-800 to-pink-950",
};

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

  // Get the primary block type gradient (first non-warmup/cooldown type, or first)
  const primaryType =
    blockTypes.find(
      (t) => t !== "WARMUP" && t !== "COOLDOWN" && t !== "REST"
    ) || blockTypes[0];
  const gradient = primaryType
    ? BLOCK_TYPE_GRADIENTS[primaryType]
    : "from-slate-700 via-slate-800 to-slate-950";

  // Get the emoji for the primary block type
  const primaryEmoji = primaryType ? BLOCK_TYPE_INFO[primaryType].icon : "💪";

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
      <div className="group relative flex h-[420px] flex-col overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-110`}
        />

        {/* Decorative large emoji */}
        <div className="absolute right-4 top-6 select-none text-7xl opacity-15 transition-transform duration-700 group-hover:scale-110">
          {primaryEmoji}
        </div>

        {/* Top action bar */}
        <div className="relative z-10 flex items-center justify-between p-4">
          {/* Block type badges */}
          <div className="flex flex-wrap gap-1.5">
            {blockTypes.slice(0, 3).map((type) => (
              <Badge
                key={type}
                className="border-none bg-white/20 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
              >
                {t(`blocks.types.${type}`)}
              </Badge>
            ))}
            {blockTypes.length > 3 && (
              <Badge className="border-none bg-white/20 text-[10px] font-semibold text-white backdrop-blur-sm">
                +{blockTypes.length - 3}
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <WorkoutPreviewDialog workout={workout}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:bg-white/20 hover:text-white"
                title={t("preview.title")}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </WorkoutPreviewDialog>
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
            {(canEdit || canAssignToSessions) && (
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
        </div>

        {/* Public / Creator badge */}
        {workout.isPublic && workout.createdBy && (
          <Link
            href={`/user/${workout.createdBy.id}`}
            className="relative z-10 mx-4 flex w-fit items-center gap-2 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm transition-colors hover:bg-black/30"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={workout.createdBy.image || undefined} />
              <AvatarFallback className="bg-white/20 text-[10px] text-white">
                {workout.createdBy.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-white/90">
              {workout.createdBy.name}
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
              {workout.name}
            </h3>
            {workout.description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-white/70">
                {workout.description}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs font-medium text-white/90">
            {workout.estimatedTime && (
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                {workout.estimatedTime} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <DumbbellIcon className="h-3.5 w-3.5" />
              {totalExercises}{" "}
              {totalExercises === 1
                ? t("exercises.title").slice(0, -1)
                : t("exercises.title").toLowerCase()}
            </span>
            {workout.isPublic && (
              <span className="flex items-center gap-1">
                <GlobeIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          {/* Bottom row: Difficulty + Start button */}
          <div className="flex items-center justify-between">
            {/* Difficulty */}
            {workout.difficulty ? (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  {t(`form.difficultyLevels.${workout.difficulty}`)}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-5 rounded-full ${
                        i < workout.difficulty!
                          ? "bg-orange-400"
                          : "bg-white/25"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Tags fallback when no difficulty */
              workout.tags &&
              workout.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {workout.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )
            )}

            <Button
              asChild
              size="sm"
              className="rounded-full bg-white/25 text-white backdrop-blur-sm hover:bg-white/35"
            >
              <Link href={`/workouts/${workout.id}/run`}>
                <PlayIcon className="mr-1.5 h-3.5 w-3.5" />
                {t("log.startWorkout")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

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
