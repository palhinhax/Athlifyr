import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  predictHalfMarathon,
  predictE1rm,
  E1rmPrediction,
} from "@/lib/performance/scoring";

interface RunChartPoint {
  date: string;
  pace: number; // sec/km
  distanceKm: number;
}

interface StrengthChartPoint {
  date: string;
  e1rm: number;
}

interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  chartPoints: StrengthChartPoint[];
  e1rmPrediction: E1rmPrediction | null;
  totalEntries: number;
}

// Type definitions for Prisma query results (before migration generates types)
interface RunEntryResult {
  id: string;
  distanceKm: number | null;
  timeSeconds: number | null;
  elevationGainM: number | null;
  performedAt: Date;
  qualityScore: number | null;
  predictionWeight: number | null;
}

interface StrengthEntryResult {
  id: string;
  exerciseId: string | null;
  weightKg: number | null;
  reps: number | null;
  performedAt: Date;
  qualityScore: number | null;
  predictionWeight: number | null;
  exercise: {
    id: string;
    name: string;
  } | null;
}

interface HyroxEntryResult {
  id: string;
  hyroxCategory: string | null;
  timeSeconds: number | null;
  eventName: string | null;
  location: string | null;
  performedAt: Date;
}

// Helper to calculate e1RM
function calculateE1rm(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

// GET /api/profile/performance/summary
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all running entries
    const runEntries: RunEntryResult[] =
      (await prisma.userPerformanceEntry.findMany({
        where: {
          userId: session.user.id,
          type: "RUN",
        },
        orderBy: { performedAt: "asc" },
        select: {
          id: true,
          distanceKm: true,
          timeSeconds: true,
          elevationGainM: true,
          performedAt: true,
          qualityScore: true,
          predictionWeight: true,
        },
      })) as RunEntryResult[];

    // Fetch all strength entries with exercise info
    const strengthEntries: StrengthEntryResult[] =
      (await prisma.userPerformanceEntry.findMany({
        where: {
          userId: session.user.id,
          type: "STRENGTH",
        },
        orderBy: { performedAt: "asc" },
        select: {
          id: true,
          exerciseId: true,
          weightKg: true,
          reps: true,
          performedAt: true,
          qualityScore: true,
          predictionWeight: true,
          exercise: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })) as StrengthEntryResult[];

    // Fetch all HYROX entries
    const hyroxEntries: HyroxEntryResult[] =
      (await prisma.userPerformanceEntry.findMany({
        where: {
          userId: session.user.id,
          type: "HYROX",
        },
        orderBy: { performedAt: "desc" },
        select: {
          id: true,
          hyroxCategory: true,
          timeSeconds: true,
          eventName: true,
          location: true,
          performedAt: true,
        },
      })) as HyroxEntryResult[];

    // Process running data
    const runChartPoints: RunChartPoint[] = runEntries
      .filter((e) => e.distanceKm && e.timeSeconds && e.distanceKm > 0)
      .map((e) => ({
        date: e.performedAt.toISOString().split("T")[0],
        pace: (e.timeSeconds as number) / (e.distanceKm as number),
        distanceKm: e.distanceKm as number,
      }));

    // Apply rolling average (3-point) for smoothing
    const smoothedRunPoints = runChartPoints.map((point, index) => {
      if (index === 0 || index === runChartPoints.length - 1) {
        return point;
      }
      const avgPace =
        (runChartPoints[index - 1].pace +
          point.pace +
          runChartPoints[index + 1].pace) /
        3;
      return { ...point, pace: avgPace };
    });

    // Half marathon prediction
    const halfPrediction = predictHalfMarathon(
      runEntries
        .filter((e) => e.distanceKm && e.timeSeconds)
        .map((e) => ({
          distanceKm: e.distanceKm as number,
          timeSeconds: e.timeSeconds as number,
          elevationGainM: e.elevationGainM,
          performedAt: e.performedAt,
          qualityScore: e.qualityScore,
          predictionWeight: e.predictionWeight,
        }))
    );

    // Process strength data by exercise
    const exerciseMap = new Map<
      string,
      {
        exerciseId: string;
        exerciseName: string;
        entries: typeof strengthEntries;
      }
    >();

    for (const entry of strengthEntries) {
      if (!entry.exerciseId || !entry.exercise) continue;

      const existing = exerciseMap.get(entry.exerciseId);
      if (existing) {
        existing.entries.push(entry);
      } else {
        exerciseMap.set(entry.exerciseId, {
          exerciseId: entry.exerciseId,
          exerciseName: entry.exercise.name,
          entries: [entry],
        });
      }
    }

    const exerciseSummaries: ExerciseSummary[] = [];

    for (const [exerciseId, data] of exerciseMap) {
      const chartPoints: StrengthChartPoint[] = data.entries
        .filter((e) => e.weightKg !== null && e.reps !== null && e.reps <= 12)
        .map((e) => ({
          date: e.performedAt.toISOString().split("T")[0],
          e1rm: calculateE1rm(e.weightKg as number, e.reps as number),
        }));

      const e1rmPrediction = predictE1rm(
        data.entries.map((e) => ({
          exerciseId: e.exerciseId as string,
          weightKg: e.weightKg as number,
          reps: e.reps as number,
          performedAt: e.performedAt,
          qualityScore: e.qualityScore,
          predictionWeight: e.predictionWeight,
        })),
        exerciseId,
        data.exerciseName
      );

      exerciseSummaries.push({
        exerciseId,
        exerciseName: data.exerciseName,
        chartPoints,
        e1rmPrediction,
        totalEntries: data.entries.length,
      });
    }

    // Sort exercises by total entries (most used first)
    exerciseSummaries.sort((a, b) => b.totalEntries - a.totalEntries);

    // Format entries for the list view
    const allEntries = [
      ...runEntries.map((e) => ({
        id: e.id,
        type: "RUN" as const,
        performedAt: e.performedAt.toISOString(),
        distanceKm: e.distanceKm,
        timeSeconds: e.timeSeconds,
        elevationGainM: e.elevationGainM,
        exerciseId: null,
        exerciseName: null,
        weightKg: null,
        reps: null,
      })),
      ...strengthEntries.map((e) => ({
        id: e.id,
        type: "STRENGTH" as const,
        performedAt: e.performedAt.toISOString(),
        distanceKm: null,
        timeSeconds: null,
        elevationGainM: null,
        exerciseId: e.exerciseId,
        exerciseName: e.exercise?.name || null,
        weightKg: e.weightKg,
        reps: e.reps,
      })),
    ];

    // Format HYROX entries
    const formattedHyroxEntries = hyroxEntries.map((e) => ({
      id: e.id,
      type: "HYROX" as const,
      performedAt: e.performedAt.toISOString(),
      timeSeconds: e.timeSeconds as number,
      hyroxCategory: e.hyroxCategory as string,
      eventName: e.eventName,
      location: e.location,
    }));

    // Calculate best times by HYROX category
    const bestTimeByCategory: Record<
      string,
      { timeSeconds: number; performedAt: string }
    > = {};
    for (const entry of hyroxEntries) {
      if (!entry.hyroxCategory || !entry.timeSeconds) continue;
      const existing = bestTimeByCategory[entry.hyroxCategory];
      if (!existing || entry.timeSeconds < existing.timeSeconds) {
        bestTimeByCategory[entry.hyroxCategory] = {
          timeSeconds: entry.timeSeconds,
          performedAt: entry.performedAt.toISOString(),
        };
      }
    }

    const summary = {
      run: {
        chartPoints: smoothedRunPoints,
        halfPrediction,
        totalEntries: runEntries.length,
      },
      strength: {
        exercises: exerciseSummaries,
        totalEntries: strengthEntries.length,
      },
      hyrox: {
        entries: formattedHyroxEntries,
        totalEntries: hyroxEntries.length,
        bestTimeByCategory,
      },
      entries: allEntries,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching performance summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
