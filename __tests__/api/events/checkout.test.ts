/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/events/[id]/checkout
 * Covers: authentication, event validation (cancellation, registration deadline),
 * variant selection, capacity enforcement, duplicate prevention,
 * free event direct confirmation, and paid event Stripe flow.
 */

import { POST } from "@/app/api/events/[id]/checkout/route";
import { prisma } from "@/lib/prisma";

// Mock auth-helpers
jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: jest.fn(),
    $transaction: jest
      .fn()
      .mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
        // Simulate a transaction by passing a minimal tx object
        const tx = {
          $executeRaw: jest.fn().mockResolvedValue(undefined),
          $queryRaw: jest.fn().mockResolvedValue([{ max_bib: null }]),
          registration: {
            update: jest.fn().mockResolvedValue({}),
          },
        };
        return fn(tx);
      }),
    event: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
    registration: {
      findUnique: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    eventCustomField: { findMany: jest.fn() },
    pricingPhase: { findUnique: jest.fn() },
  },
}));

// Mock Stripe — use a shared object to hold the mock so jest hoisting doesn't cause issues
const stripeMocks = { sessionCreate: jest.fn() };
jest.mock("stripe", () =>
  jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: (...args: unknown[]) => stripeMocks.sessionCreate(...args),
      },
    },
  }))
);

// ── Helpers ──────────────────────────────────────────────────────────────────

const EVENT_ID = "event-1";

const makeRequest = (body: Record<string, unknown> = {}) =>
  new Request("http://localhost/api/events/event-1/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const makeParams = () =>
  ({ params: Promise.resolve({ id: EVENT_ID }) }) as {
    params: Promise<{ id: string }>;
  };

const mockUser = {
  id: "user-1",
  email: "user@test.com",
  name: "Test User",
  role: "USER",
};

const mockPricingPhase = {
  id: "phase-1",
  name: "Regular",
  price: 25,
  currency: "EUR",
  startDate: new Date("2020-01-01"),
  endDate: new Date("2099-12-31"),
};

const mockVariant = {
  id: "variant-1",
  name: "10km",
  price: 25,
  maxParticipants: 100,
  teamSize: 1,
  pricingPhases: [mockPricingPhase],
};

const mockFreeVariant = {
  id: "variant-free",
  name: "Free Run",
  price: 0,
  maxParticipants: null,
  teamSize: 1,
  pricingPhases: [
    {
      id: "phase-free",
      name: "Free",
      price: 0,
      currency: "EUR",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2099-12-31"),
    },
  ],
};

const mockEvent = {
  id: EVENT_ID,
  title: "Test Event",
  slug: "test-event",
  hasRegistrations: true,
  cancelled: false,
  registrationDeadline: null,
  stripeAccountId: "acct_test",
  stripeOnboardingStatus: "COMPLETE",
  commissionPercent: 5,
  registrationFieldSettings: {},
  variants: [mockVariant],
  pricingPhases: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(null);
  (prisma.registration.count as jest.Mock).mockResolvedValue(0);
  (prisma.eventCustomField.findMany as jest.Mock).mockResolvedValue([]);
  stripeMocks.sessionCreate.mockResolvedValue({
    id: "cs_default",
    url: "https://checkout.stripe.com/default",
  });
});

// ── Authentication ────────────────────────────────────────────────────────────

it("returns 401 when user is not authenticated", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(401);
  expect(body.error).toBe("Unauthorized");
  expect(prisma.event.findUnique).not.toHaveBeenCalled();
});

// ── Event validation ──────────────────────────────────────────────────────────

it("returns 404 when event does not exist", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(404);
  expect(body.error).toBe("Event not found");
});

it("returns 400 when event is not accepting registrations", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    hasRegistrations: false,
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(400);
  expect(body.error).toBe("This event is not accepting registrations");
});

it("returns 409 when event is cancelled", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    cancelled: true,
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(409);
  expect(body.error).toBe("This event has been cancelled");
});

it("returns 409 when registration deadline has passed", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    registrationDeadline: new Date("2020-01-01"), // in the past
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(409);
  expect(body.error).toBe("Registration deadline has passed");
});

it("allows registration when deadline is in the future", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    registrationDeadline: new Date("2099-12-31"),
  });
  (prisma.registration.upsert as jest.Mock).mockResolvedValue({ id: "reg-1" });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());

  expect(res.status).not.toBe(409);
});

// ── Variant validation ────────────────────────────────────────────────────────

