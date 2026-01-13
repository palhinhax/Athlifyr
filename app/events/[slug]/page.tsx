import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, sportTypeLabels } from "@/lib/event-utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getEvent(slug: string) {
  return await prisma.event.findUnique({
    where: { slug },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await getEvent(params.slug);

  if (!event) {
    return {
      title: "Evento não encontrado - FitLane",
    };
  }

  return {
    title: `${event.title} - FitLane`,
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
            <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              {sportTypeLabels[event.sportType]}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          {/* Meta Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-1 text-primary" />
              <div>
                <div className="font-medium">Data</div>
                <div className="text-muted-foreground">
                  {formatDate(event.startDate)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-1 text-primary" />
              <div>
                <div className="font-medium">Localização</div>
                <div className="text-muted-foreground">
                  {event.city}, {event.country}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">Sobre o Evento</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* CTA */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4">Pronto para participar?</h3>
            <p className="text-muted-foreground mb-6">
              Para mais informações e inscrições, visite o website oficial do evento.
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
        </div>
      </div>
    </div>
  );
}
