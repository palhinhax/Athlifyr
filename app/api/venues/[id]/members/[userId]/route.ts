import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { VenueRole, MemberStatus } from "@prisma/client";

// PATCH - Update member role or status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, userId } = await params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { role, status } = body;

    // Validate role if provided
    if (role && !Object.values(VenueRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Validate status if provided
    if (status && !Object.values(MemberStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Prevent owner from changing their own role
    if (userId === session.user.id && role) {
      const currentMember = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId,
          },
        },
      });

      if (currentMember?.role === VenueRole.OWNER) {
        return NextResponse.json(
          { error: "Cannot change owner role" },
          { status: 400 }
        );
      }
    }

    // Update member
    const member = await prisma.venueMember.update({
      where: {
        venueId_userId: {
          venueId,
          userId,
        },
      },
      data: {
        ...(role && { role }),
        ...(status && { status }),
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
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE - Remove member from venue
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, userId } = await params;

    // Check if user is owner
    const currentMember = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
    });

    if (!currentMember || currentMember.role !== VenueRole.OWNER) {
      return NextResponse.json(
        { error: "Only owner can remove members" },
        { status: 403 }
      );
    }

    // Get member to remove
    const memberToRemove = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId,
        },
      },
    });

    if (!memberToRemove) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Cannot remove owner
    if (memberToRemove.role === VenueRole.OWNER) {
      return NextResponse.json(
        { error: "Cannot remove owner" },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.venueMember.delete({
      where: {
        venueId_userId: {
          venueId,
          userId,
        },
      },
    });

    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
