import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { X, Calendar, MapPin, ChevronRight } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import { SportBadge } from "@/src/components/SportBadge";
import { formatDateRange } from "@/src/lib/event-utils";

interface MapEventPreviewProps {
  event: {
    id: string;
    title: string;
    slug: string;
    sportTypes: string[];
    startDate: string;
    city: string;
    imageUrl: string | null;
  };
  onClose: () => void;
}

export function MapEventPreview({ event, onClose }: MapEventPreviewProps) {
  const router = useRouter();
  const { i18n } = useTranslation();

  const handleOpenEvent = () => {
    onClose();
    router.push(`/events/${event.slug}`);
  };

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
          onPress={handleOpenEvent}
          activeOpacity={0.7}
        >
          {/* Event image */}
          {event.imageUrl ? (
            <CachedImage
              uri={event.imageUrl}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Calendar size={24} color={theme.colors.textTertiary} />
            </View>
          )}

          {/* Event info */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>

            {/* Sport badges */}
            <View style={styles.sportBadges}>
              {event.sportTypes.slice(0, 2).map((sport) => (
                <SportBadge key={sport} sportType={sport} size="sm" />
              ))}
            </View>

            {/* Date */}
            <View style={styles.metaRow}>
              <Calendar size={12} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>
                {formatDateRange(event.startDate, null, i18n.language)}
              </Text>
            </View>

            {/* City */}
            <View style={styles.metaRow}>
              <MapPin size={12} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{event.city}</Text>
            </View>
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
  sportBadges: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
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
