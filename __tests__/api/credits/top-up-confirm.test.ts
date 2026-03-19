/**
 * @jest-environment node
 */

import { POST } from "@/app/api/credits/top-up/confirm/route";
import { getAuthUser } from "@/lib/auth-utils";
import * as credits from "@/lib/credits";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({ getAuthUser: jest.fn() }));
jest.mock("@/lib/credits", () => ({ completeTopUp: jest.fn() }));
jest.mock("@/lib/stripe", () => ({
  stripe: { paymentIntents: { retrieve: jest.fn() } },
}));
jest.mock("@/lib/prisma", () => ({
  prisma: { creditTopUp: { findUnique: jest.fn() } },
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockCompleteTopUp = credits.completeTopUp as jest.Mock;
const mockRetrievePI = stripe.paymentIntents.retrieve as jest.Mock;
const mockFindTopUp = prisma.creditTopUp.findUnique as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const makeReq = (body: object) =>
  new Request("http://localhost/api/credits/top-up/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/credits/top-up/confirm", () => {
  it("returns 401 for unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await POST(makeReq({ paymentIntentId: "pi_123" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when paymentIntentId is missing", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("paymentIntentId");
  });

  it("returns 400 when paymentIntentId is not a string", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const res = await POST(makeReq({ paymentIntentId: 123 }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when top-up not found", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockFindTopUp.mockResolvedValue(null);

    const res = await POST(makeReq({ paymentIntentId: "pi_123" }));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Top-up not found");
  });

  it("returns 403 when top-up belongs to another user", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockFindTopUp.mockResolvedValue({
      userId: "u2",
      status: "PENDING",
      stripePaymentIntentId: "pi_123",
    });

    const res = await POST(makeReq({ paymentIntentId: "pi_123" }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Forbidden");
  });

  it("returns already_completed for completed top-up", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockFindTopUp.mockResolvedValue({
      userId: "u1",
      status: "COMPLETED",
      stripePaymentIntentId: "pi_123",
    });

    const res = await POST(makeReq({ paymentIntentId: "pi_123" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("already_completed");
    expect(mockRetrievePI).not.toHaveBeenCalled();
  });

  it("returns 402 when payment not yet succeeded", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockFindTopUp.mockResolvedValue({
      userId: "u1",
      status: "PENDING",
      stripePaymentIntentId: "pi_123",
    });
    mockRetrievePI.mockResolvedValue({ status: "requires_payment_method" });

    const res = await POST(makeReq({ paymentIntentId: "pi_123" }));
    expect(res.status).toBe(402);
    const body = await res.json();
    expect(body.stripeStatus).toBe("requires_payment_method");
  });

  it("completes top-up when payment succeeded", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockFindTopUp.mockResolvedValue({
      userId: "u1",
      status: "PENDING",
      stripePaymentIntentId: "pi_123",
    });
    mockRetrievePI.mockResolvedValue({ status: "succeeded" });
    mockCompleteTopUp.mockResolvedValue(undefined);

    const res = await POST(makeReq({ paymentIntentId: "pi_123" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("completed");
    expect(mockCompleteTopUp).toHaveBeenCalledWith("pi_123");
  });

  it("returns 500 on internal error", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockFindTopUp.mockRejectedValue(new Error("DB error"));

    const res = await POST(makeReq({ paymentIntentId: "pi_123" }));
    expect(res.status).toBe(500);
  });
});
