import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";

// GET - Get venue by ID or slug
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        plans: {
          where: {
            isActive: true,
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

    return NextResponse.json(venue);
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, id);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      type,
      description,
      phone,
      email,
      website,
      instagram,
      address,
      city,
      country,
      latitude,
      longitude,
      isActive,
    } = body;

    // Update venue
    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(instagram !== undefined && { instagram }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(isActive !== undefined && { isActive }),
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user is owner
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId: id,
          userId: session.user.id,
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
