import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  LayoutChangeEvent,
  ActivityIndicator,
} from "react-native";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import { MapPin, LocateFixed, LocateOff } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

const MIN_RADIUS = 10;
const MAX_RADIUS = 500;
const THUMB_SIZE = 22;
const TRACK_HEIGHT = 6;

interface LocationFilterProps {
  readonly enabled: boolean;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly radiusKm: number;
  readonly onToggle: () => void;
  readonly onRadiusChange: (radius: number) => void;
  readonly onLocationObtained: (lat: number, lng: number) => void;
}

export function LocationFilter({
  enabled,
  latitude,
  longitude: _longitude,
  radiusKm,
  onToggle,
  onRadiusChange,
  onLocationObtained,
}: LocationFilterProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const trackWidthRef = useRef(0);
  const radiusRef = useRef(radiusKm);
  const onRadiusChangeRef = useRef(onRadiusChange);

  useEffect(() => {
    radiusRef.current = radiusKm;
  }, [radiusKm]);

  useEffect(() => {
    onRadiusChangeRef.current = onRadiusChange;
  }, [onRadiusChange]);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      onLocationObtained(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLoading(false);
    }
  }, [onLocationObtained]);

  const handleToggle = useCallback(() => {
    if (!enabled && latitude === null) {
      // First time enabling — get location then enable
      requestLocation().then(() => onToggle());
    } else {
      onToggle();
    }
  }, [enabled, latitude, requestLocation, onToggle]);

  const radiusToPosition = (r: number) =>
    (r - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS);
  const positionToRadius = (p: number) =>
    Math.round(MIN_RADIUS + p * (MAX_RADIUS - MIN_RADIUS));

  const radiusPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const tw = trackWidthRef.current;
        if (tw <= 0) return;
        const currentPos =
          radiusToPosition(radiusRef.current) * tw + gesture.dx;
        const ratio = Math.max(0, Math.min(1, currentPos / tw));
        const newRadius = positionToRadius(ratio);
        if (newRadius !== radiusRef.current) {
          radiusRef.current = newRadius;
          onRadiusChangeRef.current(newRadius);
        }
      },
    })
  ).current;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidthRef.current = e.nativeEvent.layout.width;
  }, []);

  const pct = useMemo(() => radiusToPosition(radiusKm) * 100, [radiusKm]);

  const locationIcon = enabled ? (
    <LocateFixed size={14} color={theme.colors.primary} />
  ) : (
    <LocateOff size={14} color={theme.colors.textTertiary} />
  );

  return (
    <View style={styles.container}>
      {/* Toggle row */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, enabled && styles.toggleButtonActive]}
          onPress={handleToggle}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            locationIcon
          )}
          <Text style={[styles.toggleText, enabled && styles.toggleTextActive]}>
            {enabled
              ? t("events.locationFilter.disable")
              : t("events.locationFilter.enable")}
          </Text>
        </TouchableOpacity>

        {enabled && latitude !== null && (
          <View style={styles.statusBadge}>
            <MapPin size={10} color={theme.colors.success} />
            <Text style={styles.statusText}>
              {t("events.locationFilter.active")}
            </Text>
          </View>
        )}
      </View>

      {/* Radius slider — only when enabled */}
      {enabled && latitude !== null && (
        <View style={styles.sliderSection}>
          <View style={styles.radiusHeader}>
            <Text style={styles.radiusLabel}>
              {t("events.locationFilter.radius")}
            </Text>
            <Text style={styles.radiusValue}>{radiusKm} km</Text>
          </View>

          <View style={styles.sliderArea} onLayout={onLayout}>
            <View style={styles.track} />
            <View style={[styles.activeTrack, { width: `${pct}%` }]} />
            <View
              style={[styles.thumb, { left: `${pct}%` }]}
              {...radiusPan.panHandlers}
            >
              <View style={styles.thumbInner} />
            </View>
          </View>

          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>{MIN_RADIUS} km</Text>
            <Text style={styles.rangeText}>{MAX_RADIUS} km</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: 6,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  toggleButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: theme.colors.primary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statusText: {
    fontSize: 10,
    color: theme.colors.success,
    fontWeight: "500",
  },
  sliderSection: {
    gap: 2,
  },
  radiusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radiusLabel: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  radiusValue: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text,
  },
  sliderArea: {
    height: THUMB_SIZE + 4,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: theme.colors.border,
  },
  activeTrack: {
    position: "absolute",
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: theme.colors.primary,
    top: (THUMB_SIZE + 4 - TRACK_HEIGHT) / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -(THUMB_SIZE / 2),
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  thumbInner: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -4,
  },
  rangeText: {
    fontSize: 9,
    color: theme.colors.textTertiary,
  },
});
