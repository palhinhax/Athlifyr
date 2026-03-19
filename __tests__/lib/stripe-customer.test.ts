import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      create: jest.fn(),
    },
  },
}));

const mockFindUser = prisma.user.findUniqueOrThrow as jest.Mock;
const mockUpdateUser = prisma.user.update as jest.Mock;
const mockCreateCustomer = stripe.customers.create as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("getOrCreateStripeCustomer", () => {
  // ── Existing customer ─────────────────────────────────────────────────────────

  it("returns existing stripeCustomerId without creating a new customer", async () => {
    mockFindUser.mockResolvedValue({
      id: "u1",
      stripeCustomerId: "cus_existing_123",
      email: "alice@test.com",
      name: "Alice",
    });

    const result = await getOrCreateStripeCustomer("u1");

    expect(result).toBe("cus_existing_123");
    expect(mockCreateCustomer).not.toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("queries user with correct userId", async () => {
    mockFindUser.mockResolvedValue({
      id: "u1",
      stripeCustomerId: "cus_existing_123",
      email: "alice@test.com",
      name: "Alice",
    });

    await getOrCreateStripeCustomer("u1");

    expect(mockFindUser).toHaveBeenCalledWith({
      where: { id: "u1" },
      select: {
        id: true,
        stripeCustomerId: true,
        email: true,
        name: true,
      },
    });
  });

  // ── New customer ──────────────────────────────────────────────────────────────

  it("creates a new Stripe customer when stripeCustomerId is null", async () => {
    mockFindUser.mockResolvedValue({
      id: "u1",
      stripeCustomerId: null,
      email: "alice@test.com",
      name: "Alice",
    });
    mockCreateCustomer.mockResolvedValue({ id: "cus_new_456" });
    mockUpdateUser.mockResolvedValue({});

    const result = await getOrCreateStripeCustomer("u1");

    expect(mockCreateCustomer).toHaveBeenCalledWith({
      email: "alice@test.com",
      name: "Alice",
      metadata: { userId: "u1" },
    });
    expect(result).toBe("cus_new_456");
  });

  it("stores new Stripe customer ID on the user record", async () => {
    mockFindUser.mockResolvedValue({
      id: "u1",
      stripeCustomerId: null,
      email: "alice@test.com",
      name: "Alice",
    });
    mockCreateCustomer.mockResolvedValue({ id: "cus_new_456" });
    mockUpdateUser.mockResolvedValue({});

    await getOrCreateStripeCustomer("u1");

    expect(mockUpdateUser).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { stripeCustomerId: "cus_new_456" },
    });
  });

  it("passes undefined for name when user has no name", async () => {
    mockFindUser.mockResolvedValue({
      id: "u1",
      stripeCustomerId: null,
      email: "alice@test.com",
      name: null,
    });
    mockCreateCustomer.mockResolvedValue({ id: "cus_new_789" });
    mockUpdateUser.mockResolvedValue({});

    await getOrCreateStripeCustomer("u1");

    expect(mockCreateCustomer).toHaveBeenCalledWith(
      expect.objectContaining({ name: undefined })
    );
  });

  it("returns the new customer ID after creation", async () => {
    mockFindUser.mockResolvedValue({
      id: "u2",
      stripeCustomerId: null,
      email: "bob@test.com",
      name: "Bob",
    });
    mockCreateCustomer.mockResolvedValue({ id: "cus_bob_999" });
    mockUpdateUser.mockResolvedValue({});

    const result = await getOrCreateStripeCustomer("u2");

    expect(result).toBe("cus_bob_999");
  });

  // ── Error propagation ─────────────────────────────────────────────────────────

  it("propagates prisma findUniqueOrThrow error when user not found", async () => {
    mockFindUser.mockRejectedValue(new Error("User not found"));

    await expect(getOrCreateStripeCustomer("missing-id")).rejects.toThrow(
      "User not found"
    );
  });

  it("propagates stripe customer creation error", async () => {
    mockFindUser.mockResolvedValue({
      id: "u1",
      stripeCustomerId: null,
      email: "alice@test.com",
      name: "Alice",
    });
    mockCreateCustomer.mockRejectedValue(new Error("Stripe API error"));

    await expect(getOrCreateStripeCustomer("u1")).rejects.toThrow(
      "Stripe API error"
    );
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
