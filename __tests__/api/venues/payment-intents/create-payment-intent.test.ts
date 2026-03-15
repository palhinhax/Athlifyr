/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/payment-intents/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// Mock auth
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: { findUnique: jest.fn() },
    venuePlan: { findFirst: jest.fn() },
    paymentIntent: { create: jest.fn() },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: { create: jest.fn() },
  },
  toStripeAmount: (n: number) => Math.round(n * 100),
}));

const venueId = "venue-1";
const userId = "user-1";
const planId = "plan-1";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId }) }) as {
    params: Promise<{ id: string }>;
  };

const makeRequest = (body: object) =>
  new Request(`http://localhost/api/venues/${venueId}/payment-intents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const mockVenue = {
  id: venueId,
  name: "Test Gym",
  isActive: true,
  paymentMode: "IN_APP",
  stripeAccountId: "acct_123",
  stripeOnboardingStatus: "COMPLETE",
  commissionType: "PERCENT",
  commissionValue: 10,
};

const mockPlan = {
  id: planId,
  venueId,
  name: "Drop-in Pass",
  price: 15,
  currency: "EUR",
  isActive: true,
};

describe("POST /api/venues/[id]/payment-intents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 when planId is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    const res = await POST(makeRequest({}), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Plan ID is required" });
  });

  it("returns 404 when venue not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Venue not found" });
  });

  it("returns 404 when venue is inactive", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      isActive: false,
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 404 when plan not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Plan not found" });
  });

  it("returns 400 when plan has no valid price", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue({
      ...mockPlan,
      price: 0,
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Plan must have a valid price",
    });
  });

  it("returns 400 when venue does not support IN_APP payments", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      paymentMode: "EXTERNAL",
    });
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Venue does not support IN_APP payments",
    });
  });

  it("returns 400 when Stripe not fully configured", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeOnboardingStatus: "PENDING",
    });
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Venue Stripe account is not fully configured",
    });
  });

  it("creates payment intent with PERCENT commission", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com", name: "User" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
    });
    (prisma.paymentIntent.create as jest.Mock).mockResolvedValue({
      id: "local-pi",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.clientSecret).toBe("pi_secret");
    expect(body.paymentIntent.id).toBe("local-pi");

    // Commission: 10% of 1500 cents = 150 cents
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 1500,
        currency: "eur",
        application_fee_amount: 150,
        transfer_data: { destination: "acct_123" },
      })
    );

    expect(prisma.paymentIntent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        venueId,
        userId,
        planId,
        amount: 15,
        currency: "EUR",
        status: "CREATED",
        provider: "STRIPE",
        stripePaymentIntentId: "pi_123",
      }),
    });
  });

  it("creates payment intent with FIXED commission", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com", name: "User" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      commissionType: "FIXED",
      commissionValue: 200, // 200 cents
    });
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
    });
    (prisma.paymentIntent.create as jest.Mock).mockResolvedValue({
      id: "local-pi",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(201);

    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        application_fee_amount: 200,
      })
    );
  });

  it("omits application_fee_amount when commission is 0", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com", name: "User" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      commissionValue: 0,
    });
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
    });
    (prisma.paymentIntent.create as jest.Mock).mockResolvedValue({
      id: "local-pi",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(201);

    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        application_fee_amount: undefined,
      })
    );
  });

  it("works with MIXED payment mode", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com", name: "User" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      paymentMode: "MIXED",
    });
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
    });
    (prisma.paymentIntent.create as jest.Mock).mockResolvedValue({
      id: "local-pi",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(201);
  });

  it("returns 500 on unexpected error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB crash")
    );

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to create payment intent",
    });
  });
});
