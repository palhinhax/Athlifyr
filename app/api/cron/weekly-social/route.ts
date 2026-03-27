import { NextResponse } from "next/server";
import { generateWeeklyCompilation } from "@/lib/social/compilation-generator";

/**
 * Weekly social media compilation cron job.
 * Generates a visual compilation image of upcoming events.
 *
 * Behavior depends on SOCIAL_AUTO_PUBLISH env var:
 * - Not set or "false": Creates a DRAFT for admin review
 * - "true": Auto-schedules for the same day at the configured hour (default: 12:00 UTC)
 *
 * The publish-scheduled cron (every 5 min) picks up SCHEDULED posts and publishes them.
 *
 * Runs every Wednesday at 9:00 UTC.
 *
 * Vercel Cron config (vercel.json):
 * { "path": "/api/cron/weekly-social", "schedule": "0 9 * * 3" }
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine if we should auto-schedule
    const autoPublish = process.env.SOCIAL_AUTO_PUBLISH === "true";
    let scheduledFor: Date | undefined;

    if (autoPublish) {
      // Schedule for the same day at 12:00 UTC (lunch time in Portugal = 12:00/13:00 local)
      const publishHour = parseInt(process.env.SOCIAL_PUBLISH_HOUR ?? "12", 10);
      scheduledFor = new Date();
      scheduledFor.setUTCHours(publishHour, 0, 0, 0);

      // If that time already passed today, schedule for right now + 5 minutes
      if (scheduledFor <= new Date()) {
        scheduledFor = new Date(Date.now() + 5 * 60 * 1000);
      }
    }

    const result = await generateWeeklyCompilation({
      days: 7,
      scheduledFor,
    });

    if (!result) {
      return NextResponse.json({
        success: true,
        message: "No events found for this week",
        created: 0,
      });
    }

    return NextResponse.json({
      success: true,
      message: autoPublish
        ? `Weekly compilation auto-scheduled for ${scheduledFor?.toISOString()}`
        : `Weekly compilation draft created with ${result.eventCount} events`,
      postId: result.id,
      title: result.title,
      imageUrl: result.imageUrl,
      eventCount: result.eventCount,
      autoScheduled: autoPublish,
      scheduledFor: scheduledFor?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Weekly social cron error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
