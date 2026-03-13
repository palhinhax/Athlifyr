/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events - isFeatured ordering
 *
 * Covers:
 * - Returns events ordered by isFeatured desc, then startDate asc (no search)
 * - Featured events appear before non-featured events
 * - Returns correct pagination metadata
 * - Returns 500 on database error
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/events/route";

// Polyfill nextUrl on plain Request objects via NextRequest
// (Next.js route handlers use request.nextUrl.searchParams)

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn(),
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/events");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString());
}

const FEATURED_EVENT = {
  id: "event-featured",
  title: "Featured Trail 2026",
  slug: "featured-trail-2026",
  isFeatured: true,
  startDate: new Date("2026-07-01"),
  variants: [],
  _count: { comments: 0, giveaways: 0 },
};

const REGULAR_EVENT = {
  id: "event-regular",
  title: "Regular Trail 2026",
  slug: "regular-trail-2026",
  isFeatured: false,
  startDate: new Date("2026-06-01"),
  variants: [],
  _count: { comments: 0, giveaways: 0 },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events - isFeatured ordering", () => {
  it("orders events by isFeatured desc then startDate asc when no search", async () => {
    (prisma.event.count as jest.Mock).mockResolvedValue(2);
    // Prisma returns in the order dictated by the orderBy clause
    (prisma.event.findMany as jest.Mock).mockResolvedValue([
      FEATURED_EVENT,
      REGULAR_EVENT,
    ]);

    const res = await GET(makeRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.events).toHaveLength(2);
    expect(json.events[0].id).toBe("event-featured");
    expect(json.events[1].id).toBe("event-regular");
    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ isFeatured: "desc" }, { startDate: "asc" }],
      })
    );
  });

  it("returns correct pagination metadata", async () => {
    (prisma.event.count as jest.Mock).mockResolvedValue(25);
    (prisma.event.findMany as jest.Mock).mockResolvedValue(
      new Array(12).fill(REGULAR_EVENT)
    );

    const res = await GET(makeRequest({ page: "1", pageSize: "12" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.pagination.totalCount).toBe(25);
    expect(json.pagination.totalPages).toBe(3);
    expect(json.pagination.hasMore).toBe(true);
  });

  it("does not apply isFeatured ordering when search is provided", async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);
    (prisma.event.count as jest.Mock).mockResolvedValue(0);
    (prisma.event.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET(makeRequest({ search: "trail" }));

    expect(res.status).toBe(200);
    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: undefined,
      })
    );
  });

  it("returns 500 on database error", async () => {
    (prisma.event.count as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await GET(makeRequest());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to fetch events" });
  });
});
