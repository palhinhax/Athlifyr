/**
 * Athli AI — Session availability, booking, and details
 */

import { prisma } from "@/lib/prisma";

export interface AvailableSessionsParams {
  venueId?: string;
  date?: string; // YYYY-MM-DD
  period?: "today" | "tomorrow" | "week";
}

/**
 * Get available sessions at a venue (or user's venues) that can be booked.
 */
export async function getAvailableSessions(
  params: AvailableSessionsParams,
  userId: string,
  locale: string
): Promise<string> {
  const now = new Date();
  let startDate = new Date(now);
  let endDate = new Date(now);

  if (params.date) {
    startDate = new Date(params.date);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(params.date);
    endDate.setHours(23, 59, 59, 999);
  } else if (params.period === "tomorrow") {
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
  } else if (params.period === "week") {
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Default: today
    endDate.setHours(23, 59, 59, 999);
  }

  // Ensure we don't show past sessions
  if (startDate < now) {
    startDate = now;
  }

  const sessionWhere: Record<string, unknown> = {
    startsAt: { gte: startDate, lte: endDate },
  };

  if (params.venueId) {
    sessionWhere.venueId = params.venueId;
  } else {
    // Get venues the user is a member of
    const memberships = await prisma.venueMember.findMany({
      where: { userId, status: "ACTIVE" },
      select: { venueId: true },
    });
    if (memberships.length === 0) {
      return "You are not a member of any venue. Search for venues first using search_venues.";
    }
    sessionWhere.venueId = { in: memberships.map((m) => m.venueId) };
  }

  const sessions = await prisma.venueSession.findMany({
    where: sessionWhere,
    include: {
      venue: {
        select: { id: true, name: true, slug: true },
      },
      bookings: {
        where: {
          status: { in: ["BOOKED", "ATTENDED"] },
        },
        select: { id: true, userId: true },
      },
    },
    orderBy: { startsAt: "asc" },
    take: 30,
  });

  if (sessions.length === 0) {
    return "No available sessions found for the specified period.";
  }

  return JSON.stringify(
    sessions.map((s) => {
      const bookedCount = s.bookings.length;
      const spotsLeft = s.capacity ? s.capacity - bookedCount : null;
      const userBooked = s.bookings.some((b) => b.userId === userId);

      return {
        sessionId: s.id,
        title: s.title,
        type: s.type,
        description: s.description?.substring(0, 150),
        date: s.startsAt.toISOString().split("T")[0],
        startTime: s.startsAt.toISOString().split("T")[1].substring(0, 5),
        endTime: s.endsAt.toISOString().split("T")[1].substring(0, 5),
        startsAt: s.startsAt.toISOString(),
        capacity: s.capacity,
        spotsLeft,
        isFull: spotsLeft !== null && spotsLeft <= 0,
        userAlreadyBooked: userBooked,
        tags: s.tags,
        venue: {
          id: s.venue.id,
          name: s.venue.name,
          url: `/${locale}/v/${s.venue.slug}`,
        },
      };
    })
  );
}

/**
 * Book the user into a specific session at a venue.
 */
