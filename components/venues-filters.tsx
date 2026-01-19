"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Filter,
  X,
  Loader2,
  MapPin,
  LocateFixed,
  LocateOff,
} from "lucide-react";

interface VenuesFiltersProps {
  userId?: string;
  onFiltersChange: (filters: VenuesFilters) => void;
  searchQuery: string;
  viewMode?: "list" | "map";
}

export interface VenuesFilters {
  types: VenueType[];
  distanceRadius: number | null;
  searchQuery: string;
  userLat: number | null;
  userLng: number | null;
  locationEnabled: boolean;
}

const VENUE_TYPES = [
  "GYM",
  "STUDIO",
  "CROSSFIT_BOX",
  "RUNNING_CLUB",
  "CYCLING_CLUB",
  "MARTIAL_ARTS",
  "YOGA_STUDIO",
  "CLIMBING_GYM",
  "SWIMMING_POOL",
  "OTHER",
] as const;

type VenueType = (typeof VENUE_TYPES)[number];

const DEFAULT_RADIUS = 25; // km

export function VenuesFilters({
  userId,
  onFiltersChange,
  searchQuery,
  viewMode = "list",
}: VenuesFiltersProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [selectedTypes, setSelectedTypes] = useState<VenueType[]>([]);
  const [distanceRadius, setDistanceRadius] = useState<number>(DEFAULT_RADIUS);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);

  const stableOnFiltersChange = useCallback(onFiltersChange, [onFiltersChange]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.closest('[role="listbox"]') ||
        target.closest("[data-radix-select-viewport]")
      ) {
        return;
      }

      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Load preferences from localStorage or API
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      try {
        const storedPrefs = localStorage.getItem("venuesFilters");
        if (storedPrefs) {
          const prefs = JSON.parse(storedPrefs);
          setSelectedTypes(prefs.types || []);
          setDistanceRadius(prefs.distanceRadius || DEFAULT_RADIUS);

          if (prefs.userLat && prefs.userLng) {
            setUserLat(prefs.userLat);
            setUserLng(prefs.userLng);
            setLocationEnabled(true);
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  // Update parent component when filters change
  useEffect(() => {
    stableOnFiltersChange({
      types: selectedTypes,
      distanceRadius: locationEnabled ? distanceRadius : null,
      searchQuery,
      userLat: locationEnabled ? userLat : null,
      userLng: locationEnabled ? userLng : null,
      locationEnabled,
    });
  }, [
    selectedTypes,
    distanceRadius,
    searchQuery,
    userLat,
    userLng,
    locationEnabled,
    stableOnFiltersChange,
  ]);

  const handleGetLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(t("events.filters.locationNotSupported"));
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setLocationEnabled(true);
        setGettingLocation(false);

        // Save to localStorage
        const prefs = {
          types: selectedTypes,
          distanceRadius,
          userLat: lat,
          userLng: lng,
        };
        localStorage.setItem("venuesFilters", JSON.stringify(prefs));
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(t("events.filters.locationError"));
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleToggleLocation = () => {
    if (locationEnabled) {
      setLocationEnabled(false);
      setUserLat(null);
      setUserLng(null);
    } else if (userLat && userLng) {
      setLocationEnabled(true);
    } else {
      handleGetLocation();
    }
  };

  const handleToggleType = (type: VenueType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((s) => s !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setDistanceRadius(DEFAULT_RADIUS);
    setLocationEnabled(false);
    localStorage.removeItem("venuesFilters");
  };

  const activeFiltersCount = selectedTypes.length + (locationEnabled ? 1 : 0);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">{t("events.filters.title")}</span>
        {activeFiltersCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute left-0 top-full z-50 mt-2 w-[90vw] max-w-md overflow-hidden shadow-lg sm:w-96">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">{t("events.filters.title")}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Venue Types */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">
                    {t("venues.filters.types")}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {VENUE_TYPES.map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors hover:bg-muted"
                      >
                        <Checkbox
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleToggleType(type)}
                        />
                        <span className="text-sm">
                          {t(`venues.types.${type}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                {viewMode === "list" && !searchQuery && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        <MapPin className="mr-1 inline h-4 w-4" />
                        {t("events.filters.locationFilter")}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleLocation}
                        disabled={gettingLocation}
                        className="h-8 gap-2 px-2"
                      >
                        {gettingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : locationEnabled ? (
                          <LocateFixed className="h-4 w-4 text-primary" />
                        ) : (
                          <LocateOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs">
                          {locationEnabled
                            ? t("events.filters.enabled")
                            : t("events.filters.disabled")}
                        </span>
                      </Button>
                    </div>

                    {locationError && (
                      <p className="mb-2 text-xs text-destructive">
                        {locationError}
                      </p>
                    )}

                    {locationEnabled && (
                      <div>
                        <label className="mb-2 block text-sm text-muted-foreground">
                          {t("events.filters.radius", {
                            distance: distanceRadius,
                          })}
                        </label>
                        <Slider
                          value={[distanceRadius]}
                          onValueChange={(values) =>
                            setDistanceRadius(values[0])
                          }
                          min={5}
                          max={100}
                          step={5}
                          className="mb-2"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="flex-1"
                    disabled={activeFiltersCount === 0}
                  >
                    {t("events.filters.clearAll")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    {t("events.filters.apply")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
