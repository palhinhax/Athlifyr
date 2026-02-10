import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Language } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to handle translations
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
  startDate?: string;
  startTime?: string;
  translations?: VariantTranslationInput[];
}

async function handleTranslations(
  eventId: string,
  translations: TranslationInput[]
) {
  // Fetch existing translations to compare
  const existingTranslations = await prisma.eventTranslation.findMany({
    where: { eventId },
  });

  const existingMap = new Map(existingTranslations.map((t) => [t.language, t]));

  for (const t of translations) {
    const existing = existingMap.get(t.language);

    // Only save if there's content
    if (!t.title?.trim() && !t.description?.trim()) {
      // Delete if exists but now empty
      if (existing) {
        await prisma.eventTranslation.delete({
          where: { id: existing.id },
        });
      }
      continue;
    }

    // Check if translation actually changed
    const hasChanged =
      !existing ||
      existing.title !== (t.title || "") ||
      existing.description !== (t.description || "") ||
      existing.city !== (t.city || null) ||
      existing.metaTitle !== (t.metaTitle || null) ||
      existing.metaDescription !== (t.metaDescription || null);

    // Only upsert if changed
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

// GET - Get event by ID or slug
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first (UUID format), then by slug
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    const event = await prisma.event.findFirst({
      where: isUUID ? { id } : { slug: id },
      include: {
        variants: {
          include: {
            triathlonSegments: {
              orderBy: { order: "asc" },
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

// PATCH - Update event (admin only)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
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
      variants,
      translations,
    } = body;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Generate slug if title changed
    let slug = existingEvent.slug;
    if (title && title !== existingEvent.title) {
      slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if slug already exists
      const existingSlug = await prisma.event.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(title && { slug }),
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
      },
      include: {
        variants: true,
      },
    });

    // Handle variants if provided
    if (variants && Array.isArray(variants)) {
      // Get existing variant IDs to identify which ones to delete
      const existingVariants = await prisma.eventVariant.findMany({
        where: { eventId: id },
        select: { id: true },
      });

      const variantIdsInRequest = variants
        .filter((v) => v.id)
        .map((v) => v.id as string);

      // Delete variants that are no longer in the request
      const variantsToDelete = existingVariants
        .filter((v) => !variantIdsInRequest.includes(v.id))
        .map((v) => v.id);

      if (variantsToDelete.length > 0) {
        await prisma.eventVariant.deleteMany({
          where: { id: { in: variantsToDelete } },
        });
      }

      // Upsert variants (update existing, create new)
      if (variants.length > 0) {
        for (const v of variants as VariantInput[]) {
          let variant;

          if (v.id) {
            // Fetch existing variant to check if changed
            const existingVariant = await prisma.eventVariant.findUnique({
              where: { id: v.id },
            });

            if (existingVariant) {
              // Compare values to detect changes
              const hasChanged =
                existingVariant.name !== v.name ||
                existingVariant.distanceKm !== (v.distanceKm || null) ||
                existingVariant.elevationGainM !== (v.elevationGainM || null) ||
                existingVariant.price !== (v.price || null) ||
                (v.startDate &&
                  existingVariant.startDate?.getTime() !==
                    new Date(v.startDate).getTime()) ||
                existingVariant.startTime !== (v.startTime || null);

              if (hasChanged) {
                // Update existing variant only if changed
                variant = await prisma.eventVariant.update({
                  where: { id: v.id },
                  data: {
                    name: v.name,
                    distanceKm: v.distanceKm || null,
                    elevationGainM: v.elevationGainM || null,
                    price: v.price || null,
                    startDate: v.startDate ? new Date(v.startDate) : null,
                    startTime: v.startTime || null,
                  },
                });
              } else {
                // No changes, use existing variant
                variant = existingVariant;
              }
            } else {
              // Variant not found, skip
              continue;
            }
          } else {
            // Create new variant
            variant = await prisma.eventVariant.create({
              data: {
                eventId: id,
                name: v.name,
                distanceKm: v.distanceKm || null,
                elevationGainM: v.elevationGainM || null,
                price: v.price || null,
                startDate: v.startDate ? new Date(v.startDate) : null,
                startTime: v.startTime || null,
              },
            });
          }

          // Upsert variant translations if provided
          if (v.translations && Array.isArray(v.translations)) {
            // Fetch existing translations for comparison
            const existingVarTranslations =
              await prisma.eventVariantTranslation.findMany({
                where: { variantId: variant.id },
              });

            const existingVarMap = new Map(
              existingVarTranslations.map((t) => [t.language, t])
            );

            for (const t of v.translations) {
              if (t.name?.trim() || t.description?.trim()) {
                const existing = existingVarMap.get(t.language);

                // Check if translation actually changed
                const hasChanged =
                  !existing ||
                  existing.name !== (t.name || "") ||
                  existing.description !== (t.description || null);

                // Only upsert if changed
                if (hasChanged) {
                  await prisma.eventVariantTranslation.upsert({
                    where: {
                      variantId_language: {
                        variantId: variant.id,
                        language: t.language,
                      },
                    },
                    update: {
                      name: t.name || "",
                      description: t.description || null,
                    },
                    create: {
                      variantId: variant.id,
                      language: t.language,
                      name: t.name || "",
                      description: t.description || null,
                    },
                  });
                }
              }
            }
          }
        }
      }

      // Fetch updated event with new variants
      const eventWithVariants = await prisma.event.findUnique({
        where: { id },
        include: { variants: true },
      });

      // Handle translations if provided
      if (translations && Array.isArray(translations)) {
        await handleTranslations(id, translations);
      }

      return NextResponse.json(eventWithVariants);
    }

    // Handle translations if provided (even without variants)
    if (translations && Array.isArray(translations)) {
      await handleTranslations(id, translations);
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
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
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
