import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { VenueRole } from "@prisma/client";
import crypto from "crypto";

// GET - List pending invites (owner only)
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
        { error: "Only owner can view invites" },
        { status: 403 }
      );
    }

    // Get pending invites
    const invites = await prisma.venueInvite.findMany({
      where: {
        venueId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get inviter names separately
    const invitesWithInviter = await Promise.all(
      invites.map(async (invite) => {
        const inviter = await prisma.user.findUnique({
          where: { id: invite.invitedByUserId },
          select: { name: true },
        });
        return {
          ...invite,
          invitedBy: inviter,
        };
      })
    );

    return NextResponse.json(invitesWithInviter);
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}

// POST - Create invite
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

    // Check authorization
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, email, role } = body;

    // Validate that either userId or email is provided
    if (!userId && !email) {
      return NextResponse.json(
        { error: "Either userId or email is required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!role || !Object.values(VenueRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Cannot invite as OWNER
    if (role === VenueRole.OWNER) {
      return NextResponse.json(
        { error: "Cannot invite as owner" },
        { status: 400 }
      );
    }

    // Check if user is already a member
    if (userId) {
      const existingMember = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId,
          },
        },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: "User is already a member" },
          { status: 400 }
        );
      }
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invite (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.venueInvite.create({
      data: {
        venueId,
        invitedUserId: userId || null,
        invitedEmail: email || null,
        invitedByUserId: session.user.id,
        role,
        token,
        expiresAt,
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

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json(
      { error: "Failed to create invite" },
      { status: 500 }
    );
  }
}
