/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/registrations/[registrationId]/race-gate
 *
 * Covers:
 * - Authentication required (401)
 * - Registration not found (404)
 * - Ownership: only the owner or guest can query (403)
 * - Event does not have LiveRace enabled (422)
 * - Event is cancelled (422)
 * - Individual gate failures: not confirmed, not checked in, not live
 * - All gates passing → allowed: true
 * - Guest email ownership match
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/registrations/[registrationId]/race-gate/route";
import { prisma } from "@/lib/prisma";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    registration: {
      findUnique: jest.fn(),
    },
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const OWNER_USER = { id: "user-1", email: "owner@test.com", role: "USER" };
const OTHER_USER = { id: "user-2", email: "other@test.com", role: "USER" };

function makeRequest(): NextRequest {
  return new Request(
    "http://localhost/api/registrations/reg-1/race-gate"
  ) as unknown as NextRequest;
}

function makeParams(registrationId = "reg-1") {
  return { params: Promise.resolve({ registrationId }) };
}

const BASE_REGISTRATION = {
  id: "reg-1",
  userId: OWNER_USER.id,
  guestEmail: null,
  status: "CONFIRMED",
  checkedInAt: new Date("2026-03-01T08:00:00Z"),
  event: {
    id: "event-1",
    liveStatus: "LIVE",
    hasLiveRace: true,
    cancelled: false,
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// Authentication

it("returns 401 when not authenticated", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(401);
});

// Registration not found

it("returns 404 when registration not found", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(null);

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(404);
});

// Ownership

it("returns 403 when user does not own the registration", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OTHER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(403);
});

it("allows query for a guest registration matching the user's email", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OTHER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    userId: "someone-else",
    guestEmail: OTHER_USER.email,
  });

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as { allowed: boolean };
  expect(body.allowed).toBe(true);
});

// LiveRace feature gate

it("returns 422 when event does not have LiveRace enabled", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: { ...BASE_REGISTRATION.event, hasLiveRace: false },
  });

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/liverace/i);
});

// Event cancellation

it("returns 422 when event is cancelled", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: { ...BASE_REGISTRATION.event, cancelled: true },
  });

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/cancelled/i);
});

// Individual gate failures

it("returns allowed=false when registration is not CONFIRMED", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    status: "PENDING",
  });

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as {
    allowed: boolean;
    reason: string;
    gates: { isConfirmed: boolean; isCheckedIn: boolean; isEventLive: boolean };
  };
  expect(body.allowed).toBe(false);
  expect(body.reason).toBeDefined();
  expect(body.gates.isConfirmed).toBe(false);
});

it("returns allowed=false when not checked in", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    checkedInAt: null,
  });

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as {
    allowed: boolean;
    reason: string;
    gates: { isConfirmed: boolean; isCheckedIn: boolean; isEventLive: boolean };
  };
  expect(body.allowed).toBe(false);
  expect(body.reason).toBeDefined();
  expect(body.gates.isCheckedIn).toBe(false);
});

it("returns allowed=false when event is not LIVE (SCHEDULED)", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: { ...BASE_REGISTRATION.event, liveStatus: "SCHEDULED" },
  });

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as {
    allowed: boolean;
    reason: string;
    gates: { isConfirmed: boolean; isCheckedIn: boolean; isEventLive: boolean };
  };
  expect(body.allowed).toBe(false);
  expect(body.reason).toBeDefined();
  expect(body.gates.isEventLive).toBe(false);
});

it("returns allowed=false when event status is CHECK_IN_OPEN (not yet LIVE)", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: { ...BASE_REGISTRATION.event, liveStatus: "CHECK_IN_OPEN" },
  });

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as {
    allowed: boolean;
    gates: { isEventLive: boolean };
  };
  expect(body.allowed).toBe(false);
  expect(body.gates.isEventLive).toBe(false);
});

// All gates passing

it("returns allowed=true when all gates pass (CONFIRMED + checked in + LIVE)", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );

  const res = await GET(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as {
    allowed: boolean;
    reason: string | null;
    gates: { isConfirmed: boolean; isCheckedIn: boolean; isEventLive: boolean };
    registrationId: string;
    eventId: string;
  };
  expect(body.allowed).toBe(true);
  expect(body.reason).toBeNull();
  expect(body.gates.isConfirmed).toBe(true);
  expect(body.gates.isCheckedIn).toBe(true);
  expect(body.gates.isEventLive).toBe(true);
  expect(body.registrationId).toBe("reg-1");
  expect(body.eventId).toBe("event-1");
});
