"use client";

import { useState } from "react";
import { SportType } from "@prisma/client";
import { EventImageLightbox } from "@/components/event-image-lightbox";
import { SportBadge } from "@/components/sport-badge";
import { HeroBackground } from "@/components/hero-background";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban, Settings2 } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { useTranslations } from "next-intl";

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
  const hasImage = Boolean(imageUrl && imageUrl !== "/placeholder-event.jpg");

  const t = useTranslations("events");
  const tCommon = useTranslations("common");

  // Construct the full event URL for sharing
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const eventUrl = event ? `${baseUrl}/${locale}/events/${event.slug}` : "";

  return (
    <>
      <HeroBackground
        image={imageUrl || "/placeholder-event.jpg"}
        height="custom"
        customHeight="280px"
        clickable={hasImage}
        onImageClick={() => hasImage && setIsLightboxOpen(true)}
        overlayOpacity="medium"
        className="relative flex flex-col"
      >
        {/* Top Navigation Buttons */}
        <div className="z-30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href="/events">
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("backToEvents")}</span>
                <span className="sm:hidden">{tCommon("back")}</span>
              </Button>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {(isAdmin || isOrganizer) && event && (
                <Link href={`/events/${event.slug}/manage`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    Gerir evento
                  </Button>
                </Link>
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

        {/* Bottom Content - Title and Badges */}
        <div className="z-10 mt-auto pb-6 sm:pb-8">
          <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
            {sportTypes.map((sportType) => (
              <SportBadge
                key={sportType}
                sportType={sportType}
                size="lg"
                className="shadow-lg"
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000,_-2px_0_0_#000,_2px_0_0_#000,_0_-2px_0_#000,_0_2px_0_#000,_0_0_12px_rgba(0,0,0,0.9)] sm:text-4xl md:text-5xl">
            {title}
          </h1>
        </div>
      </HeroBackground>

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
          imageUrl={imageUrl!}
          title={title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}
