/**
 * @jest-environment node
 */

/**
 * Tests for /api/admin/giveaways (list + create)
 *
 * Covers:
 * - GET: Returns 401 when not admin
 * - GET: Returns paginated list with filters
 * - POST: Returns 401 when not admin
 * - POST: Returns 400 when eventId missing
 * - POST: Returns 400 when prizeCount < 1
 * - POST: Creates giveaway with default platform ALL
 * - POST: Creates giveaway with explicit platform
 * - POST: Returns 500 on database error
 */

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/admin/giveaways/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));
import { auth } from "@/lib/auth";

jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => "mock-secret-hex"),
  })),
  createHash: jest.fn(() => ({
    update: jest.fn(() => ({
      digest: jest.fn(() => "mock-hash-hex"),
    })),
  })),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { count: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const adminSession = {
  user: { id: "admin-1", role: "ADMIN", email: "admin@test.com" },
};

function makeGetRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/admin/giveaways");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString(), { method: "GET" });
}

function makePostRequest(body: Record<string, unknown> = {}): NextRequest {
  return new NextRequest("http://localhost/api/admin/giveaways", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const GIVEAWAY = {
  id: "g1",
  status: "DRAFT",
  platform: "ALL",
  eventId: "e1",
  prizeCount: 1,
  event: { id: "e1", title: "Event", slug: "event" },
  translations: [],
  _count: { participations: 0, winners: 0 },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

// ═══════════════════════════════════════════════════════════════════════════════
// GET
// ═══════════════════════════════════════════════════════════════════════════════

describe("GET /api/admin/giveaways", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(401);
  });

  it("returns paginated giveaways list", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.count as jest.Mock).mockResolvedValue(1);
    (prisma.giveaway.findMany as jest.Mock).mockResolvedValue([GIVEAWAY]);

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaways).toHaveLength(1);
    expect(json.pagination.totalCount).toBe(1);
  });

  it("applies eventId and status filters", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.count as jest.Mock).mockResolvedValue(0);
    (prisma.giveaway.findMany as jest.Mock).mockResolvedValue([]);

    await GET(makeGetRequest({ eventId: "e1", status: "DRAFT" }));

    expect(prisma.giveaway.count).toHaveBeenCalledWith({
      where: { eventId: "e1", status: "DRAFT" },
    });
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.count as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST
// ═══════════════════════════════════════════════════════════════════════════════

describe("POST /api/admin/giveaways", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest({ eventId: "e1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when eventId is missing", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);

    const res = await POST(makePostRequest({}));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("eventId is required");
  });

  it("returns 400 when prizeCount is less than 1", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);

    const res = await POST(makePostRequest({ eventId: "e1", prizeCount: 0 }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("prizeCount must be at least 1");
  });

  it("creates giveaway with default platform ALL", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue(GIVEAWAY);

    const res = await POST(makePostRequest({ eventId: "e1" }));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(prisma.giveaway.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventId: "e1",
          platform: "ALL",
          status: "DRAFT",
          prizeCount: 1,
        }),
      })
    );
    expect(json.giveaway).toBeDefined();
  });

  it("creates giveaway with explicit platform MOBILE", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue({
      ...GIVEAWAY,
      platform: "MOBILE",
    });

    const res = await POST(
      makePostRequest({ eventId: "e1", platform: "MOBILE" })
    );

    expect(res.status).toBe(201);
    expect(prisma.giveaway.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ platform: "MOBILE" }),
      })
    );
  });

  it("creates giveaway with translations", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue(GIVEAWAY);

    const translations = [
      { lang: "EN", title: "Win Prize", details: "Details here" },
    ];

    const res = await POST(makePostRequest({ eventId: "e1", translations }));

    expect(res.status).toBe(201);
    expect(prisma.giveaway.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          translations: {
            createMany: {
              data: [
                { lang: "EN", title: "Win Prize", details: "Details here" },
              ],
            },
          },
        }),
      })
    );
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makePostRequest({ eventId: "e1" }));
    expect(res.status).toBe(500);
  });
});
