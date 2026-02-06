import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";

// GET - Search members and subscribers of a venue by name or email
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // Check if user has permission to manage sessions (OWNER, ADMIN, COACH)
    // or is an app admin
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If no query, return empty array
    if (!query.trim()) {
      return NextResponse.json({ members: [] });
    }

    // Search for venue members (OWNER, ADMIN, COACH, CLIENT roles)
    const members = await prisma.venueMember.findMany({
      where: {
        venueId,
        user: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
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
      take: 10,
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    // Also search for users with active subscriptions to venue plans
    const subscribers = await prisma.venueSubscription.findMany({
      where: {
        plan: {
          venueId,
        },
        status: "ACTIVE",
        user: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
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
      take: 10,
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    // Combine and deduplicate results
    const userMap = new Map<
      string,
      { id: string; name: string | null; email: string; image: string | null }
    >();

    // Add venue members
    for (const member of members) {
      userMap.set(member.user.id, {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        image: member.user.image,
      });
    }

    // Add subscribers (won't overwrite if already exists)
    for (const subscription of subscribers) {
      if (!userMap.has(subscription.user.id)) {
        userMap.set(subscription.user.id, {
          id: subscription.user.id,
          name: subscription.user.name,
          email: subscription.user.email,
          image: subscription.user.image,
        });
      }
    }

    // Convert to array and sort by name
    const users = Array.from(userMap.values()).sort((a, b) => {
      const nameA = a.name || a.email;
      const nameB = b.name || b.email;
      return nameA.localeCompare(nameB);
    });

    return NextResponse.json({ members: users });
  } catch (error) {
    console.error("Error searching members:", error);
    return NextResponse.json(
      { error: "Failed to search members" },
      { status: 500 }
    );
  }
}
