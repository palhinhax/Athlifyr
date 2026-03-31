import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Language, SportType, Prisma } from "@prisma/client";

const SUPPORTED_LOCALES = new Set<string>(["pt", "en", "es", "fr", "de", "it"]);

function getLocaleFromRequest(request: NextRequest): Language | null {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return null;
  const lang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  return lang && SUPPORTED_LOCALES.has(lang) ? (lang as Language) : null;
}

function buildLocationFilter(
  lat: string | null,
  lng: string | null,
  radiusKmStr: string | null
): Pick<Prisma.EventWhereInput, "latitude" | "longitude"> | null {
  if (!lat || !lng || !radiusKmStr) return null;

  const centerLat = Number.parseFloat(lat);
  const centerLng = Number.parseFloat(lng);
  const radius = Number.parseFloat(radiusKmStr);

  if (
    Number.isNaN(centerLat) ||
    Number.isNaN(centerLng) ||
    Number.isNaN(radius) ||
    radius <= 0
  ) {
    return null;
  }

  const latDelta = radius / 111;
  const lngDelta = radius / (111 * Math.cos((centerLat * Math.PI) / 180));

  return {
    latitude: {
      not: null,
      gte: centerLat - latDelta,
      lte: centerLat + latDelta,
    },
    longitude: {
      not: null,
      gte: centerLng - lngDelta,
      lte: centerLng + lngDelta,
    },
  };
}

