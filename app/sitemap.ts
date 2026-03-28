import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  // Only include future events with complete data (description + city)
  const events = await prisma.event.findMany({
    select: {
      slug: true,
      updatedAt: true,
      description: true,
      city: true,
    },
    where: {
      startDate: { gte: new Date() },
      cancelled: false,
      description: { not: "" },
      city: { not: "" },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  // Static pages — only canonical locale (pt)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pt`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pt/events`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pt/presentation/venue`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pt/presentation/live-race`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pt/venues/join`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pt/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pt/video-analysis`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pt/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Event pages — only canonical locale (pt), only future + complete events
  const eventPages: MetadataRoute.Sitemap = events
    .filter(
      (e) => e.description.trim().length >= 10 && e.city.trim().length > 0
    )
    .map((event) => ({
      url: `${baseUrl}/pt/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  // Sport category pages — only canonical locale (pt)
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

  const sportPages: MetadataRoute.Sitemap = sportSlugs.map((sport) => ({
    url: `${baseUrl}/pt/sports/${sport}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...sportPages, ...eventPages];
}
