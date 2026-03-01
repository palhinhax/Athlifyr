import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { EventStripeOnboardingStatus } from "@prisma/client";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

// GET /api/events/[id]/stripe/status — fetch and sync Stripe account status
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const ctx = await getUserEventContext(user.id, user.role, eventId);
    if (!hasEventPermission(ctx, "manage_stripe")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!event.stripeAccountId) {
      return NextResponse.json({
        accountId: null,
        onboardingStatus: "NOT_STARTED",
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
        hasRegistrations: false,
        lastWebhookAt: null,
      });
    }

    // Fetch from Stripe
    const account = await stripe.accounts.retrieve(event.stripeAccountId);

    // Determine status
    let onboardingStatus: EventStripeOnboardingStatus = "PENDING";
    if (account.charges_enabled && account.payouts_enabled) {
      onboardingStatus = "COMPLETE";
    } else if (account.requirements?.disabled_reason) {
      onboardingStatus = "RESTRICTED";
    } else if (account.details_submitted) {
      onboardingStatus = "PENDING";
    } else {
      onboardingStatus = "NOT_STARTED";
    }

    // hasRegistrations is auto-derived from stripe status being COMPLETE
    const hasRegistrations = onboardingStatus === "COMPLETE";

    // Sync to DB
    await prisma.event.update({
      where: { id: eventId },
      data: {
        stripeChargesEnabled: account.charges_enabled ?? false,
        stripePayoutsEnabled: account.payouts_enabled ?? false,
        stripeDetailsSubmitted: account.details_submitted ?? false,
        stripeOnboardingStatus: onboardingStatus,
        stripeLastWebhookAt: new Date(),
        // Auto-enable hasRegistrations when Stripe is fully onboarded
        hasRegistrations,
      },
    });

    return NextResponse.json({
      accountId: event.stripeAccountId,
      onboardingStatus,
      chargesEnabled: account.charges_enabled ?? false,
      payoutsEnabled: account.payouts_enabled ?? false,
      detailsSubmitted: account.details_submitted ?? false,
      hasRegistrations,
      lastWebhookAt: event.stripeLastWebhookAt,
      requirements: account.requirements,
    });
  } catch (error) {
    console.error("Error fetching Stripe status for event:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe status" },
      { status: 500 }
    );
  }
}
