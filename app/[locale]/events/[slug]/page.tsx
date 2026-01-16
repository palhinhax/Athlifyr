import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/event-utils";
import type { Metadata } from "next";
import { EventRegistration } from "@/components/event-registration";
import { auth } from "@/lib/auth";
import {
  generateSportsEventSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import { EventHeader } from "@/components/event-header";
import { EventMetaInfo } from "@/components/event-meta-info";
import { EventVariantsList } from "@/components/event-variants-list";
import { EventSidebar } from "@/components/event-sidebar";
import { EventCommunity } from "@/components/event-community";
import { EventLocationMobile } from "@/components/event-location-mobile";
import { EventPageHeader } from "@/components/event-page-header";
import { EventMainContent } from "@/components/event-main-content";
import { Language } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { generateEventMetadata } from "@/lib/event-metadata";
import { getFriendsGoing } from "@/lib/event-friends";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
}

async function getEvent(
  slug: string,
  userId?: string,
  locale: Language = "pt" as Language
) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      translations: {
        where: {
          language: locale,
        },
      },
      variants: {
        include: {
          translations: {
            where: {
              language: locale,
            },
          },
          pricingPhases: {
            orderBy: {
              startDate: "asc",
            },
          },
        },
        orderBy: {
          startDate: "asc",
        },
      },
      pricingPhases: {
        orderBy: {
          startDate: "asc",
        },
      },
      posts: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: userId
            ? {
                where: {
                  userId,
                },
                select: {
                  id: true,
                },
              }
            : false,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      },
    },
  });

  if (!event) return null;

  // Apply variant translations
  const translatedVariants = event.variants.map((variant) => {
    const variantTranslation = variant.translations[0];
    if (variantTranslation) {
      return {
        ...variant,
        name: variantTranslation.name || variant.name,
        description: variantTranslation.description || variant.description,
      };
    }
    return variant;
  });

  // Use translated content if available, with fallbacks
  const translation = event.translations[0];
  if (translation) {
    return {
      ...event,
      title: translation.title || event.title,
      description: translation.description || event.description,
      city: translation.city || event.city,
      variants: translatedVariants,
    };
  }

  return {
    ...event,
    variants: translatedVariants,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await Promise.resolve(params);
  const locale: Language = (
    localeParam in Language ? localeParam : "pt"
  ) as Language;

  const event = await getEvent(slug, undefined, locale);

  if (!event) {
    return {
      title: "Evento não encontrado - Athlifyr",
      description: "O evento que procura não foi encontrado.",
    };
  }

  return generateEventMetadata({ event });
}

export default async function EventPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await Promise.resolve(params);
  const locale: Language = (
    localeParam in Language ? localeParam : "pt"
  ) as Language;

  const t = await getTranslations("events");
  const session = await auth();
  const event = await getEvent(slug, session?.user?.id, locale);
  const isAdmin = session?.user?.role === "ADMIN";

  if (!event) {
    notFound();
  }

  // Generate structured data schemas
  const sportsEventSchema = generateSportsEventSchema(event);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Eventos", url: `/${locale}/events` },
    { name: event.title, url: `/${locale}/events/${event.slug}` },
  ]);

  // Get friends going to this event
  const { friendsGoing, friendsGoingCount } = await getFriendsGoing(
    event.id,
    session?.user?.id
  );

  // Prepare event data for header component
  const eventForHeader = {
    id: event.id,
    title: event.title,
    description: event.description,
    sportTypes: event.sportTypes,
    startDate: event.startDate,
    endDate: event.endDate,
    city: event.city,
    country: event.country,
    latitude: event.latitude,
    longitude: event.longitude,
    googleMapsUrl: event.googleMapsUrl,
    imageUrl: event.imageUrl,
    externalUrl: event.externalUrl,
    variants: event.variants.map((v) => ({
      id: v.id,
      name: v.name,
      distanceKm: v.distanceKm,
      startDate: v.startDate,
      startTime: v.startTime,
    })),
  };

  const shareDescription = `${event.title} - ${formatDate(event.startDate, locale)} em ${event.city}`;

  // Get variant labels for i18n
  const variantLabels = {
    title: t("variants.title"),
    distances: t("variants.distances"),
    distance: t("variants.distance"),
    elevationGain: t("variants.elevationGain"),
    elevationLoss: t("variants.elevationLoss"),
    cutoffTime: t("variants.cutoffTime"),
    time: t("variants.time"),
    prices: t("variants.prices"),
    currentPhase: t("variants.currentPhase"),
  };

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={sportsEventSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Back button, Admin Actions, and Share */}
      <EventPageHeader
        isAdmin={isAdmin}
        event={eventForHeader}
        shareDescription={shareDescription}
      />

      {/* Event Header */}
      <EventHeader
        title={event.title}
        imageUrl={event.imageUrl}
        sportTypes={event.sportTypes}
      />

      {/* Event Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Main Content - Left Column */}
          <div className="max-w-4xl">
            {/* Variants List with Distances */}
            <EventVariantsList
              variants={event.variants}
              labels={variantLabels}
            />

            {/* Meta Info */}
            <EventMetaInfo
              startDate={event.startDate}
              endDate={event.endDate}
              city={event.city}
              country={event.country}
              friendsGoing={friendsGoing}
              friendsGoingCount={friendsGoingCount}
            />

            {/* Location Map - Mobile Only */}
            {event.latitude && event.longitude && (
              <EventLocationMobile
                latitude={event.latitude}
                longitude={event.longitude}
                title={event.title}
                city={event.city}
                country={event.country}
                googleMapsUrl={event.googleMapsUrl}
              />
            )}

            {/* Description, Pricing, and CTA */}
            <EventMainContent
              description={event.description}
              pricingPhases={event.pricingPhases}
              externalUrl={event.externalUrl}
              translations={{
                aboutEvent: t("aboutEvent"),
                readyToParticipate: t("readyToParticipate"),
                moreInfoDescription: t("moreInfoDescription"),
                goToWebsite: t("goToWebsite"),
              }}
            />

            {/* Event Registration */}
            <div className="mt-12">
              <EventRegistration
                eventId={event.id}
                variants={event.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  distanceKm: v.distanceKm,
                }))}
              />
            </div>

            {/* Community Section */}
            <EventCommunity
              eventId={event.id}
              eventTitle={event.title}
              eventSlug={event.slug}
              posts={event.posts.map((post) => ({
                id: post.id,
                content: post.content,
                imageUrl: post.imageUrl,
                userId: post.userId,
                createdAt: post.createdAt.toISOString(),
                user: post.user,
                likesCount: post._count.likes,
                isLikedByUser:
                  Array.isArray(post.likes) && post.likes.length > 0,
                commentsCount: post._count.comments,
              }))}
              currentUserId={session?.user?.id}
              isAdmin={isAdmin}
            />
          </div>

          {/* Sidebar - Right Column (Desktop only) */}
          <EventSidebar
            event={{
              title: event.title,
              imageUrl: event.imageUrl,
              startDate: event.startDate,
              city: event.city,
              country: event.country,
              latitude: event.latitude,
              longitude: event.longitude,
              googleMapsUrl: event.googleMapsUrl,
            }}
          />
        </div>
      </div>
    </div>
  );
}
