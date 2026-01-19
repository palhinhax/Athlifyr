import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Set or update venue owner (admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();
    const venueId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId,
        },
      },
    });

    if (existingMember) {
      // Update existing member to OWNER role
      await prisma.venueMember.update({
        where: {
          venueId_userId: {
            venueId,
            userId,
          },
        },
        data: {
          role: "OWNER",
          status: "ACTIVE",
          joinedAt: existingMember.joinedAt || new Date(),
        },
      });
    } else {
      // Create new member with OWNER role
      await prisma.venueMember.create({
        data: {
          venueId,
          userId,
          role: "OWNER",
          status: "ACTIVE",
          joinedAt: new Date(),
        },
      });
    }

    // Return updated venue with members
    const updatedVenue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        members: {
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
          where: {
            role: "OWNER",
          },
        },
      },
    });

    return NextResponse.json(updatedVenue);
  } catch (error) {
    console.error("Error setting venue owner:", error);
    return NextResponse.json(
      { error: "Failed to set venue owner" },
      { status: 500 }
    );
  }
}
