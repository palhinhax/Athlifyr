"use client";

import { useTranslations } from "next-intl";
import { EventsFilters } from "@/components/events-filters";
import { EventCard } from "@/components/event-card";
import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Map, LayoutGrid, Search } from "lucide-react";
import { calculateDistance } from "@/lib/geolocation";
import type { EventsFilters as EventsFiltersType } from "@/components/events-filters";
import type { Event, EventVariant } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const EventsMapClient = dynamic(
  () => import("@/components/events-map-client"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-lg border bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface EventsPageClientProps {
  userId?: string;
}

type EventWithVariants = Event & {
  variants: EventVariant[];
};

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export function EventsPageClient({ userId }: EventsPageClientProps) {
  const t = useTranslations("events");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState<EventsFiltersType>({
    sports: [],
    distanceRadius: null,
    searchQuery: "",
    userLat: null,
    userLng: null,
    locationEnabled: false,
  });
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<EventWithVariants[]>([]);
  const [participatingEventIds, setParticipatingEventIds] = useState<
    Set<string>
  >(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
  });
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: localSearchQuery }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery]);

  const fetchEvents = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params = new URLSearchParams();

        // Add pagination parameters
        params.append("page", page.toString());
        params.append("pageSize", "12");

        // Add sport filters
        if (filters.sports && filters.sports.length > 0) {
          filters.sports.forEach((sport) => params.append("sports", sport));
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

        const data: {
          events: EventWithVariants[];
          pagination: PaginationInfo;
        } = await response.json();

        let fetchedEvents = data.events;

        // Filter by distance if location is enabled (but not when searching or in map mode)
        if (
          viewMode === "list" &&
          filters.locationEnabled &&
          filters.userLat &&
          filters.userLng &&
          filters.distanceRadius &&
          !filters.searchQuery
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

        // Append or replace events
        if (append) {
          setEvents((prev) => [...prev, ...fetchedEvents]);
        } else {
          setEvents(fetchedEvents);
        }

        setPagination(data.pagination);

        // Fetch user participations if logged in (only on first page)
        if (userId && page === 1) {
          const participationsRes = await fetch(
            `/api/participations?userId=${userId}`
          );
          if (participationsRes.ok) {
            const participationData = await participationsRes.json();
            const participations = Array.isArray(participationData)
              ? participationData
              : participationData.participations || [];
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
        setLoadingMore(false);
      }
    },
    [filters, userId, viewMode]
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchEvents(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, viewMode]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          pagination.hasMore &&
          !loading &&
          !loadingMore &&
          viewMode === "list"
        ) {
          fetchEvents(pagination.page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [pagination, loading, loadingMore, viewMode, fetchEvents]);

  // Sync localSearchQuery when filters.searchQuery changes from external source (like clearing filters)
  useEffect(() => {
    if (filters.searchQuery === "" && localSearchQuery !== "") {
      setLocalSearchQuery("");
    }
  }, [filters.searchQuery, localSearchQuery]);

  return (
    <div className="min-h-screen">
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Search Bar - Always Visible */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("filters.searchPlaceholder")}
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="h-12 pl-11 pr-4 text-base shadow-sm"
            />
          </div>
          {filters.searchQuery && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("filters.searchingGlobally")}
            </p>
          )}
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <EventsFilters
            userId={userId}
            onFiltersChange={setFilters}
            searchQuery={filters.searchQuery}
            viewMode={viewMode}
          />
          <div className="flex shrink-0 gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="lg"
              onClick={() => setViewMode("list")}
              className="px-3 md:px-4"
            >
              <LayoutGrid className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t("viewList")}</span>
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="lg"
              onClick={() => setViewMode("map")}
              className="px-3 md:px-4"
            >
              <Map className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t("viewMap")}</span>
            </Button>
          </div>
        </div>

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
                filters.searchQuery ||
                filters.locationEnabled
                  ? t("filters.noResults")
                  : t("noEventsDescription")}
              </p>
            </div>
          ) : viewMode === "map" ? (
            <div className="h-[600px] overflow-hidden rounded-lg border">
              <EventsMapClient
                filters={{
                  sports: filters.sports,
                  dateRange: null, // Map doesn't use date range filtering yet
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {t("filters.resultsCount", { count: pagination.totalCount })}
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

              {/* Infinite scroll trigger */}
              {pagination.hasMore && (
                <div
                  ref={observerTarget}
                  className="mt-8 flex items-center justify-center py-8"
                >
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t("loadingMore")}</span>
                    </div>
                  )}
                </div>
              )}

              {/* End of results message */}
              {!pagination.hasMore && events.length > 0 && (
                <div className="mt-8 py-8 text-center text-sm text-muted-foreground">
                  {t("allEventsLoaded")}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
