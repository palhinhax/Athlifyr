"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { VenuesFilters } from "@/components/venues-filters";
import { VenueCard } from "@/components/venue-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Map, LayoutGrid, Search } from "lucide-react";
import { calculateDistance } from "@/lib/geolocation";
import type { VenuesFilters as VenuesFiltersType } from "@/components/venues-filters";
import { HeroBackground } from "@/components/hero-background";
import dynamic from "next/dynamic";

// Venue hero images
const VENUE_HERO_IMAGES = [
  "/images/venues/venue-1.jpg",
  "/images/venues/venue-2.jpg",
  "/images/venues/venue-3.jpg",
  "/images/venues/venue-4.jpg",
];

// Dynamically import the map component to avoid SSR issues
const VenuesMapClient = dynamic(
  () => import("@/components/venues-map-client"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-lg border bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface VenueCardData {
  id: string;
  slug: string;
  name: string;
  type: string;
  services: string[];
  description: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  coverImage: string | null;
  logo: string | null;
  _count: {
    members: number;
    sessions: number;
  };
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export function VenuesPageClient() {
  const t = useTranslations("venues");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState<VenuesFiltersType>({
    services: [],
    distanceRadius: null,
    searchQuery: "",
    userLat: null,
    userLng: null,
    locationEnabled: false,
  });
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [venues, setVenues] = useState<VenueCardData[]>([]);
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

  // Random hero image (stable per session)
  const heroImage = useMemo(() => {
    return VENUE_HERO_IMAGES[
      Math.floor(Math.random() * VENUE_HERO_IMAGES.length)
    ];
  }, []);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: localSearchQuery }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery]);

  const fetchVenues = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("pageSize", "12");

        if (filters.services && filters.services.length > 0) {
          filters.services.forEach((service) =>
            params.append("services", service)
          );
        }

        if (filters.searchQuery) {
          params.append("search", filters.searchQuery);
        }

        const response = await fetch(`/api/venues?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data: {
          venues: VenueCardData[];
          pagination: PaginationInfo;
        } = await response.json();

        let fetchedVenues = data.venues;

        // Filter by distance if location is enabled
        if (
          viewMode === "list" &&
          filters.locationEnabled &&
          filters.userLat &&
          filters.userLng &&
          filters.distanceRadius &&
          !filters.searchQuery
        ) {
          fetchedVenues = fetchedVenues.filter((venue) => {
            if (!venue.latitude || !venue.longitude) return false;

            const distance = calculateDistance(
              filters.userLat!,
              filters.userLng!,
              venue.latitude,
              venue.longitude
            );

            return distance <= filters.distanceRadius!;
          });
        }

        if (append) {
          setVenues((prev) => [...prev, ...fetchedVenues]);
        } else {
          setVenues(fetchedVenues);
        }

        setPagination(data.pagination);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError(err instanceof Error ? err.message : "Failed to load venues");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, viewMode]
  );

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchVenues(1, false);
  }, [filters, viewMode, fetchVenues]);

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
          fetchVenues(pagination.page + 1, true);
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
  }, [pagination, loading, loadingMore, viewMode, fetchVenues]);

  return (
    <div className="min-h-screen">
      <HeroBackground
        image={heroImage}
        title={t("title")}
        description={t("description")}
      />

      <section className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="h-12 pl-11 pr-4 text-base shadow-sm"
            />
          </div>
          {filters.searchQuery && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("searchingGlobally")}
            </p>
          )}
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <VenuesFilters
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
          ) : venues.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-lg">{t("noVenues")}</p>
              <p className="mt-2">
                {filters.services.length > 0 ||
                filters.searchQuery ||
                filters.locationEnabled
                  ? t("noResults")
                  : t("noVenuesDescription")}
              </p>
            </div>
          ) : viewMode === "map" ? (
            <div className="h-[600px] overflow-hidden rounded-lg border">
              <VenuesMapClient
                filters={{
                  services: filters.services,
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {t("resultsCount", { count: pagination.totalCount })}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
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
              {!pagination.hasMore && venues.length > 0 && (
                <div className="mt-8 py-8 text-center text-sm text-muted-foreground">
                  {t("allVenuesLoaded")}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
