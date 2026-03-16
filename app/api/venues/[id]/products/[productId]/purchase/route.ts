import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, toStripeAmount } from "@/lib/stripe";
import {
  getVenuePaymentContext,
  createVenuePaymentIntent,
} from "@/lib/venues/stripe-route-helpers";

/**
 * POST /api/venues/[id]/products/[productId]/purchase
 *
 * Create a Stripe PaymentIntent (destination charge) for a venue product purchase.
 * Returns clientSecret for the frontend to confirm payment.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const { id: venueId, productId } = await params;

    const ctx = await getVenuePaymentContext(venueId);
    if ("error" in ctx) return ctx.error;

    const { session, venue } = ctx;

    const body = await request.json();
    const quantity: number = body.quantity ?? 1;

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer" },
        { status: 400 }
      );
    }

    // ── Fetch product ───────────────────────────────────────────────────────
    const product = await prisma.venueProduct.findFirst({
      where: { id: productId, venueId, isActive: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check stock
    if (product.stock !== null && product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // ── Calculate amounts ──────────────────────────────────────────────────
    const totalAmount = product.price * quantity;
    const amountCents = toStripeAmount(totalAmount);

    // ── Create Stripe PaymentIntent ────────────────────────────────────────
    const stripePaymentIntent = await createVenuePaymentIntent({
      amountCents,
      currency: product.currency,
      venue,
      description: `${venue.name} – ${product.name} x${quantity}`,
      metadata: {
        type: "product_purchase",
        venueId,
        productId,
        productName: product.name,
        quantity: quantity.toString(),
        userId: session.user.id,
        userEmail: session.user.email || "",
      },
    });

    // ── Save purchase record ───────────────────────────────────────────────
    const purchase = await prisma.venueProductPurchase.create({
      data: {
        venueId,
        productId,
        userId: session.user.id,
        quantity,
        unitPrice: product.price,
        totalAmount,
        currency: product.currency,
        status: "CREATED",
        stripePaymentIntentId: stripePaymentIntent.id,
      },
    });

    // Also add purchaseId to the PI metadata for the webhook
    await stripe.paymentIntents.update(stripePaymentIntent.id, {
      metadata: {
        ...stripePaymentIntent.metadata,
        purchaseId: purchase.id,
      },
    });

    return NextResponse.json(
      {
        purchase,
        clientSecret: stripePaymentIntent.client_secret,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product purchase:", error);
    return NextResponse.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}
