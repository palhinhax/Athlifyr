import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import type { Stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { assignBibNumbers } from "@/lib/bib-number";
import {
  calculatePlanEndDate,
  type VenuePlanPolicy,
  DEFAULT_PLAN_POLICY,
} from "@/types/venue-plan";
import type {
  StripeOnboardingStatus,
  EventStripeOnboardingStatus,
} from "@prisma/client";

// Desabilitar parsing do body para webhooks
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST - Webhook do Stripe
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verificar assinatura do webhook
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ── Idempotency: skip already-processed events ────────────────────────
    const existingWebhookEvent = await prisma.stripeWebhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existingWebhookEvent?.processed) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true, skipped: true });
    }

    await prisma.stripeWebhookEvent.upsert({
      where: { stripeEventId: event.id },
      update: { updatedAt: new Date() },
      create: {
        stripeEventId: event.id,
        type: event.type,
        accountId: null,
        processed: false,
      },
    });

    // Processar eventos do Stripe
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object;
        await handleAccountUpdated(account);
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object;
        // Only handle event registration checkouts (have eventId in metadata)
        if (session.metadata?.eventId && session.metadata?.userId) {
          await handleEventCheckoutCompleted(session);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        // Route to product handler if metadata indicates a product purchase
        if (paymentIntent.metadata?.type === "product_purchase") {
          await handleProductPurchaseSucceeded(paymentIntent);
        } else {
          await handlePaymentIntentSucceeded(paymentIntent);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        await handlePaymentIntentCanceled(paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        await handleChargeRefunded(charge);
        break;
      }

      // ── Stripe Billing events (recurring subscriptions) ──────────────────
      case "invoice.paid": {
        const inv = event.data.object;
        await handleInvoicePaid(inv);
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object;
        await handleInvoicePaymentFailed(inv);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        await handleSubscriptionUpdated(sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await handleSubscriptionDeleted(sub);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // ── Mark event as processed ───────────────────────────────────────────
    await prisma.stripeWebhookEvent.update({
      where: { stripeEventId: event.id },
      data: { processed: true },
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handler for Stripe Connect account onboarding status sync
async function handleAccountUpdated(account: Stripe.Account) {
  console.log(`Processing account.updated for ${account.id}`);

  let statusStr: string;
  if (account.charges_enabled && account.payouts_enabled) {
    statusStr = "COMPLETE";
  } else if (account.requirements?.disabled_reason) {
    statusStr = "RESTRICTED";
  } else if (account.details_submitted) {
    statusStr = "PENDING";
  } else {
    statusStr = "NOT_STARTED";
  }

  const stripeFields = {
    stripeChargesEnabled: account.charges_enabled || false,
    stripePayoutsEnabled: account.payouts_enabled || false,
    stripeDetailsSubmitted: account.details_submitted || false,
    stripeLastWebhookAt: new Date(),
  };

  let synced = false;

  // Sync Venue (stripeAccountId is unique on Venue)
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

  // Sync Events (multiple events can share the same Stripe account)
  const events = await prisma.event.findMany({
    where: { stripeAccountId: account.id },
  });

  for (const evt of events) {
    await prisma.event.update({
      where: { id: evt.id },
      data: {
        ...stripeFields,
        stripeOnboardingStatus: statusStr as EventStripeOnboardingStatus,
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

// Handler for event registration checkout completed
async function handleEventCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { eventId, variantId, userId, pricingPhaseId } = session.metadata as {
      eventId: string;
      variantId: string;
      userId: string;
      pricingPhaseId: string;
    };

    console.log("Event checkout completed:", session.id, {
      eventId,
      variantId,
      userId,
    });

    if (!eventId || !variantId || !userId) {
      console.error(
        "Missing required metadata in checkout session:",
        session.id
      );
      return;
    }

    // Idempotency: skip if registration already confirmed
    const existing = await prisma.registration.findUnique({
      where: {
        userId_eventId_variantId_teamMemberIndex: {
          userId,
          eventId,
          variantId,
          teamMemberIndex: 0,
        },
      },
    });
    if (existing?.status === "CONFIRMED") {
      console.log("Registration already confirmed, skipping:", existing.id);
      return;
    }

    const amountCents = session.amount_total ?? 0;
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);

    const pricingPhase = pricingPhaseId
      ? await prisma.pricingPhase.findUnique({ where: { id: pricingPhaseId } })
      : null;

    if (existing) {
      // Gather leader + any MEMBER ids so we can assign all bibs atomically
      let memberIds: string[] = [];
      if (existing.teamGroupId) {
        const teamMembers = await prisma.registration.findMany({
          where: {
            teamGroupId: existing.teamGroupId,
            teamRole: "MEMBER",
            status: "PENDING",
          },
          select: { id: true },
          orderBy: { teamMemberIndex: "asc" },
        });
        memberIds = teamMembers.map((m) => m.id);
      }

      // Assign bib numbers atomically (leader first, then members, all in one
      // serialized transaction with an advisory lock — no duplicate bibs).
      await assignBibNumbers(eventId, [existing.id, ...memberIds]);

      // Fetch the just-assigned leader bib to store on the update below
      const leaderReg = await prisma.registration.findUnique({
        where: { id: existing.id },
        select: { bibNumber: true },
      });

      // Update PENDING → CONFIRMED for leader
      await prisma.registration.update({
        where: { id: existing.id },
        data: {
          status: "CONFIRMED",
          bibNumber: leaderReg?.bibNumber ?? null,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntent,
          amountCents,
          currency: (pricingPhase?.currency ?? "EUR") as "EUR" | "USD" | "GBP",
        },
      });

      // Confirm all MEMBER registrations (bibs already assigned above)
      if (memberIds.length > 0) {
        await prisma.registration.updateMany({
          where: { id: { in: memberIds } },
          data: {
            status: "CONFIRMED",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntent,
          },
        });
        console.log(
          "Team member registrations confirmed for group:",
          existing.teamGroupId
        );
      }
    } else {
      // New registration — create row first (bibNumber null), then assign
      // atomically so concurrent webhooks never produce duplicates.
      const newReg = await prisma.registration.create({
        data: {
          userId,
          eventId,
          variantId,
          status: "CONFIRMED",
          bibNumber: null,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntent,
          amountCents,
          currency: (pricingPhase?.currency ?? "EUR") as "EUR" | "USD" | "GBP",
        },
      });
      await assignBibNumbers(eventId, [newReg.id]);
    }

    console.log("Registration created/confirmed for user:", userId);
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    throw error;
  }
}

// Handler para pagamento bem-sucedido
async function handlePaymentIntentSucceeded(
  stripePaymentIntent: Stripe.PaymentIntent
) {
  try {
    console.log(
      "Payment Intent succeeded:",
      stripePaymentIntent.id,
      stripePaymentIntent.metadata
    );

    // Encontrar o PaymentIntent no banco de dados
    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {
        stripePaymentIntentId: stripePaymentIntent.id,
      },
      include: {
        plan: true,
      },
    });

    if (!paymentIntent) {
      console.error(
        "Payment Intent not found in database:",
        stripePaymentIntent.id
      );
      return;
    }

    // Atualizar status do PaymentIntent
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });

    // Verificar se já existe subscrição
    const existingSubscription = await prisma.venueSubscription.findFirst({
      where: {
        venueId: paymentIntent.venueId,
        userId: paymentIntent.userId,
        planId: paymentIntent.planId,
      },
    });

    if (existingSubscription) {
      // Atualizar subscrição existente
      await prisma.venueSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: "ACTIVE",
          paymentStatus: "PAID",
          paymentConfirmedAt: new Date(),
          paymentAmount: paymentIntent.amount,
          paymentMethod: "Stripe",
        },
      });
    } else {
      // Calculate start and end dates based on plan policy
      const startDate = new Date();
      const planPolicy = paymentIntent.plan?.policy as VenuePlanPolicy | null;
      const duration = planPolicy?.duration || DEFAULT_PLAN_POLICY.duration;
      const durationValue =
        planPolicy?.durationValue || DEFAULT_PLAN_POLICY.durationValue;
      const endDate = calculatePlanEndDate(startDate, duration, durationValue);

      // Criar nova subscrição
      await prisma.venueSubscription.create({
        data: {
          venueId: paymentIntent.venueId,
          userId: paymentIntent.userId,
          planId: paymentIntent.planId,
          status: "ACTIVE",
          paymentStatus: "PAID",
          paymentConfirmedAt: new Date(),
          paymentAmount: paymentIntent.amount,
          paymentMethod: "Stripe",
          startsAt: startDate,
          endsAt: endDate,
        },
      });

      // Verificar se o utilizador já é membro
      const member = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId: paymentIntent.venueId,
            userId: paymentIntent.userId,
          },
        },
      });

      // Se não for membro, criar com role CLIENT
      if (!member) {
        await prisma.venueMember.create({
          data: {
            venueId: paymentIntent.venueId,
            userId: paymentIntent.userId,
            role: "CLIENT",
            status: "ACTIVE",
            joinedAt: new Date(),
          },
        });
      } else if (member.status !== "ACTIVE") {
        // Reativar membro se estiver suspenso ou saiu
        await prisma.venueMember.update({
          where: {
            venueId_userId: {
              venueId: paymentIntent.venueId,
              userId: paymentIntent.userId,
            },
          },
          data: {
            status: "ACTIVE",
          },
        });
      }
    }

    console.log(
      "Subscription activated successfully for user:",
      paymentIntent.userId
    );
  } catch (error) {
    console.error("Error handling payment_intent.succeeded:", error);
    throw error;
  }
}

