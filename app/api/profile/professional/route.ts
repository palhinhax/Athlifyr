import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get user's professional data (pending invites + venue memberships)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get pending invites for this user
    const pendingInvites = await prisma.venueInvite.findMany({
      where: {
        invitedUserId: userId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get inviter info separately to avoid complex joins
    const invitesWithInviters = await Promise.all(
      pendingInvites.map(async (invite) => {
        const inviter = await prisma.user.findUnique({
          where: { id: invite.invitedByUserId },
          select: {
            name: true,
            image: true,
          },
        });

        return {
          id: invite.id,
          role: invite.role,
          venue: invite.venue,
          invitedBy: {
            name: inviter?.name || "Unknown",
            image: inviter?.image || null,
          },
          createdAt: invite.createdAt.toISOString(),
        };
      })
    );

    // Get active venue memberships (staff roles only, not CLIENT)
    const memberships = await prisma.venueMember.findMany({
      where: {
        userId,
        status: "ACTIVE",
        role: {
          not: "CLIENT",
        },
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            city: true,
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    const formattedMemberships = memberships.map((m) => ({
      id: m.id,
      role: m.role,
      venue: m.venue,
      joinedAt: m.joinedAt?.toISOString() || null,
    }));

    return NextResponse.json({
      pendingInvites: invitesWithInviters,
      memberships: formattedMemberships,
    });
  } catch (error) {
    console.error("Error fetching professional data:", error);
    return NextResponse.json(
      { error: "Failed to fetch professional data" },
      { status: 500 }
    );
  }
}

// DELETE - Leave a venue (remove membership)
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { membershipId } = await request.json();

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    // Find the membership and verify it belongs to the user
    const membership = await prisma.venueMember.findUnique({
      where: { id: membershipId },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    if (membership.userId !== userId) {
      return NextResponse.json(
        { error: "You can only leave your own memberships" },
        { status: 403 }
      );
    }

    // Check if user is the OWNER - owners cannot leave their own venue
    if (membership.role === "OWNER") {
      return NextResponse.json(
        {
          error:
            "Owners cannot leave their own venue. Transfer ownership first.",
        },
        { status: 400 }
      );
    }

    // Delete the membership
    await prisma.venueMember.delete({
      where: { id: membershipId },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully left ${membership.venue.name}`,
    });
  } catch (error) {
    console.error("Error leaving venue:", error);
    return NextResponse.json(
      { error: "Failed to leave venue" },
      { status: 500 }
    );
  }
}
