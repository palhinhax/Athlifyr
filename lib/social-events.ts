import { prisma } from "@/lib/prisma";

export interface SocialEventData {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string | null;
  imageUrl: string | null;
  sportTypes: string[];
  variants: Array<{
    name: string;
    distanceKm: number | null;
    elevationGainM: number | null;
  }>;
}

/**
 * Fetch upcoming events for social post generation.
 * Used by both the events API route and the generate proxy routes.
 */
export async function fetchEventsForSocial(params: {
  days: number;
  sport?: string;
  limit?: number;
  lang?: string;
}): Promise<SocialEventData[]> {
  const { days, sport, limit = 20, lang = "pt" } = params;

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
    take: Math.min(limit, 50),
  });

  return events.map((event) => {
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
}
