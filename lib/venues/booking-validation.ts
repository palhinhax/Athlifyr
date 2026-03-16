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
  minimumMinutes?: number; // For cancellation deadline (from session)
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

// ─── Booking validation helpers ─────────────────────────────────────────────

type SubscriptionWithPlan = Awaited<
  ReturnType<
    typeof prisma.venueSubscription.findMany<{ include: { plan: true } }>
  >
>[number];

/** Find a usable subscription from a list, preferring non-exhausted ones. */
async function findUsableSubscription(
  subscriptions: SubscriptionWithPlan[],
  userId: string
): Promise<SubscriptionWithPlan | null> {
  let exhaustedFallback: SubscriptionWithPlan | null = null;

  for (const sub of subscriptions) {
    if (!sub) continue;
    const subPolicy = (sub.plan.policy as PlanPolicy) || {};
    if (subPolicy.maxTotalBookings) {
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
            status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
          },
        }),
        prisma.venueBooking.count({
          where: {
            userId,
            subscriptionId: null,
            venueId: { in: allVenueIds },
            status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
            createdAt: {
              gte: sub.createdAt,
              ...(sub.endsAt ? { lte: sub.endsAt } : {}),
            },
          },
        }),
      ]);

      if (linkedBookings + legacyBookings >= subPolicy.maxTotalBookings) {
        if (!exhaustedFallback) exhaustedFallback = sub;
        continue;
      }
    }
    return sub;
  }
  return exhaustedFallback;
}

