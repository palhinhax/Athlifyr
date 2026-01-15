import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get translations for an event (including variant translations)
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Get event translations
    const translations = await prisma.eventTranslation.findMany({
      where: { eventId: params.id },
      orderBy: { language: "asc" },
    });

    // Get all variants for this event with their translations
    const variants = await prisma.eventVariant.findMany({
      where: { eventId: params.id },
      include: {
        translations: true,
      },
    });

    // Create a map of variant translations by variant ID
    const variantTranslations: Record<
      string,
      (typeof variants)[0]["translations"]
    > = {};
    variants.forEach((variant) => {
      variantTranslations[variant.id] = variant.translations;
    });

    return NextResponse.json({ translations, variantTranslations });
  } catch (error) {
    console.error("Error fetching translations:", error);
    return NextResponse.json(
      { error: "Failed to fetch translations" },
      { status: 500 }
    );
  }
}

// PUT - Update translations for an event (admin only)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { translations } = body;

    if (!Array.isArray(translations)) {
      return NextResponse.json(
        { error: "Translations must be an array" },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Upsert translations
    const results = await Promise.all(
      translations.map(
        async (t: {
          language: string;
          title: string;
          description: string;
          city?: string;
          metaTitle?: string;
          metaDescription?: string;
        }) => {
          // Only save if there's content
          if (!t.title?.trim() && !t.description?.trim()) {
            // Delete if exists but now empty
            await prisma.eventTranslation.deleteMany({
              where: {
                eventId: params.id,
                language: t.language as "pt" | "en" | "es" | "fr" | "de" | "it",
              },
            });
            return null;
          }

          return prisma.eventTranslation.upsert({
            where: {
              eventId_language: {
                eventId: params.id,
                language: t.language as "pt" | "en" | "es" | "fr" | "de" | "it",
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
              eventId: params.id,
              language: t.language as "pt" | "en" | "es" | "fr" | "de" | "it",
              title: t.title || "",
              description: t.description || "",
              city: t.city || null,
              metaTitle: t.metaTitle || null,
              metaDescription: t.metaDescription || null,
            },
          });
        }
      )
    );

    return NextResponse.json({
      translations: results.filter(Boolean),
      message: "Translations updated successfully",
    });
  } catch (error) {
    console.error("Error updating translations:", error);
    return NextResponse.json(
      { error: "Failed to update translations" },
      { status: 500 }
    );
  }
}
