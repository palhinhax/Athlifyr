import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import type { StripeOnboardingStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-12-15.clover",
});

// GET - Get current Stripe account status
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;

    // Check if user is owner/admin of the venue
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
      include: {
        venue: true,
      },
    });

    if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
      return NextResponse.json(
        { error: "Only venue owner/admin can view payment settings" },
        { status: 403 }
      );
    }

    if (!member.venue.stripeAccountId) {
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
    const account = await stripe.accounts.retrieve(
      member.venue.stripeAccountId
    );

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
      accountId: member.venue.stripeAccountId,
      onboardingStatus,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      detailsSubmitted: account.details_submitted || false,
      lastWebhookAt: member.venue.stripeLastWebhookAt,
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
