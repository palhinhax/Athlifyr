import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/user/delete-account
 * Delete user account and all associated data (GDPR - Right to be Forgotten)
 */
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete all user data in correct order (respecting foreign key constraints)
    await prisma.$transaction(async (tx) => {
      // Delete post likes
      await tx.postLike.deleteMany({
        where: { userId },
      });

      // Delete post comments
      await tx.postComment.deleteMany({
        where: { userId },
      });

      // Delete event comments
      await tx.comment.deleteMany({
        where: { userId },
      });

      // Delete likes and comments on user's posts
      await tx.postLike.deleteMany({
        where: {
          post: {
            userId,
          },
        },
      });

      await tx.postComment.deleteMany({
        where: {
          post: {
            userId,
          },
        },
      });

      // Delete posts
      await tx.post.deleteMany({
        where: { userId },
      });

      // Delete event participations
      await tx.participation.deleteMany({
        where: { userId },
      });

      // Delete profile photos
      await tx.profilePhoto.deleteMany({
        where: { userId },
      });

      // Delete friendships (both sent and received)
      await tx.friendship.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      // Delete Instagram drafts if any
      await tx.instagramPostDraft.deleteMany({
        where: { userId },
      });

      // Delete map preferences
      await tx.mapPreferences.deleteMany({
        where: { userId },
      });

      // Delete events preferences
      await tx.eventsPreferences.deleteMany({
        where: { userId },
      });

      // Finally, delete the user account
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
