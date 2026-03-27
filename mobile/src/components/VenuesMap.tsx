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
import * as Location from "expo-location";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import {
  getServiceIcon,
  getServiceColor,
  getPrimaryService,
} from "@/src/lib/venue-utils";
import { MapVenuePreview } from "@/src/components/MapVenuePreview";
import { MapVenueServiceFilter } from "@/src/components/MapVenueServiceFilter";

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
  const { t } = useTranslation();
  const [venues, setVenues] = useState<MapVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<MapVenue | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const cameraRef = useRef<InstanceType<
    typeof import("@rnmapbox/maps").default.Camera
  > | null>(null);

  // Request user location on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLat(loc.coords.latitude);
        setUserLng(loc.coords.longitude);
      } catch (error) {
        console.error("Error getting location for venues map:", error);
      }
    })();
  }, []);

  const fetchMapVenues = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      // Default bounds: Portugal / Europe area
      params.append("north", "72");
      params.append("south", "35");
      params.append("east", "45");
      params.append("west", "-12");

      // Apply service filters
      if (selectedServices.length > 0) {
        for (const service of selectedServices) {
          params.append("services", service);
        }
      }

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
  }, [searchQuery, selectedServices]);

  useEffect(() => {
    fetchMapVenues();
  }, [fetchMapVenues]);

  const handleServicesChange = useCallback((services: string[]) => {
    setSelectedServices(services);
    setSelectedVenue(null);
  }, []);

  const handleMarkerPress = useCallback(
    (venue: MapVenue) => {
      if (selectedVenue?.id === venue.id) {
        setSelectedVenue(null);
      } else {
        setSelectedVenue(venue);
      }
    },
    [selectedVenue]
  );

  const handleClosePreview = useCallback(() => {
    setSelectedVenue(null);
  }, []);

  const handleCenterOnUser = useCallback(() => {
    if (userLat != null && userLng != null && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLng, userLat],
        zoomLevel: 8,
        animationDuration: 1000,
      });
    }
  }, [userLat, userLng]);

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
        onPress={handleClosePreview}
      >
        <Mapbox.Camera
          ref={(ref) => {
            cameraRef.current = ref;
          }}
          centerCoordinate={
            userLat != null && userLng != null
              ? [userLng, userLat]
              : [-8.0, 39.5]
          }
          zoomLevel={userLat == null ? 6 : 8}
          animationMode="flyTo"
        />
        <Mapbox.UserLocation visible animated />
        {venues
          .filter(
            (venue) => venue.latitude !== null && venue.longitude !== null
          )
          .map((venue) => {
            const primaryService = getPrimaryService(venue.services);
            const serviceColor = getServiceColor(primaryService);
            const serviceIcon = getServiceIcon(primaryService);
            const isSelected = selectedVenue?.id === venue.id;

            return (
              <Mapbox.PointAnnotation
                key={venue.id}
                id={`venue-${venue.id}`}
                coordinate={[venue.longitude!, venue.latitude!]}
                onSelected={() => handleMarkerPress(venue)}
              >
                <View style={styles.markerContainer}>
                  <View
                    style={[
                      styles.markerTeardrop,
                      {
                        backgroundColor: serviceColor,
                        borderColor: isSelected
                          ? theme.colors.text
                          : theme.colors.white,
                        borderWidth: isSelected ? 3 : 2,
                      },
                    ]}
                  >
                    <Text style={styles.markerIcon}>{serviceIcon}</Text>
                  </View>
                </View>
              </Mapbox.PointAnnotation>
            );
          })}
      </Mapbox.MapView>

      {/* Center on user button */}
      {userLat != null && userLng != null && (
        <TouchableOpacity
          style={styles.centerButton}
          onPress={handleCenterOnUser}
          activeOpacity={0.8}
        >
          <LocateFixed size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      )}

      {/* Service filters */}
      <MapVenueServiceFilter
        selectedServices={selectedServices}
        onServicesChange={handleServicesChange}
      />

      {/* Venue count badge */}
      <View style={styles.venueCountBadge}>
        <Text style={styles.venueCountText}>
          {t("venues.mapFilters.venuesCount", { count: venues.length })}
        </Text>
      </View>

      {/* Venue preview card */}
      {selectedVenue && (
        <MapVenuePreview venue={selectedVenue} onClose={handleClosePreview} />
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
  venueCountBadge: {
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
  venueCountText: {
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
