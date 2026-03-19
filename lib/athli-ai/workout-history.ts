/**
 * Athli AI — Workout history and training logs
 */

import { prisma } from "@/lib/prisma";

export interface WorkoutHistoryParams {
  period?: "week" | "last_week" | "month" | "last_month" | "year" | "all";
  limit?: number;
}

const FEELING_LABELS: Record<number, string> = {
  1: "😫 Terrible",
  2: "😕 Bad",
  3: "😐 OK",
  4: "😊 Good",
  5: "🤩 Excellent",
};

const PERIOD_LABELS: Record<string, string> = {
  week: "this week",
  last_week: "last week",
  month: "this month",
  last_month: "last month",
  year: "this year",
  all: "all time",
};

function calculateDateRange(period: string | undefined): {
  fromDate: Date | undefined;
  toDate: Date | undefined;
} {
  const now = new Date();
  let fromDate: Date | undefined;
  let toDate: Date | undefined;

  switch (period) {
    case "week": {
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - diffToMonday);
      fromDate.setHours(0, 0, 0, 0);
      break;
    }
    case "last_week": {
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() - diffToMonday);
      thisMonday.setHours(0, 0, 0, 0);
      fromDate = new Date(thisMonday);
      fromDate.setDate(thisMonday.getDate() - 7);
      toDate = thisMonday;
      break;
    }
    case "month": {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "last_month": {
      fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      toDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "year": {
      fromDate = new Date(now.getFullYear(), 0, 1);
      break;
    }
    default: {
      fromDate = undefined;
      break;
    }
  }

  return { fromDate, toDate };
}

export interface ExerciseResultSummary {
  exercise: { name: string };
  sets: Array<{
    reps: number;
    weight: number;
    weightUnit: string | null;
    isPR: boolean;
  }>;
  actualReps: number | null;
  actualWeight: number | null;
  actualWeightUnit: string | null;
  actualDistance: number | null;
  actualDistanceUnit: string | null;
  actualTime: number | null;
  actualCalories: number | null;
  isPR: boolean;
}

export function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0 && secs > 0) return `${mins}m${secs}s`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
}

export function formatMetricParts(er: ExerciseResultSummary): string[] {
  const parts: string[] = [];
  if (er.actualReps) parts.push(`${er.actualReps} reps`);
  if (er.actualWeight)
    parts.push(`${er.actualWeight}${er.actualWeightUnit || "KG"}`);
  if (er.actualDistance)
    parts.push(`${er.actualDistance}${er.actualDistanceUnit || "KM"}`);
  if (er.actualTime) parts.push(formatDuration(er.actualTime));
  if (er.actualCalories) parts.push(`${er.actualCalories} cal`);
  return parts;
}

export function formatExerciseDetail(er: ExerciseResultSummary): string {
  let detail = er.exercise.name;
  const parts: string[] = [];
  if (er.sets.length > 0) {
    const setsSummary = er.sets
      .map((s) => `${s.reps}×${s.weight}${s.weightUnit || "KG"}`)
      .join(", ");
    parts.push(setsSummary);
  } else {
    parts.push(...formatMetricParts(er));
  }
  if (er.isPR) parts.push("🏆 PR!");
  if (parts.length > 0) detail += ` (${parts.join(", ")})`;
  return detail;
}

