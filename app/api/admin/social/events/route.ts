import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/social/events
 *
 * Returns upcoming events with images for the social service
 * to auto-generate Instagram posts.
 *
 * Query params:
 *   - days: number of days ahead to look (default: 7)
 *   - sport: filter by sport type (e.g. "TRAIL")
 *   - limit: max results (default: 20)
 *   - lang: language for translations (default: "pt")
 */
export async function GET(request: NextRequest) {
  try {
    // Validate internal secret
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.SOCIAL_API_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get("days") || "7", 10), 90);
    const sport = searchParams.get("sport") || undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
    const lang = searchParams.get("lang") || "pt";

    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const events = await prisma.event.findMany({
      where: {
        startDate: { gte: now, lte: endDate },
        cancelled: false,
        ...(sport ? { sportTypes: { has: sport as never } } : {}),
      },
      select: {
        id: true,
        slug: true,
        title: true,
        startDate: true,
        endDate: true,
        city: true,
        country: true,
        imageUrl: true,
        sportTypes: true,
        translations: {
          where: { language: lang as never },
          select: {
            title: true,
            description: true,
            city: true,
          },
        },
        variants: {
          select: {
            name: true,
            distanceKm: true,
            elevationGainM: true,
          },
          orderBy: { distanceKm: "desc" },
        },
      },
      orderBy: { startDate: "asc" },
      take: limit,
    });

    // Map to a clean shape
    const result = events.map((event) => {
      const translation = event.translations[0];
      return {
        id: event.id,
        slug: event.slug,
        title: translation?.title || event.title,
        city: translation?.city || event.city,
        country: event.country,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate?.toISOString() || null,
        imageUrl: event.imageUrl,
        sportTypes: event.sportTypes,
        variants: event.variants.map((v) => ({
          name: v.name,
          distanceKm: v.distanceKm,
          elevationGainM: v.elevationGainM,
        })),
      };
    });

    return NextResponse.json({ events: result, total: result.length });
  } catch (error) {
    console.error("Error fetching events for social:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
