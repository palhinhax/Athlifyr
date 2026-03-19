/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/credits/top-up/route";
import * as credits from "@/lib/credits";
import { getAuthUser } from "@/lib/auth-utils";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/credits", () => ({
  createTopUpPaymentIntent: jest.fn(),
  getTopUpHistory: jest.fn(),
  MIN_TOPUP_AMOUNT_CENTS: 500,
  MAX_TOPUP_AMOUNT_CENTS: 50000,
  TOPUP_AMOUNTS_CENTS: [500, 1000, 2000, 5000],
  calculateTopUpFee: jest.fn((a: number) => Math.round(a * 0.04)),
  calculateNetCredits: jest.fn((a: number) => a - Math.round(a * 0.04)),
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockCreateTopUp = credits.createTopUpPaymentIntent as jest.Mock;
const mockGetTopUpHistory = credits.getTopUpHistory as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const makeGetRequest = (params?: string) =>
  new Request(
    `http://localhost/api/credits/top-up${params ? `?${params}` : ""}`,
    { method: "GET" }
  );

const makePostRequest = (body: object) =>
  new Request("http://localhost/api/credits/top-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// ── GET ───────────────────────────────────────────────────────────────────────

describe("GET /api/credits/top-up", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(401);
  });

  it("returns top-up history and options", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockGetTopUpHistory.mockResolvedValue({
      items: [{ id: "t1", grossAmountCents: 1000 }],
      nextCursor: undefined,
      hasMore: false,
    });

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toHaveLength(1);
    expect(body.topUpOptions).toHaveLength(4);
    expect(body.minAmountCents).toBe(500);
    expect(body.maxAmountCents).toBe(50000);
  });
});

// ── POST ──────────────────────────────────────────────────────────────────────

describe("POST /api/credits/top-up", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await POST(makePostRequest({ amountCents: 1000 }));

    expect(res.status).toBe(401);
  });

  it("returns 400 if amountCents is missing", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(makePostRequest({}));

    expect(res.status).toBe(400);
  });

  it("returns 400 if amountCents is not a number", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(makePostRequest({ amountCents: "abc" }));

    expect(res.status).toBe(400);
  });

  it("returns 400 if amountCents is negative", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(makePostRequest({ amountCents: -100 }));

    expect(res.status).toBe(400);
  });

  it("returns 400 if below minimum", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(makePostRequest({ amountCents: 100 }));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Minimum");
  });

  it("returns 400 if above maximum", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(makePostRequest({ amountCents: 60000 }));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Maximum");
  });

  it("creates payment intent for valid amount", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockCreateTopUp.mockResolvedValue({
      clientSecret: "secret_123",
      paymentIntentId: "pi_abc",
      topUpId: "topup_1",
      grossAmountCents: 1000,
      platformFeeCents: 40,
      netCreditedCents: 960,
    });

    const res = await POST(makePostRequest({ amountCents: 1000 }));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.clientSecret).toBe("secret_123");
    expect(body.netCreditedCents).toBe(960);
    expect(mockCreateTopUp).toHaveBeenCalledWith({
      userId: "u1",
      amountCents: 1000,
    });
  });
});
