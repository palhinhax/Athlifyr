import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/venues/[id]/reviews/[reviewId]/replies - Get all replies for a review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const replies = await prisma.venueReviewReply.findMany({
      where: {
        reviewId: params.reviewId,
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
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Error fetching review replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

// POST /api/venues/[id]/reviews/[reviewId]/replies - Add a reply (admin/owner only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin/owner of the venue
    const venueMember = await prisma.venueMember.findFirst({
      where: {
        venueId: params.id,
        userId: session.user.id,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!venueMember) {
      return NextResponse.json(
        { error: "Only venue owners/admins can reply to reviews" },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length < 10 || trimmedContent.length > 1000) {
      return NextResponse.json(
        { error: "Reply must be between 10 and 1000 characters" },
        { status: 400 }
      );
    }

    // Verify review exists and belongs to this venue
    const review = await prisma.venueReview.findFirst({
      where: {
        id: params.reviewId,
        venueId: params.id,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const reply = await prisma.venueReviewReply.create({
      data: {
        reviewId: params.reviewId,
        userId: session.user.id,
        content: trimmedContent,
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

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}

// DELETE /api/venues/[id]/reviews/[reviewId]/replies - Delete a reply
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const replyId = searchParams.get("replyId");

    if (!replyId) {
      return NextResponse.json(
        { error: "Reply ID is required" },
        { status: 400 }
      );
    }

    // Find the reply
    const reply = await prisma.venueReviewReply.findUnique({
      where: { id: replyId },
      include: {
        review: true,
      },
    });

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    // Check if user is the author or admin/owner of venue
    const isAuthor = reply.userId === session.user.id;
    const venueMember = await prisma.venueMember.findFirst({
      where: {
        venueId: params.id,
        userId: session.user.id,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!isAuthor && !venueMember) {
      return NextResponse.json(
        { error: "Not authorized to delete this reply" },
        { status: 403 }
      );
    }

    await prisma.venueReviewReply.delete({
      where: { id: replyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reply:", error);
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}
