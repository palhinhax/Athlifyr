import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, ArrowLeft, Route } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, sportTypeLabels } from "@/lib/event-utils";
import type { Metadata } from "next";
import { EventComments } from "@/components/event-comments";
import { EventRegistration } from "@/components/event-registration";
import { CreatePost } from "@/components/create-post";
import { PostCard } from "@/components/post-card";
import { ShareButton } from "@/components/share-button";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getEvent(slug: string) {
  return await prisma.event.findUnique({
    where: { slug },
    include: {
      variants: true,
      posts: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      comments: {
        where: {
          parentId: null,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
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

  return {
    title: `${event.title} - Athlifyr`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const event = await getEvent(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Back button and Share */}
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos eventos
          </Button>
        </Link>
        <ShareButton
          title={event.title}
          description={`${event.title} - ${formatDate(event.startDate)} em ${event.city}`}
        />
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
          {/* Distances/Variants - Highlight at top */}
          {event.variants && event.variants.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <Route className="h-6 w-6 text-primary" />
                Distâncias Disponíveis
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {event.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-lg border-2 border-primary/20 bg-card p-5 transition-all hover:border-primary hover:shadow-lg"
                  >
                    <h3 className="mb-2 text-xl font-bold">{variant.name}</h3>
                    {variant.distanceKm && (
                      <p className="mb-3 text-2xl font-bold text-primary">
                        {variant.distanceKm} km
                      </p>
                    )}
                    {variant.description && (
                      <p className="mb-3 text-sm text-muted-foreground">
                        {variant.description}
                      </p>
                    )}
                    {variant.price && (
                      <div className="mt-3 border-t pt-3">
                        <p className="text-lg font-semibold">
                          €{variant.price.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
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

          {/* Posts Section */}
          <div className="mt-12 border-t pt-12">
            <h2 className="mb-6 text-2xl font-bold">Posts da Comunidade</h2>
            <div className="space-y-4">
              <CreatePost eventId={event.id} />
              {event.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    createdAt: post.createdAt.toISOString(),
                    event: {
                      title: event.title,
                      slug: event.slug,
                    },
                  }}
                />
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 border-t pt-12">
            <EventComments
              eventId={event.id}
              initialComments={event.comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt.toISOString(),
                user: comment.user,
                replies: comment.replies.map((reply) => ({
                  id: reply.id,
                  content: reply.content,
                  createdAt: reply.createdAt.toISOString(),
                  user: reply.user,
                  replies: reply.replies.map((nestedReply) => ({
                    id: nestedReply.id,
                    content: nestedReply.content,
                    createdAt: nestedReply.createdAt.toISOString(),
                    user: nestedReply.user,
                    replies: [],
                  })),
                })),
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
