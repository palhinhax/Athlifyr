import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin } from "lucide-react-native";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import {
  getSportIcon,
  getSportColor,
  getPrimarySport,
} from "@/src/lib/event-utils";
import { MapEventPreview } from "@/src/components/MapEventPreview";
import { MapSportFilter } from "@/src/components/MapSportFilter";

// Try to import Mapbox
let Mapbox: typeof import("@rnmapbox/maps").default | null = null;
let mapboxAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Mapbox = require("@rnmapbox/maps").default;
  mapboxAvailable = true;
} catch {
  console.warn(
    "@rnmapbox/maps is not available for EventsMap. Using fallback."
  );
}

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

if (mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

interface MapEvent {
  id: string;
  title: string;
  slug: string;
  sportTypes: string[];
  startDate: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
}

interface EventsMapProps {
  searchQuery?: string;
}

export function EventsMap({ searchQuery }: EventsMapProps) {
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const selectedSportsRef = useRef<string[]>([]);

  // Keep ref in sync
  useEffect(() => {
    selectedSportsRef.current = selectedSports;
  }, [selectedSports]);

  const fetchMapEvents = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      // Default: today to 2 months from now
      const now = new Date();
      const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      params.append("startDate", now.toISOString());
      params.append("endDate", endDate.toISOString());

      // Apply sport type filters
      const currentSports = selectedSportsRef.current;
      if (currentSports.length > 0) {
        params.append("sportTypes", currentSports.join(","));
      }

      const response = await api.get<{ events: MapEvent[] }>(
        `/events/map?${params.toString()}`
      );

      let mapEvents = response.data.events || [];

      // Filter by search query client-side if provided
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        mapEvents = mapEvents.filter(
          (e) =>
            e.title.toLowerCase().includes(query) ||
            e.city.toLowerCase().includes(query)
        );
      }

      setEvents(mapEvents);
    } catch (error) {
      console.error("Error fetching map events:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchMapEvents();
  }, [fetchMapEvents]);

  // Re-fetch when sport filters change
  const handleSportsChange = useCallback(
    (sports: string[]) => {
      setSelectedSports(sports);
      // Close any open preview when filters change
      setSelectedEvent(null);
      // Update the ref before fetching
      selectedSportsRef.current = sports;
      fetchMapEvents();
    },
    [fetchMapEvents]
  );

  const handleMarkerPress = useCallback(
    (event: MapEvent) => {
      // If tapping the same event, deselect it
      if (selectedEvent?.id === event.id) {
        setSelectedEvent(null);
      } else {
        setSelectedEvent(event);
      }
    },
    [selectedEvent]
  );

  const handleClosePreview = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const canShowMap = mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!canShowMap || !Mapbox) {
    return (
      <View style={styles.fallbackContainer}>
        <MapPin size={48} color={theme.colors.textTertiary} />
        <Text style={styles.fallbackText}>
          Map requires a development build
        </Text>
        <Text style={styles.fallbackSubtext}>
          {events.length} events available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Outdoors}
        compassEnabled
        scaleBarEnabled={false}
        attributionEnabled={false}
        logoEnabled={false}
        onPress={() => setSelectedEvent(null)}
      >
        <Mapbox.Camera
          centerCoordinate={[-8.0, 39.5]}
          zoomLevel={6}
          animationMode="flyTo"
        />
        {events.map((event) => {
          const primarySport = getPrimarySport(event.sportTypes);
          const sportColor = getSportColor(primarySport);
          const sportIcon = getSportIcon(primarySport);
          const isSelected = selectedEvent?.id === event.id;

          return (
            <Mapbox.PointAnnotation
              key={event.id}
              id={`event-${event.id}`}
              coordinate={[event.longitude, event.latitude]}
              onSelected={() => handleMarkerPress(event)}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.markerTeardrop,
                    {
                      backgroundColor: sportColor,
                      borderColor: isSelected
                        ? theme.colors.text
                        : theme.colors.white,
                      borderWidth: isSelected ? 3 : 2,
                    },
                  ]}
                >
                  <Text style={styles.markerIcon}>{sportIcon}</Text>
                </View>
              </View>
              {/* Empty callout to prevent default behavior */}
              <Mapbox.Callout title="" />
            </Mapbox.PointAnnotation>
          );
        })}
      </Mapbox.MapView>

      {/* Sport filters */}
      <MapSportFilter
        selectedSports={selectedSports}
        onSportsChange={handleSportsChange}
      />

      {/* Event count badge */}
      <View style={styles.eventCountBadge}>
        <Text style={styles.eventCountText}>
          {events.length} {events.length === 1 ? "evento" : "eventos"}
        </Text>
      </View>

      {/* Event preview card */}
      {selectedEvent && (
        <MapEventPreview
          event={selectedEvent}
          onClose={handleClosePreview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerTeardrop: {
    width: 36,
    height: 36,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
    transform: [{ rotate: "-45deg" }],
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  markerIcon: {
    fontSize: 16,
    lineHeight: 20,
    transform: [{ rotate: "45deg" }],
  },
  eventCountBadge: {
    position: "absolute",
    bottom: 16,
    left: 12,
    zIndex: 999,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  eventCountText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
});
