import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isVenueOwner } from "@/lib/venues/authorization";
import { Language } from "@prisma/client";

const SUPPORTED_LANGUAGES: Language[] = ["en", "pt", "es", "fr", "de", "it"];

// GET - Get venue SEO translations (including description)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find venue by ID or slug
    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        translations: true,
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json({ translations: venue.translations });
  } catch (error) {
    console.error("Error fetching venue SEO translations:", error);
    return NextResponse.json(
      { error: "Failed to fetch SEO translations" },
      { status: 500 }
    );
  }
}

// PUT - Update venue SEO translations (including description)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find venue by ID or slug
    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Check authorization - venue owner OR app admin can manage SEO
    const isOwner = await isVenueOwner(session.user.id, venue.id);
    const isAppAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAppAdmin) {
      return NextResponse.json(
        { error: "Only the venue owner or app admin can manage SEO settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { translations } = body;

    if (!translations || !Array.isArray(translations)) {
      return NextResponse.json(
        { error: "Invalid translations data" },
        { status: 400 }
      );
    }

    // Validate and upsert each translation
    const updatedTranslations = [];

    for (const translation of translations) {
      const { language, description, metaTitle, metaDescription } = translation;

      // Validate language
      if (!SUPPORTED_LANGUAGES.includes(language)) {
        continue;
      }

      // Only upsert if at least one field has content
      if (description || metaTitle || metaDescription) {
        const upserted = await prisma.venueTranslation.upsert({
          where: {
            venueId_language: {
              venueId: venue.id,
              language: language as Language,
            },
          },
          update: {
            description: description || null,
            metaTitle: metaTitle || null,
            metaDescription: metaDescription || null,
          },
          create: {
            venueId: venue.id,
            language: language as Language,
            description: description || null,
            metaTitle: metaTitle || null,
            metaDescription: metaDescription || null,
          },
        });
        updatedTranslations.push(upserted);
      } else {
        // Delete translation if all fields are empty
        await prisma.venueTranslation.deleteMany({
          where: {
            venueId: venue.id,
            language: language as Language,
          },
        });
      }
    }

    return NextResponse.json({
      message: "SEO translations updated successfully",
      translations: updatedTranslations,
    });
  } catch (error) {
    console.error("Error updating venue SEO translations:", error);
    return NextResponse.json(
      { error: "Failed to update SEO translations" },
      { status: 500 }
    );
  }
}
