"use client";

import { useState } from "react";
import Image from "next/image";
import { SportType } from "@prisma/client";
import { EventImageLightbox } from "@/components/event-image-lightbox";
import { SportBadge } from "@/components/sport-badge";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban, Calendar, MapPin, Settings2 } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/event-utils";

interface EventHeaderProps {
  title: string;
  imageUrl: string | null;
  sportTypes: SportType[];
  isAdmin?: boolean;
  isOrganizer?: boolean;
  event?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    sportTypes: SportType[];
    startDate: Date;
    endDate: Date | null;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    googleMapsUrl: string | null;
    imageUrl: string | null;
    externalUrl: string | null;
    stravaRouteEmbed: string | null;
    featuredVenueId: string | null;
    cancelled: boolean;
    cancellationReason: string | null;
    featuredVenue: {
      id: string;
      slug: string;
      name: string;
      type: string;
      logo: string | null;
      city: string | null;
      country: string;
    } | null;
    variants: {
      id: string;
      name: string;
      distanceKm: number | null;
      elevationGainM: number | null;
      startDate: Date | null;
      startTime: string | null;
    }[];
  };
  shareDescription?: string;
  locale?: string;
}

export function EventHeader({
  title,
  imageUrl,
  sportTypes,
  isAdmin = false,
  isOrganizer = false,
  event,
  shareDescription,
  locale = "en",
}: EventHeaderProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const safeImageUrl = imageUrl && imageUrl !== "null" ? imageUrl : null;
  const hasImage = Boolean(
    safeImageUrl && safeImageUrl !== "/placeholder-event.jpg"
  );

  const t = useTranslations("events");
  const tCommon = useTranslations("common");

  // Construct the full event URL for sharing
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const eventUrl = event ? `${baseUrl}/${locale}/events/${event.slug}` : "";

  return (
    <>
      {/* Full-height Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden sm:h-[60vh] lg:h-[70vh]">
        {/* Background Image */}
        <Image
          src={safeImageUrl || "/placeholder-event.jpg"}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={80}
          onClick={() => hasImage && setIsLightboxOpen(true)}
          style={{ cursor: hasImage ? "pointer" : "default" }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Navigation Buttons */}
        <div className="absolute left-0 right-0 top-0 z-30 px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
              asChild
            >
              <Link href="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("backToEvents")}</span>
                <span className="sm:hidden">{tCommon("back")}</span>
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              {(isAdmin || isOrganizer) && event && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
                  asChild
                >
                  <Link href={`/events/${event.slug}/manage`}>
                    <Settings2 className="mr-2 h-4 w-4" />
                    {t("manage")}
                  </Link>
                </Button>
              )}
              {event && (
                <ShareButton
                  title={event.title}
                  description={shareDescription || ""}
                  url={eventUrl}
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Content - Sport Badges, Title, Date & Location */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-8 sm:px-8 sm:pb-12 lg:pb-16">
          <div className="mx-auto max-w-screen-2xl">
            {/* Sport Type Badges */}
            <div className="mb-4 flex flex-wrap gap-3">
              {sportTypes.map((sportType) => (
                <SportBadge
                  key={sportType}
                  sportType={sportType}
                  size="lg"
                  className="!bg-white/70 !text-foreground shadow-lg backdrop-blur-md"
                />
              ))}
            </div>

            {/* Event Title */}
            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>

            {/* Date & Location */}
            {event && (
              <div className="flex flex-wrap items-center gap-4 text-white/90 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {formatDate(event.startDate, locale)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {event.city}, {event.country}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cancelled Event Warning Banner */}
      {event?.cancelled && (
        <div className="border-b-2 border-red-600 bg-red-50 dark:bg-red-950/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              <Ban className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
              <div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-400">
                  {t("eventCancelled")}
                </h3>
                {event.cancellationReason && (
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {event.cancellationReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {hasImage && isLightboxOpen && (
        <EventImageLightbox
          imageUrl={safeImageUrl!}
          title={title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}
