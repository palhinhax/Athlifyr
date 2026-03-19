/**
 * Athli AI — User venue bookings
 */

import { prisma } from "@/lib/prisma";

export interface UserBookingsParams {
  period?: "today" | "week" | "upcoming" | "past";
}

/**
 * Get the user's booked venue sessions/classes.
 * Can filter by period: today, this week, upcoming, or past.
 */
export async function getUserBookings(
  userId: string,
  locale: string,
  period?: "today" | "week" | "upcoming" | "past"
): Promise<string> {
  const now = new Date();

  // Build date filters based on period
  const sessionWhere: Record<string, unknown> = {};

  if (period === "today") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    sessionWhere.startsAt = { gte: startOfDay, lte: endOfDay };
  } else if (period === "week") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    sessionWhere.startsAt = { gte: startOfDay, lte: endOfWeek };
  } else if (period === "past") {
    sessionWhere.startsAt = { lt: now };
  } else {
    // "upcoming" or default: from now onwards
    sessionWhere.startsAt = { gte: now };
  }

  const bookings = await prisma.venueBooking.findMany({
    where: {
      userId,
      status: { in: ["BOOKED", "ATTENDED"] },
      session: sessionWhere,
    },
    include: {
      session: {
        select: {
          id: true,
          title: true,
          type: true,
          description: true,
          startsAt: true,
          endsAt: true,
          capacity: true,
          tags: true,
        },
      },
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          sportTypes: true,
        },
      },
    },
    orderBy: {
      session: { startsAt: period === "past" ? "desc" : "asc" },
    },
    take: 20,
  });

  if (bookings.length === 0) {
    const periodMessages: Record<string, string> = {
      today: "You have no classes booked for today.",
      week: "You have no classes booked for this week.",
      past: "No past bookings found.",
      upcoming: "You have no upcoming classes booked.",
    };
    return periodMessages[period || "upcoming"] || "No bookings found.";
  }

  return JSON.stringify(
    bookings.map((b) => ({
      bookingId: b.id,
      status: b.status,
      bookingType: b.bookingType,
      session: {
        id: b.session.id,
        title: b.session.title,
        type: b.session.type,
        description: b.session.description?.substring(0, 150),
        startsAt: b.session.startsAt.toISOString(),
        endsAt: b.session.endsAt.toISOString(),
        date: b.session.startsAt.toISOString().split("T")[0],
        startTime: b.session.startsAt
          .toISOString()
          .split("T")[1]
          .substring(0, 5),
        endTime: b.session.endsAt.toISOString().split("T")[1].substring(0, 5),
        tags: b.session.tags,
      },
      venue: {
        id: b.venue.id,
        name: b.venue.name,
        slug: b.venue.slug,
        city: b.venue.city,
        sportTypes: b.venue.sportTypes,
        url: `/${locale}/v/${b.venue.slug}`,
      },
    }))
  );
}
