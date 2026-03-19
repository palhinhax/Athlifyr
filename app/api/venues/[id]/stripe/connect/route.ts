import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { authenticateVenueManager } from "@/lib/venues/stripe-route-helpers";

// POST - Create or get Stripe Connect account for venue
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: venueId } = await params;

    const ctx = await authenticateVenueManager(venueId);
    if ("error" in ctx) return ctx.error;

    const { venue, session } = ctx;

    // If venue already has a Stripe account, validate it still exists in Stripe
    if (venue.stripeAccountId) {
      try {
        await stripe.accounts.retrieve(venue.stripeAccountId);
        return NextResponse.json({
          accountId: venue.stripeAccountId,
          message: "Stripe account already exists",
        });
      } catch {
        // Account is invalid/revoked — clear it so a new one is created below
        console.warn(
          `Stale Stripe account ${venue.stripeAccountId} for venue ${venueId}, creating new one`
        );
        await prisma.venue.update({
          where: { id: venueId },
          data: {
            stripeAccountId: null,
            stripeOnboardingStatus: "NOT_STARTED",
            stripeChargesEnabled: false,
            stripePayoutsEnabled: false,
            stripeDetailsSubmitted: false,
          },
        });
      }
    }

    // Create new Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      country: "PT",
      email: venue.email || session.user.email || undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: {
        venueId: venue.id,
        venueName: venue.name,
      },
    });

    // Save account ID to venue
    await prisma.venue.update({
      where: { id: venueId },
      data: {
        stripeAccountId: account.id,
        paymentsProvider: "STRIPE",
        stripeOnboardingStatus: "PENDING",
      },
    });

    return NextResponse.json({
      accountId: account.id,
      message: "Stripe Connect account created successfully",
    });
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    );
  }
}
