"use client";

import { Link } from "@/i18n/routing";
import { MapPin, Users, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface VenueCardProps {
  venue: {
    id: string;
    slug: string;
    name: string;
    type: string;
    description: string | null;
    city: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
    _count: {
      members: number;
      sessions: number;
    };
  };
}

export function VenueCard({ venue }: VenueCardProps) {
  const t = useTranslations("venues");

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="p-6">
        {/* Venue Type Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {t(`types.${venue.type}`)}
          </span>
        </div>

        {/* Venue Name */}
        <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
          {venue.name}
        </h3>

        {/* Location */}
        {venue.city && (
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {venue.city}, {venue.country}
            </span>
          </div>
        )}

        {/* Description */}
        {venue.description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {venue.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{venue._count.members}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{venue._count.sessions}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
