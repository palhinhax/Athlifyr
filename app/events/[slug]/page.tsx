import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, sportTypeLabels } from "@/lib/event-utils";
import type { Metadata } from "next";
import { EventRegistration } from "@/components/event-registration";
import { ShareButton } from "@/components/share-button";
import { EventAdminActions } from "@/components/event-admin-actions";
import { auth } from "@/lib/auth";
import {
  generateSportsEventSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import { EventPricingPhases } from "@/components/event-pricing-phases";
import { CollapsibleDescription } from "@/components/collapsible-description";
import { EventHeader } from "@/components/event-header";
import { EventMetaInfo } from "@/components/event-meta-info";
import { EventVariantsList } from "@/components/event-variants-list";
import { EventSidebar } from "@/components/event-sidebar";
import { EventCommunity } from "@/components/event-community";
import { EventLocationMobile } from "@/components/event-location-mobile";
import { Language } from "@prisma/client";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
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

  // Use translated content if available, with fallbacks
  const translation = event.translations[0];
  if (translation) {
    return {
      ...event,
      title: translation.title || event.title,
      description: translation.description || event.description,
      city: translation.city || event.city,
    };
  }

  return event;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Get user locale
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");
  const localeStr = localeCookie?.value || "pt";
  const locale: Language = (
    localeStr in Language ? localeStr : "pt"
  ) as Language;

  const event = await getEvent(params.slug, undefined, locale);

  if (!event) {
    return {
      title: "Evento não encontrado - Athlifyr",
      description: "O evento que procura não foi encontrado.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";
  const eventUrl = `${baseUrl}/events/${event.slug}`;
  const eventImage = event.imageUrl || `${baseUrl}/logo.png`;

  // Create rich description with event details (max 160 chars for SEO)
  const suffix = ` | ${formatDate(event.startDate)} | ${event.city}, ${event.country}`;
  const maxDescLength = 160 - suffix.length - 4; // 4 for "... " ellipsis

  let metaDescription: string;
  if (event.description.length + suffix.length <= 160) {
    // Description is short enough to fit with suffix
    metaDescription = event.description + suffix;
  } else {
    // Need to truncate description
    const truncatedDesc =
      event.description.slice(0, maxDescLength).trim() + "...";
    metaDescription = truncatedDesc + suffix;
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
    title: `${event.title} - ${sportTypeLabels[event.sportTypes[0]]} | Athlifyr`,
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
      locale: "pt_PT",
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

export default async function EventPage({ params }: PageProps) {
  const session = await auth();

  // Get user locale from session or cookie
  let locale: Language = "pt" as Language;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { locale: true },
    });
    if (user?.locale && user.locale in Language) {
      locale = user.locale as Language;
    }
  } else {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("NEXT_LOCALE");
    if (localeCookie?.value && localeCookie.value in Language) {
      locale = localeCookie.value as Language;
    }
  }

  const event = await getEvent(params.slug, session?.user?.id, locale);
  const isAdmin = session?.user?.role === "ADMIN";

  if (!event) {
    notFound();
  }

  // Generate structured data schemas
  const sportsEventSchema = generateSportsEventSchema(event);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Eventos", url: "/events" },
    { name: event.title, url: `/events/${event.slug}` },
  ]);

  // Get friends going to this event
  let friendsGoing: {
    id: string;
    name: string | null;
    image: string | null;
  }[] = [];
  let friendsGoingCount = 0;

  if (session?.user?.id) {
    // Get user's accepted friendships
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: session.user.id, status: "ACCEPTED" },
          { receiverId: session.user.id, status: "ACCEPTED" },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    const friendIds = friendships.map((f) =>
      f.senderId === session.user.id ? f.receiverId : f.senderId
    );

    if (friendIds.length > 0) {
      // Get friends participating in this event
      const participations = await prisma.participation.findMany({
        where: {
          eventId: event.id,
          userId: { in: friendIds },
          status: "going",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        take: 10,
      });

      friendsGoing = participations.map((p) => p.user);
      friendsGoingCount = await prisma.participation.count({
        where: {
          eventId: event.id,
          userId: { in: friendIds },
          status: "going",
        },
      });
    }
  }

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={sportsEventSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Back button, Admin Actions, and Share */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href="/events">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Voltar aos eventos</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <EventAdminActions
                event={{
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
                }}
              />
            )}
            <ShareButton
              title={event.title}
              description={`${event.title} - ${formatDate(event.startDate)} em ${event.city}`}
            />
          </div>
        </div>
      </div>

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
            <EventVariantsList variants={event.variants} />

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

            {/* Description */}
            <div className="prose prose-lg mb-8 max-w-none">
              <h2 className="mb-4 text-2xl font-bold">Sobre o Evento</h2>
              <CollapsibleDescription description={event.description} />
            </div>

            {/* Event Pricing Phases */}
            {event.pricingPhases && event.pricingPhases.length > 0 && (
              <div className="mb-8">
                <EventPricingPhases phases={event.pricingPhases} />
              </div>
            )}

            {/* CTA */}
            {event.externalUrl && (
              <div className="border-t pt-8">
                <h3 className="mb-4 text-xl font-bold">
                  Pronto para participar?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Para mais informações e inscrições, visite o website oficial
                  do evento.
                </p>
                <a
                  href={event.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="lg" className="gap-2">
                    Ir para Website Oficial
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            )}

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
