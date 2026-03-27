import { prisma } from "@/lib/prisma";
import type { Prisma, SocialPostStatus } from "@prisma/client";
import {
  publishImageToInstagram,
  publishCarouselToInstagram,
  InstagramApiError,
} from "@/lib/social/instagram-api";

// ─── Post Status Transitions ─────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<SocialPostStatus, SocialPostStatus[]> = {
  DRAFT: ["SCHEDULED", "PUBLISHING", "CANCELLED"],
  SCHEDULED: ["PUBLISHING", "CANCELLED", "DRAFT"],
  PUBLISHING: ["PUBLISHED", "FAILED"],
  PUBLISHED: [],
  FAILED: ["DRAFT", "PUBLISHING", "CANCELLED"],
  CANCELLED: ["DRAFT"],
};

function canTransition(from: SocialPostStatus, to: SocialPostStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Logging Helper ──────────────────────────────────────────────────────────

async function logAction(params: {
  postId: string;
  action: string;
  details?: Record<string, unknown>;
  userId?: string;
}): Promise<void> {
  await prisma.socialPostLog.create({
    data: {
      postId: params.postId,
      action: params.action,
      details: (params.details as Prisma.InputJsonValue) ?? undefined,
      userId: params.userId,
    },
  });
}

// ─── Schedule Post ───────────────────────────────────────────────────────────

export async function schedulePost(params: {
  postId: string;
  scheduledFor: Date;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: params.postId },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (!canTransition(post.status, "SCHEDULED")) {
    return {
      success: false,
      error: `Cannot schedule a post with status "${post.status}"`,
    };
  }

  if (params.scheduledFor <= new Date()) {
    return { success: false, error: "Scheduled date must be in the future" };
  }

  await prisma.socialPost.update({
    where: { id: params.postId },
    data: { status: "SCHEDULED", scheduledFor: params.scheduledFor },
  });

  await logAction({
    postId: params.postId,
    action: "scheduled",
    details: { scheduledFor: params.scheduledFor.toISOString() },
    userId: params.userId,
  });

  return { success: true };
}

// ─── Publish Post ────────────────────────────────────────────────────────────
// Publishes to Instagram via the Graph API.
// Creates a media container (image + caption) and publishes it.

export async function publishPost(params: {
  postId: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: params.postId },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (!canTransition(post.status, "PUBLISHING")) {
    return {
      success: false,
      error: `Cannot publish a post with status "${post.status}"`,
    };
  }

  // Validate minimum requirements
  if (!post.caption || post.caption.trim().length === 0) {
    return { success: false, error: "Post must have a caption" };
  }

  if (!post.imageUrl || post.imageUrl.trim().length === 0) {
    return {
      success: false,
      error: "Post must have an image URL to publish to Instagram",
    };
  }

  // Transition to PUBLISHING
  await prisma.socialPost.update({
    where: { id: params.postId },
    data: { status: "PUBLISHING" },
  });

  await logAction({
    postId: params.postId,
    action: "publishing",
    details: { initiatedBy: params.userId ?? "system" },
    userId: params.userId,
  });

  try {
    // Use carousel if multiple media URLs, otherwise single image
    const isCarousel = post.mediaUrls.length >= 2;
    const result = isCarousel
      ? await publishCarouselToInstagram({
          imageUrls: post.mediaUrls,
          caption: post.caption,
          hashtags: post.hashtags,
        })
      : await publishImageToInstagram({
          imageUrl: post.imageUrl,
          caption: post.caption,
          hashtags: post.hashtags,
        });

    if (!result.success) {
      throw new Error(result.error ?? "Unknown Instagram API error");
    }

    // Success — update post with external data
    await prisma.socialPost.update({
      where: { id: params.postId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        externalPostId: result.externalPostId ?? null,
        externalUrl: result.externalUrl ?? null,
        errorMessage: null,
      },
    });

    await logAction({
      postId: params.postId,
      action: "published",
      details: {
        externalPostId: result.externalPostId,
        externalUrl: result.externalUrl,
      },
      userId: params.userId,
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof InstagramApiError
        ? `Instagram API error (${error.code}): ${error.message}`
        : error instanceof Error
          ? error.message
          : "Unknown publishing error";

    await prisma.socialPost.update({
      where: { id: params.postId },
      data: {
        status: "FAILED",
        errorMessage,
        retryCount: { increment: 1 },
      },
    });

    await logAction({
      postId: params.postId,
      action: "failed",
      details: { reason: errorMessage },
      userId: params.userId,
    });

    return { success: false, error: errorMessage };
  }
}

// ─── Cancel Post ─────────────────────────────────────────────────────────────

export async function cancelPost(params: {
  postId: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: params.postId },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (!canTransition(post.status, "CANCELLED")) {
    return {
      success: false,
      error: `Cannot cancel a post with status "${post.status}"`,
    };
  }

  await prisma.socialPost.update({
    where: { id: params.postId },
    data: { status: "CANCELLED" },
  });

  await logAction({
    postId: params.postId,
    action: "cancelled",
    userId: params.userId,
  });

  return { success: true };
}

// ─── Retry Failed Post ──────────────────────────────────────────────────────

export async function retryPost(params: {
  postId: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: params.postId },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (post.status !== "FAILED") {
    return { success: false, error: "Only failed posts can be retried" };
  }

  // Reset to DRAFT so admin can review and re-publish
  await prisma.socialPost.update({
    where: { id: params.postId },
    data: {
      status: "DRAFT",
      errorMessage: null,
    },
  });

  await logAction({
    postId: params.postId,
    action: "retried",
    details: { previousRetryCount: post.retryCount },
    userId: params.userId,
  });

  return { success: true };
}

// ─── Duplicate Post ──────────────────────────────────────────────────────────

export async function duplicatePost(params: {
  postId: string;
  userId?: string;
}): Promise<{ success: boolean; newPostId?: string; error?: string }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: params.postId },
  });

  if (!post) return { success: false, error: "Post not found" };

  const newPost = await prisma.socialPost.create({
    data: {
      platform: post.platform,
      type: post.type,
      status: "DRAFT",
      title: `${post.title} (cópia)`,
      caption: post.caption,
      hashtags: post.hashtags,
      callToAction: post.callToAction,
      imageUrl: post.imageUrl,
      mediaUrls: post.mediaUrls,
      metadata: post.metadata ?? undefined,
      createdById: params.userId,
    },
  });

  await logAction({
    postId: newPost.id,
    action: "created",
    details: { source: "duplicate", originalPostId: params.postId },
    userId: params.userId,
  });

  return { success: true, newPostId: newPost.id };
}

// ─── Update Post ─────────────────────────────────────────────────────────────

export async function updatePost(params: {
  postId: string;
  data: {
    title?: string;
    caption?: string;
    hashtags?: string[];
    callToAction?: string;
    imageUrl?: string | null;
  };
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: params.postId },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (post.status !== "DRAFT" && post.status !== "FAILED") {
    return {
      success: false,
      error: "Only DRAFT or FAILED posts can be edited",
    };
  }

  await prisma.socialPost.update({
    where: { id: params.postId },
    data: params.data,
  });

  await logAction({
    postId: params.postId,
    action: "edited",
    details: { fields: Object.keys(params.data) },
    userId: params.userId,
  });

  return { success: true };
}

// ─── Delete Post ─────────────────────────────────────────────────────────────

export async function deletePost(params: {
  postId: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const post = await prisma.socialPost.findUnique({
    where: { id: params.postId },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (post.status === "PUBLISHED") {
    return { success: false, error: "Published posts cannot be deleted" };
  }

  await prisma.socialPost.delete({ where: { id: params.postId } });

  return { success: true };
}
