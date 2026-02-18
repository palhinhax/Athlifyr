import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
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
    "@rnmapbox/maps is not available for VenuesMap. Using fallback."
  );
}

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

if (mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

interface MapVenue {
  id: string;
  slug: string;
  name: string;
  type: string;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  services: string[];
}

interface VenuesMapProps {
  searchQuery?: string;
}

export function VenuesMap({ searchQuery }: VenuesMapProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [venues, setVenues] = useState<MapVenue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMapVenues = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      // Default bounds: Portugal / Europe area
      params.append("north", "72");
      params.append("south", "35");
      params.append("east", "45");
      params.append("west", "-12");

      const response = await api.get<{ venues: MapVenue[]; count: number }>(
        `/venues/map?${params.toString()}`
      );

      let mapVenues = response.data.venues || [];

      // Filter by search query client-side if provided
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        mapVenues = mapVenues.filter(
          (v) =>
            v.name.toLowerCase().includes(query) ||
            (v.city && v.city.toLowerCase().includes(query))
        );
      }

      setVenues(mapVenues);
    } catch (error) {
      console.error("Error fetching map venues:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchMapVenues();
  }, [fetchMapVenues]);

  const handleVenuePress = (slug: string) => {
    // Pre-fetch venue detail for instant navigation
    queryClient.prefetchQuery({
      queryKey: ["venue", slug],
      queryFn: () => api.get(`/venues/${slug}`).then((r) => r.data),
      staleTime: 2 * 60 * 1000,
    });
    router.push(`/venues/${slug}`);
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
          {venues.length} venues available
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
        {venues
          .filter(
            (venue) => venue.latitude !== null && venue.longitude !== null
          )
          .map((venue) => (
            <Mapbox.PointAnnotation
              key={venue.id}
              id={`venue-${venue.id}`}
              coordinate={[venue.longitude!, venue.latitude!]}
              onSelected={() => handleVenuePress(venue.slug)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker}>
                  <MapPin size={16} color={theme.colors.white} />
                </View>
              </View>
              <Mapbox.Callout title={venue.name} />
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
