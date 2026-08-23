import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { EasyBookClient } from "@/components/easy-book/easy-book-client";

// Fetch venue data for Easy Book
async function getVenueForEasyBook(slug: string) {
  const venue = await prisma.venue.findFirst({
    where: {
      OR: [{ id: slug }, { slug: slug }],
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      coverImage: true,
      logo: true,
      city: true,
      country: true,
      requiresPlanToBook: true,
      allowPublicBooking: true,
      defaultBookingAdvanceDays: true,
      defaultBookingDeadlineMinutes: true,
      defaultCancellationDeadlineMinutes: true,
    },
  });

  return venue;
}

// Check if logged-in user has active subscription at this venue
// This includes direct subscriptions AND multi-venue plans that include this venue
async function getUserSubscriptionStatus(userId: string, venueId: string) {
  const now = new Date();

  // 1. Check direct subscription to this venue
  const directSubscription = await prisma.venueSubscription.findFirst({
    where: {
      venueId,
      userId,
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: {
        lte: now, // Subscription must have already started
      },
      OR: [
        { endsAt: null }, // No end date (ongoing)
        { endsAt: { gt: now } }, // Or end date is in the future
      ],
    },
  });

  let hasActiveSubscription = !!directSubscription;

  // 2. If no direct subscription, check for multi-venue plans that include this venue
  if (!hasActiveSubscription) {
    const multiVenueAccess = await prisma.venuePlanVenue.findFirst({
      where: {
        venueId: venueId,
        plan: {
          subscriptions: {
            some: {
              userId: userId,
              status: "ACTIVE",
              paymentStatus: "PAID",
              startsAt: { lte: now },
              OR: [{ endsAt: null }, { endsAt: { gt: now } }],
            },
          },
        },
      },
    });

    hasActiveSubscription = !!multiVenueAccess;
  }

  const member = await prisma.venueMember.findUnique({
    where: {
      venueId_userId: {
        venueId,
        userId,
      },
    },
  });

  return {
    hasActiveSubscription,
    isMember: !!member && member.status === "ACTIVE",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  const venue = await getVenueForEasyBook(slug);

  if (!venue) {
    return {
      title: "Easy Book",
    };
  }

  const seoTitle = `Book at ${venue.name} | Athlifyr`;
  const seoDescription = `Book your class at ${venue.name}${venue.city ? ` in ${venue.city}` : ""}. Quick and easy booking without registration.`;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "website",
      url: `${baseUrl}/${locale}/v/${venue.slug}/book`,
      siteName: "Athlifyr",
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
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EasyBookPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const venue = await getVenueForEasyBook(slug);

  // If venue not found, show 404
  if (!venue) {
    notFound();
  }

  // Check if user is logged in
  const session = await auth();
  const user = session?.user;

  // Get user's subscription status if logged in
  let userStatus = {
    hasActiveSubscription: false,
    isMember: false,
  };

  if (user?.id) {
    userStatus = await getUserSubscriptionStatus(user.id, venue.id);
  }

  return (
    <EasyBookClient
      venue={{
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        coverImage: venue.coverImage,
        logo: venue.logo,
        city: venue.city,
        country: venue.country,
        requiresPlanToBook: venue.requiresPlanToBook,
        allowPublicBooking: venue.allowPublicBooking,
      }}
      locale={locale}
      user={
        user
          ? {
              id: user.id,
              name: user.name || null,
              email: user.email || "",
              hasActiveSubscription: userStatus.hasActiveSubscription,
              isMember: userStatus.isMember,
            }
          : null
      }
    />
  );
}
