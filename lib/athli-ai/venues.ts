/**
 * Athli AI — Venue search and details
 */

import { prisma } from "@/lib/prisma";
import type { Language } from "@prisma/client";

export interface VenueSearchParams {
  sportTypes?: string[];
  city?: string;
  search?: string;
  venueType?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
}

export async function searchVenues(
  params: VenueSearchParams,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;
  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (params.sportTypes && params.sportTypes.length > 0) {
    where.sportTypes = { hasSome: params.sportTypes };
  }

  if (params.city) {
    where.city = { contains: params.city, mode: "insensitive" };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.venueType) {
    where.type = params.venueType;
  }

  // Coordinate-based proximity search
  if (params.latitude && params.longitude) {
    const radiusKm = params.radiusKm || 30;
    const latDelta = radiusKm / 111;
    const lngDelta =
      radiusKm / (111 * Math.cos((params.latitude * Math.PI) / 180));

    where.latitude = {
      not: null,
      gte: params.latitude - latDelta,
      lte: params.latitude + latDelta,
    };
    where.longitude = {
      not: null,
      gte: params.longitude - lngDelta,
      lte: params.longitude + lngDelta,
    };
  }

  const venues = await prisma.venue.findMany({
    where,
    include: {
      translations: {
        where: { language: lang },
      },
      _count: {
        select: { reviews: true },
      },
    },
    take: params.limit || 10,
  });

  if (venues.length === 0) {
    return "No venues found matching the criteria.";
  }

  return JSON.stringify(
    venues.map((v) => {
      const t = v.translations[0];

      return {
        id: v.id,
        name: v.name,
        slug: v.slug,
        type: v.type,
        sportTypes: v.sportTypes,
        city: v.city,
        country: v.country,
        description:
          t?.description?.substring(0, 200) || v.description?.substring(0, 200),
        reviewCount: v._count.reviews,
        url: `/${locale}/v/${v.slug}`,
      };
    })
  );
}

/**
 * Get detailed information about a specific venue including plans, prices, services, and team.
 */
export async function getVenueDetails(
  venueId: string,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    include: {
      translations: {
        where: { language: lang },
      },
      plans: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          currency: true,
          policy: true,
        },
      },
      members: {
        where: { status: "ACTIVE", role: { in: ["OWNER", "ADMIN", "COACH"] } },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      _count: {
        select: { reviews: true, sessions: true },
      },
    },
  });

  if (!venue) {
    return "Venue not found.";
  }

  const t = venue.translations[0];

  return JSON.stringify({
    id: venue.id,
    name: venue.name,
    slug: venue.slug,
    type: venue.type,
    sportTypes: venue.sportTypes,
    services: venue.services,
    description: (t?.description || venue.description)?.substring(0, 500),
    city: venue.city,
    country: venue.country,
    address: venue.address,
    phone: venue.phone,
    email: venue.email,
    website: venue.website,
    instagram: venue.instagram,
    requiresPlanToBook: venue.requiresPlanToBook,
    enableTrialBooking: venue.enableTrialBooking,
    plans: venue.plans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      currency: p.currency,
    })),
    team: venue.members.map((m) => ({
      name: m.user.name,
      role: m.role,
    })),
    reviewCount: venue._count.reviews,
    sessionCount: venue._count.sessions,
    url: `/${locale}/v/${venue.slug}`,
  });
}
