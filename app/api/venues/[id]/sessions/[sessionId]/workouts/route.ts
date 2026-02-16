import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";

interface RouteParams {
  params: Promise<{
    id: string;
    sessionId: string;
  }>;
}

// GET - Get workouts assigned to a session
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: venueId, sessionId } = await params;

    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    const authResult = await canManageSessions(authUser.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get session with workouts
    const venueSession = await prisma.venueSession.findFirst({
      where: {
        id: sessionId,
        venueId,
      },
      include: {
        sessionWorkouts: {
          include: {
            workout: {
              include: {
                blocks: {
                  include: {
                    exercises: {
                      include: {
                        exercise: {
                          include: {
                            translations: true,
                          },
                        },
                      },
                      orderBy: {
                        orderIndex: "asc",
                      },
                    },
                  },
                  orderBy: {
                    orderIndex: "asc",
                  },
                },
              },
            },
          },
          orderBy: {
            assignedAt: "asc",
          },
        },
      },
    });

    if (!venueSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      workouts: venueSession.sessionWorkouts.map((sw) => ({
        ...sw.workout,
        assignedAt: sw.assignedAt,
        notes: sw.notes,
      })),
    });
  } catch (error) {
    console.error("Error fetching session workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch session workouts" },
      { status: 500 }
    );
  }
}

// POST - Assign workouts to a session
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: venueId, sessionId } = await params;

    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    const authResult = await canManageSessions(authUser.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if session exists
    const venueSession = await prisma.venueSession.findFirst({
      where: {
        id: sessionId,
        venueId,
      },
    });

    if (!venueSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const body = await request.json();
    const { workoutIds, notes } = body;

    if (!workoutIds || !Array.isArray(workoutIds)) {
      return NextResponse.json(
        { error: "workoutIds array is required" },
        { status: 400 }
      );
    }

    // Verify all workouts exist and belong to this venue or are public
    const workouts = await prisma.workout.findMany({
      where: {
        id: { in: workoutIds },
        OR: [{ venueId }, { isPublic: true }, { createdById: authUser.id }],
      },
    });

    if (workouts.length !== workoutIds.length) {
      return NextResponse.json(
        { error: "Some workouts not found or not accessible" },
        { status: 400 }
      );
    }

    // Create workout assignments
    const assignments = await prisma.$transaction(
      workoutIds.map((workoutId: string) =>
        prisma.venueSessionWorkout.upsert({
          where: {
            sessionId_workoutId: {
              sessionId,
              workoutId,
            },
          },
          create: {
            sessionId,
            workoutId,
            notes: notes || null,
          },
          update: {
            notes: notes || null,
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: assignments.length });
  } catch (error) {
    console.error("Error assigning workouts to session:", error);
    return NextResponse.json(
      { error: "Failed to assign workouts" },
      { status: 500 }
    );
  }
}

// PUT - Update workouts for a session (replace all)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: venueId, sessionId } = await params;

    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    const authResult = await canManageSessions(authUser.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if session exists
    const venueSession = await prisma.venueSession.findFirst({
      where: {
        id: sessionId,
        venueId,
      },
    });

    if (!venueSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const body = await request.json();
    const { workoutIds } = body;

    if (!Array.isArray(workoutIds)) {
      return NextResponse.json(
        { error: "workoutIds array is required" },
        { status: 400 }
      );
    }

    // If workoutIds is empty, just remove all
    if (workoutIds.length === 0) {
      await prisma.venueSessionWorkout.deleteMany({
        where: { sessionId },
      });
      return NextResponse.json({ success: true, count: 0 });
    }

    // Verify all workouts exist and belong to this venue or are public
    const workouts = await prisma.workout.findMany({
      where: {
        id: { in: workoutIds },
        OR: [{ venueId }, { isPublic: true }, { createdById: authUser.id }],
      },
    });

    if (workouts.length !== workoutIds.length) {
      return NextResponse.json(
        { error: "Some workouts not found or not accessible" },
        { status: 400 }
      );
    }

    // Replace all workout assignments
    await prisma.$transaction([
      prisma.venueSessionWorkout.deleteMany({
        where: { sessionId },
      }),
      ...workoutIds.map((workoutId: string) =>
        prisma.venueSessionWorkout.create({
          data: {
            sessionId,
            workoutId,
          },
        })
      ),
    ]);

    return NextResponse.json({ success: true, count: workoutIds.length });
  } catch (error) {
    console.error("Error updating session workouts:", error);
    return NextResponse.json(
      { error: "Failed to update session workouts" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a workout from a session
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: venueId, sessionId } = await params;

    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    const authResult = await canManageSessions(authUser.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get workoutId from query params
    const searchParams = request.nextUrl.searchParams;
    const workoutId = searchParams.get("workoutId");

    if (!workoutId) {
      return NextResponse.json(
        { error: "workoutId is required" },
        { status: 400 }
      );
    }

    // Delete the assignment
    await prisma.venueSessionWorkout.deleteMany({
      where: {
        sessionId,
        workoutId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing workout from session:", error);
    return NextResponse.json(
      { error: "Failed to remove workout" },
      { status: 500 }
    );
  }
}
