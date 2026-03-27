import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCompilation } from "@/lib/social-api";
import { fetchEventsForSocial } from "@/lib/social-events";

export async function POST(request: NextRequest) {
  try {
    // Allow auth via session (admin UI) or shared secret (scheduler cron)
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.SOCIAL_API_SECRET;
    const isServiceCall =
      expectedSecret && authHeader === `Bearer ${expectedSecret}`;

    if (!isServiceCall) {
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = (await request.json()) as {
      accountId: string;
      mode: "weekly" | "monthly";
      sport?: string;
      lang?: string;
      scheduledAt?: string;
    };

    // Calculate days based on mode
    let days: number;
    if (body.mode === "weekly") {
      days = 7;
    } else {
      const now = new Date();
      const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      days = Math.ceil(
        (endOfNextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    // Fetch events server-side
    const events = await fetchEventsForSocial({
      days,
      sport: body.sport,
      limit: 30,
      lang: body.lang,
    });

    if (events.length === 0) {
      return NextResponse.json({
        message: "No events found for the selected period",
        created: 0,
        posts: [],
      });
    }

    const result = await generateCompilation({
      accountId: body.accountId,
      mode: body.mode,
      events,
      scheduledAt: body.scheduledAt,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating compilation post:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate compilation",
      },
      { status: 500 }
    );
  }
}
