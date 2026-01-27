import { auth } from "@/lib/auth";
import { VenueDetailClient } from "@/components/venue-detail-client";

type Language = "en" | "pt" | "es" | "fr" | "de" | "it";

interface VenueTranslation {
  language: Language;
  metaTitle: string | null;
  metaDescription: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { slug, locale } = await Promise.resolve(params);
  const language = (locale as Language) || "en";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/venues/${slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        title: "Venue Not Found",
      };
    }

    const venue = await response.json();

    // Fetch SEO translations
    let seoTitle = `${venue.name} - Athlifyr`;
    let seoDescription = venue.description || `${venue.name} - ${venue.city}`;

    try {
      const seoResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/venues/${slug}/seo`,
        { cache: "no-store" }
      );

      if (seoResponse.ok) {
        const seoData = await seoResponse.json();
        const translation = seoData.translations?.find(
          (t: VenueTranslation) => t.language === language
        );

        if (translation) {
          if (translation.metaTitle) {
            seoTitle = translation.metaTitle;
          }
          if (translation.metaDescription) {
            seoDescription = translation.metaDescription;
          }
        }
      }
    } catch {
      // If SEO fetch fails, use defaults
    }

    return {
      title: seoTitle,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: "website",
        images: venue.coverImage ? [venue.coverImage] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: venue.coverImage ? [venue.coverImage] : [],
      },
    };
  } catch {
    return {
      title: "Venue Not Found",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function VenueDetailPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const session = await auth();
  const { slug, locale } = await Promise.resolve(params);

  return (
    <VenueDetailClient
      slug={slug}
      locale={locale}
      userId={session?.user?.id}
      userName={session?.user?.name}
      userImage={session?.user?.image}
      userRole={session?.user?.role}
    />
  );
}
