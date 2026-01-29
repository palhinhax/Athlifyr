import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { VenueService, SportType, Prisma } from "@prisma/client";

// GET - Fetch venues for map view with bounds
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const north = parseFloat(searchParams.get("north") || "90");
    const south = parseFloat(searchParams.get("south") || "-90");
    const east = parseFloat(searchParams.get("east") || "180");
    const west = parseFloat(searchParams.get("west") || "-180");
    const services = searchParams.getAll("services");
    const sports = searchParams.getAll("sports");

    // Build where clause
    const where: Prisma.VenueWhereInput = {
      isActive: true,
      latitude: {
        not: null,
        gte: south,
        lte: north,
      },
      longitude: {
        not: null,
        gte: west,
        lte: east,
      },
    };

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

    // Fetch venues within bounds
    const venues = await prisma.venue.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        services: true,
      },
      take: 500, // Limit for performance
    });

    return NextResponse.json({
      venues,
      count: venues.length,
    });
  } catch (error) {
    console.error("Error fetching venues for map:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}
