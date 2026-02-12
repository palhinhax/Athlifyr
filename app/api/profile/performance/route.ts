import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  computeRunScores,
  computeStrengthScores,
} from "@/lib/performance/scoring";

// HYROX categories enum
const hyroxCategories = [
  "OPEN_MEN",
  "OPEN_WOMEN",
  "PRO_MEN",
  "PRO_WOMEN",
  "ELITE_15_MEN",
  "ELITE_15_WOMEN",
  "DOUBLES_MEN",
  "DOUBLES_WOMEN",
  "DOUBLES_MIXED",
  "RELAY_MEN",
  "RELAY_WOMEN",
  "RELAY_MIXED",
  "AGE_GROUP_16_29_MEN",
  "AGE_GROUP_16_29_WOMEN",
  "AGE_GROUP_30_34_MEN",
  "AGE_GROUP_30_34_WOMEN",
  "AGE_GROUP_35_39_MEN",
  "AGE_GROUP_35_39_WOMEN",
  "AGE_GROUP_40_44_MEN",
  "AGE_GROUP_40_44_WOMEN",
  "AGE_GROUP_45_49_MEN",
  "AGE_GROUP_45_49_WOMEN",
  "AGE_GROUP_50_54_MEN",
  "AGE_GROUP_50_54_WOMEN",
  "AGE_GROUP_55_59_MEN",
  "AGE_GROUP_55_59_WOMEN",
  "AGE_GROUP_60_64_MEN",
  "AGE_GROUP_60_64_WOMEN",
  "AGE_GROUP_65_69_MEN",
  "AGE_GROUP_65_69_WOMEN",
  "AGE_GROUP_70_PLUS_MEN",
  "AGE_GROUP_70_PLUS_WOMEN",
  "ADAPTIVE",
] as const;

// Schema for creating a running entry
const runEntrySchema = z.object({
  type: z.literal("RUN"),
  distanceKm: z.number().positive("Distance must be positive"),
  timeSeconds: z.number().int().positive("Time must be positive"),
  performedAt: z.string().datetime().optional(),
  elevationGainM: z.number().int().nonnegative().optional(),
});

// Schema for creating a strength entry
const strengthEntrySchema = z.object({
  type: z.literal("STRENGTH"),
  exerciseId: z.string().min(1, "Exercise is required"),
  reps: z.number().int().positive("Reps must be positive"),
  weightKg: z.number().nonnegative("Weight cannot be negative"),
  performedAt: z.string().datetime().optional(),
});

// Schema for creating a HYROX entry
const hyroxEntrySchema = z.object({
  type: z.literal("HYROX"),
  hyroxCategory: z.enum(hyroxCategories),
  timeSeconds: z.number().int().positive("Time must be positive"),
  performedAt: z.string().datetime().optional(),
  eventName: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});

const createEntrySchema = z.discriminatedUnion("type", [
  runEntrySchema,
  strengthEntrySchema,
  hyroxEntrySchema,
]);

// POST /api/profile/performance - Create a new performance entry
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createEntrySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const performedAt = data.performedAt
      ? new Date(data.performedAt)
      : new Date();

    if (data.type === "RUN") {
      // Fetch recent running history for scoring
      const history = await prisma.userPerformanceEntry.findMany({
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
          distanceKm: data.distanceKm,
          timeSeconds: data.timeSeconds,
          elevationGainM: data.elevationGainM,
          performedAt,
        },
        history.map(
          (h: {
            distanceKm: number | null;
            timeSeconds: number | null;
            performedAt: Date;
          }) => ({
            distanceKm: h.distanceKm ?? 0,
            timeSeconds: h.timeSeconds ?? 0,
            performedAt: h.performedAt,
          })
        )
      );

      const entry = await prisma.userPerformanceEntry.create({
        data: {
          userId: user.id,
          type: "RUN",
          distanceKm: data.distanceKm,
          timeSeconds: data.timeSeconds,
          elevationGainM: data.elevationGainM,
          performedAt,
          qualityScore: scores.qualityScore,
          predictionWeight: scores.predictionWeight,
        },
      });

      return NextResponse.json(entry, { status: 201 });
    } else if (data.type === "STRENGTH") {
      // STRENGTH entry
      // Verify exercise exists
      const exercise = await prisma.exercise.findUnique({
        where: { id: data.exerciseId },
      });

      if (!exercise) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      // Fetch recent strength history for this exercise for scoring
      const history = await prisma.userPerformanceEntry.findMany({
        where: {
          userId: user.id,
          type: "STRENGTH",
          exerciseId: data.exerciseId,
          performedAt: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          weightKg: true,
          reps: true,
          performedAt: true,
        },
      });

      const scores = computeStrengthScores(
        {
          weightKg: data.weightKg,
          reps: data.reps,
          performedAt,
        },
        history.map(
          (h: {
            weightKg: number | null;
            reps: number | null;
            performedAt: Date;
          }) => ({
            weightKg: h.weightKg ?? 0,
            reps: h.reps ?? 0,
            performedAt: h.performedAt,
          })
        )
      );

      const entry = await prisma.userPerformanceEntry.create({
        data: {
          userId: user.id,
          type: "STRENGTH",
          exerciseId: data.exerciseId,
          weightKg: data.weightKg,
          reps: data.reps,
          performedAt,
          qualityScore: scores.qualityScore,
          predictionWeight: scores.predictionWeight,
        },
        include: {
          exercise: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json(entry, { status: 201 });
    } else {
      // HYROX entry
      const entry = await prisma.userPerformanceEntry.create({
        data: {
          userId: user.id,
          type: "HYROX",
          hyroxCategory: data.hyroxCategory,
          timeSeconds: data.timeSeconds,
          eventName: data.eventName,
          location: data.location,
          performedAt,
          qualityScore: 0.8, // HYROX entries are high quality by default
          predictionWeight: 1.0,
        },
      });

      return NextResponse.json(entry, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating performance entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/profile/performance - List performance entries
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "RUN" | "STRENGTH" | null;
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    const entries = await prisma.userPerformanceEntry.findMany({
      where: {
        userId: user.id,
        ...(type && { type }),
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { performedAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    const hasMore = entries.length > limit;
    const items = hasMore ? entries.slice(0, limit) : entries;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching performance entries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/profile/performance?id=xxx - Delete a performance entry
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const entry = await prisma.userPerformanceEntry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.userPerformanceEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting performance entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
