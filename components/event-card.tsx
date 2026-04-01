"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  MapPin,
  CheckCircle,
  MessageCircle,
  Ban,
  Gift,
  Route,
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

function getPriceRange(
  variants: VariantWithPricing[]
): { min: number; max: number; currency: string } | null {
  const now = new Date();
  const prices: number[] = [];
  let currency = "EUR";
  for (const v of variants) {
    if (!v.pricingPhases) continue;
    const active = v.pricingPhases.find(
      (p) => new Date(p.startDate) <= now && new Date(p.endDate) >= now
    );
    if (active) {
      prices.push(active.price);
      currency = active.currency;
    }
  }
  if (prices.length === 0) return null;
  return {
    min: Math.round(Math.min(...prices)),
    max: Math.round(Math.max(...prices)),
    currency,
  };
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

  const startDate = new Date(event.startDate);
  const day = startDate.getDate().toString().padStart(2, "0");
  const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(
    startDate
  );

  const priceRange =
    event.variants && event.variants.length > 0
      ? getPriceRange(event.variants)
      : null;

  const priceLabel = priceRange
    ? priceRange.min === 0 && priceRange.max === 0
      ? t("registration.flow.free")
      : (() => {
          const symbol =
            priceRange.currency === "EUR" ? "€" : priceRange.currency;
          return priceRange.min === priceRange.max
            ? `${priceRange.min}${symbol}`
            : `${priceRange.min}–${priceRange.max}${symbol}`;
        })()
    : null;

  return (
    <Link
      href={`/events/${event.slug}`}
      onClick={handleCardClick}
      className="block"
    >
      <article
        className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-card shadow-lg transition-all duration-500 hover:shadow-2xl lg:block ${
          isParticipating ? "ring-2 ring-green-500" : ""
        }`}
      >
        {/* Image container — fixed height on mobile, full overlay on desktop */}
        <div className="relative h-36 shrink-0 lg:aspect-[2/3] lg:h-auto">
          <Image
            src={
              event.imageUrl && event.imageUrl !== "null"
                ? event.imageUrl
                : "/placeholder-event.jpg"
            }
            alt={event.title}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Desktop-only gradient overlay */}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/20 to-transparent lg:block" />

          {/* Date badge — both layouts */}
          <div className="absolute left-3 top-3 rounded-xl border border-white/10 bg-black/40 px-2.5 py-1 text-center backdrop-blur-[8px]">
            <span className="block text-sm font-black leading-tight text-white">
              {day}
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-tighter text-neutral-300">
              {month}
            </span>
          </div>

          {/* Price badge — both layouts */}
          {priceLabel && (
            <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-[8px]">
              <span className="text-[10px] font-black tracking-widest text-white">
                {priceLabel}
              </span>
            </div>
          )}

          {/* Mobile-only: sport badge on image bottom */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 lg:hidden">
            {Array.isArray(event.sportTypes) &&
              event.sportTypes
                .slice(0, 1)
                .map((sportType) => (
                  <SportBadge
                    key={sportType}
                    sportType={sportType}
                    size="sm"
                    showIcon={false}
                    className="border-0 bg-primary/80 !px-2 !py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
                  />
                ))}
            {event.hasLiveRace && (
              <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 backdrop-blur-[8px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                </span>
                <span className="text-[9px] font-bold uppercase text-white">
                  Live
                </span>
              </div>
            )}
          </div>

          {/* Desktop-only: full bottom content overlay */}
          <div className="absolute bottom-0 left-0 hidden w-full flex-col gap-1.5 p-3.5 lg:flex">
            {/* Badges row */}
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(event.sportTypes) &&
                event.sportTypes
                  .slice(0, 2)
                  .map((sportType) => (
                    <SportBadge
                      key={sportType}
                      sportType={sportType}
                      size="sm"
                      showIcon={false}
                      className="border-0 bg-primary/80 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
                    />
                  ))}
              {event.cancelled && (
                <div className="flex items-center gap-1 rounded-full bg-red-600/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  <Ban className="h-3 w-3" />
                  {t("cancelled")}
                </div>
              )}
              {isParticipating && !event.cancelled && (
                <div className="flex items-center gap-1 rounded-full bg-green-500/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  <CheckCircle className="h-3 w-3" />
                  {t("going")}
                </div>
              )}
              {event.hasLiveRace && (
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/20 px-3 py-1 backdrop-blur-[8px]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <Image
                    src="/liverace.png"
                    alt="LiveRace"
                    width={14}
                    height={14}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                    LiveRace
                  </span>
                </div>
              )}
              {event._count && (event._count.giveaways ?? 0) > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-primary/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  <Gift className="h-3 w-3" />
                  {t("giveaway.badge")}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 font-headline text-base font-extrabold leading-tight text-white">
              {event.title}
            </h3>

            {/* Location + comments */}
            <div className="flex items-center justify-between text-xs font-medium text-neutral-300">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {event.city}, {event.country}
                </span>
              </div>
              {event._count && event._count.comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{event._count.comments}</span>
                </div>
              )}
            </div>

            {/* Variants */}
            {event.variants &&
              event.variants.length > 0 &&
              !event.sportTypes.includes("HYROX") && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Route className="h-3.5 w-3.5 shrink-0 text-neutral-300" />
                  {event.variants.slice(0, 3).map((variant) => (
                    <span
                      key={variant.id}
                      className="inline-flex items-center rounded-full border border-white/20 bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-[8px]"
                    >
                      {variant.distanceKm
                        ? `${variant.distanceKm} km`
                        : variant.name}
                    </span>
                  ))}
                  {event.variants.length > 3 && (
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-[8px]">
                      +{event.variants.length - 3}
                    </span>
                  )}
                </div>
              )}
          </div>
        </div>

        {/* Mobile-only: content below image */}
        <div className="flex-1 space-y-1 overflow-hidden p-3 lg:hidden">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-tight text-foreground">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0 text-primary" />
            <span className="line-clamp-1">
              {event.city}, {event.country}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDateRange(event.startDate, event.endDate, locale)}
            </span>
            {event._count && event._count.comments > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">{event._count.comments}</span>
              </div>
            )}
          </div>
          {(event.cancelled || isParticipating) && (
            <div className="flex gap-1 pt-0.5">
              {event.cancelled && (
                <div className="flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold uppercase text-red-700">
                  <Ban className="h-2.5 w-2.5" />
                  {t("cancelled")}
                </div>
              )}
              {isParticipating && !event.cancelled && (
                <div className="flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold uppercase text-green-700">
                  <CheckCircle className="h-2.5 w-2.5" />
                  {t("going")}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
