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
  // Fetch session and existing booking in parallel
  const [session, existingBooking] = await Promise.all([
    prisma.venueSession.findUnique({
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
    }),
    prisma.venueBooking.findFirst({
      where: {
        sessionId,
        userId,
      },
    }),
  ]);

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
        // Count linked and legacy bookings in parallel
        const includedVenues = await prisma.venuePlanVenue.findMany({
          where: { planId: sub.plan.id },
          select: { venueId: true },
        });
        const allVenueIds = [
          sub.plan.venueId,
          ...includedVenues.map((pv) => pv.venueId),
        ];

        const [linkedBookings, legacyBookings] = await Promise.all([
          prisma.venueBooking.count({
            where: {
              subscriptionId: sub.id,
              status: {
                in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
              },
            },
          }),
          prisma.venueBooking.count({
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
          }),
        ]);

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

  // Fetch direct subscriptions, session data, existing booking, and member status in parallel
  // These queries are independent and can run concurrently
  const [directSubscriptions, venueSession, existingBooking, venueMember] =
    await Promise.all([
      prisma.venueSubscription.findMany({
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
      }),
      prisma.venueSession.findUnique({
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
      }),
      prisma.venueBooking.findFirst({
        where: {
          sessionId,
          userId,
        },
      }),
      prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId,
          },
        },
      }),
    ]);

  // Early validation: check session exists and basic conditions
  if (!venueSession) {
    return {
      allowed: false,
      reason: "SESSION_NOT_FOUND",
    };
  }

  if (venueSession.startsAt <= now) {
    return {
      allowed: false,
      reason: "SESSION_ALREADY_STARTED",
    };
  }

  // Check if booking deadline has passed
  if (venueSession.bookingDeadlineMinutes > 0) {
    const minutesUntilSession = differenceInMinutes(venueSession.startsAt, now);
    if (minutesUntilSession <= venueSession.bookingDeadlineMinutes) {
      return {
        allowed: false,
        reason: "BOOKING_DEADLINE_PASSED",
      };
    }
  }

  if (existingBooking && existingBooking.status === BookingStatus.BOOKED) {
    return {
      allowed: false,
      reason: "ALREADY_BOOKED",
    };
  }

  if (venueSession.capacity !== null) {
    const currentBookings = venueSession.bookings.length;
    if (currentBookings >= venueSession.capacity) {
      return {
        allowed: false,
        reason: "SESSION_FULL",
      };
    }
  }

  // Find a usable subscription
  let subscription: SubscriptionWithPlan | null = null;

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
  // Member was already fetched in parallel above
  const isDirectSubscription = subscription.venueId === venueId;
  if (isDirectSubscription) {
    if (!venueMember) {
      return {
        allowed: false,
        reason: "NOT_A_MEMBER",
      };
    }

    if (venueMember.status !== MemberStatus.ACTIVE) {
      return {
        allowed: false,
        reason: "MEMBER_NOT_ACTIVE",
      };
    }
  }

  // 3. Apply plan policy (session and booking checks were already done above)
  const policy = (subscription.plan.policy as PlanPolicy) || {};

  // Check allowed service types
  if (
    policy.allowedServiceTypes &&
    policy.allowedServiceTypes.length > 0 &&
    !policy.allowedServiceTypes.includes(venueSession.type)
  ) {
    return {
      allowed: false,
      reason: "SERVICE_TYPE_NOT_ALLOWED",
    };
  }

  // Check allowed time window
  if (policy.allowedStartTimeFrom) {
    const sessionTime = format(venueSession.startsAt, "HH:mm");
    if (sessionTime < policy.allowedStartTimeFrom) {
      return {
        allowed: false,
        reason: "OUTSIDE_TIME_WINDOW",
      };
    }
  }

  if (policy.allowedStartTimeTo) {
    const sessionTime = format(venueSession.startsAt, "HH:mm");
    if (sessionTime > policy.allowedStartTimeTo) {
      return {
        allowed: false,
        reason: "OUTSIDE_TIME_WINDOW",
      };
    }
  }

  // Check allowed weekdays (number format: 0-6, Sunday=0)
  if (policy.allowedWeekdays && policy.allowedWeekdays.length > 0) {
    const sessionWeekday = venueSession.startsAt.getDay();
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
    const sessionDayName = dayNames[venueSession.startsAt.getDay()];
    if (!policy.allowedDays.includes(sessionDayName)) {
      return {
        allowed: false,
        reason: "WEEKDAY_NOT_ALLOWED",
      };
    }
  }

  // Run all booking count checks in parallel for better performance
  const countChecks: Array<{
    type: string;
    promise: Promise<number>;
    limit: number;
  }> = [];

  // Check max bookings per day
  if (policy.maxBookingsPerDay) {
    const dayStart = startOfDay(venueSession.startsAt);
    const dayEnd = endOfDay(venueSession.startsAt);

    countChecks.push({
      type: "MAX_BOOKINGS_PER_DAY_REACHED",
      limit: policy.maxBookingsPerDay,
      promise: prisma.venueBooking.count({
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
      }),
    });
  }

  // Check max bookings per week
  if (policy.maxBookingsPerWeek) {
    const weekStart = startOfWeek(venueSession.startsAt, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(venueSession.startsAt, { weekStartsOn: 1 });

    countChecks.push({
      type: "MAX_BOOKINGS_PER_WEEK_REACHED",
      limit: policy.maxBookingsPerWeek,
      promise: prisma.venueBooking.count({
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
      }),
    });
  }

  // Check max active bookings
  if (policy.maxActiveBookings) {
    countChecks.push({
      type: "MAX_ACTIVE_BOOKINGS_REACHED",
      limit: policy.maxActiveBookings,
      promise: prisma.venueBooking.count({
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
      }),
    });
  }

  // Check max bookings per month
  if (policy.maxBookingsPerMonth) {
    const policyMonthStart = startOfMonth(venueSession.startsAt);
    const policyMonthEnd = endOfMonth(venueSession.startsAt);

    countChecks.push({
      type: "MAX_BOOKINGS_PER_MONTH_REACHED",
      limit: policy.maxBookingsPerMonth,
      promise: prisma.venueBooking.count({
        where: {
          userId,
          venueId,
          status: {
            in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
          },
          session: {
            startsAt: {
              gte: policyMonthStart,
              lte: policyMonthEnd,
            },
          },
        },
      }),
    });
  }

  // Run all count checks in parallel
  if (countChecks.length > 0) {
    const results = await Promise.all(
      countChecks.map((check) => check.promise)
    );
    for (let i = 0; i < countChecks.length; i++) {
      if (results[i] >= countChecks[i].limit) {
        return {
          allowed: false,
          reason: countChecks[i].type,
        };
      }
    }
  }

  // Check max total bookings for entire subscription (drop-in, packs)
  if (policy.maxTotalBookings) {
    // Count linked and legacy bookings in parallel
    const includedVenues = await prisma.venuePlanVenue.findMany({
      where: { planId: subscription.plan.id },
      select: { venueId: true },
    });
    const allVenueIds = [
      subscription.plan.venueId,
      ...includedVenues.map((pv) => pv.venueId),
    ];

    const [linkedBookings, legacyBookings] = await Promise.all([
      prisma.venueBooking.count({
        where: {
          subscriptionId: subscription.id,
          status: {
            in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
          },
        },
      }),
      prisma.venueBooking.count({
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
      }),
    ]);

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
    const hoursUntilSession = differenceInHours(venueSession.startsAt, now);

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
  console.log("[validateCancellation] Starting validation", {
    userId,
    bookingId,
  });

  // Get booking with session and subscription details
  const booking = await prisma.venueBooking.findUnique({
    where: { id: bookingId },
    include: {
      session: true,
    },
  });

  if (!booking) {
    console.warn("[validateCancellation] Booking not found", { bookingId });
    return {
      allowed: false,
      reason: "BOOKING_NOT_FOUND",
    };
  }

  console.log("[validateCancellation] Booking details", {
    bookingId,
    bookingUserId: booking.userId,
    requestUserId: userId,
    status: booking.status,
    sessionStartsAt: booking.session.startsAt,
    venueId: booking.venueId,
  });

  // Check if booking belongs to user
  if (booking.userId !== userId) {
    console.warn("[validateCancellation] User is not booking owner", {
      bookingId,
      bookingUserId: booking.userId,
      requestUserId: userId,
    });
    return {
      allowed: false,
      reason: "NOT_BOOKING_OWNER",
    };
  }

  // Check if booking is already cancelled
  if (booking.status === BookingStatus.CANCELLED) {
    console.warn("[validateCancellation] Booking already cancelled", {
      bookingId,
      status: booking.status,
    });
    return {
      allowed: false,
      reason: "ALREADY_CANCELLED",
    };
  }

  // Check if session already happened
  if (booking.status === BookingStatus.ATTENDED) {
    console.warn("[validateCancellation] Session already attended", {
      bookingId,
      status: booking.status,
    });
    return {
      allowed: false,
      reason: "ALREADY_ATTENDED",
    };
  }

  // Check if session has already started
  const now = new Date();
  if (booking.session.startsAt < now) {
    console.warn("[validateCancellation] Session already started", {
      bookingId,
      sessionStartsAt: booking.session.startsAt,
      currentTime: now,
    });
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

  console.log("[validateCancellation] Subscription check", {
    bookingId,
    hasSubscription: !!subscription,
    subscriptionId: subscription?.id,
    planId: subscription?.plan?.id,
  });

  // If no subscription, allow cancellation (basic user)
  if (!subscription) {
    console.log(
      "[validateCancellation] No subscription - allowing cancellation",
      { bookingId }
    );
    return {
      allowed: true,
    };
  }

  // Apply plan cancellation policy
  const policy = (subscription.plan.policy as PlanPolicy) || {};

  console.log("[validateCancellation] Plan policy", {
    bookingId,
    planId: subscription.plan.id,
    allowCancellation: policy.allowCancellation,
    cancellationHours: policy.cancellationHours,
  });

  // Check if cancellation is allowed by plan
  if (policy.allowCancellation === false) {
    console.warn("[validateCancellation] Plan does not allow cancellation", {
      bookingId,
      planId: subscription.plan.id,
      planName: subscription.plan.name,
    });
    return {
      allowed: false,
      reason: "CANCELLATION_NOT_ALLOWED",
    };
  }

  // Check cancellation deadline
  if (policy.cancellationHours && policy.cancellationHours > 0) {
    const hoursUntilSession = differenceInHours(booking.session.startsAt, now);

    console.log("[validateCancellation] Checking cancellation deadline", {
      bookingId,
      sessionStartsAt: booking.session.startsAt,
      currentTime: now,
      hoursUntilSession,
      requiredHours: policy.cancellationHours,
    });

    if (hoursUntilSession < policy.cancellationHours) {
      console.warn("[validateCancellation] Cancellation deadline passed", {
        bookingId,
        hoursUntilSession,
        requiredHours: policy.cancellationHours,
      });
      return {
        allowed: false,
        reason: "CANCELLATION_DEADLINE_PASSED",
        minimumHours: policy.cancellationHours,
      };
    }
  }

  // All validations passed
  console.log("[validateCancellation] All validations passed", { bookingId });
  return {
    allowed: true,
  };
}
