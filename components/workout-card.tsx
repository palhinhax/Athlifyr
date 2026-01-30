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
  ClockIcon,
  DumbbellIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  GlobeIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import type { WorkoutWithBlocks } from "@/types/workout";
import { BLOCK_TYPE_INFO } from "@/types/workout";

interface WorkoutCardProps {
  workout: WorkoutWithBlocks;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

export function WorkoutCard({
  workout,
  onEdit,
  onDelete,
  canEdit = false,
}: WorkoutCardProps) {
  const t = useTranslations("workouts");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const totalExercises = workout.blocks.reduce(
    (sum, block) => sum + block.exercises.length,
    0
  );

  const blockTypes = [...new Set(workout.blocks.map((b) => b.type))];

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-1 text-lg">
                {workout.name}
              </CardTitle>
              {workout.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {workout.description}
                </CardDescription>
              )}
            </div>
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
                    {t("editWorkout")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    {t("deleteWorkout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
                <ClockIcon className="h-4 w-4" />
                <span>{workout.estimatedTime} min</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <DumbbellIcon className="h-4 w-4" />
              <span>
                {totalExercises}{" "}
                {totalExercises === 1
                  ? t("exercises.title").slice(0, -1)
                  : t("exercises.title").toLowerCase()}
              </span>
            </div>
            {workout.isPublic && (
              <div className="flex items-center gap-1">
                <GlobeIcon className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Difficulty */}
          {workout.difficulty && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-4 rounded-sm ${
                    i < workout.difficulty! ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
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
        </CardContent>

        <CardFooter className="pt-0">
          <Button asChild className="w-full">
            <Link href={`/workouts/${workout.id}/log`}>
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
    </>
  );
}