// Handler para pagamento falhado
async function handlePaymentIntentFailed(
  stripePaymentIntent: Stripe.PaymentIntent
) {
  try {
    console.log("Payment Intent failed:", stripePaymentIntent.id);

    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {
        stripePaymentIntentId: stripePaymentIntent.id,
      },
    });

    if (!paymentIntent) {
      console.error(
        "Payment Intent not found in database:",
        stripePaymentIntent.id
      );
      return;
    }

    // Atualizar status
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: "FAILED",
      },
    });

    console.log("Payment Intent marked as failed:", paymentIntent.id);
  } catch (error) {
    console.error("Error handling payment_intent.payment_failed:", error);
    throw error;
  }
}

// Handler para pagamento cancelado
async function handlePaymentIntentCanceled(
  stripePaymentIntent: Stripe.PaymentIntent
) {
  try {
    console.log("Payment Intent canceled:", stripePaymentIntent.id);

    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {
        stripePaymentIntentId: stripePaymentIntent.id,
      },
    });

    if (!paymentIntent) {
      console.error(
        "Payment Intent not found in database:",
        stripePaymentIntent.id
      );
      return;
    }

    // Atualizar status
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: "CANCELLED",
      },
    });

    console.log("Payment Intent marked as canceled:", paymentIntent.id);
  } catch (error) {
    console.error("Error handling payment_intent.canceled:", error);
    throw error;
  }
}

