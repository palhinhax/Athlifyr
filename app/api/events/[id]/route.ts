import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Language, Prisma, SportType } from "@prisma/client";
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

interface PatchBody {
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
  cancellationReason?: string | null;
  hasRegistrations?: boolean;
  isFeatured?: boolean;
  hasLiveRace?: boolean;
  commissionPercent?: number | null;
  refundDeadline?: string | null;
  checkInOpensAt?: string | null;
  checkInClosesAt?: string | null;
  registrationFieldSettings?: Prisma.InputJsonValue;
}

// --- Slug helpers ---

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(
  title: string,
  excludeId: string
): Promise<string> {
  const slug = slugify(title);
  const existing = await prisma.event.findFirst({
    where: { slug, id: { not: excludeId } },
  });
  return existing ? `${slug}-${Date.now()}` : slug;
}

// --- Translation helpers ---

async function handleTranslations(
  eventId: string,
  translations: TranslationInput[]
) {
  const existing = await prisma.eventTranslation.findMany({
    where: { eventId },
  });
  const existingMap = new Map(existing.map((t) => [t.language, t]));

  for (const t of translations) {
    const prev = existingMap.get(t.language);
    const hasContent = Boolean(t.title?.trim() || t.description?.trim());

    if (!hasContent) {
      if (prev) {
        await prisma.eventTranslation.delete({ where: { id: prev.id } });
      }
      continue;
    }

    const changed =
      !prev ||
      prev.title !== (t.title || "") ||
      prev.description !== (t.description || "") ||
      prev.city !== (t.city || null) ||
      prev.metaTitle !== (t.metaTitle || null) ||
      prev.metaDescription !== (t.metaDescription || null);

    if (!changed) continue;

    const data = {
      title: t.title || "",
      description: t.description || "",
      city: t.city || null,
      metaTitle: t.metaTitle || null,
      metaDescription: t.metaDescription || null,
    };

    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId, language: t.language } },
      update: data,
      create: { eventId, language: t.language, ...data },
    });
  }
}

async function upsertVariantTranslations(
  variantId: string,
  translations: VariantTranslationInput[]
) {
  const existing = await prisma.eventVariantTranslation.findMany({
    where: { variantId },
  });
  const existingMap = new Map(existing.map((t) => [t.language, t]));

  for (const t of translations) {
    if (!t.name?.trim() && !t.description?.trim()) continue;

    const prev = existingMap.get(t.language);
    const changed =
      !prev ||
      prev.name !== (t.name || "") ||
      prev.description !== (t.description || null);

    if (!changed) continue;

    await prisma.eventVariantTranslation.upsert({
      where: { variantId_language: { variantId, language: t.language } },
      update: { name: t.name || "", description: t.description || null },
      create: {
        variantId,
        language: t.language,
        name: t.name || "",
        description: t.description || null,
      },
    });
  }
}

// --- Variant helpers ---

function buildVariantData(variant: VariantInput) {
  return {
    name: variant.name,
    distanceKm: variant.distanceKm || null,
    elevationGainM: variant.elevationGainM || null,
    price: variant.price || null,
    maxParticipants: variant.maxParticipants ?? null,
    teamSize: variant.teamSize ?? 1,
    startDate: variant.startDate ? new Date(variant.startDate) : null,
    startTime: variant.startTime || null,
  };
}

function hasVariantChanged(
  existing: {
    name: string;
    distanceKm: number | null;
    elevationGainM: number | null;
    price: number | null;
    maxParticipants: number | null;
    teamSize: number;
    startDate: Date | null;
    startTime: string | null;
  },
  v: VariantInput
): boolean {
  return (
    existing.name !== v.name ||
    existing.distanceKm !== (v.distanceKm || null) ||
    existing.elevationGainM !== (v.elevationGainM || null) ||
    existing.price !== (v.price || null) ||
    existing.maxParticipants !== (v.maxParticipants ?? null) ||
    existing.teamSize !== (v.teamSize ?? 1) ||
    (v.startDate
      ? existing.startDate?.getTime() !== new Date(v.startDate).getTime()
      : existing.startDate !== null) ||
    existing.startTime !== (v.startTime || null)
  );
}

async function upsertVariant(
  eventId: string,
  v: VariantInput
): Promise<{ id: string } | null> {
  if (!v.id) {
    return prisma.eventVariant.create({
      data: { eventId, ...buildVariantData(v) },
    });
  }

  const existing = await prisma.eventVariant.findUnique({
    where: { id: v.id },
  });
  if (!existing) return null;

  if (!hasVariantChanged(existing, v)) return existing;

  return prisma.eventVariant.update({
    where: { id: v.id },
    data: buildVariantData(v),
  });
}

async function deleteRemovedVariants(
  eventId: string,
  variants: VariantInput[]
) {
  const existing = await prisma.eventVariant.findMany({
    where: { eventId },
    select: { id: true },
  });

  const keepIds = new Set(
    variants.filter((v) => v.id).map((v) => v.id as string)
  );
  const removeIds = existing.filter((v) => !keepIds.has(v.id)).map((v) => v.id);

  if (removeIds.length > 0) {
    await prisma.eventVariant.deleteMany({
      where: { id: { in: removeIds } },
    });
  }
}

async function syncVariants(eventId: string, variants: VariantInput[]) {
  await deleteRemovedVariants(eventId, variants);

  for (const v of variants) {
    const saved = await upsertVariant(eventId, v);
    if (saved && v.translations?.length) {
      await upsertVariantTranslations(saved.id, v.translations);
    }
  }
}

// --- Event update data builder ---

