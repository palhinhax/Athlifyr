import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

/**
 * Check whether a Stripe subscription's first payment has actually succeeded,
 * even if the subscription object itself hasn't transitioned to "active" yet.
 */
async function isPaymentSucceeded(
  stripeSub: Stripe.Subscription
): Promise<boolean> {
  if (stripeSub.status === "active" || stripeSub.status === "trialing") {
    return true;
  }

  const latestInvoiceId =
    typeof stripeSub.latest_invoice === "string"
      ? stripeSub.latest_invoice
      : stripeSub.latest_invoice?.id;

  if (!latestInvoiceId) return false;

  const invoicePayments = await stripe.invoicePayments.list({
    invoice: latestInvoiceId,
  });

  for (const ip of invoicePayments.data) {
    if (ip.status === "paid") return true;

    const piRef = ip.payment?.payment_intent;
    if (piRef) {
      const piId = typeof piRef === "string" ? piRef : piRef.id;
      const pi = await stripe.paymentIntents.retrieve(piId);
      if (pi.status === "succeeded") return true;
    }
  }

  return false;
}

/** Ensure user is an active venue member, creating/updating as needed. */
async function ensureActiveVenueMember(
  venueId: string,
  userId: string
): Promise<void> {
  const member = await prisma.venueMember.findUnique({
    where: { venueId_userId: { venueId, userId } },
  });

  if (!member) {
    await prisma.venueMember.create({
      data: {
        venueId,
        userId,
        role: "CLIENT",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });
  } else if (member.status !== "ACTIVE") {
    await prisma.venueMember.update({
      where: { venueId_userId: { venueId, userId } },
      data: { status: "ACTIVE" },
    });
  }
}

/**
 * POST /api/venues/[id]/stripe-subscriptions/confirm
 *
 * Called by the frontend after stripe.confirmPayment() succeeds for a recurring subscription.
 * Verifies the Stripe subscription status and activates the local subscription immediately,
 * so the user sees the active state without waiting for the webhook.
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
    const { stripeSubscriptionId } = await request.json();

    if (!stripeSubscriptionId) {
      return NextResponse.json(
        { error: "stripeSubscriptionId is required" },
        { status: 400 }
      );
    }

    // Find the local subscription
    const subscription = await prisma.venueSubscription.findFirst({
      where: {
        venueId,
        userId: session.user.id,
        stripeSubscriptionId,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            policy: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Already active — idempotent
    if (subscription.status === "ACTIVE") {
      return NextResponse.json({ subscription });
    }

    // Verify with Stripe that the payment actually succeeded
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    if (!(await isPaymentSucceeded(stripeSub))) {
      return NextResponse.json(
        { error: "Stripe subscription is not active yet" },
        { status: 400 }
      );
    }

    // Derive start and end dates from Stripe's current billing period
    const itemPeriodEnd = stripeSub.items?.data?.[0]?.current_period_end;
    const startDate = new Date();
    const endDate = itemPeriodEnd ? new Date(itemPeriodEnd * 1000) : undefined;

    // Activate the local subscription
    const updated = await prisma.venueSubscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        paymentStatus: "PAID",
        paymentConfirmedAt: new Date(),
        startsAt: startDate,
        endsAt: endDate,
        stripeCurrentPeriodEnd: endDate,
      },
    });

    // Ensure the user is an active venue member
    await ensureActiveVenueMember(venueId, session.user.id);

    console.log(
      `Subscription ${subscription.id} activated via confirm endpoint`
    );

    return NextResponse.json({ subscription: updated });
  } catch (error) {
    console.error("Error confirming subscription:", error);
    return NextResponse.json(
      { error: "Failed to confirm subscription" },
      { status: 500 }
    );
  }
}
