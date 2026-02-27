import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Test-only endpoint for creating / deleting ephemeral event fixtures used
 * by Playwright E2E tests.
 *
 * Only available when NODE_ENV !== 'production'.
 *
 * POST  – creates an event with hasRegistrations=true and one variant that
 *         has an active pricing phase.  Returns { slug, eventId, variantId }.
 *
 * DELETE – removes the event (cascade-deletes variants and registrations).
 *          Expects body: { eventId: string }.
 */

const FIXTURE_TAG = "e2e-test-fixture";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as { titleSuffix?: string };
  const suffix = body.titleSuffix ?? `${Date.now()}`;
  const slug = `e2e-test-event-${suffix}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");

  const now = new Date();
  const phaseStart = new Date(now.getTime() - 24 * 60 * 60 * 1000); // yesterday
  const phaseEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
  const eventStart = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 days

  // Remove any previously-created fixture with this slug (idempotent)
  await prisma.event.deleteMany({ where: { slug } });

  const event = await prisma.event.create({
    data: {
      title: `E2E Test Event ${suffix}`,
      slug,
      description: FIXTURE_TAG,
      startDate: eventStart,
      city: "Test City",
      country: "PT",
      sportTypes: ["RUNNING"],
      hasRegistrations: true,
      stripeOnboardingStatus: "COMPLETE",
      isFeatured: false,
      cancelled: false,
      variants: {
        create: {
          name: "Test Variant 10km",
          distanceKm: 10,
          startDate: eventStart,
          pricingPhases: {
            create: {
              name: "Early Bird",
              startDate: phaseStart,
              endDate: phaseEnd,
              price: 25.0,
              currency: "EUR",
            },
          },
        },
      },
      translations: {
        create: [
          {
            language: "en",
            title: `E2E Test Event ${suffix}`,
            description: FIXTURE_TAG,
            city: "Test City",
          },
          {
            language: "pt",
            title: `E2E Test Event ${suffix}`,
            description: FIXTURE_TAG,
            city: "Test City",
          },
        ],
      },
    },
    include: {
      variants: {
        include: { pricingPhases: true },
      },
    },
  });

  const variant = event.variants[0];

  return NextResponse.json({
    slug: event.slug,
    eventId: event.id,
    variantId: variant.id,
  });
}

export async function DELETE(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as { eventId?: string };

  if (!body.eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  // Safety check: only allow deleting e2e fixture events
  const event = await prisma.event.findUnique({
    where: { id: body.eventId },
    select: { description: true },
  });

  if (!event) {
    return NextResponse.json({ deleted: false, reason: "not found" });
  }

  if (!event.description?.includes(FIXTURE_TAG)) {
    return NextResponse.json(
      { error: "Not a test fixture – deletion refused" },
      { status: 403 }
    );
  }

  await prisma.event.delete({ where: { id: body.eventId } });

  return NextResponse.json({ deleted: true });
}
