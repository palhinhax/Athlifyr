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
      return NextResponse.json(
        { error: "Stripe subscription is not active yet" },
        { status: 400 }
      );
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
