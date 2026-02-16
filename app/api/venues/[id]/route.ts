import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { hasActiveSubscription } from "@/lib/venues/subscription-utils";
import { SportType, VenueService } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET - Get venue by ID or slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve params and auth in parallel
    const [{ id }, authUser] = await Promise.all([
      params,
      getAuthUser(request),
    ]);
    const currentUserId = authUser?.id;

    // Try to find by ID first, then by slug
    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        members: {
          where: {
            status: "ACTIVE",
            role: {
              not: "CLIENT",
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        plans: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            currency: true,
            // paymentProvider removed - now at venue level
            policy: true, // Include policy for editing
            isActive: true,
            createdAt: true,
            updatedAt: true,
            // Include included venues for multi-venue plans
            includedVenues: {
              include: {
                venue: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    city: true,
                    logo: true,
                  },
                },
              },
            },
            // Include user's subscriptions if logged in
            subscriptions: currentUserId
              ? {
                  where: {
                    userId: currentUserId,
                    status: "ACTIVE",
                    OR: [
                      { endsAt: null },
                      { endsAt: { gte: new Date() } }, // Must not have ended
                    ],
                  },
                  select: {
                    id: true,
                    status: true,
                    paymentStatus: true,
                    startsAt: true,
                    endsAt: true,
                    createdAt: true,
                  },
                  orderBy: { createdAt: "desc" },
                  take: 5, // Get active subscriptions (may include exhausted packs + new ones)
                }
              : false,
          },
        },
        _count: {
          select: {
            sessions: true,
            bookings: true,
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Run enrichment queries in parallel instead of sequentially (N+1 fix)
    interface PlanPolicy {
      maxTotalBookings?: number;
    }
    interface SubscriptionData {
      id: string;
      startsAt: Date;
      endsAt: Date | null;
      createdAt: Date;
      totalBookingsUsed?: number;
    }
    interface PlanData {
      id: string;
      policy: PlanPolicy | null;
      subscriptions: SubscriptionData[] | false;
    }

    // Batch: get all plan venue mappings and unique subscribers count in parallel
    const [allPlanVenues, uniqueSubscriberCount, plansIncludingThisVenue] =
      await Promise.all([
        // Get all venue mappings for all plans at once (instead of per-plan)
        prisma.venuePlanVenue.findMany({
          where: {
            planId: {
              in: venue.plans.map((p) => p.id),
            },
          },
          select: { planId: true, venueId: true },
        }),
        // Count unique subscribers
        prisma.venueSubscription
          .findMany({
            where: { venueId: venue.id, status: "ACTIVE" },
            select: { userId: true },
            distinct: ["userId"],
          })
          .then((subs) => subs.length),
        // Find plans from other venues that include this venue
        prisma.venuePlanVenue.findMany({
          where: { venueId: venue.id },
          select: { planId: true },
        }),
      ]);

    // Build a map of planId -> venueIds for quick lookup
    const planVenueMap = new Map<string, string[]>();
    for (const pv of allPlanVenues) {
      const existing = planVenueMap.get(pv.planId) || [];
      existing.push(pv.venueId);
      planVenueMap.set(pv.planId, existing);
    }

    // Enrich subscriptions with totalBookingsUsed for pack/drop-in plans
    if (currentUserId) {
      const plansWithTotalBookings = venue.plans as unknown as PlanData[];

      // Collect all subscription IDs that need booking counts
      const subsNeedingCounts: Array<{
        sub: SubscriptionData;
        allVenueIds: string[];
      }> = [];

      for (const plan of plansWithTotalBookings) {
        const policy = plan.policy as PlanPolicy | null;
        if (
          policy?.maxTotalBookings &&
          plan.subscriptions &&
          Array.isArray(plan.subscriptions)
        ) {
          const includedVenueIds = planVenueMap.get(plan.id) || [];
          const allVenueIds = [venue.id, ...includedVenueIds];

          for (const sub of plan.subscriptions) {
            subsNeedingCounts.push({ sub, allVenueIds });
          }
        }
      }

      // Batch all booking count queries in parallel
      if (subsNeedingCounts.length > 0) {
        const countResults = await Promise.all(
          subsNeedingCounts.map(async ({ sub, allVenueIds }) => {
            const [linked, legacy] = await Promise.all([
              prisma.venueBooking.count({
                where: {
                  subscriptionId: sub.id,
                  status: { in: ["BOOKED", "ATTENDED"] },
                },
              }),
              prisma.venueBooking.count({
                where: {
                  userId: currentUserId,
                  subscriptionId: null,
                  venueId: { in: allVenueIds },
                  status: { in: ["BOOKED", "ATTENDED"] },
                  createdAt: {
                    gte: sub.createdAt,
                    ...(sub.endsAt ? { lte: sub.endsAt } : {}),
                  },
                },
              }),
            ]);
            return { sub, total: linked + legacy };
          })
        );

        for (const { sub, total } of countResults) {
          sub.totalBookingsUsed = total;
        }
      }
    }

    // Fetch cross-venue subscriptions in parallel
    let crossVenueSubscriptions: {
      id: string;
      status: string;
      paymentStatus: string;
      startsAt: Date;
      endsAt: Date | null;
      createdAt: Date;
      totalBookingsUsed?: number;
      plan: {
        id: string;
        name: string;
        description: string | null;
        price: number;
        currency: string;
        policy: unknown;
        venue: {
          id: string;
          name: string;
          slug: string;
          city: string | null;
          logo: string | null;
        };
      };
    }[] = [];

    if (currentUserId && plansIncludingThisVenue.length > 0) {
      const planIds = plansIncludingThisVenue.map((pv) => pv.planId);

      const crossSubs = await prisma.venueSubscription.findMany({
        where: {
          userId: currentUserId,
          planId: { in: planIds },
          status: "ACTIVE",
          OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
        },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          startsAt: true,
          endsAt: true,
          createdAt: true,
          plan: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              currency: true,
              policy: true,
              venue: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  city: true,
                  logo: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      // Enrich cross-venue subscriptions with totalBookingsUsed in parallel
      if (crossSubs.length > 0) {
        // Get all plan venue mappings for cross-subs at once
        const crossPlanIds = [...new Set(crossSubs.map((s) => s.plan.id))];
        const crossPlanVenues = await prisma.venuePlanVenue.findMany({
          where: { planId: { in: crossPlanIds } },
          select: { planId: true, venueId: true },
        });

        const crossPlanVenueMap = new Map<string, string[]>();
        for (const pv of crossPlanVenues) {
          const existing = crossPlanVenueMap.get(pv.planId) || [];
          existing.push(pv.venueId);
          crossPlanVenueMap.set(pv.planId, existing);
        }

        await Promise.all(
          crossSubs.map(async (sub) => {
            const policy = sub.plan.policy as {
              maxTotalBookings?: number;
            } | null;
            if (!policy?.maxTotalBookings) return;

            const includedVenueIds = crossPlanVenueMap.get(sub.plan.id) || [];
            const allVenueIds = [sub.plan.venue.id, ...includedVenueIds];

            const [linked, legacy] = await Promise.all([
              prisma.venueBooking.count({
                where: {
                  subscriptionId: sub.id,
                  status: { in: ["BOOKED", "ATTENDED"] },
                },
              }),
              prisma.venueBooking.count({
                where: {
                  userId: currentUserId,
                  subscriptionId: null,
                  venueId: { in: allVenueIds },
                  status: { in: ["BOOKED", "ATTENDED"] },
                  createdAt: {
                    gte: sub.createdAt,
                    ...(sub.endsAt ? { lte: sub.endsAt } : {}),
                  },
                },
              }),
            ]);

            (
              sub as typeof sub & { totalBookingsUsed?: number }
            ).totalBookingsUsed = linked + legacy;
          })
        );

        crossVenueSubscriptions = crossSubs as typeof crossVenueSubscriptions;
      }
    }

    // Check if user has active subscription (optimized: reuse venue data already loaded)
    let userSubscriptionStatus: {
      hasSubscription: boolean;
      reason: string;
      subscriptionCount: number;
    } | null = null;

    if (currentUserId) {
      // Optimization: avoid re-querying venue and members — we already have them
      if (!venue.requiresPlanToBook) {
        userSubscriptionStatus = {
          hasSubscription: true,
          reason: "no_plan_required",
          subscriptionCount: 0,
        };
      } else {
        // Check if user is a venue member (OWNER, ADMIN, COACH) using data already loaded
        const isMember = venue.members.some(
          (m) =>
            m.user.id === currentUserId &&
            ["OWNER", "ADMIN", "COACH"].includes(m.role)
        );
        if (isMember) {
          userSubscriptionStatus = {
            hasSubscription: true,
            reason: "venue_member",
            subscriptionCount: 0,
          };
        } else {
          // Only call the full function when we actually need to check subscriptions
          userSubscriptionStatus = await hasActiveSubscription(
            currentUserId,
            venue.id
          );
        }
      }
    }

    // Build final response
    const venueWithUniqueCount = {
      ...venue,
      crossVenueSubscriptions,
      userSubscriptionStatus, // Add centralized subscription validation
      _count: {
        ...(venue as { _count?: { sessions: number; bookings: number } })
          ._count,
        subscriptions: uniqueSubscriberCount,
      },
    };

    return NextResponse.json(venueWithUniqueCount, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching venue:", error);
    return NextResponse.json(
      { error: "Failed to fetch venue" },
      { status: 500 }
    );
  }
}

// PATCH - Update venue (owner/admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check authorization
    const authResult = await canManageVenue(authUser.id, id);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    console.log("Received venue update request:", body);
    console.log("Logo value:", body.logo);
    console.log("CoverImage value:", body.coverImage);

    const {
      name,
      type,
      sportTypes,
      description,
      phone,
      email,
      website,
      instagram,
      whatsapp,
      address,
      city,
      country,
      latitude,
      longitude,
      isActive,
      logo,
      coverImage,
      services,
      defaultSessionCapacity,
      defaultBookingAdvanceDays,
      defaultBookingDeadlineMinutes,
      defaultCancellationDeadlineMinutes,
      requiresPlanToBook,
      enableTrialBooking,
    } = body;

    // Validate sport types if provided
    if (sportTypes && Array.isArray(sportTypes)) {
      const validSportTypes = sportTypes.every((sport: string) =>
        Object.values(SportType).includes(sport as SportType)
      );
      if (!validSportTypes) {
        return NextResponse.json(
          { error: "Invalid sport type(s)" },
          { status: 400 }
        );
      }
    }

    // Validate services if provided
    if (services && Array.isArray(services)) {
      const validServices = services.every((service: string) =>
        Object.values(VenueService).includes(service as VenueService)
      );
      if (!validServices) {
        return NextResponse.json(
          { error: "Invalid service type(s)" },
          { status: 400 }
        );
      }
    }

    // Update venue
    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(sportTypes !== undefined && { sportTypes }),
        ...(description !== undefined && { description }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(instagram !== undefined && { instagram }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(isActive !== undefined && { isActive }),
        // Images: update if provided (even empty string to clear), but not if undefined
        ...(logo !== undefined && { logo: logo || null }),
        ...(coverImage !== undefined && {
          coverImage: coverImage || null,
        }),
        // Services
        ...(services !== undefined && { services }),
        // Session defaults
        ...(defaultSessionCapacity !== undefined && {
          defaultSessionCapacity,
        }),
        ...(defaultBookingAdvanceDays !== undefined && {
          defaultBookingAdvanceDays,
        }),
        ...(defaultBookingDeadlineMinutes !== undefined && {
          defaultBookingDeadlineMinutes,
        }),
        ...(defaultCancellationDeadlineMinutes !== undefined && {
          defaultCancellationDeadlineMinutes,
        }),
        // Booking settings
        ...(requiresPlanToBook !== undefined && {
          requiresPlanToBook,
        }),
        ...(enableTrialBooking !== undefined && {
          enableTrialBooking,
        }),
      },
    });

    return NextResponse.json(venue);
  } catch (error) {
    console.error("Error updating venue:", error);
    return NextResponse.json(
      { error: "Failed to update venue" },
      { status: 500 }
    );
  }
}

// DELETE - Delete venue (owner only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user is owner
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId: id,
          userId: authUser.id,
        },
      },
    });

    if (!member || member.role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete by setting isActive to false
    await prisma.venue.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error("Error deleting venue:", error);
    return NextResponse.json(
      { error: "Failed to delete venue" },
      { status: 500 }
    );
  }
}
