import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all venues for admin (no filters)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venues = await prisma.venue.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        members: {
          where: {
            role: "OWNER",
            status: "ACTIVE",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Transform to include owner info at top level for easier access
    const venuesWithOwner = venues.map((venue) => ({
      ...venue,
      owner: venue.members[0]?.user || null,
    }));

    return NextResponse.json(venuesWithOwner);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}

// POST - Create new venue (admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      type,
      description,
      address,
      city,
      country,
      latitude,
      longitude,
    } = body;

    if (!name || !slug || !type || !address || !city || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        slug,
        type,
        description: description || null,
        address: address || null,
        city: city || null,
        country,
        latitude: latitude || null,
        longitude: longitude || null,
        createdByUserId: session.user.id,
      },
    });

    return NextResponse.json(venue);
  } catch (error) {
    console.error("Error creating venue:", error);
    return NextResponse.json(
      { error: "Failed to create venue" },
      { status: 500 }
    );
  }
}

// DELETE - Delete venue (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing venue ID" }, { status: 400 });
    }

    await prisma.venue.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting venue:", error);
    return NextResponse.json(
      { error: "Failed to delete venue" },
      { status: 500 }
    );
  }
}
