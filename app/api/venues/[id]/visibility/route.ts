import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_TABS = [
  "feed",
  "about",
  "plans",
  "sessions",
  "team",
  "clients",
  "subscriptions",
];

// PATCH - Update venue visibility settings
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can manage this venue (must be owner)
    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      select: {
        id: true,
        createdByUserId: true,
        members: {
          where: {
            userId: session.user.id,
            status: "ACTIVE",
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Only owner can change visibility settings
    const isOwner = venue.createdByUserId === session.user.id;
    const isAppAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAppAdmin) {
      return NextResponse.json(
        { error: "Only the owner can change visibility settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { visibleTabs } = body;

    // Validate visibleTabs
    if (!Array.isArray(visibleTabs)) {
      return NextResponse.json(
        { error: "visibleTabs must be an array" },
        { status: 400 }
      );
    }

    // Ensure at least one tab is visible
    if (visibleTabs.length === 0) {
      return NextResponse.json(
        { error: "At least one tab must be visible" },
        { status: 400 }
      );
    }

    // Validate each tab
    const invalidTabs = visibleTabs.filter(
      (tab: string) => !VALID_TABS.includes(tab)
    );
    if (invalidTabs.length > 0) {
      return NextResponse.json(
        { error: `Invalid tabs: ${invalidTabs.join(", ")}` },
        { status: 400 }
      );
    }

    // Update venue visibility settings
    const updatedVenue = await prisma.venue.update({
      where: { id: venue.id },
      data: {
        visibleTabs,
      },
      select: {
        id: true,
        visibleTabs: true,
      },
    });

    return NextResponse.json(updatedVenue);
  } catch (error) {
    console.error("[VENUE_VISIBILITY_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get venue visibility settings
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      select: {
        id: true,
        visibleTabs: true,
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json(venue);
  } catch (error) {
    console.error("[VENUE_VISIBILITY_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
