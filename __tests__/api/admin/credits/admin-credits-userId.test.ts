/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/admin/credits/[userId]/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as credits from "@/lib/credits";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn(), findFirst: jest.fn() },
    creditWallet: { findUnique: jest.fn(), update: jest.fn() },
    creditTransaction: { findMany: jest.fn(), create: jest.fn() },
    creditTopUp: { findMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));
jest.mock("@/lib/credits", () => ({ creditWallet: jest.fn() }));

const mockAuth = auth as jest.Mock;
const mockCreditWallet = credits.creditWallet as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const makeReq = (method: string, body?: object) =>
  new Request("http://localhost/api/admin/credits/user1", {
    method,
    ...(body
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });

const params = Promise.resolve({ userId: "user1" });
const adminSession = { user: { id: "admin1", role: "ADMIN" } };

// ── GET ───────────────────────────────────────────────────────────────────────

describe("GET /api/admin/credits/[userId]", () => {
  it("returns 401 for unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await GET(makeReq("GET"), { params }))!;
    expect(res.status).toBe(401);
  });

  it("returns 401 for non-admin", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "USER" } });
    const res = (await GET(makeReq("GET"), { params }))!;
    expect(res.status).toBe(401);
  });

  it("returns 404 when user not found", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const res = (await GET(makeReq("GET"), { params }))!;
    expect(res.status).toBe(404);
  });

  it("returns wallet data for existing user", async () => {
    mockAuth.mockResolvedValue(adminSession);
    // resolveUserId: found by ID
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce({ id: "user1" }) // resolveUserId by id
      .mockResolvedValueOnce({
        id: "user1",
        name: "Test",
        email: "t@t.com",
        image: null,
      }); // user fetch
    (prisma.creditWallet.findUnique as jest.Mock).mockResolvedValue({
      balanceCents: 1000,
      totalTopUpCents: 2000,
      totalSpentCents: 1000,
      totalRewardedCents: 0,
    });
    (prisma.creditTransaction.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.creditTopUp.findMany as jest.Mock).mockResolvedValue([]);

    const res = (await GET(makeReq("GET"), { params }))!;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.id).toBe("user1");
    expect(body.wallet.balanceCents).toBe(1000);
  });

  it("returns default wallet when user has no wallet", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce({ id: "user1" })
      .mockResolvedValueOnce({
        id: "user1",
        name: "Test",
        email: "t@t.com",
        image: null,
      });
    (prisma.creditWallet.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.creditTransaction.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.creditTopUp.findMany as jest.Mock).mockResolvedValue([]);

    const res = (await GET(makeReq("GET"), { params }))!;
    const body = await res.json();
    expect(body.wallet.balanceCents).toBe(0);
  });

  it("resolves user by email", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(null) // not found by id
      .mockResolvedValueOnce({ id: "user1" }) // found by email
      .mockResolvedValueOnce({
        id: "user1",
        name: "Test",
        email: "t@t.com",
        image: null,
      });
    (prisma.creditWallet.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.creditTransaction.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.creditTopUp.findMany as jest.Mock).mockResolvedValue([]);

    const res = (await GET(makeReq("GET"), { params }))!;
    expect(res.status).toBe(200);
  });

  it("resolves user by name", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(null) // not by id
      .mockResolvedValueOnce(null); // not by email
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: "user1" }); // by name
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
      name: "Test",
      email: "t@t.com",
      image: null,
    });
    (prisma.creditWallet.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.creditTransaction.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.creditTopUp.findMany as jest.Mock).mockResolvedValue([]);

    const res = (await GET(makeReq("GET"), { params }))!;
    expect(res.status).toBe(200);
  });

  it("returns 500 on internal error", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB down")
    );

    const res = (await GET(makeReq("GET"), { params }))!;
    expect(res.status).toBe(500);
  });
});

// ── POST ──────────────────────────────────────────────────────────────────────

describe("POST /api/admin/credits/[userId]", () => {
  it("returns 401 for non-admin", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "USER" } });
    const res = (await POST(makeReq("POST", { amountCents: 500 }), {
      params,
    }))!;
    expect(res.status).toBe(401);
  });

  it("returns 404 when user not found", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const res = (await POST(makeReq("POST", { amountCents: 500 }), {
      params,
    }))!;
    expect(res.status).toBe(404);
  });

  it("returns 400 for non-integer amountCents", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
    });

    const res = (await POST(makeReq("POST", { amountCents: 5.5 }), {
      params,
    }))!;
    expect(res.status).toBe(400);
  });

  it("returns 400 when amountCents is zero", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
    });

    const res = (await POST(makeReq("POST", { amountCents: 0 }), { params }))!;
    expect(res.status).toBe(400);
  });

  it("returns 400 when amountCents is missing", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
    });

    const res = (await POST(makeReq("POST", { note: "test" }), { params }))!;
    expect(res.status).toBe(400);
  });

  it("credits wallet for positive amount", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
    });
    mockCreditWallet.mockResolvedValue({
      transactionId: "tx1",
      newBalanceCents: 1500,
    });

    const res = (await POST(
      makeReq("POST", { amountCents: 500, note: "Bonus" }),
      { params }
    ))!;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.action).toBe("credit");
    expect(body.amountCents).toBe(500);
    expect(mockCreditWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user1",
        amountCents: 500,
        type: "MANUAL_ADJUSTMENT",
      })
    );
  });

  it("debits wallet for negative amount", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
    });
    (prisma.creditWallet.findUnique as jest.Mock).mockResolvedValue({
      balanceCents: 1000,
    });
    (prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
      const tx = {
        creditWallet: {
          update: jest.fn().mockResolvedValue({ balanceCents: 500 }),
        },
        creditTransaction: {
          create: jest.fn().mockResolvedValue({ id: "tx2", balanceCents: 500 }),
        },
      };
      return fn(tx);
    });

    const res = (await POST(
      makeReq("POST", { amountCents: -500, note: "Deduction" }),
      { params }
    ))!;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.action).toBe("debit");
  });

  it("returns 400 for insufficient balance on debit", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
    });
    (prisma.creditWallet.findUnique as jest.Mock).mockResolvedValue({
      balanceCents: 100,
    });

    const res = (await POST(makeReq("POST", { amountCents: -500 }), {
      params,
    }))!;
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Insufficient");
  });

  it("uses MANUAL source when invalid source provided", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
    });
    mockCreditWallet.mockResolvedValue({
      transactionId: "tx1",
      newBalanceCents: 500,
    });

    await POST(
      makeReq("POST", { amountCents: 500, source: "INVALID_SOURCE" }),
      { params }
    );
    expect(mockCreditWallet).toHaveBeenCalledWith(
      expect.objectContaining({ source: "MANUAL" })
    );
  });

  it("returns 500 on internal error", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB err")
    );

    const res = (await POST(makeReq("POST", { amountCents: 500 }), {
      params,
    }))!;
    expect(res.status).toBe(500);
  });
});
