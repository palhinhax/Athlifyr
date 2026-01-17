import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SportType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // Format: "2026-01" (YYYY-MM)
    const sportType = searchParams.get("sportType"); // e.g., "TRAIL", "RUNNING"

    if (!month || !sportType) {
      return NextResponse.json(
        { error: "Month and sportType are required" },
        { status: 400 }
      );
    }

    // Validate sport type
    if (
      sportType !== "ALL" &&
      !Object.values(SportType).includes(sportType as SportType)
    ) {
      return NextResponse.json(
        { error: "Invalid sport type" },
        { status: 400 }
      );
    }

    // Parse month (YYYY-MM)
    const [year, monthNum] = month.split("-").map(Number);
    if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { error: "Invalid month format. Use YYYY-MM" },
        { status: 400 }
      );
    }

    // Calculate date range for the month
    const startDate = new Date(year, monthNum - 1, 1); // First day of month
    const endDate = new Date(year, monthNum, 0, 23, 59, 59); // Last day of month

    // Build where clause
    const whereClause: {
      startDate: { gte: Date; lte: Date };
      sportTypes?: { has: SportType };
    } = {
      startDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Add sport type filter if not "ALL"
    if (sportType !== "ALL") {
      whereClause.sportTypes = { has: sportType as SportType };
    }

    // Fetch events
    const events = await prisma.event.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        city: true,
        country: true,
      },
      orderBy: {
        startDate: "asc",
      },
      take: 10, // Limit to 10 events max for the template
    });

    // Format events for Instagram template
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      date: new Date(event.startDate).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "short",
      }),
      location: event.city,
    }));

    return NextResponse.json({
      month: new Date(year, monthNum - 1).toLocaleDateString("pt-PT", {
        month: "long",
        year: "numeric",
      }),
      sportType,
      events: formattedEvents,
      total: formattedEvents.length,
    });
  } catch (error) {
    console.error("Error fetching monthly events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
