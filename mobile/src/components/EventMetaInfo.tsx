import { View, Text, StyleSheet } from "react-native";
import { Calendar, MapPin, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { formatDateRange } from "@/src/lib/event-utils";

interface EventMetaInfoProps {
  startDate: string | Date;
  endDate: string | Date | null;
  city: string;
  country: string;
  followingGoingCount?: number;
}

export function EventMetaInfo({
  startDate,
  endDate,
  city,
  country,
  followingGoingCount = 0,
}: EventMetaInfoProps) {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Date */}
      <View style={styles.metaRow}>
        <View style={styles.iconContainer}>
          <Calendar size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{t("events.meta.date")}</Text>
          <Text style={styles.value}>
            {formatDateRange(startDate, endDate, i18n.language)}
          </Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.metaRow}>
        <View style={styles.iconContainer}>
          <MapPin size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{t("events.meta.location")}</Text>
          <Text style={styles.value}>
            {city}, {country}
          </Text>
        </View>
      </View>

      {/* Following Going */}
      {followingGoingCount > 0 && (
        <View style={styles.metaRow}>
          <View style={styles.iconContainer}>
            <Users size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{t("events.meta.followingGoing")}</Text>
            <Text style={styles.value}>
              {t("events.meta.person", { count: followingGoingCount })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "600",
  },
});
