import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/event-utils";
import type { Metadata } from "next";
import { EventRegistration } from "@/components/event-registration";
import { EventPastParticipation } from "@/components/event-past-participation";
import { GiveawayCard } from "@/components/giveaway-card";
import { auth } from "@/lib/auth";
import {
  generateSportsEventSchema,
  generateBreadcrumbSchema,
  generateEventFAQSchemaFromDB,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import { EventHeader } from "@/components/event-header";
import { EventMetaInfo } from "@/components/event-meta-info";
import { EventVariantsList } from "@/components/event-variants-list";
import { EventSidebar } from "@/components/event-sidebar";
import { EventCommunity } from "@/components/event-community";
import { EventLocationMobile } from "@/components/event-location-mobile";
import { EventWeatherMobile } from "@/components/event-weather-mobile";
import { EventMainContent } from "@/components/event-main-content";
import { EventFAQ } from "@/components/event-faq";
import { RelatedEvents } from "@/components/related-events";
import { LiveRaceSection } from "@/components/live-race-section";
import { LiveRaceCheckinBanner } from "@/components/live-race-checkin-banner";
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
      featuredVenue: {
        select: {
          id: true,
          slug: true,
          name: true,
          type: true,
          logo: true,
          city: true,
          country: true,
          services: true,
          _count: {
            select: {
              recommendations: true,
              reviews: true,
            },
          },
        },
      },
      variants: {
        include: {
          translations: {
            where: {
              language: locale,
            },
          },
          triathlonSegments: {
            orderBy: {
              order: "asc",
            },
          },
          pricingPhases: {
            orderBy: {
              startDate: "asc",
            },
          },
          _count: {
            select: {
              registrations: {
                where: {
                  status: "CONFIRMED",
                },
              },
              participations: {
                where: {
                  status: "going",
                },
              },
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
      faqs: {
        include: {
          translations: {
            where: {
              language: locale,
            },
          },
        },
        orderBy: {
          order: "asc",
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
      weather: {
        orderBy: {
          date: "asc",
        },
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

  // Apply FAQ translations
  const translatedFaqs = event.faqs.map((faq) => {
    const faqTranslation = faq.translations[0];
    if (faqTranslation) {
      return {
        ...faq,
        question: faqTranslation.question || faq.question,
        answer: faqTranslation.answer || faq.answer,
      };
    }
    return faq;
  });

  // Use translated content if available, with fallbacks
  const translation = event.translations[0];
  if (translation) {
    return {
      ...event,
      title: translation.title || event.title,
      description: translation.description || event.description,
      city: translation.city || event.city,
      metaTitle: translation.metaTitle || null,
      metaDescription: translation.metaDescription || null,
      variants: translatedVariants,
      faqs: translatedFaqs,
    };
  }

  return {
    ...event,
    metaTitle: null,
    metaDescription: null,
    variants: translatedVariants,
    faqs: translatedFaqs,
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

  return generateEventMetadata({ event, locale });
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

  // Check if the current user is an organizer of this event
  const isOrganizer =
    !isAdmin &&
    !!session?.user?.id &&
    !!event &&
    (await prisma.eventOrganizer.findFirst({
      where: { eventId: event.id, userId: session.user.id },
      select: { id: true },
    })) !== null;

  if (!event) {
    notFound();
  }

  // Generate structured data schemas
  const sportsEventSchema = generateSportsEventSchema(event);
  const faqSchema = generateEventFAQSchemaFromDB(
    event.faqs.map((f) => ({ question: f.question, answer: f.answer }))
  );
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

  // Get related events for internal linking (same sport type, same region, or upcoming)
  const relatedEvents = await prisma.event.findMany({
    where: {
      AND: [
        { id: { not: event.id } }, // Exclude current event
        { startDate: { gte: new Date() } }, // Only future events
        {
          OR: [
            { sportTypes: { hasSome: event.sportTypes } }, // Same sport
            { country: event.country }, // Same country
            { city: event.city }, // Same city
          ],
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      city: true,
      country: true,
      startDate: true,
      imageUrl: true,
      sportTypes: true,
      translations: {
        where: {
          language: locale,
        },
        select: {
          title: true,
          city: true,
        },
      },
    },
    orderBy: [{ startDate: "asc" }],
    take: 6,
  });

  // Apply translations to related events
  const translatedRelatedEvents = relatedEvents.map((e) => {
    const translation = e.translations[0];
    return {
      id: e.id,
      slug: e.slug,
      title: translation?.title || e.title,
      city: translation?.city || e.city,
      country: e.country,
      startDate: e.startDate,
      imageUrl: e.imageUrl,
      sportTypes: e.sportTypes,
    };
  });

  // Prepare event data for header component
  const eventForHeader = {
    id: event.id,
    slug: event.slug,
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
    stravaRouteEmbed: event.stravaRouteEmbed,
    featuredVenueId: event.featuredVenueId,
    cancelled: event.cancelled,
    cancellationReason: event.cancellationReason,
    featuredVenue: event.featuredVenue,
    variants: event.variants.map((v) => ({
      id: v.id,
      name: v.name,
      distanceKm: v.distanceKm,
      elevationGainM: v.elevationGainM,
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
    soldOut: t("registration.soldOut"),
    spotsLeft: t("variants.spotsLeft"),
  };

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={sportsEventSchema} />
      {faqSchema && <StructuredData data={faqSchema} />}
      <StructuredData data={breadcrumbSchema} />

      {/* Event Header with Navigation and Title */}
      <EventHeader
        title={event.title}
        imageUrl={event.imageUrl}
        sportTypes={event.sportTypes}
        isAdmin={isAdmin}
        isOrganizer={isOrganizer}
        event={eventForHeader}
        shareDescription={shareDescription}
        locale={locale}
      />

      {/* Event Details */}
      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Main Content - Left Column */}
          <div className="min-w-0 overflow-hidden">
            {/* Giveaway Banner - Top of Content */}
            {!event.cancelled && (
              <div className="mb-6">
                <GiveawayCard eventId={event.id} />
              </div>
            )}

            {/* Meta Info - Date and Location */}
            <EventMetaInfo
              startDate={event.startDate}
              endDate={event.endDate}
              city={event.city}
              country={event.country}
              friendsGoing={friendsGoing}
              friendsGoingCount={friendsGoingCount}
            />

            {/* Variants List with Distances */}
            <EventVariantsList
              variants={event.variants.map((v) => ({
                ...v,
                registrationCount:
                  v._count.registrations + v._count.participations,
              }))}
              labels={variantLabels}
              eventId={event.id}
            />

            {/* LiveRace Section — visible when hasLiveRace */}
            {event.hasLiveRace && event.liveStatus === "CHECK_IN_OPEN" && (
              <div className="mt-6">
                <LiveRaceCheckinBanner />
              </div>
            )}
            {event.hasLiveRace && event.liveStatus !== "CHECK_IN_OPEN" && (
              <div className="mt-6">
                <LiveRaceSection eventId={event.id} />
              </div>
            )}

            {/* Location Map - Mobile Only */}
            {event.latitude && event.longitude && (
              <EventLocationMobile
                latitude={event.latitude}
                longitude={event.longitude}
                title={event.title}
                city={event.city}
                country={event.country}
                googleMapsUrl={event.googleMapsUrl}
                sportTypes={event.sportTypes}
              />
            )}

            {/* Weather Forecast - Mobile Only */}
            {event.weather && event.weather.length > 0 && (
              <EventWeatherMobile
                weather={event.weather}
                isPastEvent={
                  new Date(event.endDate || event.startDate) < new Date()
                }
              />
            )}

            {/* Description, Pricing, and CTA */}
            <EventMainContent
              description={event.description}
              pricingPhases={event.pricingPhases}
              variants={event.variants.map((v) => ({
                id: v.id,
                name: v.name,
              }))}
              externalUrl={event.externalUrl}
              stravaRouteEmbed={event.stravaRouteEmbed}
              cancelled={event.cancelled}
              hasRegistrations={event.hasRegistrations}
              translations={{
                aboutEvent: t("aboutEvent"),
                readyToParticipate: t("readyToParticipate"),
                moreInfoDescription: t("moreInfoDescription"),
                goToWebsite: t("goToWebsite"),
              }}
            />

            {/* Event Registration */}
            {!event.cancelled && (
              <div className="mt-12">
                {/* Check if event has already happened */}
                {new Date(event.endDate || event.startDate) < new Date() ? (
                  <EventPastParticipation
                    eventId={event.id}
                    variants={event.variants.map((v) => ({
                      id: v.id,
                      name: v.name,
                      distanceKm: v.distanceKm,
                      startDate: v.startDate,
                      startTime: v.startTime,
                    }))}
                  />
                ) : (
                  <EventRegistration
                    eventId={event.id}
                    eventSlug={event.slug}
                    eventTitle={event.title}
                    hasRegistrations={event.hasRegistrations}
                    registrationFieldSettings={
                      (event.registrationFieldSettings as Record<
                        string,
                        string
                      >) ?? {}
                    }
                    variants={event.variants.map((v) => ({
                      id: v.id,
                      name: v.name,
                      distanceKm: v.distanceKm,
                      startDate: v.startDate,
                      startTime: v.startTime,
                      maxParticipants: v.maxParticipants,
                      teamSize: v.teamSize,
                      registrationCount:
                        v._count.registrations + v._count.participations,
                      pricingPhases: v.pricingPhases.map((p) => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        currency: p.currency,
                        startDate: p.startDate,
                        endDate: p.endDate,
                      })),
                    }))}
                  />
                )}
              </div>
            )}

            {/* FAQ Section */}
            {event.faqs.length > 0 && (
              <EventFAQ
                items={event.faqs.map((f) => ({
                  question: f.question,
                  answer: f.answer,
                }))}
                translations={{
                  title: t("faqTitle"),
                  showAll: t("faqShowAll", { count: event.faqs.length }),
                  showLess: t("faqShowLess"),
                }}
              />
            )}

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

            {/* Related Events for Internal Linking */}
            <RelatedEvents
              events={translatedRelatedEvents}
              title={t("relatedEvents")}
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
              stravaRouteEmbed: event.stravaRouteEmbed,
              sportTypes: event.sportTypes,
              featuredVenue: event.featuredVenue,
            }}
            weather={event.weather}
          />
        </div>
      </div>
    </div>
  );
}
