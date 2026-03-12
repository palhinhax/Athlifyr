import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Event, EventVariant, Language } from "@prisma/client";
import {
  notifyEventDateChange,
  notifyEventCancelled,
} from "@/lib/notifications";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface TranslationInput {
  language: Language;
  title: string;
  description: string;
  city?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface VariantTranslationInput {
  language: Language;
  name: string;
  description?: string;
}

interface VariantInput {
  id?: string;
  name: string;
  distanceKm?: number;
  elevationGainM?: number;
  price?: number;
  maxParticipants?: number | null;
  teamSize?: number;
  startDate?: string;
  startTime?: string;
  translations?: VariantTranslationInput[];
}

interface EventUpdateBody {
  title?: string;
  description?: string;
  sportTypes?: string[];
  startDate?: string;
  endDate?: string | null;
  city?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
  stravaRouteEmbed?: string | null;
  featuredVenueId?: string | null;
  variants?: VariantInput[];
  translations?: TranslationInput[];
  cancelled?: boolean;
  cancellationReason?: string;
  hasRegistrations?: boolean;
  isFeatured?: boolean;
  hasLiveRace?: boolean;
  commissionPercent?: number;
  refundDeadline?: string | null;
  checkInOpensAt?: string | null;
  checkInClosesAt?: string | null;
  registrationFieldSettings?: Record<string, unknown>;
}

// --- Helper: Handle event translations ---

async function handleTranslations(
  eventId: string,
  translations: TranslationInput[]
) {
  const existingTranslations = await prisma.eventTranslation.findMany({
    where: { eventId },
  });

  const existingMap = new Map(existingTranslations.map((t) => [t.language, t]));

  for (const t of translations) {
    const existing = existingMap.get(t.language);

    if (!t.title?.trim() && !t.description?.trim()) {
      if (existing) {
        await prisma.eventTranslation.delete({
          where: { id: existing.id },
        });
      }
      continue;
    }

    const hasChanged =
      !existing ||
      existing.title !== (t.title || "") ||
      existing.description !== (t.description || "") ||
      existing.city !== (t.city || null) ||
      existing.metaTitle !== (t.metaTitle || null) ||
      existing.metaDescription !== (t.metaDescription || null);

    if (hasChanged) {
      await prisma.eventTranslation.upsert({
        where: {
          eventId_language: {
            eventId: eventId,
            language: t.language,
          },
        },
        update: {
          title: t.title || "",
          description: t.description || "",
          city: t.city || null,
          metaTitle: t.metaTitle || null,
          metaDescription: t.metaDescription || null,
        },
        create: {
          eventId: eventId,
          language: t.language,
          title: t.title || "",
          description: t.description || "",
          city: t.city || null,
          metaTitle: t.metaTitle || null,
          metaDescription: t.metaDescription || null,
        },
      });
    }
  }
}

// --- Helper: Generate slug from title ---

async function generateSlug(
  title: string | undefined,
  existingEvent: Event,
  eventId: string
): Promise<string> {
  if (!title || title === existingEvent.title) {
    return existingEvent.slug;
  }

  let slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const existingSlug = await prisma.event.findFirst({
    where: { slug, id: { not: eventId } },
  });

  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
}

// --- Helper: Build event update data ---

function buildEventUpdateData(
  body: EventUpdateBody,
  slug: string,
  isAdmin: boolean
): Record<string, unknown> {
  const {
    title,
    description,
    sportTypes,
    startDate,
    endDate,
    city,
    country,
    latitude,
    longitude,
    googleMapsUrl,
    imageUrl,
    externalUrl,
    stravaRouteEmbed,
    featuredVenueId,
    cancelled,
    cancellationReason,
    hasRegistrations,
    isFeatured,
    hasLiveRace,
    commissionPercent,
    refundDeadline,
    checkInOpensAt,
    checkInClosesAt,
    registrationFieldSettings,
  } = body;

  return {
    ...(title && { title, slug }),
    ...(description !== undefined && { description }),
    ...(sportTypes && Array.isArray(sportTypes) && { sportTypes }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate !== undefined && {
      endDate: endDate ? new Date(endDate) : null,
    }),
    ...(city && { city }),
    ...(country && { country }),
    ...(latitude !== undefined && { latitude: latitude || null }),
    ...(longitude !== undefined && { longitude: longitude || null }),
    ...(googleMapsUrl !== undefined && {
      googleMapsUrl: googleMapsUrl || null,
    }),
    ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
    ...(externalUrl !== undefined && { externalUrl: externalUrl || null }),
    ...(stravaRouteEmbed !== undefined && {
      stravaRouteEmbed: stravaRouteEmbed || null,
    }),
    ...(featuredVenueId !== undefined && {
      featuredVenueId: featuredVenueId || null,
    }),
    ...(hasRegistrations !== undefined && { hasRegistrations }),
    ...(isFeatured !== undefined && isAdmin && { isFeatured }),
    ...(cancelled !== undefined && isAdmin && { cancelled }),
    ...(cancelled === true && isAdmin && { cancelledAt: new Date() }),
    ...(cancellationReason !== undefined && isAdmin && { cancellationReason }),
    ...(hasLiveRace !== undefined && isAdmin && { hasLiveRace }),
    ...(commissionPercent !== undefined && isAdmin && { commissionPercent }),
    ...(refundDeadline !== undefined && {
      refundDeadline: refundDeadline ? new Date(refundDeadline) : null,
    }),
    ...(checkInOpensAt !== undefined && {
      checkInOpensAt: checkInOpensAt ? new Date(checkInOpensAt) : null,
    }),
    ...(checkInClosesAt !== undefined && {
      checkInClosesAt: checkInClosesAt ? new Date(checkInClosesAt) : null,
    }),
    ...(registrationFieldSettings !== undefined && {
      registrationFieldSettings,
    }),
  };
}

// --- Helper: Handle cancellation notification ---

async function handleCancellationNotification(
  eventId: string,
  updatedEvent: Event & { variants: EventVariant[] },
  cancellationReason?: string
) {
  await prisma.participation.deleteMany({
    where: { eventId },
  });

  notifyEventCancelled({
    eventId,
    eventTitle: updatedEvent.title,
    eventSlug: updatedEvent.slug,
    cancellationReason: cancellationReason || undefined,
  }).catch((error) => {
    console.error("Error sending event cancellation notification:", error);
  });
}

// --- Helper: Handle date change notification ---

function handleDateChangeNotification(
  eventId: string,
  updatedEvent: Event & { variants: EventVariant[] },
  existingStartDate: Date,
  newStartDateStr: string
) {
  const oldDate = new Date(existingStartDate);
  const newDate = new Date(newStartDateStr);

  const dateChanged =
    oldDate.toISOString().split("T")[0] !== newDate.toISOString().split("T")[0];

  if (dateChanged) {
    notifyEventDateChange({
      eventId,
      eventTitle: updatedEvent.title,
      eventSlug: updatedEvent.slug,
      oldDate,
      newDate,
    }).catch((error) => {
      console.error("Error sending event date change notification:", error);
    });
  }
}

// --- Helper: Build variant data object ---

function buildVariantData(v: VariantInput) {
  return {
    name: v.name,
    distanceKm: v.distanceKm || null,
    elevationGainM: v.elevationGainM || null,
    price: v.price || null,
    maxParticipants: v.maxParticipants ?? null,
    teamSize: v.teamSize ?? 1,
    startDate: v.startDate ? new Date(v.startDate) : null,
    startTime: v.startTime || null,
  };
}

// --- Helper: Check if variant has changed ---

function hasVariantChanged(existing: EventVariant, v: VariantInput): boolean {
  return (
    existing.name !== v.name ||
    existing.distanceKm !== (v.distanceKm || null) ||
    existing.elevationGainM !== (v.elevationGainM || null) ||
    existing.price !== (v.price || null) ||
    existing.maxParticipants !== (v.maxParticipants ?? null) ||
    existing.teamSize !== (v.teamSize ?? 1) ||
    (v.startDate !== undefined &&
      existing.startDate?.getTime() !== new Date(v.startDate).getTime()) ||
    existing.startTime !== (v.startTime || null)
  );
}

// --- Helper: Upsert a single variant ---

async function upsertVariant(
  eventId: string,
  v: VariantInput
): Promise<EventVariant | null> {
  if (!v.id) {
    return prisma.eventVariant.create({
      data: { eventId, ...buildVariantData(v) },
    });
  }

  const existingVariant = await prisma.eventVariant.findUnique({
    where: { id: v.id },
  });

  if (!existingVariant) {
    return null;
  }

  if (hasVariantChanged(existingVariant, v)) {
    return prisma.eventVariant.update({
      where: { id: v.id },
      data: buildVariantData(v),
    });
  }

  return existingVariant;
}

// --- Helper: Handle variant translations ---

async function handleVariantTranslations(
  variantId: string,
  translations: VariantTranslationInput[]
) {
  const existingVarTranslations = await prisma.eventVariantTranslation.findMany(
    {
      where: { variantId },
    }
  );

  const existingVarMap = new Map(
    existingVarTranslations.map((t) => [t.language, t])
  );

  for (const t of translations) {
    if (!t.name?.trim() && !t.description?.trim()) {
      continue;
    }

    const existing = existingVarMap.get(t.language);
    const hasChanged =
      !existing ||
      existing.name !== (t.name || "") ||
      existing.description !== (t.description || null);

    if (hasChanged) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId,
            language: t.language,
          },
        },
        update: {
          name: t.name || "",
          description: t.description || null,
        },
        create: {
          variantId,
          language: t.language,
          name: t.name || "",
          description: t.description || null,
        },
      });
    }
  }
}

