"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MapPin, Building2 } from "lucide-react";

interface VenueSearchResult {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo: string | null;
  city: string | null;
  country: string;
  services: string[];
  instagram: string | null;
}

interface VenueSearchProps {
  onVenueSelect: (venue: VenueSearchResult) => void;
}

export function VenueSearch({ onVenueSelect }: VenueSearchProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VenueSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search venues with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchVenues = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/venues?search=${encodeURIComponent(searchQuery)}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.venues || []);
        }
      } catch (error) {
        console.error("Error searching venues:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchVenues, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectVenue = (venue: VenueSearchResult) => {
    onVenueSelect(venue);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const getVenueTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      GYM: "Ginásio",
      STUDIO: "Estúdio",
      CROSSFIT_BOX: "Box de CrossFit",
      RUNNING_CLUB: "Clube de Corrida",
      CYCLING_CLUB: "Clube de Ciclismo",
      MARTIAL_ARTS: "Artes Marciais",
      YOGA_STUDIO: "Estúdio de Yoga",
      CLIMBING_GYM: "Ginásio de Escalada",
      SWIMMING_POOL: "Piscina",
      PT_STUDIO: "Personal Training",
      MASSAGE: "Massagem",
      PHYSIO: "Fisioterapia",
      NUTRITION: "Nutrição",
      OTHER: "Outro",
    };
    return types[type] || type;
  };

  return (
    <Card className="mb-4 p-4 sm:mb-6 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quick Start from Venue</h2>
          <p className="text-sm text-muted-foreground">
            Search and select a venue to auto-fill template
          </p>
        </div>
        <Button
          variant={showSearch ? "secondary" : "default"}
          onClick={() => setShowSearch(!showSearch)}
          size="sm"
        >
          {showSearch ? "Hide" : "Search Venue"}
        </Button>
      </div>

      {showSearch && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Input
              placeholder="Search venues by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => handleSelectVenue(venue)}
                  className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={venue.logo || undefined}
                      alt={venue.name}
                    />
                    <AvatarFallback>
                      <Building2 className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{venue.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getVenueTypeLabel(venue.type)}</span>
                      {venue.city && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {venue.city}, {venue.country}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No venues found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
