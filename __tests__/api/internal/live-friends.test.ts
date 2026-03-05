/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/internal/live-friends
 *
 * Covers:
 * - Forbidden when not from Live Server (403)
 * - Missing userId (400)
 * - Returns friend IDs from accepted friendships
 * - Returns empty array when no friends
 * - Internal server error (500)
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/internal/live-friends/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    friendship: { findMany: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const LIVE_SECRET = "test-secret";

beforeAll(() => {
  process.env.LIVE_INTERNAL_SECRET = LIVE_SECRET;
});

function makeRequest(
  body: Record<string, unknown>,
  isLiveServer = true
): NextRequest {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isLiveServer) {
    headers["x-live-server"] = "true";
    headers["x-live-secret"] = LIVE_SECRET;
  }
  return new Request("http://localhost/api/internal/live-friends", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/internal/live-friends", () => {
  it("returns 403 when not from Live Server", async () => {
    const res = await POST(makeRequest({ userId: "u1" }, false));
    expect(res.status).toBe(403);
  });

  it("returns 400 when userId is missing", async () => {
    const res = await POST(makeRequest({ userId: "" }));
    expect(res.status).toBe(400);
  });

  it("returns friend IDs from accepted friendships", async () => {
    (prisma.friendship.findMany as jest.Mock).mockResolvedValue([
      { senderId: "u1", receiverId: "u2" },
      { senderId: "u3", receiverId: "u1" },
    ]);

    const res = await POST(makeRequest({ userId: "u1" }));
    const json = await res.json();

    expect(json.friendIds).toEqual(["u2", "u3"]);
  });

  it("returns empty array when no friends", async () => {
    (prisma.friendship.findMany as jest.Mock).mockResolvedValue([]);

    const res = await POST(makeRequest({ userId: "u1" }));
    const json = await res.json();

    expect(json.friendIds).toEqual([]);
  });

  it("returns 500 on internal error", async () => {
    (prisma.friendship.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest({ userId: "u1" }));
    expect(res.status).toBe(500);
  });
});
