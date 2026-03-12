/**
 * @jest-environment node
 */

/**
 * Tests for /api/admin/giveaways/[id]/participants
 *
 * Covers:
 * - GET: Returns 401 when not admin
 * - GET: Returns 404 when giveaway not found
 * - GET: Returns paginated participants list
 * - POST: Returns 401 when not admin
 * - POST: Returns 400 when userId is missing
 * - POST: Returns 404 when giveaway not found
 * - POST: Returns 404 when user not found
 * - POST: Returns 409 when user already participates
 * - POST: Creates participation and returns 201
 * - DELETE: Returns 401 when not admin
 * - DELETE: Returns 400 when userId is missing
 * - DELETE: Returns 404 when participation not found
 * - DELETE: Removes participation and returns success
 * - GET/POST/DELETE: Returns 500 on database error
 */

import { NextRequest } from "next/server";
import {
  GET,
  POST,
  DELETE,
} from "@/app/api/admin/giveaways/[id]/participants/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { findUnique: jest.fn() },
    giveawayParticipation: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    user: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const adminSession = {
  user: { id: "admin-1", role: "ADMIN", email: "admin@test.com" },
};

function makeGetRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/admin/giveaways/g1/participants");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString(), { method: "GET" });
}

function makePostRequest(body: Record<string, unknown> = {}): NextRequest {
  return new NextRequest(
    "http://localhost/api/admin/giveaways/g1/participants",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
}

function makeDeleteRequest(body: Record<string, unknown> = {}): NextRequest {
  return new NextRequest(
    "http://localhost/api/admin/giveaways/g1/participants",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
}

function makeParams(id = "g1") {
  return { params: Promise.resolve({ id }) };
}

const GIVEAWAY = { id: "g1", title: "Test Giveaway" };

const PARTICIPATION = {
  id: "p1",
  ticketNumber: 1,
  createdAt: new Date().toISOString(),
  user: { id: "user-1", name: "User 1", email: "u1@test.com", image: null },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/admin/giveaways/[id]/participants", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest(), makeParams());

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 when user is not admin role", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "u1", role: "USER", email: "user@test.com" },
    });

    const res = await GET(makeGetRequest(), makeParams());

    expect(res.status).toBe(401);
  });

  it("returns 404 when giveaway not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest(), makeParams());

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Giveaway not found" });
  });

  it("returns paginated participants list", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(GIVEAWAY);
    (prisma.giveawayParticipation.count as jest.Mock).mockResolvedValue(1);
    (prisma.giveawayParticipation.findMany as jest.Mock).mockResolvedValue([
      PARTICIPATION,
    ]);

    const res = await GET(makeGetRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.participations).toHaveLength(1);
    expect(json.pagination.totalCount).toBe(1);
    expect(json.pagination.totalPages).toBe(1);
    expect(json.pagination.hasMore).toBe(false);
  });

  it("respects pagination parameters", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(GIVEAWAY);
    (prisma.giveawayParticipation.count as jest.Mock).mockResolvedValue(50);
    (prisma.giveawayParticipation.findMany as jest.Mock).mockResolvedValue(
      Array(10).fill(PARTICIPATION)
    );

    const res = await GET(
      makeGetRequest({ page: "2", pageSize: "10" }),
      makeParams()
    );
    const json = await res.json();

    expect(json.pagination.page).toBe(2);
    expect(json.pagination.pageSize).toBe(10);
    expect(json.pagination.totalPages).toBe(5);
    expect(json.pagination.hasMore).toBe(true);
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const res = await GET(makeGetRequest(), makeParams());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to fetch participants",
    });
    consoleSpy.mockRestore();
  });
});

describe("POST /api/admin/giveaways/[id]/participants", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest({ userId: "user-1" }), makeParams());

    expect(res.status).toBe(401);
  });

  it("returns 400 when userId is missing", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);

    const res = await POST(makePostRequest({}), makeParams());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "userId is required" });
  });

  it("returns 400 when userId is not a string", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);

    const res = await POST(makePostRequest({ userId: 123 }), makeParams());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "userId is required" });
  });

  it("returns 404 when giveaway not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest({ userId: "user-1" }), makeParams());

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Giveaway not found" });
  });

  it("returns 404 when user not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(GIVEAWAY);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest({ userId: "user-1" }), makeParams());

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "User not found" });
  });

  it("returns 409 when user already participates", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(GIVEAWAY);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
    });
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue({
      id: "p-existing",
    });

    const res = await POST(makePostRequest({ userId: "user-1" }), makeParams());

    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "User already participates" });
  });

  it("creates participation and returns 201", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(GIVEAWAY);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1" });
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      id: "p-new",
      ticketNumber: 5,
      user: {
        id: "user-1",
        name: "User 1",
        email: "u1@test.com",
        image: null,
      },
    });

    const res = await POST(makePostRequest({ userId: "user-1" }), makeParams());
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.participation.id).toBe("p-new");
    expect(json.participation.ticketNumber).toBe(5);
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const res = await POST(makePostRequest({ userId: "user-1" }), makeParams());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to add participant",
    });
    consoleSpy.mockRestore();
  });
});

describe("DELETE /api/admin/giveaways/[id]/participants", () => {
  it("returns 401 when not admin", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(
      makeDeleteRequest({ userId: "user-1" }),
      makeParams()
    );

    expect(res.status).toBe(401);
  });

  it("returns 400 when userId is missing", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);

    const res = await DELETE(makeDeleteRequest({}), makeParams());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "userId is required" });
  });

  it("returns 404 when participation not found", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );

    const res = await DELETE(
      makeDeleteRequest({ userId: "user-1" }),
      makeParams()
    );

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Participation not found" });
  });

  it("removes participation and returns success", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue({
      id: "p1",
    });
    (prisma.giveawayParticipation.delete as jest.Mock).mockResolvedValue({});

    const res = await DELETE(
      makeDeleteRequest({ userId: "user-1" }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(prisma.giveawayParticipation.delete).toHaveBeenCalledWith({
      where: { id: "p1" },
    });
  });

  it("returns 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue(adminSession);
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const res = await DELETE(
      makeDeleteRequest({ userId: "user-1" }),
      makeParams()
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to remove participant",
    });
    consoleSpy.mockRestore();
  });
});
