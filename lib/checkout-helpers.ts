import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { Stripe } from "@/lib/stripe";
import { assignBibNumbers } from "@/lib/bib-number";
import type { AuthenticatedUser } from "@/lib/auth-helpers";

// ── Types ───────────────────────────────────────────────────────────────────

interface PricingPhase {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  price: number;
  currency: string;
  name: string | null;
}

interface EventVariant {
  id: string;
  name: string;
  maxParticipants: number | null;
  teamSize: number | null;
  pricingPhases: PricingPhase[];
}

interface CheckoutEvent {
  id: string;
  title: string;
  slug: string;
  hasRegistrations: boolean;
  cancelled: boolean;
  registrationDeadline: Date | null;
  registrationFieldSettings: unknown;
  stripeAccountId: string | null;
  stripeOnboardingStatus: string | null;
  commissionPercent: number;
  variants: EventVariant[];
  pricingPhases: PricingPhase[];
}

interface TeamMember {
  name: string;
  email?: string;
  dateOfBirth?: string;
  citizenId?: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

interface CustomFieldAnswer {
  customFieldId: string;
  value: string;
}

// ── Validation helpers ──────────────────────────────────────────────────────

export function validateEventAcceptsRegistrations(
  event: CheckoutEvent
): NextResponse | null {
  if (!event.hasRegistrations) {
    return NextResponse.json(
      { error: "This event is not accepting registrations" },
      { status: 400 }
    );
  }
  if (event.cancelled) {
    return NextResponse.json(
      { error: "This event has been cancelled" },
      { status: 409 }
    );
  }
  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    return NextResponse.json(
      { error: "Registration deadline has passed" },
      { status: 409 }
    );
  }
  return null;
}

export async function validateRequiredProfileFields(
  event: CheckoutEvent,
  userId: string
): Promise<NextResponse | null> {
  const fieldSettings =
    (event.registrationFieldSettings as Record<string, string> | null) ?? {};
  const requiredFields = Object.entries(fieldSettings)
    .filter(([, v]) => v === "required")
    .map(([k]) => k);

  if (requiredFields.length === 0) return null;

  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dateOfBirth: true,
      citizenId: true,
      nationality: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
    },
  });

  const fieldChecks: Record<string, boolean> = {
    dateOfBirth: !userProfile?.dateOfBirth,
    citizenId: !userProfile?.citizenId,
    emergencyContact:
      !userProfile?.emergencyContactName || !userProfile?.emergencyContactPhone,
  };

  const missingFields = requiredFields.filter((f) => fieldChecks[f]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: "Missing required profile fields", missingFields },
      { status: 422 }
    );
  }
  return null;
}

export function resolveVariant(
  event: CheckoutEvent,
  variantId?: string
): { variant: EventVariant | undefined; error?: NextResponse } {
  let variant = event.variants.find((v) => v.id === variantId);
  if (!variant && event.variants.length === 1) {
    variant = event.variants[0];
  }
  if (!variant && event.variants.length > 1) {
    return {
      variant: undefined,
      error: NextResponse.json(
        { error: "Please select a variant" },
        { status: 400 }
      ),
    };
  }
  return { variant };
}

export async function checkExistingRegistration(
  userId: string,
  eventId: string,
  variantId: string
): Promise<{
  existing: { id: string; status: string } | null;
  error?: NextResponse;
}> {
  const existing = await prisma.registration.findUnique({
    where: {
      userId_eventId_variantId_teamMemberIndex: {
        userId,
        eventId,
        variantId,
        teamMemberIndex: 0,
      },
    },
  });

  if (existing && existing.status !== "PENDING") {
    return {
      existing,
      error: NextResponse.json(
        { error: "Already registered for this variant" },
        { status: 409 }
      ),
    };
  }

  return { existing };
}

export async function checkVariantCapacity(
  variant: EventVariant,
  existingRegId?: string
): Promise<NextResponse | null> {
  if (!variant.maxParticipants) return null;

  const confirmedCount = await prisma.registration.count({
    where: {
      variantId: variant.id,
      status: { in: ["CONFIRMED", "PENDING"] },
      NOT: existingRegId ? { id: existingRegId } : undefined,
    },
  });

  if (confirmedCount >= variant.maxParticipants) {
    return NextResponse.json(
      { error: "This variant is sold out" },
      { status: 409 }
    );
  }
  return null;
}

