import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, LocateFixed } from "lucide-react-native";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import {
  getSportIcon,
  getSportColor,
  getPrimarySport,
} from "@/src/lib/event-utils";
import { MapEventPreview } from "@/src/components/MapEventPreview";

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
  readonly searchQuery?: string;
  readonly selectedSports: string[];
  readonly onSportsChange: (sports: string[]) => void;
  readonly startDays?: number;
  readonly endDays?: number;
  readonly userLatitude?: number | null;
  readonly userLongitude?: number | null;
}

export function EventsMap({
  searchQuery,
  selectedSports,
  onSportsChange: _onSportsChange,
  startDays = 0,
  endDays = 60,
  userLatitude,
  userLongitude,
}: EventsMapProps) {
  const { t } = useTranslation();
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const cameraRef = useRef<InstanceType<
    typeof import("@rnmapbox/maps").default.Camera
  > | null>(null);

  const fetchMapEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const start = new Date(now.getTime() + startDays * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() + endDays * 24 * 60 * 60 * 1000);
      params.append("startDate", start.toISOString());
      params.append("endDate", end.toISOString());

      // Apply sport type filters
      if (selectedSports.length > 0) {
        params.append("sportTypes", selectedSports.join(","));
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
      setInitialLoading(false);
    }
  }, [searchQuery, selectedSports, startDays, endDays]);

  useEffect(() => {
    fetchMapEvents();
  }, [fetchMapEvents]);

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

  const handleCenterOnUser = useCallback(() => {
    if (userLatitude != null && userLongitude != null && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLongitude, userLatitude],
        zoomLevel: 8,
        animationDuration: 1000,
      });
    }
  }, [userLatitude, userLongitude]);

  const canShowMap = mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN;

  if (initialLoading && events.length === 0) {
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
        onPress={handleClosePreview}
      >
        <Mapbox.Camera
          ref={(ref) => {
            cameraRef.current = ref;
          }}
          defaultSettings={{
            centerCoordinate:
              userLatitude != null && userLongitude != null
                ? [userLongitude, userLatitude]
                : [-8.0, 39.5],
            zoomLevel: userLatitude == null ? 6 : 8,
          }}
        />
        <Mapbox.UserLocation visible animated />
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
            </Mapbox.PointAnnotation>
          );
        })}
      </Mapbox.MapView>

      {/* Center on user button */}
      {userLatitude != null && userLongitude != null && (
        <TouchableOpacity
          style={styles.centerButton}
          onPress={handleCenterOnUser}
          activeOpacity={0.8}
        >
          <LocateFixed size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      )}

      {/* Event count badge */}
      <View style={styles.eventCountBadge}>
        <Text style={styles.eventCountText}>
          {t("events.mapFilters.eventsCount", { count: events.length })}
        </Text>
      </View>

      {/* Event preview card */}
      {selectedEvent && (
        <MapEventPreview event={selectedEvent} onClose={handleClosePreview} />
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
  centerButton: {
    position: "absolute",
    bottom: 16,
    right: 12,
    zIndex: 999,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
});