// GET - List all events with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const locale = getLocaleFromRequest(request);
    console.log(
      `[events/list] Accept-Language: "${request.headers.get("accept-language")}", resolved locale: ${locale}`
    );
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const sports = searchParams.getAll("sports");
    const sportTypes = searchParams.get("sportTypes");
    const country = searchParams.get("country");
    const featured = searchParams.get("featured"); // "true" = only featured, "false" = exclude featured
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radiusKm = searchParams.get("radiusKm");

    // Build where clause
    const where: Prisma.EventWhereInput = {
      startDate: {
        gte: new Date(), // Only future events
      },
    };

    // Filter by featured status
    if (featured === "true") {
      where.isFeatured = true;
    } else if (featured === "false") {
      where.isFeatured = { not: true };
    }

    if (country) {
      where.country = { equals: country, mode: "insensitive" };
    }

    let fuzzyEventIds: string[] = [];

    if (search) {
      const normalizedSearch = search
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      try {
        // Try to use pg_trgm similarity function for fuzzy search
        const fuzzyEvents = await prisma.$queryRaw<{ id: string }[]>`
          SELECT DISTINCT e.id,
            GREATEST(
              similarity(
                LOWER(
                  translate(
                    e.title,
                    'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                    'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                  )
                ),
                ${normalizedSearch}
              ),
              similarity(
                LOWER(
                  translate(
                    e.city,
                    'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                    'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                  )
                ),
                ${normalizedSearch}
              ),
              similarity(
                LOWER(e.slug),
                ${normalizedSearch}
              ),
              similarity(
                LOWER(
                  translate(
                    COALESCE(et.title, ''),
                    'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                    'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                  )
                ),
                ${normalizedSearch}
              ),
              similarity(
                LOWER(
                  translate(
                    COALESCE(et.city, ''),
                    'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                    'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                  )
                ),
                ${normalizedSearch}
              )
            ) AS max_similarity
          FROM "Event" e
          LEFT JOIN "EventTranslation" et ON e.id = et."eventId"
          WHERE
            similarity(
              LOWER(
                translate(
                  e.title,
                  'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                  'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                )
              ),
              ${normalizedSearch}
            ) > 0.2
            OR similarity(
              LOWER(
                translate(
                  e.city,
                  'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                  'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                )
              ),
              ${normalizedSearch}
            ) > 0.2
            OR similarity(
              LOWER(e.slug),
              ${normalizedSearch}
            ) > 0.2
            OR similarity(
              LOWER(
                translate(
                  COALESCE(et.title, ''),
                  'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                  'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                )
              ),
              ${normalizedSearch}
            ) > 0.2
            OR similarity(
              LOWER(
                translate(
                  COALESCE(et.city, ''),
                  'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                  'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                )
              ),
              ${normalizedSearch}
            ) > 0.2
          ORDER BY max_similarity DESC
        `;

        fuzzyEventIds = fuzzyEvents.map((e) => e.id);
      } catch {
        // Fallback to simple ILIKE search if pg_trgm extension is not available
        console.log(
          "pg_trgm extension not available, using simple ILIKE search for events"
        );
        const searchPattern = `%${search}%`;
        const simpleEvents = await prisma.$queryRaw<
          { id: string; sort_order: number }[]
        >`
          SELECT DISTINCT e.id,
            CASE 
              WHEN e.title ILIKE ${searchPattern} THEN 1
              WHEN e.slug ILIKE ${searchPattern} THEN 2
              WHEN e.city ILIKE ${searchPattern} THEN 3
              WHEN et.title ILIKE ${searchPattern} THEN 4
              WHEN et.city ILIKE ${searchPattern} THEN 5
              ELSE 6
            END AS sort_order
          FROM "Event" e
          LEFT JOIN "EventTranslation" et ON e.id = et."eventId"
          WHERE
            e.title ILIKE ${searchPattern}
            OR e.slug ILIKE ${searchPattern}
            OR e.city ILIKE ${searchPattern}
            OR et.title ILIKE ${searchPattern}
            OR et.city ILIKE ${searchPattern}
          ORDER BY sort_order
        `;
        fuzzyEventIds = simpleEvents.map((e) => e.id);
      }

      if (fuzzyEventIds.length > 0) {
        where.id = { in: fuzzyEventIds };
      } else {
        where.id = { in: [] };
      }
    }

    if (sports.length > 0) {
      where.sportTypes = {
        hasSome: sports as SportType[],
      };
    }

    // Support comma-separated sportTypes param (used by mobile)
    if (sportTypes) {
      const sportTypesArray = sportTypes
        .split(",")
        .filter((s) =>
          Object.values(SportType).includes(s as SportType)
        ) as SportType[];
      if (sportTypesArray.length > 0) {
        where.sportTypes = {
          hasSome: sportTypesArray,
        };
      }
    }

    // Location-based filtering (radius around a point)
    const locationFilter = buildLocationFilter(lat, lng, radiusKm);
    if (locationFilter) {
      Object.assign(where, locationFilter);
    }

    const skip = (page - 1) * pageSize;

    const totalCount = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      include: {
        translations: locale ? { where: { language: locale } } : false,
        variants: {
          include: {
            translations: locale ? { where: { language: locale } } : false,
            triathlonSegments: {
              orderBy: { order: "asc" },
            },
            pricingPhases: {
              select: {
                startDate: true,
                endDate: true,
                price: true,
                currency: true,
              },
            },
          },
          orderBy: {
            startDate: "asc",
          },
        },
        _count: {
          select: {
            comments: true,
            giveaways: {
              where: { status: "SCHEDULED" },
            },
          },
        },
      },
      orderBy: search ? undefined : { startDate: "asc" },
      skip,
      take: pageSize,
    });

    let sortedEvents = events;
    if (search && fuzzyEventIds.length > 0) {
      const orderMap = new Map(fuzzyEventIds.map((id, index) => [id, index]));
      sortedEvents = events.sort(
        (a, b) =>
          (orderMap.get(a.id) ?? Infinity) - (orderMap.get(b.id) ?? Infinity)
      );
    }

    // Overlay translated fields when a locale was requested
    const resolvedEvents = locale
      ? sortedEvents.map((event) => {
          const t = Array.isArray(event.translations)
            ? event.translations[0]
            : undefined;
          const variants = event.variants.map((v) => {
            const vt = Array.isArray(v.translations)
              ? v.translations[0]
              : undefined;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { translations: _vt, ...variantRest } = v;
            return {
              ...variantRest,
              ...(vt?.name ? { name: vt.name } : {}),
              ...(vt?.description ? { description: vt.description } : {}),
            };
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { translations: _t, ...eventRest } = event;
          return {
            ...eventRest,
            ...(t?.title ? { title: t.title } : {}),
            ...(t?.description ? { description: t.description } : {}),
            ...(t?.city ? { city: t.city } : {}),
            variants,
          };
        })
      : sortedEvents;

    return NextResponse.json({
      events: resolvedEvents,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: skip + events.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      sportType,
      startDate,
      endDate,
      city,
      country,
      imageUrl,
      externalUrl,
      stravaRouteEmbed,
      variants,
    } = body;

    // Validate required fields
    if (!title || !startDate || !city) {
      return NextResponse.json(
        { error: "Title, startDate and city are required" },
        { status: 400 }
      );
    }

    // Validate sport type
    if (sportType && !Object.values(SportType).includes(sportType)) {
      return NextResponse.json(
        { error: "Invalid sport type" },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingSlug = await prisma.event.findFirst({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create event with variants
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description: description || "",
        sportTypes: sportType ? [sportType as SportType] : [SportType.RUNNING],
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        city,
        country: country || "Portugal",
        imageUrl: imageUrl || null,
        externalUrl: externalUrl || null,
        stravaRouteEmbed: stravaRouteEmbed || null,
        variants: {
          create:
            variants?.map(
              (v: {
                name: string;
                distanceKm: number | null;
                startDate?: string;
                startTime?: string;
                triathlonSegments?: Array<{
                  segmentType: string;
                  distanceKm: number;
                  terrainType: string;
                  order: number;
                }>;
              }) => ({
                name: v.name,
                distanceKm: v.distanceKm,
                startDate: v.startDate ? new Date(v.startDate) : null,
                startTime: v.startTime || null,
                triathlonSegments: v.triathlonSegments
                  ? {
                      create: v.triathlonSegments.map((seg) => ({
                        segmentType: seg.segmentType,
                        distanceKm: seg.distanceKm,
                        terrainType: seg.terrainType,
                        order: seg.order,
                      })),
                    }
                  : undefined,
              })
            ) || [],
        },
      },
      include: {
        variants: {
          include: {
            triathlonSegments: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { startDate: "asc" },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