it("returns 400 when no variant selected for multi-variant event", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    variants: [
      mockVariant,
      {
        ...mockVariant,
        id: "variant-2",
        name: "21km",
        pricingPhases: mockVariant.pricingPhases,
      },
    ],
  });

  const res = await POST(makeRequest({}), makeParams()); // no variantId
  const body = await res.json();

  expect(res.status).toBe(400);
  expect(body.error).toBe("Please select a variant");
});

it("auto-selects single variant when none specified", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
  (prisma.registration.upsert as jest.Mock).mockResolvedValue({
    id: "reg-auto",
  });

  const res = await POST(makeRequest({}), makeParams()); // no variantId
  expect(res.status).not.toBe(400);
});

// ── Duplicate registration prevention ────────────────────────────────────────

it("returns 409 when user is already CONFIRMED for this variant", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    id: "reg-existing",
    status: "CONFIRMED",
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(409);
  expect(body.error).toBe("Already registered for this variant");
});

it("allows re-attempt when existing registration is PENDING", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    id: "reg-pending",
    status: "PENDING",
  });
  (prisma.registration.count as jest.Mock).mockResolvedValue(0);
  (prisma.registration.upsert as jest.Mock).mockResolvedValue({
    id: "reg-pending",
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  expect(res.status).not.toBe(409);
});

// ── Capacity enforcement ──────────────────────────────────────────────────────

it("returns 409 when variant is sold out", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    variants: [{ ...mockVariant, maxParticipants: 10 }],
  });
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue(null);
  (prisma.registration.count as jest.Mock).mockResolvedValue(10); // at capacity

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(409);
  expect(body.error).toBe("This variant is sold out");
});

it("allows registration when variant has no capacity limit", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    variants: [{ ...mockVariant, maxParticipants: null }],
  });
  (prisma.registration.upsert as jest.Mock).mockResolvedValue({
    id: "reg-no-cap",
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  expect(res.status).not.toBe(409);
});

// ── Free event direct confirmation ───────────────────────────────────────────

it("creates CONFIRMED registration directly for free events (price=0)", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    stripeAccountId: null,
    stripeOnboardingStatus: "NOT_STARTED",
    variants: [mockFreeVariant],
  });
  (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ max_bib: null }]);
  (prisma.registration.upsert as jest.Mock).mockResolvedValue({
    id: "reg-free",
    status: "CONFIRMED",
  });

  const res = await POST(
    makeRequest({ variantId: "variant-free" }),
    makeParams()
  );
  const body = await res.json();

  expect(res.status).toBe(201);
  expect(body.status).toBe("CONFIRMED");
  expect(body.registrationId).toBe("reg-free");

  expect(prisma.registration.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      create: expect.objectContaining({
        status: "CONFIRMED",
        amountCents: 0,
        paymentProvider: "NONE",
      }),
    })
  );
});

it("free registration returns 409 when user is already registered", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    variants: [mockFreeVariant],
  });
  (prisma.registration.findUnique as jest.Mock).mockResolvedValue({
    id: "reg-free-existing",
    status: "CONFIRMED",
  });

  const res = await POST(
    makeRequest({ variantId: "variant-free" }),
    makeParams()
  );
  const body = await res.json();

  expect(res.status).toBe(409);
  expect(body.error).toBe("Already registered for this variant");
});

// ── Stripe account check ──────────────────────────────────────────────────────

it("returns 400 when Stripe is not configured for a paid event", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue({
    ...mockEvent,
    stripeAccountId: null,
    stripeOnboardingStatus: "NOT_STARTED",
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(400);
  expect(body.error).toBe("Event Stripe account is not fully configured");
});

// ── Paid event Stripe session ─────────────────────────────────────────────────

it("creates Stripe session and PENDING registration for paid event", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
  (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
  stripeMocks.sessionCreate.mockResolvedValue({
    id: "cs_paid",
    url: "https://checkout.stripe.com/paid",
  });
  (prisma.registration.upsert as jest.Mock).mockResolvedValue({
    id: "reg-paid",
  });

  const res = await POST(makeRequest({ variantId: "variant-1" }), makeParams());
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body.url).toBe("https://checkout.stripe.com/paid");
  expect(body.sessionId).toBe("cs_paid");
  expect(body.registrationId).toBe("reg-paid");

  expect(prisma.registration.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      create: expect.objectContaining({
        status: "PENDING",
        stripeCheckoutSessionId: "cs_paid",
      }),
    })
  );
});
