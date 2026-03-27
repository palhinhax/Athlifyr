"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Route,
  CheckCircle,
  MessageCircle,
  Ban,
  Gift,
} from "lucide-react";
import { formatDateRange } from "@/lib/event-utils";
import type { Event, EventVariant, PricingPhase } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { SportBadge } from "@/components/sport-badge";
import { analyticsEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

type VariantWithPricing = EventVariant & {
  pricingPhases?: Pick<
    PricingPhase,
    "startDate" | "endDate" | "price" | "currency"
  >[];
};

function getCurrentPrice(
  variant: VariantWithPricing
): { price: number; currency: string } | null {
  if (!variant.pricingPhases || variant.pricingPhases.length === 0) return null;
  const now = new Date();
  const active = variant.pricingPhases.find(
    (p) => new Date(p.startDate) <= now && new Date(p.endDate) >= now
  );
  return active ? { price: active.price, currency: active.currency } : null;
}

interface EventCardProps {
  event: Event & {
    variants?: VariantWithPricing[];
    _count?: { comments: number; giveaways?: number };
  };
  isParticipating?: boolean;
  trackingContext?: string; // Where the card is being displayed (e.g., "homepage", "events_page", "profile")
}

export function EventCard({
  event,
  isParticipating = false,
  trackingContext = "unknown",
}: EventCardProps) {
  const locale = useLocale();
  const t = useTranslations("events");

  const handleCardClick = () => {
    analyticsEvent(ANALYTICS_EVENTS.EVENT_VIEW, {
      eventId: event.id,
      eventTitle: event.title.substring(0, 255),
      location: trackingContext,
      sportTypes: Array.isArray(event.sportTypes)
        ? event.sportTypes.join(",").substring(0, 255)
        : "",
      city: event.city,
      country: event.country,
    });
  };

  return (
    <Link
      href={`/events/${event.slug}`}
      onClick={handleCardClick}
      className="block"
    >
      <Card
        className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${
          isParticipating ? "ring-2 ring-green-500" : ""
        }`}
      >
        <div className="relative h-48 w-full">
          <Image
            src={
              event.imageUrl && event.imageUrl !== "null"
                ? event.imageUrl
                : "/placeholder-event.jpg"
            }
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Date badge overlay */}
          <div className="absolute left-0 top-0 flex flex-col items-center bg-primary px-3 py-1.5 text-primary-foreground shadow-md">
            <span className="text-2xl font-bold leading-tight">
              {new Date(event.startDate).getDate()}
            </span>
            <span className="text-[10px] font-medium uppercase leading-tight">
              {new Intl.DateTimeFormat(locale, { month: "short" }).format(
                new Date(event.startDate)
              )}
            </span>
          </div>
          <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1">
            {Array.isArray(event.sportTypes) &&
              event.sportTypes.map((sportType) => (
                <SportBadge key={sportType} sportType={sportType} size="md" />
              ))}
          </div>
          {event.cancelled && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white shadow-lg">
              <Ban className="h-4 w-4" />
              {t("cancelled")}
            </div>
          )}
          {isParticipating && !event.cancelled && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
              <CheckCircle className="h-4 w-4" />
              {t("going")}
            </div>
          )}
          {event._count && (event._count.giveaways ?? 0) > 0 && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-md">
              <Gift className="h-3.5 w-3.5" />
              {t("giveaway.badge")}
            </div>
          )}
          {event.hasLiveRace && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 shadow-md backdrop-blur-sm">
              <Image
                src="/liverace.png"
                alt="LiveRace"
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
              <span className="text-xs font-semibold text-white">LiveRace</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold">{event.title}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-medium text-foreground">
                {formatDateRange(event.startDate, event.endDate, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-medium text-foreground">
                {event.city}, {event.country}
              </span>
            </div>
            {event.variants &&
              event.variants.length > 0 &&
              !event.sportTypes.includes("HYROX") && (
                <div className="mt-2 flex items-start gap-2">
                  <Route className="mt-0.5 h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {event.variants.slice(0, 3).map((variant) => {
                      const currentPrice = getCurrentPrice(variant);
                      return (
                        <span
                          key={variant.id}
                          className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {variant.distanceKm
                            ? `${variant.distanceKm} km`
                            : variant.name}
                          {currentPrice && (
                            <span className="font-semibold text-primary">
                              {currentPrice.price}€
                            </span>
                          )}
                        </span>
                      );
                    })}
                    {event.variants.length > 3 && (
                      <span className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        +{event.variants.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            {event._count && event._count.comments > 0 && (
              <div className="mt-2 flex justify-end">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {event._count.comments}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
