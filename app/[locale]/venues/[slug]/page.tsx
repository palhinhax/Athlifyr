import { auth } from "@/lib/auth";
import { VenueDetailClient } from "@/components/venue-detail-client";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { slug } = await Promise.resolve(params);

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

    return {
      title: `${venue.name} - Athlifyr`,
      description: venue.description || `${venue.name} - ${venue.city}`,
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
  params: { slug: string };
}) {
  const session = await auth();
  const { slug } = await Promise.resolve(params);

  return <VenueDetailClient slug={slug} userId={session?.user?.id} />;
}
