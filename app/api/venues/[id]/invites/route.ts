import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { VenueRole } from "@prisma/client";
import crypto from "crypto";

// GET - List pending invites (owner/admin only)
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

    // Check if user can manage invites (owner, admin, or app admin)
    const [member, user] = await Promise.all([
      prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId: session.user.id,
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
    ]);

    const isAppAdmin = user?.role === "ADMIN";
    const canViewInvites =
      isAppAdmin ||
      member?.role === VenueRole.OWNER ||
      member?.role === VenueRole.ADMIN;

    if (!canViewInvites) {
      return NextResponse.json(
        { error: "Only owner or admin can view invites" },
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

    // Get inviter names and invited user info
    const invitesWithDetails = await Promise.all(
      invites.map(async (invite) => {
        const inviter = await prisma.user.findUnique({
          where: { id: invite.invitedByUserId },
          select: { name: true },
        });

        // If invited by userId, get user details
        let invitedUser = null;
        if (invite.invitedUserId) {
          invitedUser = await prisma.user.findUnique({
            where: { id: invite.invitedUserId },
            select: { id: true, name: true, email: true, image: true },
          });
        }

        return {
          ...invite,
          invitedBy: inviter,
          invitedUser,
          // For backwards compatibility, use email from user if invited by userId
          email: invite.invitedEmail || invitedUser?.email || null,
        };
      })
    );

    return NextResponse.json(invitesWithDetails);
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

    // Check if user is already a staff member (OWNER/ADMIN/COACH)
    // Note: CLIENT members can be invited to become staff
    if (userId) {
      const existingMember = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId,
          },
        },
      });

      // Only block if user is already staff (not CLIENT)
      if (existingMember && existingMember.role !== VenueRole.CLIENT) {
        return NextResponse.json(
          { error: "User is already a staff member" },
          { status: 400 }
        );
      }

      // Also check for pending invites for this user
      const pendingInvite = await prisma.venueInvite.findFirst({
        where: {
          venueId,
          invitedUserId: userId,
          status: "PENDING",
          expiresAt: { gt: new Date() },
        },
      });

      if (pendingInvite) {
        return NextResponse.json(
          { error: "User already has a pending invite" },
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
