import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import type { StripeOnboardingStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Check if we've already processed this event (idempotency)
    const existingEvent = await prisma.stripeWebhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existingEvent && existingEvent.processed) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true, skipped: true });
    }

    // Save event to database
    await prisma.stripeWebhookEvent.upsert({
      where: { stripeEventId: event.id },
      update: { updatedAt: new Date() },
      create: {
        stripeEventId: event.id,
        type: event.type,
        accountId: (event.account as string) || null,
        processed: false,
      },
    });

    // Handle different event types
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account, event.id);
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, event.id);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent, event.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent, event.id);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge, event.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await prisma.stripeWebhookEvent.update({
      where: { stripeEventId: event.id },
      data: { processed: true },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleAccountUpdated(account: Stripe.Account, _eventId: string) {
  console.log(`Processing account.updated for ${account.id}`);

  // Find venue by Stripe account ID
  const venue = await prisma.venue.findUnique({
    where: { stripeAccountId: account.id },
  });

  if (!venue) {
    console.error(`No venue found for Stripe account ${account.id}`);
    return;
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

  // Update venue
  await prisma.venue.update({
    where: { id: venue.id },
    data: {
      stripeChargesEnabled: account.charges_enabled || false,
      stripePayoutsEnabled: account.payouts_enabled || false,
      stripeDetailsSubmitted: account.details_submitted || false,
      stripeOnboardingStatus: onboardingStatus,
      stripeLastWebhookAt: new Date(),
    },
  });

  console.log(`Updated venue ${venue.id} with account status`);
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  _eventId: string
) {
  console.log(`Processing checkout.session.completed: ${session.id}`);

  // Always try to confirm any event Registration linked to this checkout session
  const updatedRegistrations = await prisma.registration.updateMany({
    where: { stripeCheckoutSessionId: session.id },
    data: { status: "CONFIRMED" },
  });

  if (updatedRegistrations.count > 0) {
    console.log(
      `Confirmed ${updatedRegistrations.count} registration(s) for checkout session ${session.id}`
    );
  }

  // Find payment intent by checkout session ID (venue subscription flow)
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: { stripePaymentIntentId: session.payment_intent as string },
  });

  if (!paymentIntent) {
    // Not a venue subscription payment – nothing else to do
    return;
  }

  // Update payment intent status
  await prisma.paymentIntent.update({
    where: { id: paymentIntent.id },
    data: {
      status: "CONFIRMED",
      confirmedAt: new Date(),
    },
  });

  console.log(`Payment confirmed for intent ${paymentIntent.id}`);
}

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  _eventId: string
) {
  console.log(`Processing payment_intent.succeeded: ${paymentIntent.id}`);

  const intent = await prisma.paymentIntent.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!intent) {
    console.error(`No payment intent found for ${paymentIntent.id}`);
    return;
  }

  await prisma.paymentIntent.update({
    where: { id: intent.id },
    data: {
      status: "CONFIRMED",
      confirmedAt: new Date(),
    },
  });
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  _eventId: string
) {
  console.log(`Processing payment_intent.payment_failed: ${paymentIntent.id}`);

  const intent = await prisma.paymentIntent.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!intent) {
    console.error(`No payment intent found for ${paymentIntent.id}`);
    return;
  }

  await prisma.paymentIntent.update({
    where: { id: intent.id },
    data: {
      status: "FAILED",
    },
  });
}

async function handleChargeRefunded(charge: Stripe.Charge, _eventId: string) {
  console.log(`Processing charge.refunded: ${charge.id}`);

  // TODO: Handle refund logic - update booking/subscription status
  console.log(`Refund processed for charge ${charge.id}`);
}
