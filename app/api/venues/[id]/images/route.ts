import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all images for a venue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const images = await prisma.venueImage.findMany({
      where: { venueId: id },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching venue images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST - Add a new image to a venue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { imageUrl, caption } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Check if user is owner or admin of the venue
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const isOwner = venue.createdByUserId === session.user.id;
    const isAdmin = venue.members.some(
      (m) => m.role === "OWNER" || m.role === "ADMIN"
    );
    const isSuperAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin && !isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the highest order value
    const maxOrder = await prisma.venueImage.aggregate({
      where: { venueId: id },
      _max: { order: true },
    });

    const newOrder = (maxOrder._max.order ?? -1) + 1;

    const image = await prisma.venueImage.create({
      data: {
        venueId: id,
        imageUrl,
        caption: caption || null,
        order: newOrder,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error adding venue image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to add image", details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Remove an image from a venue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Check if user is owner or admin of the venue
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const isOwner = venue.createdByUserId === session.user.id;
    const isAdmin = venue.members.some(
      (m) => m.role === "OWNER" || m.role === "ADMIN"
    );
    const isSuperAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin && !isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the image
    await prisma.venueImage.delete({
      where: { id: imageId, venueId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting venue image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

// PATCH - Update image order or caption
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { imageId, caption, order, reorderImages } = body;

    // Check if user is owner or admin of the venue
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const isOwner = venue.createdByUserId === session.user.id;
    const isAdmin = venue.members.some(
      (m) => m.role === "OWNER" || m.role === "ADMIN"
    );
    const isSuperAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin && !isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Handle batch reorder
    if (reorderImages && Array.isArray(reorderImages)) {
      await prisma.$transaction(
        reorderImages.map((item: { id: string; order: number }) =>
          prisma.venueImage.update({
            where: { id: item.id, venueId: id },
            data: { order: item.order },
          })
        )
      );

      return NextResponse.json({ success: true });
    }

    // Handle single image update
    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const updateData: { caption?: string | null; order?: number } = {};
    if (caption !== undefined) updateData.caption = caption;
    if (order !== undefined) updateData.order = order;

    const image = await prisma.venueImage.update({
      where: { id: imageId, venueId: id },
      data: updateData,
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating venue image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}
