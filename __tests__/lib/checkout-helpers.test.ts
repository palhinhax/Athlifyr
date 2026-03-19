/**
 * @jest-environment node
 */
import {
  validateEventAcceptsRegistrations,
  resolveVariant,
  findActivePricingPhase,
} from "@/lib/checkout-helpers";

// Mock dependencies to avoid importing prisma/stripe at module level
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/stripe", () => ({ stripe: {} }));
jest.mock("@/lib/bib-number", () => ({ assignBibNumbers: jest.fn() }));
jest.mock("@/lib/auth-helpers", () => ({}));

// ============================================================================
// Helper factories
// ============================================================================

function makeEvent(
  overrides?: Partial<Parameters<typeof validateEventAcceptsRegistrations>[0]>
) {
  return {
    id: "evt_1",
    title: "Test Event",
    slug: "test-event",
    hasRegistrations: true,
    cancelled: false,
    registrationDeadline: null,
    registrationFieldSettings: null,
    stripeAccountId: "acct_123",
    stripeOnboardingStatus: "COMPLETE",
    commissionPercent: 5,
    variants: [],
    pricingPhases: [],
    ...overrides,
  };
}

function makeVariant(overrides?: Record<string, unknown>) {
  return {
    id: "var_1",
    name: "Trail 20km",
    maxParticipants: null,
    teamSize: null,
    pricingPhases: [],
    ...overrides,
  };
}

function makePhase(overrides?: Record<string, unknown>) {
  return {
    id: "phase_1",
    startDate: null,
    endDate: null,
    price: 25,
    currency: "EUR",
    name: "Phase 1",
    ...overrides,
  };
}

// ============================================================================
// validateEventAcceptsRegistrations
// ============================================================================

describe("validateEventAcceptsRegistrations", () => {
  it("returns null when event accepts registrations", () => {
    const result = validateEventAcceptsRegistrations(makeEvent());
    expect(result).toBeNull();
  });

  it("returns 400 when hasRegistrations is false", () => {
    const result = validateEventAcceptsRegistrations(
      makeEvent({ hasRegistrations: false })
    );
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it("returns 409 when event is cancelled", () => {
    const result = validateEventAcceptsRegistrations(
      makeEvent({ cancelled: true })
    );
    expect(result).not.toBeNull();
    expect(result!.status).toBe(409);
  });

  it("returns 409 when registration deadline has passed", () => {
    const pastDeadline = new Date(Date.now() - 86400000); // yesterday
    const result = validateEventAcceptsRegistrations(
      makeEvent({ registrationDeadline: pastDeadline })
    );
    expect(result).not.toBeNull();
    expect(result!.status).toBe(409);
  });

  it("returns null when deadline is in the future", () => {
    const futureDeadline = new Date(Date.now() + 86400000); // tomorrow
    const result = validateEventAcceptsRegistrations(
      makeEvent({ registrationDeadline: futureDeadline })
    );
    expect(result).toBeNull();
  });
});

// ============================================================================
// resolveVariant
// ============================================================================

describe("resolveVariant", () => {
  it("resolves variant by ID", () => {
    const variant = makeVariant({ id: "var_1" });
    const event = makeEvent({ variants: [variant] });
    const result = resolveVariant(event, "var_1");
    expect(result.variant).toBe(variant);
    expect(result.error).toBeUndefined();
  });

  it("auto-selects when only one variant and no ID given", () => {
    const variant = makeVariant();
    const event = makeEvent({ variants: [variant] });
    const result = resolveVariant(event);
    expect(result.variant).toBe(variant);
  });

  it("returns error when multiple variants and no ID", () => {
    const event = makeEvent({
      variants: [
        makeVariant({ id: "var_1" }),
        makeVariant({ id: "var_2", name: "Trail 10km" }),
      ],
    });
    const result = resolveVariant(event);
    expect(result.variant).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error!.status).toBe(400);
  });

  it("returns undefined variant when no match and single variant available", () => {
    const variant = makeVariant({ id: "var_1" });
    const event = makeEvent({ variants: [variant] });
    // Wrong ID but single variant → still auto-selects
    const result = resolveVariant(event, "var_nonexistent");
    expect(result.variant).toBe(variant);
  });
});

// ============================================================================
// findActivePricingPhase
// ============================================================================

describe("findActivePricingPhase", () => {
  it("returns phase with no date restrictions", () => {
    const phase = makePhase();
    const variant = makeVariant({ pricingPhases: [phase] });
    const result = findActivePricingPhase(variant, []);
    expect(result).toBe(phase);
  });

  it("returns phase when current time is within range", () => {
    const phase = makePhase({
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 86400000),
    });
    const variant = makeVariant({ pricingPhases: [phase] });
    const result = findActivePricingPhase(variant, []);
    expect(result).toBe(phase);
  });

  it("returns undefined when all phases are past", () => {
    const phase = makePhase({
      startDate: new Date(Date.now() - 172800000),
      endDate: new Date(Date.now() - 86400000),
    });
    const variant = makeVariant({ pricingPhases: [phase] });
    const result = findActivePricingPhase(variant, []);
    expect(result).toBeUndefined();
  });

  it("returns undefined when all phases are future", () => {
    const phase = makePhase({
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 172800000),
    });
    const variant = makeVariant({ pricingPhases: [phase] });
    const result = findActivePricingPhase(variant, []);
    expect(result).toBeUndefined();
  });

  it("falls back to event phases when variant has none", () => {
    const eventPhase = makePhase({ name: "Event Phase" });
    const result = findActivePricingPhase(undefined, [eventPhase]);
    expect(result).toBe(eventPhase);
  });

  it("prefers variant phases over event phases", () => {
    const variantPhase = makePhase({ name: "Variant Phase" });
    const eventPhase = makePhase({ name: "Event Phase" });
    const variant = makeVariant({ pricingPhases: [variantPhase] });
    const result = findActivePricingPhase(variant, [eventPhase]);
    expect(result).toBe(variantPhase);
  });
});
