import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, toStripeAmount } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";
import type { VenuePlanPolicy } from "@/types/venue-plan";

/**
 * POST /api/venues/[id]/stripe-subscriptions
 *
 * Create a Stripe Billing subscription for a recurring venue plan.
 * Returns the Stripe clientSecret so the frontend can confirm the first payment.
 *
 * This is an alternative to the one-time payment-intents flow.
 * Use this for plans with recurring durations (DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = (await params).id;
    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // ── Fetch venue + plan ──────────────────────────────────────────────────
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: {
        id: true,
        name: true,
        isActive: true,
        paymentMode: true,
        stripeAccountId: true,
        stripeOnboardingStatus: true,
        commissionType: true,
        commissionValue: true,
      },
    });

    if (!venue || !venue.isActive) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    if (venue.paymentMode !== "IN_APP" && venue.paymentMode !== "MIXED") {
      return NextResponse.json(
        { error: "Venue does not support IN_APP payments" },
        { status: 400 }
      );
    }

    if (!venue.stripeAccountId || venue.stripeOnboardingStatus !== "COMPLETE") {
      return NextResponse.json(
        { error: "Venue Stripe account is not fully configured" },
        { status: 400 }
      );
    }

    const plan = await prisma.venuePlan.findFirst({
      where: { id: planId, venueId, isActive: true },
    });

    if (!plan || !plan.price || plan.price <= 0) {
      return NextResponse.json(
        { error: "Plan not found or has no valid price" },
        { status: 404 }
      );
    }

    const policy = plan.policy as VenuePlanPolicy | null;
    const duration = policy?.duration ?? "MONTHLY";

    // Only recurring durations should use Stripe Billing
    const recurringIntervals: Record<
      string,
      "day" | "week" | "month" | "year"
    > = {
      DAILY: "day",
      WEEKLY: "week",
      MONTHLY: "month",
      QUARTERLY: "month",
      YEARLY: "year",
    };

    const stripeInterval = recurringIntervals[duration];
    if (!stripeInterval) {
      return NextResponse.json(
        {
          error:
            "Plan duration does not support recurring billing. Use the payment-intents endpoint for one-time plans.",
        },
        { status: 400 }
      );
    }

    const intervalCount =
      duration === "QUARTERLY" ? 3 : (policy?.durationValue ?? 1);

    // ── Check for existing active subscription ─────────────────────────────
    const existingSub = await prisma.venueSubscription.findFirst({
      where: {
        venueId,
        userId: session.user.id,
        planId,
        status: "ACTIVE",
        stripeSubscriptionId: { not: null },
      },
    });

    if (existingSub) {
      return NextResponse.json(
        { error: "You already have an active subscription to this plan" },
        { status: 409 }
      );
    }

    // ── Stripe objects ─────────────────────────────────────────────────────
    const customerId = await getOrCreateStripeCustomer(session.user.id);
    const amountCents = toStripeAmount(plan.price);

    // Commission: Stripe Billing only supports application_fee_percent (not fixed amount).
    // For FIXED commissions, convert to an equivalent percentage of the plan price.
    let commissionPercent: number;
    if (venue.commissionType === "PERCENT") {
      commissionPercent = venue.commissionValue;
    } else {
      // FIXED: commissionValue is in cents, amountCents is the plan price in cents
      commissionPercent =
        amountCents > 0
          ? Math.round((venue.commissionValue / amountCents) * 10000) / 100
          : 0;
    }

    // Create a Stripe Product for this plan (idempotent via metadata lookup)
    const existingProducts = await stripe.products.search({
      query: `metadata["athlifyrPlanId"]:"${planId}"`,
    });

    let productId: string;
    if (existingProducts.data.length > 0) {
      productId = existingProducts.data[0].id;
    } else {
      const product = await stripe.products.create({
        name: `${venue.name} – ${plan.name}`,
        metadata: { athlifyrPlanId: planId, venueId },
      });
      productId = product.id;
    }

    // Create a recurring price
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: amountCents,
      currency: plan.currency.toLowerCase(),
      recurring: {
        interval: stripeInterval,
        interval_count: intervalCount,
      },
      metadata: { athlifyrPlanId: planId, venueId },
    });

    // Create Stripe Subscription with destination charges
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      application_fee_percent:
        commissionPercent > 0 ? commissionPercent : undefined,
      transfer_data: {
        destination: venue.stripeAccountId,
      },
      metadata: {
        venueId,
        planId,
        userId: session.user.id,
      },
      expand: ["latest_invoice.payment_intent"],
    });

    // Extract client secret from the first invoice's PaymentIntent
    const invoice = subscription.latest_invoice as {
      payment_intent?: { client_secret?: string | null };
    } | null;
    const clientSecret = invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
      // Clean up the subscription if we can't get the client secret
      await stripe.subscriptions.cancel(subscription.id);
      return NextResponse.json(
        { error: "Failed to create subscription payment" },
        { status: 500 }
      );
    }

    // ── Save local subscription (PENDING until invoice.paid webhook) ───────
    await prisma.venueSubscription.create({
      data: {
        venueId,
        userId: session.user.id,
        planId,
        status: "PENDING",
        paymentStatus: "PENDING_PAYMENT",
        paymentMethod: "Stripe",
        paymentAmount: plan.price,
        stripeSubscriptionId: subscription.id,
        stripePriceId: price.id,
        startsAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        subscriptionId: subscription.id,
        clientSecret,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Stripe subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
