"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Users,
  Calendar,
  Edit,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { VenueEditModal } from "@/components/venue-edit-modal";

interface VenueProfileHeaderProps {
  venue: {
    id: string;
    name: string;
    type: string;
    logo: string | null;
    coverImage: string | null;
    description: string | null;
    city: string | null;
    country: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    instagram: string | null;
    latitude: number | null;
    longitude: number | null;
    members: Array<{
      id: string;
      role: string;
      user: {
        id: string;
        name: string;
        image: string | null;
      };
    }>;
    _count: {
      sessions: number;
      bookings: number;
    };
  };
  userId?: string;
  isOwnerOrAdmin?: boolean;
}

export function VenueProfileHeader({
  venue,
  userId,
  isOwnerOrAdmin,
}: VenueProfileHeaderProps) {
  const t = useTranslations("venues");
  const tTypes = useTranslations("venues.types");
  const tInfo = useTranslations("venues.info");
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="mb-6 w-full">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-r from-primary/20 to-primary/10 md:h-64 lg:h-80">
        {venue.coverImage ? (
          <Image
            src={venue.coverImage}
            alt={`${venue.name} cover`}
            fill
            className="object-cover"
            priority
            unoptimized
            key={venue.coverImage}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p className="text-sm">{venue.city}</p>
            </div>
          </div>
        )}

        {/* Edit button for owners/admins */}
        {isOwnerOrAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-4 top-4 z-20"
            onClick={() => setEditModalOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("editVenue")}
          </Button>
        )}

        {/* Venue Name and Type - Overlaid at bottom of cover, positioned to right of logo */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end gap-4 md:gap-6">
          {/* Spacer for logo (logo will be positioned here via the profile container) */}
          <div className="h-16 w-32 shrink-0 md:h-20 md:w-40" />

          {/* Name and Badge */}
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold text-white drop-shadow-lg [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000,_-2px_0_0_#000,_2px_0_0_#000,_0_-2px_0_#000,_0_2px_0_#000,_0_0_12px_rgba(0,0,0,0.9)] md:text-3xl lg:text-4xl">
              {venue.name}
            </h1>
            <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-primary shadow-lg backdrop-blur-sm">
              {tTypes(venue.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info Container */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 md:-mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            {/* Logo - positioned half on cover, half below */}
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border-4 border-background bg-background shadow-xl md:h-40 md:w-40">
              {venue.logo ? (
                <Image
                  src={venue.logo}
                  alt={venue.name}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                  key={venue.logo}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary md:text-5xl">
                  {venue.name[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Info below cover - Location and Stats */}
            <div className="flex-1 pt-2 sm:pt-16 md:pt-20">
              {/* Location */}
              {venue.city && (
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {venue.address && `${venue.address}, `}
                    {venue.city}, {venue.country}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                {/* Members count - only visible to owners/admins */}
                {isOwnerOrAdmin && (
                  <>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold">
                          {venue.members.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("membership.members")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold">
                          {venue._count.sessions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("sessions.title")}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons - only show if there are buttons to display */}
            {(!userId || (userId && !isOwnerOrAdmin)) && (
              <div className="flex gap-2 pt-2 sm:pt-16 md:pt-20">
                {!userId && <Button>{t("signIn")}</Button>}
                {userId && !isOwnerOrAdmin && (
                  <Button>{t("membership.join")}</Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Links */}
        <div className="mt-6 flex flex-wrap gap-4 border-b pb-6 text-sm">
          {venue.phone && (
            <a
              href={`tel:${venue.phone}`}
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {venue.phone}
            </a>
          )}
          {venue.email && (
            <a
              href={`mailto:${venue.email}`}
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              {venue.email}
            </a>
          )}
          {venue.website && (
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Globe className="h-4 w-4" />
              {tInfo("website")}
            </a>
          )}
          {venue.instagram && (
            <a
              href={`https://instagram.com/${venue.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Instagram className="h-4 w-4" />@
              {venue.instagram.replace("@", "")}
            </a>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isOwnerOrAdmin && (
        <VenueEditModal
          venue={venue}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
        />
      )}
    </div>
  );
}
