import { prisma } from "@/lib/prisma";
import { MemberStatus, BookingStatus } from "@prisma/client";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format } from "date-fns";

export interface PlanPolicy {
  maxBookingsPerDay?: number;
  maxBookingsPerWeek?: number;
  maxActiveBookings?: number;
  allowedStartTimeFrom?: string; // "HH:mm" format
  allowedStartTimeTo?: string; // "HH:mm" format
  allowedWeekdays?: number[]; // 0-6 (Sunday=0)
  allowedServiceTypes?: string[]; // ["CLASS", "APPOINTMENT"]
  requiresApproval?: boolean;
}

export interface BookingValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates if a user can book a session based on their subscription plan policy
 */
export async function validateBooking(
  userId: string,
  venueId: string,
  sessionId: string
): Promise<BookingValidationResult> {
  // 1. Check if user is an active member
  const member = await prisma.venueMember.findUnique({
    where: {
      venueId_userId: {
        venueId,
        userId,
      },
    },
  });

  if (!member) {
    return {
      allowed: false,
      reason: "NOT_A_MEMBER",
    };
  }

  if (member.status !== MemberStatus.ACTIVE) {
    return {
      allowed: false,
      reason: "MEMBER_NOT_ACTIVE",
    };
  }

  // 2. Check if user has an active subscription with payment confirmed
  const subscription = await prisma.venueSubscription.findFirst({
    where: {
      venueId,
      userId,
      status: "ACTIVE",
      paymentStatus: "PAID", // Must be paid to book
    },
    include: {
      plan: true,
    },
  });

  if (!subscription) {
    return {
      allowed: false,
      reason: "NO_ACTIVE_SUBSCRIPTION",
    };
  }

  // 3. Get session details
  const session = await prisma.venueSession.findUnique({
    where: { id: sessionId },
    include: {
      bookings: {
        where: {
          status: {
            in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
          },
        },
      },
    },
  });

  if (!session) {
    return {
      allowed: false,
      reason: "SESSION_NOT_FOUND",
    };
  }

  // 4. Check if already booked
  const existingBooking = await prisma.venueBooking.findUnique({
    where: {
      sessionId_userId: {
        sessionId,
        userId,
      },
    },
  });

  if (existingBooking && existingBooking.status === BookingStatus.BOOKED) {
    return {
      allowed: false,
      reason: "ALREADY_BOOKED",
    };
  }

  // 5. Check capacity (for classes)
  if (session.capacity !== null) {
    const currentBookings = session.bookings.length;
    if (currentBookings >= session.capacity) {
      return {
        allowed: false,
        reason: "SESSION_FULL",
      };
    }
  }

  // 6. Apply plan policy
  const policy = (subscription.plan.policy as PlanPolicy) || {};

  // Check allowed service types
  if (
    policy.allowedServiceTypes &&
    policy.allowedServiceTypes.length > 0 &&
    !policy.allowedServiceTypes.includes(session.type)
  ) {
    return {
      allowed: false,
      reason: "SERVICE_TYPE_NOT_ALLOWED",
    };
  }

  // Check allowed time window
  if (policy.allowedStartTimeFrom) {
    const sessionTime = format(session.startsAt, "HH:mm");
    if (sessionTime < policy.allowedStartTimeFrom) {
      return {
        allowed: false,
        reason: "OUTSIDE_TIME_WINDOW",
      };
    }
  }

  if (policy.allowedStartTimeTo) {
    const sessionTime = format(session.startsAt, "HH:mm");
    if (sessionTime > policy.allowedStartTimeTo) {
      return {
        allowed: false,
        reason: "OUTSIDE_TIME_WINDOW",
      };
    }
  }

  // Check allowed weekdays
  if (policy.allowedWeekdays && policy.allowedWeekdays.length > 0) {
    const sessionWeekday = session.startsAt.getDay();
    if (!policy.allowedWeekdays.includes(sessionWeekday)) {
      return {
        allowed: false,
        reason: "WEEKDAY_NOT_ALLOWED",
      };
    }
  }

  // Check max bookings per day
  if (policy.maxBookingsPerDay) {
    const dayStart = startOfDay(session.startsAt);
    const dayEnd = endOfDay(session.startsAt);

    const bookingsToday = await prisma.venueBooking.count({
      where: {
        userId,
        venueId,
        status: {
          in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
        },
        session: {
          startsAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      },
    });

    if (bookingsToday >= policy.maxBookingsPerDay) {
      return {
        allowed: false,
        reason: "MAX_BOOKINGS_PER_DAY_REACHED",
      };
    }
  }

  // Check max bookings per week
  if (policy.maxBookingsPerWeek) {
    const weekStart = startOfWeek(session.startsAt, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(session.startsAt, { weekStartsOn: 1 });

    const bookingsThisWeek = await prisma.venueBooking.count({
      where: {
        userId,
        venueId,
        status: {
          in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
        },
        session: {
          startsAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      },
    });

    if (bookingsThisWeek >= policy.maxBookingsPerWeek) {
      return {
        allowed: false,
        reason: "MAX_BOOKINGS_PER_WEEK_REACHED",
      };
    }
  }

  // Check max active bookings
  if (policy.maxActiveBookings) {
    const activeBookings = await prisma.venueBooking.count({
      where: {
        userId,
        venueId,
        status: BookingStatus.BOOKED,
        session: {
          startsAt: {
            gte: new Date(),
          },
        },
      },
    });

    if (activeBookings >= policy.maxActiveBookings) {
      return {
        allowed: false,
        reason: "MAX_ACTIVE_BOOKINGS_REACHED",
      };
    }
  }

  // All validations passed
  return {
    allowed: true,
  };
}
