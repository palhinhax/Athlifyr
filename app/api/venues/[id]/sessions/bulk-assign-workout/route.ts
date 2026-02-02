import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";
import { z } from "zod";

const bulkAssignSchema = z.object({
  sessionIds: z.array(z.string()).min(1, "At least one session is required"),
  workoutId: z.string().min(1, "Workout is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;

    // Check permissions
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = bulkAssignSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { sessionIds, workoutId } = validation.data;

    // Verify all sessions belong to this venue
    const sessionsCount = await prisma.venueSession.count({
      where: {
        id: { in: sessionIds },
        venueId,
      },
    });

    if (sessionsCount !== sessionIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more sessions not found or do not belong to this venue",
        },
        { status: 400 }
      );
    }

    // Verify workout exists and user has access
    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        OR: [
          { createdById: session.user.id },
          { isTemplate: true },
          { venueId },
        ],
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found or access denied" },
        { status: 404 }
      );
    }

    // Create assignments for all sessions (skip duplicates)
    const results = await Promise.all(
      sessionIds.map(async (sessionId) => {
        try {
          // Check if already assigned
          const existing = await prisma.venueSessionWorkout.findUnique({
            where: {
              sessionId_workoutId: {
                sessionId,
                workoutId,
              },
            },
          });

          if (existing) {
            return { sessionId, status: "skipped" as const };
          }

          await prisma.venueSessionWorkout.create({
            data: {
              sessionId,
              workoutId,
            },
          });

          return { sessionId, status: "created" as const };
        } catch (error) {
          console.error(
            `Error assigning workout to session ${sessionId}:`,
            error
          );
          return { sessionId, status: "error" as const };
        }
      })
    );

    const created = results.filter((r) => r.status === "created").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const errors = results.filter((r) => r.status === "error").length;

    return NextResponse.json({
      success: true,
      count: created,
      skipped,
      errors,
      message: `Workout assigned to ${created} session(s)${skipped > 0 ? `, ${skipped} already had it` : ""}${errors > 0 ? `, ${errors} failed` : ""}`,
    });
  } catch (error) {
    console.error("Error in bulk assign workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
