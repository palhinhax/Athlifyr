import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get venue clients (users with subscriptions - active and inactive)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find venue
    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      select: {
        id: true,
        createdByUserId: true,
        members: {
          where: {
            userId: session.user.id,
            status: "ACTIVE",
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Check if user can view clients (must be owner, admin, coach, or app admin)
    const isOwner = venue.createdByUserId === session.user.id;
    const isAppAdmin = session.user.role === "ADMIN";
    const memberRole = venue.members[0]?.role;
    const STAFF_ROLES = new Set(["OWNER", "ADMIN", "COACH"]);

    if (
      !isOwner &&
      !isAppAdmin &&
      !(memberRole && STAFF_ROLES.has(memberRole))
    ) {
      return NextResponse.json(
        { error: "Not authorized to view clients" },
        { status: 403 }
      );
    }

    // Build search filter for user
    const userSearchFilter = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get all subscriptions (active and inactive) with search
    const subscriptions = await prisma.venueSubscription.findMany({
      where: {
        venueId: venue.id,
        user: userSearchFilter,
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
        plan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        // Active subscriptions first
        { status: "asc" }, // ACTIVE comes before other statuses alphabetically
        { createdAt: "desc" },
      ],
    });

    // Group subscriptions by user and determine active status
    const usersMap = new Map<
      string,
      {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        plans: Array<{ name: string; status: string }>;
        hasActiveSubscription: boolean;
        latestSubscriptionDate: Date;
      }
    >();

    for (const sub of subscriptions) {
      const existing = usersMap.get(sub.user.id);
      const isActive = sub.status === "ACTIVE";

      if (existing) {
        existing.plans.push({ name: sub.plan.name, status: sub.status });
        if (isActive) {
          existing.hasActiveSubscription = true;
        }
        if (new Date(sub.createdAt) > existing.latestSubscriptionDate) {
          existing.latestSubscriptionDate = new Date(sub.createdAt);
        }
      } else {
        usersMap.set(sub.user.id, {
          id: sub.user.id,
          name: sub.user.name,
          email: sub.user.email,
          image: sub.user.image,
          plans: [{ name: sub.plan.name, status: sub.status }],
          hasActiveSubscription: isActive,
          latestSubscriptionDate: new Date(sub.createdAt),
        });
      }
    }

    // Convert to array and sort: active clients first, then by latest subscription date
    const allClients = Array.from(usersMap.values()).sort((a, b) => {
      // Active clients first
      if (a.hasActiveSubscription && !b.hasActiveSubscription) return -1;
      if (!a.hasActiveSubscription && b.hasActiveSubscription) return 1;
      // Then by latest subscription date (most recent first)
      return (
        b.latestSubscriptionDate.getTime() - a.latestSubscriptionDate.getTime()
      );
    });

    // Apply pagination
    const totalCount = allClients.length;
    const paginatedClients = allClients.slice(skip, skip + limit);
    const hasMore = skip + limit < totalCount;

    return NextResponse.json({
      clients: paginatedClients,
      pagination: {
        page,
        limit,
        totalCount,
        hasMore,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching venue clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
