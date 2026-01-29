import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Approve or reject an ownership claim
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { claimId } = await params;
    const body = await request.json();
    const { action, adminNotes } = body; // action: "approve" | "reject"

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get the claim
    const claim = await prisma.venueOwnershipClaim.findUnique({
      where: { id: claimId },
      include: {
        venue: true,
        user: true,
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Ownership claim not found" },
        { status: 404 }
      );
    }

    if (claim.status !== "PENDING") {
      return NextResponse.json(
        { error: "This claim has already been processed" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Check if venue already has an owner
      const existingOwner = await prisma.venueMember.findFirst({
        where: {
          venueId: claim.venueId,
          role: "OWNER",
        },
      });

      if (existingOwner) {
        return NextResponse.json(
          { error: "Venue already has an owner" },
          { status: 400 }
        );
      }

      // Use transaction to update claim and add user as owner
      const [updatedClaim] = await prisma.$transaction([
        // Update claim status
        prisma.venueOwnershipClaim.update({
          where: { id: claimId },
          data: {
            status: "APPROVED",
            adminNotes,
            reviewedAt: new Date(),
            reviewedBy: session.user.id,
          },
        }),
        // Add user as venue owner
        prisma.venueMember.upsert({
          where: {
            venueId_userId: {
              venueId: claim.venueId,
              userId: claim.userId,
            },
          },
          update: {
            role: "OWNER",
            status: "ACTIVE",
            joinedAt: new Date(),
          },
          create: {
            venueId: claim.venueId,
            userId: claim.userId,
            role: "OWNER",
            status: "ACTIVE",
            joinedAt: new Date(),
          },
        }),
        // Reject all other pending claims for the same venue
        prisma.venueOwnershipClaim.updateMany({
          where: {
            venueId: claim.venueId,
            id: { not: claimId },
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
            adminNotes: "Another user was approved as owner",
            reviewedAt: new Date(),
            reviewedBy: session.user.id,
          },
        }),
      ]);

      return NextResponse.json({
        ...updatedClaim,
        message: `${claim.user.name || claim.user.email} is now the owner of ${claim.venue.name}`,
      });
    } else {
      // Reject the claim
      const updatedClaim = await prisma.venueOwnershipClaim.update({
        where: { id: claimId },
        data: {
          status: "REJECTED",
          adminNotes,
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(updatedClaim);
    }
  } catch (error) {
    console.error("Error processing ownership claim:", error);
    return NextResponse.json(
      { error: "Failed to process ownership claim" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an ownership claim (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { claimId } = await params;

    await prisma.venueOwnershipClaim.delete({
      where: { id: claimId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ownership claim:", error);
    return NextResponse.json(
      { error: "Failed to delete ownership claim" },
      { status: 500 }
    );
  }
}
