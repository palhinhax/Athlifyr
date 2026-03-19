import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { assignBibNumbers } from "@/lib/bib-number";

// ─── Helper: auto-confirm PENDING via Stripe ─────────────────────────────────

type RegistrationWithVariant = Awaited<
  ReturnType<
    typeof prisma.registration.findFirst<{
      include: {
        variant: {
          select: {
            id: true;
            name: true;
            distanceKm: true;
            startDate: true;
            startTime: true;
          };
        };
      };
    }>
  >
>;

function formatRegistrationResponse(reg: {
  id: string;
  status: string;
  variantId: string | null;
  variant: RegistrationWithVariant extends { variant: infer V } ? V : unknown;
  amountCents: number | null;
  currency: string | null;
  createdAt: Date;
}) {
  return {
    id: reg.id,
    status: reg.status,
    variantId: reg.variantId,
    variant: reg.variant,
    amountCents: reg.amountCents,
    currency: reg.currency,
    createdAt: reg.createdAt,
  };
}

async function tryAutoConfirmRegistration(
  registration: NonNullable<RegistrationWithVariant>
): Promise<NextResponse | null> {
  if (
    registration.status !== "PENDING" ||
    !registration.stripeCheckoutSessionId
  ) {
    return null;
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      registration.stripeCheckoutSessionId
    );

    if (checkoutSession.payment_status === "paid") {
      return confirmPaidRegistration(registration, checkoutSession);
    }

    if (checkoutSession.status === "expired") {
      console.log(
        `Deleting stale PENDING registration ${registration.id} (Stripe session expired)`
      );
      await prisma.registration.delete({
        where: { id: registration.id },
      });
      return NextResponse.json({ registration: null }, { status: 200 });
    }

    // Auto-expire if older than 2 minutes
    const PENDING_EXPIRY_MS = 2 * 60 * 1000;
    const registrationAge =
      Date.now() - new Date(registration.createdAt).getTime();

    if (registrationAge > PENDING_EXPIRY_MS) {
      if (checkoutSession.status === "open") {
        try {
          await stripe.checkout.sessions.expire(
            registration.stripeCheckoutSessionId
          );
        } catch {
          // Ignore — session may already be expired
        }
      }
      console.log(
        `Auto-expiring stale PENDING registration ${registration.id} (older than 2 minutes)`
      );
      await prisma.registration.delete({
        where: { id: registration.id },
      });
      return NextResponse.json({ registration: null }, { status: 200 });
    }
  } catch (stripeError) {
    console.error("Error checking Stripe session:", stripeError);
  }

  return null;
}

async function confirmPaidRegistration(
  registration: NonNullable<RegistrationWithVariant>,
  checkoutSession: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>
): Promise<NextResponse> {
  const paymentIntentId =
    typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : (checkoutSession.payment_intent?.id ?? null);

  // Collect ids that still need a bib (leader + pending members)
  const needsBib: string[] = [];
  if (!registration.bibNumber) needsBib.push(registration.id);

  let memberRegs: { id: string; bibNumber: string | null }[] = [];
  if (registration.teamGroupId) {
    memberRegs = await prisma.registration.findMany({
      where: {
        teamGroupId: registration.teamGroupId,
        teamRole: "MEMBER",
        status: "PENDING",
      },
      select: { id: true, bibNumber: true },
    });
    for (const m of memberRegs) {
      if (!m.bibNumber) needsBib.push(m.id);
    }
  }

  if (needsBib.length > 0) {
    await assignBibNumbers(registration.eventId, needsBib);
  }

  const leaderUpdated = await prisma.registration.findUnique({
    where: { id: registration.id },
    select: { bibNumber: true },
  });

  const updated = await prisma.registration.update({
    where: { id: registration.id },
    data: {
      status: "CONFIRMED",
      bibNumber: leaderUpdated?.bibNumber ?? null,
      stripePaymentIntentId: paymentIntentId,
      amountCents: checkoutSession.amount_total ?? registration.amountCents,
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

  if (memberRegs.length > 0) {
    await prisma.registration.updateMany({
      where: { id: { in: memberRegs.map((m) => m.id) } },
      data: {
        status: "CONFIRMED",
        stripePaymentIntentId: paymentIntentId,
      },
    });
    console.log(
      `Confirmed ${memberRegs.length} MEMBER registration(s) for team group ${registration.teamGroupId}`
    );
  }

  console.log(
    `Auto-confirmed PENDING registration ${updated.id} via Stripe check`
  );

  return NextResponse.json(
    { registration: formatRegistrationResponse(updated) },
    { status: 200 }
  );
}

// GET /api/events/[id]/registration/status — check user's registration status
// If registration is PENDING, automatically verify with Stripe and confirm if paid.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(_request);
    if (!user) {
      return NextResponse.json({ registration: null }, { status: 200 });
    }

    const { id: eventId } = await params;

    // Find any registration for this user + event (any variant)
    const registration = await prisma.registration.findFirst({
      where: {
        userId: user.id,
        eventId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!registration) {
      return NextResponse.json({ registration: null }, { status: 200 });
    }

    // If PENDING, try to auto-confirm by checking Stripe directly
    const autoConfirmResult = await tryAutoConfirmRegistration(registration);
    if (autoConfirmResult) return autoConfirmResult;

    return NextResponse.json(
      { registration: formatRegistrationResponse(registration) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking registration status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
