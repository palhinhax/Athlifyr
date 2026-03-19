import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, toStripeAmount } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";
import type { VenuePlanPolicy } from "@/types/venue-plan";
import {
  getVenuePaymentContext,
  calculateApplicationFeePercent,
} from "@/lib/venues/stripe-route-helpers";

/** Find or create a Stripe Product for a venue plan. */
async function getOrCreateStripeProduct(
  planId: string,
  venueId: string,
  venueName: string,
  planName: string
): Promise<string> {
  const existingProducts = await stripe.products.search({
    query: `metadata["athlifyrPlanId"]:"${planId}"`,
  });

  if (existingProducts.data.length > 0) {
    return existingProducts.data[0].id;
  }

  const product = await stripe.products.create({
    name: `${venueName} – ${planName}`,
    metadata: { athlifyrPlanId: planId, venueId },
  });
  return product.id;
}

/** Extract the client secret from a subscription's first invoice payment. */
async function extractClientSecret(subscription: {
  latest_invoice: string | { id: string } | null;
}): Promise<string | null> {
  const latestInvoiceId =
    typeof subscription.latest_invoice === "string"
      ? subscription.latest_invoice
      : subscription.latest_invoice?.id;

  if (!latestInvoiceId) return null;

  const invoicePayments = await stripe.invoicePayments.list({
    invoice: latestInvoiceId,
  });

  const piRef = invoicePayments.data[0]?.payment?.payment_intent;
  const paymentIntentId = typeof piRef === "string" ? piRef : piRef?.id;

  if (!paymentIntentId) return null;

  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  return pi.client_secret;
}

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
    const venueId = (await params).id;
    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const ctx = await getVenuePaymentContext(venueId);
    if ("error" in ctx) return ctx.error;

    const { session, venue } = ctx;

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

    // Application fee = platform commission + Stripe processing fee.
    // Expressed as a percentage for Stripe Billing (which only supports percent).
    const applicationFeePercent = calculateApplicationFeePercent(
      venue,
      amountCents
    );

    // Create a Stripe Product for this plan (idempotent via metadata lookup)
    const productId = await getOrCreateStripeProduct(
      planId,
      venueId,
      venue.name,
      plan.name
    );

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
        applicationFeePercent > 0 ? applicationFeePercent : undefined,
      transfer_data: {
        destination: venue.stripeAccountId!,
      },
      metadata: {
        venueId,
        planId,
        userId: session.user.id,
      },
    });

    // In Stripe API 2026-01-28.clover, the payment_intent field was removed
    // from the Invoice object. Use the Invoice Payments API to find the
    // PaymentIntent that belongs to this subscription's first invoice.
    const clientSecret = await extractClientSecret(subscription);

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
