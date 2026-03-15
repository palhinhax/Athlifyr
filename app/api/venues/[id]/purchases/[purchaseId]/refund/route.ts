import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { canManageVenue } from "@/lib/venues/authorization";

/**
 * POST /api/venues/[id]/purchases/[purchaseId]/refund — Refund a product purchase (staff only)
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

    const allowed = await canManageVenue(session.user.id, venueId);
    if (!allowed.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const purchase = await prisma.venueProductPurchase.findFirst({
      where: { id: purchaseId, venueId },
      include: { product: { select: { name: true, stock: true } } },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    if (purchase.status === "REFUNDED") {
      return NextResponse.json(
        { error: "Purchase already refunded" },
        { status: 400 }
      );
    }

    if (purchase.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Only confirmed purchases can be refunded" },
        { status: 400 }
      );
    }

    if (!purchase.stripePaymentIntentId) {
      return NextResponse.json(
        { error: "No Stripe PaymentIntent associated" },
        { status: 400 }
      );
    }

    // Issue Stripe refund — this triggers charge.refunded webhook automatically
    await stripe.refunds.create({
      payment_intent: purchase.stripePaymentIntentId,
      reverse_transfer: true,
      refund_application_fee: true,
    });

    // Update purchase status immediately (webhook will also handle this)
    await prisma.venueProductPurchase.update({
      where: { id: purchaseId },
      data: { status: "REFUNDED" },
    });

    // Restore stock if tracked
    if (purchase.product.stock !== null) {
      await prisma.venueProduct.update({
        where: { id: purchase.productId },
        data: { stock: { increment: purchase.quantity } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error refunding purchase:", error);
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    );
  }
}
