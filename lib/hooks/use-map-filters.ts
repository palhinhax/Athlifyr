"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { MapFilters } from "@/lib/map-filters";
import { DEFAULT_MAP_FILTERS } from "@/lib/map-filters";
import { getDeviceId, hasDeviceId, clearDeviceId } from "@/lib/device-id";

const MAP_FILTERS_CACHE_KEY = "athlifyr_map_filters_cache";

/**
 * Save filters to localStorage as fallback
 */
function saveFiltersToCache(filters: MapFilters): void {
  try {
    localStorage.setItem(MAP_FILTERS_CACHE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Error saving filters to cache:", error);
  }
}

/**
 * Load filters from localStorage cache
 */
function loadFiltersFromCache(): MapFilters | null {
  try {
    const cached = localStorage.getItem(MAP_FILTERS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error("Error loading filters from cache:", error);
  }
  return null;
}

/**
 * Fetch filters from API
 */
async function fetchFilters(
  userId: string | undefined,
  deviceId: string | undefined
): Promise<MapFilters> {
  const params = new URLSearchParams();
  if (deviceId && !userId) {
    params.set("deviceId", deviceId);
  }

  const response = await fetch(`/api/map-filters?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch map filters");
  }

  const result = await response.json();

  if (result.success && result.data) {
    return result.data.filters;
  }

  // No filters found - return defaults
  return DEFAULT_MAP_FILTERS;
}

/**
 * Save filters to API
 */
async function saveFilters(
  filters: MapFilters,
  userId: string | undefined,
  deviceId: string | undefined
): Promise<void> {
  const response = await fetch("/api/map-filters", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filters,
      deviceId: !userId ? deviceId : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save map filters");
  }
}

/**
 * Migrate filters on login
 */
async function migrateFilters(deviceId: string): Promise<MapFilters> {
  const response = await fetch("/api/map-filters/migrate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceId }),
  });

  if (!response.ok) {
    throw new Error("Failed to migrate map filters");
  }

  const result = await response.json();

  if (result.success && result.data) {
    return result.data.filters;
  }

  return DEFAULT_MAP_FILTERS;
}

/**
 * Hook for managing map filters with persistence
 */
export function useMapFilters() {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const [deviceId, setDeviceId] = useState<string>("");
  const [hasPerformedMigration, setHasPerformedMigration] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize device ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDeviceId(getDeviceId());
    }
  }, []);

  const userId = session?.user?.id;

  // Query key depends on userId or deviceId (memoized to prevent re-renders)
  const queryKey = useMemo(
    () => ["mapFilters", userId || deviceId],
    [userId, deviceId]
  );

  // Fetch filters
  const {
    data: filters = DEFAULT_MAP_FILTERS,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchFilters(userId, deviceId);
      } catch (error) {
        console.error("Error fetching filters, using cache:", error);
        // Fallback to cache
        return loadFiltersFromCache() || DEFAULT_MAP_FILTERS;
      }
    },
    enabled: !!deviceId || !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (newFilters: MapFilters) =>
      saveFilters(newFilters, userId, deviceId),
    onMutate: async (newFilters) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousFilters = queryClient.getQueryData<MapFilters>(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, newFilters);

      // Save to cache as fallback
      saveFiltersToCache(newFilters);

      return { previousFilters };
    },
    onError: (_error, _newFilters, context) => {
      // Rollback on error
      if (context?.previousFilters) {
        queryClient.setQueryData(queryKey, context.previousFilters);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Migrate mutation
  const migrateMutation = useMutation({
    mutationFn: () => migrateFilters(deviceId),
    onSuccess: (migratedFilters) => {
      queryClient.setQueryData(queryKey, migratedFilters);
      saveFiltersToCache(migratedFilters);
      clearDeviceId();
    },
  });

  // Handle login migration
  useEffect(() => {
    if (
      sessionStatus === "authenticated" &&
      userId &&
      hasDeviceId() &&
      !hasPerformedMigration
    ) {
      migrateMutation.mutate();
      setHasPerformedMigration(true);
    }
  }, [sessionStatus, userId, hasPerformedMigration, migrateMutation]);

  // Update filters with debounce
  const updateFilters = useCallback(
    (newFilters: MapFilters | ((prev: MapFilters) => MapFilters)) => {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const resolvedFilters =
        typeof newFilters === "function" ? newFilters(filters) : newFilters;

      // Update immediately in UI (optimistic)
      queryClient.setQueryData(queryKey, resolvedFilters);

      // Debounce the API call
      debounceTimerRef.current = setTimeout(() => {
        saveMutation.mutate(resolvedFilters);
      }, 500);
    },
    [filters, queryClient, queryKey, saveMutation]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    updateFilters(DEFAULT_MAP_FILTERS);
  }, [updateFilters]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
    isSaving: saveMutation.isPending,
  };
}
