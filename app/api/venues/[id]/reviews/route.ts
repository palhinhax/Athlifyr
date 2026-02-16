import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/venues/[id]/reviews
 * Get all reviews for a venue
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: venueId } = await Promise.resolve(params);

    const reviews = await prisma.venueReview.findMany({
      where: { venueId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching venue reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch venue reviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/venues/[id]/reviews
 * Create or update a review for a venue
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await Promise.resolve(params);
    const body = await request.json();
    const { content } = body;

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Review content is required" },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: "Review must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Review must be less than 2000 characters" },
        { status: 400 }
      );
    }

    // Check if venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Upsert review (create or update)
    const review = await prisma.venueReview.upsert({
      where: {
        venueId_userId: {
          venueId,
          userId: user.id,
        },
      },
      update: {
        content: content.trim(),
      },
      create: {
        venueId,
        userId: user.id,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error creating/updating venue review:", error);
    return NextResponse.json(
      { error: "Failed to create/update venue review" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/venues/[id]/reviews
 * Delete user's review for a venue
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await Promise.resolve(params);

    // Check if review exists
    const review = await prisma.venueReview.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: user.id,
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Delete review
    await prisma.venueReview.delete({
      where: {
        id: review.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting venue review:", error);
    return NextResponse.json(
      { error: "Failed to delete venue review" },
      { status: 500 }
    );
  }
}