function buildEventUpdateData(
  body: PatchBody,
  existingTitle: string,
  slug: string,
  isAdmin: boolean
): Prisma.EventUncheckedUpdateInput {
  const data: Prisma.EventUncheckedUpdateInput = {};

  if (body.title) {
    data.title = body.title;
    if (body.title !== existingTitle) data.slug = slug;
  }
  if (body.description !== undefined) data.description = body.description;
  if (body.sportTypes && Array.isArray(body.sportTypes))
    data.sportTypes = body.sportTypes as SportType[];
  if (body.startDate) data.startDate = new Date(body.startDate);
  if (body.endDate !== undefined)
    data.endDate = body.endDate ? new Date(body.endDate) : null;
  if (body.city) data.city = body.city;
  if (body.country) data.country = body.country;
  if (body.latitude !== undefined) data.latitude = body.latitude || null;
  if (body.longitude !== undefined) data.longitude = body.longitude || null;
  if (body.googleMapsUrl !== undefined)
    data.googleMapsUrl = body.googleMapsUrl || null;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.externalUrl !== undefined)
    data.externalUrl = body.externalUrl || null;
  if (body.stravaRouteEmbed !== undefined)
    data.stravaRouteEmbed = body.stravaRouteEmbed || null;
  if (body.featuredVenueId !== undefined)
    data.featuredVenueId = body.featuredVenueId || null;
  if (body.hasRegistrations !== undefined)
    data.hasRegistrations = body.hasRegistrations;
  if (body.refundDeadline !== undefined)
    data.refundDeadline = body.refundDeadline
      ? new Date(body.refundDeadline)
      : null;
  if (body.checkInOpensAt !== undefined)
    data.checkInOpensAt = body.checkInOpensAt
      ? new Date(body.checkInOpensAt)
      : null;
  if (body.checkInClosesAt !== undefined)
    data.checkInClosesAt = body.checkInClosesAt
      ? new Date(body.checkInClosesAt)
      : null;
  if (body.registrationFieldSettings !== undefined)
    data.registrationFieldSettings = body.registrationFieldSettings;

  // Admin-only fields
  if (isAdmin) {
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.cancelled !== undefined) data.cancelled = body.cancelled;
    if (body.cancelled === true) data.cancelledAt = new Date();
    if (body.cancellationReason !== undefined)
      data.cancellationReason = body.cancellationReason;
    if (body.hasLiveRace !== undefined) data.hasLiveRace = body.hasLiveRace;
    if (body.commissionPercent !== undefined)
      data.commissionPercent = body.commissionPercent ?? 0;
  }

  return data;
}

// --- Notification helpers ---

async function handleCancellationEffects(
  eventId: string,
  eventTitle: string,
  eventSlug: string,
  cancellationReason?: string | null
) {
  await prisma.participation.deleteMany({ where: { eventId } });

  notifyEventCancelled({
    eventId,
    eventTitle,
    eventSlug,
    cancellationReason: cancellationReason || undefined,
  }).catch((error) => {
    console.error("Error sending event cancellation notification:", error);
  });
}

function notifyDateChangeIfNeeded(
  eventId: string,
  eventTitle: string,
  eventSlug: string,
  oldStartDate: Date | null,
  newStartDateStr: string | undefined
) {
  if (!newStartDateStr || !oldStartDate) return;

  const oldDate = new Date(oldStartDate);
  const newDate = new Date(newStartDateStr);
  const dateChanged =
    oldDate.toISOString().split("T")[0] !== newDate.toISOString().split("T")[0];

  if (!dateChanged) return;

  notifyEventDateChange({
    eventId,
    eventTitle,
    eventSlug,
    oldDate,
    newDate,
  }).catch((error) => {
    console.error("Error sending event date change notification:", error);
  });
}

// --- GET handler ---

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isCuid = /^c[a-z0-9]{20,30}$/i.test(id);

    const event = await prisma.event.findFirst({
      where: isCuid ? { id } : { slug: id },
      include: {
        variants: {
          include: {
            triathlonSegments: { orderBy: { order: "asc" } },
            pricingPhases: { orderBy: { startDate: "asc" } },
            _count: {
              select: {
                registrations: { where: { status: "CONFIRMED" } },
              },
            },
          },
          orderBy: { startDate: "asc" },
        },
        faqs: { orderBy: { order: "asc" } },
        _count: { select: { comments: true } },
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

// --- PATCH handler ---

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.role === "ADMIN";
    const { id } = await params;

    if (!isAdmin) {
      const organizer = await prisma.eventOrganizer.findFirst({
        where: { eventId: id, userId: user.id },
      });
      if (!organizer) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = (await request.json()) as PatchBody;

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const slug =
      body.title && body.title !== existingEvent.title
        ? await generateUniqueSlug(body.title, id)
        : existingEvent.slug;

    const isBeingCancelled =
      isAdmin && body.cancelled === true && !existingEvent.cancelled;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: buildEventUpdateData(body, existingEvent.title, slug, isAdmin),
      include: { variants: true },
    });

    if (isBeingCancelled) {
      await handleCancellationEffects(
        id,
        updatedEvent.title,
        updatedEvent.slug,
        body.cancellationReason
      );
    }

    notifyDateChangeIfNeeded(
      id,
      updatedEvent.title,
      updatedEvent.slug,
      existingEvent.startDate,
      body.startDate
    );

    if (body.variants && Array.isArray(body.variants)) {
      await syncVariants(id, body.variants);
    }

    if (body.translations && Array.isArray(body.translations)) {
      await handleTranslations(id, body.translations);
    }

    const finalEvent = await prisma.event.findUnique({
      where: { id },
      include: { variants: true },
    });

    return NextResponse.json(finalEvent ?? updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// --- DELETE handler ---

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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete event (cascades to variants, comments, etc.)
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
