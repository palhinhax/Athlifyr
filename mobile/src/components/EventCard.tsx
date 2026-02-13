import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar,
  MapPin,
  Route,
  CheckCircle,
  MessageCircle,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { SportBadge } from "./SportBadge";
import { formatDateRange } from "@/src/lib/event-utils";
import type { Event } from "@/src/types";

interface EventCardProps {
  event: Event;
  isParticipating?: boolean;
}

export function EventCard({ event, isParticipating = false }: EventCardProps) {
  const router = useRouter();
  const { i18n } = useTranslation();

  const handlePress = () => {
    router.push(`/events/${event.slug}` as const);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isParticipating && styles.cardParticipating]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Event Image */}
      <View style={styles.imageContainer}>
        {event.imageUrl ? (
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            alt="Event image"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Calendar size={48} color={theme.colors.textSecondary} />
          </View>
        )}

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
            <Text style={styles.participatingText}>Vou</Text>
          </View>
        )}
      </View>

      {/* Event Details */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.infoContainer}>
          {/* Date */}
          <View style={styles.infoRow}>
            <Calendar size={16} color={theme.colors.mutedForeground} />
            <Text style={styles.infoText}>
              {formatDateRange(event.startDate, event.endDate, i18n.language)}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <MapPin size={16} color={theme.colors.mutedForeground} />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.city}, {event.country}
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
    top: theme.spacing.sm,
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
});
