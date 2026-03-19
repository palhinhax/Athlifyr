/**
 * @jest-environment node
 */

import { GET } from "@/app/api/cron/regenerate-sessions/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueRecurringSession: { findMany: jest.fn().mockResolvedValue([]) },
    venueSession: { findFirst: jest.fn(), create: jest.fn() },
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const CRON_SECRET = "test-cron-secret";

function makeRequest(authHeader?: string): Request {
  const headers: Record<string, string> = {};
  if (authHeader !== undefined) {
    headers["authorization"] = authHeader;
  }
  return new Request("http://localhost/api/cron/regenerate-sessions", {
    method: "GET",
    headers,
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/cron/regenerate-sessions", () => {
  const originalSecret = process.env.CRON_SECRET;

  afterEach(() => {
    if (originalSecret !== undefined) {
      process.env.CRON_SECRET = originalSecret;
    } else {
      delete process.env.CRON_SECRET;
    }
  });

  it("returns 401 when CRON_SECRET is not configured", async () => {
    delete process.env.CRON_SECRET;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const res = await GET(makeRequest(`Bearer anything`));

    expect(res.status).toBe(401);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("CRON_SECRET is not configured")
    );
    consoleSpy.mockRestore();
  });

  it("returns 401 when authorization header is missing", async () => {
    process.env.CRON_SECRET = CRON_SECRET;

    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is wrong", async () => {
    process.env.CRON_SECRET = CRON_SECRET;

    const res = await GET(makeRequest("Bearer wrong-secret"));

    expect(res.status).toBe(401);
  });

  it("succeeds with valid cron secret", async () => {
    process.env.CRON_SECRET = CRON_SECRET;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

    expect(res.status).toBe(200);
  });
});