export async function bookSession(
  sessionId: string,
  userId: string,
  locale: string
): Promise<string> {
  // 1. Find the session with venue and existing bookings
  const session = await prisma.venueSession.findUnique({
    where: { id: sessionId },
    include: {
      venue: {
        select: { id: true, name: true, slug: true, requiresPlanToBook: true },
      },
      bookings: {
        where: {
          status: { in: ["BOOKED", "ATTENDED"] },
        },
        select: { id: true, userId: true },
      },
    },
  });

  if (!session) {
    return JSON.stringify({ success: false, error: "Session not found." });
  }

  // 2. Check if session has already started
  if (session.startsAt <= new Date()) {
    return JSON.stringify({
      success: false,
      error: "This session has already started. Cannot book past sessions.",
    });
  }

  // 3. Check capacity
  if (session.capacity && session.bookings.length >= session.capacity) {
    return JSON.stringify({
      success: false,
      error: "This session is full. No spots available.",
    });
  }

  // 4. Check if user already booked
  const existingBooking = await prisma.venueBooking.findFirst({
    where: { sessionId, userId },
  });

  if (existingBooking?.status === "BOOKED") {
    return JSON.stringify({
      success: false,
      error: "You are already booked for this session.",
    });
  }

  // 5. Check if venue requires a plan — if so, find active subscription
  let subscriptionId: string | null = null;

  if (session.venue.requiresPlanToBook) {
    const subscription = await prisma.venueSubscription.findFirst({
      where: {
        userId,
        venueId: session.venue.id,
        status: "ACTIVE",
        paymentStatus: "PAID",
      },
      select: { id: true },
    });

    if (!subscription) {
      return JSON.stringify({
        success: false,
        error:
          "This venue requires an active plan/subscription to book sessions. You don't have an active subscription.",
        venueUrl: `/${locale}/v/${session.venue.slug}`,
      });
    }

    subscriptionId = subscription.id;
  }

  // 6. Create or reactivate booking
  let booking;
  if (existingBooking) {
    booking = await prisma.venueBooking.update({
      where: { id: existingBooking.id },
      data: {
        status: "BOOKED",
        subscriptionId,
      },
    });
  } else {
    booking = await prisma.venueBooking.create({
      data: {
        venueId: session.venue.id,
        sessionId,
        userId,
        status: "BOOKED",
        subscriptionId,
      },
    });
  }

  return JSON.stringify({
    success: true,
    bookingId: booking.id,
    session: {
      title: session.title,
      date: session.startsAt.toISOString().split("T")[0],
      startTime: session.startsAt.toISOString().split("T")[1].substring(0, 5),
      endTime: session.endsAt.toISOString().split("T")[1].substring(0, 5),
    },
    venue: {
      name: session.venue.name,
      url: `/${locale}/v/${session.venue.slug}`,
    },
  });
}

/**
 * Get detailed info about a specific session: coach, workout, spots.
 */
export async function getSessionDetails(
  sessionId: string,
  locale: string
): Promise<string> {
  const session = await prisma.venueSession.findUnique({
    where: { id: sessionId },
    include: {
      venue: {
        select: { id: true, name: true, slug: true },
      },
      bookings: {
        where: {
          status: { in: ["BOOKED", "ATTENDED"] },
        },
        select: { id: true },
      },
      sessionWorkouts: {
        include: {
          workout: {
            include: {
              blocks: {
                include: {
                  exercises: {
                    include: {
                      exercise: {
                        select: { name: true, category: true },
                      },
                    },
                    orderBy: { orderIndex: "asc" },
                  },
                },
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    return "Session not found.";
  }

  // Get coach name if coachId is set
  let coachName: string | null = null;
  if (session.coachId) {
    const coach = await prisma.user.findUnique({
      where: { id: session.coachId },
      select: { name: true },
    });
    coachName = coach?.name || null;
  }

  const bookedCount = session.bookings.length;
  const spotsLeft = session.capacity ? session.capacity - bookedCount : null;

  // Format workouts
  const workouts = session.sessionWorkouts.map((sw) => ({
    name: sw.workout.name,
    description: sw.workout.description,
    notes: sw.notes,
    blocks: sw.workout.blocks.map((b) => ({
      type: b.type,
      name: b.name,
      rounds: b.rounds,
      timeCap: b.timeCap,
      exercises: b.exercises.map((e) => ({
        name: e.exercise.name,
        category: e.exercise.category,
        reps: e.prescribedReps,
        sets: e.prescribedSets,
        weight: e.prescribedWeight,
        distance: e.prescribedDistance,
        time: e.prescribedTime,
      })),
    })),
  }));

  return JSON.stringify({
    id: session.id,
    title: session.title,
    type: session.type,
    description: session.description,
    date: session.startsAt.toISOString().split("T")[0],
    startTime: session.startsAt.toISOString().split("T")[1].substring(0, 5),
    endTime: session.endsAt.toISOString().split("T")[1].substring(0, 5),
    capacity: session.capacity,
    bookedCount,
    spotsLeft,
    coach: coachName,
    tags: session.tags,
    workouts: workouts.length > 0 ? workouts : null,
    venue: {
      id: session.venue.id,
      name: session.venue.name,
      url: `/${locale}/v/${session.venue.slug}`,
    },
  });
}
