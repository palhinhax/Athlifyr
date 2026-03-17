/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/stripe-subscriptions/confirm/route";
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
    venueSubscription: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    venueMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    subscriptions: {
      retrieve: jest.fn(),
    },
    invoicePayments: {
      list: jest.fn(),
    },
    paymentIntents: {
      retrieve: jest.fn(),
    },
  },
}));

// Mock calculatePlanEndDate
jest.mock("@/types/venue-plan", () => ({
  calculatePlanEndDate: jest.fn(() => new Date("2026-04-15")),
}));

const venueId = "venue-1";
const userId = "user-1";
const stripeSubscriptionId = "sub_stripe_abc";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId }) }) as {
    params: Promise<{ id: string }>;
  };
const makeRequest = (body: object = { stripeSubscriptionId }) =>
  new Request(
    `http://localhost/api/venues/${venueId}/stripe-subscriptions/confirm`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

describe("POST /api/venues/[id]/stripe-subscriptions/confirm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 when stripeSubscriptionId is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });

    const res = await POST(makeRequest({}), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("stripeSubscriptionId is required");
  });

  it("returns 404 when subscription not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Subscription not found");
  });

  it("returns idempotently when subscription already active", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    const existingSub = {
      id: "sub-local-1",
      status: "ACTIVE",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    };
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(
      existingSub
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscription).toEqual(existingSub);
    expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled();
    expect(prisma.venueSubscription.update).not.toHaveBeenCalled();
  });

  it("returns 400 when Stripe subscription is not active", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    });
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "incomplete",
      latest_invoice: "inv_1",
    });
    (stripe.invoicePayments.list as jest.Mock).mockResolvedValue({
      data: [
        {
          status: "open",
          payment: { payment_intent: "pi_pending" },
        },
      ],
    });
    (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue({
      status: "requires_payment_method",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Stripe subscription is not active yet");
    expect(prisma.venueSubscription.update).not.toHaveBeenCalled();
  });

  it("activates when subscription is incomplete but PaymentIntent succeeded", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    });
    const periodEnd = Math.floor(Date.now() / 1000) + 30 * 86400;
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "incomplete",
      latest_invoice: "inv_1",
      items: { data: [{ current_period_end: periodEnd }] },
    });
    (stripe.invoicePayments.list as jest.Mock).mockResolvedValue({
      data: [
        {
          status: "open",
          payment: { payment_intent: "pi_done" },
        },
      ],
    });
    (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue({
      status: "succeeded",
    });
    const updated = {
      id: "sub-local-1",
      status: "ACTIVE",
      paymentStatus: "PAID",
    };
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue(updated);
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.venueMember.create as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscription).toEqual(updated);
    expect(prisma.venueMember.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        venueId,
        userId,
        role: "CLIENT",
        status: "ACTIVE",
      }),
    });
    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "sub-local-1" },
      data: expect.objectContaining({
        status: "ACTIVE",
        paymentStatus: "PAID",
      }),
    });
  });

  it("activates subscription when Stripe subscription is active", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: {
        id: "plan-1",
        name: "Monthly",
        policy: { duration: "MONTHLY", durationValue: 1 },
      },
    });
    const periodEnd = Math.floor(Date.now() / 1000) + 30 * 86400;
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "active",
      items: { data: [{ current_period_end: periodEnd }] },
    });
    const updated = {
      id: "sub-local-1",
      status: "ACTIVE",
      paymentStatus: "PAID",
    };
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue(updated);
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.venueMember.create as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscription).toEqual(updated);
    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "sub-local-1" },
      data: {
        status: "ACTIVE",
        paymentStatus: "PAID",
        paymentConfirmedAt: expect.any(Date),
        startsAt: expect.any(Date),
        endsAt: expect.any(Date),
        stripeCurrentPeriodEnd: expect.any(Date),
      },
    });
    // Verify membership was created
    expect(prisma.venueMember.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        venueId,
        userId,
        role: "CLIENT",
        status: "ACTIVE",
      }),
    });
  });

  it("reactivates inactive member on subscription activation", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    });
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "active",
      items: { data: [] },
    });
    const updated = { id: "sub-local-1", status: "ACTIVE" };
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue(updated);
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
      venueId,
      userId,
      role: "CLIENT",
      status: "INACTIVE",
    });
    (prisma.venueMember.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    expect(prisma.venueMember.update).toHaveBeenCalledWith({
      where: { venueId_userId: { venueId, userId } },
      data: { status: "ACTIVE" },
    });
    expect(prisma.venueMember.create).not.toHaveBeenCalled();
  });

  it("activates subscription when Stripe subscription is trialing", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    });
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "trialing",
    });
    const updated = {
      id: "sub-local-1",
      status: "ACTIVE",
    };
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue(updated);
    (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
      venueId,
      userId,
      role: "CLIENT",
      status: "ACTIVE",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscription).toEqual(updated);
    // Should not create or update member if already active
    expect(prisma.venueMember.create).not.toHaveBeenCalled();
    expect(prisma.venueMember.update).not.toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to confirm subscription");
  });
});
