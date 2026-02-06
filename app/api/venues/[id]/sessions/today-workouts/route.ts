import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/venues/[id]/sessions/today-workouts
// Returns all workouts assigned to today's sessions for the venue
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: venueId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is OWNER, ADMIN, or COACH of this venue
    const membership = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
    });

    if (!membership || !["OWNER", "ADMIN", "COACH"].includes(membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const today = new Date();
    const dayStart = startOfDay(today);
    const dayEnd = endOfDay(today);

    // Get all sessions for today with their assigned workouts
    const sessionWorkouts = await prisma.venueSessionWorkout.findMany({
      where: {
        session: {
          venueId,
          startsAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            startsAt: true,
            endsAt: true,
            type: true,
          },
        },
        workout: {
          select: {
            id: true,
            name: true,
            description: true,
            estimatedTime: true,
            difficulty: true,
            blocks: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                type: true,
                name: true,
                timeCap: true,
                rounds: true,
                workTime: true,
                notes: true,
                exercises: {
                  orderBy: { orderIndex: "asc" },
                  select: {
                    id: true,
                    prescribedReps: true,
                    prescribedWeight: true,
                    prescribedWeightFemale: true,
                    exercise: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        session: {
          startsAt: "asc",
        },
      },
    });

    return NextResponse.json(sessionWorkouts);
  } catch (error) {
    console.error("Error fetching today's workouts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
