/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/giveaways/draw
 *
 * Covers secret validation (fail-closed) for the giveaway draw endpoint.
 */

export {};

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(authHeader?: string): Request {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authHeader !== undefined) {
    headers["authorization"] = authHeader;
  }
  return new Request("http://localhost/api/giveaways/draw", {
    method: "POST",
    headers,
  });
}

function setupMocks() {
  jest.doMock("@/lib/prisma", () => ({
    prisma: {
      giveaway: { findMany: jest.fn().mockResolvedValue([]) },
    },
  }));
  jest.doMock("@/lib/notifications", () => ({
    notifyGiveawayWinners: jest.fn().mockResolvedValue(undefined),
  }));
  jest.doMock("@prisma/client", () => ({
    GiveawayStatus: {
      SCHEDULED: "SCHEDULED",
      DRAWN: "DRAWN",
      CANCELLED: "CANCELLED",
    },
  }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/giveaways/draw", () => {
  const originalSecret = process.env.GIVEAWAY_DRAW_SECRET;

  afterEach(() => {
    if (originalSecret !== undefined) {
      process.env.GIVEAWAY_DRAW_SECRET = originalSecret;
    } else {
      delete process.env.GIVEAWAY_DRAW_SECRET;
    }
  });

  it("returns 401 when GIVEAWAY_DRAW_SECRET is not configured", async () => {
    delete process.env.GIVEAWAY_DRAW_SECRET;

    jest.resetModules();
    setupMocks();
    const { POST } = await import("@/app/api/giveaways/draw/route");

    const res = await POST(makeRequest("Bearer anything"));

    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is missing", async () => {
    process.env.GIVEAWAY_DRAW_SECRET = "test-secret";

    jest.resetModules();
    setupMocks();
    const { POST } = await import("@/app/api/giveaways/draw/route");

    const res = await POST(makeRequest());

    expect(res.status).toBe(401);
  });

  it("returns 401 when secret is wrong", async () => {
    process.env.GIVEAWAY_DRAW_SECRET = "test-secret";

    jest.resetModules();
    setupMocks();
    const { POST } = await import("@/app/api/giveaways/draw/route");

    const res = await POST(makeRequest("Bearer wrong-secret"));

    expect(res.status).toBe(401);
  });

  it("succeeds with valid secret", async () => {
    process.env.GIVEAWAY_DRAW_SECRET = "test-secret";

    jest.resetModules();
    setupMocks();
    const { POST } = await import("@/app/api/giveaways/draw/route");

    const res = await POST(makeRequest("Bearer test-secret"));

    expect(res.status).toBe(200);
  });
});