// Extracted helpers for handleChargeRefunded to keep cognitive complexity low

async function refundEventRegistrations(
  stripePaymentIntentId: string,
  isFullRefund: boolean
): Promise<number> {
  const registrations = await prisma.registration.findMany({
    where: { stripePaymentIntentId },
  });

  if (registrations.length > 0 && isFullRefund) {
    await prisma.registration.updateMany({
      where: { stripePaymentIntentId },
      data: { status: "REFUNDED" },
    });
    console.log(
      `Refunded ${registrations.length} registration(s) for PI ${stripePaymentIntentId}`
    );
  } else if (registrations.length > 0) {
    console.log(
      `Partial refund on PI ${stripePaymentIntentId} — registrations unchanged`
    );
  }

  return registrations.length;
}

async function refundVenuePaymentIntent(
  stripePaymentIntentId: string,
  isFullRefund: boolean
): Promise<boolean> {
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: { stripePaymentIntentId },
  });

  if (!paymentIntent) return false;

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
        data: { status: "CANCELLED", paymentStatus: "PENDING_PAYMENT" },
      });
      console.log(
        `Cancelled subscription ${subscription.id} due to full refund`
      );
    }
  }

  console.log(`PaymentIntent ${paymentIntent.id} marked as REFUNDED`);
  return true;
}

