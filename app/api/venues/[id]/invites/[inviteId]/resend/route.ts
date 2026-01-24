import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VenueRole } from "@prisma/client";

// POST - Resend invite
export async function POST(
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
        { error: "Only owner can resend invites" },
        { status: 403 }
      );
    }

    // Get invite
    const invite = await prisma.venueInvite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        venue: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!invite || invite.venueId !== venueId) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Update invite to extend expiration (7 more days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const updatedInvite = await prisma.venueInvite.update({
      where: {
        id: inviteId,
      },
      data: {
        expiresAt,
        updatedAt: new Date(),
      },
    });

    // TODO: Send email notification here
    // You can use your email service (Resend, etc.) to send the invite email again

    return NextResponse.json({
      message: "Invite resent successfully",
      invite: updatedInvite,
    });
  } catch (error) {
    console.error("Error resending invite:", error);
    return NextResponse.json(
      { error: "Failed to resend invite" },
      { status: 500 }
    );
  }
}
