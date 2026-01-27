"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { MapPin, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface VenueCardProps {
  venue: {
    id: string;
    slug: string;
    name: string;
    type: string;
    services: string[];
    description: string | null;
    city: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
    coverImage?: string | null;
    logo?: string | null;
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
      {/* Cover Image Section */}
      <div className="relative h-32 w-full bg-gradient-to-br from-primary/20 to-primary/5">
        {venue.coverImage ? (
          <Image
            src={venue.coverImage}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-12 w-12 text-primary/30" />
          </div>
        )}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Logo - Positioned at bottom left, overlapping the content area */}
        <div className="absolute -bottom-8 left-4 z-10">
          <div className="h-18 w-18 overflow-hidden rounded-xl border-2 border-background bg-background shadow-md">
            {venue.logo ? (
              <Image
                src={venue.logo}
                alt={`${venue.name} logo`}
                width={72}
                height={72}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Services Badges - Top right */}
        {venue.services && venue.services.length > 0 && (
          <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1">
            {venue.services.slice(0, 2).map((service) => (
              <span
                key={service}
                className="inline-flex items-center rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm"
              >
                {t(`services.${service}`)}
              </span>
            ))}
            {venue.services.length > 2 && (
              <span className="inline-flex items-center rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
                +{venue.services.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 pt-10">
        {/* Venue Name */}
        <h3 className="mb-1 text-lg font-semibold group-hover:text-primary">
          {venue.name}
        </h3>

        {/* Location */}
        {venue.city && (
          <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {venue.city}, {venue.country}
            </span>
          </div>
        )}

        {/* Description */}
        {venue.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {venue.description}
          </p>
        )}
      </div>
    </Link>
  );
}
