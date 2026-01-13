import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, ArrowLeft, Route } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, sportTypeLabels } from "@/lib/event-utils";
import type { Metadata } from "next";
import { EventComments } from "@/components/event-comments";

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
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos eventos
          </Button>
        </Link>
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

          {/* Variants/Distances */}
          {event.variants && event.variants.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <Route className="h-6 w-6 text-primary" />
                Distâncias e Variantes
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {event.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
                  >
                    <h3 className="mb-1 text-lg font-semibold">
                      {variant.name}
                    </h3>
                    {variant.distance && (
                      <p className="font-medium text-primary">
                        {variant.distance}
                      </p>
                    )}
                    {variant.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {variant.description}
                      </p>
                    )}
                    {variant.price && (
                      <p className="mt-2 text-sm font-medium">
                        €{variant.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg mb-8 max-w-none">
            <h2 className="mb-4 text-2xl font-bold">Sobre o Evento</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

          {/* CTA */}
          <div className="border-t pt-8">
            <h3 className="mb-4 text-xl font-bold">Pronto para participar?</h3>
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
