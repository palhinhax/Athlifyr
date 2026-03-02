import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SUPPORTED_LOCALES = ["pt", "en", "es", "fr", "de", "it"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use canonical www domain for SEO
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  // Get all events for the sitemap
  const events = await prisma.event.findMany({
    select: {
      slug: true,
      updatedAt: true,
      startDate: true,
    },
    where: {
      startDate: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Include events from last 30 days
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  // Static pages with language variants
  // Generate one entry per locale (no redirecting URLs in sitemap)
  const staticPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    (locale) => [
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/${locale}/events`,
        lastModified: new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/${locale}/feed`,
        lastModified: new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/${locale}/presentation/venue`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/presentation/live-race`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ]
  );

  // Dynamic event pages with language variants
  // Generate one entry per locale for each event
  const eventPages: MetadataRoute.Sitemap = events.flatMap((event) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: event.startDate > new Date() ? 0.9 : 0.6, // Higher priority for upcoming events
    }))
  );

  // Sport category pages
  const sportSlugs = [
    "running",
    "trail",
    "walking",
    "hyrox",
    "crossfit",
    "ocr",
    "btt",
    "cycling",
    "surf",
    "triathlon",
    "swimming",
  ];

  // Sport category pages - one entry per locale
  const sportPages: MetadataRoute.Sitemap = sportSlugs.flatMap((sport) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/sports/${sport}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...sportPages, ...eventPages];
}
