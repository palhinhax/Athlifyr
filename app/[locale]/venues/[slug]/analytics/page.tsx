import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { VenueAnalyticsDashboard } from "@/components/venue-analytics-dashboard";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VenueAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { slug } = await params;

  // Look up venue by slug or id
  const venue = await prisma.venue.findFirst({
    where: {
      OR: [{ id: slug }, { slug: slug }],
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  if (!venue) {
    notFound();
  }

  // Only venue owners, admins, and app admins can access analytics
  const authResult = await canManageVenue(session.user.id, venue.id);
  if (!authResult.authorized) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VenueAnalyticsDashboard
        venueId={venue.id}
        venueName={venue.name}
        venueSlug={venue.slug}
      />
    </div>
  );
}
