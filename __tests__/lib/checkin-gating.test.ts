/**
 * @jest-environment node
 */

/**
 * Unit tests for lib/checkin-gating.ts
 * Covers: check-in window status computation and race start gating.
 */

import {
  getCheckInWindowStatus,
  validateRaceStartGating,
} from "@/lib/checkin-gating";

// ── getCheckInWindowStatus ────────────────────────────────────────────────────

describe("getCheckInWindowStatus", () => {
  const NOW = new Date("2026-03-01T10:00:00Z");

  it("returns NO_WINDOW_SET when both dates are null", () => {
    expect(getCheckInWindowStatus(null, null, NOW)).toBe("NO_WINDOW_SET");
  });

  it("returns NOT_OPEN_YET when now is before checkInOpensAt", () => {
    const opensAt = new Date("2026-03-01T12:00:00Z"); // 2h in the future
    expect(getCheckInWindowStatus(opensAt, null, NOW)).toBe("NOT_OPEN_YET");
  });

  it("returns OPEN when now is exactly at checkInOpensAt", () => {
    const opensAt = new Date("2026-03-01T10:00:00Z"); // same as NOW
    expect(getCheckInWindowStatus(opensAt, null, NOW)).toBe("OPEN");
  });

  it("returns OPEN when now is after checkInOpensAt and no close date", () => {
    const opensAt = new Date("2026-03-01T08:00:00Z"); // 2h ago
    expect(getCheckInWindowStatus(opensAt, null, NOW)).toBe("OPEN");
  });

  it("returns CLOSED when now is after checkInClosesAt", () => {
    const closesAt = new Date("2026-03-01T09:00:00Z"); // 1h ago
    expect(getCheckInWindowStatus(null, closesAt, NOW)).toBe("CLOSED");
  });

  it("returns OPEN when now is exactly at checkInClosesAt", () => {
    // Boundary: strictly after → CLOSED; at = still open
    const closesAt = new Date("2026-03-01T10:00:00Z"); // same as NOW
    expect(getCheckInWindowStatus(null, closesAt, NOW)).toBe("OPEN");
  });

  it("returns OPEN when now is between open and close dates", () => {
    const opensAt = new Date("2026-03-01T08:00:00Z");
    const closesAt = new Date("2026-03-01T12:00:00Z");
    expect(getCheckInWindowStatus(opensAt, closesAt, NOW)).toBe("OPEN");
  });

  it("returns NOT_OPEN_YET when window has both dates and now is before open", () => {
    const opensAt = new Date("2026-03-01T11:00:00Z");
    const closesAt = new Date("2026-03-01T15:00:00Z");
    expect(getCheckInWindowStatus(opensAt, closesAt, NOW)).toBe("NOT_OPEN_YET");
  });

  it("returns CLOSED when window has both dates and now is after close", () => {
    const opensAt = new Date("2026-03-01T06:00:00Z");
    const closesAt = new Date("2026-03-01T09:30:00Z");
    expect(getCheckInWindowStatus(opensAt, closesAt, NOW)).toBe("CLOSED");
  });

  it("returns OPEN when only checkInClosesAt is set and now is before it", () => {
    const closesAt = new Date("2026-03-01T12:00:00Z");
    expect(getCheckInWindowStatus(null, closesAt, NOW)).toBe("OPEN");
  });
});

// ── validateRaceStartGating ───────────────────────────────────────────────────

describe("validateRaceStartGating", () => {
  it("allows start when all conditions are met", () => {
    const result = validateRaceStartGating({
      registrationStatus: "CONFIRMED",
      checkedInAt: new Date(),
      eventLiveStatus: "LIVE",
    });
    expect(result.allowed).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("blocks when registration is PENDING", () => {
    const result = validateRaceStartGating({
      registrationStatus: "PENDING",
      checkedInAt: new Date(),
      eventLiveStatus: "LIVE",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not confirmed/i);
  });

  it("blocks when registration is CANCELLED", () => {
    const result = validateRaceStartGating({
      registrationStatus: "CANCELLED",
      checkedInAt: new Date(),
      eventLiveStatus: "LIVE",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not confirmed/i);
  });

  it("blocks when checkedInAt is null", () => {
    const result = validateRaceStartGating({
      registrationStatus: "CONFIRMED",
      checkedInAt: null,
      eventLiveStatus: "LIVE",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/check-in/i);
  });

  it("blocks when event is SCHEDULED (not LIVE)", () => {
    const result = validateRaceStartGating({
      registrationStatus: "CONFIRMED",
      checkedInAt: new Date(),
      eventLiveStatus: "SCHEDULED",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not live/i);
  });

  it("blocks when event is CHECK_IN_OPEN (not yet LIVE)", () => {
    const result = validateRaceStartGating({
      registrationStatus: "CONFIRMED",
      checkedInAt: new Date(),
      eventLiveStatus: "CHECK_IN_OPEN",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not live/i);
  });

  it("blocks when event is FINISHED", () => {
    const result = validateRaceStartGating({
      registrationStatus: "CONFIRMED",
      checkedInAt: new Date(),
      eventLiveStatus: "FINISHED",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not live/i);
  });

  it("registration check takes priority over check-in check", () => {
    // Both registration and check-in fail — registration should be reported first
    const result = validateRaceStartGating({
      registrationStatus: "PENDING",
      checkedInAt: null,
      eventLiveStatus: "LIVE",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not confirmed/i);
  });

  it("check-in check takes priority over liveStatus check", () => {
    // Both check-in and liveStatus fail — check-in should be reported first
    const result = validateRaceStartGating({
      registrationStatus: "CONFIRMED",
      checkedInAt: null,
      eventLiveStatus: "SCHEDULED",
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/check-in/i);
  });
});
