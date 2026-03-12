/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/admin/giveaways (create)
 *
 * Covers:
 * - Unauthorized request
 * - Missing eventId
 * - Invalid prizeCount
 * - Creates giveaway with platform field
 * - Creates giveaway with default platform ALL
 * - Internal server error
 */

import { POST } from "@/app/api/admin/giveaways/route";
import { NextRequest } from "next/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { count: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// Mock crypto for deterministic tests
jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => ({
    toString: () => "a".repeat(64),
  })),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: () => "b".repeat(64),
  })),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/admin/giveaways", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const adminSession = {
  user: { id: "admin1", role: "ADMIN", email: "admin@test.com" },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/admin/giveaways", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ eventId: "e1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when eventId is missing", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);

    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "eventId is required" });
  });

  it("returns 400 when prizeCount is less than 1", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);

    const res = await POST(makeRequest({ eventId: "e1", prizeCount: 0 }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "prizeCount must be at least 1",
    });
  });

  it("creates giveaway with platform MOBILE", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue({
      id: "g1",
      eventId: "e1",
      platform: "MOBILE",
      status: "DRAFT",
      prizeCount: 1,
    });

    const res = await POST(makeRequest({ eventId: "e1", platform: "MOBILE" }));
    expect(res.status).toBe(201);

    const createCall = (prisma.giveaway.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.platform).toBe("MOBILE");
  });

  it("creates giveaway with platform ANDROID", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue({
      id: "g1",
      platform: "ANDROID",
    });

    const res = await POST(makeRequest({ eventId: "e1", platform: "ANDROID" }));
    expect(res.status).toBe(201);

    const createCall = (prisma.giveaway.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.platform).toBe("ANDROID");
  });

  it("creates giveaway with platform IOS", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue({
      id: "g1",
      platform: "IOS",
    });

    const res = await POST(makeRequest({ eventId: "e1", platform: "IOS" }));
    expect(res.status).toBe(201);

    const createCall = (prisma.giveaway.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.platform).toBe("IOS");
  });

  it("defaults to ALL when platform not specified", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue({
      id: "g1",
      platform: "ALL",
    });

    const res = await POST(makeRequest({ eventId: "e1" }));
    expect(res.status).toBe(201);

    const createCall = (prisma.giveaway.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.platform).toBe("ALL");
  });

  it("passes translations to createMany", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockResolvedValue({
      id: "g1",
      platform: "ALL",
    });

    const translations = [
      { lang: "en", title: "Win!", details: "Details" },
      { lang: "pt", title: "Ganha!", details: "Detalhes" },
    ];

    await POST(makeRequest({ eventId: "e1", translations }));

    const createCall = (prisma.giveaway.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.translations.createMany.data).toHaveLength(2);
  });

  it("returns 500 on internal error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.create as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest({ eventId: "e1" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to create giveaway" });
  });
});
