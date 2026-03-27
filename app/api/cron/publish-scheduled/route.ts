import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishPost } from "@/lib/social/publisher";

/**
 * Auto-publish scheduled social posts.
 * Finds all posts with status SCHEDULED whose scheduledFor <= now,
 * and publishes them automatically via Instagram API.
 *
 * Runs every 5 minutes via Vercel Cron.
 *
 * Vercel Cron config (vercel.json):
 * { "path": "/api/cron/publish-scheduled", "schedule": "every 5 minutes" }
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all scheduled posts that are due
    const duePosts = await prisma.socialPost.findMany({
      where: {
        status: "SCHEDULED",
        scheduledFor: { lte: new Date() },
      },
      orderBy: { scheduledFor: "asc" },
      take: 5, // Process max 5 per run to avoid timeout
    });

    if (duePosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No scheduled posts due",
        published: 0,
      });
    }

    const results: Array<{
      postId: string;
      title: string | null;
      success: boolean;
      error?: string;
    }> = [];

    for (const post of duePosts) {
      const result = await publishPost({
        postId: post.id,
        userId: undefined, // System-initiated
      });

      results.push({
        postId: post.id,
        title: post.title,
        success: result.success,
        error: result.error,
      });

      // Small delay between posts to respect Instagram rate limits
      if (duePosts.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    const published = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Processed ${duePosts.length} post(s): ${published} published, ${failed} failed`,
      published,
      failed,
      results,
    });
  } catch (error) {
    console.error("Publish-scheduled cron error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
