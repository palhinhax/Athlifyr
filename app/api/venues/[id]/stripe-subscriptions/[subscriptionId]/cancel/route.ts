import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/**
 * POST /api/venues/[id]/stripe-subscriptions/[subscriptionId]/cancel
 *
 * Cancel a Stripe Billing subscription at the end of the current billing period.
 * Only the subscription owner can cancel their own subscription.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; subscriptionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, subscriptionId } = await params;

    // Fetch the local subscription record
    const subscription = await prisma.venueSubscription.findFirst({
      where: {
        id: subscriptionId,
        venueId,
        userId: session.user.id,
        status: "ACTIVE",
        stripeSubscriptionId: { not: null },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Cancel at period end (user keeps access until current period expires)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
      cancel_at_period_end: true,
    });

    // Update local record
    await prisma.venueSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
