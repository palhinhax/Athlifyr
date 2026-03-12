import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { computeRunScores } from "@/lib/performance/scoring";

// ── Validation ──────────────────────────────────────────────────────────────

const gpsPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.number().positive(),
  altitude: z.number().optional(),
  speed: z.number().optional(),
  accuracy: z.number().optional(),
});

const createActivitySchema = z.object({
  startedAt: z.number().positive(),
  finishedAt: z.number().positive(),
  durationMs: z.number().int().positive(),
  distanceM: z.number().int().nonnegative(),
  avgPaceMinKm: z.number().positive().nullable(),
  maxSpeedKmh: z.number().nonnegative(),
  elevationGainM: z.number().int().nonnegative(),
  elevationLossM: z.number().int().nonnegative(),
  track: z.array(gpsPointSchema).min(3),
  // Metadata (optional — added via save screen)
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  perceivedEffort: z.number().int().min(1).max(5).optional(),
  visibility: z.enum(["everyone", "only_me"]).optional(),
  muted: z.boolean().optional(),
});

// ── POST /api/profile/activities — Upload a GPS activity + auto-create performance entry ──

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;
    const distanceKm = data.distanceM / 1000;
    const timeSeconds = Math.round(data.durationMs / 1000);
    const performedAt = new Date(data.startedAt);

    // Create activity + performance entry in a transaction
    const { activity, performanceEntry } = await prisma.$transaction(
      async (tx) => {
        // 1. Create the GPS activity
        const activity = await tx.runActivity.create({
          data: {
            userId: user.id,
            startedAt: performedAt,
            finishedAt: new Date(data.finishedAt),
            durationMs: data.durationMs,
            distanceM: data.distanceM,
            avgPaceMinKm: data.avgPaceMinKm,
            maxSpeedKmh: data.maxSpeedKmh,
            elevationGainM: data.elevationGainM,
            elevationLossM: data.elevationLossM,
            track: data.track,
            title: data.title,
            description: data.description,
            perceivedEffort: data.perceivedEffort,
            visibility: data.visibility ?? "everyone",
            muted: data.muted ?? false,
          },
        });

        // 2. Fetch recent running history for scoring
        const history = await tx.userPerformanceEntry.findMany({
          where: {
            userId: user.id,
            type: "RUN",
            performedAt: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            },
          },
          select: {
            distanceKm: true,
            timeSeconds: true,
            performedAt: true,
          },
        });

        const scores = computeRunScores(
          {
            distanceKm,
            timeSeconds,
            elevationGainM: data.elevationGainM,
            performedAt,
          },
          history.map((h) => ({
            distanceKm: h.distanceKm ?? 0,
            timeSeconds: h.timeSeconds ?? 0,
            performedAt: h.performedAt,
          }))
        );

        // 3. Create linked performance entry
        const performanceEntry = await tx.userPerformanceEntry.create({
          data: {
            userId: user.id,
            type: "RUN",
            distanceKm,
            timeSeconds,
            elevationGainM: data.elevationGainM,
            performedAt,
            qualityScore: scores.qualityScore,
            predictionWeight: scores.predictionWeight,
            runActivityId: activity.id,
          },
        });

        return { activity, performanceEntry };
      }
    );

    return NextResponse.json(
      {
        activityId: activity.id,
        performanceEntryId: performanceEntry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── GET /api/profile/activities — List user's GPS activities ──

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    const activities = await prisma.runActivity.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        startedAt: true,
        finishedAt: true,
        durationMs: true,
        distanceM: true,
        avgPaceMinKm: true,
        maxSpeedKmh: true,
        elevationGainM: true,
        elevationLossM: true,
        createdAt: true,
        // Don't include track in list — it's large
      },
      orderBy: { startedAt: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    const hasMore = activities.length > limit;
    const items = hasMore ? activities.slice(0, limit) : activities;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return NextResponse.json({ items, nextCursor, hasMore });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
