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
    const incompleteOnly = searchParams.get("incompleteOnly") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    // Build where clause - NO date filter for admin (show all events)
    const where: Prisma.EventWhereInput = {};

    // Incomplete events filter - only show events with missing required fields
    if (incompleteOnly) {
      where.OR = [
        { imageUrl: null },
        { imageUrl: "" }, // Empty string
        { latitude: null },
        { longitude: null },
        { googleMapsUrl: null },
        { externalUrl: null },
        { description: "" }, // Empty string for non-nullable field
      ];
    }

    // Search filter - optimized for performance
    if (search) {
      const searchTerm = search.trim();

      // If search is short (< 3 chars), only search exact matches for better performance
      if (searchTerm.length < 3) {
        where.OR = [
          { title: { startsWith: searchTerm, mode: "insensitive" } },
          { city: { startsWith: searchTerm, mode: "insensitive" } },
        ];
      } else {
        // For longer searches, use contains but limit to key fields
        where.OR = [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { city: { equals: searchTerm, mode: "insensitive" } }, // Exact match for city (indexed)
          { slug: { contains: searchTerm, mode: "insensitive" } },
        ];
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // For search queries, get count and events in parallel for better performance
    const [totalCount, events] = await Promise.all([
      // Skip expensive count for large result sets when searching
      search
        ? prisma.event.count({ where }).catch(() => 999) // Return approximate count on timeout
        : prisma.event.count({ where }),

      // Fetch paginated events - NO includes for performance
      prisma.event.findMany({
        where,
        orderBy: {
          startDate: "desc", // Most recent first for admin
        },
        skip,
        take: pageSize,
      }),
    ]);

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
