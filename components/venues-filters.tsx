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
import { getServiceIcon } from "@/lib/venue-icons";

interface VenuesFiltersProps {
  userId?: string;
  onFiltersChange: (filters: VenuesFilters) => void;
  searchQuery: string;
  viewMode?: "list" | "map";
}

export interface VenuesFilters {
  services: VenueService[];
  distanceRadius: number | null;
  searchQuery: string;
  userLat: number | null;
  userLng: number | null;
  locationEnabled: boolean;
}

const VENUE_SERVICES = [
  "CROSSFIT",
  "HYROX",
  "WEIGHTLIFTING",
  "POWERLIFTING",
  "OLYMPIC_LIFTING",
  "FUNCTIONAL_FITNESS",
  "PERSONAL_TRAINING",
  "GROUP_CLASSES",
  "OPEN_GYM",
  "MASSAGE",
  "PHYSIOTHERAPY",
  "NUTRITION",
  "YOGA",
  "PILATES",
  "BOXING",
  "KICKBOXING",
  "MMA",
  "BJJ",
  "RECOVERY",
  "SAUNA",
  "COLD_PLUNGE",
  "OTHER",
] as const;

type VenueService = (typeof VENUE_SERVICES)[number];

const DEFAULT_RADIUS = 50; // km (same as events)

export function VenuesFilters({
  onFiltersChange,
  searchQuery,
  viewMode = "list",
}: VenuesFiltersProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [selectedServices, setSelectedServices] = useState<VenueService[]>([]);
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

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      try {
        const storedPrefs = localStorage.getItem("venuesFilters");
        if (storedPrefs) {
          const prefs = JSON.parse(storedPrefs);
          setSelectedServices(prefs.services || []);
          setDistanceRadius(prefs.distanceRadius || DEFAULT_RADIUS);
          setUserLat(prefs.userLat || null);
          setUserLng(prefs.userLng || null);
          setLocationEnabled(prefs.locationEnabled || false);

          // Notify parent of loaded filters
          stableOnFiltersChange({
            services: prefs.services || [],
            distanceRadius: prefs.locationEnabled ? prefs.distanceRadius : null,
            searchQuery,
            userLat: prefs.userLat || null,
            userLng: prefs.userLng || null,
            locationEnabled: prefs.locationEnabled || false,
          });
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [stableOnFiltersChange, searchQuery]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t("eventsPage.filters.locationNotSupported"));
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setLocationEnabled(true);
        setGettingLocation(false);
      },
      (error) => {
        let errorMessage = t("eventsPage.filters.locationError");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t("eventsPage.filters.locationDenied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t("eventsPage.filters.locationUnavailable");
            break;
          case error.TIMEOUT:
            errorMessage = t("eventsPage.filters.locationTimeout");
            break;
        }
        setLocationError(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 300000,
      }
    );
  };

  const disableLocation = () => {
    setLocationEnabled(false);
  };

  const savePreferences = () => {
    setSaving(true);

    const filters: VenuesFilters = {
      services: selectedServices,
      distanceRadius: locationEnabled ? distanceRadius : null,
      searchQuery,
      userLat,
      userLng,
      locationEnabled,
    };

    // Save to localStorage
    const prefs = {
      services: selectedServices,
      distanceRadius,
      userLat,
      userLng,
      locationEnabled,
    };
    localStorage.setItem("venuesFilters", JSON.stringify(prefs));

    // Apply filters
    stableOnFiltersChange(filters);

    // Close panel after applying filters
    setIsOpen(false);
    setSaving(false);
  };

  const clearFilters = () => {
    setSelectedServices([]);
    setDistanceRadius(DEFAULT_RADIUS);
    setLocationEnabled(false);

    const filters: VenuesFilters = {
      services: [],
      distanceRadius: null,
      searchQuery: "",
      userLat,
      userLng,
      locationEnabled: false,
    };

    // Clear localStorage
    localStorage.removeItem("venuesFilters");

    stableOnFiltersChange(filters);
    setIsOpen(false);
  };

  const toggleService = (service: VenueService) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const activeFiltersCount =
    (selectedServices.length > 0 ? 1 : 0) + (locationEnabled ? 1 : 0);

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="shadow-sm"
      >
        <Filter className="mr-2 h-4 w-4" />
        {t("eventsPage.filters.title")}
        {activeFiltersCount > 0 && (
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filters Panel */}
      {isOpen && (
        <Card className="absolute left-0 top-full z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{t("eventsPage.filters.title")}</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Location Filter - Hidden in map mode */}
          {viewMode !== "map" && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium">
                {t("eventsPage.filters.location")}
              </h4>
              <div className="space-y-3">
                {locationEnabled ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={disableLocation}
                      className="flex-1"
                    >
                      <LocateOff className="mr-2 h-4 w-4" />
                      {t("eventsPage.filters.disableLocation")}
                    </Button>
                    <span className="text-xs text-green-600">
                      <MapPin className="inline h-3 w-3" />{" "}
                      {t("eventsPage.filters.locationActive")}
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestLocation}
                    disabled={gettingLocation}
                    className="w-full"
                  >
                    {gettingLocation ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed className="mr-2 h-4 w-4" />
                    )}
                    {t("eventsPage.filters.enableLocation")}
                  </Button>
                )}
                {locationError && (
                  <p className="text-xs text-destructive">{locationError}</p>
                )}

                {/* Distance Radius Slider */}
                {locationEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("eventsPage.filters.radius")}
                      </span>
                      <span className="text-sm font-medium">
                        {distanceRadius} km
                      </span>
                    </div>
                    <Slider
                      value={[distanceRadius]}
                      onValueChange={(value) => setDistanceRadius(value[0])}
                      min={10}
                      max={500}
                      step={10}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10 km</span>
                      <span>500 km</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Filter */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">
              {t("venues.filters.services")}
            </h4>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {VENUE_SERVICES.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={`venue-service-${service}`}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() => toggleService(service)}
                  />
                  <label
                    htmlFor={`venue-service-${service}`}
                    className="flex cursor-pointer items-center gap-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="text-base leading-none">
                      {getServiceIcon(service)}
                    </span>
                    <span>{t(`venues.services.${service}`)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={savePreferences}
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("eventsPage.filters.applyFilters")
              )}
            </Button>
            <Button variant="outline" onClick={clearFilters} disabled={saving}>
              {t("eventsPage.filters.clearFilters")}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
