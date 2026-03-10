import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireIntegrity } from "@/lib/verify-integrity";
import { notifyEventNewPost } from "@/lib/notifications";

// Schema for creating a post
const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000),
  imageUrl: z.url().optional(),
  mediaType: z.enum(["image", "video"]).default("image"),
  eventId: z.cuid2().optional(),
  venueId: z.cuid2().optional(),
  isPublic: z.boolean().default(false), // Public posts appear in main feed, private posts only in venue/event
  // WOD Post fields
  workoutId: z.cuid2().optional(),
  sessionId: z.cuid2().optional(),
  postType: z
    .enum(["STANDARD", "WOD", "EVENT", "ACHIEVEMENT"])
    .default("STANDARD"),
});

type CreatePostData = z.infer<typeof createPostSchema>;

/** Validate that referenced entities (event, venue, workout) exist. */
async function validatePostReferences(
  data: CreatePostData,
  userId: string
): Promise<NextResponse | null> {
  if (data.eventId) {
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
  }

  if (data.venueId) {
    const venue = await prisma.venue.findUnique({
      where: { id: data.venueId },
    });
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }
  }

  if (data.workoutId) {
    const workout = await prisma.workout.findFirst({
      where: {
        id: data.workoutId,
        OR: [
          { createdById: userId },
          { isPublic: true },
          { venueId: data.venueId },
        ],
      },
    });
    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found or access denied" },
        { status: 404 }
      );
    }
  }

  return null;
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const integrityError = await requireIntegrity(request);
    if (integrityError) return integrityError;

    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Log for debugging image URL issues
    if (validatedData.imageUrl) {
      console.log("Creating post with image URL:", validatedData.imageUrl);
    }

    // Validate referenced entities exist
    const validationError = await validatePostReferences(
      validatedData,
      user.id
    );
    if (validationError) return validationError;

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl || null,
        mediaType: validatedData.imageUrl ? validatedData.mediaType : null,
        eventId: validatedData.eventId,
        venueId: validatedData.venueId,
        isPublic: validatedData.isPublic, // Allow public/private control
        workoutId: validatedData.workoutId,
        sessionId: validatedData.sessionId,
        postType: validatedData.postType,
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
            logo: true,
            coverImage: true,
          },
        },
        workout: validatedData.workoutId
          ? {
              select: {
                id: true,
                name: true,
                description: true,
                estimatedTime: true,
                difficulty: true,
                blocks: {
                  orderBy: { orderIndex: "asc" },
                  select: {
                    id: true,
                    type: true,
                    name: true,
                    timeCap: true,
                    rounds: true,
                    workTime: true,
                    notes: true,
                    exercises: {
                      orderBy: { orderIndex: "asc" },
                      select: {
                        id: true,
                        prescribedReps: true,
                        prescribedWeight: true,
                        prescribedWeightFemale: true,
                        exercise: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            }
          : undefined,
      },
    });

    // Notify event participants about the new post (fire-and-forget)
    if (validatedData.eventId && post.event) {
      notifyEventNewPost({
        eventId: validatedData.eventId,
        eventSlug: post.event.slug,
        eventTitle: post.event.title,
        authorId: user.id,
        authorName: user.name || "Someone",
      }).catch((err: Error) =>
        console.error("Failed to notify event new post:", err)
      );
    }

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

// GET /api/posts?eventId=xxx or ?userId=xxx or ?venueId=xxx or ?feed=true - Get posts with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");
    const venueId = searchParams.get("venueId");
    const feed = searchParams.get("feed"); // Main feed: only public posts + user's event posts
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");

    // Get user to check likes
    const user = await getAuthenticatedUser(request);
    const currentUserId = user?.id;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: Record<string, any> = {};

    if (feed === "true" && currentUserId) {
      // Main feed: public posts + posts from events user participates in
      const userParticipations = await prisma.participation.findMany({
        where: { userId: currentUserId, status: "going" },
        select: { eventId: true },
      });
      const participatingEventIds = userParticipations.map((p) => p.eventId);

      where = {
        OR: [
          { isPublic: true },
          ...(participatingEventIds.length > 0
            ? [{ eventId: { in: participatingEventIds } }]
            : []),
        ],
      };
    } else if (feed === "true") {
      // Not logged in: only public posts
      where = { isPublic: true };
    } else {
      if (eventId) where.eventId = eventId;
      if (userId) where.userId = userId;
      if (venueId) where.venueId = venueId;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.post.count({ where });

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
        workout: {
          select: {
            id: true,
            name: true,
            description: true,
            estimatedTime: true,
            difficulty: true,
            blocks: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                type: true,
                name: true,
                timeCap: true,
                rounds: true,
                workTime: true,
                notes: true,
                exercises: {
                  orderBy: { orderIndex: "asc" },
                  select: {
                    id: true,
                    prescribedReps: true,
                    prescribedWeight: true,
                    prescribedWeightFemale: true,
                    prescribedDistance: true,
                    prescribedTime: true,
                    notes: true,
                    exercise: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
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
    const integrityError = await requireIntegrity(request);
    if (integrityError) return integrityError;

    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
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

    if (post.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete post
    await prisma.post.delete({
      where: { id: postId },
    });

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
