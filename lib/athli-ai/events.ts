/**
 * Athli AI — Event search, details, and user events
 */

import { prisma } from "@/lib/prisma";
import type { Language } from "@prisma/client";

export interface EventSearchParams {
  sportTypes?: string[];
  city?: string;
  country?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  limit?: number;
}

export async function searchEvents(
  params: EventSearchParams,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;
  const where: Record<string, unknown> = {
    startDate: { gte: new Date() },
    cancelled: false,
  };

  if (params.sportTypes && params.sportTypes.length > 0) {
    where.sportTypes = { hasSome: params.sportTypes };
  }

  if (params.country) {
    where.country = { contains: params.country, mode: "insensitive" };
  }

  if (params.fromDate) {
    where.startDate = {
      ...(where.startDate as Record<string, unknown>),
      gte: new Date(params.fromDate),
    };
  }

  if (params.toDate) {
    const endDate = new Date(params.toDate);
    endDate.setUTCHours(23, 59, 59, 999);
    where.startDate = {
      ...(where.startDate as Record<string, unknown>),
      lte: endDate,
    };
  }

  const orConditions: Record<string, unknown>[] = [];

  if (params.city) {
    orConditions.push(
      { city: { contains: params.city, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            city: { contains: params.city, mode: "insensitive" },
          },
        },
      }
    );
  }

  if (params.search) {
    orConditions.push(
      { title: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            title: { contains: params.search, mode: "insensitive" },
          },
        },
      }
    );
  }

  if (params.city && params.search) {
    const cityConditions = [
      { city: { contains: params.city, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            city: { contains: params.city, mode: "insensitive" },
          },
        },
      },
    ];
    const searchConditions = [
      { title: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            title: { contains: params.search, mode: "insensitive" },
          },
        },
      },
    ];
    where.AND = [{ OR: cityConditions }, { OR: searchConditions }];
  } else if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      translations: {
        where: { language: lang },
      },
      variants: {
        select: {
          name: true,
          distanceKm: true,
          price: true,
          elevationGainM: true,
        },
      },
      weather: {
        orderBy: { date: "asc" },
        select: {
          date: true,
          temperature: true,
          condition: true,
          humidity: true,
          windSpeed: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
    take: params.limit || 10,
  });

  if (events.length === 0) {
    return "No events found matching the criteria.";
  }

  return JSON.stringify(
    events.map((e) => {
      const t = e.translations[0];
      return {
        id: e.id,
        title: t?.title || e.title,
        slug: e.slug,
        date: e.startDate.toISOString().split("T")[0],
        city: t?.city || e.city,
        country: e.country,
        sportTypes: e.sportTypes,
        variants: e.variants.map((v) => ({
          name: v.name,
          distanceKm: v.distanceKm,
          price: v.price,
          elevationGainM: v.elevationGainM,
        })),
        weather:
          e.weather.length > 0
            ? e.weather.map((w) => ({
                date: w.date.toISOString().split("T")[0],
                temperature: w.temperature,
                condition: w.condition,
                humidity: w.humidity,
                windSpeed: w.windSpeed,
              }))
            : undefined,
        url: `/${locale}/events/${e.slug}`,
      };
    })
  );
}

export async function getEventDetails(
  eventId: string,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      translations: {
        where: { language: lang },
      },
      variants: {
        include: {
          translations: {
            where: { language: lang },
          },
        },
      },
      pricingPhases: true,
      weather: {
        orderBy: { date: "asc" },
      },
      faqs: {
        include: {
          translations: {
            where: { language: lang },
          },
        },
      },
    },
  });

  if (!event) {
    return "Event not found.";
  }

  const t = event.translations[0];

  return JSON.stringify({
    id: event.id,
    title: t?.title || event.title,
    slug: event.slug,
    description: (t?.description || event.description).substring(0, 500),
    date: event.startDate.toISOString().split("T")[0],
    endDate: event.endDate?.toISOString().split("T")[0],
    city: t?.city || event.city,
    country: event.country,
    sportTypes: event.sportTypes,
    registrationDeadline: event.registrationDeadline
      ?.toISOString()
      .split("T")[0],
    externalUrl: event.externalUrl,
    variants: event.variants.map((v) => {
      const vt = v.translations[0];
      return {
        name: vt?.name || v.name,
        distanceKm: v.distanceKm,
        price: v.price,
        elevationGainM: v.elevationGainM,
        elevationLossM: v.elevationLossM,
        itraPoints: v.itraPoints,
        atrpGrade: v.atrpGrade,
        cutoffTimeHours: v.cutoffTimeHours,
      };
    }),
    pricingPhases: event.pricingPhases.map((p) => ({
      name: p.name,
      price: p.price,
      startDate: p.startDate.toISOString().split("T")[0],
      endDate: p.endDate.toISOString().split("T")[0],
    })),
    weather:
      event.weather.length > 0
        ? event.weather.map((w) => ({
            date: w.date.toISOString().split("T")[0],
            temperature: w.temperature,
            condition: w.condition,
            humidity: w.humidity,
            windSpeed: w.windSpeed,
          }))
        : undefined,
    url: `/${locale}/events/${event.slug}`,
  });
}

export async function getUserEvents(
  userId: string,
  locale: string,
  upcoming?: boolean
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const where: Record<string, unknown> = {
    userId,
  };

  const participations = await prisma.participation.findMany({
    where,
    include: {
      event: {
        include: {
          translations: {
            where: { language: lang },
          },
          variants: {
            select: {
              id: true,
              name: true,
              distanceKm: true,
              elevationGainM: true,
            },
          },
        },
      },
      variant: {
        select: {
          id: true,
          name: true,
          distanceKm: true,
          elevationGainM: true,
        },
      },
    },
    orderBy: {
      event: { startDate: "asc" },
    },
  });

  const now = new Date();
  const filtered =
    upcoming === undefined
      ? participations
      : participations.filter((p) =>
          upcoming ? p.event.startDate >= now : p.event.startDate < now
        );

  if (filtered.length === 0) {
    return upcoming ? "You have no upcoming events." : "No events found.";
  }

  return JSON.stringify(
    filtered.map((p) => {
      const e = p.event;
      const t = e.translations[0];
      return {
        participationId: p.id,
        status: p.status,
        eventId: e.id,
        title: t?.title || e.title,
        slug: e.slug,
        date: e.startDate.toISOString().split("T")[0],
        city: t?.city || e.city,
        country: e.country,
        sportTypes: e.sportTypes,
        cancelled: e.cancelled,
        registeredVariant: p.variant
          ? {
              name: p.variant.name,
              distanceKm: p.variant.distanceKm,
              elevationGainM: p.variant.elevationGainM,
            }
          : null,
        allVariants: e.variants.map((v) => ({
          name: v.name,
          distanceKm: v.distanceKm,
          elevationGainM: v.elevationGainM,
        })),
        completionTime: p.completionTime,
        url: `/${locale}/events/${e.slug}`,
      };
    })
  );
}
