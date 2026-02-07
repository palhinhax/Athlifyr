import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get sessions assigned to the current user as coach across all venues
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user has professional profile (is a venue member with staff role)
    const memberships = await prisma.venueMember.findMany({
      where: {
        userId,
        status: "ACTIVE",
        role: { not: "CLIENT" },
      },
      select: {
        venueId: true,
        role: true,
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    if (memberships.length === 0) {
      return NextResponse.json({ sessions: [], venues: [] });
    }

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { error: "Missing 'from' and 'to' query parameters" },
        { status: 400 }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Fetch sessions where this user is assigned as coach
    const venueIds = memberships.map((m) => m.venueId);

    const sessions = await prisma.venueSession.findMany({
      where: {
        coachId: userId,
        venueId: { in: venueIds },
        AND: [{ startsAt: { gte: fromDate } }, { startsAt: { lt: toDate } }],
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ["BOOKED", "ATTENDED"],
                },
              },
            },
          },
        },
        bookings: {
          where: {
            status: {
              in: ["BOOKED", "ATTENDED"],
            },
          },
          select: {
            id: true,
            status: true,
            guestName: true,
            guestEmail: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        sessionWorkouts: {
          include: {
            workout: {
              select: {
                id: true,
                name: true,
                description: true,
                estimatedTime: true,
                difficulty: true,
              },
            },
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    // Format response
    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      venueId: s.venueId,
      type: s.type,
      title: s.title,
      description: s.description,
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
      capacity: s.capacity,
      coachId: s.coachId,
      tags: s.tags,
      recurringSessionId: s.recurringSessionId,
      venue: s.venue,
      _count: s._count,
      bookings: s.bookings,
      workouts: s.sessionWorkouts.map((sw) => ({
        id: sw.id,
        workout: {
          id: sw.workout.id,
          name: sw.workout.name,
          description: sw.workout.description,
          estimatedTime: sw.workout.estimatedTime,
          difficulty: sw.workout.difficulty,
        },
      })),
    }));

    return NextResponse.json({
      sessions: formattedSessions,
      venues: memberships.map((m) => m.venue),
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}
