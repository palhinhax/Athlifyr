/**
 * @jest-environment node
 */

import { GET } from "@/app/api/credits/transactions/route";
import * as credits from "@/lib/credits";
import { getAuthUser } from "@/lib/auth-utils";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/credits", () => ({
  getTransactionHistory: jest.fn(),
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockGetTransactionHistory = credits.getTransactionHistory as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const makeRequest = (params?: string) =>
  new Request(
    `http://localhost/api/credits/transactions${params ? `?${params}` : ""}`,
    { method: "GET" }
  );

// ── GET ───────────────────────────────────────────────────────────────────────

describe("GET /api/credits/transactions", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
  });

  it("returns transaction history", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockGetTransactionHistory.mockResolvedValue({
      items: [
        { id: "tx1", amountCents: 1000, type: "TOP_UP" },
        { id: "tx2", amountCents: -500, type: "PURCHASE" },
      ],
      nextCursor: undefined,
      hasMore: false,
    });

    const res = await GET(makeRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toHaveLength(2);
    expect(body.hasMore).toBe(false);
    expect(mockGetTransactionHistory).toHaveBeenCalledWith("u1", {
      cursor: undefined,
      limit: undefined,
      type: undefined,
    });
  });

  it("passes query parameters to service", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockGetTransactionHistory.mockResolvedValue({
      items: [],
      nextCursor: undefined,
      hasMore: false,
    });

    const res = await GET(makeRequest("cursor=tx5&limit=10&type=PURCHASE"));

    expect(res.status).toBe(200);
    expect(mockGetTransactionHistory).toHaveBeenCalledWith("u1", {
      cursor: "tx5",
      limit: 10,
      type: "PURCHASE",
    });
  });

  it("returns 500 on internal error", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockGetTransactionHistory.mockRejectedValue(new Error("DB error"));

    const res = await GET(makeRequest());

    expect(res.status).toBe(500);
  });
});
