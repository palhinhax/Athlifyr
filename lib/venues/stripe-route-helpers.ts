import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
