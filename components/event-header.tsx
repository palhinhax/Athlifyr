"use client";

import { useState } from "react";
import { SportType } from "@prisma/client";
import { EventImageLightbox } from "@/components/event-image-lightbox";
import { SportBadge } from "@/components/sport-badge";
import { HeroBackground } from "@/components/hero-background";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { EventAdminActions } from "@/components/event-admin-actions";
import { useTranslations } from "next-intl";

interface EventHeaderProps {
  title: string;
  imageUrl: string | null;
  sportTypes: SportType[];
  isAdmin?: boolean;
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
              {isAdmin && event && <EventAdminActions event={event} />}
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
