import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { StripeOnboardingStatus } from "@prisma/client";
import { authenticateVenueManager } from "@/lib/venues/stripe-route-helpers";

// GET - Get current Stripe account status
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: venueId } = await params;

    const ctx = await authenticateVenueManager(venueId);
    if ("error" in ctx) return ctx.error;

    const { venue } = ctx;

    if (!venue.stripeAccountId) {
      return NextResponse.json({
        accountId: null,
        onboardingStatus: "NOT_STARTED",
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
        lastWebhookAt: null,
      });
    }

    // Fetch account details from Stripe
    let account;
    try {
      account = await stripe.accounts.retrieve(venue.stripeAccountId);
    } catch {
      // Account is invalid/revoked — reset to NOT_STARTED
      console.warn(
        `Stale Stripe account ${venue.stripeAccountId} for venue ${venueId}, resetting`
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
      return NextResponse.json({
        accountId: null,
        onboardingStatus: "NOT_STARTED",
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
        lastWebhookAt: null,
      });
    }

    // Determine onboarding status
    let onboardingStatus: StripeOnboardingStatus = "PENDING";
    if (account.charges_enabled && account.payouts_enabled) {
      onboardingStatus = "COMPLETE";
    } else if (account.requirements?.disabled_reason) {
      onboardingStatus = "RESTRICTED";
    } else if (account.details_submitted) {
      onboardingStatus = "PENDING";
    } else {
      onboardingStatus = "NOT_STARTED";
    }

    // Update venue with latest status
    await prisma.venue.update({
      where: { id: venueId },
      data: {
        stripeChargesEnabled: account.charges_enabled || false,
        stripePayoutsEnabled: account.payouts_enabled || false,
        stripeDetailsSubmitted: account.details_submitted || false,
        stripeOnboardingStatus: onboardingStatus,
      },
    });

    return NextResponse.json({
      accountId: venue.stripeAccountId,
      onboardingStatus,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      detailsSubmitted: account.details_submitted || false,
      lastWebhookAt: venue.stripeLastWebhookAt,
      requirements: account.requirements,
    });
  } catch (error) {
    console.error("Error fetching Stripe status:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe status" },
      { status: 500 }
    );
  }
}