export function findActivePricingPhase(
  variant: EventVariant | undefined,
  eventPhases: PricingPhase[]
): PricingPhase | undefined {
  const now = new Date();
  const phases = variant?.pricingPhases ?? eventPhases;
  return phases.find(
    (p) =>
      (!p.startDate || p.startDate <= now) && (!p.endDate || p.endDate >= now)
  );
}

// ── Free registration ───────────────────────────────────────────────────────

export async function handleFreeRegistration(
  user: AuthenticatedUser,
  event: CheckoutEvent,
  variant: EventVariant,
  activePhase: PricingPhase,
  teamMembers?: TeamMember[]
): Promise<NextResponse> {
  const isTeam = teamMembers && teamMembers.length > 0;
  const teamGroupId = isTeam ? crypto.randomUUID() : undefined;
  const currency = activePhase.currency as "EUR" | "USD" | "GBP";

  const freeReg = await prisma.registration.upsert({
    where: {
      userId_eventId_variantId_teamMemberIndex: {
        userId: user.id,
        eventId: event.id,
        variantId: variant.id,
        teamMemberIndex: 0,
      },
    },
    create: {
      userId: user.id,
      eventId: event.id,
      variantId: variant.id,
      status: "CONFIRMED",
      bibNumber: null,
      amountCents: 0,
      currency,
      paymentProvider: "NONE",
      teamGroupId: teamGroupId ?? null,
      teamRole: isTeam ? "LEADER" : null,
    },
    update: {
      status: "CONFIRMED",
      bibNumber: null,
      teamGroupId: teamGroupId ?? null,
      teamRole: isTeam ? "LEADER" : null,
    },
  });

  const memberIds = isTeam
    ? await createTeamMemberRegistrations(
        user.id,
        event.id,
        variant.id,
        teamGroupId!,
        currency,
        "CONFIRMED",
        null,
        teamMembers!
      )
    : [];

  await assignBibNumbers(event.id, [freeReg.id, ...memberIds]);

  return NextResponse.json(
    { registrationId: freeReg.id, status: "CONFIRMED" },
    { status: 201 }
  );
}

// ── Custom field extras ─────────────────────────────────────────────────────

export async function calculateCustomFieldExtras(
  eventId: string,
  currency: string,
  customFieldAnswers?: CustomFieldAnswer[]
): Promise<{
  extraCents: number;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
}> {
  if (!customFieldAnswers || customFieldAnswers.length === 0) {
    return { extraCents: 0, lineItems: [] };
  }

  const fieldIds = [...new Set(customFieldAnswers.map((a) => a.customFieldId))];
  const customFields = await prisma.eventCustomField.findMany({
    where: { id: { in: fieldIds }, eventId, priceCents: { gt: 0 } },
  });

  const fieldMap = new Map(customFields.map((f) => [f.id, f]));
  let extraCents = 0;
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const answer of customFieldAnswers) {
    const field = fieldMap.get(answer.customFieldId);
    if (!field) continue;

    const shouldCharge =
      field.type === "BOOLEAN"
        ? answer.value === "true"
        : answer.value.trim().length > 0;

    if (shouldCharge) {
      extraCents += field.priceCents;
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: field.priceCents,
          product_data: {
            name: field.label,
            ...(field.type === "SELECT" ? { description: answer.value } : {}),
          },
        },
      });
    }
  }

  return { extraCents, lineItems };
}

// ── Stripe session + registration ───────────────────────────────────────────

