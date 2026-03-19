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

  // ── checkout.session.completed ───────────────────────────────────────────
  it("handles checkout.session.completed — creates new registration", async () => {
    const session = {
      id: "cs_test",
      amount_total: 5000,
      payment_intent: "pi_123",
      metadata: {
        eventId: "ev1",
        variantId: "var1",
        userId: "u1",
        pricingPhaseId: "pp1",
      },
    };
    const event = makeEvent("checkout.session.completed", session);
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    // No existing registration
    (prisma.registration.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.pricingPhase.findUnique as jest.Mock).mockResolvedValue({
      id: "pp1",
      currency: "EUR",
    });
    const { assignBibNumbers } = await import("@/lib/bib-number");
    (prisma.registration.create as jest.Mock).mockResolvedValue({
      id: "reg-new",
    });
    (assignBibNumbers as jest.Mock).mockResolvedValue(undefined);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.registration.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "u1",
          eventId: "ev1",
          variantId: "var1",
          status: "CONFIRMED",
        }),
      })
    );
  });

  it("handles checkout.session.completed — confirms existing pending registration", async () => {
    const session = {
      id: "cs_test2",
      amount_total: 3000,
      payment_intent: "pi_456",
      metadata: {
        eventId: "ev1",
        variantId: "var1",
        userId: "u1",
        pricingPhaseId: "",
      },
    };
    const event = makeEvent("checkout.session.completed", session);
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    // Existing PENDING registration (not yet confirmed)
    (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
      id: "reg-existing",
      status: "PENDING",
      teamGroupId: null,
    });
    (prisma.pricingPhase.findUnique as jest.Mock).mockResolvedValue(null);
    const { assignBibNumbers } = await import("@/lib/bib-number");
    (assignBibNumbers as jest.Mock).mockResolvedValue(undefined);
    (prisma.registration.findUnique as jest.Mock)
      .mockResolvedValueOnce({
        id: "reg-existing",
        status: "PENDING",
        teamGroupId: null,
      })
      .mockResolvedValueOnce({ bibNumber: 5 });
    (prisma.registration.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.registration.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "reg-existing" },
        data: expect.objectContaining({ status: "CONFIRMED" }),
      })
    );
  });

  it("skips checkout.session.completed when registration already confirmed", async () => {
    const session = {
      id: "cs_idempotent",
      amount_total: 0,
      payment_intent: null,
      metadata: {
        eventId: "ev1",
        variantId: "var1",
        userId: "u1",
        pricingPhaseId: "",
      },
    };
    const event = makeEvent("checkout.session.completed", session);
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
      id: "reg-1",
      status: "CONFIRMED",
    });
    (prisma.pricingPhase.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.registration.create).not.toHaveBeenCalled();
    expect(prisma.registration.update).not.toHaveBeenCalled();
  });

  it("skips checkout.session.completed when no eventId in metadata", async () => {
    const session = {
      id: "cs_no_meta",
      amount_total: 0,
      payment_intent: null,
      metadata: {},
    };
    const event = makeEvent("checkout.session.completed", session);
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.registration.findUnique).not.toHaveBeenCalled();
  });

  // ── account.updated — events ──────────────────────────────────────────────
  it("handles account.updated — syncs event onboarding status and sets hasRegistrations=true when COMPLETE", async () => {
    const event = makeEvent("account.updated", {
      id: "acct_events",
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      requirements: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    // No venue
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(null);
    // Two events with this account
    (prisma.event.findMany as jest.Mock).mockResolvedValue([
      { id: "ev1" },
      { id: "ev2" },
    ]);
    (prisma.event.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.event.update).toHaveBeenCalledTimes(2);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          stripeOnboardingStatus: "COMPLETE",
          hasRegistrations: true,
        }),
      })
    );
  });

  it("handles account.updated — RESTRICTED status", async () => {
    const event = makeEvent("account.updated", {
      id: "acct_restricted",
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: true,
      requirements: { disabled_reason: "rejected.fraud" },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({ id: "v1" });
    (prisma.venue.update as jest.Mock).mockResolvedValue({});
    (prisma.event.findMany as jest.Mock).mockResolvedValue([]);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venue.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stripeOnboardingStatus: "RESTRICTED" }),
      })
    );
  });

  it("handles account.updated — PENDING status when details submitted but not complete", async () => {
    const event = makeEvent("account.updated", {
      id: "acct_pending",
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: true,
      requirements: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({ id: "v1" });
    (prisma.venue.update as jest.Mock).mockResolvedValue({});
    (prisma.event.findMany as jest.Mock).mockResolvedValue([]);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venue.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stripeOnboardingStatus: "PENDING" }),
      })
    );
  });

  it("logs error when account.updated finds neither venue nor event", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const event = makeEvent("account.updated", {
      id: "acct_orphan",
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      requirements: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.event.findMany as jest.Mock).mockResolvedValue([]);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No venue or event found")
    );
    consoleSpy.mockRestore();
  });

  // ── paymentIntent not found in DB ─────────────────────────────────────────
  it("handles payment_intent.succeeded gracefully when not found in DB", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_missing",
      metadata: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueSubscription.create).not.toHaveBeenCalled();
    expect(prisma.venueSubscription.update).not.toHaveBeenCalled();
  });

  it("handles payment_intent.payment_failed gracefully when not found in DB", async () => {
    const event = makeEvent("payment_intent.payment_failed", {
      id: "pi_missing",
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.paymentIntent.update).not.toHaveBeenCalled();
  });

  it("handles payment_intent.canceled gracefully when not found in DB", async () => {
    const event = makeEvent("payment_intent.canceled", { id: "pi_missing" });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.paymentIntent.update).not.toHaveBeenCalled();
  });

  // ── payment_intent.succeeded — member reactivation ────────────────────────
  it("handles payment_intent.succeeded — reactivates inactive member", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_reactivate",
      metadata: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue({
      id: "pi-db",
      venueId: "v1",
      userId: "u1",
      planId: "p1",
      amount: 30,
      plan: null,
    });
    (prisma.paymentIntent.update as jest.Mock).mockResolvedValue({});
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({});
    // Member exists but is suspended
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
      venueId: "v1",
      userId: "u1",
      status: "SUSPENDED",
    });
    (prisma.venueMember.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueMember.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "ACTIVE" },
      })
    );
    expect(prisma.venueMember.create).not.toHaveBeenCalled();
  });

  it("handles payment_intent.succeeded — skips member create when already active", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_already_active",
      metadata: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue({
      id: "pi-db",
      venueId: "v1",
      userId: "u1",
      planId: "p1",
      amount: 30,
      plan: null,
    });
    (prisma.paymentIntent.update as jest.Mock).mockResolvedValue({});
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.venueSubscription.create as jest.Mock).mockResolvedValue({});
    // Member already active
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
      venueId: "v1",
      userId: "u1",
      status: "ACTIVE",
    });

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueMember.create).not.toHaveBeenCalled();
    expect(prisma.venueMember.update).not.toHaveBeenCalled();
  });

  // ── invoice.paid edge cases ────────────────────────────────────────────────
  it("skips invoice.paid when no stripeSubscriptionId found", async () => {
    const event = makeEvent("invoice.paid", {
      amount_paid: 3000,
      parent: { subscription_details: {} },
      lines: { data: [] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueSubscription.findFirst).not.toHaveBeenCalled();
  });

  it("skips invoice.paid when subscription not found locally", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const event = makeEvent("invoice.paid", {
      amount_paid: 0,
      parent: { subscription_details: { subscription: "sub_unknown" } },
      lines: { data: [] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No local subscription")
    );
    consoleSpy.mockRestore();
  });

  it("handles invoice.paid — reactivates inactive member", async () => {
    const event = makeEvent("invoice.paid", {
      amount_paid: 2000,
      parent: { subscription_details: { subscription: "sub_reactivate" } },
      lines: { data: [{ period: { end: 1700000000 } }] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-1",
      venueId: "v1",
      userId: "u1",
      paymentAmount: 20,
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});
    // Member exists but is inactive
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
      venueId: "v1",
      userId: "u1",
      status: "LEFT",
    });
    (prisma.venueMember.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueMember.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "ACTIVE" } })
    );
  });

  // ── invoice.payment_failed edge cases ─────────────────────────────────────
  it("skips invoice.payment_failed when no stripeSubId", async () => {
    const event = makeEvent("invoice.payment_failed", {
      parent: { subscription_details: {} },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueSubscription.findFirst).not.toHaveBeenCalled();
  });

  it("skips invoice.payment_failed when subscription not found locally", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const event = makeEvent("invoice.payment_failed", {
      parent: { subscription_details: { subscription: "sub_unknown" } },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No local subscription")
    );
    consoleSpy.mockRestore();
  });

  // ── subscription.updated edge cases ──────────────────────────────────────
  it("skips subscription.updated when subscription not found locally", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const event = makeEvent("customer.subscription.updated", {
      id: "sub_unknown",
      status: "active",
      cancel_at_period_end: false,
      items: { data: [] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No local subscription")
    );
    consoleSpy.mockRestore();
  });

  it("handles subscription.updated — maps canceled status to CANCELLED", async () => {
    const event = makeEvent("customer.subscription.updated", {
      id: "sub_canceled",
      status: "canceled",
      cancel_at_period_end: false,
      items: { data: [] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "s1",
      status: "ACTIVE",
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueSubscription.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "CANCELLED" }),
      })
    );
  });

  it("handles subscription.updated — maps unpaid status to SUSPENDED", async () => {
    const event = makeEvent("customer.subscription.updated", {
      id: "sub_unpaid",
      status: "unpaid",
      cancel_at_period_end: false,
      items: { data: [] },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "s1",
      status: "ACTIVE",
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueSubscription.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "SUSPENDED" }),
      })
    );
  });

  // ── subscription.deleted edge cases ──────────────────────────────────────
  it("skips subscription.deleted when subscription not found locally", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const event = makeEvent("customer.subscription.deleted", {
      id: "sub_unknown",
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No local subscription")
    );
    consoleSpy.mockRestore();
  });

  // ── charge.refunded edge cases ────────────────────────────────────────────
  it("handles charge.refunded — full refund cancels venue subscription", async () => {
    const event = makeEvent("charge.refunded", {
      id: "ch_full",
      payment_intent: "pi_venue",
      refunded: true,
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.registration.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue({
      id: "pi-db",
      venueId: "v1",
      userId: "u1",
      planId: "p1",
    });
    (prisma.paymentIntent.update as jest.Mock).mockResolvedValue({});
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-1",
      status: "ACTIVE",
    });
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({});
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.venueSubscription.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "CANCELLED" }),
      })
    );
  });

  it("handles charge.refunded — partial refund leaves registrations unchanged", async () => {
    const event = makeEvent("charge.refunded", {
      id: "ch_partial",
      payment_intent: "pi_partial",
      refunded: false,
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.registration.findMany as jest.Mock).mockResolvedValue([
      { id: "reg-1", stripePaymentIntentId: "pi_partial" },
    ]);
    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    // updateMany should NOT be called on partial refund
    expect(prisma.registration.updateMany).not.toHaveBeenCalled();
  });

  it("handles charge.refunded — full refund marks registrations as REFUNDED", async () => {
    const event = makeEvent("charge.refunded", {
      id: "ch_reg_refund",
      payment_intent: "pi_reg",
      refunded: true,
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.registration.findMany as jest.Mock).mockResolvedValue([
      { id: "reg-1" },
      { id: "reg-2" },
    ]);
    (prisma.registration.updateMany as jest.Mock).mockResolvedValue({});
    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);

    expect(prisma.registration.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "REFUNDED" },
      })
    );
  });

  it("warns when charge.refunded has no matching PI or registration", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const event = makeEvent("charge.refunded", {
      id: "ch_orphan",
      payment_intent: "pi_orphan",
      refunded: true,
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.registration.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.paymentIntent.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("no registration or PaymentIntent found")
    );
    consoleSpy.mockRestore();
  });

  // ── handleProductPurchaseSucceeded edge cases ─────────────────────────────
  it("handles product purchase with null stock — skips stock decrement", async () => {
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_no_stock",
      metadata: { type: "product_purchase", purchaseId: "p-no-stock" },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueProductPurchase.findUnique as jest.Mock).mockResolvedValue({
      id: "p-no-stock",
      status: "CREATED",
      productId: "prod-2",
      quantity: 1,
      product: { stock: null },
    });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueProduct.update).not.toHaveBeenCalled();
  });

  it("handles product purchase when purchase not found in DB", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_missing_purchase",
      metadata: { type: "product_purchase", purchaseId: "nonexistent" },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    (prisma.venueProductPurchase.findUnique as jest.Mock).mockResolvedValue(
      null
    );

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueProductPurchase.update).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("VenueProductPurchase not found")
    );
    consoleSpy.mockRestore();
  });

  it("handles product purchase with missing purchaseId in metadata", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_no_purchaseId",
      metadata: { type: "product_purchase" },
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});
    (prisma.stripeWebhookEvent.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(prisma.venueProductPurchase.findUnique).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("missing purchaseId")
    );
    consoleSpy.mockRestore();
  });

  // ── Internal error → 500 ─────────────────────────────────────────────────
  it("returns 500 when an unexpected error occurs during processing", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const event = makeEvent("payment_intent.succeeded", {
      id: "pi_crash",
      metadata: {},
    });
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(event);
    (prisma.stripeWebhookEvent.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.stripeWebhookEvent.upsert as jest.Mock).mockResolvedValue({});

    // Simulate unexpected crash during handler
    (prisma.paymentIntent.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB connection lost")
    );

    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Webhook processing failed");
    consoleSpy.mockRestore();
  });
});
