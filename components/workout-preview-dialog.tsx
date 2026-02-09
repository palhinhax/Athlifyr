"use client";

import { useTranslations } from "next-intl";
import { useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  DumbbellIcon,
  EyeIcon,
  DownloadIcon,
  ShareIcon,
  ZapIcon,
} from "lucide-react";
import type { WorkoutWithBlocks } from "@/types/workout";
import { BLOCK_TYPE_INFO } from "@/types/workout";
import Image from "next/image";

// ============================================================================
// Block type visual config for the preview card
// ============================================================================

const BLOCK_COLORS: Record<
  string,
  { gradient: string; icon: string; bg: string; text: string }
> = {
  WARMUP: {
    gradient: "from-orange-500/20 to-orange-600/5",
    icon: "🔥",
    bg: "bg-orange-500/15",
    text: "text-orange-400",
  },
  STRENGTH: {
    gradient: "from-red-500/20 to-red-600/5",
    icon: "💪",
    bg: "bg-red-500/15",
    text: "text-red-400",
  },
  AMRAP: {
    gradient: "from-blue-500/20 to-blue-600/5",
    icon: "🔄",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
  },
  EMOM: {
    gradient: "from-purple-500/20 to-purple-600/5",
    icon: "⏱️",
    bg: "bg-purple-500/15",
    text: "text-purple-400",
  },
  FOR_TIME: {
    gradient: "from-yellow-500/20 to-yellow-600/5",
    icon: "⚡",
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
  },
  TABATA: {
    gradient: "from-green-500/20 to-green-600/5",
    icon: "🎯",
    bg: "bg-green-500/15",
    text: "text-green-400",
  },
  CHIPPER: {
    gradient: "from-indigo-500/20 to-indigo-600/5",
    icon: "📋",
    bg: "bg-indigo-500/15",
    text: "text-indigo-400",
  },
  REST: {
    gradient: "from-gray-500/20 to-gray-600/5",
    icon: "😮‍💨",
    bg: "bg-gray-500/15",
    text: "text-gray-400",
  },
  COOLDOWN: {
    gradient: "from-teal-500/20 to-teal-600/5",
    icon: "🧘",
    bg: "bg-teal-500/15",
    text: "text-teal-400",
  },
  SKILL: {
    gradient: "from-pink-500/20 to-pink-600/5",
    icon: "🎓",
    bg: "bg-pink-500/15",
    text: "text-pink-400",
  },
};

function getBlockVisuals(type: string) {
  return (
    BLOCK_COLORS[type] ?? {
      gradient: "from-gray-500/20 to-gray-600/5",
      icon: "📋",
      bg: "bg-gray-500/15",
      text: "text-gray-400",
    }
  );
}

// ============================================================================
// Types
// ============================================================================

