import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VenueType, VenueService, SportType, Prisma } from "@prisma/client";

// GET - List all venues with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const services = searchParams.getAll("services");
    const sports = searchParams.getAll("sports");
    const city = searchParams.get("city");

    // Location-based filtering params
    const userLat = searchParams.get("lat")
      ? parseFloat(searchParams.get("lat")!)
      : null;
    const userLng = searchParams.get("lng")
      ? parseFloat(searchParams.get("lng")!)
      : null;
    const radiusKm = searchParams.get("radius")
      ? parseFloat(searchParams.get("radius")!)
      : null;

    const where: Prisma.VenueWhereInput = {
      isActive: true,
    };

    let fuzzyVenueIds: string[] = [];

    if (search) {
      const normalizedSearch = search
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const fuzzyVenues = await prisma.$queryRaw<{ id: string }[]>`
        SELECT DISTINCT v.id,
          GREATEST(
            similarity(
              LOWER(
                translate(
                  v.name,
                  'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                  'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                )
              ),
              ${normalizedSearch}
            ),
            similarity(
              LOWER(
                translate(
                  COALESCE(v.description, ''),
                  'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                  'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                )
              ),
              ${normalizedSearch}
            ),
            similarity(
              LOWER(
                translate(
                  v.city,
                  'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                  'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
                )
              ),
              ${normalizedSearch}
            ),
            similarity(
              LOWER(v.slug),
              ${normalizedSearch}
            )
          ) AS max_similarity
        FROM "Venue" v
        WHERE
          similarity(
            LOWER(
              translate(
                v.name,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ) > 0.2
          OR similarity(
            LOWER(
              translate(
                COALESCE(v.description, ''),
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ) > 0.2
          OR similarity(
            LOWER(
              translate(
                v.city,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ) > 0.2
          OR similarity(
            LOWER(v.slug),
            ${normalizedSearch}
          ) > 0.2
        ORDER BY max_similarity DESC
      `;

      fuzzyVenueIds = fuzzyVenues.map((v) => v.id);

      if (fuzzyVenueIds.length > 0) {
        where.id = { in: fuzzyVenueIds };
      } else {
        where.id = { in: [] };
      }
    }

    // Services filter
    if (services.length > 0) {
      where.services = {
        hasSome: services as VenueService[],
      };
    }

    // Sport type filter
    if (sports.length > 0) {
      where.sportTypes = {
        hasSome: sports as SportType[],
      };
    }

    // City filter
    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    const skip = (page - 1) * pageSize;

    // If location filtering is enabled, use raw SQL for distance calculation
    if (userLat !== null && userLng !== null && radiusKm !== null && !search) {
      try {
        // Build service filter condition
        let serviceFilter = Prisma.empty;
        if (services.length > 0) {
          const serviceArray = services.map(
            (s) => Prisma.sql`${s}::"VenueService"`
          );
          serviceFilter = Prisma.sql`AND v.services && ARRAY[${Prisma.join(serviceArray, ",")}]`;
        }

        // Build sport filter condition
        let sportFilter = Prisma.empty;
        if (sports.length > 0) {
          const sportArray = sports.map((s) => Prisma.sql`${s}::"SportType"`);
          sportFilter = Prisma.sql`AND v."sportTypes" && ARRAY[${Prisma.join(sportArray, ",")}]`;
        }

        // Use CTE with Haversine formula to calculate distance in km
        const venuesWithDistance = await prisma.$queryRaw<
          {
            id: string;
            slug: string;
            name: string;
            type: string;
            services: string[];
            description: string | null;
            city: string | null;
            country: string;
            latitude: number | null;
            longitude: number | null;
            cover_image: string | null;
            logo: string | null;
            instagram: string | null;
            members_count: bigint;
            sessions_count: bigint;
            distance_km: number;
          }[]
        >`
          WITH venues_with_distance AS (
            SELECT 
              v.id,
              v.slug,
              v.name,
              v.type,
              v.services,
              v.description,
              v.city,
              v.country,
              v.latitude,
              v.longitude,
              v."coverImage" as cover_image,
              v.logo,
              v.instagram,
              (SELECT COUNT(*) FROM "VenueMember" WHERE "venueId" = v.id)::bigint as members_count,
              (SELECT COUNT(*) FROM "VenueSession" WHERE "venueId" = v.id)::bigint as sessions_count,
              (
                6371 * acos(
                  LEAST(1.0, GREATEST(-1.0,
                    cos(radians(${userLat})) * cos(radians(v.latitude)) *
                    cos(radians(v.longitude) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(v.latitude))
                  ))
                )
              ) AS distance_km
            FROM "Venue" v
            WHERE 
              v."isActive" = true
              AND v.latitude IS NOT NULL
              AND v.longitude IS NOT NULL
              ${serviceFilter}
              ${sportFilter}
          )
          SELECT * FROM venues_with_distance
          WHERE distance_km <= ${radiusKm}
          ORDER BY distance_km ASC
          LIMIT ${pageSize}
          OFFSET ${skip}
        `;

        // Get total count for pagination
        const countResult = await prisma.$queryRaw<{ count: bigint }[]>`
          WITH venues_with_distance AS (
            SELECT 
              v.id,
              (
                6371 * acos(
                  LEAST(1.0, GREATEST(-1.0,
                    cos(radians(${userLat})) * cos(radians(v.latitude)) *
                    cos(radians(v.longitude) - radians(${userLng})) +
                    sin(radians(${userLat})) * sin(radians(v.latitude))
                  ))
                )
              ) AS distance_km
            FROM "Venue" v
            WHERE 
              v."isActive" = true
              AND v.latitude IS NOT NULL
              AND v.longitude IS NOT NULL
              ${serviceFilter}
              ${sportFilter}
          )
          SELECT COUNT(*) as count FROM venues_with_distance
          WHERE distance_km <= ${radiusKm}
        `;

        const totalCount = Number(countResult[0]?.count || 0);

        // Transform results to match expected format
        const venues = venuesWithDistance.map((v) => ({
          id: v.id,
          slug: v.slug,
          name: v.name,
          type: v.type,
          services: v.services,
          description: v.description,
          city: v.city,
          country: v.country,
          latitude: v.latitude,
          longitude: v.longitude,
          coverImage: v.cover_image,
          logo: v.logo,
          instagram: v.instagram,
          _count: {
            members: Number(v.members_count),
            sessions: Number(v.sessions_count),
          },
        }));

        return NextResponse.json({
          venues,
          pagination: {
            page,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            hasMore: skip + venues.length < totalCount,
          },
        });
      } catch (sqlError) {
        console.error("Distance filter SQL error:", sqlError);
        // Fall back to non-distance filtered query
      }
    }

    const totalCount = await prisma.venue.count({ where });

    const venues = await prisma.venue.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        services: true,
        description: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        coverImage: true,
        logo: true,
        instagram: true,
        _count: {
          select: {
            members: true,
            sessions: true,
          },
        },
      },
      orderBy: search
        ? undefined
        : {
            createdAt: "desc",
          },
      skip,
      take: pageSize,
    });

    let sortedVenues = venues;
    if (search && fuzzyVenueIds.length > 0) {
      const orderMap = new Map(fuzzyVenueIds.map((id, index) => [id, index]));
      sortedVenues = venues.sort(
        (a, b) =>
          (orderMap.get(a.id) ?? Infinity) - (orderMap.get(b.id) ?? Infinity)
      );
    }

    return NextResponse.json({
      venues: sortedVenues,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: skip + venues.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}

// POST - Create new venue
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      sportTypes,
      description,
      phone,
      email,
      website,
      instagram,
      address,
      city,
      country,
      latitude,
      longitude,
      ownerId, // Optional: if admin is creating for someone else
    } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    // Determine the actual owner
    // If ownerId is provided, verify the user exists (admin creating for someone)
    // Otherwise, the creator becomes the owner
    const actualOwnerId = ownerId || session.user.id;

    if (ownerId && ownerId !== session.user.id) {
      // Only admins can create venues for other users
      if (session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Only admins can create venues for other users" },
          { status: 403 }
        );
      }

      // Verify the owner user exists
      const ownerUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!ownerUser) {
        return NextResponse.json(
          { error: "Owner user not found" },
          { status: 404 }
        );
      }
    }

    // Validate venue type
    if (!Object.values(VenueType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid venue type" },
        { status: 400 }
      );
    }

    // Validate sport types if provided
    if (sportTypes && Array.isArray(sportTypes)) {
      const validSportTypes = sportTypes.every((sport: string) =>
        Object.values(SportType).includes(sport as SportType)
      );
      if (!validSportTypes) {
        return NextResponse.json(
          { error: "Invalid sport type(s)" },
          { status: 400 }
        );
      }
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingSlug = await prisma.venue.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create venue with specified owner (or creator if not specified)
    // createdByUserId tracks who created it (e.g., admin)
    // The owner is set in the members relation
    const venue = await prisma.venue.create({
      data: {
        name,
        slug,
        type,
        sportTypes: sportTypes || [],
        description: description || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        instagram: instagram || null,
        address: address || null,
        city: city || null,
        country: country || "Portugal",
        latitude: latitude || null,
        longitude: longitude || null,
        createdByUserId: session.user.id, // Who created it (e.g., admin)
        members: {
          create: {
            userId: actualOwnerId, // The actual owner
            role: "OWNER",
            status: "ACTIVE",
            joinedAt: new Date(),
          },
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    console.error("Error creating venue:", error);
    return NextResponse.json(
      { error: "Failed to create venue" },
      { status: 500 }
    );
  }
}
