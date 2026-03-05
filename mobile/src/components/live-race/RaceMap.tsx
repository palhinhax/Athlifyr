// ============================================================================
// Athlifyr Mobile — RaceMap Component
//
// Map showing:
// - Route polyline (from event route data)
// - Athlete's current position (blue dot)
// - Other athletes (small dots)
// - Checkpoints (markers)
// - Progress along route
// ============================================================================

import React, { useRef, useEffect, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, {
  Polyline,
  Marker,
  Circle,
  PROVIDER_DEFAULT,
  type Region,
} from "react-native-maps";
import { MapPin, Flag, Navigation } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { GPSPoint, AthletePosition } from "@/src/hooks/useLiveRace";

interface Checkpoint {
  id: string;
  name: string;
  type: "START" | "FINISH" | "INTERMEDIATE" | "TRANSITION";
  latitude: number;
  longitude: number;
  order: number;
}

interface RaceMapProps {
  /** Route polyline points [lat, lng][] */
  routePoints: [number, number][];
  /** Event checkpoints */
  checkpoints: Checkpoint[];
  /** Athlete's current GPS position */
  currentPosition: GPSPoint | null;
  /** Other athletes' positions (from server broadcast) */
  otherAthletes?: AthletePosition[];
  /** Whether athlete is off-route */
  isOffRoute?: boolean;
  /** Map height (default: 300) */
  height?: number;
  /** Whether to follow the athlete's position */
  followUser?: boolean;
}

export function RaceMap({
  routePoints,
  checkpoints,
  currentPosition,
  otherAthletes = [],
  isOffRoute = false,
  height = 300,
  followUser = true,
}: RaceMapProps) {
  const mapRef = useRef<MapView>(null);

  // Convert route points for react-native-maps
  const polylineCoords = useMemo(
    () =>
      routePoints.map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      })),
    [routePoints]
  );

  // Calculate initial region to fit the route
  const initialRegion = useMemo<Region>(() => {
    if (polylineCoords.length === 0) {
      return {
        latitude: currentPosition?.lat ?? 39.5,
        longitude: currentPosition?.lng ?? -8.0,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    let minLat = Infinity,
      maxLat = -Infinity;
    let minLng = Infinity,
      maxLng = -Infinity;

    for (const coord of polylineCoords) {
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
      minLng = Math.min(minLng, coord.longitude);
      maxLng = Math.max(maxLng, coord.longitude);
    }

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.3 || 0.05,
      longitudeDelta: (maxLng - minLng) * 1.3 || 0.05,
    };
  }, [polylineCoords, currentPosition]);

  // Follow athlete's position
  useEffect(() => {
    if (followUser && currentPosition && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentPosition.lat,
          longitude: currentPosition.lng,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        },
        500
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition?.lat, currentPosition?.lng, followUser]);

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass
        showsScale
        rotateEnabled={false}
        mapType="terrain"
      >
        {/* Route polyline */}
        {polylineCoords.length > 1 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor={theme.colors.primary}
            strokeWidth={3}
            lineDashPattern={[0]}
          />
        )}

        {/* Checkpoint markers */}
        {checkpoints.map((cp) => (
          <Marker
            key={cp.id}
            coordinate={{
              latitude: cp.latitude,
              longitude: cp.longitude,
            }}
            title={cp.name}
            description={`#${cp.order} — ${cp.type}`}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={[
                styles.checkpointMarker,
                cp.type === "START" && styles.startMarker,
                cp.type === "FINISH" && styles.finishMarker,
              ]}
            >
              {cp.type === "START" ? (
                <Navigation size={12} color="#fff" />
              ) : cp.type === "FINISH" ? (
                <Flag size={12} color="#fff" />
              ) : (
                <MapPin size={10} color="#fff" />
              )}
            </View>
          </Marker>
        ))}

        {/* Other athletes (small dots) */}
        {otherAthletes.map((a) => (
          <Circle
            key={a.userId}
            center={{
              latitude: a.lat,
              longitude: a.lng,
            }}
            radius={8}
            fillColor={
              a.status === "FINISHED"
                ? theme.colors.success + "80"
                : a.status === "OFF_ROUTE"
                  ? theme.colors.warning + "80"
                  : theme.colors.muted + "80"
            }
            strokeColor={
              a.status === "FINISHED"
                ? theme.colors.success
                : theme.colors.muted
            }
            strokeWidth={1}
          />
        ))}

        {/* Athlete's own position — larger, distinctive marker */}
        {currentPosition && (
          <>
            {/* Accuracy circle */}
            {currentPosition.accuracy != null &&
              currentPosition.accuracy > 0 && (
                <Circle
                  center={{
                    latitude: currentPosition.lat,
                    longitude: currentPosition.lng,
                  }}
                  radius={currentPosition.accuracy}
                  fillColor={
                    isOffRoute
                      ? "rgba(239, 68, 68, 0.08)"
                      : "rgba(59, 130, 246, 0.08)"
                  }
                  strokeColor={
                    isOffRoute
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(59, 130, 246, 0.2)"
                  }
                  strokeWidth={1}
                />
              )}

            {/* Position dot */}
            <Marker
              coordinate={{
                latitude: currentPosition.lat,
                longitude: currentPosition.lng,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
            >
              <View
                style={[
                  styles.athleteDot,
                  isOffRoute && styles.athleteDotOffRoute,
                ]}
              >
                <View
                  style={[
                    styles.athleteDotInner,
                    isOffRoute && styles.athleteDotInnerOffRoute,
                  ]}
                />
              </View>
            </Marker>
          </>
        )}
      </MapView>

      {/* Off-route overlay */}
      {isOffRoute && (
        <View style={styles.offRouteOverlay}>
          <Text style={styles.offRouteText}>⚠️ OFF ROUTE</Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    flex: 1,
  },
  checkpointMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  startMarker: {
    backgroundColor: theme.colors.success,
  },
  finishMarker: {
    backgroundColor: theme.colors.error,
  },
  athleteDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  athleteDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3B82F6",
    borderWidth: 2,
    borderColor: "#fff",
  },
  athleteDotOffRoute: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
  },
  athleteDotInnerOffRoute: {
    backgroundColor: "#EF4444",
  },
  offRouteOverlay: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  offRouteText: {
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "700",
    fontSize: 12,
    overflow: "hidden",
  },
});
