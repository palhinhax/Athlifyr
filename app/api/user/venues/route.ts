import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/venues
 * Returns venues where the authenticated user is a member
 * Used for navigation menu - optimized query
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only active memberships with minimal venue data
    const memberships = await prisma.venueMember.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        venue: {
          isActive: true,
        },
      },
      select: {
        role: true,
        venue: {
          select: {
            id: true,
            slug: true,
            name: true,
            logo: true,
            type: true,
          },
        },
      },
      orderBy: [
        { role: "desc" }, // OWNER first, then ADMIN, COACH, CLIENT
        { venue: { name: "asc" } },
      ],
    });

    const venues = memberships.map((membership) => ({
      ...membership.venue,
      role: membership.role,
    }));

    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error fetching user venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}
