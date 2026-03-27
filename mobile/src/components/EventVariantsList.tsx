import { View, Text, StyleSheet } from "react-native";
import { Route, Clock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { formatDate } from "@/src/lib/event-utils";
import type { EventVariant } from "@/src/types";

interface EventVariantsListProps {
  variants: EventVariant[];
}

export function EventVariantsList({ variants }: EventVariantsListProps) {
  const { t, i18n } = useTranslation();

  if (!variants || variants.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Route size={20} color={theme.colors.primary} />
        <Text style={styles.title}>{t("events.distances")}</Text>
      </View>

      <View style={styles.variantsList}>
        {variants.map((variant) => (
          <View key={variant.id} style={styles.variantCard}>
            <View style={styles.variantHeader}>
              <Text style={styles.variantName}>
                {variant.distanceKm ? `${variant.distanceKm} km` : variant.name}
              </Text>
            </View>

            {/* Variant Details */}
            <View style={styles.variantDetails}>
              {variant.startDate && (
                <View style={styles.detailRow}>
                  <Clock size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {formatDate(new Date(variant.startDate), i18n.language)}
                    {variant.startTime && ` • ${variant.startTime}`}
                  </Text>
                </View>
              )}

              {/* Triathlon Segments */}
              {variant.triathlonSegments &&
                variant.triathlonSegments.length > 0 && (
                  <View style={styles.segmentsContainer}>
                    {variant.triathlonSegments.map((segment) => (
                      <View key={segment.id} style={styles.segmentChip}>
                        <Text style={styles.segmentText}>
                          {segment.segmentType}: {segment.distanceKm} km
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
            </View>
          </View>
        ))}
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
  variantsList: {
    gap: theme.spacing.sm,
  },
  variantCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  variantHeader: {
    marginBottom: theme.spacing.sm,
  },
  variantName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  variantDetails: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  segmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  segmentChip: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.primaryDark,
  },
});
