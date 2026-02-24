/**
 * Structured Sentry logger for key user actions.
 *
 * Uses `Sentry.logger.*` to emit structured logs that appear in the
 * Sentry Logs product — queryable by any attribute in real time and
 * automatically correlated with errors & traces.
 *
 * Usage:
 *   import { sentryLog } from "@/lib/sentry-logger";
 *   sentryLog.giveawayJoined({ userId, giveawayId, ticketNumber });
 *
 * Privacy: never pass email, passwords, or tokens through these helpers.
 */
import * as Sentry from "@sentry/nextjs";

// ── Giveaway events ────────────────────────────────────────────────────

export function logGiveawayJoined(attrs: {
  userId: string;
  giveawayId: string;
  ticketNumber: number;
  participantsCount: number;
}) {
  Sentry.logger.info("giveaway.joined", {
    userId: attrs.userId,
    giveawayId: attrs.giveawayId,
    ticketNumber: attrs.ticketNumber,
    participantsCount: attrs.participantsCount,
  });
}

export function logGiveawayDrawCompleted(attrs: {
  giveawayId: string;
  participantsCount: number;
  winnersCount: number;
  winningTickets: number[];
}) {
  Sentry.logger.info("giveaway.draw_completed", {
    giveawayId: attrs.giveawayId,
    participantsCount: attrs.participantsCount,
    winnersCount: attrs.winnersCount,
    winningTickets: attrs.winningTickets.join(","),
  });
}

export function logGiveawayDrawFailed(attrs: {
  giveawayId: string;
  error: string;
}) {
  Sentry.logger.error("giveaway.draw_failed", {
    giveawayId: attrs.giveawayId,
    error: attrs.error,
  });
}

// ── Event participation ────────────────────────────────────────────────

export function logEventParticipation(attrs: {
  userId: string;
  eventId: string;
  status: string;
  variantId?: string | null;
}) {
  Sentry.logger.info("event.participation", {
    userId: attrs.userId,
    eventId: attrs.eventId,
    status: attrs.status,
    ...(attrs.variantId ? { variantId: attrs.variantId } : {}),
  });
}

// ── Comments ───────────────────────────────────────────────────────────

export function logCommentCreated(attrs: {
  userId: string;
  eventId: string;
  commentId: string;
  isReply: boolean;
}) {
  Sentry.logger.info("comment.created", {
    userId: attrs.userId,
    eventId: attrs.eventId,
    commentId: attrs.commentId,
    isReply: String(attrs.isReply),
  });
}

// ── Auth events ────────────────────────────────────────────────────────

export function logAuthLogin(attrs: { userId: string; provider: string }) {
  Sentry.logger.info("auth.login", {
    userId: attrs.userId,
    provider: attrs.provider,
  });
}

export function logAuthRegister(attrs: { userId: string; provider: string }) {
  Sentry.logger.info("auth.register", {
    userId: attrs.userId,
    provider: attrs.provider,
  });
}

// ── Generic helper ─────────────────────────────────────────────────────

/**
 * Emit a structured log at the given level.
 * Prefer the domain-specific helpers above for consistency,
 * but use this for ad-hoc logging needs.
 */
export function sentryLog(
  level: "info" | "warn" | "error",
  message: string,
  attrs?: Record<string, string | number | boolean>
) {
  Sentry.logger[level](message, attrs ?? {});
}
