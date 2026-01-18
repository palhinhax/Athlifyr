import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { VenueRole } from "@prisma/client";
import crypto from "crypto";

// POST - Create invite
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = params;

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
