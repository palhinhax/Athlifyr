import { NextResponse } from "next/server";

/**
 * Vercel Cron wrapper for giveaway draws.
 * Delegates to the existing /api/giveaways/draw POST endpoint.
 *
 * Schedule: daily at 12:05 UTC (vercel.json)
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const drawSecret = process.env.GIVEAWAY_DRAW_SECRET;

  if (!drawSecret) {
    return NextResponse.json(
      { error: "GIVEAWAY_DRAW_SECRET not configured" },
      { status: 500 }
    );
  }

  const response = await fetch(`${baseUrl}/api/giveaways/draw`, {
    method: "POST",
    headers: { Authorization: `Bearer ${drawSecret}` },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
