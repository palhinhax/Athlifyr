"use client";

import { useTranslations } from "next-intl";
import { EventsFilters } from "@/components/events-filters";
import { EventCard } from "@/components/event-card";
import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { calculateDistance } from "@/lib/geolocation";
import type { EventsFilters as EventsFiltersType } from "@/components/events-filters";
import type { Event, EventVariant } from "@prisma/client";

interface EventsPageClientProps {
  userId?: string;
}

type EventWithVariants = Event & {
  variants: EventVariant[];
};

export function EventsPageClient({ userId }: EventsPageClientProps) {
  const t = useTranslations("events");
  const [filters, setFilters] = useState<EventsFiltersType>({
    sports: [],
    dateRange: null,
    distanceRadius: null,
    searchQuery: "",
    userLat: null,
    userLng: null,
    locationEnabled: false,
  });
  const [events, setEvents] = useState<EventWithVariants[]>([]);
  const [participatingEventIds, setParticipatingEventIds] = useState<
    Set<string>
  >(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Add sport filters
      if (filters.sports && filters.sports.length > 0) {
        filters.sports.forEach((sport) => params.append("sports", sport));
      }

      // Add date range filter
      if (filters.dateRange) {
        params.append("dateRange", filters.dateRange);
      }

      // Add search query
      if (filters.searchQuery) {
        params.append("search", filters.searchQuery);
      }

      // Fetch events
      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      let fetchedEvents: EventWithVariants[] = await response.json();

      // Filter by distance if location is enabled
      if (
        filters.locationEnabled &&
        filters.userLat &&
        filters.userLng &&
        filters.distanceRadius
      ) {
        fetchedEvents = fetchedEvents.filter((event) => {
          if (!event.latitude || !event.longitude) return false;

          const distance = calculateDistance(
            filters.userLat!,
            filters.userLng!,
            event.latitude,
            event.longitude
          );

          return distance <= filters.distanceRadius!;
        });
      }

      setEvents(fetchedEvents);

      // Fetch user participations if logged in
      if (userId) {
        const participationsRes = await fetch(
          `/api/participations?userId=${userId}`
        );
        if (participationsRes.ok) {
          const participations = await participationsRes.json();
          setParticipatingEventIds(
            new Set(participations.map((p: { eventId: string }) => p.eventId))
          );
        }
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [filters, userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="min-h-screen">
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2 text-4xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <EventsFilters userId={userId} onFiltersChange={setFilters} />

        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-12 text-center text-destructive">
              <p>{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-lg">{t("noEvents")}</p>
              <p className="mt-2">
                {filters.sports.length > 0 ||
                filters.dateRange ||
                filters.searchQuery ||
                filters.locationEnabled
                  ? t("filters.noResults")
                  : t("noEventsDescription")}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {t("filters.resultsCount", { count: events.length })}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isParticipating={participatingEventIds.has(event.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
