import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SUPPORTED_LOCALES = ["pt", "en", "es", "fr", "de", "it"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";

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
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map((locale) => [locale, `${baseUrl}/${locale}`])
        ),
      },
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map((locale) => [
            locale,
            `${baseUrl}/${locale}/events`,
          ])
        ),
      },
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map((locale) => [
            locale,
            `${baseUrl}/${locale}/feed`,
          ])
        ),
      },
    },
  ];

  // Dynamic event pages with language variants
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "weekly" as const,
    priority: event.startDate > new Date() ? 0.9 : 0.6, // Higher priority for upcoming events
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          locale,
          `${baseUrl}/${locale}/events/${event.slug}`,
        ])
      ),
    },
  }));

  return [...staticPages, ...eventPages];
}