async function refundProductPurchase(
  stripePaymentIntentId: string
): Promise<void> {
  const productPurchase = await prisma.venueProductPurchase.findFirst({
    where: { stripePaymentIntentId, status: "CONFIRMED" },
    include: { product: { select: { stock: true } } },
  });

  if (!productPurchase) return;

  await prisma.venueProductPurchase.update({
    where: { id: productPurchase.id },
    data: { status: "REFUNDED" },
  });

  if (productPurchase.product.stock !== null) {
    await prisma.venueProduct.update({
      where: { id: productPurchase.productId },
      data: { stock: { increment: productPurchase.quantity } },
    });
  }

  console.log(
    `Product purchase ${productPurchase.id} refunded for PI ${stripePaymentIntentId}`
  );
}

// Handler for charge refunds
async function handleChargeRefunded(charge: Stripe.Charge) {
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

  const registrationCount = await refundEventRegistrations(
    stripePaymentIntentId,
    isFullRefund
  );
  const paymentIntentFound = await refundVenuePaymentIntent(
    stripePaymentIntentId,
    isFullRefund
  );

  if (isFullRefund) {
    await refundProductPurchase(stripePaymentIntentId);
  }

  if (registrationCount === 0 && !paymentIntentFound) {
    console.warn(
      `charge.refunded: no registration or PaymentIntent found for PI ${stripePaymentIntentId}`
    );
  }
}

// ============================================================================
// Stripe Billing handlers (recurring subscriptions)
// ============================================================================

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subDetails = invoice.parent?.subscription_details;
  const stripeSubId =
    typeof subDetails?.subscription === "string"
      ? subDetails.subscription
      : subDetails?.subscription?.id;

  if (!stripeSubId) return;

  console.log(`invoice.paid for subscription ${stripeSubId}`);

  const sub = await prisma.venueSubscription.findFirst({
    where: { stripeSubscriptionId: stripeSubId },
  });

  if (!sub) {
    console.warn(`No local subscription for Stripe sub ${stripeSubId}`);
    return;
  }

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

  const sub = await prisma.venueSubscription.findFirst({
    where: { stripeSubscriptionId: stripeSubId },
  });

  if (!sub) {
    console.warn(`No local subscription for Stripe sub ${stripeSubId}`);
    return;
  }

  await prisma.venueSubscription.update({
    where: { id: sub.id },
    data: { paymentStatus: "PENDING_PAYMENT" },
  });

  console.log(`Subscription ${sub.id} payment failed — marked PENDING_PAYMENT`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(
    `customer.subscription.updated: ${subscription.id} → ${subscription.status}`
  );

  const sub = await prisma.venueSubscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) {
    console.warn(`No local subscription for Stripe sub ${subscription.id}`);
    return;
  }

  const statusMap: Record<string, string> = {
    active: "ACTIVE",
    past_due: "ACTIVE",
    canceled: "CANCELLED",
    unpaid: "SUSPENDED",
    incomplete: "PENDING",
    incomplete_expired: "CANCELLED",
    trialing: "ACTIVE",
    paused: "SUSPENDED",
  };

  let newStatus = statusMap[subscription.status] ?? sub.status;

  // Preserve CANCELLING: when cancel_at_period_end is true and Stripe still
  // reports the subscription as active, keep the local CANCELLING status so
  // the UI shows "subscription ending" until it actually expires.
  if (subscription.cancel_at_period_end && newStatus === "ACTIVE") {
    newStatus = "CANCELLING";
  }
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

  const sub = await prisma.venueSubscription.findFirst({
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
