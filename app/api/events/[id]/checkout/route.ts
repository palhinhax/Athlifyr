import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

// POST - Create a Stripe Checkout session for an event registration
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = await request.json();
    const { variantId } = body as { variantId: string };

    if (!variantId) {
      return NextResponse.json(
        { error: "variantId is required" },
        { status: 400 }
      );
    }

    // Load event with Stripe settings
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        slug: true,
        hasRegistrations: true,
        stripeAccountId: true,
        stripeOnboardingStatus: true,
        commissionPercent: true,
        commissionFixed: true,
        translations: {
          where: { language: "pt" },
          select: { title: true },
          take: 1,
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.hasRegistrations) {
      return NextResponse.json(
        { error: "Event does not accept paid registrations" },
        { status: 400 }
      );
    }

    // Load variant with current pricing phase
    const variant = await prisma.eventVariant.findFirst({
      where: { id: variantId, eventId },
      include: {
        pricingPhases: {
          where: {
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
          orderBy: { startDate: "asc" },
          take: 1,
        },
        translations: {
          where: { language: "pt" },
          select: { name: true },
          take: 1,
        },
      },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    const activePhase = variant.pricingPhases[0];
    if (!activePhase) {
      return NextResponse.json(
        { error: "No active pricing phase for this variant" },
        { status: 400 }
      );
    }

    const priceEuros = activePhase.price;
    const amountCents = Math.round(priceEuros * 100);
    const commissionCents = Math.round(
      amountCents * (event.commissionPercent / 100) + event.commissionFixed
    );
    const netCents = amountCents - commissionCents;

    // Prevent duplicate confirmed registrations
    const existing = await prisma.registration.findUnique({
      where: {
        userId_eventId_variantId: {
          userId: session.user.id,
          eventId,
          variantId,
        },
      },
    });

    if (existing?.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "Already registered for this variant" },
        { status: 409 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/en/events/${event.slug}?registration=success`;
    const cancelUrl = `${baseUrl}/en/events/${event.slug}?registration=cancel`;

    // ── Test / CI bypass ────────────────────────────────────────────────────
    // When E2E_TESTING=true (or no real Stripe key is set) skip the real
    // Stripe call and return a deterministic local redirect so that E2E tests
    // can exercise the full app flow without a live Stripe account.
    const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
    const isTestBypass = process.env.E2E_TESTING === "true" || stripeKey === "";

    if (isTestBypass) {
      // Upsert pending registration
      const registration = await prisma.registration.upsert({
        where: {
          userId_eventId_variantId: {
            userId: session.user.id,
            eventId,
            variantId,
          },
        },
        update: {
          status: "PENDING",
          amountCents,
          feeCents: commissionCents,
          netCents,
        },
        create: {
          userId: session.user.id,
          eventId,
          variantId,
          status: "PENDING",
          amountCents,
          feeCents: commissionCents,
          netCents,
          currency: "EUR",
          stripeCheckoutSessionId: `test_session_${Date.now()}`,
        },
      });

      return NextResponse.json({
        checkoutUrl: `${baseUrl}/api/test/simulate-payment?registrationId=${registration.id}&successUrl=${encodeURIComponent(successUrl)}&cancelUrl=${encodeURIComponent(cancelUrl)}`,
        registrationId: registration.id,
        testMode: true,
      });
    }

    // ── Real Stripe checkout ────────────────────────────────────────────────
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-12-15.clover" as Stripe.LatestApiVersion,
    });

    const eventTitle = event.translations[0]?.title ?? "Event Registration";
    const variantName =
      variant.translations[0]?.name ?? variant.name ?? "Variant";

    const stripeParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: (activePhase.currency ?? "EUR").toLowerCase(),
            product_data: {
              name: `${eventTitle} – ${variantName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        eventId,
        variantId,
        userId: session.user.id,
      },
    };

    // Use Stripe Connect destination charge when the event has a connected account
    if (event.stripeAccountId) {
      stripeParams.payment_intent_data = {
        application_fee_amount: commissionCents,
        transfer_data: {
          destination: event.stripeAccountId,
        },
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create(stripeParams);

    // Upsert pending registration linked to the checkout session
    const registration = await prisma.registration.upsert({
      where: {
        userId_eventId_variantId: {
          userId: session.user.id,
          eventId,
          variantId,
        },
      },
      update: {
        status: "PENDING",
        stripeCheckoutSessionId: checkoutSession.id,
        stripePaymentIntentId:
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : null,
        amountCents,
        feeCents: commissionCents,
        netCents,
      },
      create: {
        userId: session.user.id,
        eventId,
        variantId,
        status: "PENDING",
        stripeCheckoutSessionId: checkoutSession.id,
        stripePaymentIntentId:
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : null,
        amountCents,
        feeCents: commissionCents,
        netCents,
        currency: "EUR",
      },
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
