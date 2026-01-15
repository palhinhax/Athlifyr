"use client";

import { useCallback } from "react";
import { MapFilters, type MapFilters as MapFiltersType } from "./map-filters";
import { NextIntlClientProvider } from "next-intl";

interface MapFiltersWrapperProps {
  userId?: string;
  locale: string;
}

export function MapFiltersWrapper({ userId, locale }: MapFiltersWrapperProps) {
  const handleFiltersChange = useCallback((newFilters: MapFiltersType) => {
    // Trigger map refresh with new filters
    // This will be handled by the EventsMapClient component
    window.dispatchEvent(
      new CustomEvent("mapFiltersChange", { detail: newFilters })
    );
  }, []);

  return (
    <NextIntlClientProvider locale={locale}>
      <MapFilters userId={userId} onFiltersChange={handleFiltersChange} />
    </NextIntlClientProvider>
  );
}
