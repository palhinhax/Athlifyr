import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET - Get all schedule items for the current user
// Includes: sessions as coach, sessions as client (bookings), and event participations
export async function GET(request: NextRequest) {
  try {
    // Uses getAuthUser to support both web (session) and mobile (Bearer token)
    const user = await getAuthUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

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

    // 1. Fetch sessions where user is COACH
    const coachSessions = await prisma.venueSession.findMany({
      where: {
        coachId: userId,
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

    // 2. Fetch sessions where user is CLIENT (bookings)
    const clientBookings = await prisma.venueBooking.findMany({
      where: {
        userId,
        status: { in: ["BOOKED", "ATTENDED"] },
        session: {
          AND: [{ startsAt: { gte: fromDate } }, { startsAt: { lt: toDate } }],
        },
      },
      include: {
        session: {
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
        },
      },
      orderBy: {
        session: {
          startsAt: "asc",
        },
      },
    });

    // 3. Fetch event participations
    const eventParticipations = await prisma.participation.findMany({
      where: {
        userId,
        status: { not: "CANCELLED" },
        event: {
          startDate: { gte: fromDate, lt: toDate },
        },
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true,
            city: true,
            country: true,
            sportTypes: true,
            cancelled: true,
            imageUrl: true,
            _count: {
              select: {
                participations: true,
              },
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            distanceKm: true,
            startDate: true,
            startTime: true,
          },
        },
      },
      orderBy: {
        event: {
          startDate: "asc",
        },
      },
    });

    // Format coach sessions
    const formattedCoachSessions = coachSessions.map((s) => ({
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
        workout: sw.workout,
      })),
      userRole: "COACH" as const,
    }));

    // Format client bookings as sessions
    const formattedClientSessions = clientBookings.map((b) => ({
      id: b.session.id,
      venueId: b.session.venueId,
      type: b.session.type,
      title: b.session.title,
      description: b.session.description,
      startsAt: b.session.startsAt.toISOString(),
      endsAt: b.session.endsAt.toISOString(),
      capacity: b.session.capacity,
      coachId: b.session.coachId,
      tags: b.session.tags,
      recurringSessionId: b.session.recurringSessionId,
      venue: b.session.venue,
      _count: b.session._count,
      bookings: [],
      workouts: b.session.sessionWorkouts.map((sw) => ({
        id: sw.id,
        workout: sw.workout,
      })),
      userRole: "CLIENT" as const,
      bookingId: b.id,
      bookingStatus: b.status,
    }));

    // Format events
    const formattedEvents = eventParticipations.map((p) => ({
      id: p.id,
      type: "EVENT" as const,
      title: p.event.title,
      eventSlug: p.event.slug,
      startsAt:
        p.variant?.startDate?.toISOString() || p.event.startDate.toISOString(),
      startTime: p.variant?.startTime || null,
      city: p.event.city,
      country: p.event.country,
      sportTypes: p.event.sportTypes,
      variantName: p.variant?.name || null,
      variantDistance: p.variant?.distanceKm || null,
      participationStatus: p.status,
      cancelled: p.event.cancelled,
      imageUrl: p.event.imageUrl || null,
      participantCount: p.event._count.participations,
    }));

    // Combine all schedule items
    const allItems = [
      ...formattedCoachSessions,
      ...formattedClientSessions,
      ...formattedEvents,
    ];

    // Get unique venues from professional memberships
    const memberships = await prisma.venueMember.findMany({
      where: {
        userId,
        status: "ACTIVE",
        role: { not: "CLIENT" },
      },
      select: {
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

    return NextResponse.json({
      sessions: formattedCoachSessions,
      clientSessions: formattedClientSessions,
      events: formattedEvents,
      allItems,
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
