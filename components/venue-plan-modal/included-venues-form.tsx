"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";

interface OwnedVenue {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo: string | null;
}

interface IncludedVenuesFormProps {
  currentVenueId: string;
  selectedVenueIds: string[];
  onSelectedVenueIdsChange: (venueIds: string[]) => void;
}

export function IncludedVenuesForm({
  currentVenueId,
  selectedVenueIds,
  onSelectedVenueIdsChange,
}: IncludedVenuesFormProps) {
  const t = useTranslations("venues.plans");
  const [ownedVenues, setOwnedVenues] = useState<OwnedVenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnedVenues = async () => {
      try {
        const response = await fetch("/api/users/me/owned-venues");
        if (response.ok) {
          const data = await response.json();
          // Filter out the current venue (can't include itself)
          setOwnedVenues(
            data.venues.filter((v: OwnedVenue) => v.id !== currentVenueId)
          );
        }
      } catch (error) {
        console.error("Error fetching owned venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedVenues();
  }, [currentVenueId]);

  const handleVenueToggle = (venueId: string, checked: boolean) => {
    if (checked) {
      onSelectedVenueIdsChange([...selectedVenueIds, venueId]);
    } else {
      onSelectedVenueIdsChange(selectedVenueIds.filter((id) => id !== venueId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If user only owns one venue, don't show this section
  if (ownedVenues.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        {t("noOtherVenues")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium">{t("includedVenues")}</h4>
        <p className="text-sm text-muted-foreground">
          {t("includedVenuesDescription")}
        </p>
      </div>

      <div className="space-y-3">
        {ownedVenues.map((venue) => (
          <div
            key={venue.id}
            className="flex items-center space-x-3 rounded-lg border p-3"
          >
            <Checkbox
              id={`venue-${venue.id}`}
              checked={selectedVenueIds.includes(venue.id)}
              onCheckedChange={(checked) =>
                handleVenueToggle(venue.id, checked === true)
              }
            />
            <Label
              htmlFor={`venue-${venue.id}`}
              className="flex flex-1 cursor-pointer items-center gap-3"
            >
              {venue.logo ? (
                <Image
                  src={venue.logo}
                  alt={venue.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{venue.name}</p>
                {venue.city && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {venue.city}
                  </p>
                )}
              </div>
            </Label>
          </div>
        ))}
      </div>

      {selectedVenueIds.length > 0 && (
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm">
            <span className="font-medium">{selectedVenueIds.length}</span>{" "}
            {selectedVenueIds.length === 1
              ? t("venueIncluded")
              : t("venuesIncluded")}
          </p>
        </div>
      )}
    </div>
  );
}
