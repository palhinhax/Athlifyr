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
    [debouncedSearch]
  );

  useEffect(() => {
    fetchEvents(1, false);
  }, [debouncedSearch, fetchEvents]);

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

      {/* Content */}
      {viewMode === "map" ? (
        <EventsMap searchQuery={debouncedSearch} />
      ) : loading && events.length === 0 ? (
        <View style={styles.loadingContainer} accessibilityRole="none">
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            accessibilityLabel={t("events.a11y.loadingEvents")}
          />
        </View>
      ) : (
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
            featuredEvents.length > 0 && !debouncedSearch ? (
              <View style={styles.featuredSection}>
                <View style={styles.sectionHeader}>
                  <Star size={18} color="#facc15" fill="#facc15" />
                  <Text style={styles.sectionTitle}>
                    {t("events.featured")}
                  </Text>
                  <View style={styles.sectionLine} />
                </View>
                {featuredEvents.map((event) => (
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
