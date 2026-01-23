"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { VenueEditModal } from "@/components/venue-edit-modal";
import { ShareButton } from "@/components/share-button";
import { VenueRecommendations } from "@/components/venue-recommendations";
import { VenueReviewsModal } from "@/components/venue-reviews-modal";

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
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultCancellationDeadlineMinutes: number;
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
      subscriptions: number;
    };
  };
  userId?: string;
  isOwnerOrAdmin?: boolean;
  slug: string;
  locale: string;
}

export function VenueProfileHeader({
  venue,
  userId,
  isOwnerOrAdmin,
  slug,
  locale,
}: VenueProfileHeaderProps) {
  const t = useTranslations("venues");
  const tTypes = useTranslations("venues.types");
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Create share URL and description
  const venueUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com"}/${locale}/venues/${slug}`;
  const shareDescription =
    `${venue.description || ""} ${venue.address ? `${venue.address}, ` : ""}${venue.city}, ${venue.country}`.trim();

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-r from-primary/20 to-primary/10 md:h-64 lg:h-80">
        {venue.coverImage ? (
          <Image
            src={venue.coverImage}
            alt={`${venue.name} cover`}
            fill
            className="object-cover"
            priority
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

        {/* Venue Name and Type - Overlaid at bottom of cover, positioned to right of logo */}
        <div className="container absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-6 sm:pb-8">
          <div className="mx-auto flex items-end gap-4 md:gap-6">
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

        {/* Action buttons - Edit and Share */}
        <div className="container absolute left-0 right-0 top-0 px-4 py-4 sm:px-6">
          <div className="mx-auto flex items-center justify-end gap-2">
            {isOwnerOrAdmin && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
                onClick={() => setEditModalOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("editVenue")}
              </Button>
            )}
            <ShareButton
              title={venue.name}
              description={shareDescription}
              url={venueUrl}
            />
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
                  key={venue.logo}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary md:text-5xl">
                  {venue.name[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Recommendations and Reviews - Right side */}
            <div className="flex flex-col gap-3 pt-2 sm:pt-16 md:pt-20">
              <div className="flex gap-2">
                <VenueRecommendations venueId={venue.id} userId={userId} />
                <VenueReviewsModal
                  venueId={venue.id}
                  userId={userId}
                  locale={locale}
                  isOwnerOrAdmin={isOwnerOrAdmin}
                />
              </div>

              {/* Action Buttons - only show if there are buttons to display */}
              {(!userId || (userId && !isOwnerOrAdmin)) && (
                <div className="flex gap-2">
                  {!userId && <Button>{t("signIn")}</Button>}
                  {userId && !isOwnerOrAdmin && (
                    <Button>{t("membership.join")}</Button>
                  )}
                </div>
              )}
            </div>
          </div>
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
