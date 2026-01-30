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
    const activeSubscriptions = await prisma.venueSubscription.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        OR: [
          { endsAt: null }, // No end date (ongoing)
          { endsAt: { gte: new Date() } }, // Ends in the future
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
