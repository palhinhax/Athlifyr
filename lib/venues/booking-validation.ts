import { prisma } from "@/lib/prisma";
import { MemberStatus, BookingStatus } from "@prisma/client";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

export interface PlanPolicy {
  // Access Limits
  maxBookingsPerDay?: number;
  maxBookingsPerWeek?: number;
  maxBookingsPerMonth?: number;
  maxTotalBookings?: number; // Total bookings allowed for entire subscription (drop-in, packs)
  maxActiveBookings?: number;

  // Time Restrictions
  allowedStartTimeFrom?: string; // "HH:mm" format
  allowedStartTimeTo?: string; // "HH:mm" format
  allowedWeekdays?: number[]; // 0-6 (Sunday=0)
  allowedDays?: string[]; // ["MONDAY", "TUESDAY", ...] - alternative format
  allowedServiceTypes?: string[]; // ["CLASS", "APPOINTMENT"]

  // Advance booking restrictions
  requiresAdvanceBooking?: boolean; // Must book X hours in advance
  advanceBookingHours?: number; // e.g., 24 hours minimum before session

  // Cancellation policy
  allowCancellation?: boolean; // Whether cancellation is allowed
  cancellationHours?: number; // Must cancel X hours before session

  // Other
  requiresApproval?: boolean;
}

export interface BookingValidationResult {
  allowed: boolean;
  reason?: string;
  minimumHours?: number; // For advance booking requirement
  subscriptionId?: string; // The subscription that authorized this booking
}

export interface CancellationValidationResult {
  allowed: boolean;
  reason?: string;
  minimumHours?: number; // For cancellation deadline
}

/**
 * Validates basic booking conditions (capacity, session exists, not already booked)
 * Used when venue doesn't require a plan to book
 */
export async function validateBasicBooking(
  userId: string,
  venueId: string,
  sessionId: string
): Promise<BookingValidationResult> {
  // 1. Get session details
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

  // 1.1 Check if session has already started (cannot book past sessions)
  if (session.startsAt <= new Date()) {
    return {
      allowed: false,
      reason: "SESSION_ALREADY_STARTED",
    };
  }

  // 1.2 Check if booking deadline has passed
  if (session.bookingDeadlineMinutes > 0) {
    const now = new Date();
    const minutesUntilSession = differenceInMinutes(session.startsAt, now);
    if (minutesUntilSession <= session.bookingDeadlineMinutes) {
      return {
        allowed: false,
        reason: "BOOKING_DEADLINE_PASSED",
      };
    }
  }

  // 2. Check if already booked by this user
  const existingBooking = await prisma.venueBooking.findFirst({
    where: {
      sessionId,
      userId,
    },
  });

  if (existingBooking && existingBooking.status === BookingStatus.BOOKED) {
    return {
      allowed: false,
      reason: "ALREADY_BOOKED",
    };
  }

  // 3. Check capacity (for classes)
  if (session.capacity !== null) {
    const currentBookings = session.bookings.length;
    if (currentBookings >= session.capacity) {
      return {
        allowed: false,
        reason: "SESSION_FULL",
      };
    }
  }

  return {
    allowed: true,
  };
}

/**
 * Validates if a user can book a session based on their subscription plan policy
 */
