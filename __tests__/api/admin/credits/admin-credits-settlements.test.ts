/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/admin/credits/settlements/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as credits from "@/lib/credits";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueLedgerEntry: { groupBy: jest.fn() },
    venue: { findMany: jest.fn() },
    venueSettlementBatch: { findMany: jest.fn() },
  },
}));
jest.mock("@/lib/credits", () => ({
  getVenuePendingBalance: jest.fn(),
  getVenueSettlementHistory: jest.fn(),
  retrySettlement: jest.fn(),
  settleVenueManually: jest.fn(),
}));

const mockAuth = auth as jest.Mock;
const mockGetPending = credits.getVenuePendingBalance as jest.Mock;
const mockGetHistory = credits.getVenueSettlementHistory as jest.Mock;
const mockRetry = credits.retrySettlement as jest.Mock;
const mockSettle = credits.settleVenueManually as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const adminSession = { user: { id: "admin1", role: "ADMIN" } };

const makeGetReq = (query?: string) =>
  new Request(
    `http://localhost/api/admin/credits/settlements${query ? `?${query}` : ""}`,
    { method: "GET" }
  );

const makePostReq = (body: object) =>
  new Request("http://localhost/api/admin/credits/settlements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// ── GET ───────────────────────────────────────────────────────────────────────

describe("GET /api/admin/credits/settlements", () => {
  it("returns 401 for unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await GET(makeGetReq()))!;
    expect(res.status).toBe(401);
  });

  it("returns 401 for non-admin", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "USER" } });
    const res = (await GET(makeGetReq()))!;
    expect(res.status).toBe(401);
  });

  it("returns single venue details when venueId provided", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockGetPending.mockResolvedValue(5000);
    mockGetHistory.mockResolvedValue([{ id: "batch1" }]);

    const res = (await GET(makeGetReq("venueId=v1")))!;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.pending).toBe(5000);
    expect(body.settlements).toHaveLength(1);
    expect(mockGetPending).toHaveBeenCalledWith("v1");
    expect(mockGetHistory).toHaveBeenCalledWith("v1", { limit: 20 });
  });

  it("returns overview of all venues with pending balances", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.venueLedgerEntry.groupBy as jest.Mock).mockResolvedValue([
      { venueId: "v1", _sum: { amountCents: 3000 }, _count: { id: 5 } },
      { venueId: "v2", _sum: { amountCents: 7000 }, _count: { id: 12 } },
    ]);
    (prisma.venue.findMany as jest.Mock).mockResolvedValue([
      {
        id: "v1",
        name: "Venue 1",
        slug: "venue-1",
        stripeAccountId: "acct_1",
        stripePayoutsEnabled: true,
      },
      {
        id: "v2",
        name: "Venue 2",
        slug: "venue-2",
        stripeAccountId: null,
        stripePayoutsEnabled: false,
      },
    ]);
    (prisma.venueSettlementBatch.findMany as jest.Mock).mockResolvedValue([]);

    const res = (await GET(makeGetReq()))!;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.overview).toHaveLength(2);
    expect(body.overview[0].pendingAmountCents).toBe(3000);
    expect(body.overview[1].venue.name).toBe("Venue 2");
    expect(body.recentSettlements).toHaveLength(0);
  });

  it("handles null _sum amounts in overview", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.venueLedgerEntry.groupBy as jest.Mock).mockResolvedValue([
      { venueId: "v1", _sum: { amountCents: null }, _count: { id: 0 } },
    ]);
    (prisma.venue.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.venueSettlementBatch.findMany as jest.Mock).mockResolvedValue([]);

    const res = (await GET(makeGetReq()))!;
    const body = await res.json();
    expect(body.overview[0].pendingAmountCents).toBe(0);
  });

  it("returns 500 on internal error", async () => {
    mockAuth.mockResolvedValue(adminSession);
    (prisma.venueLedgerEntry.groupBy as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = (await GET(makeGetReq()))!;
    expect(res.status).toBe(500);
  });
});

// ── POST ──────────────────────────────────────────────────────────────────────

describe("POST /api/admin/credits/settlements", () => {
  it("returns 401 for unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await POST(makePostReq({ batchId: "b1" })))!;
    expect(res.status).toBe(401);
  });

  it("settles venue manually when action=settle", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockSettle.mockResolvedValue(undefined);

    const res = (await POST(makePostReq({ action: "settle", venueId: "v1" })))!;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(mockSettle).toHaveBeenCalledWith("v1");
  });

  it("returns 400 when batchId is missing for retry", async () => {
    mockAuth.mockResolvedValue(adminSession);
    const res = (await POST(makePostReq({})))!;
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("batchId");
  });

  it("retries a failed settlement batch", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRetry.mockResolvedValue(undefined);

    const res = (await POST(makePostReq({ batchId: "batch1" })))!;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(mockRetry).toHaveBeenCalledWith("batch1");
  });

  it("returns 500 with error message on service failure", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRetry.mockRejectedValue(new Error("Transfer failed"));

    const res = (await POST(makePostReq({ batchId: "batch1" })))!;
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Transfer failed");
  });

  it("returns generic error for non-Error exceptions", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRetry.mockRejectedValue("unknown");

    const res = (await POST(makePostReq({ batchId: "batch1" })))!;
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to retry settlement");
  });
});
