import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - List all events for admin (no date filter, no includes)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Admin only
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    // Build where clause - NO date filter for admin (show all events)
    const where: Prisma.EventWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.event.count({ where });

    // Fetch paginated events - NO includes for performance
    const events = await prisma.event.findMany({
      where,
      orderBy: {
        startDate: "desc", // Most recent first for admin
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
    console.error("Error fetching admin events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
