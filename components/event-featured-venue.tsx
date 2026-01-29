"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, Star } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface FeaturedVenue {
  id: string;
  slug: string;
  name: string;
  type: string;
  logo: string | null;
  city: string | null;
  country: string;
  services?: string[];
  _count?: {
    recommendations: number;
    reviews: number;
  };
}

interface EventFeaturedVenueProps {
  venue: FeaturedVenue;
}

export function EventFeaturedVenue({ venue }: EventFeaturedVenueProps) {
  const tTypes = useTranslations("venues.types");
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/venues/${venue.slug}`}
      className="block overflow-hidden rounded-lg border bg-card shadow-sm transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Logo */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
          {venue.logo ? (
            <Image
              src={venue.logo}
              alt={venue.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Building2 className="h-7 w-7 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-medium">{venue.name}</h4>
          <p className="text-sm text-muted-foreground">{tTypes(venue.type)}</p>
          {venue.city && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {venue.city}, {venue.country}
              </span>
            </div>
          )}
          {venue._count && venue._count.recommendations > 0 && (
            <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
              <Star className="h-3 w-3 fill-current" />
              <span>{venue._count.recommendations}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
