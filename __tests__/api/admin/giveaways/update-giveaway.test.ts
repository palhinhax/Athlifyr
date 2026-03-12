/**
 * @jest-environment node
 */

/**
 * Tests for PATCH /api/admin/giveaways/[id] (update)
 *
 * Covers:
 * - Unauthorized request
 * - Giveaway not found
 * - State transition validation
 * - Platform update on DRAFT giveaway
 * - Platform update blocked on non-DRAFT giveaway
 * - Cancelled giveaway blocks modification
 * - Drawn giveaway blocks core field edits
 * - Invalid prizeCount
 * - Successful update with platform
 * - Internal server error
 */

import { PATCH } from "@/app/api/admin/giveaways/[id]/route";
import { NextRequest } from "next/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { findUnique: jest.fn(), update: jest.fn() },
    giveawayTranslation: { upsert: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/admin/giveaways/g1", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeParams(id = "g1") {
  return { params: Promise.resolve({ id }) };
}

const adminSession = {
  user: { id: "admin1", role: "ADMIN", email: "admin@test.com" },
};

function makeExisting(overrides: Record<string, unknown> = {}) {
  return {
    id: "g1",
    status: "DRAFT",
    platform: "ALL",
    prizeCount: 1,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("PATCH /api/admin/giveaways/[id]", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makeRequest({ platform: "MOBILE" }), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when giveaway not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makeRequest({ platform: "MOBILE" }), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Giveaway not found" });
  });

  it("allows platform update on DRAFT giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeExisting());
    (prisma.giveaway.update as jest.Mock).mockResolvedValue({
      ...makeExisting(),
      platform: "ANDROID",
    });

    const res = await PATCH(makeRequest({ platform: "ANDROID" }), makeParams());
    expect(res.status).toBe(200);

    const updateCall = (prisma.giveaway.update as jest.Mock).mock.calls[0][0];
    expect(updateCall.data.platform).toBe("ANDROID");
  });

  it("blocks platform update on SCHEDULED giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeExisting({ status: "SCHEDULED" })
    );

    const res = await PATCH(makeRequest({ platform: "MOBILE" }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Cannot edit core fields after the giveaway leaves DRAFT status",
    });
  });

  it("blocks modification of cancelled giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeExisting({ status: "CANCELLED" })
    );

    // Send only translations (not a core field) to reach the CANCELLED check
    const res = await PATCH(
      makeRequest({ translations: [{ lang: "en", title: "T", details: "D" }] }),
      makeParams()
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Cannot modify a cancelled giveaway",
    });
  });

  it("blocks core field edits on DRAWN giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeExisting({ status: "DRAWN" })
    );

    // Send secretHash (not a core field that triggers the DRAFT check) to reach the DRAWN-specific check
    const res = await PATCH(
      makeRequest({ secretHash: "newhash" }),
      makeParams()
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Cannot edit core fields after DRAWN",
    });
  });

  it("validates state transitions", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeExisting({ status: "DRAFT" })
    );

    const res = await PATCH(makeRequest({ status: "DRAWN" }), makeParams());
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Invalid status transition");
  });

  it("returns 400 when prizeCount is less than 1", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeExisting());

    const res = await PATCH(makeRequest({ prizeCount: 0 }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "prizeCount must be at least 1",
    });
  });

  it("updates platform to IOS on DRAFT giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeExisting());
    (prisma.giveaway.update as jest.Mock).mockResolvedValue({
      ...makeExisting(),
      platform: "IOS",
    });

    const res = await PATCH(makeRequest({ platform: "IOS" }), makeParams());
    expect(res.status).toBe(200);

    const updateCall = (prisma.giveaway.update as jest.Mock).mock.calls[0][0];
    expect(updateCall.data.platform).toBe("IOS");
  });

  it("upserts translations when provided", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeExisting());
    (prisma.giveaway.update as jest.Mock).mockResolvedValue(makeExisting());
    (prisma.giveawayTranslation.upsert as jest.Mock).mockResolvedValue({});

    const translations = [
      { lang: "en", title: "Prize", details: "Win something" },
    ];

    const res = await PATCH(makeRequest({ translations }), makeParams());
    expect(res.status).toBe(200);
    expect(prisma.giveawayTranslation.upsert).toHaveBeenCalledTimes(1);
  });

  it("returns 500 on internal error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await PATCH(makeRequest({ platform: "ALL" }), makeParams());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to update giveaway" });
  });
});
