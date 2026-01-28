import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VenueDetailClient } from "@/components/venue-detail-client";
import {
  VenueSSRContent,
  VenueSSRFallback,
} from "@/components/venue-ssr-content";
import { StructuredData } from "@/components/structured-data";
import {
  generateVenueSchema,
  generateVenueBreadcrumbSchema,
  type VenueForStructuredData,
} from "@/lib/structured-data";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Language = "en" | "pt" | "es" | "fr" | "de" | "it";

interface VenueTranslation {
  language: Language;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

// Fetch venue data directly from database for SSR
async function getVenueData(slug: string) {
  const venue = await prisma.venue.findFirst({
    where: {
      OR: [{ id: slug }, { slug: slug }],
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      services: true,
      description: true,
      phone: true,
      email: true,
      website: true,
      instagram: true,
      address: true,
      city: true,
      country: true,
      latitude: true,
      longitude: true,
      logo: true,
      coverImage: true,
      isVerified: true,
      translations: true,
    },
  });

  return venue;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const language = (locale as Language) || "en";
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  const venue = await getVenueData(slug);

  if (!venue) {
    return {
      title: "Venue Not Found",
    };
  }

  // Find translation for current language
  const translation = venue.translations?.find(
    (t) => t.language === language
  ) as VenueTranslation | undefined;

  // Build SEO title and description
  const seoTitle =
    translation?.metaTitle ||
    `${venue.name} - ${venue.city || venue.country} | Athlifyr`;
  const seoDescription =
    translation?.metaDescription ||
    translation?.description?.substring(0, 160) ||
    venue.description?.substring(0, 160) ||
    `${venue.name} - ${venue.type} in ${venue.city || ""}, ${venue.country}. Find services, contact information, and more on Athlifyr.`;

  // Canonical URL - CRITICAL for preventing duplicate content issues
  const canonicalUrl = `${baseUrl}/${locale}/venues/${venue.slug}`;

  // Alternate URLs for all languages
  const alternateLanguages: Record<string, string> = {};
  const supportedLanguages: Language[] = ["en", "pt", "es", "fr", "de", "it"];
  supportedLanguages.forEach((lang) => {
    alternateLanguages[lang] = `${baseUrl}/${lang}/venues/${venue.slug}`;
  });

  return {
    title: seoTitle,
    description: seoDescription,
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "website",
      url: canonicalUrl,
      siteName: "Athlifyr",
      locale:
        locale === "pt"
          ? "pt_PT"
          : locale === "en"
            ? "en_US"
            : `${locale}_${locale.toUpperCase()}`,
      images: venue.coverImage
        ? [
            {
              url: venue.coverImage,
              width: 1200,
              height: 630,
              alt: venue.name,
            },
          ]
        : [
            {
              url: `${baseUrl}/og-image.png`,
              width: 1200,
              height: 630,
              alt: "Athlifyr",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: venue.coverImage
        ? [venue.coverImage]
        : [`${baseUrl}/og-image.png`],
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

export const dynamic = "force-dynamic";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const session = await auth();
  const { slug, locale } = await params;

  // Fetch venue data server-side for SSR content
  const venue = await getVenueData(slug);

  // Return 404 if venue not found
  if (!venue) {
    notFound();
  }

  // Find translation for current language
  const translation = venue.translations?.find((t) => t.language === locale) as
    | VenueTranslation
    | undefined;

  // Prepare venue data for structured data
  const venueForSchema: VenueForStructuredData = {
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    type: venue.type,
    services: venue.services,
    description: venue.description,
    phone: venue.phone,
    email: venue.email,
    website: venue.website,
    instagram: venue.instagram,
    address: venue.address,
    city: venue.city,
    country: venue.country,
    latitude: venue.latitude,
    longitude: venue.longitude,
    logo: venue.logo,
    coverImage: venue.coverImage,
    isVerified: venue.isVerified,
  };

  // Generate structured data schemas
  const venueSchema = generateVenueSchema(
    venueForSchema,
    locale,
    translation?.description
  );
  const breadcrumbSchema = generateVenueBreadcrumbSchema(venue, locale);

  // Check if venue has minimal content for indexing
  const hasMinimalContent =
    venue.name &&
    (venue.description ||
      translation?.description ||
      venue.city ||
      venue.services.length > 0);

  return (
    <>
      {/* JSON-LD Structured Data - Essential for SEO */}
      <StructuredData data={venueSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* SSR Content - Visible to crawlers without JavaScript */}
      <div className="container mx-auto px-4 py-4">
        {hasMinimalContent ? (
          <VenueSSRContent
            venue={venueForSchema}
            translation={translation || null}
            locale={locale}
          />
        ) : (
          <VenueSSRFallback venueName={venue.name} locale={locale} />
        )}
      </div>

      {/* Client-side interactive component - Loads after SSR content */}
      <VenueDetailClient
        slug={slug}
        locale={locale}
        userId={session?.user?.id}
        userName={session?.user?.name}
        userImage={session?.user?.image}
        userRole={session?.user?.role}
      />
    </>
  );
}
