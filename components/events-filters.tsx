"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Filter,
  X,
  Loader2,
  MapPin,
  Search,
  LocateFixed,
  LocateOff,
} from "lucide-react";
import { SportType } from "@prisma/client";
import { getAnonymousId } from "@/lib/anonymous-id";

interface EventsFiltersProps {
  userId?: string;
  onFiltersChange: (filters: EventsFilters) => void;
}

export interface EventsFilters {
  sports: SportType[];
  dateRange: string | null;
  distanceRadius: number | null;
  searchQuery: string;
  userLat: number | null;
  userLng: number | null;
  locationEnabled: boolean;
}

const SPORT_TYPES: SportType[] = [
  "RUNNING",
  "TRAIL",
  "HYROX",
  "CROSSFIT",
  "OCR",
  "BTT",
  "CYCLING",
  "SURF",
  "TRIATHLON",
  "SWIMMING",
  "OTHER",
];

const DEFAULT_RADIUS = 50; // km

export function EventsFilters({ userId, onFiltersChange }: EventsFiltersProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [selectedSports, setSelectedSports] = useState<SportType[]>([]);
  const [dateRange, setDateRange] = useState<string>("all");
  const [distanceRadius, setDistanceRadius] = useState<number>(DEFAULT_RADIUS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);

  // Memoized onFiltersChange to avoid re-renders
  const stableOnFiltersChange = useCallback(onFiltersChange, [onFiltersChange]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Don't close if clicking on Select dropdown items (Radix UI portals)
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
      try {
        setLoading(true);

        let response: Response;
        if (userId) {
          response = await fetch("/api/events/preferences");
        } else {
          const anonymousId = getAnonymousId();
          response = await fetch(
            `/api/events/preferences?anonymousId=${anonymousId}`
          );
        }

        if (response.ok) {
          const data = await response.json();
          if (data.preferences) {
            const prefs = data.preferences;
            setSelectedSports(prefs.sports || []);
            setDateRange(prefs.dateRange || "all");
            setDistanceRadius(prefs.distanceRadius || DEFAULT_RADIUS);
            setSearchQuery(prefs.searchQuery || "");
            setUserLat(prefs.userLat || null);
            setUserLng(prefs.userLng || null);
            setLocationEnabled(prefs.locationEnabled || false);

            // Notify parent of loaded filters
            stableOnFiltersChange({
              sports: prefs.sports || [],
              dateRange: prefs.dateRange === "all" ? null : prefs.dateRange,
              distanceRadius: prefs.locationEnabled
                ? prefs.distanceRadius
                : null,
              searchQuery: prefs.searchQuery || "",
              userLat: prefs.userLat || null,
              userLng: prefs.userLng || null,
              locationEnabled: prefs.locationEnabled || false,
            });
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId, stableOnFiltersChange]);

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
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes cache
      }
    );
  };

  const disableLocation = () => {
    setLocationEnabled(false);
  };

  const savePreferences = async () => {
    try {
      setSaving(true);

      const filters: EventsFilters = {
        sports: selectedSports,
        dateRange: dateRange === "all" ? null : dateRange,
        distanceRadius: locationEnabled ? distanceRadius : null,
        searchQuery,
        userLat,
        userLng,
        locationEnabled,
      };

      const body = {
        ...filters,
        dateRange: dateRange,
        distanceRadius: distanceRadius,
        anonymousId: userId ? undefined : getAnonymousId(),
      };

      await fetch("/api/events/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Apply filters
      stableOnFiltersChange(filters);

      // Close panel after applying filters
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = async () => {
    setSelectedSports([]);
    setDateRange("all");
    setDistanceRadius(DEFAULT_RADIUS);
    setSearchQuery("");
    setLocationEnabled(false);

    const filters: EventsFilters = {
      sports: [],
      dateRange: null,
      distanceRadius: null,
      searchQuery: "",
      userLat,
      userLng,
      locationEnabled: false,
    };

    try {
      const body = {
        sports: [],
        dateRange: "all",
        distanceRadius: DEFAULT_RADIUS,
        searchQuery: "",
        userLat,
        userLng,
        locationEnabled: false,
        anonymousId: userId ? undefined : getAnonymousId(),
      };

      await fetch("/api/events/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Error clearing preferences:", error);
    }

    stableOnFiltersChange(filters);
    setIsOpen(false);
  };

  const toggleSport = (sport: SportType) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const activeFiltersCount =
    (selectedSports.length > 0 ? 1 : 0) +
    (dateRange !== "all" ? 1 : 0) +
    (locationEnabled ? 1 : 0) +
    (searchQuery ? 1 : 0);

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

          {/* Search Input */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">
              {t("eventsPage.filters.search")}
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("eventsPage.filters.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location Filter */}
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

          {/* Sports Filter */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">
              {t("eventsPage.filters.sports")}
            </h4>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {SPORT_TYPES.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox
                    id={`events-sport-${sport}`}
                    checked={selectedSports.includes(sport)}
                    onCheckedChange={() => toggleSport(sport)}
                  />
                  <label
                    htmlFor={`events-sport-${sport}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t(`sports.${sport}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">
              {t("eventsPage.filters.dateRange")}
            </h4>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="all">
                  {t("eventsPage.filters.allDates")}
                </SelectItem>
                <SelectItem value="7d">
                  {t("eventsPage.filters.next7Days")}
                </SelectItem>
                <SelectItem value="30d">
                  {t("eventsPage.filters.next30Days")}
                </SelectItem>
                <SelectItem value="3m">
                  {t("eventsPage.filters.next3Months")}
                </SelectItem>
                <SelectItem value="6m">
                  {t("eventsPage.filters.next6Months")}
                </SelectItem>
              </SelectContent>
            </Select>
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
