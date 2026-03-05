/**
 * @jest-environment node
 */

/**
 * Tests for PATCH /api/events/[id]/registrations/[registrationId]/checkin
 *
 * Covers (Phase 2 additions):
 * - Authentication required (401)
 * - Event not found (404)
 * - Cancelled event blocks check-in (422)
 * - Authorisation: forbidden for regular authenticated users (403)
 * - Staff members must respect the check-in window
 *   - NOT_OPEN_YET → 422
 *   - CLOSED → 422
 *   - OPEN (within window) → 200
 *   - No window set → 200 (always open for staff)
 * - Platform admin bypasses window
 * - Organizer OWNER/ADMIN bypasses window
 * - Non-confirmed registrations cannot be checked in (422)
 * - Idempotency: toggling to already-current state returns 200 without DB write
 */

import { NextRequest } from "next/server";
import { PATCH } from "@/app/api/events/[id]/registrations/[registrationId]/checkin/route";
import { prisma } from "@/lib/prisma";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
    eventOrganizer: { findUnique: jest.fn() },
    eventStaffMember: { findFirst: jest.fn() },
    registration: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const STAFF_USER = { id: "user-staff", email: "staff@test.com", role: "USER" };
const ADMIN_USER = { id: "user-admin", email: "admin@test.com", role: "ADMIN" };
const ORGANIZER_OWNER = {
  id: "user-org-owner",
  email: "owner@test.com",
  role: "USER",
};
const ORGANIZER_ADMIN = {
  id: "user-org-admin",
  email: "orgadmin@test.com",
  role: "USER",
};
const UNRELATED_USER = {
  id: "user-none",
  email: "nobody@test.com",
  role: "USER",
};

function makeRequest(body: { checkedIn: boolean }): NextRequest {
  return new Request(
    "http://localhost/api/events/event-1/registrations/reg-1/checkin",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  ) as unknown as NextRequest;
}

function makeParams(eventId = "event-1", registrationId = "reg-1") {
  return { params: Promise.resolve({ id: eventId, registrationId }) };
}

const NOW = new Date();
const FUTURE = new Date(NOW.getTime() + 2 * 60 * 60 * 1000); // +2h
const PAST = new Date(NOW.getTime() - 2 * 60 * 60 * 1000); // -2h

/** Base event with no check-in window (always open). */
const BASE_EVENT = {
  id: "event-1",
  cancelled: false,
  checkInOpensAt: null,
  checkInClosesAt: null,
};

/** Base confirmed registration that hasn't been checked in. */
const BASE_REGISTRATION = {
  id: "reg-1",
  status: "CONFIRMED",
  checkedInAt: null,
};

function setupStaffScenario(overrides: {
  event?: object;
  registration?: object;
  isOrganizerRole?: string | null;
  isStaff?: boolean;
  user?: typeof STAFF_USER;
}) {
  const user = overrides.user ?? STAFF_USER;
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(user);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_EVENT,
    ...(overrides.event ?? {}),
  });
  (prisma.eventOrganizer.findUnique as jest.Mock).mockResolvedValue(
    overrides.isOrganizerRole ? { role: overrides.isOrganizerRole } : null
  );
  (prisma.eventStaffMember.findFirst as jest.Mock).mockResolvedValue(
    overrides.isStaff !== false ? { id: "staff-1" } : null
  );
  (prisma.registration.findFirst as jest.Mock).mockResolvedValue({
    ...BASE_REGISTRATION,
    ...(overrides.registration ?? {}),
  });
  (prisma.registration.update as jest.Mock).mockResolvedValue({
    checkedInAt: new Date(),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// Authentication

it("returns 401 when not authenticated", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(401);
});

// Event not found

it("returns 404 when event not found", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(STAFF_USER);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(404);
});

// Cancelled event

it("returns 422 when event is cancelled", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(STAFF_USER);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_EVENT,
    cancelled: true,
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/cancelled/i);
});

// Authorisation

it("returns 403 when user has no role on the event", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(UNRELATED_USER);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue(BASE_EVENT);
  (prisma.eventOrganizer.findUnique as jest.Mock).mockResolvedValue(null);
  (prisma.eventStaffMember.findFirst as jest.Mock).mockResolvedValue(null);

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(403);
});

// Non-confirmed registration

it("returns 422 when trying to check in a PENDING registration", async () => {
  setupStaffScenario({ registration: { status: "PENDING" } });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/confirmed/i);
});

// ── Check-in window enforcement for STAFF ────────────────────────────────────

