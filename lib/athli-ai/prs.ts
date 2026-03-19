/**
 * Athli AI — User personal records and performance entries
 */

import { prisma } from "@/lib/prisma";

/**
 * Format total seconds into a human-readable duration string.
 * Returns null if the input is null or 0.
 */
export function formatSecondsToTime(
  totalSeconds: number | null
): string | null {
  if (!totalSeconds) return null;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h${String(minutes).padStart(2, "0")}m${String(seconds).padStart(2, "0")}s`;
  }
  return `${minutes}m${String(seconds).padStart(2, "0")}s`;
}

export interface UserPRsParams {
  exerciseName?: string;
  category?: string;
  type?: string; // RUN, TRAIL, STRENGTH, HYROX — defaults to all types
}

async function getRunTrailRecords(
  userId: string,
  type: "RUN" | "TRAIL"
): Promise<string> {
  const runEntries = await prisma.userPerformanceEntry.findMany({
    where: { userId, type },
    orderBy: { performedAt: "desc" },
    take: 20,
  });

  if (runEntries.length === 0) {
    return JSON.stringify({
      type,
      message:
        type === "RUN"
          ? "No running records found. Log your runs to start tracking!"
          : "No trail records found. Log your trail runs to start tracking!",
      entries: [],
    });
  }

  const formatted = runEntries.map((e) => {
    const timeFormatted = formatSecondsToTime(e.timeSeconds);
    const pacePerKm =
      e.distanceKm && e.timeSeconds
        ? Math.round(e.timeSeconds / e.distanceKm)
        : null;
    const paceFormatted = pacePerKm
      ? `${Math.floor(pacePerKm / 60)}:${String(pacePerKm % 60).padStart(2, "0")}/km`
      : null;

    return {
      date: e.performedAt.toISOString().split("T")[0],
      distanceKm: e.distanceKm,
      time: timeFormatted,
      timeSeconds: e.timeSeconds,
      pace: paceFormatted,
      elevationGainM: e.elevationGainM,
      eventName: e.eventName,
      location: e.location,
    };
  });

  const byDistance = new Map<number, (typeof formatted)[0]>();
  for (const entry of formatted) {
    if (!entry.distanceKm || !entry.timeSeconds) continue;
    const dist = entry.distanceKm;
    const existing = byDistance.get(dist);
    if (
      !existing ||
      (existing.timeSeconds &&
        entry.timeSeconds &&
        entry.timeSeconds < existing.timeSeconds)
    ) {
      byDistance.set(dist, entry);
    }
  }

  return JSON.stringify({
    type,
    totalEntries: runEntries.length,
    entries: formatted,
    bestTimes: Array.from(byDistance.entries()).map(([dist, entry]) => ({
      distanceKm: dist,
      bestTime: entry.time,
      pace: entry.pace,
      date: entry.date,
      eventName: entry.eventName,
    })),
  });
}

async function getHyroxRecords(userId: string): Promise<string> {
  const hyroxEntries = await prisma.userPerformanceEntry.findMany({
    where: { userId, type: "HYROX" },
    orderBy: { performedAt: "desc" },
    take: 20,
  });

  if (hyroxEntries.length === 0) {
    return JSON.stringify({
      type: "HYROX",
      message:
        "No HYROX records found. Log your HYROX times to start tracking!",
      entries: [],
    });
  }

  return JSON.stringify({
    type: "HYROX",
    totalEntries: hyroxEntries.length,
    entries: hyroxEntries.map((e) => ({
      date: e.performedAt.toISOString().split("T")[0],
      time: formatSecondsToTime(e.timeSeconds),
      timeSeconds: e.timeSeconds,
      category: e.hyroxCategory,
      eventName: e.eventName,
      location: e.location,
    })),
  });
}

async function getStrengthPRForExercise(
  userId: string,
  exerciseName: string
): Promise<string> {
  const exercise = await prisma.exercise.findFirst({
    where: {
      OR: [
        { name: { contains: exerciseName, mode: "insensitive" } },
        { aliases: { has: exerciseName } },
      ],
    },
    select: { id: true, name: true, category: true },
  });

  if (!exercise) {
    return `Exercise "${exerciseName}" not found in the database. Use list_available_exercises to find the correct name.`;
  }

  const entries = await prisma.userPerformanceEntry.findMany({
    where: {
      userId,
      exerciseId: exercise.id,
      type: "STRENGTH",
      weightKg: { not: null },
    },
    orderBy: { weightKg: "desc" },
    take: 10,
  });

  const prSets = await prisma.workoutExerciseSet.findMany({
    where: {
      exerciseResult: {
        exerciseId: exercise.id,
        blockResult: { log: { userId } },
      },
      isPR: true,
    },
    include: {
      exerciseResult: {
        include: {
          blockResult: { include: { log: { select: { performedAt: true } } } },
        },
      },
    },
    orderBy: { weight: "desc" },
    take: 5,
  });

  if (entries.length === 0 && prSets.length === 0) {
    return JSON.stringify({
      exercise: exercise.name,
      message: `No personal records found for ${exercise.name}. Start logging your workouts to track your PRs!`,
      pr: null,
      history: [],
    });
  }

  const allLifts: Array<{
    weightKg: number;
    reps: number | null;
    date: string;
  }> = [];

  for (const entry of entries) {
    if (entry.weightKg) {
      allLifts.push({
        weightKg: entry.weightKg,
        reps: entry.reps,
        date: entry.performedAt.toISOString().split("T")[0],
      });
    }
  }
  for (const set of prSets) {
    allLifts.push({
      weightKg: set.weight,
      reps: set.reps,
      date: set.exerciseResult.blockResult.log.performedAt
        .toISOString()
        .split("T")[0],
    });
  }

  allLifts.sort((a, b) => b.weightKg - a.weightKg);
  const uniqueLifts = allLifts.filter(
    (lift, idx, arr) =>
      idx ===
      arr.findIndex((l) => l.weightKg === lift.weightKg && l.date === lift.date)
  );

  return JSON.stringify({
    exercise: exercise.name,
    category: exercise.category,
    pr: uniqueLifts[0] || null,
    recentHistory: uniqueLifts.slice(0, 10),
    totalEntries: uniqueLifts.length,
  });
}

async function getAllPerformanceRecords(
  userId: string,
  category?: string
): Promise<string> {
  const strengthEntries = await prisma.userPerformanceEntry.findMany({
    where: {
      userId,
      type: "STRENGTH",
      weightKg: { not: null },
      ...(category
        ? {
            exercise: {
              category: category.toUpperCase() as
                | "CROSSFIT"
                | "GYM"
                | "WEIGHTLIFTING"
                | "BODYWEIGHT"
                | "CARDIO"
                | "OTHER",
            },
          }
        : {}),
    },
    include: { exercise: { select: { id: true, name: true, category: true } } },
    orderBy: { weightKg: "desc" },
  });

  const prsByExercise = new Map<
    string,
    {
      name: string;
      category: string;
      weightKg: number;
      reps: number | null;
      date: string;
    }
  >();
  for (const entry of strengthEntries) {
    if (!entry.exercise || !entry.weightKg) continue;
    if (!prsByExercise.has(entry.exercise.id)) {
      prsByExercise.set(entry.exercise.id, {
        name: entry.exercise.name,
        category: entry.exercise.category,
        weightKg: entry.weightKg,
        reps: entry.reps,
        date: entry.performedAt.toISOString().split("T")[0],
      });
    }
  }
  const strengthPRs = Array.from(prsByExercise.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const runEntries = await prisma.userPerformanceEntry.findMany({
    where: { userId, type: { in: ["RUN", "TRAIL"] } },
    orderBy: { performedAt: "desc" },
    take: 10,
  });
  const runRecords = runEntries.map((e) => ({
    type: e.type,
    date: e.performedAt.toISOString().split("T")[0],
    distanceKm: e.distanceKm,
    time: formatSecondsToTime(e.timeSeconds),
    elevationGainM: e.elevationGainM,
    eventName: e.eventName,
    location: e.location,
  }));

  const hyroxEntries = await prisma.userPerformanceEntry.findMany({
    where: { userId, type: "HYROX" },
    orderBy: { performedAt: "desc" },
    take: 5,
  });
  const hyroxRecords = hyroxEntries.map((e) => ({
    date: e.performedAt.toISOString().split("T")[0],
    time: formatSecondsToTime(e.timeSeconds),
    category: e.hyroxCategory,
    eventName: e.eventName,
    location: e.location,
  }));

  if (
    strengthPRs.length === 0 &&
    runRecords.length === 0 &&
    hyroxRecords.length === 0
  ) {
    return "No performance records found. Start logging your workouts and races to track your progress!";
  }

  return JSON.stringify({
    strengthPRs:
      strengthPRs.length > 0
        ? { totalExercises: strengthPRs.length, prs: strengthPRs }
        : null,
    runRecords:
      runRecords.length > 0
        ? { totalEntries: runRecords.length, entries: runRecords }
        : null,
    hyroxRecords:
      hyroxRecords.length > 0
        ? { totalEntries: hyroxRecords.length, entries: hyroxRecords }
        : null,
  });
}

/**
 * Get the user's personal records and performance entries.
 * Supports STRENGTH (PRs by exercise), RUN/TRAIL (race times/distances), and HYROX.
 * Can filter by specific exercise name, type, or get all records.
 */
export async function getUserPRs(
  userId: string,
  params: UserPRsParams
): Promise<string> {
  const requestedType = params.type?.toUpperCase() as
    | "RUN"
    | "TRAIL"
    | "STRENGTH"
    | "HYROX"
    | undefined;

  if (requestedType === "RUN" || requestedType === "TRAIL") {
    return getRunTrailRecords(userId, requestedType);
  }

  if (requestedType === "HYROX") {
    return getHyroxRecords(userId);
  }

  if (params.exerciseName) {
    return getStrengthPRForExercise(userId, params.exerciseName);
  }

  return getAllPerformanceRecords(userId, params.category);
}
