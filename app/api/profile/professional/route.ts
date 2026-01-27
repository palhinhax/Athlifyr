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
