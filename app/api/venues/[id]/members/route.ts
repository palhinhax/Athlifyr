import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";

// GET - List members of a venue
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = params;

    // Check if user has access to view members
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const members = await prisma.venueMember.findMany({
      where: {
        venueId,
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
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
