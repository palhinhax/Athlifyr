import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, toStripeAmount } from "@/lib/stripe";

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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, productId } = await params;
    const body = await request.json();
    const quantity: number = body.quantity ?? 1;

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer" },
        { status: 400 }
      );
    }

    // ── Fetch venue + product ──────────────────────────────────────────────
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: {
        id: true,
        name: true,
        isActive: true,
        paymentMode: true,
        stripeAccountId: true,
        stripeOnboardingStatus: true,
        commissionType: true,
        commissionValue: true,
      },
    });

    if (!venue || !venue.isActive) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    if (venue.paymentMode !== "IN_APP" && venue.paymentMode !== "MIXED") {
      return NextResponse.json(
        { error: "Venue does not support IN_APP payments" },
        { status: 400 }
      );
    }

    if (!venue.stripeAccountId || venue.stripeOnboardingStatus !== "COMPLETE") {
      return NextResponse.json(
        { error: "Venue Stripe account is not fully configured" },
        { status: 400 }
      );
    }

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
    const commissionCents =
      venue.commissionType === "FIXED"
        ? venue.commissionValue
        : Math.round(amountCents * (venue.commissionValue / 100));

    // ── Create Stripe PaymentIntent ────────────────────────────────────────
    const stripePaymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: product.currency.toLowerCase(),
      application_fee_amount: commissionCents > 0 ? commissionCents : undefined,
      transfer_data: {
        destination: venue.stripeAccountId,
      },
      metadata: {
        type: "product_purchase",
        venueId,
        productId,
        productName: product.name,
        quantity: quantity.toString(),
        userId: session.user.id,
        userEmail: session.user.email || "",
      },
      description: `${venue.name} – ${product.name} x${quantity}`,
      automatic_payment_methods: { enabled: true },
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
