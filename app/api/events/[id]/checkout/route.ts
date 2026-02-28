import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { Stripe } from "@/lib/stripe";

// POST /api/events/[id]/checkout — create Stripe Checkout Session for event registration
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
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

    // Load event with Stripe data and pricing
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        variants: {
          include: {
            pricingPhases: {
              orderBy: { startDate: "asc" },
            },
          },
        },
        pricingPhases: {
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

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

    // Validate required registration fields from registrationFieldSettings (Json)
    const fieldSettings =
      (event.registrationFieldSettings as Record<string, string> | null) ?? {};
    const requiredFields = Object.entries(fieldSettings)
      .filter(([, v]) => v === "required")
      .map(([k]) => k);

    if (requiredFields.length > 0) {
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          dateOfBirth: true,
          citizenId: true,
          nationality: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
        },
      });

      const missingFields: string[] = [];
      for (const field of requiredFields) {
        if (field === "dateOfBirth" && !userProfile?.dateOfBirth) {
          missingFields.push("dateOfBirth");
        }
        if (field === "citizenId" && !userProfile?.citizenId) {
          missingFields.push("citizenId");
        }
        if (
          field === "emergencyContact" &&
          (!userProfile?.emergencyContactName ||
            !userProfile?.emergencyContactPhone)
        ) {
          missingFields.push("emergencyContact");
        }
      }

      if (missingFields.length > 0) {
        return NextResponse.json(
          {
            error: "Missing required profile fields",
            missingFields,
          },
          { status: 422 }
        );
      }
    }

    // Determine the variant
    let selectedVariant = event.variants.find((v) => v.id === variantId);
    if (!selectedVariant && event.variants.length === 1) {
      selectedVariant = event.variants[0];
    }
    if (!selectedVariant && event.variants.length > 1) {
      return NextResponse.json(
        { error: "Please select a variant" },
        { status: 400 }
      );
    }

    // Check if already registered (leader / individual — teamMemberIndex 0)
    if (selectedVariant) {
      const existing = await prisma.registration.findUnique({
        where: {
          userId_eventId_variantId_teamMemberIndex: {
            userId: user.id,
            eventId: event.id,
            variantId: selectedVariant.id,
            teamMemberIndex: 0,
          },
        },
      });
      if (existing && existing.status !== "PENDING") {
        return NextResponse.json(
          { error: "Already registered for this variant" },
          { status: 409 }
        );
      }

      // Check variant capacity
      if (selectedVariant.maxParticipants) {
        const confirmedCount = await prisma.registration.count({
          where: {
            variantId: selectedVariant.id,
            status: { in: ["CONFIRMED", "PENDING"] },
            // Exclude the user's own PENDING registration so re-attempts work
            NOT: existing ? { id: existing.id } : undefined,
          },
        });

        if (confirmedCount >= selectedVariant.maxParticipants) {
          return NextResponse.json(
            { error: "This variant is sold out" },
            { status: 409 }
          );
        }
      }
    }

    // Determine price from active pricing phase
    const now = new Date();
    const phases = selectedVariant?.pricingPhases ?? event.pricingPhases;
    const activePhase = phases.find(
      (p) =>
        (!p.startDate || p.startDate <= now) && (!p.endDate || p.endDate >= now)
    );

    if (!activePhase) {
      return NextResponse.json(
        { error: "No active pricing phase found for this event" },
        { status: 400 }
      );
    }

    // Handle free registrations directly (no Stripe required)
    if (activePhase.price === 0) {
      if (!selectedVariant) {
        return NextResponse.json(
          { error: "Please select a variant" },
          { status: 400 }
        );
      }
      const isTeamFree = teamMembers && teamMembers.length > 0;
      const teamGroupIdFree = isTeamFree ? crypto.randomUUID() : undefined;

      const freeReg = await prisma.registration.upsert({
        where: {
          userId_eventId_variantId_teamMemberIndex: {
            userId: user.id,
            eventId: event.id,
            variantId: selectedVariant.id,
            teamMemberIndex: 0,
          },
        },
        create: {
          userId: user.id,
          eventId: event.id,
          variantId: selectedVariant.id,
          status: "CONFIRMED",
          amountCents: 0,
          currency: activePhase.currency as "EUR" | "USD" | "GBP",
          paymentProvider: "NONE",
          teamGroupId: teamGroupIdFree ?? null,
          teamRole: isTeamFree ? "LEADER" : null,
        },
        update: {
          status: "CONFIRMED",
          teamGroupId: teamGroupIdFree ?? null,
          teamRole: isTeamFree ? "LEADER" : null,
        },
      });

      // Create child registrations for team members (free event)
      if (isTeamFree && teamMembers) {
        // Clean up any previous attempt
        await prisma.registration.deleteMany({
          where: {
            eventId: event.id,
            variantId: selectedVariant.id,
            teamGroupId: teamGroupIdFree,
            teamRole: "MEMBER",
          },
        });

        for (let i = 0; i < teamMembers.length; i++) {
          const m = teamMembers[i];
          await prisma.registration.create({
            data: {
              userId: user.id,
              eventId: event.id,
              variantId: selectedVariant.id,
              status: "CONFIRMED",
              amountCents: 0,
              currency: activePhase.currency as "EUR" | "USD" | "GBP",
              paymentProvider: "NONE",
              teamGroupId: teamGroupIdFree!,
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
        }
      }

      return NextResponse.json(
        { registrationId: freeReg.id, status: "CONFIRMED" },
        { status: 201 }
      );
    }

    if (!event.stripeAccountId || event.stripeOnboardingStatus !== "COMPLETE") {
      return NextResponse.json(
        { error: "Event Stripe account is not fully configured" },
        { status: 400 }
      );
    }

    const amountCentsPerPerson = Math.round(activePhase.price * 100);
    const teamSize = selectedVariant?.teamSize ?? 1;
    const amountCents = amountCentsPerPerson * teamSize;

    // ── Custom field extras ─────────────────────────────────────────────────
    // Look up custom fields that have a price and the user selected "true" / a value
    // Each answer may have a participantIndex — we charge per answer, not per unique field
    let customFieldExtraCents = 0;
    const extraLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (customFieldAnswers && customFieldAnswers.length > 0) {
      const fieldIds = [
        ...new Set(customFieldAnswers.map((a) => a.customFieldId)),
      ];
      const customFields = await prisma.eventCustomField.findMany({
        where: {
          id: { in: fieldIds },
          eventId: event.id,
          priceCents: { gt: 0 },
        },
      });

      const fieldMap = new Map(customFields.map((f) => [f.id, f]));

      for (const answer of customFieldAnswers) {
        const field = fieldMap.get(answer.customFieldId);
        if (!field) continue;

        // For BOOLEAN fields, only charge if the user said "true"
        // For SELECT fields, any non-empty selection means the extra applies
        const shouldCharge =
          field.type === "BOOLEAN"
            ? answer.value === "true"
            : answer.value.trim().length > 0;

        if (shouldCharge) {
          customFieldExtraCents += field.priceCents;
          extraLineItems.push({
            quantity: 1,
            price_data: {
              currency: activePhase.currency.toLowerCase(),
              unit_amount: field.priceCents,
              product_data: {
                name: field.label,
                ...(field.type === "SELECT"
                  ? { description: answer.value }
                  : {}),
              },
            },
          });
        }
      }
    }

    const totalCents = amountCents + customFieldExtraCents;
    const commissionCents = Math.round(
      totalCents * (event.commissionPercent / 100)
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/events/${event.slug}?registration=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/events/${event.slug}?registration=cancelled`;

    // Create a PENDING Registration before redirecting to Stripe
    // (will be updated with stripeCheckoutSessionId after session creation)

    // Create Stripe Checkout Session with destination charge
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            quantity: teamSize,
            price_data: {
              currency: activePhase.currency.toLowerCase(),
              unit_amount: amountCentsPerPerson,
              product_data: {
                name: selectedVariant
                  ? `${event.title} — ${selectedVariant.name}`
                  : event.title,
                description: activePhase.name ?? undefined,
                metadata: {
                  eventId: event.id,
                  variantId: selectedVariant?.id ?? "",
                },
              },
            },
          },
          ...extraLineItems,
        ],
        payment_intent_data: {
          application_fee_amount: commissionCents,
          transfer_data: {
            destination: event.stripeAccountId,
          },
          metadata: {
            eventId: event.id,
            variantId: selectedVariant?.id ?? "",
            userId: user.id,
            pricingPhaseId: activePhase.id,
          },
        },
        customer_email: user.email ?? undefined,
        metadata: {
          eventId: event.id,
          variantId: selectedVariant?.id ?? "",
          userId: user.id,
          pricingPhaseId: activePhase.id,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      }
      // Perform request on behalf of the connected account is NOT needed for destination charges
      // The platform account creates the session, and the transfer goes to the connected account
    );

    // Create PENDING Registration with stripeCheckoutSessionId so
    // the status endpoint can auto-confirm by checking Stripe directly
    let registrationId: string | undefined;
    if (selectedVariant) {
      // For team variants, generate a shared teamGroupId
      const isTeam = teamMembers && teamMembers.length > 0;
      const teamGroupId = isTeam ? crypto.randomUUID() : undefined;

      const reg = await prisma.registration.upsert({
        where: {
          userId_eventId_variantId_teamMemberIndex: {
            userId: user.id,
            eventId: event.id,
            variantId: selectedVariant.id,
            teamMemberIndex: 0,
          },
        },
        create: {
          userId: user.id,
          eventId: event.id,
          variantId: selectedVariant.id,
          status: "PENDING",
          amountCents: totalCents,
          currency: activePhase.currency as "EUR" | "USD" | "GBP",
          stripeCheckoutSessionId: session.id,
          teamGroupId: teamGroupId ?? null,
          teamRole: isTeam ? "LEADER" : null,
        },
        update: {
          status: "PENDING",
          amountCents: totalCents,
          currency: activePhase.currency as "EUR" | "USD" | "GBP",
          stripeCheckoutSessionId: session.id,
          teamGroupId: teamGroupId ?? null,
          teamRole: isTeam ? "LEADER" : null,
        },
      });
      registrationId = reg.id;

      // Create child Registration records for each team member
      if (isTeam && teamMembers && registrationId) {
        // Delete any existing PENDING team member registrations from a previous attempt
        await prisma.registration.deleteMany({
          where: {
            eventId: event.id,
            variantId: selectedVariant.id,
            teamGroupId: teamGroupId,
            teamRole: "MEMBER",
            status: "PENDING",
          },
        });

        for (let i = 0; i < teamMembers.length; i++) {
          const m = teamMembers[i];
          await prisma.registration.create({
            data: {
              userId: user.id, // Leader's userId — team members share the payer
              eventId: event.id,
              variantId: selectedVariant.id,
              status: "PENDING",
              amountCents: 0, // Only the leader registration holds the total amount
              currency: activePhase.currency as "EUR" | "USD" | "GBP",
              paymentProvider: "NONE",
              stripeCheckoutSessionId: session.id,
              teamGroupId: teamGroupId!,
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
        }
      }
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      registrationId,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
