"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, Loader2 } from "lucide-react";
import { SportType } from "@prisma/client";
import { getAnonymousId } from "@/lib/anonymous-id";
import { getSportIcon } from "@/lib/sport-config";

interface MapFiltersProps {
  userId?: string; // If user is authenticated
  onFiltersChange: (filters: MapFilters) => void;
}

export interface MapFilters {
  sports: SportType[];
  dateRange: string | null;
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

export function MapFilters({ userId, onFiltersChange }: MapFiltersProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const [selectedSports, setSelectedSports] = useState<SportType[]>([]);
  const [dateRange, setDateRange] = useState<string>("all");

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

        if (userId) {
          // Load from database for authenticated users
          const response = await fetch("/api/map/preferences");
          if (response.ok) {
            const data = await response.json();
            if (data.preferences) {
              const sports = data.preferences.sports || [];
              const range = data.preferences.dateRange || "all";
              setSelectedSports(sports);
              setDateRange(range);
              // Notify parent of loaded filters
              onFiltersChange({
                sports,
                dateRange: range === "all" ? null : range,
              });
            }
          }
        } else {
          // Load from database for anonymous users
          const anonymousId = getAnonymousId();
          const response = await fetch(
            `/api/map/preferences?anonymousId=${anonymousId}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.preferences) {
              const sports = data.preferences.sports || [];
              const range = data.preferences.dateRange || "all";
              setSelectedSports(sports);
              setDateRange(range);
              // Notify parent of loaded filters
              onFiltersChange({
                sports,
                dateRange: range === "all" ? null : range,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId, onFiltersChange]);

  const savePreferences = async () => {
    try {
      setSaving(true);

      const filters: MapFilters = {
        sports: selectedSports,
        dateRange: dateRange === "all" ? null : dateRange,
      };

      if (userId) {
        // Save to database for authenticated users
        await fetch("/api/map/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        });
      } else {
        // Save to database for anonymous users
        const anonymousId = getAnonymousId();
        await fetch("/api/map/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...filters, anonymousId }),
        });
      }

      // Apply filters
      onFiltersChange(filters);

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

    const filters: MapFilters = {
      sports: [],
      dateRange: null,
    };

    try {
      if (userId) {
        await fetch("/api/map/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        });
      } else {
        const anonymousId = getAnonymousId();
        await fetch("/api/map/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...filters, anonymousId }),
        });
      }
    } catch (error) {
      console.error("Error clearing preferences:", error);
    }

    onFiltersChange(filters);

    // Close panel after clearing filters
    setIsOpen(false);
  };

  const toggleSport = (sport: SportType) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const activeFiltersCount =
    (selectedSports.length > 0 ? 1 : 0) + (dateRange !== "all" ? 1 : 0);

  if (loading) {
    return (
      <div className="absolute right-4 top-4 z-[1001]">
        <Button variant="outline" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="absolute right-4 top-4 z-[1001]">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white shadow-lg"
      >
        <Filter className="mr-2 h-4 w-4" />
        {t("map.filters.title")}
        {activeFiltersCount > 0 && (
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filters Panel */}
      {isOpen && (
        <Card className="mt-2 w-80 p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{t("map.filters.title")}</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Sports Filter */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">
              {t("map.filters.sports")}
            </h4>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {SPORT_TYPES.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sport-${sport}`}
                    checked={selectedSports.includes(sport)}
                    onCheckedChange={() => toggleSport(sport)}
                  />
                  <label
                    htmlFor={`sport-${sport}`}
                    className="flex cursor-pointer items-center gap-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="text-base leading-none">
                      {getSportIcon(sport)}
                    </span>
                    <span>{t(`sports.${sport}`)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium">
              {t("map.filters.dateRange")}
            </h4>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[1002]">
                <SelectItem value="all">{t("map.filters.allDates")}</SelectItem>
                <SelectItem value="7d">{t("map.filters.next7Days")}</SelectItem>
                <SelectItem value="30d">
                  {t("map.filters.next30Days")}
                </SelectItem>
                <SelectItem value="3m">
                  {t("map.filters.next3Months")}
                </SelectItem>
                <SelectItem value="6m">
                  {t("map.filters.next6Months")}
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
                t("map.filters.applyFilters")
              )}
            </Button>
            <Button variant="outline" onClick={clearFilters} disabled={saving}>
              {t("map.filters.clearFilters")}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