// --- Helper: Handle all variants for an event ---

async function handleVariants(eventId: string, variants: VariantInput[]) {
  const existingVariants = await prisma.eventVariant.findMany({
    where: { eventId },
    select: { id: true },
  });

  const variantIdsInRequest = variants
    .filter((v) => v.id)
    .map((v) => v.id as string);

  const variantsToDelete = existingVariants
    .filter((v) => !variantIdsInRequest.includes(v.id))
    .map((v) => v.id);

  if (variantsToDelete.length > 0) {
    await prisma.eventVariant.deleteMany({
      where: { id: { in: variantsToDelete } },
    });
  }

  for (const v of variants) {
    const variant = await upsertVariant(eventId, v);

    if (!variant) {
      continue;
    }

    if (v.translations && Array.isArray(v.translations)) {
      await handleVariantTranslations(variant.id, v.translations);
    }
  }
}

// --- Helper: Authorize user for event update ---

async function authorizeEventUpdate(
  request: NextRequest,
  eventId: string
): Promise<
  | { authorized: true; isAdmin: boolean }
  | { authorized: false; response: NextResponse }
> {
  const user = await getAuthenticatedUser(request);

  if (!user?.id) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const isAdmin = user.role === "ADMIN";

  if (!isAdmin) {
    const organizer = await prisma.eventOrganizer.findFirst({
      where: { eventId, userId: user.id },
    });
    if (!organizer) {
      return {
        authorized: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }
  }

  return { authorized: true, isAdmin };
}

// GET - Get event by ID or slug
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const isCuid = /^c[a-z0-9]{20,30}$/i.test(id);

    const event = await prisma.event.findFirst({
      where: isCuid ? { id } : { slug: id },
      include: {
        variants: {
          include: {
            triathlonSegments: {
              orderBy: { order: "asc" },
            },
            pricingPhases: {
              orderBy: { startDate: "asc" },
            },
            _count: {
              select: {
                registrations: {
                  where: { status: "CONFIRMED" },
                },
              },
            },
          },
          orderBy: { startDate: "asc" },
        },
        faqs: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH - Update event (admin or organizer)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const auth = await authorizeEventUpdate(request, id);
    if (!auth.authorized) {
      return auth.response;
    }

    const body: EventUpdateBody = await request.json();

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const slug = await generateSlug(body.title, existingEvent, id);
    const updateData = buildEventUpdateData(body, slug, auth.isAdmin);

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
      include: { variants: true },
    });

    const isBeingCancelled =
      auth.isAdmin && body.cancelled === true && !existingEvent.cancelled;

    if (isBeingCancelled) {
      await handleCancellationNotification(
        id,
        updatedEvent,
        body.cancellationReason
      );
    }

    if (body.startDate && existingEvent.startDate) {
      handleDateChangeNotification(
        id,
        updatedEvent,
        existingEvent.startDate,
        body.startDate
      );
    }

    const hasVariantUpdates = body.variants && Array.isArray(body.variants);

    if (hasVariantUpdates) {
      await handleVariants(id, body.variants!);
    }

    if (body.translations && Array.isArray(body.translations)) {
      await handleTranslations(id, body.translations);
    }

    if (hasVariantUpdates) {
      const refreshedEvent = await prisma.event.findUnique({
        where: { id },
        include: { variants: true },
      });
      return NextResponse.json(refreshedEvent);
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
