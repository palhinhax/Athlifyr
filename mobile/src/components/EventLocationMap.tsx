import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { MapPin, Navigation } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

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

  // Static map image URL (using Google Maps Static API or Mapbox)
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+0ea5e9(${longitude},${latitude})/${longitude},${latitude},14,0/600x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin size={20} color={theme.colors.primary} />
        <Text style={styles.title}>Location</Text>
      </View>

      <View style={styles.mapCard}>
        {/* Placeholder for map - you can add react-native-maps here */}
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color={theme.colors.primary} />
          <Text style={styles.locationText}>
            {city}, {country}
          </Text>
          <Text style={styles.coordsText}>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>

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
