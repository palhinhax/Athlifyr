"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { useTranslations } from "next-intl";
import { SportType } from "@prisma/client";

interface EventPageHeaderProps {
  isAdmin: boolean;
  event: {
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
  shareDescription: string;
  locale: string;
}

export function EventPageHeader({
  isAdmin: _isAdmin,
  event,
  shareDescription,
  locale,
}: EventPageHeaderProps) {
  const t = useTranslations("events");
  const tCommon = useTranslations("common");

  // Construct the full event URL for sharing
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const eventUrl = `${baseUrl}/${locale}/events/${event.slug}`;

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Cancelled Event Warning */}
      {event.cancelled && (
        <div className="mb-4 rounded-lg border-2 border-red-600 bg-red-50 p-4 dark:bg-red-950/20">
          <div className="flex items-start gap-3">
            <Ban className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-red-800 dark:text-red-400">
                🚫 {t("eventCancelled")}
              </h3>
              {event.cancellationReason && (
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {event.cancellationReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("backToEvents")}</span>
            <span className="sm:hidden">{tCommon("back")}</span>
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <ShareButton
            title={event.title}
            description={shareDescription}
            url={eventUrl}
          />
        </div>
      </div>
    </div>
  );
}
