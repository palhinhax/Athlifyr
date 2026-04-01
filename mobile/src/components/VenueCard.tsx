import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Users, Building2 } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import { api } from "@/src/lib/api";
import type { Venue } from "@/src/types";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handlePress = () => {
    // Pre-fetch venue detail and sessions in parallel for instant navigation
    queryClient.prefetchQuery({
      queryKey: ["venue", venue.slug],
      queryFn: () => api.get(`/venues/${venue.slug}`).then((r) => r.data),
      staleTime: 2 * 60 * 1000,
    });

    const now = new Date();
    const monthKey = format(now, "yyyy-MM");
    const from = startOfMonth(now).toISOString();
    const to = endOfMonth(now).toISOString();

    queryClient.prefetchQuery({
      queryKey: ["venueSessions", venue.id, monthKey],
      queryFn: () =>
        api
          .get(`/venues/${venue.id}/sessions`, { params: { from, to } })
          .then((r) => {
            const raw = r.data;
            if (Array.isArray(raw)) return raw;
            if (raw && typeof raw === "object" && Array.isArray(raw.sessions))
              return raw.sessions;
            return [];
          }),
      staleTime: 2 * 60 * 1000,
    });

    router.push(`/venues/${venue.slug}` as const);
  };

  const locationStr = [venue.city, venue.country].filter(Boolean).join(", ");
  const cardLabel = t("venues.a11y.venueCard", {
    name: venue.name,
    location: locationStr,
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={cardLabel}
    >
      {/* Venue Image */}
      <View
        style={styles.imageContainer}
        importantForAccessibility="no-hide-descendants"
      >
        {venue.coverImage ? (
          <CachedImage
            uri={venue.coverImage}
            style={styles.image}
            contentFit="cover"
            alt="Venue image"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Building2 size={48} color={theme.colors.textSecondary} />
          </View>
        )}

        {/* Logo overlay */}
        {venue.logo && (
          <View style={styles.logoContainer}>
            <CachedImage
              uri={venue.logo}
              style={styles.logo}
              contentFit="cover"
              alt="Venue logo"
            />
          </View>
        )}

        {/* Venue Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {venue.type.replace(/_/g, " ")}
          </Text>
        </View>
      </View>

      {/* Venue Details */}
      <View
        style={styles.content}
        importantForAccessibility="no-hide-descendants"
      >
        {/* Name */}
        <Text style={styles.name} numberOfLines={2}>
          {venue.name}
        </Text>

        <View style={styles.infoContainer}>
          {/* Location */}
          {venue.city && (
            <View style={styles.infoRow}>
              <MapPin size={16} color={theme.colors.primary} />
              <Text style={styles.infoTextBold} numberOfLines={1}>
                {locationStr}
              </Text>
            </View>
          )}

          {/* Members Count */}
          {venue._count && venue._count.members > 0 && (
            <View style={styles.infoRow}>
              <Users size={16} color={theme.colors.primary} />
              <Text style={styles.infoTextBold}>
                {venue._count.members}{" "}
                {venue._count.members === 1
                  ? t("venues.member")
                  : t("venues.members")}
              </Text>
            </View>
          )}

          {/* Services */}
          {venue.services && venue.services.length > 0 && (
            <View style={styles.servicesRow}>
              <View style={styles.serviceChips}>
                {venue.services.slice(0, 3).map((service) => (
                  <View key={service} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>
                      {service.replace(/_/g, " ")}
                    </Text>
                  </View>
                ))}
                {venue.services.length > 3 && (
                  <View style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>
                      +{venue.services.length - 3}
                    </Text>
                  </View>
                )}
              </View>
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
  logoContainer: {
    position: "absolute",
    bottom: -20,
    left: theme.spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.white,
    ...theme.shadows.md,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  typeBadge: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  typeBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  content: {
    padding: theme.spacing.md,
  },
  name: {
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
  servicesRow: {
    marginTop: theme.spacing.sm,
  },
  serviceChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  serviceChip: {
    backgroundColor: theme.colors.secondary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  serviceChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.secondaryDark,
    textTransform: "capitalize",
  },
});
