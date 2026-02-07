"use client";

import { useTranslations } from "next-intl";
import {
  Phone,
  Mail,
  Globe,
  Instagram,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { CollapsibleDescription } from "@/components/collapsible-description";
import { VenueGallery } from "@/components/venue-gallery";
import { EventLocationMap } from "@/components/event-location-map";

// WhatsApp icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface VenueAboutTabProps {
  venue: {
    id: string;
    name: string;
    description: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    instagram: string | null;
    whatsapp: string | null;
    address: string | null;
    city: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
    services?: string[];
  };
  translatedDescription: string | null;
  isOwnerOrAdmin: boolean;
}

export function VenueAboutTab({
  venue,
  translatedDescription,
  isOwnerOrAdmin,
}: VenueAboutTabProps) {
  const tInfo = useTranslations("venues.info");

  return (
    <div className="space-y-6">
      {/* Description - only show if venue has description */}
      {(translatedDescription || venue.description) && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            {tInfo("description")}
          </h2>
          <CollapsibleDescription
            description={translatedDescription || venue.description || ""}
          />
        </div>
      )}

      {/* Venue Photo Gallery */}
      <VenueGallery venueId={venue.id} isOwner={isOwnerOrAdmin} />

      {/* Contact Information */}
      {(venue.phone || venue.email || venue.website || venue.instagram) && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            {tInfo("contactInformation")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {venue.phone && (
              <a
                href={`tel:${venue.phone}`}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 transition-all hover:border-p-brand hover:bg-p-brand/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-p-brand/10 text-p-brand">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {tInfo("phone")}
                  </p>
                  <p className="truncate font-medium">{venue.phone}</p>
                </div>
              </a>
            )}
            {venue.email && (
              <a
                href={`mailto:${venue.email}`}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 transition-all hover:border-p-info hover:bg-p-info/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-p-info/10 text-p-info">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="truncate font-medium">{venue.email}</p>
                </div>
              </a>
            )}
            {venue.website && (
              <a
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 transition-all hover:border-p-golden hover:bg-p-golden/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-p-golden/10 text-p-golden">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {tInfo("website")}
                  </p>
                  <p className="flex items-center gap-1 truncate font-medium">
                    {venue.website
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")}
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                  </p>
                </div>
              </a>
            )}
            {venue.instagram && (
              <a
                href={`https://instagram.com/${venue.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 transition-all hover:border-p-brand hover:bg-p-brand/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-p-brand/20 via-p-golden/20 to-p-info/20 text-p-brand">
                  <Instagram className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Instagram</p>
                  <p className="truncate font-medium">
                    @{venue.instagram.replace("@", "")}
                  </p>
                </div>
              </a>
            )}
            {venue.whatsapp && (
              <a
                href={`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 transition-all hover:border-green-500 hover:bg-green-500/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <WhatsAppIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="truncate font-medium">{venue.whatsapp}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Location Information with Map */}
      {(venue.address || venue.city || (venue.latitude && venue.longitude)) && (
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
              <MapPin className="h-5 w-5 text-red-500" />
              {tInfo("location")}
            </h2>
            {venue.address && (
              <p className="text-muted-foreground">{venue.address}</p>
            )}
            {venue.city && (
              <p className="text-muted-foreground">
                {venue.city}, {venue.country}
              </p>
            )}
          </div>

          {/* Map */}
          {venue.latitude && venue.longitude && (
            <>
              <div className="relative aspect-[16/9] w-full">
                <EventLocationMap
                  latitude={venue.latitude}
                  longitude={venue.longitude}
                  title={venue.name}
                  venueServices={venue.services}
                  zoom={13}
                />
              </div>
              <div className="p-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  {tInfo("openInGoogleMaps")}
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
