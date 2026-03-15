/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/stripe-subscriptions/route";
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
    venueSubscription: { findFirst: jest.fn(), create: jest.fn() },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    products: { search: jest.fn(), create: jest.fn() },
    prices: { create: jest.fn() },
    subscriptions: { create: jest.fn(), cancel: jest.fn() },
    paymentIntents: { list: jest.fn() },
  },
  toStripeAmount: (n: number) => Math.round(n * 100),
}));

// Mock stripe-customer
const mockGetOrCreateStripeCustomer = jest.fn();
jest.mock("@/lib/stripe-customer", () => ({
  getOrCreateStripeCustomer: (...args: unknown[]) =>
    mockGetOrCreateStripeCustomer(...args),
}));

const venueId = "venue-1";
const userId = "user-1";
const planId = "plan-1";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId }) }) as {
    params: Promise<{ id: string }>;
  };

const makeRequest = (body: object) =>
  new Request(`http://localhost/api/venues/${venueId}/stripe-subscriptions`, {
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
  name: "Monthly Plan",
  price: 30,
  currency: "EUR",
  isActive: true,
  policy: { duration: "MONTHLY", durationValue: 1 },
};

describe("POST /api/venues/[id]/stripe-subscriptions", () => {
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
    expect(await res.json()).toEqual({ error: "Venue not found" });
  });

  it("returns 400 when venue payment mode is EXTERNAL", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      paymentMode: "EXTERNAL",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Venue does not support IN_APP payments",
    });
  });

  it("returns 400 when Stripe onboarding is incomplete", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeOnboardingStatus: "PENDING",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Venue Stripe account is not fully configured",
    });
  });

  it("returns 400 when venue has no Stripe account", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeAccountId: null,
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Venue Stripe account is not fully configured",
    });
  });

  it("returns 404 when plan not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: "Plan not found or has no valid price",
    });
  });

  it("returns 404 when plan price is 0", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue({
      ...mockPlan,
      price: 0,
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: "Plan not found or has no valid price",
    });
  });

  it("returns 409 when user already has an active subscription", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-existing",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({
      error: "You already have an active subscription to this plan",
    });
  });

  it("returns 400 for unsupported plan duration", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue({
      ...mockPlan,
      policy: { duration: "ONE_TIME" },
    });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("does not support recurring billing");
  });

  it("creates subscription successfully with PERCENT commission", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@e.com" } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    mockGetOrCreateStripeCustomer.mockResolvedValue("cus_123");
    (stripe.products.search as jest.Mock).mockResolvedValue({ data: [] });
    (stripe.products.create as jest.Mock).mockResolvedValue({
      id: "prod_new",
    });
    (stripe.prices.create as jest.Mock).mockResolvedValue({
      id: "price_new",
    });
    (stripe.subscriptions.create as jest.Mock).mockResolvedValue({
      id: "sub_new",
    });
    (stripe.paymentIntents.list as jest.Mock).mockResolvedValue({
      data: [{ client_secret: "cs_secret" }],
    });
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({
      id: "local-sub",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.subscriptionId).toBe("sub_new");
    expect(body.clientSecret).toBe("cs_secret");

    // Verify Stripe product was created (not existing)
    expect(stripe.products.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Gym – Monthly Plan",
        metadata: { athlifyrPlanId: planId, venueId },
      })
    );

    // Verify subscription was created with commission
    expect(stripe.subscriptions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_123",
        application_fee_percent: 10,
        transfer_data: { destination: "acct_123" },
      })
    );

    // Verify local record saved as PENDING
    expect(prisma.venueSubscription.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        venueId,
        userId,
        planId,
        status: "PENDING",
        paymentStatus: "PENDING_PAYMENT",
        stripeSubscriptionId: "sub_new",
      }),
    });
  });

  it("reuses existing Stripe product if found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    mockGetOrCreateStripeCustomer.mockResolvedValue("cus_123");
    (stripe.products.search as jest.Mock).mockResolvedValue({
      data: [{ id: "prod_existing" }],
    });
    (stripe.prices.create as jest.Mock).mockResolvedValue({
      id: "price_new",
    });
    (stripe.subscriptions.create as jest.Mock).mockResolvedValue({
      id: "sub_new",
    });
    (stripe.paymentIntents.list as jest.Mock).mockResolvedValue({
      data: [{ client_secret: "cs_secret" }],
    });
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({
      id: "local-sub",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(201);
    expect(stripe.products.create).not.toHaveBeenCalled();
    expect(stripe.prices.create).toHaveBeenCalledWith(
      expect.objectContaining({
        product: "prod_existing",
      })
    );
  });

  it("cancels subscription when clientSecret retrieval fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    mockGetOrCreateStripeCustomer.mockResolvedValue("cus_123");
    (stripe.products.search as jest.Mock).mockResolvedValue({ data: [] });
    (stripe.products.create as jest.Mock).mockResolvedValue({ id: "prod_1" });
    (stripe.prices.create as jest.Mock).mockResolvedValue({ id: "price_1" });
    (stripe.subscriptions.create as jest.Mock).mockResolvedValue({
      id: "sub_orphan",
    });
    (stripe.paymentIntents.list as jest.Mock).mockResolvedValue({ data: [] });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(500);
    expect(stripe.subscriptions.cancel).toHaveBeenCalledWith("sub_orphan");
  });

  it("handles FIXED commission by converting to percent", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      commissionType: "FIXED",
      commissionValue: 300, // 300 cents = 3 EUR
    });
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan); // price=30 → 3000 cents
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    mockGetOrCreateStripeCustomer.mockResolvedValue("cus_123");
    (stripe.products.search as jest.Mock).mockResolvedValue({ data: [] });
    (stripe.products.create as jest.Mock).mockResolvedValue({ id: "prod_1" });
    (stripe.prices.create as jest.Mock).mockResolvedValue({ id: "price_1" });
    (stripe.subscriptions.create as jest.Mock).mockResolvedValue({
      id: "sub_1",
    });
    (stripe.paymentIntents.list as jest.Mock).mockResolvedValue({
      data: [{ client_secret: "cs_secret" }],
    });
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({
      id: "local-sub",
    });

    const res = await POST(makeRequest({ planId }), makeParams());
    expect(res.status).toBe(201);

    // 300 / 3000 * 100 = 10%
    expect(stripe.subscriptions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        application_fee_percent: 10,
      })
    );
  });

  it("handles QUARTERLY duration with intervalCount=3", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue({
      ...mockPlan,
      policy: { duration: "QUARTERLY", durationValue: 1 },
    });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    mockGetOrCreateStripeCustomer.mockResolvedValue("cus_123");
    (stripe.products.search as jest.Mock).mockResolvedValue({ data: [] });
    (stripe.products.create as jest.Mock).mockResolvedValue({ id: "prod_1" });
    (stripe.prices.create as jest.Mock).mockResolvedValue({ id: "price_1" });
    (stripe.subscriptions.create as jest.Mock).mockResolvedValue({
      id: "sub_1",
    });
    (stripe.paymentIntents.list as jest.Mock).mockResolvedValue({
      data: [{ client_secret: "cs_secret" }],
    });
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({
      id: "local-sub",
    });

    await POST(makeRequest({ planId }), makeParams());

    expect(stripe.prices.create).toHaveBeenCalledWith(
      expect.objectContaining({
        recurring: { interval: "month", interval_count: 3 },
      })
    );
  });

  it("supports MIXED payment mode", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      paymentMode: "MIXED",
    });
    (prisma.venuePlan.findFirst as jest.Mock).mockResolvedValue(mockPlan);
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    mockGetOrCreateStripeCustomer.mockResolvedValue("cus_123");
    (stripe.products.search as jest.Mock).mockResolvedValue({ data: [] });
    (stripe.products.create as jest.Mock).mockResolvedValue({ id: "prod_1" });
    (stripe.prices.create as jest.Mock).mockResolvedValue({ id: "price_1" });
    (stripe.subscriptions.create as jest.Mock).mockResolvedValue({
      id: "sub_1",
    });
    (stripe.paymentIntents.list as jest.Mock).mockResolvedValue({
      data: [{ client_secret: "cs_secret" }],
    });
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({
      id: "local-sub",
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
      error: "Failed to create subscription",
    });
  });
});
