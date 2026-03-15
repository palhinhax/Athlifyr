import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { Stripe } from "@/lib/stripe";
import type {
  StripeOnboardingStatus,
  EventStripeOnboardingStatus,
} from "@prisma/client";

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
        if (paymentIntent.metadata?.type === "product_purchase") {
          await handleProductPurchaseSucceeded(paymentIntent);
        } else {
          await handlePaymentSucceeded(paymentIntent, event.id);
        }
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

      // ── Stripe Billing events (recurring subscriptions) ──────────────────
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sub);
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

  // Determine onboarding status from Stripe account state
  const statusStr =
    account.charges_enabled && account.payouts_enabled
      ? "COMPLETE"
      : account.requirements?.disabled_reason
        ? "RESTRICTED"
        : account.details_submitted
          ? "PENDING"
          : "NOT_STARTED";

  const stripeFields = {
    stripeChargesEnabled: account.charges_enabled || false,
    stripePayoutsEnabled: account.payouts_enabled || false,
    stripeDetailsSubmitted: account.details_submitted || false,
    stripeLastWebhookAt: new Date(),
  };

  let synced = false;

  // ── Sync Venue (stripeAccountId is unique on Venue) ───────────────────
  const venue = await prisma.venue.findUnique({
    where: { stripeAccountId: account.id },
  });

  if (venue) {
    await prisma.venue.update({
      where: { id: venue.id },
      data: {
        ...stripeFields,
        stripeOnboardingStatus: statusStr as StripeOnboardingStatus,
      },
    });
    console.log(`Updated venue ${venue.id} Stripe status → ${statusStr}`);
    synced = true;
  }

  // ── Sync Events (multiple events can share the same Stripe account) ───
  const events = await prisma.event.findMany({
    where: { stripeAccountId: account.id },
  });

  for (const evt of events) {
    await prisma.event.update({
      where: { id: evt.id },
      data: {
        ...stripeFields,
        stripeOnboardingStatus: statusStr as EventStripeOnboardingStatus,
        // Auto-enable registrations when onboarding completes
        ...(statusStr === "COMPLETE" ? { hasRegistrations: true } : {}),
      },
    });
    console.log(`Updated event ${evt.id} Stripe status → ${statusStr}`);
    synced = true;
  }

  if (!synced) {
    console.error(`No venue or event found for Stripe account ${account.id}`);
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  _eventId: string
) {
  console.log(`Processing checkout.session.completed: ${session.id}`);

  // Find payment intent by checkout session ID
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: { stripePaymentIntentId: session.payment_intent as string },
  });

  if (!paymentIntent) {
    console.error(`No payment intent found for session ${session.id}`);
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

  // TODO: Update subscription or booking status as paid
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
  const stripePaymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!stripePaymentIntentId) {
    console.error(`charge.refunded: no payment_intent on charge ${charge.id}`);
    return;
  }

  const isFullRefund = charge.refunded;
  console.log(
    `Processing charge.refunded: ${charge.id} (PI: ${stripePaymentIntentId}, full: ${isFullRefund})`
  );

  // ── 1. Event registrations ──────────────────────────────────────────────
  const registrations = await prisma.registration.findMany({
    where: { stripePaymentIntentId },
  });

  if (registrations.length > 0) {
    if (isFullRefund) {
      await prisma.registration.updateMany({
        where: { stripePaymentIntentId },
        data: { status: "REFUNDED" },
      });
      console.log(
        `Refunded ${registrations.length} registration(s) for PI ${stripePaymentIntentId}`
      );
    } else {
      console.log(
        `Partial refund on PI ${stripePaymentIntentId} — registrations unchanged`
      );
    }
  }

  // ── 2. Venue PaymentIntent + Subscription ───────────────────────────────
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: { stripePaymentIntentId },
  });

  if (paymentIntent) {
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: { status: "REFUNDED" },
    });

    if (isFullRefund) {
      const subscription = await prisma.venueSubscription.findFirst({
        where: {
          venueId: paymentIntent.venueId,
          userId: paymentIntent.userId,
          planId: paymentIntent.planId,
          status: "ACTIVE",
        },
      });

      if (subscription) {
        await prisma.venueSubscription.update({
          where: { id: subscription.id },
          data: {
            status: "CANCELLED",
            paymentStatus: "PENDING_PAYMENT",
          },
        });
        console.log(
          `Cancelled subscription ${subscription.id} due to full refund`
        );
      }
    }

    console.log(`PaymentIntent ${paymentIntent.id} marked as REFUNDED`);
  }

  if (registrations.length === 0 && !paymentIntent) {
    console.warn(
      `charge.refunded: no registration or PaymentIntent found for PI ${stripePaymentIntentId}`
    );
  }
}

