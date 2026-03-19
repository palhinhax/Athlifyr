import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { canManageVenue } from "@/lib/venues/authorization";

/**
 * Shared select clause used by payment-intents, stripe-subscriptions, and purchase routes.
 */
export const VENUE_PAYMENT_SELECT = {
  id: true,
  name: true,
  isActive: true,
  paymentMode: true,
  stripeAccountId: true,
  stripeOnboardingStatus: true,
  commissionType: true,
  commissionValue: true,
} as const;

export interface VenuePaymentData {
  id: string;
  name: string;
  isActive: boolean;
  paymentMode: string;
  stripeAccountId: string | null;
  stripeOnboardingStatus: string | null;
  commissionType: string;
  commissionValue: number;
}

/**
 * Authenticate user, authorize venue management, and fetch the venue.
 * Returns an error response or the session + venue.
 */
export async function authenticateVenueManager(venueId: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }

  const authResult = await canManageVenue(session.user.id, venueId);
  if (!authResult.authorized) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    } as const;
  }

  const venue = await prisma.venue.findUnique({ where: { id: venueId } });
  if (!venue) {
    return {
      error: NextResponse.json({ error: "Venue not found" }, { status: 404 }),
    } as const;
  }

  return { session, venue } as const;
}

/**
 * Same as authenticateVenueManager but returns only the payment-relevant fields.
 */
export async function getVenuePaymentContext(venueId: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }

  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    select: VENUE_PAYMENT_SELECT,
  });

  if (!venue || !venue.isActive) {
    return {
      error: NextResponse.json({ error: "Venue not found" }, { status: 404 }),
    } as const;
  }

  if (venue.paymentMode !== "IN_APP" && venue.paymentMode !== "MIXED") {
    return {
      error: NextResponse.json(
        { error: "Venue does not support IN_APP payments" },
        { status: 400 }
      ),
    } as const;
  }

  if (!venue.stripeAccountId || venue.stripeOnboardingStatus !== "COMPLETE") {
    return {
      error: NextResponse.json(
        { error: "Venue Stripe account is not fully configured" },
        { status: 400 }
      ),
    } as const;
  }

  return { session, venue } as const;
}

/**
 * Ensure the venue has a connected Stripe account.
 * Returns an error NextResponse if missing, null otherwise.
 */
export function requireStripeAccount(venue: {
  stripeAccountId: string | null;
}): NextResponse | null {
  if (!venue.stripeAccountId) {
    return NextResponse.json(
      { error: "No Stripe account found" },
      { status: 400 }
    );
  }
  return null;
}

/**
 * Calculate the platform commission in cents based on the venue config.
 */
export function calculateCommission(
  venue: Pick<VenuePaymentData, "commissionType" | "commissionValue">,
  amountCents: number
): number {
  return venue.commissionType === "FIXED"
    ? venue.commissionValue
    : Math.round(amountCents * (venue.commissionValue / 100));
}

// ── Stripe fee helpers ─────────────────────────────────────────────────────
// EU standard pricing: 1.5% + €0.25. Adjust if your account has different rates.
const STRIPE_FEE_PERCENT = 0.015;
const STRIPE_FIXED_FEE_CENTS = 25;

/**
 * Estimate the Stripe processing fee for a given charge amount (in cents).
 */
export function calculateStripeFee(amountCents: number): number {
  return Math.ceil(amountCents * STRIPE_FEE_PERCENT + STRIPE_FIXED_FEE_CENTS);
}

/**
 * Total application fee = platform commission + Stripe processing fee.
 * This ensures that Stripe's cut is effectively absorbed by the venue
 * (deducted from the transfer) while the platform keeps its full commission.
 */
export function calculateApplicationFee(
  venue: Pick<VenuePaymentData, "commissionType" | "commissionValue">,
  amountCents: number
): number {
  return (
    calculateCommission(venue, amountCents) + calculateStripeFee(amountCents)
  );
}

/**
 * Same as calculateApplicationFee but expressed as a percentage of the charge
 * amount. Used for Stripe Billing subscriptions which only accept
 * `application_fee_percent`.
 */
export function calculateApplicationFeePercent(
  venue: Pick<VenuePaymentData, "commissionType" | "commissionValue">,
  amountCents: number
): number {
  if (amountCents <= 0) return 0;
  const feeCents = calculateApplicationFee(venue, amountCents);
  return Math.round((feeCents / amountCents) * 10000) / 100;
}

// ── Shared PaymentIntent creation ──────────────────────────────────────────

interface CreateVenuePIOptions {
  amountCents: number;
  currency: string;
  venue: VenuePaymentData;
  metadata: Record<string, string>;
  description: string;
}

/**
 * Create a Stripe PaymentIntent using destination charges.
 *
 * The `application_fee_amount` includes the platform commission *plus* an
 * estimate of Stripe's processing fee so the venue effectively absorbs it.
 */
export async function createVenuePaymentIntent({
  amountCents,
  currency,
  venue,
  metadata,
  description,
}: CreateVenuePIOptions) {
  const applicationFeeCents = calculateApplicationFee(venue, amountCents);

  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: currency.toLowerCase(),
    application_fee_amount:
      applicationFeeCents > 0 ? applicationFeeCents : undefined,
    transfer_data: {
      destination: venue.stripeAccountId!,
    },
    metadata,
    description,
    automatic_payment_methods: { enabled: true },
  });
}
