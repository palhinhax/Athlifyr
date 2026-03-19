/**
 * Athli AI — Log performance entries (strength PRs, run/trail times)
 */

import { prisma } from "@/lib/prisma";

export interface LogPerformanceParams {
  type: "STRENGTH" | "RUN" | "TRAIL";
  // STRENGTH fields
  exerciseName?: string;
  weightKg?: number;
  reps?: number;
  // RUN/TRAIL fields
  distanceKm?: number;
  timeSeconds?: number;
  elevationGainM?: number;
  // Shared
  eventName?: string;
  location?: string;
  date?: string; // ISO date string, defaults to now
}

/**
 * Format total seconds into a human-readable duration string.
 * Returns null if the input is null or 0.
 */
function formatSecondsToTime(totalSeconds: number | null): string | null {
  if (!totalSeconds) return null;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h${String(minutes).padStart(2, "0")}m${String(seconds).padStart(2, "0")}s`;
  }
  return `${minutes}m${String(seconds).padStart(2, "0")}s`;
}

async function logStrengthEntry(
  userId: string,
  params: LogPerformanceParams,
  performedAt: Date
): Promise<string> {
  if (!params.exerciseName) {
    return JSON.stringify({
      error: true,
      message:
        "Exercise name is required for STRENGTH entries. Please specify the exercise (e.g. 'Deadlift', 'Back Squat', 'Bench Press').",
    });
  }
  if (!params.weightKg || params.weightKg <= 0) {
    return JSON.stringify({
      error: true,
      message:
        "Weight in kg is required for STRENGTH entries. Please specify the weight (e.g. 100).",
    });
  }

  const exercise = await prisma.exercise.findFirst({
    where: {
      OR: [
        { name: { equals: params.exerciseName, mode: "insensitive" } },
        { aliases: { has: params.exerciseName } },
        {
          aliases: {
            has: params.exerciseName.toLowerCase(),
          },
        },
      ],
    },
  });

  if (!exercise) {
    return JSON.stringify({
      error: true,
      message: `Exercise "${params.exerciseName}" not found. Try common names like "Deadlift", "Back Squat", "Bench Press", "Overhead Press", "Clean", "Snatch", etc.`,
    });
  }

  const bestEntry = await prisma.userPerformanceEntry.findFirst({
    where: {
      userId,
      type: "STRENGTH",
      exerciseId: exercise.id,
      weightKg: { not: null },
    },
    orderBy: { weightKg: "desc" },
  });

  const currentBestE1rm = bestEntry
    ? (bestEntry.weightKg ?? 0) * (1 + (bestEntry.reps ?? 1) / 30)
    : 0;
  const newE1rm = params.weightKg * (1 + (params.reps ?? 1) / 30);
  const isNewPR = newE1rm > currentBestE1rm;

  const entry = await prisma.userPerformanceEntry.create({
    data: {
      userId,
      type: "STRENGTH",
      exerciseId: exercise.id,
      weightKg: params.weightKg,
      reps: params.reps ?? 1,
      performedAt,
      qualityScore: 0.5,
      predictionWeight: 0.5,
    },
  });

  return JSON.stringify({
    success: true,
    entryId: entry.id,
    exercise: exercise.name,
    weightKg: params.weightKg,
    reps: params.reps ?? 1,
    isNewPR,
    previousBest: bestEntry
      ? {
          weightKg: bestEntry.weightKg,
          reps: bestEntry.reps,
          date: bestEntry.performedAt.toISOString().split("T")[0],
        }
      : null,
    date: performedAt.toISOString().split("T")[0],
    message: isNewPR
      ? `🏆 NEW PR! ${exercise.name}: ${params.weightKg}kg × ${params.reps ?? 1} reps!`
      : `✅ Recorded ${exercise.name}: ${params.weightKg}kg × ${params.reps ?? 1} reps.`,
  });
}

/**
 * Log a performance entry (strength PR, run time, trail time) directly.
 * This allows users to say "I just did 100kg deadlift for 3 reps" and have it
 * recorded in their Performance history — without creating a full workout.
 */
export async function logPerformanceEntry(
  userId: string,
  params: LogPerformanceParams
): Promise<string> {
  const { type } = params;

  const performedAt = params.date ? new Date(params.date) : new Date();

  // ── STRENGTH ──────────────────────────────────────────────────────────
  if (type === "STRENGTH") {
    return logStrengthEntry(userId, params, performedAt);
  }

  // ── RUN / TRAIL ───────────────────────────────────────────────────────
  if (type === "RUN" || type === "TRAIL") {
    if (!params.distanceKm || params.distanceKm <= 0) {
      return JSON.stringify({
        error: true,
        message:
          "Distance in km is required for RUN/TRAIL entries. Please specify the distance.",
      });
    }

    const entry = await prisma.userPerformanceEntry.create({
      data: {
        userId,
        type,
        distanceKm: params.distanceKm,
        timeSeconds: params.timeSeconds ?? null,
        elevationGainM:
          type === "TRAIL" ? (params.elevationGainM ?? null) : null,
        eventName: params.eventName ?? null,
        location: params.location ?? null,
        performedAt,
        qualityScore: 0.5,
        predictionWeight: 0.5,
      },
    });

    const timeStr = formatSecondsToTime(params.timeSeconds ?? null) ?? "";

    return JSON.stringify({
      success: true,
      entryId: entry.id,
      type,
      distanceKm: params.distanceKm,
      timeSeconds: params.timeSeconds ?? null,
      timeFormatted: timeStr || null,
      elevationGainM:
        type === "TRAIL" ? (params.elevationGainM ?? null) : undefined,
      eventName: params.eventName ?? null,
      location: params.location ?? null,
      date: performedAt.toISOString().split("T")[0],
      message:
        [
          "✅ Recorded",
          type === "RUN" ? "run" : "trail",
          ":",
          `${params.distanceKm}km`,
          timeStr ? `in ${timeStr}` : "",
          params.eventName ? `(${params.eventName})` : "",
        ]
          .filter(Boolean)
          .join(" ") + ".",
    });
  }

  return JSON.stringify({
    error: true,
    message: "Invalid type. Use STRENGTH, RUN, or TRAIL.",
  });
}
