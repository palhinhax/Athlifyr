import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, X, Check } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  getSportIcon,
  getSportColor,
  SPORT_TYPES,
} from "@/src/lib/event-utils";

interface MapSportFilterProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
}

export function MapSportFilter({
  selectedSports,
  onSportsChange,
}: MapSportFilterProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [localSports, setLocalSports] = useState<string[]>(selectedSports);

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

  const activeCount = selectedSports.length;

  return (
    <>
      {/* Filter button */}
      <TouchableOpacity
        style={styles.filterButton}
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
          <Pressable style={styles.modal} onPress={() => {}}>
            {/* Header */}
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
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    position: "absolute",
    top: 12,
    right: 12,
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
    paddingBottom: 34,
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
});
