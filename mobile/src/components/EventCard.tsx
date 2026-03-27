import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar,
  MapPin,
  Route,
  CheckCircle,
  MessageCircle,
  Gift,
  Star,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import { SportBadge } from "./SportBadge";
import { formatDateRange } from "@/src/lib/event-utils";
import type { Event } from "@/src/types";

interface EventCardProps {
  event: Event;
  isParticipating?: boolean;
}

export function EventCard({ event, isParticipating = false }: EventCardProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const handlePress = () => {
    router.push(`/events/${event.slug}` as const);
  };

  const dateStr = formatDateRange(
    event.startDate,
    event.endDate,
    i18n.language
  );
  const locationStr = [event.city, event.country].filter(Boolean).join(", ");
  const cardLabel = t(
    isParticipating
      ? "events.a11y.eventCardParticipating"
      : "events.a11y.eventCard",
    { title: event.title, date: dateStr, location: locationStr }
  );

  return (
    <TouchableOpacity
      style={[styles.card, isParticipating && styles.cardParticipating]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={cardLabel}
    >
      {/* Event Image */}
      <View
        style={styles.imageContainer}
        importantForAccessibility="no-hide-descendants"
      >
        {event.imageUrl ? (
          <CachedImage
            uri={event.imageUrl}
            style={styles.image}
            contentFit="cover"
            alt={event.title}
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Calendar size={48} color={theme.colors.textSecondary} />
          </View>
        )}

        {/* Date Badge Overlay */}
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

        {/* Sport Badges */}
        <View style={styles.badgesContainer}>
          {Array.isArray(event.sportTypes) &&
            event.sportTypes.map((sportType) => (
              <SportBadge key={sportType} sportType={sportType} size="md" />
            ))}
        </View>

        {/* Participating Badge */}
        {isParticipating && (
          <View style={styles.participatingBadge}>
            <CheckCircle size={16} color={theme.colors.white} />
            <Text style={styles.participatingText}>
              {t("events.a11y.participating")}
            </Text>
          </View>
        )}

        {/* Giveaway Badge */}
        {event._count && (event._count.giveaways ?? 0) > 0 && (
          <View style={styles.giveawayBadge}>
            <Gift size={12} color={theme.colors.white} />
            <Text style={styles.giveawayBadgeText}>
              {t("events.giveaway.badge")}
            </Text>
          </View>
        )}

        {/* Featured Badge */}
        {event.isFeatured && (
          <View style={styles.featuredBadge}>
            <Star size={12} color={theme.colors.white} />
            <Text style={styles.featuredBadgeText}>{t("events.featured")}</Text>
          </View>
        )}
      </View>

      {/* Event Details */}
      <View
        style={styles.content}
        importantForAccessibility="no-hide-descendants"
      >
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.infoContainer}>
          {/* Date */}
          <View style={styles.infoRow}>
            <Calendar size={16} color={theme.colors.primary} />
            <Text style={styles.infoTextBold}>{dateStr}</Text>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <MapPin size={16} color={theme.colors.primary} />
            <Text style={styles.infoTextBold} numberOfLines={1}>
              {locationStr}
            </Text>
          </View>

          {/* Variants */}
          {event.variants &&
            event.variants.length > 0 &&
            !event.sportTypes.includes("HYROX") && (
              <View style={[styles.infoRow, styles.variantsRow]}>
                <Route
                  size={16}
                  color={theme.colors.mutedForeground}
                  style={styles.routeIcon}
                />
                <View style={styles.variantChips}>
                  {event.variants.slice(0, 3).map((variant) => (
                    <View key={variant.id} style={styles.variantChip}>
                      <Text style={styles.variantChipText}>
                        {variant.distanceKm
                          ? `${variant.distanceKm} km`
                          : variant.name}
                      </Text>
                    </View>
                  ))}
                  {event.variants.length > 3 && (
                    <View style={styles.variantChip}>
                      <Text style={styles.variantChipText}>
                        +{event.variants.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

          {/* Comments Count */}
          {event._count && event._count.comments > 0 && (
            <View style={styles.commentsRow}>
              <MessageCircle size={16} color={theme.colors.mutedForeground} />
              <Text style={styles.commentsText}>{event._count.comments}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  cardParticipating: {
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 192,
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
  badgesContainer: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 4,
  },
  participatingBadge: {
    position: "absolute",
    top: 44,
    left: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  participatingText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  giveawayBadge: {
    position: "absolute",
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  giveawayBadgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  featuredBadge: {
    position: "absolute",
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  featuredBadgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  infoContainer: {
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    flex: 1,
  },
  infoTextBold: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  variantsRow: {
    alignItems: "flex-start",
    marginTop: theme.spacing.sm,
  },
  routeIcon: {
    marginTop: 2,
  },
  variantChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    flex: 1,
  },
  variantChip: {
    backgroundColor: theme.colors.secondary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  variantChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.secondaryDark,
  },
  commentsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
    marginTop: theme.spacing.sm,
  },
  commentsText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.mutedForeground,
  },
  dateBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  dateBadgeDay: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.white,
    lineHeight: 26,
  },
  dateBadgeMonth: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.white,
    lineHeight: 12,
  },
});