function safeAverage(values: number[]): number | null {
  if (values.length === 0) return null;
  return (
    Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma query result type is dynamic
function computeAverages(logs: any[]): {
  avgFeeling: number | null;
  avgEffort: number | null;
} {
  const feelings = logs
    .filter((l) => l.feeling !== null)
    .map((l) => l.feeling as number);
  const efforts = logs
    .filter((l) => l.perceivedEffort !== null)
    .map((l) => l.perceivedEffort as number);
  return { avgFeeling: safeAverage(feelings), avgEffort: safeAverage(efforts) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma query result type is dynamic
function countPRsInExerciseResults(exerciseResults: any[]): number {
  let count = 0;
  for (const er of exerciseResults) {
    if (er.isPR) count++;
    for (const s of er.sets) {
      if (s.isPR) count++;
    }
  }
  return count;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma query result type is dynamic
function countPRs(logs: any[]): number {
  let count = 0;
  for (const log of logs) {
    for (const br of log.blockResults) {
      count += countPRsInExerciseResults(br.exerciseResults);
    }
  }
  return count;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma query result type is dynamic
function collectUniqueExercises(logs: any[]): Set<string> {
  const exerciseSet = new Set<string>();
  for (const log of logs) {
    for (const br of log.blockResults) {
      for (const er of br.exerciseResults) {
        exerciseSet.add(er.exercise.name);
      }
    }
  }
  return exerciseSet;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma query result type is dynamic
function buildLogSummaries(logs: any[]) {
  return logs.map((log) => {
    const exercisesList: string[] = [];
    for (const br of log.blockResults) {
      for (const er of br.exerciseResults) {
        exercisesList.push(formatExerciseDetail(er));
      }
    }

    return {
      date: log.performedAt.toISOString().split("T")[0],
      workoutName: log.workout.name,
      session: log.session?.title || null,
      feeling: log.feeling
        ? FEELING_LABELS[log.feeling] || `${log.feeling}/5`
        : null,
      perceivedEffort: log.perceivedEffort
        ? `RPE ${log.perceivedEffort}/10`
        : null,
      notes: log.notes || null,
      exercises: exercisesList,
    };
  });
}

function buildDateFilter(
  fromDate: Date | undefined,
  toDate: Date | undefined
): Record<string, unknown> {
  if (!fromDate && !toDate) return {};
  const performedAt: Record<string, Date> = {};
  if (fromDate) performedAt.gte = fromDate;
  if (toDate) performedAt.lt = toDate;
  return { performedAt };
}

function buildNoLogsMessage(period: string | undefined): string {
  const periodLabel = PERIOD_LABELS[period ?? ""] ?? "";
  const suffix = periodLabel || "yet";
  const prefix = periodLabel ? ` for ${periodLabel}` : "";
  return `No workout logs found${prefix}. The user hasn't logged any workouts ${suffix}.`;
}

export async function getUserWorkoutHistory(
  userId: string,
  params: WorkoutHistoryParams
): Promise<string> {
  const period = params.period;
  const limit = params.limit || 20;

  const { fromDate, toDate } = calculateDateRange(period);
  const dateFilter = buildDateFilter(fromDate, toDate);

  const totalCount = await prisma.workoutLog.count({
    where: { userId, ...dateFilter },
  });

  const effectiveLimit =
    period === "all" || period === "year" ? Math.min(limit, 10) : limit;

  // Fetch workout logs with details
  const logs = await prisma.workoutLog.findMany({
    where: {
      userId,
      ...dateFilter,
    },
    orderBy: { performedAt: "desc" },
    take: effectiveLimit,
    include: {
      workout: {
        select: {
          id: true,
          name: true,
          estimatedTime: true,
          difficulty: true,
          tags: true,
        },
      },
      session: {
        select: {
          id: true,
          title: true,
        },
      },
      blockResults: {
        include: {
          block: {
            select: {
              id: true,
              type: true,
              name: true,
            },
          },
          exerciseResults: {
            select: {
              exercise: {
                select: {
                  name: true,
                  category: true,
                },
              },
              actualReps: true,
              actualWeight: true,
              actualWeightUnit: true,
              actualDistance: true,
              actualDistanceUnit: true,
              actualTime: true,
              actualCalories: true,
              isPR: true,
              sets: {
                select: {
                  reps: true,
                  weight: true,
                  weightUnit: true,
                  isPR: true,
                },
                orderBy: { setNumber: "asc" as const },
              },
            },
          },
        },
      },
    },
  });

  if (totalCount === 0) {
    return buildNoLogsMessage(period);
  }

  const { avgFeeling, avgEffort } = computeAverages(logs);
  const prCount = countPRs(logs);
  const exerciseSet = collectUniqueExercises(logs);
  const logSummaries = buildLogSummaries(logs);

  const periodLabel = PERIOD_LABELS[period ?? ""] ?? "recent";

  return JSON.stringify({
    period: periodLabel,
    stats: {
      totalWorkouts: totalCount,
      logsShown: logSummaries.length,
      avgFeeling,
      avgEffort,
      prsAchieved: prCount,
      uniqueExercises: exerciseSet.size,
    },
    logs: logSummaries,
  });
}
