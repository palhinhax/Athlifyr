"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Loader2, Users, Search, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface ClientPlan {
  name: string;
  status: string;
}

interface Client {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  plans: ClientPlan[];
  hasActiveSubscription: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
}

interface VenueClientsManagerProps {
  venueId: string;
  locale: string;
}

export function VenueClientsManager({
  venueId,
  locale: _locale,
}: VenueClientsManagerProps) {
  const t = useTranslations("venues");
  const tCommon = useTranslations("common");

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchClients = useCallback(
    async (pageNum: number, searchQuery: string, append = false) => {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "20",
        });
        if (searchQuery) {
          params.set("search", searchQuery);
        }

        const response = await fetch(
          `/api/venues/${venueId}/clients?${params}`
        );
        if (response.ok) {
          const data = await response.json();
          if (append) {
            setClients((prev) => [...prev, ...data.clients]);
          } else {
            setClients(data.clients || []);
          }
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [venueId]
  );

  // Reset and fetch when search changes
  useEffect(() => {
    setPage(1);
    fetchClients(1, debouncedSearch, false);
  }, [debouncedSearch, fetchClients]);

  // Load more when scrolling
  const loadMore = useCallback(() => {
    if (pagination?.hasMore && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchClients(nextPage, debouncedSearch, true);
    }
  }, [
    pagination?.hasMore,
    loadingMore,
    loading,
    page,
    debouncedSearch,
    fetchClients,
  ]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  if (loading && clients.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("subscribers.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            disabled
          />
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("subscribers.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      {pagination && (
        <p className="text-sm text-muted-foreground">
          {t("subscribers.totalSubscribers", { count: pagination.totalCount })}
        </p>
      )}

      {/* Clients List */}
      {clients.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            {search ? t("subscribers.noResults") : t("noClients")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div key={client.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  {client.image ? (
                    <Image
                      src={client.image}
                      alt={client.name || "User"}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {client.name?.[0] || "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">
                        {client.name || client.email}
                      </p>
                      {client.hasActiveSubscription ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                </div>
                {client.plans.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {client.plans.map((plan, index) => (
                      <Badge
                        key={index}
                        variant={
                          plan.status === "ACTIVE" ? "default" : "secondary"
                        }
                        className={`text-xs ${
                          plan.status !== "ACTIVE" ? "opacity-60" : ""
                        }`}
                      >
                        {plan.name}
                        {plan.status !== "ACTIVE" && (
                          <span className="ml-1 text-[10px]">
                            ({tCommon("inactive")})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="h-10">
            {loadingMore && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
