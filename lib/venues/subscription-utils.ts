import { prisma } from "@/lib/prisma";
import { VenueSubscription } from "@prisma/client";

/**
 * Check if a subscription is currently active
 * A subscription is active if:
 * 1. status === "ACTIVE"
 * 2. startsAt <= now (has already started)
 * 3. endsAt is null OR endsAt > now (hasn't expired yet)
 */
export function isSubscriptionActive(
  subscription: Pick<VenueSubscription, "status" | "startsAt" | "endsAt">
): boolean {
  if (subscription.status !== "ACTIVE") {
    return false;
  }

  const now = new Date();

  // Check if subscription has started
  if (subscription.startsAt > now) {
    return false;
  }

  // Check if subscription hasn't expired
  if (subscription.endsAt && subscription.endsAt <= now) {
    return false;
  }

  return true;
}

/**
 * Get all active subscriptions for a user at a specific venue
 * Includes both direct venue subscriptions and cross-venue subscriptions
 */
export async function getUserActiveSubscriptions(
  userId: string,
  venueId: string
): Promise<{
  directSubscriptions: VenueSubscription[];
  crossVenueSubscriptions: VenueSubscription[];
  hasAnyActiveSubscription: boolean;
}> {
  const now = new Date();

  // Get direct subscriptions for this venue
  const directSubscriptions = await prisma.venueSubscription.findMany({
    where: {
      userId,
      venueId,
      status: "ACTIVE",
      startsAt: { lte: now },
      OR: [{ endsAt: null }, { endsAt: { gt: now } }],
    },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          policy: true,
        },
      },
    },
  });

  // Get plans from other venues that include this venue
  const plansIncludingThisVenue = await prisma.venuePlanVenue.findMany({
    where: { venueId },
    select: { planId: true },
  });

  const planIds = plansIncludingThisVenue.map((pv) => pv.planId);

  // Get cross-venue subscriptions
  const crossVenueSubscriptions =
    planIds.length > 0
      ? await prisma.venueSubscription.findMany({
          where: {
            userId,
            planId: { in: planIds },
            status: "ACTIVE",
            startsAt: { lte: now },
            OR: [{ endsAt: null }, { endsAt: { gt: now } }],
          },
          include: {
            plan: {
              select: {
                id: true,
                name: true,
                policy: true,
                venue: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        })
      : [];

  const hasAnyActiveSubscription =
    directSubscriptions.length > 0 || crossVenueSubscriptions.length > 0;

  return {
    directSubscriptions,
    crossVenueSubscriptions,
    hasAnyActiveSubscription,
  };
}

/**
 * Check if a user has an active subscription for a venue
 * Takes into account:
 * - Direct venue subscriptions
 * - Cross-venue subscriptions (multi-venue plans)
 * - Venue members (OWNER, ADMIN, COACH) - always have access
 * - Venues that don't require a plan (requiresPlanToBook = false)
 */
export async function hasActiveSubscription(
  userId: string,
  venueId: string
): Promise<{
  hasSubscription: boolean;
  reason:
    | "venue_member"
    | "no_plan_required"
    | "direct_subscription"
    | "cross_venue_subscription"
    | "no_subscription";
  subscriptionCount: number;
}> {
  // Check if venue requires a plan
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    select: { requiresPlanToBook: true },
  });

  if (!venue) {
    return {
      hasSubscription: false,
      reason: "no_subscription",
      subscriptionCount: 0,
    };
  }

  // If venue doesn't require a plan, allow booking
  if (!venue.requiresPlanToBook) {
    return {
      hasSubscription: true,
      reason: "no_plan_required",
      subscriptionCount: 0,
    };
  }

  // Check if user is a venue member (OWNER, ADMIN, COACH)
  const venueMember = await prisma.venueMember.findUnique({
    where: {
      venueId_userId: {
        venueId,
        userId,
      },
    },
    select: { role: true, status: true },
  });

  if (
    venueMember &&
    venueMember.status === "ACTIVE" &&
    ["OWNER", "ADMIN", "COACH"].includes(venueMember.role)
  ) {
    return {
      hasSubscription: true,
      reason: "venue_member",
      subscriptionCount: 0,
    };
  }

  // Get active subscriptions
  const { directSubscriptions, crossVenueSubscriptions } =
    await getUserActiveSubscriptions(userId, venueId);

  const totalSubscriptions =
    directSubscriptions.length + crossVenueSubscriptions.length;

  if (directSubscriptions.length > 0) {
    return {
      hasSubscription: true,
      reason: "direct_subscription",
      subscriptionCount: totalSubscriptions,
    };
  }

  if (crossVenueSubscriptions.length > 0) {
    return {
      hasSubscription: true,
      reason: "cross_venue_subscription",
      subscriptionCount: totalSubscriptions,
    };
  }

  return {
    hasSubscription: false,
    reason: "no_subscription",
    subscriptionCount: 0,
  };
}
