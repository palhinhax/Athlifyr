import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for creating a post
const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000),
  imageUrl: z.string().url().optional(),
  mediaType: z.enum(["image", "video"]).default("image"),
  eventId: z.string().cuid().optional(),
  venueId: z.string().cuid().optional(),
  isPublic: z.boolean().default(false), // Public posts appear in main feed, private posts only in venue/event
});

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Log for debugging image URL issues
    if (validatedData.imageUrl) {
      console.log("Creating post with image URL:", validatedData.imageUrl);
    }

    // If eventId provided, check if event exists
    if (validatedData.eventId) {
      const event = await prisma.event.findUnique({
        where: { id: validatedData.eventId },
      });

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
    }

    // If venueId provided, check if venue exists
    if (validatedData.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: validatedData.venueId },
      });

      if (!venue) {
        return NextResponse.json({ error: "Venue not found" }, { status: 404 });
      }
    }

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl || null,
        mediaType: validatedData.imageUrl ? validatedData.mediaType : null,
        eventId: validatedData.eventId,
        venueId: validatedData.venueId,
        isPublic: validatedData.isPublic, // Allow public/private control
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/posts?eventId=xxx or ?userId=xxx or ?venueId=xxx - Get posts with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");
    const venueId = searchParams.get("venueId");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const where: { eventId?: string; userId?: string; venueId?: string } = {};
    if (eventId) where.eventId = eventId;
    if (userId) where.userId = userId;
    if (venueId) where.venueId = venueId;

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.post.count({ where });

    // Get session to check likes
    const session = await auth();
    const currentUserId = session?.user?.id;

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            startDate: true,
            endDate: true,
            city: true,
            country: true,
            imageUrl: true,
            isFeatured: true,
            sportTypes: true,
            variants: {
              select: {
                id: true,
                name: true,
                distanceKm: true,
              },
              take: 6,
            },
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: currentUserId
          ? {
              where: {
                userId: currentUserId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    // Return paginated response with metadata
    return NextResponse.json(
      {
        posts,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          hasMore: skip + posts.length < totalCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts?id=xxx - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists and belongs to user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, imageUrl: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete post
    await prisma.post.delete({
      where: { id: postId },
    });

    // TODO: Delete image from B2 if exists
    // if (post.imageUrl) {
    //   await deleteFromB2(post.imageUrl);
    // }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
