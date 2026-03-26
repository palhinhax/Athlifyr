import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SportType, Language, Currency } from "@prisma/client";
import { parseGpx } from "@/lib/gpx-parser";

/**
 * POST /api/admin/events/import
 *
 * Create a complete event from a structured JSON payload.
 * Includes: translations (6 langs), variants + translations,
 * pricing phases, FAQs + translations.
 *
 * Used by the scraping service after AI-generating event data.
 */

interface ImportTranslation {
  title: string;
  description: string;
  city?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface ImportVariantTranslation {
  name: string;
  description?: string;
}

interface ImportVariant {
  name: string;
  distanceKm?: number;
  elevationGainM?: number;
  elevationLossM?: number;
  price?: number;
  currency?: string;
  maxParticipants?: number;
  startDate?: string;
  startTime?: string;
  description?: string;
  cutoffTimeHours?: number;
  atrpGrade?: number;
  itraPoints?: number;
  mountainLevel?: number;
  teamSize?: number;
  gpxUrl?: string;
  translations?: Record<string, ImportVariantTranslation>;
  pricingPhases?: ImportPricingPhase[];
}

interface ImportPricingPhase {
  name: string;
  startDate: string;
  endDate: string;
  price: number;
  currency?: string;
  note?: string;
}

interface ImportFAQTranslation {
  question: string;
  answer: string;
}

interface ImportFAQ {
  order: number;
  question: string;
  answer: string;
  translations?: Record<string, ImportFAQTranslation>;
}

interface ImportEventPayload {
  title: string;
  slug?: string;
  description: string | Record<string, string>;
  sportTypes: string[];
  startDate: string;
  endDate?: string;
  registrationDeadline?: string;
  city: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  imageUrl?: string;
  externalUrl?: string;
  translations?: Record<string, ImportTranslation>;
  variants?: ImportVariant[];
  faqs?: ImportFAQ[];
  scrapedEventId?: string;
  sourceName?: string;
}

const VALID_SPORTS = new Set(Object.values(SportType));
const VALID_LANGUAGES = new Set(Object.values(Language));
const VALID_CURRENCIES = new Set(Object.values(Currency));

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const IMPORT_SECRET = process.env.EVENT_IMPORT_SECRET || "";

export async function POST(req: NextRequest) {
  // Auth: either admin session OR valid import secret from scraping service
  const importSecret = req.headers.get("X-Import-Secret");
  const hasValidSecret = IMPORT_SECRET && importSecret === IMPORT_SECRET;

  if (!hasValidSecret) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body: ImportEventPayload = await req.json();

    // Normalize description — AI may return it as a multilingual object
    // In that case, extract the Portuguese (or first available) string for the
    // Event-level field, and merge per-language descriptions into translations.
    if (typeof body.description === "object" && body.description !== null) {
      const descObj = body.description as Record<string, string>;
      const langs = Object.keys(descObj);
      // Populate translations.description from the object if not already set
      body.translations = body.translations ?? {};
      for (const lang of langs) {
        if (VALID_LANGUAGES.has(lang as Language)) {
          body.translations[lang] = body.translations[lang] ?? {
            title: body.title,
            description: descObj[lang],
            city: body.city,
          };
          // Only override description field if it wasn't already set
          if (!body.translations[lang].description) {
            body.translations[lang].description = descObj[lang];
          }
        }
      }
      // Use Portuguese as the canonical Event-level description fallback
      body.description =
        descObj["pt"] ?? descObj["en"] ?? descObj[langs[0]] ?? "";
    }

    // After normalization, description is guaranteed to be a string
    const descriptionStr = body.description as string;

    // Debug: log what we received
    console.log("[import] Received event:", body.title);
    console.log("[import] lat/lng:", body.latitude, body.longitude);
    console.log("[import] googleMapsUrl:", body.googleMapsUrl);
    console.log("[import] variants:", body.variants?.length ?? 0);
    console.log("[import] faqs:", body.faqs?.length ?? 0);
    if (body.variants) {
      for (const v of body.variants) {
        console.log(
          `[import]   variant: ${v.name}, distanceKm=${v.distanceKm}, price=${v.price}, pricingPhases=${v.pricingPhases?.length ?? 0}`
        );
      }
    }

    // Validate required fields
    if (!body.title || !body.startDate || !body.city || !body.description) {
      console.error("[import] Missing required fields:", {
        title: !!body.title,
        startDate: !!body.startDate,
        city: !!body.city,
        description: !!body.description,
      });
      return NextResponse.json(
        { error: "title, description, startDate and city are required" },
        { status: 400 }
      );
    }

    // Validate sport types
    const sportTypes = body.sportTypes
      .filter((s) => VALID_SPORTS.has(s as SportType))
      .map((s) => s as SportType);

    if (sportTypes.length === 0) {
      sportTypes.push(SportType.RUNNING);
    }

    // Generate slug
    const slug = body.slug || generateSlug(body.title);

    // Check if event already exists (by slug) — update instead of duplicate
    const existingEvent = await prisma.event.findFirst({ where: { slug } });
    const isUpdate = !!existingEvent;

    // Validate currency helper
    const parseCurrency = (c?: string): Currency =>
      c && VALID_CURRENCIES.has(c as Currency) ? (c as Currency) : Currency.EUR;

    let event;

    if (isUpdate) {
      console.log("[import] Updating existing event:", existingEvent.id, slug);

      // Delete old related data that will be replaced
      await prisma.$transaction([
        prisma.eventFAQTranslation.deleteMany({
          where: { faq: { eventId: existingEvent.id } },
        }),
        prisma.eventFAQ.deleteMany({ where: { eventId: existingEvent.id } }),
        prisma.pricingPhase.deleteMany({
          where: { eventId: existingEvent.id },
        }),
        prisma.eventVariantTranslation.deleteMany({
          where: { variant: { eventId: existingEvent.id } },
        }),
        prisma.eventVariant.deleteMany({
          where: { eventId: existingEvent.id },
        }),
        prisma.eventTranslation.deleteMany({
          where: { eventId: existingEvent.id },
        }),
      ]);

      // Update the event itself
      event = await prisma.event.update({
        where: { id: existingEvent.id },
        data: {
          title: body.title,
          description: descriptionStr,
          sportTypes,
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : null,
          registrationDeadline: body.registrationDeadline
            ? new Date(body.registrationDeadline)
            : null,
          city: body.city,
          country: body.country || "Portugal",
          latitude: body.latitude ?? null,
          longitude: body.longitude ?? null,
          googleMapsUrl: body.googleMapsUrl ?? null,
          imageUrl: body.imageUrl ?? null,
          externalUrl: body.externalUrl ?? null,
          scrapingSource: body.sourceName ?? null,
        },
      });
    } else {
      // ── Create new event ──────────────────────────────────────
      event = await prisma.event.create({
        data: {
          title: body.title,
          slug,
          description: descriptionStr,
          sportTypes,
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : null,
          registrationDeadline: body.registrationDeadline
            ? new Date(body.registrationDeadline)
            : null,
          city: body.city,
          country: body.country || "Portugal",
          latitude: body.latitude ?? null,
          longitude: body.longitude ?? null,
          googleMapsUrl: body.googleMapsUrl ?? null,
          imageUrl: body.imageUrl ?? null,
          externalUrl: body.externalUrl ?? null,
          scrapingSource: body.sourceName ?? null,
        },
      });
    }

    // ── Translations (6 languages) ──────────────────────────────
    if (body.translations) {
      for (const [lang, t] of Object.entries(body.translations)) {
        if (!VALID_LANGUAGES.has(lang as Language)) continue;
        await prisma.eventTranslation.upsert({
          where: {
            eventId_language: { eventId: event.id, language: lang as Language },
          },
          create: {
            eventId: event.id,
            language: lang as Language,
            title: t.title,
            description: t.description,
            city: t.city ?? body.city,
            metaTitle: t.metaTitle ?? null,
            metaDescription: t.metaDescription ?? null,
          },
          update: {
            title: t.title,
            description: t.description,
            city: t.city ?? body.city,
            metaTitle: t.metaTitle ?? null,
            metaDescription: t.metaDescription ?? null,
          },
        });
      }
    }

    // ── Variants + variant translations + pricing phases ────────
    if (body.variants) {
      for (const v of body.variants) {
        const variant = await prisma.eventVariant.create({
          data: {
            eventId: event.id,
            name: v.name,
            distanceKm: v.distanceKm ?? null,
            elevationGainM: v.elevationGainM ?? null,
            elevationLossM: v.elevationLossM ?? null,
            price: v.price ?? null,
            currency: parseCurrency(v.currency),
            maxParticipants: v.maxParticipants ?? null,
            startDate: v.startDate ? new Date(v.startDate) : null,
            startTime: v.startTime ?? null,
            description: v.description ?? null,
            cutoffTimeHours: v.cutoffTimeHours ?? null,
            atrpGrade: v.atrpGrade ?? null,
            itraPoints: v.itraPoints ?? null,
            mountainLevel: v.mountainLevel ?? null,
            teamSize: v.teamSize ?? 1,
          },
        });

        // Variant translations
        if (v.translations) {
          for (const [lang, vt] of Object.entries(v.translations)) {
            if (!VALID_LANGUAGES.has(lang as Language)) continue;
            await prisma.eventVariantTranslation.create({
              data: {
                variantId: variant.id,
                language: lang as Language,
                name: vt.name,
                description: vt.description ?? null,
              },
            });
          }
        }

        // Pricing phases for this variant
        if (v.pricingPhases) {
          for (const pp of v.pricingPhases) {
            await prisma.pricingPhase.create({
              data: {
                eventId: event.id,
                variantId: variant.id,
                name: pp.name,
                startDate: new Date(pp.startDate),
                endDate: new Date(pp.endDate),
                price: pp.price,
                currency: parseCurrency(pp.currency),
                note: pp.note ?? null,
              },
            });
          }
        }

        // GPX route — download and parse if a bucket URL is provided
        if (v.gpxUrl) {
          try {
            const gpxRes = await fetch(v.gpxUrl);
            if (gpxRes.ok) {
              const gpxXml = await gpxRes.text();
              const parsed = parseGpx(gpxXml);
              await prisma.eventRoute.upsert({
                where: { variantId: variant.id },
                create: {
                  variantId: variant.id,
                  gpxData: gpxXml,
                  routePoints: parsed.routePoints,
                  distanceKm: parsed.distanceKm || null,
                  elevationGainM: parsed.elevationGainM
                    ? Math.round(parsed.elevationGainM)
                    : null,
                  elevationLossM: parsed.elevationLossM
                    ? Math.round(parsed.elevationLossM)
                    : null,
                },
                update: {
                  gpxData: gpxXml,
                  routePoints: parsed.routePoints,
                  distanceKm: parsed.distanceKm || null,
                  elevationGainM: parsed.elevationGainM
                    ? Math.round(parsed.elevationGainM)
                    : null,
                  elevationLossM: parsed.elevationLossM
                    ? Math.round(parsed.elevationLossM)
                    : null,
                },
              });
              console.log(
                `[import]   GPX route created for variant: ${variant.name} (${parsed.routePoints.length} points, ${parsed.distanceKm} km)`
              );
            } else {
              console.warn(
                `[import]   GPX fetch failed for ${variant.name}: ${gpxRes.status} ${v.gpxUrl}`
              );
            }
          } catch (gpxErr) {
            console.error(
              `[import]   GPX parse/upsert error for ${variant.name}:`,
              gpxErr
            );
          }
        }
      }
    }

    // ── FAQs + FAQ translations ─────────────────────────────────
    if (body.faqs) {
      for (const f of body.faqs) {
        const faq = await prisma.eventFAQ.create({
          data: {
            eventId: event.id,
            order: f.order,
            question: f.question,
            answer: f.answer,
          },
        });

        if (f.translations) {
          for (const [lang, ft] of Object.entries(f.translations)) {
            if (!VALID_LANGUAGES.has(lang as Language)) continue;
            await prisma.eventFAQTranslation.create({
              data: {
                faqId: faq.id,
                language: lang as Language,
                question: ft.question,
                answer: ft.answer,
              },
            });
          }
        }
      }
    }

    // ── Return complete event ───────────────────────────────────
    const fullEvent = await prisma.event.findUnique({
      where: { id: event.id },
      include: {
        translations: true,
        variants: {
          include: {
            translations: true,
            pricingPhases: true,
          },
        },
        pricingPhases: true,
        faqs: {
          include: { translations: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(fullEvent, { status: isUpdate ? 200 : 201 });
  } catch (error) {
    console.error("Error importing event:", error);
    const message =
      error instanceof Error ? error.message : "Failed to import event";
    return NextResponse.json(
      { error: "Failed to import event", detail: message },
      { status: 500 }
    );
  }
}
