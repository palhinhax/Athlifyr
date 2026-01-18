"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";

interface Venue {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string | null;
  city: string | null;
  country: string;
  _count: {
    members: number;
    sessions: number;
  };
}

interface VenuesResponse {
  venues: Venue[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function VenuesPageClient() {
  const t = useTranslations("venues");
  const tTypes = useTranslations("venues.types");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/venues?page=${page}&pageSize=12`);
        const data: VenuesResponse = await response.json();

        if (page === 1) {
          setVenues(data.venues);
        } else {
          setVenues((prev) => [...prev, ...data.venues]);
        }

        setHasMore(data.pagination.hasMore);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("description")}</p>
      </div>

      {/* Venues Grid */}
      {loading && page === 1 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="mb-2 text-lg font-medium">{t("noVenues")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.slug}`}
                className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="p-6">
                  {/* Venue Type Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {tTypes(venue.type)}
                    </span>
                  </div>

                  {/* Venue Name */}
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                    {venue.name}
                  </h3>

                  {/* Location */}
                  {venue.city && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {venue.city}, {venue.country}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {venue.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {venue.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{venue._count.members}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{venue._count.sessions}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} disabled={loading} variant="outline">
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
