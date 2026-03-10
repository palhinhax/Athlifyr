// ============================================================================
// Athlifyr Mobile — RaceMap Component (Mapbox)
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
import { MapPin, Flag, Navigation } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { GPSPoint, AthletePosition } from "@/src/hooks/useLiveRace";

// Dynamic Mapbox import (requires native code, not available in Expo Go)
let Mapbox: typeof import("@rnmapbox/maps").default | null = null;
let mapboxAvailable = false;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Mapbox = require("@rnmapbox/maps").default;
  mapboxAvailable = true;
} catch {
  console.warn("@rnmapbox/maps is not available for RaceMap. Using fallback.");
}

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
if (mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

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
}: Readonly<RaceMapProps>) {
  const cameraRef = useRef<InstanceType<
    typeof import("@rnmapbox/maps").default.Camera
  > | null>(null);

  // GeoJSON LineString for the route polyline
  const routeGeoJSON = useMemo(() => {
    if (routePoints.length < 2) return null;
    return {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: routePoints.map(([lat, lng]) => [lng, lat]),
      },
    };
  }, [routePoints]);

  // Calculate map center & bounds
  const centerCoord = useMemo<[number, number]>(() => {
    if (currentPosition) return [currentPosition.lng, currentPosition.lat];
    if (routePoints.length > 0) {
      const mid = routePoints[Math.floor(routePoints.length / 2)];
      return [mid[1], mid[0]];
    }
    return [-8, 39.5]; // Default: Portugal
  }, [currentPosition, routePoints]);

  // Follow athlete's position
  useEffect(() => {
    if (followUser && currentPosition && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [currentPosition.lng, currentPosition.lat],
        zoomLevel: 16,
        animationDuration: 500,
      });
    }
  }, [currentPosition?.lat, currentPosition?.lng, followUser]);

  const canShowMap = mapboxAvailable && Mapbox && MAPBOX_ACCESS_TOKEN;

  if (!canShowMap || !Mapbox) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.fallback}>
          <MapPin size={48} color={theme.colors.primary} />
          <Text style={styles.fallbackText}>Map unavailable</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Outdoors}
        compassEnabled
        scaleBarEnabled
        rotateEnabled={false}
        attributionEnabled={false}
        logoEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={centerCoord}
          zoomLevel={followUser && currentPosition ? 16 : 13}
          animationMode="flyTo"
          animationDuration={500}
        />

        {/* Route polyline */}
        {routeGeoJSON && (
          <Mapbox.ShapeSource id="route-line" shape={routeGeoJSON}>
            <Mapbox.LineLayer
              id="route-line-layer"
              style={{
                lineColor: theme.colors.primary,
                lineWidth: 3,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* Checkpoint markers */}
        {checkpoints.map((cp) => (
          <Mapbox.PointAnnotation
            key={cp.id}
            id={`checkpoint-${cp.id}`}
            coordinate={[cp.longitude, cp.latitude]}
          >
            <View
              style={[
                styles.checkpointMarker,
                cp.type === "START" && styles.startMarker,
                cp.type === "FINISH" && styles.finishMarker,
              ]}
            >
              {cp.type === "START" && <Navigation size={12} color="#fff" />}
              {cp.type === "FINISH" && <Flag size={12} color="#fff" />}
              {cp.type !== "START" && cp.type !== "FINISH" && (
                <MapPin size={10} color="#fff" />
              )}
            </View>
          </Mapbox.PointAnnotation>
        ))}

        {/* Other athletes (small dots) */}
        {otherAthletes.map((a) => (
          <Mapbox.PointAnnotation
            key={a.userId}
            id={`athlete-${a.userId}`}
            coordinate={[a.lng, a.lat]}
          >
            <View
              style={[
                styles.otherAthleteDot,
                a.status === "FINISHED" && styles.otherAthleteFinished,
                a.status === "OFF_ROUTE" && styles.otherAthleteOffRoute,
              ]}
            />
          </Mapbox.PointAnnotation>
        ))}

        {/* Athlete's own position — larger, distinctive marker */}
        {currentPosition && (
          <Mapbox.PointAnnotation
            id="athlete-position"
            coordinate={[currentPosition.lng, currentPosition.lat]}
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
          </Mapbox.PointAnnotation>
        )}
      </Mapbox.MapView>

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
  fallback: {
    flex: 1,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    marginTop: 8,
    color: theme.colors.textSecondary,
    fontSize: 14,
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
  otherAthleteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.muted,
    borderWidth: 1,
    borderColor: "#fff",
  },
  otherAthleteFinished: {
    backgroundColor: theme.colors.success,
  },
  otherAthleteOffRoute: {
    backgroundColor: theme.colors.warning,
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
