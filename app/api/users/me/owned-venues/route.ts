import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VenueRole, MemberStatus } from "@prisma/client";

// GET - Get all venues where the current user is an OWNER
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownedVenues = await prisma.venue.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
            role: VenueRole.OWNER,
            status: MemberStatus.ACTIVE,
          },
        },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        logo: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ venues: ownedVenues });
  } catch (error) {
    console.error("Error fetching owned venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch owned venues" },
      { status: 500 }
    );
  }
}
