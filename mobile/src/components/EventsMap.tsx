import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";

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
  const router = useRouter();
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMapEvents = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      // Default: today to 2 months from now
      const now = new Date();
      const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      params.append("startDate", now.toISOString());
      params.append("endDate", endDate.toISOString());

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

  const handleEventPress = (slug: string) => {
    router.push(`/events/${slug}`);
  };

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
      >
        <Mapbox.Camera
          centerCoordinate={[-8.0, 39.5]}
          zoomLevel={6}
          animationMode="flyTo"
        />
        {events.map((event) => (
          <Mapbox.PointAnnotation
            key={event.id}
            id={`event-${event.id}`}
            coordinate={[event.longitude, event.latitude]}
            onSelected={() => handleEventPress(event.slug)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <MapPin size={16} color={theme.colors.white} />
              </View>
            </View>
            <Mapbox.Callout title={event.title} />
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
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
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.white,
    ...theme.shadows.md,
  },
});
