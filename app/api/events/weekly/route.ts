import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SportType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sportType = searchParams.get("sportType"); // Optional: filter by sport type
    const startDateParam = searchParams.get("startDate"); // Optional: custom start date (ISO format)

    // Calculate date range for the week
    let weekStart: Date;

    if (startDateParam) {
      // Use custom start date if provided
      weekStart = new Date(startDateParam);
      weekStart.setHours(0, 0, 0, 0);
    } else {
      // Default to today
      weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    // Build where clause
    const whereClause: {
      startDate: { gte: Date; lte: Date };
      sportTypes?: { has: SportType };
    } = {
      startDate: {
        gte: weekStart,
        lte: weekEnd,
      },
    };

    // Add sport type filter if provided
    if (sportType && sportType !== "ALL") {
      if (!Object.values(SportType).includes(sportType as SportType)) {
        return NextResponse.json(
          { error: "Invalid sport type" },
          { status: 400 }
        );
      }
      whereClause.sportTypes = { has: sportType as SportType };
    }

    // Fetch events happening in the next 7 days
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
      take: 10, // Limit to 10 events max
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
      events: formattedEvents,
      total: formattedEvents.length,
      sportType: sportType || "ALL",
      dateRange: {
        start: weekStart.toISOString(),
        end: weekEnd.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching weekly events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
