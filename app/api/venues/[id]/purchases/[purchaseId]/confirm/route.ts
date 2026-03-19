import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/**
 * POST /api/venues/[id]/purchases/[purchaseId]/confirm
 *
 * Confirm a product purchase after the frontend successfully processes payment.
 * Verifies the PaymentIntent status with Stripe before confirming.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; purchaseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, purchaseId } = await params;

    const purchase = await prisma.venueProductPurchase.findFirst({
      where: {
        id: purchaseId,
        venueId,
        userId: session.user.id,
        status: "CREATED",
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found or already confirmed" },
        { status: 404 }
      );
    }

    // Verify payment status with Stripe
    if (purchase.stripePaymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(
        purchase.stripePaymentIntentId
      );

      if (pi.status !== "succeeded") {
        return NextResponse.json(
          { error: "Payment not yet succeeded" },
          { status: 400 }
        );
      }
    }

    // Update purchase to CONFIRMED and decrement stock
    await prisma.venueProductPurchase.update({
      where: { id: purchaseId },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });

    // Decrement stock if tracked
    const product = await prisma.venueProduct.findUnique({
      where: { id: purchase.productId },
      select: { stock: true },
    });

    if (product?.stock !== null && product?.stock !== undefined) {
      await prisma.venueProduct.update({
        where: { id: purchase.productId },
        data: { stock: { decrement: purchase.quantity } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error confirming purchase:", error);
    return NextResponse.json(
      { error: "Failed to confirm purchase" },
      { status: 500 }
    );
  }
}
