import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import Mapbox from "@rnmapbox/maps";
import type { Feature } from "geojson";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import type { Event } from "@/src/types";

// Configure Mapbox
const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

if (MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
} else {
  console.warn("EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
}

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

interface EventGeoJSON {
  type: "FeatureCollection";
  features: Array<
    Feature<
      { type: "Point"; coordinates: [number, number] },
      {
        id: string;
        title: string;
        city: string;
        startDate: string;
        slug: string;
      }
    >
  >;
}

// Type for Mapbox onPress event
interface MapboxOnPressEvent {
  features: Feature[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  point: {
    x: number;
    y: number;
  };
}

export default function EventsMapScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<EventGeoJSON>({
    type: "FeatureCollection",
    features: [],
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch up to 100 events for map display
      // Note: For production with many events, consider:
      // - Using React Query for caching
      // - Implementing viewport-based fetching
      // - Server-side filtering by map bounds
      const response = await api.get<EventsResponse>("/events?pageSize=100");
      const allEvents = response.data.events;

      // Filter events with valid coordinates
      const validEvents = allEvents.filter(
        (event) =>
          event.latitude != null &&
          event.longitude != null &&
          !isNaN(event.latitude) &&
          !isNaN(event.longitude)
      );

      if (validEvents.length === 0) {
        console.warn("No events with valid coordinates found");
      }

      const missingCount = allEvents.length - validEvents.length;
      if (missingCount > 0) {
        console.log(
          `${missingCount} events have missing or invalid coordinates`
        );
      }

      setEvents(validEvents);

      // Convert to GeoJSON format for Mapbox
      const geoJson: EventGeoJSON = {
        type: "FeatureCollection",
        features: validEvents.map((event) => ({
          type: "Feature",
          id: event.id,
          geometry: {
            type: "Point",
            coordinates: [event.longitude!, event.latitude!], // GeoJSON uses [lng, lat]
          },
          properties: {
            id: event.id,
            title: event.title,
            city: event.city,
            startDate: event.startDate,
            slug: event.slug,
          },
        })),
      };

      setGeoJsonData(geoJson);
      setHasLoaded(true);
    } catch (error) {
      console.error("Error fetching events:", error);
      Alert.alert(t("common.error"), t("map.errors.loadingFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // Only fetch once on initial mount
    if (!hasLoaded) {
      fetchEvents();
    }
  }, [fetchEvents, hasLoaded]);

  const handleMarkerPress = useCallback(
    (feature: Feature) => {
      const eventSlug = feature.properties?.slug as string | undefined;
      if (eventSlug) {
        router.push(`/events/${eventSlug}`);
      }
    },
    [router]
  );

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("map.errors.loadingFailed")}</Text>
        <Text style={styles.errorSubtext}>
          EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN is not configured
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t("map.loadingMap")}</Text>
      </View>
    );
  }

  // Default camera position (Portugal)
  const defaultCamera = {
    centerCoordinate: [-8.6291, 39.6952], // Portugal center
    zoomLevel: 6,
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Outdoors}
        compassEnabled={true}
        scaleBarEnabled={false}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Mapbox.Camera {...defaultCamera} />

        {geoJsonData.features.length > 0 && (
          <>
            {/* GeoJSON Source with clustering */}
            <Mapbox.ShapeSource
              id="events-source"
              shape={geoJsonData}
              cluster={true}
              clusterRadius={50}
              clusterMaxZoomLevel={14}
              onPress={(event: MapboxOnPressEvent) => {
                if (event.features && event.features.length > 0) {
                  handleMarkerPress(event.features[0]);
                }
              }}
            >
              {/* Cluster circles */}
              <Mapbox.CircleLayer
                id="clusters"
                filter={["has", "point_count"]}
                style={{
                  circleColor: theme.colors.primary,
                  circleRadius: [
                    "step",
                    ["get", "point_count"],
                    20, // radius for count < 10
                    10,
                    25, // radius for count >= 10
                    30,
                    30, // radius for count >= 30
                  ],
                  circleOpacity: 0.8,
                  circleStrokeWidth: 2,
                  circleStrokeColor: theme.colors.white,
                }}
              />

              {/* Cluster count text */}
              <Mapbox.SymbolLayer
                id="cluster-count"
                filter={["has", "point_count"]}
                style={{
                  textField: ["get", "point_count_abbreviated"],
                  textSize: 14,
                  textColor: theme.colors.white,
                  textFont: ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                  textAllowOverlap: true,
                }}
              />

              {/* Individual event markers */}
              <Mapbox.CircleLayer
                id="event-points"
                filter={["!", ["has", "point_count"]]}
                style={{
                  circleColor: theme.colors.primary,
                  circleRadius: 8,
                  circleStrokeWidth: 2,
                  circleStrokeColor: theme.colors.white,
                }}
              />
            </Mapbox.ShapeSource>
          </>
        )}
      </Mapbox.MapView>

      {events.length === 0 && (
        <View style={styles.overlayMessage}>
          <Text style={styles.overlayText}>{t("map.errors.noEvents")}</Text>
        </View>
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
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  overlayMessage: {
    position: "absolute",
    top: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  overlayText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
