import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { completeTopUp } from "@/lib/credits";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/credits/top-up/confirm
 * Called by the client after stripe.confirmPayment() succeeds.
 * Verifies the PaymentIntent on Stripe and credits the wallet.
 * This serves as a reliable client-side confirmation in addition to webhooks.
 */
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      return NextResponse.json(
        { error: "paymentIntentId is required" },
        { status: 400 }
      );
    }

    // Verify the top-up belongs to this user
    const topUp = await prisma.creditTopUp.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!topUp) {
      return NextResponse.json({ error: "Top-up not found" }, { status: 404 });
    }

    if (topUp.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Already completed — return success idempotently
    if (topUp.status === "COMPLETED") {
      return NextResponse.json({ status: "already_completed" });
    }

    // Verify the PaymentIntent status on Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        {
          error: "Payment not yet succeeded",
          stripeStatus: paymentIntent.status,
        },
        { status: 402 }
      );
    }

    // Credit the wallet (idempotent — safe to call even if webhook already ran)
    await completeTopUp(paymentIntentId);

    return NextResponse.json({ status: "completed" });
  } catch (error) {
    console.error("Error confirming top-up:", error);
    return NextResponse.json(
      { error: "Failed to confirm top-up" },
      { status: 500 }
    );
  }
}
