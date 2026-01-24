import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VenueRole } from "@prisma/client";

// DELETE - Cancel invite
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; inviteId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, inviteId } = await params;

    // Check if user is owner
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
    });

    if (!member || member.role !== VenueRole.OWNER) {
      return NextResponse.json(
        { error: "Only owner can cancel invites" },
        { status: 403 }
      );
    }

    // Delete invite
    await prisma.venueInvite.delete({
      where: {
        id: inviteId,
        venueId, // Ensure invite belongs to this venue
      },
    });

    return NextResponse.json({ message: "Invite cancelled" });
  } catch (error) {
    console.error("Error cancelling invite:", error);
    return NextResponse.json(
      { error: "Failed to cancel invite" },
      { status: 500 }
    );
  }
}
