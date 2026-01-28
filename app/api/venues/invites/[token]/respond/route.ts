import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Respond to venue invite (accept or decline)
// This endpoint accepts invites by invite ID (passed as token param)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token: inviteId } = await params;
    const { accept } = await request.json();

    // Find the invite by ID
    const invite = await prisma.venueInvite.findUnique({
      where: { id: inviteId },
      include: {
        venue: true,
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check if invite is for this user
    if (invite.invitedUserId !== session.user.id) {
      return NextResponse.json(
        { error: "This invite is not for you" },
        { status: 403 }
      );
    }

    // Check if invite is still pending
    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: "Invite has already been processed" },
        { status: 400 }
      );
    }

    // Check if invite has expired
    if (invite.expiresAt < new Date()) {
      await prisma.venueInvite.update({
        where: { id: inviteId },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { error: "Invite has expired" },
        { status: 400 }
      );
    }

    if (accept) {
      // Accept invite - create or upgrade membership and update invite status
      await prisma.$transaction(async (tx) => {
        // Check if already a member
        const existingMember = await tx.venueMember.findUnique({
          where: {
            venueId_userId: {
              venueId: invite.venueId,
              userId: session.user.id,
            },
          },
        });

        if (existingMember) {
          // Update existing membership:
          // - If CLIENT, upgrade to new staff role
          // - If suspended or left, reactivate with new role
          // - If already active staff, keep existing role (shouldn't happen due to invite validation)
          const shouldUpdate =
            existingMember.role === "CLIENT" ||
            existingMember.status === "SUSPENDED" ||
            existingMember.status === "LEFT";

          if (shouldUpdate) {
            await tx.venueMember.update({
              where: { id: existingMember.id },
              data: {
                role: invite.role,
                status: "ACTIVE",
                joinedAt: existingMember.joinedAt || new Date(),
              },
            });
          }
          // If already active staff, just keep it (edge case)
        } else {
          // Create new membership
          await tx.venueMember.create({
            data: {
              venueId: invite.venueId,
              userId: session.user.id,
              role: invite.role,
              status: "ACTIVE",
              joinedAt: new Date(),
            },
          });
        }

        // Update invite status
        await tx.venueInvite.update({
          where: { id: inviteId },
          data: { status: "ACCEPTED" },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Invite accepted",
        venue: invite.venue,
      });
    } else {
      // Decline invite
      await prisma.venueInvite.update({
        where: { id: inviteId },
        data: { status: "REJECTED" },
      });

      return NextResponse.json({
        success: true,
        message: "Invite declined",
      });
    }
  } catch (error) {
    console.error("Error responding to invite:", error);
    return NextResponse.json(
      { error: "Failed to process invite response" },
      { status: 500 }
    );
  }
}
