import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * POST /api/admin/social/posts/[id]/publish-feed
 *
 * Publishes a SocialPost as a public feed Post in the app.
 * Copies caption, images (single or carousel), and marks as auto-post.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const socialPost = await prisma.socialPost.findUnique({
      where: { id },
    });

    if (!socialPost) {
      return NextResponse.json(
        { error: "Social post not found" },
        { status: 404 }
      );
    }

    if (!socialPost.imageUrl && socialPost.mediaUrls.length === 0) {
      return NextResponse.json(
        { error: "Post must have at least one image" },
        { status: 400 }
      );
    }

    // Build content: caption + hashtags
    let content = socialPost.caption;
    if (socialPost.hashtags.length > 0) {
      const hashtagString = socialPost.hashtags
        .map((tag) => `#${tag.replace(/^#/, "")}`)
        .join(" ");
      content = `${content}\n\n${hashtagString}`;
    }

    // Determine media URLs for carousel
    const allImages =
      socialPost.mediaUrls.length >= 2
        ? socialPost.mediaUrls
        : socialPost.imageUrl
          ? [socialPost.imageUrl]
          : [];

    // Create feed post
    const feedPost = await prisma.post.create({
      data: {
        userId: session.user.id,
        content,
        imageUrl: allImages[0] ?? null,
        mediaUrls: allImages.length > 1 ? allImages : [],
        mediaType: "image",
        isAutoPost: true,
        isPublic: true,
        postType: "STANDARD",
      },
    });

    // Log the action on the social post
    await prisma.socialPostLog.create({
      data: {
        postId: socialPost.id,
        action: "published-to-feed",
        details: {
          feedPostId: feedPost.id,
          imageCount: allImages.length,
        } as Prisma.InputJsonValue,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      feedPostId: feedPost.id,
      imageCount: allImages.length,
    });
  } catch (error) {
    console.error("Error publishing to feed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to publish to feed",
      },
      { status: 500 }
    );
  }
}
