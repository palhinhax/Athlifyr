/**
 * @jest-environment node
 */

/**
 * Tests for PATCH /api/events/[id] - isFeatured toggle
 *
 * Covers:
 * - Returns 401 when not authenticated
 * - Returns 403 when user is not admin or organizer
 * - Admin can set isFeatured to true
 * - Admin can set isFeatured to false
 * - Non-admin organizer cannot set isFeatured (guard: isAdmin check)
 */

import { NextRequest } from "next/server";
import { PATCH } from "@/app/api/events/[id]/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    eventOrganizer: { findFirst: jest.fn() },
    eventTranslation: { findMany: jest.fn() },
    eventVariant: { findMany: jest.fn() },
    participation: { deleteMany: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/notifications", () => ({
  notifyEventDateChange: jest.fn(),
  notifyEventCancelled: jest.fn(),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const ADMIN_USER = { id: "user-admin", email: "admin@test.com", role: "ADMIN" };
const ORG_USER = { id: "user-org", email: "org@test.com", role: "USER" };

const EXISTING_EVENT = {
  id: "event-1",
  title: "Trail Run 2026",
  slug: "trail-run-2026",
  startDate: new Date("2026-06-01"),
  cancelled: false,
  isFeatured: false,
  variants: [],
};

function makeRequest(body: Record<string, unknown> = {}): NextRequest {
  return new Request("http://localhost/api/events/event-1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function makeParams(id = "event-1") {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("PATCH /api/events/[id] - isFeatured", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makeRequest({ isFeatured: true }), makeParams());

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 403 when user has no organizer role and is not admin", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORG_USER);
    (prisma.eventOrganizer.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makeRequest({ isFeatured: true }), makeParams());

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });
  });

  it("admin can set isFeatured to true", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce({ ...EXISTING_EVENT, isFeatured: true });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      isFeatured: true,
    });

    const res = await PATCH(makeRequest({ isFeatured: true }), makeParams());

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.isFeatured).toBe(true);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isFeatured: true }),
      })
    );
  });

  it("admin can set isFeatured to false", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce({
        ...EXISTING_EVENT,
        isFeatured: true,
      })
      .mockResolvedValueOnce({
        ...EXISTING_EVENT,
        isFeatured: false,
      });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      isFeatured: false,
    });

    const res = await PATCH(makeRequest({ isFeatured: false }), makeParams());

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isFeatured: false }),
      })
    );
  });

  it("non-admin organizer cannot set isFeatured (isAdmin guard)", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORG_USER);
    (prisma.eventOrganizer.findFirst as jest.Mock).mockResolvedValue({
      id: "org-1",
      eventId: "event-1",
      userId: "user-org",
    });
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await PATCH(makeRequest({ isFeatured: true }), makeParams());

    expect(res.status).toBe(200);
    // isFeatured must NOT be included in the update payload for non-admins
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ isFeatured: expect.anything() }),
      })
    );
  });

  it("returns 404 when event does not exist", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makeRequest({ isFeatured: true }), makeParams());

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });
});
