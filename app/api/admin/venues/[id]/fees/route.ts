import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update venue commission fees (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commissionType, commissionValue } = await request.json();
    const venueId = (await params).id;

    // Validate input
    if (!commissionType || commissionValue === undefined) {
      return NextResponse.json(
        { error: "Commission type and value are required" },
        { status: 400 }
      );
    }

    if (!["PERCENT", "FIXED"].includes(commissionType)) {
      return NextResponse.json(
        { error: "Invalid commission type. Must be PERCENT or FIXED" },
        { status: 400 }
      );
    }

    const value = parseInt(commissionValue);
    if (isNaN(value) || value < 0) {
      return NextResponse.json(
        { error: "Commission value must be a positive number" },
        { status: 400 }
      );
    }

    // Verify the venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Update venue commission settings
    const updatedVenue = await prisma.venue.update({
      where: { id: venueId },
      data: {
        commissionType,
        commissionValue: value,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        commissionType: true,
        commissionValue: true,
      },
    });

    return NextResponse.json(updatedVenue);
  } catch (error) {
    console.error("Error updating venue fees:", error);
    return NextResponse.json(
      { error: "Failed to update venue fees" },
      { status: 500 }
    );
  }
}