export async function validateBooking(
  userId: string,
  venueId: string,
  sessionId: string
): Promise<BookingValidationResult> {
  // First, check if venue requires plan to book
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    select: { requiresPlanToBook: true },
  });

  // If venue doesn't require plan, just do basic validation
  if (venue && !venue.requiresPlanToBook) {
    return validateBasicBooking(userId, venueId, sessionId);
  }

  // 1. Check if user has an active subscription (direct or cross-venue)
  // The subscription must have already started (startsAt <= now) and not expired (endsAt is null or > now)
  const now = new Date();

  // Helper: find a usable subscription from a list
  // Prefers non-exhausted subscriptions, but returns an exhausted one as fallback
  // so that the specific MAX_TOTAL_BOOKINGS_REACHED error can be returned
  type SubscriptionWithPlan = Awaited<
    ReturnType<
      typeof prisma.venueSubscription.findMany<{ include: { plan: true } }>
    >
  >[number];

  const findUsableSubscription = async (
    subscriptions: SubscriptionWithPlan[]
  ) => {
    let exhaustedFallback: SubscriptionWithPlan | null = null;

    for (const sub of subscriptions) {
      if (!sub) continue;
      const subPolicy = (sub.plan.policy as PlanPolicy) || {};
      if (subPolicy.maxTotalBookings) {
        // Count bookings explicitly linked to this subscription
        const linkedBookings = await prisma.venueBooking.count({
          where: {
            subscriptionId: sub.id,
            status: {
              in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
            },
          },
        });

        // Also count legacy bookings (subscriptionId is null) within
        // this subscription's time window across all covered venues
        const includedVenues = await prisma.venuePlanVenue.findMany({
          where: { planId: sub.plan.id },
          select: { venueId: true },
        });
        const allVenueIds = [
          sub.plan.venueId,
          ...includedVenues.map((pv) => pv.venueId),
        ];

        const legacyBookings = await prisma.venueBooking.count({
          where: {
            userId,
            subscriptionId: null,
            venueId: { in: allVenueIds },
            status: {
              in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
            },
            createdAt: {
              gte: sub.createdAt,
              ...(sub.endsAt ? { lte: sub.endsAt } : {}),
            },
          },
        });

        const totalBookings = linkedBookings + legacyBookings;

        if (totalBookings >= subPolicy.maxTotalBookings) {
          // This pack is exhausted, keep as fallback but try the next one
          if (!exhaustedFallback) {
            exhaustedFallback = sub;
          }
          continue;
        }
      }
      return sub;
    }
    // Return exhausted subscription as fallback so MAX_TOTAL_BOOKINGS_REACHED can be reported
    return exhaustedFallback;
  };

  // First, check direct subscriptions to this venue
  let subscription: SubscriptionWithPlan | null = null;

  const directSubscriptions = await prisma.venueSubscription.findMany({
    where: {
      venueId,
      userId,
      status: "ACTIVE",
      startsAt: {
        lte: now, // Subscription must have already started
      },
      OR: [
        { endsAt: null }, // No end date
        { endsAt: { gt: now } }, // Or end date is in the future
      ],
    },
    include: {
      plan: true,
    },
    orderBy: { createdAt: "desc" }, // Newest first (most recent purchase)
  });

  subscription = await findUsableSubscription(directSubscriptions);

  // If no usable direct subscription, check if user has a subscription to a plan that includes this venue
  if (!subscription) {
    // Find plans that include this venue
    const plansIncludingVenue = await prisma.venuePlanVenue.findMany({
      where: {
        venueId,
      },
      select: {
        planId: true,
      },
    });

    if (plansIncludingVenue.length > 0) {
      const indirectSubscriptions = await prisma.venueSubscription.findMany({
        where: {
          userId,
          status: "ACTIVE",
          planId: {
            in: plansIncludingVenue.map((p) => p.planId),
          },
          startsAt: {
            lte: now, // Subscription must have already started
          },
          OR: [
            { endsAt: null }, // No end date
            { endsAt: { gt: now } }, // Or end date is in the future
          ],
        },
        include: {
          plan: true,
        },
        orderBy: { createdAt: "desc" },
      });

      subscription = await findUsableSubscription(indirectSubscriptions);
    }
  }

  if (!subscription) {
    return {
      allowed: false,
      reason: "NO_ACTIVE_SUBSCRIPTION",
    };
  }

  // 2. For direct subscriptions (same venue), verify membership
  // Cross-venue subscriptions (plan from another venue that includes this one) skip membership check
  const isDirectSubscription = subscription.venueId === venueId;
  if (isDirectSubscription) {
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

  // 3.1 Check if session has already started (cannot book past sessions)
  if (session.startsAt <= now) {
    return {
      allowed: false,
      reason: "SESSION_ALREADY_STARTED",
    };
  }

  // 4. Check if already booked
  const existingBooking = await prisma.venueBooking.findFirst({
    where: {
      sessionId,
      userId,
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

  // Check allowed weekdays (number format: 0-6, Sunday=0)
  if (policy.allowedWeekdays && policy.allowedWeekdays.length > 0) {
    const sessionWeekday = session.startsAt.getDay();
    if (!policy.allowedWeekdays.includes(sessionWeekday)) {
      return {
        allowed: false,
        reason: "WEEKDAY_NOT_ALLOWED",
      };
    }
  }

  // Check allowed days (string format: ["MONDAY", "TUESDAY", ...])
  if (policy.allowedDays && policy.allowedDays.length > 0) {
    const dayNames = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const sessionDayName = dayNames[session.startsAt.getDay()];
    if (!policy.allowedDays.includes(sessionDayName)) {
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

  // Check max bookings per month
  if (policy.maxBookingsPerMonth) {
    const monthStart = startOfMonth(session.startsAt);
    const monthEnd = endOfMonth(session.startsAt);

    const bookingsThisMonth = await prisma.venueBooking.count({
      where: {
        userId,
        venueId,
        status: {
          in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
        },
        session: {
          startsAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      },
    });

    if (bookingsThisMonth >= policy.maxBookingsPerMonth) {
      return {
        allowed: false,
        reason: "MAX_BOOKINGS_PER_MONTH_REACHED",
      };
    }
  }

  // Check max total bookings for entire subscription (drop-in, packs)
  if (policy.maxTotalBookings) {
    // Count bookings explicitly linked to this subscription
    const linkedBookings = await prisma.venueBooking.count({
      where: {
        subscriptionId: subscription.id,
        status: {
          in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
        },
      },
    });

    // Also count legacy bookings (subscriptionId is null) within
    // this subscription's time window across all covered venues
    const includedVenues = await prisma.venuePlanVenue.findMany({
      where: { planId: subscription.plan.id },
      select: { venueId: true },
    });
    const allVenueIds = [
      subscription.plan.venueId,
      ...includedVenues.map((pv) => pv.venueId),
    ];

    const legacyBookings = await prisma.venueBooking.count({
      where: {
        userId,
        subscriptionId: null,
        venueId: { in: allVenueIds },
        status: {
          in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
        },
        createdAt: {
          gte: subscription.createdAt,
          ...(subscription.endsAt ? { lte: subscription.endsAt } : {}),
        },
      },
    });

    const totalBookings = linkedBookings + legacyBookings;

    if (totalBookings >= policy.maxTotalBookings) {
      return {
        allowed: false,
        reason: "MAX_TOTAL_BOOKINGS_REACHED",
      };
    }
  }

  // Check advance booking requirement
  if (policy.requiresAdvanceBooking && policy.advanceBookingHours) {
    const now = new Date();
    const hoursUntilSession = differenceInHours(session.startsAt, now);

    if (hoursUntilSession < policy.advanceBookingHours) {
      return {
        allowed: false,
        reason: "ADVANCE_BOOKING_REQUIRED",
        minimumHours: policy.advanceBookingHours,
      } as BookingValidationResult;
    }
  }

  // All validations passed
  return {
    allowed: true,
    subscriptionId: subscription.id,
  };
}

/**
 * Validates if a user can cancel a booking based on their subscription plan policy
 */
export async function validateCancellation(
  userId: string,
  bookingId: string
): Promise<CancellationValidationResult> {
  // Get booking with session and subscription details
  const booking = await prisma.venueBooking.findUnique({
    where: { id: bookingId },
    include: {
      session: true,
    },
  });

  if (!booking) {
    return {
      allowed: false,
      reason: "BOOKING_NOT_FOUND",
    };
  }

  // Check if booking belongs to user
  if (booking.userId !== userId) {
    return {
      allowed: false,
      reason: "NOT_BOOKING_OWNER",
    };
  }

  // Check if booking is already cancelled
  if (booking.status === BookingStatus.CANCELLED) {
    return {
      allowed: false,
      reason: "ALREADY_CANCELLED",
    };
  }

  // Check if session already happened
  if (booking.status === BookingStatus.ATTENDED) {
    return {
      allowed: false,
      reason: "ALREADY_ATTENDED",
    };
  }

  // Check if session has already started
  if (booking.session.startsAt < new Date()) {
    return {
      allowed: false,
      reason: "SESSION_ALREADY_STARTED",
    };
  }

  // Get user's active subscription to check cancellation policy
  const subscription = await prisma.venueSubscription.findFirst({
    where: {
      venueId: booking.venueId,
      userId,
      status: "ACTIVE",
    },
    include: {
      plan: true,
    },
  });

  // If no subscription, allow cancellation (basic user)
  if (!subscription) {
    return {
      allowed: true,
    };
  }

  // Apply plan cancellation policy
  const policy = (subscription.plan.policy as PlanPolicy) || {};

  // Check if cancellation is allowed by plan
  if (policy.allowCancellation === false) {
    return {
      allowed: false,
      reason: "CANCELLATION_NOT_ALLOWED",
    };
  }

  // Check cancellation deadline
  if (policy.cancellationHours && policy.cancellationHours > 0) {
    const now = new Date();
    const hoursUntilSession = differenceInHours(booking.session.startsAt, now);

    if (hoursUntilSession < policy.cancellationHours) {
      return {
        allowed: false,
        reason: "CANCELLATION_DEADLINE_PASSED",
        minimumHours: policy.cancellationHours,
      };
    }
  }

  // All validations passed
  return {
    allowed: true,
  };
}
