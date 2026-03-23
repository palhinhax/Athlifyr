"use client";

import { Calendar, MapPin, Ticket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { formatDateRange } from "@/lib/event-utils";
import { SportBadge } from "@/components/sport-badge";
import type { SportType, EventVariant } from "@prisma/client";

export interface FeaturedEventData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  city: string;
  country: string;
  imageUrl?: string | null;
  isFeatured?: boolean;
  sportTypes: SportType[];
  variants?: Pick<EventVariant, "id" | "name" | "distanceKm">[];
  // Optional display customizations
  stats?: { label: string; value: string }[];
  friendsGoing?: number;
  interestedCount?: number;
  // Custom gradient colors for header when no image
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  // Custom header content (like HYROX logo)
  customHeaderContent?: React.ReactNode;
}

interface FeaturedEventCardProps {
  event: FeaturedEventData;
  showDescription?: boolean;
  showStats?: boolean;
  showVariants?: boolean;
  showFriendsGoing?: boolean;
  linkToEvent?: boolean;
  onViewEvent?: () => void;
  className?: string;
}

export function FeaturedEventCard({
  event,
  showDescription = true,
  showStats = true,
  showVariants = true,
  showFriendsGoing = true,
  linkToEvent = true,
  onViewEvent,
  className = "",
}: Readonly<FeaturedEventCardProps>) {
  const locale = useLocale();
  const t = useTranslations("events");
  const tCommon = useTranslations("common");

  // Format dates
  const startDate =
    typeof event.startDate === "string"
      ? new Date(event.startDate)
      : event.startDate;
  const endDate = event.endDate
    ? typeof event.endDate === "string"
      ? new Date(event.endDate)
      : event.endDate
    : null;

  // Default gradient if no image
  const gradientFrom = event.gradientFrom || "from-primary/80";
  const gradientVia = event.gradientVia || "via-primary";
  const gradientTo = event.gradientTo || "to-primary/60";

  const handleViewEvent = () => {
    if (onViewEvent) {
      onViewEvent();
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-card shadow-xl ${className}`}
    >
      {/* Event Header Image */}
      <div
        className={`relative h-48 sm:h-64 ${
          event.imageUrl
            ? ""
            : `bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}`
        }`}
      >
        {event.imageUrl && event.imageUrl !== "null" ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        ) : event.customHeaderContent ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {event.customHeaderContent}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-3xl font-black tracking-tighter text-white sm:text-5xl">
                {event.title}
              </span>
            </div>
          </div>
        )}

        {/* Featured badge */}
        {event.isFeatured && (
          <div className="absolute left-4 top-4">
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              ⭐ {t("featured")}
            </Badge>
          </div>
        )}

        {/* Sport type badges */}
        <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-1">
          {event.sportTypes.map((sportType) => (
            <SportBadge key={sportType} sportType={sportType} size="md" />
          ))}
        </div>

        {/* Gradient overlay for better readability when image */}
        {event.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
      </div>

      {/* Event Content */}
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-bold sm:text-2xl">{event.title}</h3>
            <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formatDateRange(startDate, endDate, locale)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {event.city}, {event.country}
                </span>
              </div>
            </div>
          </div>
          {linkToEvent ? (
            <Button
              asChild
              className="w-full gap-2 sm:w-auto"
              onClick={handleViewEvent}
            >
              <Link href={`/events/${event.slug}`}>
                <Ticket className="h-4 w-4" aria-hidden="true" />
                {t("viewEvent")}
              </Link>
            </Button>
          ) : (
            <Button
              className="w-full gap-2 sm:w-auto"
              onClick={handleViewEvent}
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              {t("viewEvent")}
            </Button>
          )}
        </div>

        {/* Description */}
        {showDescription && event.description && (
          <p className="mb-6 line-clamp-3 text-sm text-muted-foreground sm:text-base">
            {event.description}
          </p>
        )}

        {/* Event Stats */}
        {showStats && event.stats && event.stats.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {event.stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-xl bg-muted/50 p-2 text-center sm:p-3"
              >
                <p className="text-base font-bold sm:text-lg">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Variants Preview */}
        {showVariants && event.variants && event.variants.length > 0 && (
          <div className="rounded-xl border bg-muted/30 p-3 sm:p-4">
            <p className="mb-3 text-sm font-medium">
              {t("availableVariants")}:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {event.variants.slice(0, 6).map((variant) => (
                <Badge
                  key={variant.id}
                  variant="outline"
                  className="text-[10px] sm:text-xs"
                >
                  {variant.distanceKm
                    ? `${variant.distanceKm} km`
                    : variant.name}
                </Badge>
              ))}
              {event.variants.length > 6 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  +{event.variants.length - 6}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Friends Going / Interested */}
        {showFriendsGoing && (event.friendsGoing || event.interestedCount) && (
          <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            {event.friendsGoing && event.friendsGoing > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {Array.from({
                    length: Math.min(event.friendsGoing, 4),
                  }).map((_, i) => {
                    const colors = [
                      "from-blue-500 to-cyan-500",
                      "from-purple-500 to-pink-500",
                      "from-green-500 to-emerald-500",
                      "from-orange-500 to-red-500",
                    ];
                    return (
                      <div
                        key={i}
                        className={`h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br sm:h-8 sm:w-8 ${colors[i % colors.length]}`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  <strong>{event.friendsGoing}</strong>{" "}
                  {t("friendsParticipating")}
                </span>
              </div>
            )}
            {event.interestedCount && event.interestedCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                <Target className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {event.interestedCount} {tCommon("interested")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Static version for presentations/demos with hardcoded data
interface StaticFeaturedEventCardProps {
  className?: string;
}

export function HyroxEventCardDemo({
  className = "",
}: StaticFeaturedEventCardProps) {
  return (
    <FeaturedEventCard
      event={{
        id: "demo-hyrox",
        title: "HYROX Lisboa",
        slug: "hyrox-lisboa-2026",
        description:
          "A maior competição mundial de fitness chega finalmente a Portugal! 3 dias de competição na FIL com categorias para todos: Individual, Doubles e Relay.",
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-05-03"),
        city: "FIL, Lisboa",
        country: "Portugal",
        isFeatured: true,
        sportTypes: ["HYROX"],
        gradientFrom: "from-yellow-500",
        gradientVia: "via-amber-500",
        gradientTo: "to-yellow-600",
        customHeaderContent: (
          <div className="text-center">
            <span className="block text-5xl font-black tracking-tighter text-white sm:text-7xl">
              HYROX
            </span>
            <span className="mt-1 block text-xl font-bold text-white/80 sm:text-2xl">
              LISBOA 2026
            </span>
          </div>
        ),
        stats: [
          { label: "Duração", value: "3 dias" },
          { label: "Categorias", value: "12+" },
          { label: "Corrida", value: "8 km" },
          { label: "Estações", value: "8" },
        ],
        variants: [
          { id: "1", name: "HYROX MEN", distanceKm: null },
          { id: "2", name: "HYROX WOMEN", distanceKm: null },
          { id: "3", name: "PRO MEN", distanceKm: null },
          { id: "4", name: "PRO WOMEN", distanceKm: null },
          { id: "5", name: "DOUBLES", distanceKm: null },
          { id: "6", name: "RELAY", distanceKm: null },
        ],
        friendsGoing: 12,
        interestedCount: 324,
      }}
      className={className}
      linkToEvent={false}
    />
  );
}
