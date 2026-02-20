/**
 * GET /api/ai-usage/status
 *
 * Returns the AI analysis rate-limit status for the authenticated user.
 * Used by the frontend to show whether AI is available or when it will be.
 *
 * Response 200:
 * {
 *   allowed: boolean,
 *   nextAvailableAt?: string (ISO),
 *   remainingMs?: number
 * }
 *
 * Response 401: { error: "Unauthorized" }
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAiRateLimit } from "@/lib/ai-rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await checkAiRateLimit(session.user.id);

  return NextResponse.json({
    allowed: result.allowed,
    nextAvailableAt: result.nextAvailableAt?.toISOString() ?? null,
    remainingMs: result.remainingMs ?? null,
  });
}
