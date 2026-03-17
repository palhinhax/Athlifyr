import { NextResponse } from "next/server";
import { executeWeeklySettlement } from "@/lib/credits";

/**
 * Weekly settlement cron job.
 * Processes all pending venue ledger entries and transfers funds via Stripe Connect.
 *
 * Vercel Cron config (add to vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/credit-settlement",
 *     "schedule": "0 4 * * 1"  // Every Monday at 4am UTC
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await executeWeeklySettlement();

    return NextResponse.json({
      success: true,
      processedVenues: result.processedVenues,
      totalTransferredCents: result.totalTransferred,
      errorsCount: result.errors.length,
      errors: result.errors,
    });
  } catch (error) {
    console.error("Settlement cron error:", error);
    return NextResponse.json(
      { error: "Settlement processing failed" },
      { status: 500 }
    );
  }
}