interface WorkoutPreviewDialogProps {
  workout: WorkoutWithBlocks;
  children?: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function WorkoutPreviewDialog({
  workout,
  children,
}: WorkoutPreviewDialogProps) {
  const t = useTranslations("workouts");
  const previewRef = useRef<HTMLDivElement>(null);

  const totalExercises = workout.blocks.reduce(
    (sum, block) => sum + block.exercises.length,
    0
  );

  const totalBlocks = workout.blocks.length;

  // Download as image using html-to-image
  const handleDownload = useCallback(async () => {
    const element = previewRef.current;
    if (!element) return;

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `${workout.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Fallback: copy as text
      const text = formatWorkoutAsText(workout, t);
      await navigator.clipboard.writeText(text);
    }
  }, [workout, t]);

  // Share workout
  const handleShare = useCallback(async () => {
    const text = formatWorkoutAsText(workout, t);

    if (navigator.share) {
      try {
        await navigator.share({
          title: workout.name,
          text,
        });
        return;
      } catch {
        // User cancelled or share failed — fallback to clipboard
      }
    }

    await navigator.clipboard.writeText(text);
  }, [workout, t]);

  // For the square layout, use a 2-column grid when there are 3+ blocks
  const useGrid = workout.blocks.length >= 3;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="icon" title={t("preview.title")}>
            <EyeIcon className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[480px]">
        <DialogHeader className="sr-only">
          <DialogTitle>{workout.name}</DialogTitle>
        </DialogHeader>

        {/* The preview card — 1:1 square ratio for Instagram */}
        <div
          ref={previewRef}
          className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
        >
          {/* Decorative background pattern */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-p-brand/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-p-golden/5 blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full flex-col p-5">
            {/* Header — Logo + Stats inline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Athlifyr"
                  width={24}
                  height={24}
                  className="rounded-md"
                />
                <span className="text-xs font-semibold tracking-wider text-white/50">
                  ATHLIFYR
                </span>
              </div>
              {/* Difficulty dots */}
              {workout.difficulty && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-3 rounded-full ${
                        i < workout.difficulty!
                          ? workout.difficulty! <= 2
                            ? "bg-green-500"
                            : workout.difficulty! <= 3
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Title + stats */}
            <div className="mt-3">
              <h2 className="text-lg font-bold leading-tight text-white">
                {workout.name}
              </h2>
              <div className="mt-2 flex items-center gap-3">
                {workout.estimatedTime && (
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5">
                    <ClockIcon className="h-3 w-3 text-blue-400" />
                    <span className="text-[11px] font-medium text-white/70">
                      {workout.estimatedTime}&apos;
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5">
                  <DumbbellIcon className="h-3 w-3 text-purple-400" />
                  <span className="text-[11px] font-medium text-white/70">
                    {totalExercises}
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5">
                  <ZapIcon className="h-3 w-3 text-yellow-400" />
                  <span className="text-[11px] font-medium text-white/70">
                    {totalBlocks} {t("blockLabel")}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Blocks — grid 2×2 or stacked */}
            <div
              className={`flex-1 ${useGrid ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}`}
            >
              {workout.blocks.map((block) => {
                const visuals = getBlockVisuals(block.type);
                const blockInfo = BLOCK_TYPE_INFO[block.type];

                return (
                  <div
                    key={block.id}
                    className={`rounded-lg bg-gradient-to-br ${visuals.gradient} flex flex-col border border-white/5 p-2.5`}
                  >
                    {/* Block header */}
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className="text-sm">{blockInfo.icon}</span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wide ${visuals.text}`}
                      >
                        {t(`blocks.types.${block.type}`)}
                      </span>
                      {block.rounds && (
                        <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/50">
                          {block.rounds}×
                        </span>
                      )}
                      {block.timeCap && !block.rounds && (
                        <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/50">
                          {Math.floor(block.timeCap / 60)}&apos;
                        </span>
                      )}
                    </div>

                    {/* Exercise list — compact */}
                    <div className="space-y-0.5">
                      {block.exercises.map((exercise) => {
                        const prescription =
                          formatExercisePrescription(exercise);
                        return (
                          <div
                            key={exercise.id}
                            className="flex items-baseline gap-1.5 text-[11px] leading-tight"
                          >
                            <span className="mt-1 h-0.5 w-0.5 shrink-0 rounded-full bg-white/30" />
                            <span className="flex-1 truncate text-white/75">
                              {exercise.exercise.name}
                            </span>
                            {prescription && (
                              <span className="shrink-0 text-[10px] text-white/35">
                                {prescription}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tags row */}
            {workout.tags && workout.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {workout.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-medium text-white/35"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer watermark */}
            <div className="mt-auto flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {workout.createdBy?.image && (
                  <Image
                    src={workout.createdBy.image}
                    alt={workout.createdBy.name ?? ""}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                )}
                {workout.createdBy?.name && (
                  <span className="text-[10px] text-white/25">
                    {workout.createdBy.name}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium tracking-widest text-white/15">
                athlifyr.com
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons — outside the screenshot area */}
        <div className="flex gap-2 px-6 pb-5 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            {t("preview.download")}
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <ShareIcon className="mr-2 h-4 w-4" />
            {t("preview.share")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function formatExercisePrescription(
  exercise: WorkoutWithBlocks["blocks"][0]["exercises"][0]
): string {
  const parts: string[] = [];

  if (exercise.prescribedSets && exercise.prescribedReps) {
    parts.push(`${exercise.prescribedSets}×${exercise.prescribedReps}`);
  } else if (exercise.prescribedReps) {
    parts.push(`${exercise.prescribedReps} reps`);
  } else if (exercise.prescribedSets) {
    parts.push(`${exercise.prescribedSets} sets`);
  }

  if (exercise.prescribedWeight) {
    parts.push(
      `${exercise.prescribedWeight}${exercise.prescribedWeightUnit?.toLowerCase() ?? "kg"}`
    );
  }

  if (exercise.prescribedTime) {
    const mins = Math.floor(exercise.prescribedTime / 60);
    const secs = exercise.prescribedTime % 60;
    if (mins > 0 && secs > 0) {
      parts.push(`${mins}:${secs.toString().padStart(2, "0")}`);
    } else if (mins > 0) {
      parts.push(`${mins}'`);
    } else {
      parts.push(`${secs}s`);
    }
  }

  if (exercise.prescribedDistance) {
    parts.push(
      `${exercise.prescribedDistance}${exercise.prescribedDistanceUnit?.toLowerCase() ?? "m"}`
    );
  }

  if (exercise.prescribedCalories) {
    parts.push(`${exercise.prescribedCalories} cal`);
  }

  return parts.join(" · ");
}

function formatWorkoutAsText(
  workout: WorkoutWithBlocks,
  t: (key: string) => string
): string {
  const lines: string[] = [];

  lines.push(`🏋️ ${workout.name}`);
  lines.push("");

  if (workout.estimatedTime) {
    lines.push(`⏱️ ${workout.estimatedTime} min`);
  }

  if (workout.difficulty) {
    lines.push(`🔥 ${t(`form.difficultyLevels.${workout.difficulty}`)}`);
  }

  lines.push("");

  for (const block of workout.blocks) {
    const info = BLOCK_TYPE_INFO[block.type];
    const header = block.name
      ? `${info.icon} ${t(`blocks.types.${block.type}`)} — ${block.name}`
      : `${info.icon} ${t(`blocks.types.${block.type}`)}`;

    const meta: string[] = [];
    if (block.rounds) meta.push(`${block.rounds}x`);
    if (block.timeCap) meta.push(`${Math.floor(block.timeCap / 60)}'`);

    lines.push(`${header}${meta.length ? ` (${meta.join(", ")})` : ""}`);

    for (const exercise of block.exercises) {
      const prescription = formatExercisePrescription(exercise);
      lines.push(
        `  • ${exercise.exercise.name}${prescription ? ` — ${prescription}` : ""}`
      );
    }

    lines.push("");
  }

  if (workout.tags && workout.tags.length > 0) {
    lines.push(workout.tags.map((tag) => `#${tag}`).join(" "));
  }

  lines.push("");
  lines.push("Via Athlifyr — athlifyr.com");

  return lines.join("\n");
}