it("returns 422 for staff when window has NOT opened yet", async () => {
  setupStaffScenario({
    event: { checkInOpensAt: FUTURE, checkInClosesAt: null },
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/not opened/i);
});

it("returns 422 for staff when window is CLOSED", async () => {
  setupStaffScenario({
    event: { checkInOpensAt: null, checkInClosesAt: PAST },
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(422);
  const body = (await res.json()) as { error: string };
  expect(body.error).toMatch(/closed/i);
});

it("returns 200 for staff when within the check-in window", async () => {
  setupStaffScenario({
    event: { checkInOpensAt: PAST, checkInClosesAt: FUTURE },
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
});

it("returns 200 for staff when no window is configured", async () => {
  setupStaffScenario({}); // checkInOpensAt: null, checkInClosesAt: null

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
});

// ── Platform admin bypasses window ───────────────────────────────────────────

it("returns 200 for platform admin even when window has NOT opened yet", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_EVENT,
    checkInOpensAt: FUTURE,
    checkInClosesAt: null,
  });
  (prisma.eventOrganizer.findUnique as jest.Mock).mockResolvedValue(null);
  (prisma.eventStaffMember.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.registration.findFirst as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );
  (prisma.registration.update as jest.Mock).mockResolvedValue({
    checkedInAt: new Date(),
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
});

it("returns 200 for platform admin even when window is CLOSED", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_EVENT,
    checkInOpensAt: null,
    checkInClosesAt: PAST,
  });
  (prisma.eventOrganizer.findUnique as jest.Mock).mockResolvedValue(null);
  (prisma.eventStaffMember.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.registration.findFirst as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );
  (prisma.registration.update as jest.Mock).mockResolvedValue({
    checkedInAt: new Date(),
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
});

// ── Organizer OWNER bypasses window ──────────────────────────────────────────

it("returns 200 for OWNER organizer even when window has NOT opened yet", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORGANIZER_OWNER);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_EVENT,
    checkInOpensAt: FUTURE,
    checkInClosesAt: null,
  });
  (prisma.eventOrganizer.findUnique as jest.Mock).mockResolvedValue({
    role: "OWNER",
  });
  (prisma.eventStaffMember.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.registration.findFirst as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );
  (prisma.registration.update as jest.Mock).mockResolvedValue({
    checkedInAt: new Date(),
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
});

it("returns 200 for ADMIN organizer even when window is CLOSED", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORGANIZER_ADMIN);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_EVENT,
    checkInOpensAt: null,
    checkInClosesAt: PAST,
  });
  (prisma.eventOrganizer.findUnique as jest.Mock).mockResolvedValue({
    role: "ADMIN",
  });
  (prisma.eventStaffMember.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.registration.findFirst as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );
  (prisma.registration.update as jest.Mock).mockResolvedValue({
    checkedInAt: new Date(),
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
});

// ── VIEWER organizer (not in allowed list) is forbidden ─────────────────────

it("returns 403 for VIEWER organizer (not in OWNER/ADMIN allowed set)", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue({
    id: "viewer",
    email: "v@test.com",
    role: "USER",
  });
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...BASE_EVENT,
    checkInOpensAt: FUTURE,
    checkInClosesAt: null,
  });
  (prisma.eventOrganizer.findUnique as jest.Mock).mockResolvedValue({
    role: "VIEWER",
  });
  (prisma.eventStaffMember.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.registration.findFirst as jest.Mock).mockResolvedValue(
    BASE_REGISTRATION
  );

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  // VIEWER is not in the CHECKIN_ALLOWED_ORGANIZER_ROLES set and has no staff role → 403
  expect(res.status).toBe(403);
});

// ── Idempotency ──────────────────────────────────────────────────────────────

it("returns 200 without DB write when registration already has the desired check-in state", async () => {
  const checkedInTime = new Date("2026-03-01T08:00:00Z");
  setupStaffScenario({
    registration: { status: "CONFIRMED", checkedInAt: checkedInTime },
  });

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
  const body = (await res.json()) as { checkedInAt: string };
  expect(body.checkedInAt).toBe(checkedInTime.toISOString());
  expect(prisma.registration.update).not.toHaveBeenCalled();
});

// ── Happy path ───────────────────────────────────────────────────────────────

it("sets checkedInAt and returns 200 on a successful staff check-in", async () => {
  setupStaffScenario({});

  const res = await PATCH(makeRequest({ checkedIn: true }), makeParams());
  expect(res.status).toBe(200);
  expect(prisma.registration.update).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { id: "reg-1" },
      data: expect.objectContaining({ checkedInAt: expect.any(Date) }),
    })
  );
});

it("clears checkedInAt when checking out (checkedIn: false)", async () => {
  const checkedInTime = new Date("2026-03-01T08:00:00Z");
  setupStaffScenario({
    registration: { status: "CONFIRMED", checkedInAt: checkedInTime },
  });
  (prisma.registration.update as jest.Mock).mockResolvedValue({
    checkedInAt: null,
  });

  const res = await PATCH(makeRequest({ checkedIn: false }), makeParams());
  expect(res.status).toBe(200);
  expect(prisma.registration.update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ checkedInAt: null }),
    })
  );
});
