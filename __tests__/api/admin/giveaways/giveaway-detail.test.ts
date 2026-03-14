/**
 * @jest-environment node
 */

/**
 * Tests for /api/admin/giveaways/[id]
 *
 * Covers:
 * - GET: Returns 401 when not admin
 * - GET: Returns 404 when giveaway not found
 * - GET: Returns giveaway detail
 * - PATCH: Returns 401 when not admin
 * - PATCH: Returns 404 when giveaway not found
 * - PATCH: Rejects invalid status transitions
 * - PATCH: Rejects editing core fields (including platform) on non-DRAFT giveaway
 * - PATCH: Updates platform field on DRAFT giveaway
 * - PATCH: Updates status with valid transition
 * - PATCH: Upserts translations
 * - PATCH: Rejects modifications on CANCELLED giveaway
 * - PATCH: Limits edits on DRAWN giveaway
 * - DELETE: Returns 401 when not admin
 * - DELETE: Returns 404 when giveaway not found
 * - DELETE: Rejects deletion of non-DRAFT giveaway
 * - DELETE: Deletes DRAFT giveaway
 * - Error handling (500)
 */

import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "@/app/api/admin/giveaways/[id]/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    giveawayTranslation: { upsert: jest.fn(), deleteMany: jest.fn() },
    giveawayParticipation: { deleteMany: jest.fn() },
    giveawayWinner: { deleteMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const adminSession = {
  user: { id: "admin-1", role: "ADMIN", email: "admin@test.com" },
};

function makeGetRequest(): NextRequest {
  return new NextRequest("http://localhost/api/admin/giveaways/g1", {
    method: "GET",
  });
}

function makePatchRequest(body: Record<string, unknown> = {}): NextRequest {
  return new NextRequest("http://localhost/api/admin/giveaways/g1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest(): NextRequest {
  return new NextRequest("http://localhost/api/admin/giveaways/g1", {
    method: "DELETE",
  });
}

function makeParams(id = "g1") {
  return { params: Promise.resolve({ id }) };
}

function makeGiveaway(overrides: Record<string, unknown> = {}) {
  return {
    id: "g1",
    status: "DRAFT",
    platform: "ALL",
    drawAt: null,
    prizeCount: 1,
    secretHash: null,
    secretRevealed: null,
    event: { id: "e1", title: "Event", slug: "event" },
    translations: [],
    _count: { participations: 0, winners: 0 },
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

// ═══════════════════════════════════════════════════════════════════════════════
// GET
// ═══════════════════════════════════════════════════════════════════════════════

describe("GET /api/admin/giveaways/[id]", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest(), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when giveaway not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest(), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns giveaway detail", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeGiveaway());

    const res = await GET(makeGetRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.id).toBe("g1");
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeGetRequest(), makeParams());
    expect(res.status).toBe(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PATCH
// ═══════════════════════════════════════════════════════════════════════════════

describe("PATCH /api/admin/giveaways/[id]", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makePatchRequest({}), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when giveaway not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makePatchRequest({}), makeParams());
    expect(res.status).toBe(404);
  });

  it("rejects invalid status transition (DRAFT → DRAWN)", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAFT" })
    );

    const res = await PATCH(
      makePatchRequest({ status: "DRAWN" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Invalid status transition");
  });

  it("rejects editing core fields on non-DRAFT giveaway (drawAt)", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "SCHEDULED" })
    );

    const res = await PATCH(
      makePatchRequest({ drawAt: "2026-12-31T00:00:00Z" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Cannot edit core fields");
  });

  it("rejects editing platform on non-DRAFT giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "SCHEDULED" })
    );

    const res = await PATCH(
      makePatchRequest({ platform: "MOBILE" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Cannot edit core fields");
  });

  it("rejects editing prizeCount on non-DRAFT giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "SCHEDULED" })
    );

    const res = await PATCH(makePatchRequest({ prizeCount: 5 }), makeParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Cannot edit core fields");
  });

  it("updates platform field on DRAFT giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAFT" })
    );
    (prisma.giveaway.update as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "MOBILE" })
    );

    const res = await PATCH(
      makePatchRequest({ platform: "MOBILE" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.platform).toBe("MOBILE");
    expect(prisma.giveaway.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ platform: "MOBILE" }),
      })
    );
  });

  it("updates status with valid transition (DRAFT → SCHEDULED)", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAFT" })
    );
    (prisma.giveaway.update as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "SCHEDULED" })
    );

    const res = await PATCH(
      makePatchRequest({ status: "SCHEDULED" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.status).toBe("SCHEDULED");
  });

  it("upserts translations when provided", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAFT" })
    );
    (prisma.giveaway.update as jest.Mock).mockResolvedValue(makeGiveaway());
    (prisma.giveawayTranslation.upsert as jest.Mock).mockResolvedValue({});

    const translations = [{ lang: "EN", title: "Test", details: "Details" }];

    const res = await PATCH(makePatchRequest({ translations }), makeParams());

    expect(res.status).toBe(200);
    expect(prisma.giveawayTranslation.upsert).toHaveBeenCalledTimes(1);
  });

  it("rejects modifications on CANCELLED giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "CANCELLED" })
    );

    const res = await PATCH(
      makePatchRequest({ secretRevealed: "secret" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Cannot modify a cancelled giveaway");
  });

  it("rejects editing core fields on DRAWN giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAWN" })
    );

    const res = await PATCH(makePatchRequest({ prizeCount: 3 }), makeParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Cannot edit core fields");
  });

  it("allows revealing secret on DRAWN giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAWN" })
    );
    (prisma.giveaway.update as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAWN", secretRevealed: "my-secret" })
    );

    const res = await PATCH(
      makePatchRequest({ secretRevealed: "my-secret" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.secretRevealed).toBe("my-secret");
  });

  it("rejects prizeCount less than 1", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAFT" })
    );

    const res = await PATCH(makePatchRequest({ prizeCount: 0 }), makeParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("prizeCount must be at least 1");
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await PATCH(makePatchRequest({}), makeParams());
    expect(res.status).toBe(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE
// ═══════════════════════════════════════════════════════════════════════════════

describe("DELETE /api/admin/giveaways/[id]", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest(), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when giveaway not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest(), makeParams());
    expect(res.status).toBe(404);
  });

  it("rejects deletion of non-DRAFT giveaway", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "SCHEDULED" })
    );

    const res = await DELETE(makeDeleteRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Only DRAFT giveaways can be deleted");
  });

  it("deletes DRAFT giveaway successfully", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAFT" })
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue(undefined);

    const res = await DELETE(makeDeleteRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await DELETE(makeDeleteRequest(), makeParams());
    expect(res.status).toBe(500);
  });
});
