import { prisma } from "@/lib/prisma";

export const AI_DAILY_LIMIT = 10; // Max AI analyses per 24-hour rolling window
const AI_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AiRateLimitResult {
  allowed: boolean;
  /** When the next AI analysis will be available (only set when blocked) */
  nextAvailableAt?: Date;
  /** Remaining milliseconds until next AI analysis (only set when blocked) */
  remainingMs?: number;
  /** How many AI analyses the user has used in the current window */
  usedCount?: number;
}

/**
 * Check whether a user is allowed to use AI analysis.
 * Each user gets up to AI_DAILY_LIMIT AI-powered analyses per 24-hour rolling window.
 *
 * @param userId - The authenticated user's ID
 * @returns Whether the user can use AI, and if not, when they can next use it
 */
export async function checkAiRateLimit(
  userId: string
): Promise<AiRateLimitResult> {
  const since = new Date(Date.now() - AI_WINDOW_MS);

  const usages = await prisma.aiAnalysisUsage.findMany({
    where: {
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
  });

  if (usages.length < AI_DAILY_LIMIT) {
    return { allowed: true, usedCount: usages.length };
  }

  // User has hit the limit — find when the oldest usage in the window expires
  const oldestUsage = usages[0];
  const nextAvailableAt = new Date(
    oldestUsage.createdAt.getTime() + AI_WINDOW_MS
  );
  const remainingMs = nextAvailableAt.getTime() - Date.now();

  if (remainingMs <= 0) {
    return { allowed: true, usedCount: usages.length - 1 };
  }

  return {
    allowed: false,
    nextAvailableAt,
    remainingMs,
    usedCount: usages.length,
  };
}

/**
 * Record that a user has consumed their daily AI analysis quota.
 *
 * @param userId - The authenticated user's ID
 * @param type   - "motion" | "lift"
 */
export async function recordAiUsage(
  userId: string,
  type: "motion" | "lift"
): Promise<void> {
  await prisma.aiAnalysisUsage.create({
    data: { userId, type },
  });

  console.log(`[AiRateLimit] Recorded AI usage for user ${userId} (${type})`);
}
