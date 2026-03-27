import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Calendar, MapPin, Gift } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import { SportBadge } from "./SportBadge";
import { formatDateRange } from "@/src/lib/event-utils";
import type { Event } from "@/src/types";

interface EventCardGridProps {
  readonly event: Event;
}

export function EventCardGrid({ event }: EventCardGridProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const handlePress = () => {
    router.push(`/events/${event.slug}` as const);
  };

  const dateStr = formatDateRange(
    event.startDate,
    event.endDate ?? null,
    i18n.language
  );
  const locationStr = [event.city, event.country].filter(Boolean).join(", ");

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${dateStr}, ${locationStr}`}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {event.imageUrl ? (
          <CachedImage
            uri={event.imageUrl}
            style={styles.image}
            contentFit="cover"
            alt={event.title}
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Calendar size={28} color={theme.colors.textSecondary} />
          </View>
        )}

        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeDay}>
            {new Date(event.startDate).getDate()}
          </Text>
          <Text style={styles.dateBadgeMonth}>
            {new Intl.DateTimeFormat(i18n.language, { month: "short" })
              .format(new Date(event.startDate))
              .toUpperCase()}
          </Text>
        </View>

        {/* Sport Badge (only first) */}
        {Array.isArray(event.sportTypes) && event.sportTypes.length > 0 && (
          <View style={styles.sportBadgeContainer}>
            <SportBadge sportType={event.sportTypes[0]} size="sm" />
          </View>
        )}

        {/* Giveaway Badge */}
        {event._count && (event._count.giveaways ?? 0) > 0 && (
          <View style={styles.giveawayBadge}>
            <Gift size={10} color={theme.colors.white} />
            <Text style={styles.giveawayBadgeText}>
              {t("events.giveaway.badge")}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.infoRow}>
          <MapPin size={12} color={theme.colors.primary} />
          <Text style={styles.infoText} numberOfLines={1}>
            {event.city}
          </Text>
        </View>

        {/* Variant chips (up to 2) */}
        {event.variants && event.variants.length > 0 && (
          <View style={styles.variantChips}>
            {event.variants.slice(0, 2).map((variant) => (
              <View key={variant.id} style={styles.variantChip}>
                <Text style={styles.variantChipText}>
                  {variant.distanceKm
                    ? `${variant.distanceKm}km`
                    : variant.name}
                </Text>
              </View>
            ))}
            {event.variants.length > 2 && (
              <Text style={styles.moreVariants}>
                +{event.variants.length - 2}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 110,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  dateBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  dateBadgeDay: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.white,
    lineHeight: 18,
  },
  dateBadgeMonth: {
    fontSize: 8,
    fontWeight: "600",
    color: theme.colors.white,
    lineHeight: 10,
  },
  sportBadgeContainer: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  giveawayBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
  },
  giveawayBadgeText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: "700",
  },
  content: {
    padding: 8,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
    lineHeight: 17,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.mutedForeground,
    flex: 1,
  },
  variantChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 2,
  },
  variantChip: {
    backgroundColor: theme.colors.secondary + "20",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  variantChipText: {
    fontSize: 10,
    fontWeight: "500",
    color: theme.colors.secondaryDark,
  },
  moreVariants: {
    fontSize: 10,
    fontWeight: "500",
    color: theme.colors.mutedForeground,
    alignSelf: "center",
  },
});