/** Try direct subscriptions first, then cross-venue (indirect) subscriptions. */
async function findActiveSubscription(
  directSubscriptions: SubscriptionWithPlan[],
  userId: string,
  venueId: string,
  now: Date
): Promise<SubscriptionWithPlan | null> {
  const subscription = await findUsableSubscription(
    directSubscriptions,
    userId
  );
  if (subscription) return subscription;

  const plansIncludingVenue = await prisma.venuePlanVenue.findMany({
    where: { venueId },
    select: { planId: true },
  });
  if (plansIncludingVenue.length === 0) return null;

  const indirectSubscriptions = await prisma.venueSubscription.findMany({
    where: {
      userId,
      status: "ACTIVE",
      planId: { in: plansIncludingVenue.map((p) => p.planId) },
      startsAt: { lte: now },
      OR: [{ endsAt: null }, { endsAt: { gt: now } }],
    },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  return findUsableSubscription(indirectSubscriptions, userId);
}

/** Validate plan policy constraints (service type, time window, weekdays). */
function validatePolicyConstraints(
  policy: PlanPolicy,
  venueSession: { startsAt: Date; type: string }
): BookingValidationResult | null {
  if (
    policy.allowedServiceTypes &&
    policy.allowedServiceTypes.length > 0 &&
    !policy.allowedServiceTypes.includes(venueSession.type)
  ) {
    return { allowed: false, reason: "SERVICE_TYPE_NOT_ALLOWED" };
  }

  const sessionTime = format(venueSession.startsAt, "HH:mm");

  if (
    policy.allowedStartTimeFrom &&
    sessionTime < policy.allowedStartTimeFrom
  ) {
    return { allowed: false, reason: "OUTSIDE_TIME_WINDOW" };
  }
  if (policy.allowedStartTimeTo && sessionTime > policy.allowedStartTimeTo) {
    return { allowed: false, reason: "OUTSIDE_TIME_WINDOW" };
  }

  const sessionWeekday = venueSession.startsAt.getDay();

  if (
    policy.allowedWeekdays &&
    policy.allowedWeekdays.length > 0 &&
    !policy.allowedWeekdays.includes(sessionWeekday)
  ) {
    return { allowed: false, reason: "WEEKDAY_NOT_ALLOWED" };
  }

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
    if (!policy.allowedDays.includes(dayNames[sessionWeekday])) {
      return { allowed: false, reason: "WEEKDAY_NOT_ALLOWED" };
    }
  }

  return null;
}

async function executeCountChecks(
  countChecks: Array<{
    type: string;
    promise: Promise<number>;
    limit: number;
  }>
): Promise<BookingValidationResult | null> {
  if (countChecks.length === 0) return null;
  const results = await Promise.all(countChecks.map((check) => check.promise));
  for (let i = 0; i < countChecks.length; i++) {
    if (results[i] >= countChecks[i].limit) {
      return { allowed: false, reason: countChecks[i].type };
    }
  }
  return null;
}

/** Validate all booking count limits + total bookings + advance booking. */
async function validateBookingLimits(
  policy: PlanPolicy,
  userId: string,
  venueId: string,
  venueSession: { startsAt: Date },
  subscription: SubscriptionWithPlan,
  now: Date
): Promise<BookingValidationResult | null> {
  const countChecks: Array<{
    type: string;
    promise: Promise<number>;
    limit: number;
  }> = [];

  if (policy.maxBookingsPerDay) {
    countChecks.push({
      type: "MAX_BOOKINGS_PER_DAY_REACHED",
      limit: policy.maxBookingsPerDay,
      promise: prisma.venueBooking.count({
        where: {
          userId,
          venueId,
          status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
          session: {
            startsAt: {
              gte: startOfDay(venueSession.startsAt),
              lte: endOfDay(venueSession.startsAt),
            },
          },
        },
      }),
    });
  }

  if (policy.maxBookingsPerWeek) {
    countChecks.push({
      type: "MAX_BOOKINGS_PER_WEEK_REACHED",
      limit: policy.maxBookingsPerWeek,
      promise: prisma.venueBooking.count({
        where: {
          userId,
          venueId,
          status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
          session: {
            startsAt: {
              gte: startOfWeek(venueSession.startsAt, { weekStartsOn: 1 }),
              lte: endOfWeek(venueSession.startsAt, { weekStartsOn: 1 }),
            },
          },
        },
      }),
    });
  }

  if (policy.maxActiveBookings) {
    countChecks.push({
      type: "MAX_ACTIVE_BOOKINGS_REACHED",
      limit: policy.maxActiveBookings,
      promise: prisma.venueBooking.count({
        where: {
          userId,
          venueId,
          status: BookingStatus.BOOKED,
          session: { startsAt: { gte: new Date() } },
        },
      }),
    });
  }

  if (policy.maxBookingsPerMonth) {
    countChecks.push({
      type: "MAX_BOOKINGS_PER_MONTH_REACHED",
      limit: policy.maxBookingsPerMonth,
      promise: prisma.venueBooking.count({
        where: {
          userId,
          venueId,
          status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
          session: {
            startsAt: {
              gte: startOfMonth(venueSession.startsAt),
              lte: endOfMonth(venueSession.startsAt),
            },
          },
        },
      }),
    });
  }

  const countResult = await executeCountChecks(countChecks);
  if (countResult) return countResult;

  if (policy.maxTotalBookings) {
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
          status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
        },
      }),
      prisma.venueBooking.count({
        where: {
          userId,
          subscriptionId: null,
          venueId: { in: allVenueIds },
          status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
          createdAt: {
            gte: subscription.createdAt,
            ...(subscription.endsAt ? { lte: subscription.endsAt } : {}),
          },
        },
      }),
    ]);

    if (linkedBookings + legacyBookings >= policy.maxTotalBookings) {
      return { allowed: false, reason: "MAX_TOTAL_BOOKINGS_REACHED" };
    }
  }

  if (policy.requiresAdvanceBooking && policy.advanceBookingHours) {
    const hoursUntilSession = differenceInHours(venueSession.startsAt, now);
    if (hoursUntilSession < policy.advanceBookingHours) {
      return {
        allowed: false,
        reason: "ADVANCE_BOOKING_REQUIRED",
        minimumHours: policy.advanceBookingHours,
      };
    }
  }

  return null;
}

/**
 * Validates if a user can book a session based on their subscription plan policy
 */
