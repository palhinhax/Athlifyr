import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/active-venues
 * Returns venues where the user is a member (owner, admin, coach, client)
 * or has an active subscription
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    // Interface for the response
    interface ActiveVenue {
      id: string;
      name: string;
      slug: string;
      imageUrl: string | null;
      role: string | null;
      subscriptionEndsAt: Date | null;
    }

    const venueMap = new Map<string, ActiveVenue>();

    // 1. Fetch venues where user is a member (owner, admin, coach, client)
    const venueMemberships = await prisma.venueMember.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            isActive: true,
          },
        },
      },
    });

    // Add memberships to the map
    venueMemberships.forEach((membership) => {
      if (membership.venue.isActive) {
        venueMap.set(membership.venue.id, {
          id: membership.venue.id,
          name: membership.venue.name,
          slug: membership.venue.slug,
          imageUrl: membership.venue.logo,
          role: membership.role,
          subscriptionEndsAt: null,
        });
      }
    });

    // 2. Fetch active subscriptions with venue details
    const now = new Date();
    const activeSubscriptions = await prisma.venueSubscription.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        startsAt: {
          lte: now, // Subscription must have already started
        },
        OR: [
          { endsAt: null }, // No end date (ongoing)
          { endsAt: { gte: now } }, // Ends in the future
        ],
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        startsAt: "desc", // Most recent first
      },
    });

    // Add/update with subscription info
    activeSubscriptions.forEach((subscription) => {
      if (!subscription.venue.isActive) return;

      const venueId = subscription.venue.id;
      const existing = venueMap.get(venueId);

      if (!existing) {
        // Venue not in memberships, add from subscription
        venueMap.set(venueId, {
          id: subscription.venue.id,
          name: subscription.venue.name,
          slug: subscription.venue.slug,
          imageUrl: subscription.venue.logo,
          role: null,
          subscriptionEndsAt: subscription.endsAt,
        });
      } else {
        // Venue exists from membership, update subscription end date if later
        const existingEndDate = existing.subscriptionEndsAt?.getTime() || 0;
        const currentEndDate = subscription.endsAt?.getTime() || Infinity;

        if (currentEndDate > existingEndDate) {
          venueMap.set(venueId, {
            ...existing,
            subscriptionEndsAt: subscription.endsAt,
          });
        }
      }
    });

    // 3. Fetch venues included in multi-venue plans from active subscriptions
    const subscriptionPlanIds = activeSubscriptions.map((s) => s.planId);

    if (subscriptionPlanIds.length > 0) {
      const includedVenues = await prisma.venuePlanVenue.findMany({
        where: {
          planId: { in: subscriptionPlanIds },
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              isActive: true,
            },
          },
          plan: {
            select: {
              id: true,
              // Get the subscription end date for this plan
              subscriptions: {
                where: {
                  userId: session.user.id,
                  status: "ACTIVE",
                  startsAt: { lte: now },
                  OR: [{ endsAt: null }, { endsAt: { gte: now } }],
                },
                select: {
                  endsAt: true,
                },
                take: 1,
              },
            },
          },
        },
      });

      // Add included venues to the map
      includedVenues.forEach((pv) => {
        if (!pv.venue.isActive) return;

        const venueId = pv.venue.id;
        const existing = venueMap.get(venueId);
        const subscriptionEndsAt = pv.plan.subscriptions[0]?.endsAt || null;

        if (!existing) {
          venueMap.set(venueId, {
            id: pv.venue.id,
            name: pv.venue.name,
            slug: pv.venue.slug,
            imageUrl: pv.venue.logo,
            role: null, // User has access via multi-venue plan, not as member
            subscriptionEndsAt: subscriptionEndsAt,
          });
        } else {
          // Update end date if this subscription lasts longer
          const existingEndDate = existing.subscriptionEndsAt?.getTime() || 0;
          const currentEndDate = subscriptionEndsAt?.getTime() || Infinity;

          if (currentEndDate > existingEndDate) {
            venueMap.set(venueId, {
              ...existing,
              subscriptionEndsAt: subscriptionEndsAt,
            });
          }
        }
      });
    }

    const activeVenues: ActiveVenue[] = Array.from(venueMap.values());

    return NextResponse.json(activeVenues);
  } catch (error) {
    console.error("Error fetching active venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch active venues" },
      { status: 500 }
    );
  }
}
