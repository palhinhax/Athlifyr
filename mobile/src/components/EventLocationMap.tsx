import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { MapPin, Navigation } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

// Try to import Mapbox - it requires native code and won't work in Expo Go
let Mapbox: typeof import("@rnmapbox/maps").default | null = null;
let mapboxAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Mapbox = require("@rnmapbox/maps").default;
  mapboxAvailable = true;
} catch {
  console.warn(
    "@rnmapbox/maps is not available for EventLocationMap. Using fallback."
  );
}

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

if (mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

interface EventLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  city: string;
  country: string;
  googleMapsUrl?: string | null;
}

export function EventLocationMap({
  latitude,
  longitude,
  // title, // Unused for now
  city,
  country,
  googleMapsUrl,
}: EventLocationMapProps) {
  const handleOpenMaps = () => {
    const url =
      googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const canShowMap = mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin size={20} color={theme.colors.primary} />
        <Text style={styles.title}>Location</Text>
      </View>

      <View style={styles.mapCard}>
        {canShowMap && Mapbox ? (
          <View style={styles.mapContainer}>
            <Mapbox.MapView
              style={styles.map}
              styleURL={Mapbox.StyleURL.Outdoors}
              compassEnabled={false}
              scaleBarEnabled={false}
              zoomEnabled={false}
              scrollEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              attributionEnabled={false}
              logoEnabled={false}
            >
              <Mapbox.Camera
                centerCoordinate={[longitude, latitude]}
                zoomLevel={13}
                animationMode="none"
              />
              <Mapbox.PointAnnotation
                id="event-location"
                coordinate={[longitude, latitude]}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.marker}>
                    <MapPin size={20} color={theme.colors.white} />
                  </View>
                </View>
              </Mapbox.PointAnnotation>
            </Mapbox.MapView>
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color={theme.colors.primary} />
            <Text style={styles.locationText}>
              {city}, {country}
            </Text>
            <Text style={styles.coordsText}>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.openMapsButton}
          onPress={handleOpenMaps}
          activeOpacity={0.8}
        >
          <Navigation size={20} color={theme.colors.white} />
          <Text style={styles.openMapsText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  mapCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  mapContainer: {
    height: 200,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.white,
    ...theme.shadows.md,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  coordsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  openMapsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
  },
  openMapsText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
