import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SportType, Prisma } from "@prisma/client";

// GET - List all events with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const sports = searchParams.getAll("sports");
    const country = searchParams.get("country");

    // Build where clause
    const where: Prisma.EventWhereInput = {
      startDate: {
        gte: new Date(), // Only future events
      },
    };

    // Country filter - default to user's country if not using location
    if (country) {
      where.country = { equals: country, mode: "insensitive" };
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    // Sport type filter
    if (sports.length > 0) {
      where.sportTypes = {
        hasSome: sports as SportType[],
      };
    }

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.event.count({ where });

    // Fetch paginated events
    const events = await prisma.event.findMany({
      where,
      include: {
        variants: {
          include: {
            triathlonSegments: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: {
            startDate: "asc",
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
      skip,
      take: pageSize,
    });

    // Return paginated response with metadata
    return NextResponse.json({
      events,
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
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
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
