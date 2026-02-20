import { prisma } from "@/lib/prisma";

const AI_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AiRateLimitResult {
  allowed: boolean;
  /** When the next AI analysis will be available (only set when blocked) */
  nextAvailableAt?: Date;
  /** Remaining milliseconds until next AI analysis (only set when blocked) */
  remainingMs?: number;
}

/**
 * Check whether a user is allowed to use AI analysis.
 * Each user gets 1 AI-powered analysis per 24-hour rolling window.
 *
 * @param userId - The authenticated user's ID
 * @returns Whether the user can use AI, and if not, when they can next use it
 */
export async function checkAiRateLimit(
  userId: string
): Promise<AiRateLimitResult> {
  const since = new Date(Date.now() - AI_COOLDOWN_MS);

  const lastUsage = await prisma.aiAnalysisUsage.findFirst({
    where: {
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!lastUsage) {
    return { allowed: true };
  }

  const nextAvailableAt = new Date(
    lastUsage.createdAt.getTime() + AI_COOLDOWN_MS
  );
  const remainingMs = nextAvailableAt.getTime() - Date.now();

  if (remainingMs <= 0) {
    return { allowed: true };
  }

  return { allowed: false, nextAvailableAt, remainingMs };
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
