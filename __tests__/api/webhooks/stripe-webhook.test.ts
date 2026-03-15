/**
 * @jest-environment node
 */

import { POST } from "@/app/api/webhooks/stripe/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// Mock headers
const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}));

// Mock Prisma (comprehensive)
jest.mock("@/lib/prisma", () => ({
  prisma: {
    stripeWebhookEvent: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    venue: { findUnique: jest.fn(), update: jest.fn() },
    event: { findMany: jest.fn(), update: jest.fn() },
    paymentIntent: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    venueSubscription: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    venueMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    venueProductPurchase: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    venueProduct: { update: jest.fn() },
    registration: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    pricingPhase: { findUnique: jest.fn() },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: jest.fn() },
  },
}));

// Mock bib assignment
jest.mock("@/lib/bib-number", () => ({
  assignBibNumbers: jest.fn(),
}));

// Save original env
const originalEnv = process.env;

function makeRequest(body = "{}") {
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body,
  });
}

function makeEvent(
  type: string,
  data: Record<string, unknown>,
  id = "evt_test_123"
) {
  return { id, type, data: { object: data } };
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, STRIPE_WEBHOOK_SECRET: "whsec_test" };
    mockHeaders.mockResolvedValue({
      get: (name: string) => (name === "stripe-signature" ? "sig_test" : null),
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // ── Signature / setup tests ──────────────────────────────────────────────
  it("returns 400 when stripe-signature header is missing", async () => {
    mockHeaders.mockResolvedValue({ get: () => null });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing signature" });
  });

  it("returns 500 when STRIPE_WEBHOOK_SECRET is not configured", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Webhook secret not configured",
    });
  });

  it("returns 400 when signature verification fails", async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid signature" });
  });

  it("skips already-processed events (idempotency)", async () => {
    const event = makeEvent("payment_intent.succeeded", { id: "pi_123" });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue({
      stripeEventId: "evt_test_123",
      processed: true,
    });

    const res = await POST(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.skipped).toBe(true);
    expect(prisma.stripeWebhookEvent.upsert).not.toHaveBeenCalled();
  });

  // ── payment_intent.succeeded ─────────────────────────────────────────────
  it("handles payment_intent.succeeded — updates existing subscription", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_123",
      metadata: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue({
      id: "local-pi",
      venueId: "v1",
      userId: "u1",
      planId: "p1",
      amount: 30,
      plan: { policy: { duration: "MONTHLY", durationValue: 1 } },
    });
    (prisma.paymentIntent.update as jest.Mock).mockResolvedValue({});
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-1",
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.paymentIntent.update).toHaveBeenCalledWith({
      where: { id: "local-pi" },
      data: expect.objectContaining({ status: "CONFIRMED" }),
    });
    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "sub-1" },
      data: expect.objectContaining({
        status: "ACTIVE",
        paymentStatus: "PAID",
      }),
    });
  });

  it("handles payment_intent.succeeded — creates new subscription when none exists", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_456",
      metadata: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue({
      id: "local-pi",
      venueId: "v1",
      userId: "u1",
      planId: "p1",
      amount: 30,
      plan: { policy: { duration: "MONTHLY", durationValue: 1 } },
    });
    (prisma.paymentIntent.update as jest.Mock).mockResolvedValue({});
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({});
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.venueMember.create as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueSubscription.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        venueId: "v1",
        userId: "u1",
        planId: "p1",
        status: "ACTIVE",
      }),
    });
    expect(prisma.venueMember.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        venueId: "v1",
        userId: "u1",
        role: "CLIENT",
      }),
    });
  });

  // ── payment_intent.payment_failed ────────────────────────────────────────
  it("handles payment_intent.payment_failed", async () => {
    const event = makeEvent("payment_intent.payment_failed", {
      id: "pi_fail",
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue({
      id: "local-pi",
    });
    (prisma.paymentIntent.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.paymentIntent.update).toHaveBeenCalledWith({
      where: { id: "local-pi" },
      data: { status: "FAILED" },
    });
  });

  // ── payment_intent.canceled ──────────────────────────────────────────────
  it("handles payment_intent.canceled", async () => {
    const event = makeEvent("payment_intent.canceled", {
      id: "pi_cancel",
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue({
      id: "local-pi",
    });
    (prisma.paymentIntent.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.paymentIntent.update).toHaveBeenCalledWith({
      where: { id: "local-pi" },
      data: { status: "CANCELLED" },
    });
  });

  // ── product_purchase via payment_intent.succeeded ────────────────────────
  it("handles product purchase succeeded — confirms and decrements stock", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_prod",
      metadata: { type: "product_purchase", purchaseId: "purchase-1" },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueProductPurchase.findUnique as jest.Mock).mockResolvedValue({
      id: "purchase-1",
      status: "CREATED",
      productId: "prod-1",
      quantity: 2,
      product: { stock: 10 },
    });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({});
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueProductPurchase.update).toHaveBeenCalledWith({
      where: { id: "purchase-1" },
      data: expect.objectContaining({ status: "CONFIRMED" }),
    });
    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: "prod-1" },
      data: { stock: { decrement: 2 } },
    });
  });

  it("skips already-confirmed product purchase (idempotent)", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_prod2",
      metadata: { type: "product_purchase", purchaseId: "purchase-2" },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueProductPurchase.findUnique as jest.Mock).mockResolvedValue({
      id: "purchase-2",
      status: "CONFIRMED",
      product: {},
    });

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueProductPurchase.update).not.toHaveBeenCalled();
  });

  // ── charge.refunded ──────────────────────────────────────────────────────
  it("handles charge.refunded — full refund of product purchase restores stock", async () => {
    const event = makeEvent("charge.refunded", {
      id: "ch_refund",
      payment_intent: "pi_refund",
      refunded: true,
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    // No registrations
    (prisma.registration.findMany as jest.Mock).mockResolvedValue([]);
    // No venue payment intent
    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue(null);
    // Product purchase exists
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: "purchase-1",
      productId: "prod-1",
      quantity: 3,
      product: { stock: 5 },
    });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({});
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueProductPurchase.update).toHaveBeenCalledWith({
      where: { id: "purchase-1" },
      data: { status: "REFUNDED" },
    });
    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: "prod-1" },
      data: { stock: { increment: 3 } },
    });
  });

  // ── account.updated ──────────────────────────────────────────────────────
  it("handles account.updated — syncs venue onboarding status", async () => {
    const event = makeEvent("account.updated", {
      id: "acct_123",
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      requirements: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      id: "v1",
      stripeAccountId: "acct_123",
    });
    (prisma.venue.update as jest.Mock).mockResolvedValue({});
    (prisma.event.findMany as jest.Mock).mockResolvedValue([]);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venue.update).toHaveBeenCalledWith({
      where: { id: "v1" },
      data: expect.objectContaining({
        stripeOnboardingStatus: "COMPLETE",
        stripeChargesEnabled: true,
        stripePayoutsEnabled: true,
      }),
    });
  });

  // ── customer.subscription.updated ────────────────────────────────────────
  it("handles subscription.updated with cancel_at_period_end → CANCELLING", async () => {
    const event = makeEvent("customer.subscription.updated", {
      id: "sub_stripe",
      status: "active",
      cancel_at_period_end: true,
      items: { data: [{ current_period_end: 1700000000 }] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "local-sub",
      status: "ACTIVE",
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "local-sub" },
      data: expect.objectContaining({ status: "CANCELLING" }),
    });
  });

  // ── customer.subscription.deleted ────────────────────────────────────────
  it("handles subscription.deleted → CANCELLED", async () => {
    const event = makeEvent("customer.subscription.deleted", {
      id: "sub_deleted",
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "local-sub",
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "local-sub" },
      data: expect.objectContaining({ status: "CANCELLED" }),
    });
  });

  // ── invoice.paid ─────────────────────────────────────────────────────────
  it("handles invoice.paid — activates subscription and ensures membership", async () => {
    const event = makeEvent("invoice.paid", {
      amount_paid: 3000,
      parent: {
        subscription_details: { subscription: "sub_billing" },
      },
      lines: { data: [{ period: { end: 1700000000 } }] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "local-sub",
      venueId: "v1",
      userId: "u1",
      paymentAmount: 30,
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.venueMember.create as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "local-sub" },
      data: expect.objectContaining({
        status: "ACTIVE",
        paymentStatus: "PAID",
        paymentAmount: 30,
      }),
    });
    expect(prisma.venueMember.create).toHaveBeenCalled();
  });

  // ── invoice.payment_failed ───────────────────────────────────────────────
  it("handles invoice.payment_failed", async () => {
    const event = makeEvent("invoice.payment_failed", {
      parent: {
        subscription_details: { subscription: "sub_fail" },
      },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "local-sub",
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "local-sub" },
      data: { paymentStatus: "PENDING_PAYMENT" },
    });
  });

  // ── Unhandled event type ─────────────────────────────────────────────────
  it("returns 200 for unhandled event types", async () => {
    const event = makeEvent("some.unknown.event", {});
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
  });
});
