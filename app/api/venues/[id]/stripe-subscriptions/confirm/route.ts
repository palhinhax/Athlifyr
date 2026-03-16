import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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

    // Verify with Stripe that the subscription is actually active/trialing
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    if (stripeSub.status !== "active" && stripeSub.status !== "trialing") {
      // The subscription may still be "incomplete" even though the payment
      // succeeded (race condition). Fall back to checking the PaymentIntent
      // status directly — it transitions to "succeeded" before the subscription
      // or invoice payment objects are updated by Stripe.
      const latestInvoiceId =
        typeof stripeSub.latest_invoice === "string"
          ? stripeSub.latest_invoice
          : stripeSub.latest_invoice?.id;

      let paymentSucceeded = false;

      if (latestInvoiceId) {
        const invoicePayments = await stripe.invoicePayments.list({
          invoice: latestInvoiceId,
        });

        for (const ip of invoicePayments.data) {
          if (ip.status === "paid") {
            paymentSucceeded = true;
            break;
          }

          // Check the underlying PaymentIntent directly
          const piRef = ip.payment?.payment_intent;
          if (piRef) {
            const piId = typeof piRef === "string" ? piRef : piRef.id;
            const pi = await stripe.paymentIntents.retrieve(piId);
            if (pi.status === "succeeded") {
              paymentSucceeded = true;
              break;
            }
          }
        }
      }

      if (!paymentSucceeded) {
        return NextResponse.json(
          { error: "Stripe subscription is not active yet" },
          { status: 400 }
        );
      }
    }

    // Derive start and end dates from Stripe's current billing period (on items in 2026+ API)
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

    // Ensure the user is an active venue member (same logic as invoice.paid webhook)
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: { venueId, userId: session.user.id },
      },
    });

    if (!member) {
      await prisma.venueMember.create({
        data: {
          venueId,
          userId: session.user.id,
          role: "CLIENT",
          status: "ACTIVE",
          joinedAt: new Date(),
        },
      });
    } else if (member.status !== "ACTIVE") {
      await prisma.venueMember.update({
        where: {
          venueId_userId: { venueId, userId: session.user.id },
        },
        data: { status: "ACTIVE" },
      });
    }

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
