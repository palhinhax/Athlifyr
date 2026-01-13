import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;

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
          userId: session.user.id,
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
          userId: session.user.id,
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
