import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/user/delete-data
 * Delete specific categories of user data without deleting the account
 * GDPR Compliance - Right to Erasure (Partial)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { categories } = body;

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: "Invalid categories" },
        { status: 400 }
      );
    }

    const deletedCategories: string[] = [];

    // Delete data based on selected categories
    await prisma.$transaction(async (tx) => {
      // Delete posts and related data
      if (categories.includes("posts")) {
        // Delete likes on user's posts
        await tx.postLike.deleteMany({
          where: {
            post: {
              userId,
            },
          },
        });

        // Delete comments on user's posts
        await tx.postComment.deleteMany({
          where: {
            post: {
              userId,
            },
          },
        });

        // Delete the posts
        await tx.post.deleteMany({
          where: { userId },
        });

        deletedCategories.push("posts");
      }

      // Delete comments (on posts and events)
      if (categories.includes("comments")) {
        await tx.postComment.deleteMany({
          where: { userId },
        });

        await tx.comment.deleteMany({
          where: { userId },
        });

        deletedCategories.push("comments");
      }

      // Delete likes
      if (categories.includes("likes")) {
        await tx.postLike.deleteMany({
          where: { userId },
        });

        deletedCategories.push("likes");
      }

      // Delete event participations (past events only)
      if (categories.includes("participations")) {
        await tx.participation.deleteMany({
          where: {
            userId,
            event: {
              endDate: {
                lt: new Date(),
              },
            },
          },
        });

        deletedCategories.push("participations");
      }

      // Delete profile photos
      if (categories.includes("photos")) {
        await tx.profilePhoto.deleteMany({
          where: { userId },
        });

        deletedCategories.push("photos");
      }

      // Delete friendships
      if (categories.includes("friendships")) {
        await tx.friendship.deleteMany({
          where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
          },
        });

        deletedCategories.push("friendships");
      }

      // Delete preferences
      if (categories.includes("preferences")) {
        await tx.mapPreferences.deleteMany({
          where: { userId },
        });

        await tx.eventsPreferences.deleteMany({
          where: { userId },
        });

        deletedCategories.push("preferences");
      }

      // Delete Instagram drafts
      if (categories.includes("drafts")) {
        await tx.instagramPostDraft.deleteMany({
          where: { userId },
        });

        deletedCategories.push("drafts");
      }
    });

    return NextResponse.json({
      success: true,
      message: "Selected data deleted successfully",
      deletedCategories,
    });
  } catch (error) {
    console.error("Error deleting user data:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
