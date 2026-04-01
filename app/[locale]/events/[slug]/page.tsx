import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/event-utils";
import type { Metadata } from "next";
import { GiveawayCard } from "@/components/giveaway-card";
import { auth } from "@/lib/auth";
import {
  generateSportsEventSchema,
  generateBreadcrumbSchema,
  generateEventFAQSchemaFromDB,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import { EventHeader } from "@/components/event-header";
import { EventVariantsList } from "@/components/event-variants-list";
import { EventSidebar } from "@/components/event-sidebar";
import { EventCommunity } from "@/components/event-community";
import { EventLocationCard } from "@/components/event-location-card";
import { EventWeather } from "@/components/event-weather";
import { EventMainContent } from "@/components/event-main-content";
import { EventFAQ } from "@/components/event-faq";
import { RelatedEvents } from "@/components/related-events";
import { LiveRaceSection } from "@/components/live-race-section";
import { LiveRaceCheckinBanner } from "@/components/live-race-checkin-banner";
import { EventRegistrationBar } from "@/components/event-registration-bar";
import { EventRouteSection } from "@/components/event-route-section";
import { Language, Prisma } from "@prisma/client";
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

  // Get related events — same sport type, ordered by proximity + date (raw SQL)
  const sportArray = event.sportTypes.map((s) => Prisma.sql`${s}::"SportType"`);

  const rawRelated = await prisma.$queryRaw<
    {
      id: string;
      slug: string;
      title: string;
      city: string;
      country: string;
      start_date: Date;
      image_url: string | null;
      sport_types: string[];
      t_title: string | null;
      t_city: string | null;
    }[]
  >`
    SELECT
      e.id,
      e.slug,
      e.title,
      e.city,
      e.country,
      e."startDate" AS start_date,
      e."imageUrl"  AS image_url,
      e."sportTypes" AS sport_types,
      t.title  AS t_title,
      t.city   AS t_city
    FROM "Event" e
    LEFT JOIN "EventTranslation" t
      ON t."eventId" = e.id AND t.language = ${locale}::"Language"
    WHERE
      e.id != ${event.id}
      AND e."startDate" >= NOW()
      AND e."sportTypes" && ARRAY[${Prisma.join(sportArray, ",")}]
    ORDER BY
      CASE
        WHEN e.latitude IS NOT NULL AND e.longitude IS NOT NULL
          AND ${event.latitude ?? null} IS NOT NULL
        THEN (
          6371 * acos(
            LEAST(1.0, GREATEST(-1.0,
              cos(radians(${event.latitude ?? 0})) * cos(radians(e.latitude)) *
              cos(radians(e.longitude) - radians(${event.longitude ?? 0})) +
              sin(radians(${event.latitude ?? 0})) * sin(radians(e.latitude))
            ))
          )
        )
        ELSE 999999
      END ASC,
      e."startDate" ASC
    LIMIT 6
  `;

  const translatedRelatedEvents = rawRelated.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.t_title || e.title,
    city: e.t_city || e.city,
    country: e.country,
    startDate: e.start_date,
    imageUrl: e.image_url,
    sportTypes: e.sport_types as unknown as typeof event.sportTypes,
  }));

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

  // Determine if the event is truly past (end of event day has passed)
  const eventEndDate = new Date(event.endDate || event.startDate);
  eventEndDate.setHours(23, 59, 59, 999);
  const isPastEvent = eventEndDate < new Date();

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
    showRoute: t("variants.showRoute"),
    hideRoute: t("variants.hideRoute"),
  };

  // Compute min price across all variant pricing phases
  const allPrices = event.variants.flatMap((v) =>
    v.pricingPhases.map((p) => ({ price: p.price, currency: p.currency }))
  );
  const minPriceEntry =
    allPrices.length > 0
      ? allPrices.reduce((min, p) => (p.price < min.price ? p : min))
      : null;

  // Find earliest registration deadline from active pricing phases
  const now = new Date();
  const activePhaseDates = event.variants
    .flatMap((v) => v.pricingPhases)
    .filter((p) => new Date(p.endDate) >= now)
    .map((p) => new Date(p.endDate))
    .sort((a, b) => a.getTime() - b.getTime());
  const registrationDeadline =
    activePhaseDates.length > 0
      ? `${t("registrationBar.openUntil")} ${formatDate(activePhaseDates[activePhaseDates.length - 1], locale)}`
      : null;

  return (
    <div className="min-h-screen bg-background">
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

      {/* Sticky Registration Bar */}
      <EventRegistrationBar
        minPrice={minPriceEntry?.price ?? null}
        currency={minPriceEntry?.currency ?? "EUR"}
        registrationDeadline={registrationDeadline}
        externalUrl={event.externalUrl}
        hasRegistrations={event.hasRegistrations}
        cancelled={event.cancelled}
        isPastEvent={isPastEvent}
      />

      {/* Main Content Grid */}
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column */}
        <div className="min-w-0 space-y-16 lg:col-span-8">
          {/* Check-in Banner — top-of-page highlight when CHECK_IN_OPEN */}
          {event.hasLiveRace && event.liveStatus === "CHECK_IN_OPEN" && (
            <LiveRaceCheckinBanner />
          )}

          {/* Giveaway Banner - Top of Content */}
          {!event.cancelled && <GiveawayCard eventId={event.id} />}

          {/* About the Event — Description */}
          <EventMainContent
            description={event.description}
            stravaRouteEmbed={event.stravaRouteEmbed}
            translations={{
              aboutEvent: t("aboutEvent"),
            }}
          />

          {/* Variants List with Distances (bento cards) */}
          <EventVariantsList
            variants={event.variants.map((v) => ({
              ...v,
              registrationCount:
                v._count.registrations + v._count.participations,
            }))}
            labels={variantLabels}
            eventId={event.id}
          />

          {/* Route / Percurso Section */}
          <EventRouteSection
            eventId={event.id}
            variants={event.variants.map((v) => ({
              id: v.id,
              name: v.name,
              distanceKm: v.distanceKm,
              elevationGainM: v.elevationGainM,
            }))}
            stravaRouteEmbed={event.stravaRouteEmbed}
          />

          {/* LiveRace Section — visible when hasLiveRace (non check-in) */}
          {event.hasLiveRace && event.liveStatus !== "CHECK_IN_OPEN" && (
            <LiveRaceSection eventId={event.id} dbStatus={event.liveStatus} />
          )}

          {/* Location Map - Mobile Only */}
          {event.latitude && event.longitude && (
            <EventLocationCard
              latitude={event.latitude}
              longitude={event.longitude}
              title={event.title}
              city={event.city}
              country={event.country}
              googleMapsUrl={event.googleMapsUrl}
              sportTypes={event.sportTypes}
              mapHeightClass="aspect-video"
              className="lg:hidden"
            />
          )}

          {/* Weather Forecast - Mobile Only */}
          {event.weather && event.weather.length > 0 && (
            <EventWeather weather={event.weather} isPastEvent={isPastEvent} />
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

          {/* Related Events — Mobile only */}
          {translatedRelatedEvents.length > 0 && (
            <div className="lg:hidden">
              <RelatedEvents
                events={translatedRelatedEvents}
                title={t("relatedEvents")}
              />
            </div>
          )}
        </div>

        {/* Sidebar - Right Column (Desktop only) */}
        <div className="lg:col-span-4">
          <EventSidebar
            event={{
              id: event.id,
              title: event.title,
              slug: event.slug,
              imageUrl: event.imageUrl,
              startDate: event.startDate,
              endDate: event.endDate,
              city: event.city,
              country: event.country,
              latitude: event.latitude,
              longitude: event.longitude,
              googleMapsUrl: event.googleMapsUrl,
              stravaRouteEmbed: event.stravaRouteEmbed,
              sportTypes: event.sportTypes,
              cancelled: event.cancelled,
              featuredVenue: event.featuredVenue,
            }}
            variants={event.variants.map((v) => ({
              id: v.id,
              name: v.name,
              distanceKm: v.distanceKm,
              startDate: v.startDate,
              startTime: v.startTime,
            }))}
            hasRegistrations={event.hasRegistrations}
            registrationVariants={event.variants.map((v) => ({
              id: v.id,
              name: v.name,
              distanceKm: v.distanceKm,
              startDate: v.startDate,
              startTime: v.startTime,
              maxParticipants: v.maxParticipants,
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
              teamSize: v.teamSize,
            }))}
            registrationFieldSettings={
              (event.registrationFieldSettings as Record<string, string>) ?? {}
            }
            weather={event.weather}
            friendsGoing={friendsGoing}
            friendsGoingCount={friendsGoingCount}
            relatedEvents={translatedRelatedEvents}
            relatedEventsTitle={t("relatedEvents")}
          />
        </div>
      </div>

      {/* Community Section - Full Width */}
      <div className="bg-surface-container-low">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-8">
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
              isLikedByUser: Array.isArray(post.likes) && post.likes.length > 0,
              commentsCount: post._count.comments,
            }))}
            currentUserId={session?.user?.id}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
