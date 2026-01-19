import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VenueType, SportType, Prisma } from "@prisma/client";

// GET - List all venues with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const types = searchParams.getAll("types");
    const sports = searchParams.getAll("sports");
    const city = searchParams.get("city");

    // Build where clause
    const where: Prisma.VenueWhereInput = {
      isActive: true,
    };

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    // Types filter
    if (types.length > 0) {
      where.type = { in: types as VenueType[] };
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

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.venue.count({ where });

    // Fetch paginated venues
    const venues = await prisma.venue.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    // Return paginated response with metadata
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
