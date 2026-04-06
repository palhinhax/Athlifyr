"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { MapPin, Building2, Users } from "lucide-react";
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
    <Link href={`/venues/${venue.slug}`} className="block">
      <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-card shadow-lg transition-all duration-500 hover:shadow-2xl lg:block">
        {/* Image container — fixed height on mobile, full overlay on desktop */}
        <div className="relative h-36 shrink-0 lg:aspect-[2/3] lg:h-auto">
          {venue.coverImage ? (
            <Image
              src={venue.coverImage}
              alt={venue.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Building2 className="h-12 w-12 text-primary/30" />
            </div>
          )}

          {/* Desktop-only gradient overlay */}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/20 to-transparent lg:block" />

          {/* Venue type badge — top left */}
          <div className="absolute left-3 top-3 rounded-xl border border-white/10 bg-black/40 px-2.5 py-1 text-center backdrop-blur-[8px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
              {venue.type.replaceAll("_", " ")}
            </span>
          </div>

          {/* Members badge — top right */}
          {venue._count.members > 0 && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-[8px]">
              <Users className="h-3 w-3 text-white" />
              <span className="text-[10px] font-black tracking-widest text-white">
                {venue._count.members}
              </span>
            </div>
          )}

          {/* Mobile-only: service badges on image bottom */}
          {venue.services && venue.services.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 lg:hidden">
              {venue.services.slice(0, 1).map((service) => (
                <span
                  key={service}
                  className="rounded-full border-0 bg-primary/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
                >
                  {t(`services.${service}`)}
                </span>
              ))}
            </div>
          )}

          {/* Desktop-only: full bottom content overlay */}
          <div className="absolute bottom-0 left-0 hidden w-full flex-col gap-1.5 p-3.5 lg:flex">
            {/* Service badges */}
            {venue.services && venue.services.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {venue.services.slice(0, 3).map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-[8px]"
                  >
                    {t(`services.${service}`)}
                  </span>
                ))}
                {venue.services.length > 3 && (
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-[8px]">
                    +{venue.services.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Name */}
            <h3 className="line-clamp-2 font-headline text-base font-extrabold leading-tight text-white">
              {venue.name}
            </h3>

            {/* Location */}
            {venue.city && (
              <div className="flex items-center gap-1 text-xs font-medium text-neutral-300">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {venue.city}, {venue.country}
                </span>
              </div>
            )}

            {/* Logo */}
            {venue.logo && (
              <div className="mt-1 flex items-center gap-2">
                <div className="h-6 w-6 overflow-hidden rounded-full border border-white/30">
                  <Image
                    src={venue.logo}
                    alt={`${venue.name} logo`}
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-only: content below image */}
        <div className="flex-1 space-y-1 overflow-hidden p-3 lg:hidden">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-tight text-foreground">
            {venue.name}
          </h3>
          {venue.city && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0 text-primary" />
              <span className="line-clamp-1">
                {venue.city}, {venue.country}
              </span>
            </div>
          )}
          {venue.logo && (
            <div className="flex items-center gap-2 pt-0.5">
              <div className="h-5 w-5 overflow-hidden rounded-full border border-border">
                <Image
                  src={venue.logo}
                  alt={`${venue.name} logo`}
                  width={20}
                  height={20}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
