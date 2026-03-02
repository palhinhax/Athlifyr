/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/registrations/[registrationId]/check-in
 *
 * Covers:
 * - Authentication required
 * - Ownership: only the registration owner (or guest) can check in
 * - Registration status: only CONFIRMED allowed
 * - Event cancellation guard
 * - Check-in window: NOT_OPEN_YET, OPEN (no window), OPEN (within window), CLOSED
 * - Idempotency: already checked in returns success
 * - Happy path: sets checkedInAt
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/registrations/[registrationId]/check-in/route";
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
      update: jest.fn(),
    },
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const OWNER_USER = { id: "user-1", email: "owner@test.com", role: "USER" };
const OTHER_USER = { id: "user-2", email: "other@test.com", role: "USER" };

function makeRequest(): NextRequest {
  return new Request("http://localhost/api/registrations/reg-1/check-in", {
    method: "POST",
  }) as unknown as NextRequest;
}

function makeParams(registrationId = "reg-1") {
  return { params: Promise.resolve({ registrationId }) };
}

const BASE_REGISTRATION = {
  id: "reg-1",
  userId: OWNER_USER.id,
  guestEmail: null,
  status: "CONFIRMED",
  checkedInAt: null,
  event: {
    id: "event-1",
    cancelled: false,
    checkInOpensAt: null,
    checkInClosesAt: null,
    liveStatus: "CHECK_IN_OPEN",
  },
  variant: { id: "variant-1", name: "Trail 32km", distanceKm: 32 },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (prisma.registration.update as jest.Mock).mockResolvedValue({
    checkedInAt: new Date("2026-03-01T09:00:00Z"),
  });
});

// Authentication

it("returns 401 when not authenticated", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(401);
});

// Registration not found

it("returns 404 when registration not found", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(null);

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(404);
});

// Ownership

it("returns 403 when user does not own the registration", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OTHER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(403);
});

it("allows check-in for a guest registration matching the user's email", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OTHER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    userId: "someone-else",
    guestEmail: OTHER_USER.email,
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as { checkedIn: boolean };
  expect(body.checkedIn).toBe(true);
});

// Registration status

it("returns 422 when registration is PENDING", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    status: "PENDING",
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/confirmed/i);
});

it("returns 422 when registration is CANCELLED", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    status: "CANCELLED",
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(422);
});

// Event cancellation

it("returns 422 when event is cancelled", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: { ...BASE_REGISTRATION.event, cancelled: true },
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/cancelled/i);
});

// Check-in window: NOT_OPEN_YET

it("returns 422 when check-in window has not opened yet", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  const future = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2h
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: {
      ...BASE_REGISTRATION.event,
      checkInOpensAt: future,
      checkInClosesAt: null,
    },
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string; checkInOpensAt: string };
  expect(body.error).toMatch(/not opened/i);
  expect(body.checkInOpensAt).toBeDefined();
});

// Check-in window: CLOSED

it("returns 422 when check-in window is closed", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  const past = new Date(Date.now() - 2 * 60 * 60 * 1000); // -2h
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: {
      ...BASE_REGISTRATION.event,
      checkInOpensAt: null,
      checkInClosesAt: past,
    },
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/closed/i);
});

// Check-in window: within window

it("succeeds when now is within the check-in window", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  const pastOpen = new Date(Date.now() - 60 * 60 * 1000); // -1h
  const futureClose = new Date(Date.now() + 60 * 60 * 1000); // +1h
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    event: {
      ...BASE_REGISTRATION.event,
      checkInOpensAt: pastOpen,
      checkInClosesAt: futureClose,
    },
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as { checkedIn: boolean };
  expect(body.checkedIn).toBe(true);
});

// Check-in window: no window set → always open for CONFIRMED

it("succeeds when no check-in window is configured", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION // checkInOpensAt: null, checkInClosesAt: null
  );

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(200);
});

// Idempotency

it("returns 200 with alreadyCheckedIn=true when already checked in", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    checkedInAt: new Date("2026-03-01T07:30:00Z"),
  });

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as {
    checkedIn: boolean;
    alreadyCheckedIn: boolean;
  };
  expect(body.checkedIn).toBe(true);
  expect(body.alreadyCheckedIn).toBe(true);
  // Should NOT call update when already checked in
  expect(prisma.registration.update).not.toHaveBeenCalled();
});

// Happy path

it("sets checkedInAt and returns 200 on successful check-in", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(OWNER_USER);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );

  const res = await POST(makeRequest(), makeParams());
  expect(res.status).toBe(200);

  const body = (await res.json()) as {
    checkedIn: boolean;
    checkedInAt: string;
    alreadyCheckedIn: boolean;
  };
  expect(body.checkedIn).toBe(true);
  expect(body.alreadyCheckedIn).toBe(false);
  expect(body.checkedInAt).toBeDefined();

  expect(prisma.registration.update).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { id: "reg-1" },
      data: expect.objectContaining({ checkedInAt: expect.any(Date) }),
    })
  );
});
