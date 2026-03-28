import { NextResponse } from "next/server";

/**
 * Vercel Cron wrapper for weather forecast updates.
 * Delegates to the existing /api/weather/update POST endpoint.
 *
 * Schedule: daily at 06:00 UTC (vercel.json)
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const weatherSecret = process.env.WEATHER_UPDATE_SECRET;

  if (!weatherSecret) {
    return NextResponse.json(
      { error: "WEATHER_UPDATE_SECRET not configured" },
      { status: 500 }
    );
  }

  const response = await fetch(`${baseUrl}/api/weather/update`, {
    method: "POST",
    headers: { Authorization: `Bearer ${weatherSecret}` },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
