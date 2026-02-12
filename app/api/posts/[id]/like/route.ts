import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = (await params).id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.postLike.delete({
        where: { id: existingLike.id },
      });

      const likesCount = await prisma.postLike.count({
        where: { postId },
      });

      return NextResponse.json({
        liked: false,
        likesCount,
      });
    } else {
      // Like - add new like
      await prisma.postLike.create({
        data: {
          postId,
          userId: user.id,
        },
      });

      const likesCount = await prisma.postLike.count({
        where: { postId },
      });

      return NextResponse.json({
        liked: true,
        likesCount,
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
