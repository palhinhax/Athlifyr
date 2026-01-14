import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, ArrowLeft, Route } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, sportTypeLabels } from "@/lib/event-utils";
import type { Metadata } from "next";
import { EventRegistration } from "@/components/event-registration";
import { CreatePost } from "@/components/create-post";
import { PostCard } from "@/components/post-card";
import { ShareButton } from "@/components/share-button";
import { EventAdminActions } from "@/components/event-admin-actions";
import { FriendsGoing } from "@/components/friends-going";
import { auth } from "@/lib/auth";
import {
  generateSportsEventSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import { EventPricingPhases } from "@/components/event-pricing-phases";
import { CollapsibleDescription } from "@/components/collapsible-description";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getEvent(slug: string, userId?: string) {
  return await prisma.event.findUnique({
    where: { slug },
    include: {
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
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const event = await getEvent(params.slug);

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
  const event = await getEvent(params.slug, session?.user?.id);
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
      <div className="relative h-[400px] w-full">
        <Image
          src={event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="mb-4 flex flex-wrap gap-2">
              {event.sportTypes.map((sportType) => (
                <div
                  key={sportType}
                  className="inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  {sportTypeLabels[sportType]}
                </div>
              ))}
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Distances/Variants - Compact tags */}
          {event.variants && event.variants.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Distâncias:
                </span>
                {(() => {
                  // Get unique distances
                  const distances = event.variants
                    .map((v) => v.distanceKm)
                    .filter((d): d is number => d !== null);
                  const uniqueDistances = Array.from(new Set(distances)).sort(
                    (a, b) => a - b
                  );

                  // If all variants have the same distance, show it once
                  if (uniqueDistances.length === 1) {
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {uniqueDistances[0]} km
                      </span>
                    );
                  }

                  // If multiple distances, show each unique one
                  return uniqueDistances.map((distance) => (
                    <span
                      key={distance}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {distance} km
                    </span>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="mb-8 grid gap-6 rounded-lg bg-muted/50 p-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Data</div>
                <div className="text-muted-foreground">
                  {formatDate(event.startDate)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Local</div>
                <div className="text-muted-foreground">
                  {event.city}, {event.country}
                </div>
              </div>
            </div>
            {friendsGoingCount > 0 && (
              <div className="md:col-span-2">
                <FriendsGoing
                  friends={friendsGoing}
                  totalCount={friendsGoingCount}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-lg mb-8 max-w-none">
            <h2 className="mb-4 text-2xl font-bold">Sobre o Evento</h2>
            <CollapsibleDescription description={event.description} />
          </div>

          {/* Event Pricing Phases (nível do evento) */}
          {event.pricingPhases && event.pricingPhases.length > 0 && (
            <div className="mb-8">
              <EventPricingPhases phases={event.pricingPhases} />
            </div>
          )}

          {/* Variants with details */}
          {event.variants && event.variants.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Variantes / Distâncias
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {event.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    <h3 className="font-semibold">{variant.name}</h3>
                    {variant.description && (
                      <p className="text-sm text-muted-foreground">
                        {variant.description}
                      </p>
                    )}

                    {/* Technical Data - Compact */}
                    <div className="space-y-2 text-sm">
                      {variant.distanceKm && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Distância:
                          </span>
                          <span className="font-medium">
                            {variant.distanceKm} km
                          </span>
                        </div>
                      )}
                      {variant.elevationGainM && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">D+:</span>
                          <span className="font-medium">
                            {variant.elevationGainM} m
                          </span>
                        </div>
                      )}
                      {variant.elevationLossM && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">D-:</span>
                          <span className="font-medium">
                            {variant.elevationLossM} m
                          </span>
                        </div>
                      )}
                      {variant.cutoffTimeHours && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Tempo Limite:
                          </span>
                          <span className="font-medium">
                            {variant.cutoffTimeHours}h
                          </span>
                        </div>
                      )}
                      {(variant.itraPoints ||
                        variant.atrpGrade ||
                        variant.mountainLevel) && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {variant.itraPoints && (
                            <span className="rounded bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400">
                              ITRA {variant.itraPoints}
                            </span>
                          )}
                          {variant.atrpGrade && (
                            <span className="rounded bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-700 dark:text-orange-400">
                              ATRP {variant.atrpGrade}/5
                            </span>
                          )}
                          {variant.mountainLevel && (
                            <span className="rounded bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-400">
                              ML {variant.mountainLevel}/3
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Variant-specific pricing */}
                    {variant.pricingPhases &&
                      variant.pricingPhases.length > 0 && (
                        <div className="border-t pt-3">
                          <EventPricingPhases
                            phases={variant.pricingPhases}
                            variantName={variant.name}
                          />
                        </div>
                      )}

                    {/* Fixed price fallback */}
                    {variant.price &&
                      (!variant.pricingPhases ||
                        variant.pricingPhases.length === 0) && (
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Preço</span>
                            <span className="text-lg font-bold">
                              {variant.price.toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {event.externalUrl && (
            <div className="border-t pt-8">
              <h3 className="mb-4 text-xl font-bold">
                Pronto para participar?
              </h3>
              <p className="mb-6 text-muted-foreground">
                Para mais informações e inscrições, visite o website oficial do
                evento.
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

          {/* Community Section - Posts */}
          <div className="mt-12 border-t pt-12">
            <h2 className="mb-6 text-2xl font-bold">Comunidade</h2>
            <div className="space-y-4">
              <CreatePost eventId={event.id} />
              {event.posts.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Ainda não há posts. Sê o primeiro a partilhar algo!
                </p>
              ) : (
                event.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      content: post.content,
                      imageUrl: post.imageUrl,
                      userId: post.userId,
                      createdAt: post.createdAt.toISOString(),
                      user: post.user,
                      event: {
                        title: event.title,
                        slug: event.slug,
                      },
                      likesCount: post._count.likes,
                      isLikedByUser:
                        Array.isArray(post.likes) && post.likes.length > 0,
                      commentsCount: post._count.comments,
                    }}
                    currentUserId={session?.user?.id}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
