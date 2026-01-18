import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Request to join venue as client
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = params;

    // Check if venue exists and is active
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue || !venue.isActive) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
    });

    if (existingMember) {
      if (existingMember.status === "PENDING") {
        return NextResponse.json(
          { error: "Join request already pending" },
          { status: 400 }
        );
      }

      if (existingMember.status === "ACTIVE") {
        return NextResponse.json(
          { error: "Already a member" },
          { status: 400 }
        );
      }

      // If suspended or left, reactivate as pending
      const updatedMember = await prisma.venueMember.update({
        where: {
          venueId_userId: {
            venueId,
            userId: session.user.id,
          },
        },
        data: {
          status: "PENDING",
          role: "CLIENT",
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return NextResponse.json(updatedMember, { status: 201 });
    }

    // Create new join request
    const member = await prisma.venueMember.create({
      data: {
        venueId,
        userId: session.user.id,
        role: "CLIENT",
        status: "PENDING",
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating join request:", error);
    return NextResponse.json(
      { error: "Failed to create join request" },
      { status: 500 }
    );
  }
}
