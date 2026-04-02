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
import { useUserVenues } from "@/hooks/use-user-venues";
import { AssignWorkoutToSessionsDialog } from "@/components/assign-workout-to-sessions-dialog";
import { WorkoutPreviewDialog } from "@/components/workout-preview-dialog";
import type { WorkoutBlockType } from "@prisma/client";
import Image from "next/image";

// Workout images mapped to block types (primary match)
const BLOCK_TYPE_IMAGES: Record<WorkoutBlockType, string[]> = {
  WARMUP: [
    "/images/workouts/running.jpg",
    "/images/workouts/sprinting.jpg",
    "/images/workouts/jumping.jpg",
  ],
  STRENGTH: [
    "/images/workouts/strength.jpg",
    "/images/workouts/deadlift.jpg",
    "/images/workouts/pullups.jpg",
    "/images/workouts/gym-dark.jpg",
  ],
  AMRAP: [
    "/images/workouts/crossfit.jpg",
    "/images/workouts/battle-ropes.jpg",
    "/images/workouts/hiit.jpg",
  ],
  EMOM: [
    "/images/workouts/hiit.jpg",
    "/images/workouts/battle-ropes.jpg",
    "/images/workouts/gym-dark.jpg",
  ],
  FOR_TIME: [
    "/images/workouts/crossfit.jpg",
    "/images/workouts/sprinting.jpg",
    "/images/workouts/rowing.jpg",
  ],
  TABATA: [
    "/images/workouts/kettlebell.jpg",
    "/images/workouts/boxing.jpg",
    "/images/workouts/hiit.jpg",
  ],
  CHIPPER: [
    "/images/workouts/kettlebell.jpg",
    "/images/workouts/battle-ropes.jpg",
    "/images/workouts/gym-dark.jpg",
  ],
  REST: ["/images/workouts/recovery.jpg", "/images/workouts/yoga-dark.jpg"],
  COOLDOWN: ["/images/workouts/recovery.jpg", "/images/workouts/yoga-dark.jpg"],
  SKILL: [
    "/images/workouts/endurance.jpg",
    "/images/workouts/rowing.jpg",
    "/images/workouts/pullups.jpg",
  ],
};

// All available workout images for pseudo-random selection
const WORKOUT_IMAGES = [
  "/images/workouts/strength.jpg",
  "/images/workouts/crossfit.jpg",
  "/images/workouts/running.jpg",
  "/images/workouts/recovery.jpg",
  "/images/workouts/kettlebell.jpg",
  "/images/workouts/endurance.jpg",
  "/images/workouts/hiit.jpg",
  "/images/workouts/boxing.jpg",
  "/images/workouts/rowing.jpg",
  "/images/workouts/gym-dark.jpg",
  "/images/workouts/sprinting.jpg",
  "/images/workouts/pullups.jpg",
  "/images/workouts/yoga-dark.jpg",
  "/images/workouts/battle-ropes.jpg",
  "/images/workouts/deadlift.jpg",
  "/images/workouts/jumping.jpg",
];

// Simple hash to get a consistent pseudo-random index from a workout id
function hashIndex(id: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % length;
}

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
  // Pick image: use type-based array with hash for variety within the type
  const typeImages = primaryType
    ? BLOCK_TYPE_IMAGES[primaryType]
    : WORKOUT_IMAGES;
  const cardImage = typeImages[hashIndex(workout.id, typeImages.length)];

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
      <div className="group relative flex h-[420px] flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Background image */}
        <Image
          src={cardImage}
          alt=""
          fill
          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

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
