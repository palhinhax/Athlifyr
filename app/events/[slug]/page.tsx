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
import { auth } from "@/lib/auth";

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
    };
  }

  const eventUrl = `https://athlifyr.com/events/${event.slug}`;
  const eventImage = event.imageUrl || "https://athlifyr.com/logo.png";

  return {
    title: `${event.title} - Athlifyr`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      url: eventUrl,
      siteName: "Athlifyr",
      images: [
        {
          url: eventImage,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      locale: "pt_PT",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: [eventImage],
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

  return (
    <div className="min-h-screen">
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
                  sportType: event.sportType,
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
            <div className="mb-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              {sportTypeLabels[event.sportType]}
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
                {event.variants.map((variant) => (
                  <span
                    key={variant.id}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {variant.distanceKm
                      ? `${variant.distanceKm} km`
                      : variant.name}
                  </span>
                ))}
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
                <div className="font-medium">Localização</div>
                <div className="text-muted-foreground">
                  {event.city}, {event.country}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg mb-8 max-w-none">
            <h2 className="mb-4 text-2xl font-bold">Sobre o Evento</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

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
