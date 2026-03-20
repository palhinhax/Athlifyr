import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { X, MapPin, ChevronRight, Building2 } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import { api } from "@/src/lib/api";
import { getServiceIcon } from "@/src/lib/venue-utils";

interface MapVenuePreviewProps {
  venue: {
    id: string;
    slug: string;
    name: string;
    type: string;
    city: string | null;
    services: string[];
    imageUrl?: string | null;
    coverImage?: string | null;
  };
  onClose: () => void;
}

export function MapVenuePreview({ venue, onClose }: MapVenuePreviewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleOpenVenue = () => {
    onClose();
    queryClient.prefetchQuery({
      queryKey: ["venue", venue.slug],
      queryFn: () => api.get(`/venues/${venue.slug}`).then((r) => r.data),
      staleTime: 2 * 60 * 1000,
    });
    router.push(`/venues/${venue.slug}`);
  };

  const image = venue.coverImage || venue.imageUrl;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.content}
          onPress={handleOpenVenue}
          activeOpacity={0.7}
        >
          {/* Venue image */}
          {image ? (
            <CachedImage uri={image} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Building2 size={24} color={theme.colors.textTertiary} />
            </View>
          )}

          {/* Venue info */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {venue.name}
            </Text>

            {/* Services */}
            {venue.services.length > 0 && (
              <View style={styles.servicesRow}>
                {venue.services.slice(0, 3).map((service) => (
                  <View key={service} style={styles.serviceBadge}>
                    <Text style={styles.serviceIcon}>
                      {getServiceIcon(service)}
                    </Text>
                    <Text style={styles.serviceText} numberOfLines={1}>
                      {t(`venueDetail.serviceTypes.${service}`, {
                        defaultValue: service,
                      })}
                    </Text>
                  </View>
                ))}
                {venue.services.length > 3 && (
                  <Text style={styles.moreServices}>
                    +{venue.services.length - 3}
                  </Text>
                )}
              </View>
            )}

            {/* City */}
            {venue.city && (
              <View style={styles.metaRow}>
                <MapPin size={12} color={theme.colors.textSecondary} />
                <Text style={styles.metaText}>{venue.city}</Text>
              </View>
            )}
          </View>

          {/* Chevron */}
          <View style={styles.chevronContainer}>
            <ChevronRight size={20} color={theme.colors.textTertiary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 12,
    right: 12,
    zIndex: 1000,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.lg,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.xs,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    lineHeight: 20,
    paddingRight: theme.spacing.lg,
  },
  servicesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    alignItems: "center",
  },
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  serviceIcon: {
    fontSize: 10,
    lineHeight: 14,
  },
  serviceText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    maxWidth: 60,
  },
  moreServices: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  chevronContainer: {
    paddingLeft: theme.spacing.xs,
  },
});
