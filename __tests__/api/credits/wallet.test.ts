/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/credits/wallet/route";
import * as credits from "@/lib/credits";
import { getAuthUser } from "@/lib/auth-utils";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/credits", () => ({
  getWalletWithStats: jest.fn(),
  getOrCreateWallet: jest.fn(),
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockGetWalletWithStats = credits.getWalletWithStats as jest.Mock;
const mockGetOrCreateWallet = credits.getOrCreateWallet as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const makeRequest = (method: string) =>
  new Request("http://localhost/api/credits/wallet", { method });

// ── GET ───────────────────────────────────────────────────────────────────────

describe("GET /api/credits/wallet", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await GET(makeRequest("GET"));

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns wallet stats for authenticated user", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockGetWalletWithStats.mockResolvedValue({
      balanceCents: 5000,
      totalTopUpCents: 10000,
      totalSpentCents: 5000,
      totalRewardedCents: 0,
    });

    const res = await GET(makeRequest("GET"));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.wallet).toEqual({
      balanceCents: 5000,
      totalTopUpCents: 10000,
      totalSpentCents: 5000,
      totalRewardedCents: 0,
    });
    expect(mockGetWalletWithStats).toHaveBeenCalledWith("u1");
  });

  it("returns 500 on internal error", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockGetWalletWithStats.mockRejectedValue(new Error("DB error"));

    const res = await GET(makeRequest("GET"));

    expect(res.status).toBe(500);
  });
});

// ── POST ──────────────────────────────────────────────────────────────────────

describe("POST /api/credits/wallet", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await POST(makeRequest("POST"));

    expect(res.status).toBe(401);
  });

  it("creates and returns wallet for authenticated user", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockGetOrCreateWallet.mockResolvedValue({
      balanceCents: 0,
      totalTopUpCents: 0,
      totalSpentCents: 0,
      totalRewardedCents: 0,
    });

    const res = await POST(makeRequest("POST"));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.wallet.balanceCents).toBe(0);
    expect(mockGetOrCreateWallet).toHaveBeenCalledWith("u1");
  });
});
