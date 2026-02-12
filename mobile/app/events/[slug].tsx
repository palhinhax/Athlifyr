import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Calendar, ExternalLink, ArrowLeft, Share2 } from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import { SportBadge } from "@/src/components/SportBadge";
import { EventMetaInfo } from "@/src/components/EventMetaInfo";
import { EventVariantsList } from "@/src/components/EventVariantsList";
import { EventLocationMap } from "@/src/components/EventLocationMap";
import { EventFAQ } from "@/src/components/EventFAQ";
import type { Event } from "@/src/types";

export default function EventDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  // const { t } = useTranslation(); // Unused for now
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Event>(`/events/${slug}`);
      setEvent(response.data);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleExternalLinkPress = () => {
    if (event?.externalUrl) {
      Linking.openURL(event.externalUrl);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  const handleShare = async () => {
    try {
      if (!event) return;

      const shareMessage = `Check out this event: ${event.title}\n${
        event.startDate
          ? `Date: ${new Date(event.startDate).toLocaleDateString()}`
          : ""
      }${event.city && event.country ? `\nLocation: ${event.city}, ${event.country}` : ""}${
        event.externalUrl ? `\n${event.externalUrl}` : ""
      }`;

      await Share.share({
        message: shareMessage,
        title: event.title,
      });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        error.message !== "User did not share"
      ) {
        Alert.alert("Error", "Failed to share event");
        console.error("Error sharing event:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Event not found"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Fixed Action Buttons */}
      <View style={styles.topActionsContainer}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Share2 size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
              <Calendar size={64} color={theme.colors.textSecondary} />
            </View>
          )}

          {/* Sport Badges Overlay */}
          <View style={styles.badgesOverlay}>
            {Array.isArray(event.sportTypes) &&
              event.sportTypes.map((sportType) => (
                <SportBadge key={sportType} sportType={sportType} size="lg" />
              ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Meta Info (Date, Location, Friends) */}
          <EventMetaInfo
            startDate={event.startDate}
            endDate={event.endDate}
            city={event.city}
            country={event.country}
          />

          {/* Variants List */}
          {event.variants && event.variants.length > 0 && (
            <EventVariantsList variants={event.variants} />
          )}

          {/* Location Map */}
          {event.latitude && event.longitude && (
            <EventLocationMap
              latitude={event.latitude}
              longitude={event.longitude}
              title={event.title}
              city={event.city}
              country={event.country}
              googleMapsUrl={event.googleMapsUrl}
            />
          )}

          {/* Description */}
          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Markdown style={markdownStyles}>{event.description}</Markdown>
            </View>
          )}

          {/* FAQ */}
          {event.faqs && event.faqs.length > 0 && (
            <EventFAQ items={event.faqs} />
          )}

          {/* External Link Button */}
          {event.externalUrl && (
            <TouchableOpacity
              style={styles.externalLinkButton}
              onPress={handleExternalLinkPress}
              activeOpacity={0.8}
            >
              <ExternalLink size={20} color={theme.colors.white} />
              <Text style={styles.externalLinkText}>
                Visit Official Website
              </Text>
            </TouchableOpacity>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: theme.spacing.xl }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: "center",
  },
  topActionsContainer: {
    position: "absolute",
    top: 50, // Increased for Android status bar and notch
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
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
  badgesOverlay: {
    position: "absolute",
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    lineHeight: 36,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  externalLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.md,
  },
  externalLinkText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },
});

// Markdown styles
const markdownStyles = {
  body: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  paragraph: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
  },
  strong: {
    fontWeight: "700",
    color: theme.colors.text,
  },
  em: {
    fontStyle: "italic",
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  bullet_list: {
    marginBottom: theme.spacing.sm,
  },
  ordered_list: {
    marginBottom: theme.spacing.sm,
  },
  list_item: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xs,
  },
  code_inline: {
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  code_block: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  fence: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  blockquote: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  hr: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: theme.spacing.md,
  },
};
