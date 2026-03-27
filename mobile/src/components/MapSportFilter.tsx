import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  PanResponder,
  LayoutChangeEvent,
  ActivityIndicator,
} from "react-native";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import {
  Filter,
  X,
  Check,
  LocateFixed,
  LocateOff,
  MapPin,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/src/constants/theme";
import {
  getSportIcon,
  getSportColor,
  SPORT_TYPES,
} from "@/src/lib/event-utils";

const LOC_MIN_RADIUS = 10;
const LOC_MAX_RADIUS = 500;
const LOC_THUMB_SIZE = 22;
const LOC_TRACK_HEIGHT = 6;

interface MapSportFilterProps {
  readonly selectedSports: string[];
  readonly onSportsChange: (sports: string[]) => void;
  readonly inline?: boolean;
  readonly showLocationFilter?: boolean;
  readonly locationEnabled: boolean;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly radiusKm: number;
  readonly onLocationToggle: () => void;
  readonly onRadiusChange: (radius: number) => void;
  readonly onLocationObtained: (lat: number, lng: number) => void;
}

export function MapSportFilter({
  selectedSports,
  onSportsChange,
  inline,
  showLocationFilter = true,
  locationEnabled,
  latitude,
  longitude: _longitude,
  radiusKm,
  onLocationToggle,
  onRadiusChange,
  onLocationObtained,
}: MapSportFilterProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [localSports, setLocalSports] = useState<string[]>(selectedSports);

  // Location filter state
  const [locLoading, setLocLoading] = useState(false);
  const locTrackWidthRef = useRef(0);
  const locRadiusRef = useRef(radiusKm);
  const locRadiusInitialRef = useRef(0);
  const onRadiusChangeRef = useRef(onRadiusChange);

  useEffect(() => {
    locRadiusRef.current = radiusKm;
  }, [radiusKm]);

  useEffect(() => {
    onRadiusChangeRef.current = onRadiusChange;
  }, [onRadiusChange]);

  const requestLocation = useCallback(async () => {
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      onLocationObtained(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLocLoading(false);
    }
  }, [onLocationObtained]);

  const handleLocationToggle = useCallback(() => {
    if (!locationEnabled && latitude === null) {
      requestLocation().then(() => onLocationToggle());
    } else {
      onLocationToggle();
    }
  }, [locationEnabled, latitude, requestLocation, onLocationToggle]);

  const locRadiusToPosition = (r: number) =>
    (r - LOC_MIN_RADIUS) / (LOC_MAX_RADIUS - LOC_MIN_RADIUS);
  const locPositionToRadius = (p: number) =>
    Math.round(LOC_MIN_RADIUS + p * (LOC_MAX_RADIUS - LOC_MIN_RADIUS));

  const locRadiusPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        locRadiusInitialRef.current = locRadiusRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const tw = locTrackWidthRef.current;
        if (tw <= 0) return;
        const initialPos =
          locRadiusToPosition(locRadiusInitialRef.current) * tw;
        const newPos = initialPos + gesture.dx;
        const ratio = Math.max(0, Math.min(1, newPos / tw));
        const newRadius = locPositionToRadius(ratio);
        if (newRadius !== locRadiusRef.current) {
          locRadiusRef.current = newRadius;
          onRadiusChangeRef.current(newRadius);
        }
      },
    })
  ).current;

  const onLocLayout = useCallback((e: LayoutChangeEvent) => {
    locTrackWidthRef.current = e.nativeEvent.layout.width;
  }, []);

  const locPct = useMemo(() => locRadiusToPosition(radiusKm) * 100, [radiusKm]);

  const handleOpen = () => {
    setLocalSports(selectedSports);
    setIsOpen(true);
  };

  const toggleSport = (sport: string) => {
    setLocalSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleApply = () => {
    onSportsChange(localSports);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalSports([]);
    onSportsChange([]);
    setIsOpen(false);
  };

  const activeCount =
    (selectedSports.length > 0 ? 1 : 0) +
    (showLocationFilter && locationEnabled ? 1 : 0);

  return (
    <View>
      {/* Filter button */}
      <TouchableOpacity
        style={inline ? styles.filterButtonInline : styles.filterButton}
        onPress={handleOpen}
        activeOpacity={0.8}
      >
        <Filter size={16} color={theme.colors.text} />
        <Text style={styles.filterButtonText}>
          {t("events.mapFilters.title")}
        </Text>
        {activeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[styles.modal, { paddingBottom: Math.max(bottom, 16) }]}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("events.mapFilters.title")}
              </Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Sport types */}
            <Text style={styles.sectionTitle}>
              {t("events.mapFilters.sports")}
            </Text>

            <ScrollView
              style={styles.sportsList}
              showsVerticalScrollIndicator={false}
            >
              {SPORT_TYPES.map((sport) => {
                const isSelected = localSports.includes(sport);
                const sportColor = getSportColor(sport);

                return (
                  <TouchableOpacity
                    key={sport}
                    style={[
                      styles.sportItem,
                      isSelected && {
                        backgroundColor: `${sportColor}15`,
                        borderColor: sportColor,
                      },
                    ]}
                    onPress={() => toggleSport(sport)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.sportIcon}>{getSportIcon(sport)}</Text>
                    <Text
                      style={[
                        styles.sportName,
                        isSelected && { color: sportColor, fontWeight: "600" },
                      ]}
                    >
                      {t(`sports.${sport}`, { defaultValue: sport })}
                    </Text>
                    {isSelected && (
                      <View
                        style={[
                          styles.checkCircle,
                          { backgroundColor: sportColor },
                        ]}
                      >
                        <Check size={12} color={theme.colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Location filter — only in list view */}
            {showLocationFilter && (
              <>
                <Text style={styles.sectionTitle}>
                  {t("events.locationFilter.enable")}
                </Text>
                <View style={styles.locationSection}>
                  <View style={styles.locToggleRow}>
                    <TouchableOpacity
                      style={[
                        styles.locToggleButton,
                        locationEnabled && styles.locToggleButtonActive,
                      ]}
                      onPress={handleLocationToggle}
                      activeOpacity={0.7}
                      disabled={locLoading}
                    >
                      {locLoading && (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.primary}
                        />
                      )}
                      {!locLoading && locationEnabled && (
                        <LocateFixed size={16} color={theme.colors.primary} />
                      )}
                      {!locLoading && !locationEnabled && (
                        <LocateOff
                          size={16}
                          color={theme.colors.textTertiary}
                        />
                      )}
                      <Text
                        style={[
                          styles.locToggleText,
                          locationEnabled && styles.locToggleTextActive,
                        ]}
                      >
                        {locationEnabled
                          ? t("events.locationFilter.disable")
                          : t("events.locationFilter.enable")}
                      </Text>
                    </TouchableOpacity>

                    {locationEnabled && latitude !== null && (
                      <View style={styles.locStatusBadge}>
                        <MapPin size={12} color={theme.colors.success} />
                        <Text style={styles.locStatusText}>
                          {t("events.locationFilter.active")}
                        </Text>
                      </View>
                    )}
                  </View>

                  {locationEnabled && latitude !== null && (
                    <View style={styles.locSliderSection}>
                      <View style={styles.locRadiusHeader}>
                        <Text style={styles.locRadiusLabel}>
                          {t("events.locationFilter.radius")}
                        </Text>
                        <Text style={styles.locRadiusValue}>{radiusKm} km</Text>
                      </View>

                      <View style={styles.locSliderArea} onLayout={onLocLayout}>
                        <View style={styles.locTrack} />
                        <View
                          style={[
                            styles.locActiveTrack,
                            { width: `${locPct}%` },
                          ]}
                        />
                        <View
                          style={[styles.locThumb, { left: `${locPct}%` }]}
                          {...locRadiusPan.panHandlers}
                        >
                          <View style={styles.locThumbInner} />
                        </View>
                      </View>

                      <View style={styles.locRangeLabels}>
                        <Text style={styles.locRangeText}>
                          {LOC_MIN_RADIUS} km
                        </Text>
                        <Text style={styles.locRangeText}>
                          {LOC_MAX_RADIUS} km
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>
                  {t("events.mapFilters.clearFilters")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.8}
              >
                <Text style={styles.applyButtonText}>
                  {t("events.mapFilters.applyFilters")}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  filterButtonInline: {
    position: "absolute",
    top: -14,
    left: 12,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.white,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  sportsList: {
    paddingHorizontal: theme.spacing.md,
  },
  sportItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 6,
    gap: 10,
  },
  sportIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  sportName: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.white,
  },
  locationSection: {
    paddingHorizontal: theme.spacing.md,
    gap: 8,
  },
  locToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  locToggleButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  locToggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  locToggleTextActive: {
    color: theme.colors.primary,
  },
  locStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locStatusText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: "500",
  },
  locSliderSection: {
    gap: 2,
  },
  locRadiusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locRadiusLabel: {
    fontSize: 13,
    color: theme.colors.textTertiary,
  },
  locRadiusValue: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  locSliderArea: {
    height: LOC_THUMB_SIZE + 4,
    justifyContent: "center",
    position: "relative",
  },
  locTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    height: LOC_TRACK_HEIGHT,
    borderRadius: LOC_TRACK_HEIGHT / 2,
    backgroundColor: theme.colors.border,
  },
  locActiveTrack: {
    position: "absolute",
    height: LOC_TRACK_HEIGHT,
    borderRadius: LOC_TRACK_HEIGHT / 2,
    backgroundColor: theme.colors.primary,
    top: (LOC_THUMB_SIZE + 4 - LOC_TRACK_HEIGHT) / 2,
  },
  locThumb: {
    position: "absolute",
    width: LOC_THUMB_SIZE,
    height: LOC_THUMB_SIZE,
    marginLeft: -(LOC_THUMB_SIZE / 2),
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  locThumbInner: {
    width: LOC_THUMB_SIZE,
    height: LOC_THUMB_SIZE,
    borderRadius: LOC_THUMB_SIZE / 2,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  locRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -4,
  },
  locRangeText: {
    fontSize: 10,
    color: theme.colors.textTertiary,
  },
});
