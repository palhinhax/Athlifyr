import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  computeRunScores,
  computeStrengthScores,
} from "@/lib/performance/scoring";
import { HyroxCategory } from "@prisma/client";

// Schema for updating a running entry
const runUpdateSchema = z.object({
  type: z.literal("RUN"),
  distanceKm: z.number().positive("Distance must be positive"),
  timeSeconds: z.number().int().positive("Time must be positive"),
  performedAt: z.string().datetime(),
  elevationGainM: z.number().int().nonnegative().nullable().optional(),
});

// Schema for updating a strength entry
const strengthUpdateSchema = z.object({
  type: z.literal("STRENGTH"),
  exerciseId: z.string().min(1, "Exercise is required"),
  reps: z.number().int().positive("Reps must be positive"),
  weightKg: z.number().nonnegative("Weight cannot be negative"),
  performedAt: z.string().datetime(),
});

// Schema for updating a HYROX entry
const hyroxUpdateSchema = z.object({
  type: z.literal("HYROX"),
  hyroxCategory: z.nativeEnum(HyroxCategory),
  timeSeconds: z.number().int().positive("Time must be positive"),
  performedAt: z.string().datetime(),
  eventName: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});

const updateEntrySchema = z.discriminatedUnion("type", [
  runUpdateSchema,
  strengthUpdateSchema,
  hyroxUpdateSchema,
]);

// PATCH /api/profile/performance/[id] - Update a performance entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existingEntry = await prisma.userPerformanceEntry.findUnique({
      where: { id },
      select: { userId: true, type: true },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (existingEntry.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = updateEntrySchema.safeParse(body);

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
    const performedAt = new Date(data.performedAt);

    if (data.type === "RUN") {
      // Fetch recent running history for scoring
      const history = await prisma.userPerformanceEntry.findMany({
        where: {
          userId: user.id,
          type: "RUN",
          id: { not: id }, // Exclude current entry
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
        history.map((h) => ({
          distanceKm: h.distanceKm as number,
          timeSeconds: h.timeSeconds as number,
          performedAt: h.performedAt,
        }))
      );

      const updatedEntry = await prisma.userPerformanceEntry.update({
        where: { id },
        data: {
          distanceKm: data.distanceKm,
          timeSeconds: data.timeSeconds,
          elevationGainM: data.elevationGainM,
          performedAt,
          qualityScore: scores.qualityScore,
          predictionWeight: scores.predictionWeight,
        },
      });

      return NextResponse.json(updatedEntry);
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
          id: { not: id }, // Exclude current entry
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
        history.map((h) => ({
          weightKg: h.weightKg as number,
          reps: h.reps as number,
          performedAt: h.performedAt,
        }))
      );

      const updatedEntry = await prisma.userPerformanceEntry.update({
        where: { id },
        data: {
          exerciseId: data.exerciseId,
          weightKg: data.weightKg,
          reps: data.reps,
          performedAt,
          qualityScore: scores.qualityScore,
          predictionWeight: scores.predictionWeight,
        },
      });

      return NextResponse.json(updatedEntry);
    } else {
      // HYROX entry
      const updatedEntry = await prisma.userPerformanceEntry.update({
        where: { id },
        data: {
          hyroxCategory: data.hyroxCategory,
          timeSeconds: data.timeSeconds,
          performedAt,
          eventName: data.eventName ?? null,
          location: data.location ?? null,
        },
      });

      return NextResponse.json(updatedEntry);
    }
  } catch (error) {
    console.error("Error updating performance entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/profile/performance/[id] - Get a single performance entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const entry = await prisma.userPerformanceEntry.findUnique({
      where: { id },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      ...entry,
      exerciseName: entry.exercise?.name,
    });
  } catch (error) {
    console.error("Error fetching performance entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/profile/performance/[id] - Delete a performance entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

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
