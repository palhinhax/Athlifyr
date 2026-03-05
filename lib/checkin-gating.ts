/**
 * lib/checkin-gating.ts
 *
 * Shared helpers for check-in and race-start gating logic.
 * Used by both the athlete self-service endpoint and the staff checkin route.
 */

export type CheckInWindowStatus =
  | "NOT_OPEN_YET"
  | "OPEN"
  | "CLOSED"
  | "NO_WINDOW_SET";

/**
 * Determine the check-in window status at a given point in time.
 *
 * Rules:
 * - If neither checkInOpensAt nor checkInClosesAt is set → "NO_WINDOW_SET"
 *   (staff can always check in; athlete self-service is not gated by time)
 * - If checkInOpensAt is set and now < checkInOpensAt → "NOT_OPEN_YET"
 * - If checkInClosesAt is set and now > checkInClosesAt → "CLOSED"
 * - Otherwise → "OPEN"
 */
export function getCheckInWindowStatus(
  checkInOpensAt: Date | null,
  checkInClosesAt: Date | null,
  now: Date = new Date()
): CheckInWindowStatus {
  if (!checkInOpensAt && !checkInClosesAt) {
    return "NO_WINDOW_SET";
  }

  if (checkInOpensAt && now < checkInOpensAt) {
    return "NOT_OPEN_YET";
  }

  if (checkInClosesAt && now > checkInClosesAt) {
    return "CLOSED";
  }

  return "OPEN";
}

export interface RaceStartGatingResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates all gating conditions required before an athlete can start a race.
 *
 * Conditions (ALL must be true):
 * 1. Registration status is CONFIRMED
 * 2. checkedInAt is not null
 * 3. Event liveStatus is LIVE
 */
export function validateRaceStartGating(opts: {
  registrationStatus: string;
  checkedInAt: Date | null;
  eventLiveStatus: string;
}): RaceStartGatingResult {
  const { registrationStatus, checkedInAt, eventLiveStatus } = opts;

  if (registrationStatus !== "CONFIRMED") {
    return {
      allowed: false,
      reason: "Registration is not confirmed",
    };
  }

  if (!checkedInAt) {
    return {
      allowed: false,
      reason: "Check-in has not been completed",
    };
  }

  if (eventLiveStatus !== "LIVE") {
    return {
      allowed: false,
      reason: "Event is not live",
    };
  }

  return { allowed: true };
}