export async function createStripeCheckoutAndRegistration(
  user: AuthenticatedUser,
  event: CheckoutEvent,
  variant: EventVariant | undefined,
  activePhase: PricingPhase,
  extraLineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  totalCents: number,
  teamMembers?: TeamMember[]
): Promise<NextResponse> {
  if (!event.stripeAccountId || event.stripeOnboardingStatus !== "COMPLETE") {
    return NextResponse.json(
      { error: "Event Stripe account is not fully configured" },
      { status: 400 }
    );
  }

  const amountCentsPerPerson = Math.round(activePhase.price * 100);
  const teamSize = variant?.teamSize ?? 1;
  const commissionCents = Math.round(
    totalCents * (event.commissionPercent / 100)
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const successUrl = `${baseUrl}/events/${event.slug}?registration=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/events/${event.slug}?registration=cancelled`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: teamSize,
        price_data: {
          currency: activePhase.currency.toLowerCase(),
          unit_amount: amountCentsPerPerson,
          product_data: {
            name: variant ? `${event.title} — ${variant.name}` : event.title,
            description: activePhase.name ?? undefined,
            metadata: {
              eventId: event.id,
              variantId: variant?.id ?? "",
            },
          },
        },
      },
      ...extraLineItems,
    ],
    payment_intent_data: {
      application_fee_amount: commissionCents,
      transfer_data: { destination: event.stripeAccountId },
      metadata: {
        eventId: event.id,
        variantId: variant?.id ?? "",
        userId: user.id,
        pricingPhaseId: activePhase.id,
      },
    },
    customer_email: user.email ?? undefined,
    metadata: {
      eventId: event.id,
      variantId: variant?.id ?? "",
      userId: user.id,
      pricingPhaseId: activePhase.id,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  let registrationId: string | undefined;

  if (variant) {
    const isTeam = teamMembers && teamMembers.length > 0;
    const teamGroupId = isTeam ? crypto.randomUUID() : undefined;
    const currency = activePhase.currency as "EUR" | "USD" | "GBP";

    const reg = await prisma.registration.upsert({
      where: {
        userId_eventId_variantId_teamMemberIndex: {
          userId: user.id,
          eventId: event.id,
          variantId: variant.id,
          teamMemberIndex: 0,
        },
      },
      create: {
        userId: user.id,
        eventId: event.id,
        variantId: variant.id,
        status: "PENDING",
        amountCents: totalCents,
        currency,
        stripeCheckoutSessionId: session.id,
        teamGroupId: teamGroupId ?? null,
        teamRole: isTeam ? "LEADER" : null,
      },
      update: {
        status: "PENDING",
        amountCents: totalCents,
        currency,
        stripeCheckoutSessionId: session.id,
        teamGroupId: teamGroupId ?? null,
        teamRole: isTeam ? "LEADER" : null,
      },
    });
    registrationId = reg.id;

    if (isTeam && teamMembers) {
      await prisma.registration.deleteMany({
        where: {
          eventId: event.id,
          variantId: variant.id,
          teamGroupId,
          teamRole: "MEMBER",
          status: "PENDING",
        },
      });

      await createTeamMemberRegistrations(
        user.id,
        event.id,
        variant.id,
        teamGroupId!,
        currency,
        "PENDING",
        session.id,
        teamMembers
      );
    }
  }

  return NextResponse.json({
    url: session.url,
    sessionId: session.id,
    registrationId,
  });
}

// ── Team member helper ──────────────────────────────────────────────────────

async function createTeamMemberRegistrations(
  userId: string,
  eventId: string,
  variantId: string,
  teamGroupId: string,
  currency: "EUR" | "USD" | "GBP",
  status: "CONFIRMED" | "PENDING",
  stripeCheckoutSessionId: string | null,
  teamMembers: TeamMember[]
): Promise<string[]> {
  const memberIds: string[] = [];

  for (let i = 0; i < teamMembers.length; i++) {
    const m = teamMembers[i];
    const memberReg = await prisma.registration.create({
      data: {
        userId,
        eventId,
        variantId,
        status,
        bibNumber: null,
        amountCents: 0,
        currency,
        paymentProvider: "NONE",
        stripeCheckoutSessionId,
        teamGroupId,
        teamRole: "MEMBER",
        teamMemberIndex: i + 1,
        guestName: m.name,
        guestEmail: m.email || null,
        guestPhone: m.phone || null,
        guestDateOfBirth: m.dateOfBirth ? new Date(m.dateOfBirth) : null,
        guestCitizenId: m.citizenId || null,
        guestEmergencyContactName: m.emergencyContactName || null,
        guestEmergencyContactPhone: m.emergencyContactPhone || null,
      },
    });
    memberIds.push(memberReg.id);
  }

  return memberIds;
}