export async function validateBooking(
  userId: string,
  venueId: string,
  sessionId: string
): Promise<BookingValidationResult> {
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    select: { requiresPlanToBook: true },
  });

  if (venue && !venue.requiresPlanToBook) {
    return validateBasicBooking(userId, venueId, sessionId);
  }

  const now = new Date();

  // Fetch direct subscriptions, session data, existing booking, and member status in parallel
  const [directSubscriptions, venueSession, existingBooking, venueMember] =
    await Promise.all([
      prisma.venueSubscription.findMany({
        where: {
          venueId,
          userId,
          status: "ACTIVE",
          startsAt: { lte: now },
          OR: [{ endsAt: null }, { endsAt: { gt: now } }],
        },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.venueSession.findUnique({
        where: { id: sessionId },
        include: {
          bookings: {
            where: {
              status: { in: [BookingStatus.BOOKED, BookingStatus.ATTENDED] },
            },
          },
        },
      }),
      prisma.venueBooking.findFirst({
        where: { sessionId, userId },
      }),
      prisma.venueMember.findUnique({
        where: { venueId_userId: { venueId, userId } },
      }),
    ]);

  // Session pre-conditions
  if (!venueSession) {
    return { allowed: false, reason: "SESSION_NOT_FOUND" };
  }
  if (venueSession.startsAt <= now) {
    return { allowed: false, reason: "SESSION_ALREADY_STARTED" };
  }
  if (venueSession.bookingDeadlineMinutes > 0) {
    const minutesUntilSession = differenceInMinutes(venueSession.startsAt, now);
    if (minutesUntilSession <= venueSession.bookingDeadlineMinutes) {
      return { allowed: false, reason: "BOOKING_DEADLINE_PASSED" };
    }
  }
  if (existingBooking && existingBooking.status === BookingStatus.BOOKED) {
    return { allowed: false, reason: "ALREADY_BOOKED" };
  }
  if (
    venueSession.capacity !== null &&
    venueSession.bookings.length >= venueSession.capacity
  ) {
    return { allowed: false, reason: "SESSION_FULL" };
  }

  // Find a usable subscription (direct or cross-venue)
  const subscription = await findActiveSubscription(
    directSubscriptions,
    userId,
    venueId,
    now
  );
  if (!subscription) {
    return { allowed: false, reason: "NO_ACTIVE_SUBSCRIPTION" };
  }

  // For direct subscriptions, verify membership
  if (subscription.venueId === venueId) {
    if (!venueMember) {
      return { allowed: false, reason: "NOT_A_MEMBER" };
    }
    if (venueMember.status !== MemberStatus.ACTIVE) {
      return { allowed: false, reason: "MEMBER_NOT_ACTIVE" };
    }
  }

  // Apply plan policy constraints
  const policy = (subscription.plan.policy as PlanPolicy) || {};

  const policyCheck = validatePolicyConstraints(policy, venueSession);
  if (policyCheck) return policyCheck;

  const limitCheck = await validateBookingLimits(
    policy,
    userId,
    venueId,
    venueSession,
    subscription,
    now
  );
  if (limitCheck) return limitCheck;

  return { allowed: true, subscriptionId: subscription.id };
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

  // Check cancellation deadline from session
  const cancellationDeadlineMinutes =
    booking.session.cancellationDeadlineMinutes ?? 30;

  if (cancellationDeadlineMinutes > 0) {
    const minutesUntilSession = differenceInMinutes(
      booking.session.startsAt,
      now
    );

    console.log("[validateCancellation] Checking cancellation deadline", {
      bookingId,
      sessionStartsAt: booking.session.startsAt,
      currentTime: now,
      minutesUntilSession,
      requiredMinutes: cancellationDeadlineMinutes,
    });

    if (minutesUntilSession < cancellationDeadlineMinutes) {
      console.warn("[validateCancellation] Cancellation deadline passed", {
        bookingId,
        minutesUntilSession,
        requiredMinutes: cancellationDeadlineMinutes,
      });
      return {
        allowed: false,
        reason: "CANCELLATION_DEADLINE_PASSED",
        minimumMinutes: cancellationDeadlineMinutes,
      };
    }
  }

  // All validations passed
  console.log("[validateCancellation] All validations passed", { bookingId });
  return {
    allowed: true,
  };
}
