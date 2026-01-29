import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Request ownership of a venue
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;
    const body = await request.json();
    const { message } = body;

    // Check if venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        members: {
          where: { role: "OWNER" },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Check if venue already has an owner
    if (venue.members.length > 0) {
      return NextResponse.json(
        { error: "Venue already has an owner" },
        { status: 400 }
      );
    }

    // Check if user already has a pending claim for this venue
    const existingClaim = await prisma.venueOwnershipClaim.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
    });

    if (existingClaim) {
      if (existingClaim.status === "PENDING") {
        return NextResponse.json(
          {
            error: "You already have a pending ownership claim for this venue",
          },
          { status: 400 }
        );
      }

      if (existingClaim.status === "REJECTED") {
        // Allow resubmitting after rejection
        const updatedClaim = await prisma.venueOwnershipClaim.update({
          where: { id: existingClaim.id },
          data: {
            status: "PENDING",
            message,
            adminNotes: null,
            reviewedAt: null,
            reviewedBy: null,
          },
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        return NextResponse.json(updatedClaim, { status: 201 });
      }

      // If already approved, they're already the owner
      return NextResponse.json(
        { error: "Your ownership claim has already been approved" },
        { status: 400 }
      );
    }

    // Create new ownership claim
    const claim = await prisma.venueOwnershipClaim.create({
      data: {
        venueId,
        userId: session.user.id,
        message,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error("Error creating ownership claim:", error);
    return NextResponse.json(
      { error: "Failed to create ownership claim" },
      { status: 500 }
    );
  }
}

// GET - Check if user has a pending claim for this venue
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

    const claim = await prisma.venueOwnershipClaim.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ claim });
  } catch (error) {
    console.error("Error fetching ownership claim:", error);
    return NextResponse.json(
      { error: "Failed to fetch ownership claim" },
      { status: 500 }
    );
  }
}
