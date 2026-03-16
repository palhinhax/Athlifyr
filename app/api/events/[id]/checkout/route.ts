import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  validateEventAcceptsRegistrations,
  validateRequiredProfileFields,
  resolveVariant,
  checkExistingRegistration,
  checkVariantCapacity,
  findActivePricingPhase,
  handleFreeRegistration,
  calculateCustomFieldExtras,
  createStripeCheckoutAndRegistration,
} from "@/lib/checkout-helpers";

// POST /api/events/[id]/checkout — create Stripe Checkout Session for event registration
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = (await request.json()) as {
      variantId?: string;
      customFieldAnswers?: { customFieldId: string; value: string }[];
      teamMembers?: {
        name: string;
        email?: string;
        dateOfBirth?: string;
        citizenId?: string;
        phone?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
      }[];
    };
    const { variantId, customFieldAnswers, teamMembers } = body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        variants: {
          include: { pricingPhases: { orderBy: { startDate: "asc" } } },
        },
        pricingPhases: { orderBy: { startDate: "asc" } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const registrationError = validateEventAcceptsRegistrations(event);
    if (registrationError) return registrationError;

    const profileError = await validateRequiredProfileFields(event, user.id);
    if (profileError) return profileError;

    const { variant: selectedVariant, error: variantError } = resolveVariant(
      event,
      variantId
    );
    if (variantError) return variantError;

    if (selectedVariant) {
      const { existing, error: regError } = await checkExistingRegistration(
        user.id,
        event.id,
        selectedVariant.id
      );
      if (regError) return regError;

      const capacityError = await checkVariantCapacity(
        selectedVariant,
        existing?.id
      );
      if (capacityError) return capacityError;
    }

    const activePhase = findActivePricingPhase(
      selectedVariant,
      event.pricingPhases
    );
    if (!activePhase) {
      return NextResponse.json(
        { error: "No active pricing phase found for this event" },
        { status: 400 }
      );
    }

    // Free registrations — no Stripe needed
    if (activePhase.price === 0) {
      if (!selectedVariant) {
        return NextResponse.json(
          { error: "Please select a variant" },
          { status: 400 }
        );
      }
      return handleFreeRegistration(
        user,
        event,
        selectedVariant,
        activePhase,
        teamMembers
      );
    }

    // Paid registrations — Stripe checkout
    const amountCentsPerPerson = Math.round(activePhase.price * 100);
    const teamSize = selectedVariant?.teamSize ?? 1;
    const baseCents = amountCentsPerPerson * teamSize;

    const { extraCents, lineItems: extraLineItems } =
      await calculateCustomFieldExtras(
        event.id,
        activePhase.currency,
        customFieldAnswers
      );

    const totalCents = baseCents + extraCents;

    return createStripeCheckoutAndRegistration(
      user,
      event,
      selectedVariant,
      activePhase,
      extraLineItems,
      totalCents,
      teamMembers
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
