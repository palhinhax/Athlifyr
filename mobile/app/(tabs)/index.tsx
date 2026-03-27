import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import { EventCard } from "@/src/components/EventCard";
import { EventsMap } from "@/src/components/EventsMap";
import { MapSportFilter } from "@/src/components/MapSportFilter";
import { DateRangeSlider } from "@/src/components/DateRangeSlider";

import { useEventSportFilter } from "@/src/hooks/useEventSportFilter";
import { useLocationFilter } from "@/src/hooks/useLocationFilter";
import { Search, LayoutGrid, Map, Star, Calendar } from "lucide-react-native";
import type { Event } from "@/src/types";

interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function EventsScreen() {
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const {
    selectedSports,
    onSportsChange,
    loaded: filterLoaded,
  } = useEventSportFilter();
  const {
    locationEnabled,
    radiusKm,
    userLat,
    userLng,
    loaded: locationLoaded,
    onLocationToggle: handleLocationToggle,
    onRadiusChange: handleRadiusChange,
    onLocationObtained: handleLocationObtained,
  } = useLocationFilter();
  const [startDays, setStartDays] = useState(0);
  const [endDays, setEndDays] = useState(60);
  const [debouncedRadius, setDebouncedRadius] = useState(100);
  const [debouncedStartDays, setDebouncedStartDays] = useState(0);
  const [debouncedEndDays, setDebouncedEndDays] = useState(60);

  // Sync debounced radius with persisted value once loaded
  useEffect(() => {
    setDebouncedRadius(radiusKm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationLoaded]);

  // Debounce radius changes so the API isn't called on every drag pixel
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRadius(radiusKm);
    }, 400);
    return () => clearTimeout(timer);
  }, [radiusKm]);

  // Debounce date range changes for the map API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStartDays(startDays);
      setDebouncedEndDays(endDays);
    }, 400);
    return () => clearTimeout(timer);
  }, [startDays, endDays]);

  const handleDateRangeChange = useCallback((start: number, end: number) => {
    setStartDays(start);
    setEndDays(end);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchEvents = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        if (!append) setLoading(true);

        const params = new URLSearchParams();
        params.append("page", pageNum.toString());
        params.append("pageSize", "20");
        params.append("featured", "false");

        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        if (selectedSports.length > 0) {
          params.append("sportTypes", selectedSports.join(","));
        }

        if (locationEnabled && userLat !== null && userLng !== null) {
          params.append("lat", userLat.toString());
          params.append("lng", userLng.toString());
          params.append("radiusKm", debouncedRadius.toString());
        }

        const response = await api.get<EventsResponse>(
          `/events?${params.toString()}`
        );

        const newEvents = response.data.events;

        if (append) {
          setEvents((prev) => [...prev, ...newEvents]);
        } else {
          setEvents(newEvents);
        }

        setHasMore(response.data.pagination.hasMore);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      debouncedSearch,
      selectedSports,
      locationEnabled,
      userLat,
      userLng,
      debouncedRadius,
    ]
  );

  useEffect(() => {
    if (filterLoaded && locationLoaded) {
      fetchEvents(1, false);
    }
  }, [
    debouncedSearch,
    selectedSports,
    filterLoaded,
    locationLoaded,
    fetchEvents,
    locationEnabled,
    userLat,
    userLng,
    debouncedRadius,
  ]);

  // Fetch featured events
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const params = new URLSearchParams();
        params.append("featured", "true");
        params.append("pageSize", "50");
        const response = await api.get<EventsResponse>(
          `/events?${params.toString()}`
        );
        setFeaturedEvents(response.data.events);
      } catch {
        // Featured section is non-critical
      }
    };
    fetchFeatured();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEvents(1, false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchEvents(page + 1, true);
    }
  };

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t("events.noEvents")}</Text>
        <Text style={styles.emptySubtext}>
          {debouncedSearch
            ? t("events.filters.noResults")
            : t("events.noEventsDescription")}
        </Text>
      </View>
    );
  };

  // Filter featured events to match active filters
  const filteredFeatured = useMemo(() => {
    let filtered = featuredEvents;

    if (selectedSports.length > 0) {
      filtered = filtered.filter((e) =>
        e.sportTypes?.some((s: string) => selectedSports.includes(s))
      );
    }

    // Hide featured section when location filter is active
    if (locationEnabled && userLat !== null && userLng !== null) {
      return [];
    }

    return filtered;
  }, [featuredEvents, selectedSports, locationEnabled, userLat, userLng]);

  // Group events by month/year for section headers
  const sections = useMemo(() => {
    const groups: { key: string; title: string; data: Event[] }[] = [];
    for (const event of events) {
      const date = new Date(event.startDate);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
      const title = new Intl.DateTimeFormat(i18n.language, {
        month: "long",
        year: "numeric",
      }).format(date);

      const existing = groups.find((g) => g.key === key);
      if (existing) {
        existing.data.push(event);
      } else {
        groups.push({ key, title, data: [event] });
      }
    }
    return groups;
  }, [events, i18n.language]);

  return (
    <View style={styles.container}>
      {/* Search Bar + View Toggle */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search
              size={20}
              color={theme.colors.textSecondary}
              style={styles.searchIcon}
              accessible={false}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t("events.filters.searchPlaceholder")}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel={t("events.a11y.searchEvents")}
              accessibilityRole="search"
            />
          </View>

          {/* View Mode Toggle */}
          <View style={styles.viewToggle} accessibilityRole="tablist">
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === "list" && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode("list")}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityLabel={t("events.a11y.listView")}
              accessibilityState={{ selected: viewMode === "list" }}
            >
              <LayoutGrid
                size={18}
                color={
                  viewMode === "list"
                    ? theme.colors.white
                    : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === "map" && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode("map")}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityLabel={t("events.a11y.mapView")}
              accessibilityState={{ selected: viewMode === "map" }}
            >
              <Map
                size={18}
                color={
                  viewMode === "map"
                    ? theme.colors.white
                    : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sport filter - always visible below search */}
      <View style={styles.filterWrapper}>
        <MapSportFilter
          selectedSports={selectedSports}
          onSportsChange={onSportsChange}
          inline
          showLocationFilter={viewMode === "list"}
          locationEnabled={locationEnabled}
          latitude={userLat}
          longitude={userLng}
          radiusKm={radiusKm}
          onLocationToggle={handleLocationToggle}
          onRadiusChange={handleRadiusChange}
          onLocationObtained={handleLocationObtained}
        />
      </View>

      {/* Content */}
      {viewMode === "map" ? (
        <>
          <DateRangeSlider
            startDays={startDays}
            endDays={endDays}
            onRangeChange={handleDateRangeChange}
          />
          <EventsMap
            searchQuery={debouncedSearch}
            selectedSports={selectedSports}
            onSportsChange={onSportsChange}
            startDays={debouncedStartDays}
            endDays={debouncedEndDays}
            userLatitude={userLat}
            userLongitude={userLng}
          />
        </>
      ) : loading && events.length === 0 ? (
        <View style={styles.loadingContainer} accessibilityRole="none">
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            accessibilityLabel={t("events.a11y.loadingEvents")}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <SectionList
            sections={sections}
            renderItem={({ item }) => <EventCard event={item} />}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Calendar size={18} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionLine} />
                <Text style={styles.sectionCount}>{section.data.length}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              filteredFeatured.length > 0 && !debouncedSearch ? (
                <View style={styles.featuredSection}>
                  <View style={styles.sectionHeader}>
                    <Star size={18} color="#facc15" fill="#facc15" />
                    <Text style={styles.sectionTitle}>
                      {t("events.featured")}
                    </Text>
                    <View style={styles.sectionLine} />
                  </View>
                  {filteredFeatured.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </View>
              ) : null
            }
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            accessibilityLabel={t("events.a11y.eventsList")}
            stickySectionHeadersEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterWrapper: {
    position: "relative",
    zIndex: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  viewToggle: {
    flexDirection: "row",
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  viewToggleButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  viewToggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl * 2,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.text,
    textTransform: "capitalize",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  sectionCount: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  featuredSection: {
    marginBottom: theme.spacing.sm,
  },
});
