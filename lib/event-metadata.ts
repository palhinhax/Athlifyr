import { formatDate, sportTypeLabels } from "@/lib/event-utils";
import type { Metadata } from "next";
import { SportType } from "@prisma/client";

// Map locale codes to Open Graph locale format
const localeToOgLocale: Record<string, string> = {
  pt: "pt_PT",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
};

interface EventMetadataProps {
  event: {
    slug: string;
    title: string;
    description: string;
    sportTypes: SportType[];
    startDate: Date;
    city: string;
    country: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    // SEO fields from translations
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
  locale?: string;
}

export async function generateEventMetadata({
  event,
  locale = "pt",
}: EventMetadataProps): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const eventUrl = `${baseUrl}/${locale}/events/${event.slug}`;

  // Ensure image URL is absolute
  let eventImage = event.imageUrl || `${baseUrl}/logo.png`;

  // If imageUrl exists but is relative, make it absolute
  if (event.imageUrl && !event.imageUrl.startsWith("http")) {
    eventImage = `${baseUrl}${event.imageUrl.startsWith("/") ? "" : "/"}${event.imageUrl}`;
  }

  // Use custom metaTitle from translations if available, otherwise generate
  const title = event.metaTitle
    ? event.metaTitle
    : `${event.title} - ${sportTypeLabels[event.sportTypes[0]]} | Athlifyr`;

  // Use custom metaDescription from translations if available, otherwise generate
  let metaDescription: string;
  if (event.metaDescription) {
    metaDescription = event.metaDescription;
  } else {
    // Create rich description with event details (max 160 chars for SEO)
    const suffix = ` | ${formatDate(event.startDate)} | ${event.city}, ${event.country}`;
    const maxDescLength = 160 - suffix.length - 4; // 4 for "... " ellipsis

    if (event.description.length + suffix.length <= 160) {
      // Description is short enough to fit with suffix
      metaDescription = event.description + suffix;
    } else {
      // Need to truncate description
      const truncatedDesc =
        event.description.slice(0, maxDescLength).trim() + "...";
      metaDescription = truncatedDesc + suffix;
    }
  }

  // Keywords based on event type and location
  const keywords = [
    event.title,
    ...event.sportTypes.map((st) => sportTypeLabels[st]),
    event.city,
    event.country,
    "eventos desportivos",
    "competição",
    formatDate(event.startDate),
  ];

  return {
    title,
    description: metaDescription,
    keywords: keywords.join(", "),
    alternates: {
      canonical: eventUrl,
    },
    openGraph: {
      title: `${event.title} - ${sportTypeLabels[event.sportTypes[0]]}`,
      description: event.description,
      url: eventUrl,
      siteName: "Athlifyr",
      images: [
        {
          url: eventImage,
          width: 1200,
          height: 630,
          alt: `${event.title} - ${sportTypeLabels[event.sportTypes[0]]}`,
        },
      ],
      locale: localeToOgLocale[locale] || "pt_PT",
      type: "article",
      publishedTime: event.createdAt.toISOString(),
      modifiedTime: event.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} - ${sportTypeLabels[event.sportTypes[0]]}`,
      description: event.description,
      images: [eventImage],
      creator: "@athlifyr",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