// ============================================================================
// Stripe Billing handlers (recurring subscriptions)
// ============================================================================

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // In Stripe API 2026+, subscription is at invoice.parent.subscription_details.subscription
  const subDetails = invoice.parent?.subscription_details;
  const stripeSubId =
    typeof subDetails?.subscription === "string"
      ? subDetails.subscription
      : subDetails?.subscription?.id;

  if (!stripeSubId) return;

  console.log(`invoice.paid for subscription ${stripeSubId}`);

  const sub = await prisma.venueSubscription.findUnique({
    where: { stripeSubscriptionId: stripeSubId },
  });

  if (!sub) {
    console.warn(`No local subscription for Stripe sub ${stripeSubId}`);
    return;
  }

  // Parse period end from the invoice's lines
  const periodEnd = invoice.lines?.data?.[0]?.period?.end;
  const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000) : undefined;

  await prisma.venueSubscription.update({
    where: { id: sub.id },
    data: {
      status: "ACTIVE",
      paymentStatus: "PAID",
      paymentConfirmedAt: new Date(),
      paymentAmount: invoice.amount_paid
        ? invoice.amount_paid / 100
        : sub.paymentAmount,
      ...(currentPeriodEnd
        ? { stripeCurrentPeriodEnd: currentPeriodEnd, endsAt: currentPeriodEnd }
        : {}),
    },
  });

  // Ensure user is an active venue member
  const member = await prisma.venueMember.findUnique({
    where: { venueId_userId: { venueId: sub.venueId, userId: sub.userId } },
  });

  if (!member) {
    await prisma.venueMember.create({
      data: {
        venueId: sub.venueId,
        userId: sub.userId,
        role: "CLIENT",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });
  } else if (member.status !== "ACTIVE") {
    await prisma.venueMember.update({
      where: { venueId_userId: { venueId: sub.venueId, userId: sub.userId } },
      data: { status: "ACTIVE" },
    });
  }

  console.log(`Subscription ${sub.id} activated/renewed via invoice.paid`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subDetails = invoice.parent?.subscription_details;
  const stripeSubId =
    typeof subDetails?.subscription === "string"
      ? subDetails.subscription
      : subDetails?.subscription?.id;

  if (!stripeSubId) return;

  console.log(`invoice.payment_failed for subscription ${stripeSubId}`);

  const sub = await prisma.venueSubscription.findUnique({
    where: { stripeSubscriptionId: stripeSubId },
  });

  if (!sub) {
    console.warn(`No local subscription for Stripe sub ${stripeSubId}`);
    return;
  }

  await prisma.venueSubscription.update({
    where: { id: sub.id },
    data: {
      paymentStatus: "PENDING_PAYMENT",
    },
  });

  console.log(`Subscription ${sub.id} payment failed — marked PENDING_PAYMENT`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(
    `customer.subscription.updated: ${subscription.id} → ${subscription.status}`
  );

  const sub = await prisma.venueSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) {
    console.warn(`No local subscription for Stripe sub ${subscription.id}`);
    return;
  }

  // Map Stripe status to local status
  const statusMap: Record<string, string> = {
    active: "ACTIVE",
    past_due: "ACTIVE", // still active but payment overdue
    canceled: "CANCELLED",
    unpaid: "SUSPENDED",
    incomplete: "PENDING",
    incomplete_expired: "CANCELLED",
    trialing: "ACTIVE",
    paused: "SUSPENDED",
  };

  const newStatus = statusMap[subscription.status] ?? sub.status;
  // In Stripe API 2026+, current_period_end is on subscription items
  const itemPeriodEnd = subscription.items?.data?.[0]?.current_period_end;
  const periodEnd = itemPeriodEnd ? new Date(itemPeriodEnd * 1000) : undefined;

  await prisma.venueSubscription.update({
    where: { id: sub.id },
    data: {
      status: newStatus,
      ...(periodEnd
        ? { stripeCurrentPeriodEnd: periodEnd, endsAt: periodEnd }
        : {}),
    },
  });

  console.log(`Subscription ${sub.id} updated → ${newStatus}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`customer.subscription.deleted: ${subscription.id}`);

  const sub = await prisma.venueSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) {
    console.warn(`No local subscription for Stripe sub ${subscription.id}`);
    return;
  }

  await prisma.venueSubscription.update({
    where: { id: sub.id },
    data: {
      status: "CANCELLED",
      endsAt: new Date(),
    },
  });

  console.log(`Subscription ${sub.id} cancelled (Stripe deleted)`);
}

// ============================================================================
// Product purchase handler
// ============================================================================

async function handleProductPurchaseSucceeded(
  stripePaymentIntent: Stripe.PaymentIntent
) {
  const { purchaseId } = stripePaymentIntent.metadata;

  if (!purchaseId) {
    console.error("product_purchase PI missing purchaseId metadata");
    return;
  }

  console.log(`Product purchase confirmed: ${purchaseId}`);

  const purchase = await prisma.venueProductPurchase.findUnique({
    where: { id: purchaseId },
    include: { product: true },
  });

  if (!purchase) {
    console.error(`VenueProductPurchase not found: ${purchaseId}`);
    return;
  }

  if (purchase.status === "CONFIRMED") {
    console.log(`Purchase ${purchaseId} already confirmed, skipping`);
    return;
  }

  await prisma.venueProductPurchase.update({
    where: { id: purchase.id },
    data: {
      status: "CONFIRMED",
      confirmedAt: new Date(),
    },
  });

  // Decrement stock if tracked
  if (purchase.product.stock !== null) {
    await prisma.venueProduct.update({
      where: { id: purchase.productId },
      data: {
        stock: { decrement: purchase.quantity },
      },
    });
  }

  console.log(`Product purchase ${purchase.id} confirmed, stock updated`);
}
