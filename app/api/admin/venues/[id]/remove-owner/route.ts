import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Remove venue owner (admin only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = (await params).id;

    // Verify the venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Find and delete the current owner member
    const ownerMember = await prisma.venueMember.findFirst({
      where: {
        venueId,
        role: "OWNER",
      },
    });

    if (!ownerMember) {
      return NextResponse.json(
        { error: "No owner found for this venue" },
        { status: 404 }
      );
    }

    // Delete the owner membership
    await prisma.venueMember.delete({
      where: {
        id: ownerMember.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Owner removed successfully",
    });
  } catch (error) {
    console.error("Error removing venue owner:", error);
    return NextResponse.json(
      { error: "Failed to remove owner" },
      { status: 500 }
    );
  }
}
