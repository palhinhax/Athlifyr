import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Accept invite
export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = params;

    // Find invite
    const invite = await prisma.venueInvite.findUnique({
      where: { token },
      include: {
        venue: true,
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check if invite is still valid
    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: "Invite is no longer valid" },
        { status: 400 }
      );
    }

    if (invite.expiresAt < new Date()) {
      // Update invite status to expired
      await prisma.venueInvite.update({
        where: { token },
        data: { status: "EXPIRED" },
      });

      return NextResponse.json(
        { error: "Invite has expired" },
        { status: 400 }
      );
    }

    // Check if invited by email matches current user
    if (invite.invitedEmail && invite.invitedEmail !== session.user.email) {
      return NextResponse.json(
        { error: "This invite is for a different email address" },
        { status: 400 }
      );
    }

    // Check if invited by userId matches current user
    if (invite.invitedUserId && invite.invitedUserId !== session.user.id) {
      return NextResponse.json(
        { error: "This invite is for a different user" },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId: invite.venueId,
          userId: session.user.id,
        },
      },
    });

    if (existingMember) {
      // Update invite status
      await prisma.venueInvite.update({
        where: { token },
        data: { status: "ACCEPTED" },
      });

      return NextResponse.json(
        { error: "You are already a member of this venue" },
        { status: 400 }
      );
    }

    // Create member and update invite in transaction
    const [member] = await prisma.$transaction([
      prisma.venueMember.create({
        data: {
          venueId: invite.venueId,
          userId: session.user.id,
          role: invite.role,
          status: "ACTIVE",
          joinedAt: new Date(),
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
      }),
      prisma.venueInvite.update({
        where: { token },
        data: { status: "ACCEPTED" },
      }),
    ]);

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return NextResponse.json(
      { error: "Failed to accept invite" },
      { status: 500 }
    );
  }
}
