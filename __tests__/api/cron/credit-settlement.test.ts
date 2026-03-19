/**
 * @jest-environment node
 */

import { GET } from "@/app/api/cron/credit-settlement/route";
import * as credits from "@/lib/credits";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/credits", () => ({ executeWeeklySettlement: jest.fn() }));

const mockSettlement = credits.executeWeeklySettlement as jest.Mock;

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

const makeReq = (authHeader?: string) => {
  const headers: Record<string, string> = {};
  if (authHeader) headers["authorization"] = authHeader;
  return new Request("http://localhost/api/cron/credit-settlement", {
    method: "GET",
    headers,
  });
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/cron/credit-settlement", () => {
  it("returns 401 when CRON_SECRET is set and auth header is wrong", async () => {
    process.env.CRON_SECRET = "my-secret";

    const res = await GET(makeReq("Bearer wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when CRON_SECRET is set and auth header is missing", async () => {
    process.env.CRON_SECRET = "my-secret";

    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it("succeeds when CRON_SECRET matches", async () => {
    process.env.CRON_SECRET = "my-secret";
    mockSettlement.mockResolvedValue({
      processedVenues: 3,
      totalTransferred: 15000,
      errors: [],
    });

    const res = await GET(makeReq("Bearer my-secret"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.processedVenues).toBe(3);
    expect(body.totalTransferredCents).toBe(15000);
    expect(body.errorsCount).toBe(0);
  });

  it("allows access when CRON_SECRET is not set", async () => {
    delete process.env.CRON_SECRET;
    mockSettlement.mockResolvedValue({
      processedVenues: 0,
      totalTransferred: 0,
      errors: [],
    });

    const res = await GET(makeReq());
    expect(res.status).toBe(200);
  });

  it("includes errors in the response", async () => {
    delete process.env.CRON_SECRET;
    mockSettlement.mockResolvedValue({
      processedVenues: 2,
      totalTransferred: 5000,
      errors: ["Venue v1: Stripe transfer failed"],
    });

    const res = await GET(makeReq());
    const body = await res.json();
    expect(body.errorsCount).toBe(1);
    expect(body.errors).toContain("Venue v1: Stripe transfer failed");
  });

  it("returns 500 on internal error", async () => {
    delete process.env.CRON_SECRET;
    mockSettlement.mockRejectedValue(new Error("Settlement failed"));

    const res = await GET(makeReq());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Settlement processing failed");
  });
});
