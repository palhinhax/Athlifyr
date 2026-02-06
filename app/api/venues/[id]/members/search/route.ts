import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";

// GET - Search members of a venue by name or email
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

    // Search for members with active subscriptions
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
      take: 10, // Limit results
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    // Transform to return user data directly
    const users = members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
    }));

    return NextResponse.json({ members: users });
  } catch (error) {
    console.error("Error searching members:", error);
    return NextResponse.json(
      { error: "Failed to search members" },
      { status: 500 }
    );
  }
}
