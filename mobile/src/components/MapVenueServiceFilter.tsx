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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter, X, Check } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  getServiceIcon,
  getServiceColor,
  VENUE_SERVICES,
} from "@/src/lib/venue-utils";

interface MapVenueServiceFilterProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
}

export function MapVenueServiceFilter({
  selectedServices,
  onServicesChange,
}: MapVenueServiceFilterProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [localServices, setLocalServices] =
    useState<string[]>(selectedServices);

  const handleOpen = () => {
    setLocalServices(selectedServices);
    setIsOpen(true);
  };

  const toggleService = (service: string) => {
    setLocalServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleApply = () => {
    onServicesChange(localServices);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalServices([]);
    onServicesChange([]);
    setIsOpen(false);
  };

  const activeCount = selectedServices.length;

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
          {t("venues.mapFilters.title")}
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
            style={[styles.modal, { paddingBottom: Math.max(bottom, 16) + 16 }]}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("venues.mapFilters.title")}
              </Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Service types */}
            <Text style={styles.sectionTitle}>
              {t("venues.mapFilters.services")}
            </Text>

            <ScrollView
              style={styles.servicesList}
              showsVerticalScrollIndicator={false}
            >
              {VENUE_SERVICES.map((service) => {
                const isSelected = localServices.includes(service);
                const serviceColor = getServiceColor(service);

                return (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.serviceItem,
                      isSelected && {
                        backgroundColor: `${serviceColor}15`,
                        borderColor: serviceColor,
                      },
                    ]}
                    onPress={() => toggleService(service)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.serviceIcon}>
                      {getServiceIcon(service)}
                    </Text>
                    <Text
                      style={[
                        styles.serviceName,
                        isSelected && {
                          color: serviceColor,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {t(`venueDetail.serviceTypes.${service}`, {
                        defaultValue: service,
                      })}
                    </Text>
                    {isSelected && (
                      <View
                        style={[
                          styles.checkCircle,
                          { backgroundColor: serviceColor },
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
                  {t("venues.mapFilters.clearFilters")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.8}
              >
                <Text style={styles.applyButtonText}>
                  {t("venues.mapFilters.applyFilters")}
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
  servicesList: {
    paddingHorizontal: theme.spacing.md,
  },
  serviceItem: {
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
  serviceIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  serviceName: {
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
    fontWeight: "600",
    color: theme.colors.white,
  },
});
