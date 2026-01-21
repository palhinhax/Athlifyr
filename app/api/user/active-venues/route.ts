import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/active-venues
 * Returns venues where the user has an active subscription
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    // Fetch active subscriptions with venue details
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
          },
        },
      },
      orderBy: {
        startsAt: "desc", // Most recent first
      },
    });

    // Transform data for client and deduplicate by venue ID
    interface ActiveVenue {
      id: string;
      name: string;
      slug: string;
      imageUrl: string | null;
      subscriptionEndsAt: Date | null;
    }

    const venueMap = new Map<string, ActiveVenue>();

    activeSubscriptions.forEach((subscription) => {
      const venueId = subscription.venue.id;

      // Only add if not already in map, or if this subscription ends later
      if (!venueMap.has(venueId)) {
        venueMap.set(venueId, {
          id: subscription.venue.id,
          name: subscription.venue.name,
          slug: subscription.venue.slug,
          imageUrl: subscription.venue.logo,
          subscriptionEndsAt: subscription.endsAt,
        });
      } else {
        // If venue already exists, keep the one with the latest end date
        const existing = venueMap.get(venueId)!;
        const existingEndDate =
          existing.subscriptionEndsAt?.getTime() || Infinity;
        const currentEndDate = subscription.endsAt?.getTime() || Infinity;

        if (currentEndDate > existingEndDate) {
          venueMap.set(venueId, {
            id: subscription.venue.id,
            name: subscription.venue.name,
            slug: subscription.venue.slug,
            imageUrl: subscription.venue.logo,
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
