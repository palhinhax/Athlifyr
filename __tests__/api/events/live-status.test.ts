/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events/[id]/live-status
 *
 * Covers:
 * - Authentication required (401)
 * - Permission denied (403)
 * - Event not found (404)
 * - Returns live status with Live Service data
 * - Falls back to DB-only data when Live Service unreachable
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/events/[id]/live-status/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/event-permissions", () => ({
  getUserEventContext: jest.fn(),
  hasEventPermission: jest.fn(),
}));
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

const mockFetch = jest.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

const ADMIN_USER = { id: "user-1", email: "admin@test.com", role: "ADMIN" };

function makeRequest(): NextRequest {
  return new Request(
    "http://localhost/api/events/event-1/live-status"
  ) as unknown as NextRequest;
}

function makeParams(id = "event-1") {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events/[id]/live-status", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 403 when user lacks permission", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (getUserEventContext as jest.Mock).mockResolvedValue({});
    (hasEventPermission as jest.Mock).mockReturnValue(false);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });
  });

  it("returns 404 when event not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (getUserEventContext as jest.Mock).mockResolvedValue({});
    (hasEventPermission as jest.Mock).mockReturnValue(true);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("returns live status with Live Service data", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (getUserEventContext as jest.Mock).mockResolvedValue({});
    (hasEventPermission as jest.Mock).mockReturnValue(true);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      liveStatus: "LIVE",
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        connectedCount: 42,
        participantCount: 10,
        lastUpdate: "2025-06-01T10:00:00Z",
      }),
    });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      liveStatus: "LIVE",
      connectedCount: 42,
      participantCount: 10,
      lastUpdate: "2025-06-01T10:00:00Z",
    });
  });

  it("falls back to DB-only data when Live Service is unreachable", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (getUserEventContext as jest.Mock).mockResolvedValue({});
    (hasEventPermission as jest.Mock).mockReturnValue(true);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      liveStatus: "WARMUP",
    });
    mockFetch.mockRejectedValue(new Error("Connection refused"));

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      liveStatus: "WARMUP",
      connectedCount: 0,
      participantCount: 0,
      lastUpdate: null,
    });
  });

  it("falls back to DB-only data when Live Service returns non-ok", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (getUserEventContext as jest.Mock).mockResolvedValue({});
    (hasEventPermission as jest.Mock).mockReturnValue(true);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      liveStatus: "SCHEDULED",
    });
    mockFetch.mockResolvedValue({ ok: false });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      liveStatus: "SCHEDULED",
      connectedCount: 0,
      participantCount: 0,
      lastUpdate: null,
    });
  });
});
