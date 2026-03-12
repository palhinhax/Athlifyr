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
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "");
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
      prev?.title !== (t.title || "") ||
      prev?.description !== (t.description || "") ||
      prev?.city !== (t.city || null) ||
      prev?.metaTitle !== (t.metaTitle || null) ||
      prev?.metaDescription !== (t.metaDescription || null);

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
      prev?.name !== (t.name || "") ||
      prev?.description !== (t.description || null);

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

type UpdateHelpers = {
  setIfDefined: <K extends keyof Prisma.EventUncheckedUpdateInput>(
    key: K,
    value: Prisma.EventUncheckedUpdateInput[K] | undefined
  ) => void;
  isDefined: <T>(value: T | undefined) => value is T;
  toNullableDate: (value: string | Date | null | undefined) => Date | null;
  toNullableValue: <T>(value: T | null | undefined) => T | null;
};

function buildEventUpdateData(
  body: PatchBody,
  existingTitle: string,
  slug: string,
  isAdmin: boolean
): Prisma.EventUncheckedUpdateInput {
  const data: Prisma.EventUncheckedUpdateInput = {};

  const isDefined = <T>(value: T | undefined): value is T =>
    value !== undefined;

  const helpers: UpdateHelpers = {
    isDefined,
    setIfDefined: <K extends keyof Prisma.EventUncheckedUpdateInput>(
      key: K,
      value: Prisma.EventUncheckedUpdateInput[K] | undefined
    ) => {
      if (isDefined(value)) {
        data[key] = value;
      }
    },
    toNullableDate: (value: string | Date | null | undefined) =>
      value ? new Date(value) : null,
    toNullableValue: <T>(value: T | null | undefined) => value ?? null,
  };

  applyBasicFields(data, body, existingTitle, slug, helpers);

  if (isAdmin) {
    applyAdminFields(data, body, helpers);
  }

  return data;
}

function applyTitleFields(
  data: Prisma.EventUncheckedUpdateInput,
  title: string | undefined,
  existingTitle: string,
  slug: string
) {
  if (!title) {
    return;
  }

  data.title = title;

  if (title !== existingTitle) {
    data.slug = slug;
  }
}

function applyBasicFields(
  data: Prisma.EventUncheckedUpdateInput,
  body: PatchBody,
  existingTitle: string,
  slug: string,
  helpers: UpdateHelpers
) {
  applyTitleFields(data, body.title, existingTitle, slug);

  helpers.setIfDefined("description", body.description);
  helpers.setIfDefined(
    "sportTypes",
    Array.isArray(body.sportTypes)
      ? (body.sportTypes as SportType[])
      : undefined
  );
  helpers.setIfDefined(
    "startDate",
    body.startDate ? new Date(body.startDate) : undefined
  );
  helpers.setIfDefined(
    "endDate",
    helpers.isDefined(body.endDate)
      ? helpers.toNullableDate(body.endDate)
      : undefined
  );
  helpers.setIfDefined("city", body.city);
  helpers.setIfDefined("country", body.country);
  helpers.setIfDefined(
    "latitude",
    helpers.isDefined(body.latitude)
      ? helpers.toNullableValue(body.latitude)
      : undefined
  );
  helpers.setIfDefined(
    "longitude",
    helpers.isDefined(body.longitude)
      ? helpers.toNullableValue(body.longitude)
      : undefined
  );
  helpers.setIfDefined(
    "googleMapsUrl",
    helpers.isDefined(body.googleMapsUrl)
      ? helpers.toNullableValue(body.googleMapsUrl)
      : undefined
  );
  helpers.setIfDefined(
    "imageUrl",
    helpers.isDefined(body.imageUrl)
      ? helpers.toNullableValue(body.imageUrl)
      : undefined
  );
  helpers.setIfDefined(
    "externalUrl",
    helpers.isDefined(body.externalUrl)
      ? helpers.toNullableValue(body.externalUrl)
      : undefined
  );
  helpers.setIfDefined(
    "stravaRouteEmbed",
    helpers.isDefined(body.stravaRouteEmbed)
      ? helpers.toNullableValue(body.stravaRouteEmbed)
      : undefined
  );
  helpers.setIfDefined(
    "featuredVenueId",
    helpers.isDefined(body.featuredVenueId)
      ? helpers.toNullableValue(body.featuredVenueId)
      : undefined
  );
  helpers.setIfDefined("hasRegistrations", body.hasRegistrations);
  helpers.setIfDefined(
    "refundDeadline",
    helpers.isDefined(body.refundDeadline)
      ? helpers.toNullableDate(body.refundDeadline)
      : undefined
  );
  helpers.setIfDefined(
    "checkInOpensAt",
    helpers.isDefined(body.checkInOpensAt)
      ? helpers.toNullableDate(body.checkInOpensAt)
      : undefined
  );
  helpers.setIfDefined(
    "checkInClosesAt",
    helpers.isDefined(body.checkInClosesAt)
      ? helpers.toNullableDate(body.checkInClosesAt)
      : undefined
  );
  helpers.setIfDefined(
    "registrationFieldSettings",
    body.registrationFieldSettings
  );
}

function applyAdminFields(
  data: Prisma.EventUncheckedUpdateInput,
  body: PatchBody,
  helpers: UpdateHelpers
) {
  helpers.setIfDefined("isFeatured", body.isFeatured);
  helpers.setIfDefined("cancelled", body.cancelled);
  helpers.setIfDefined("cancellationReason", body.cancellationReason);
  helpers.setIfDefined("hasLiveRace", body.hasLiveRace);
  helpers.setIfDefined(
    "commissionPercent",
    helpers.isDefined(body.commissionPercent)
      ? (body.commissionPercent ?? 0)
      : undefined
  );

  if (body.cancelled === true) {
    data.cancelledAt = new Date();
  }
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
