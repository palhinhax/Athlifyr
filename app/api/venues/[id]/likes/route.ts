import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/venues/[id]/likes
 * Get recommendation count and user's recommendation status for a venue
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAuthUser(request);
    const { id: venueId } = await Promise.resolve(params);

    // Get total recommendation count
    const recommendationCount = await prisma.venueRecommendation.count({
      where: { venueId },
    });

    // Check if current user has recommended
    let userHasRecommended = false;
    if (currentUser?.id) {
      const userRecommendation = await prisma.venueRecommendation.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId: currentUser.id,
          },
        },
      });
      userHasRecommended = !!userRecommendation;
    }

    return NextResponse.json({
      recommendationCount,
      userHasRecommended,
    });
  } catch (error) {
    console.error("Error fetching venue recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch venue recommendations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/venues/[id]/likes
 * Toggle recommendation for a venue (add if not exists, remove if exists)
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

    // Check if venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Check if user already recommended
    const existingRecommendation = await prisma.venueRecommendation.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: user.id,
        },
      },
    });

    if (existingRecommendation) {
      // Remove recommendation
      await prisma.venueRecommendation.delete({
        where: {
          id: existingRecommendation.id,
        },
      });

      // Get updated count
      const recommendationCount = await prisma.venueRecommendation.count({
        where: { venueId },
      });

      return NextResponse.json({
        success: true,
        action: "unrecommended",
        recommendationCount,
        userHasRecommended: false,
      });
    } else {
      // Add recommendation
      await prisma.venueRecommendation.create({
        data: {
          venueId,
          userId: user.id,
        },
      });

      // Get updated count
      const recommendationCount = await prisma.venueRecommendation.count({
        where: { venueId },
      });

      return NextResponse.json({
        success: true,
        action: "recommended",
        recommendationCount,
        userHasRecommended: true,
      });
    }
  } catch (error) {
    console.error("Error toggling venue recommendation:", error);
    return NextResponse.json(
      { error: "Failed to toggle venue recommendation" },
      { status: 500 }
    );
  }
}
