import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { generateNextBibNumber, assignBibNumbers } from "@/lib/bib-number";

/**
 * POST /api/events/[id]/registration/confirm
 *
 * Confirms a registration by verifying the Stripe Checkout Session directly.
 * This is the safety-net: when the user returns from Stripe with a session_id,
 * we verify payment with Stripe and confirm the registration immediately,
 * regardless of whether the webhook has already fired.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = (await request.json()) as { sessionId: string };
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // Retrieve the Checkout Session from Stripe to verify payment
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify metadata matches this user and event
    if (
      checkoutSession.metadata?.eventId !== eventId ||
      checkoutSession.metadata?.userId !== user.id
    ) {
      return NextResponse.json(
        { error: "Session does not match this event/user" },
        { status: 403 }
      );
    }

    // Only confirm if payment was actually completed
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        {
          registration: null,
          paymentStatus: checkoutSession.payment_status,
        },
        { status: 200 }
      );
    }

    const variantId = checkoutSession.metadata.variantId;
    const pricingPhaseId = checkoutSession.metadata.pricingPhaseId;

    if (!variantId) {
      return NextResponse.json(
        { error: "Missing variant information" },
        { status: 400 }
      );
    }

    const amountCents = checkoutSession.amount_total ?? 0;
    const paymentIntentId =
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : (checkoutSession.payment_intent?.id ?? null);

    const pricingPhase = pricingPhaseId
      ? await prisma.pricingPhase.findUnique({ where: { id: pricingPhaseId } })
      : null;

    const currency = (pricingPhase?.currency ?? "EUR") as "EUR" | "USD" | "GBP";

    // Upsert registration to CONFIRMED (idempotent)
    const leaderBib = await generateNextBibNumber(eventId);
    const registration = await prisma.registration.upsert({
      where: {
        userId_eventId_variantId_teamMemberIndex: {
          userId: user.id,
          eventId,
          variantId,
          teamMemberIndex: 0,
        },
      },
      create: {
        userId: user.id,
        eventId,
        variantId,
        status: "CONFIRMED",
        bibNumber: leaderBib,
        stripeCheckoutSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId,
        amountCents,
        currency,
      },
      update: {
        status: "CONFIRMED",
        bibNumber: leaderBib,
        stripeCheckoutSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId,
        amountCents,
        currency,
      },
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            distanceKm: true,
            startDate: true,
            startTime: true,
          },
        },
      },
    });

    // Also confirm all team member registrations in the same group
    if (registration.teamGroupId) {
      const teamMembers = await prisma.registration.findMany({
        where: {
          teamGroupId: registration.teamGroupId,
          teamRole: "MEMBER",
          status: "PENDING",
        },
        select: { id: true },
        orderBy: { teamMemberIndex: "asc" },
      });

      // Assign bib numbers to each team member individually
      await assignBibNumbers(
        eventId,
        teamMembers.map((m) => m.id)
      );

      await prisma.registration.updateMany({
        where: {
          teamGroupId: registration.teamGroupId,
          teamRole: "MEMBER",
          status: "PENDING",
        },
        data: {
          status: "CONFIRMED",
        },
      });
    }

    return NextResponse.json({
      registration: {
        id: registration.id,
        status: registration.status,
        variantId: registration.variantId,
        variant: registration.variant,
        amountCents: registration.amountCents,
        currency: registration.currency,
        createdAt: registration.createdAt,
      },
    });
  } catch (error) {
    console.error("Error confirming registration:", error);
    return NextResponse.json(
      { error: "Failed to confirm registration" },
      { status: 500 }
    );
  }
}
