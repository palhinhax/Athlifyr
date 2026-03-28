import { NextResponse } from "next/server";

const SCRAPING_API_URL = process.env.SCRAPING_API_URL;
const SCRAPING_API_KEY = process.env.SCRAPING_API_KEY;

/**
 * Vercel Cron — fires scraping pipeline (fire-and-forget).
 *
 * 1. POST /runs/all — scrapes all active sources
 * 2. POST /ai/process-queue — AI post-processing
 *
 * Both calls are dispatched without waiting for completion.
 * The Python scraping service handles the long-running work.
 *
 * Schedule: daily at 12:00 UTC (vercel.json)
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SCRAPING_API_URL || !SCRAPING_API_KEY) {
    return NextResponse.json(
      { error: "Scraping API not configured" },
      { status: 500 }
    );
  }

  const headers = {
    "X-API-Key": SCRAPING_API_KEY,
    "Content-Type": "application/json",
  };

  // Fire-and-forget: scrape all sources, then process AI queue
  // We don't await the full response — just confirm the request was accepted
  fetch(`${SCRAPING_API_URL}/runs/all`, {
    method: "POST",
    headers,
  })
    .then((res) =>
      console.log(`[cron/scrape-events] /runs/all responded ${res.status}`)
    )
    .catch((err) =>
      console.error(`[cron/scrape-events] /runs/all failed:`, err)
    );

  // Delay AI processing slightly so scraping has a head start
  setTimeout(() => {
    fetch(`${SCRAPING_API_URL}/ai/process-queue?limit=20`, {
      method: "POST",
      headers,
    })
      .then((res) =>
        console.log(
          `[cron/scrape-events] /ai/process-queue responded ${res.status}`
        )
      )
      .catch((err) =>
        console.error(`[cron/scrape-events] /ai/process-queue failed:`, err)
      );
  }, 5000);

  return NextResponse.json({
    success: true,
    message: "Scraping pipeline dispatched (fire-and-forget)",
    target: SCRAPING_API_URL,
  });
}
