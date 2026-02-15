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
import {
  MapPin,
  ExternalLink,
  ArrowLeft,
  Share2,
  Users,
  Building2,
  Instagram,
} from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { useTranslation } from "react-i18next";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import { EventLocationMap } from "@/src/components/EventLocationMap";
import type { Venue } from "@/src/types";

interface VenueDetail extends Venue {
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
}

export default function VenueDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<VenueDetail>(`/venues/${slug}`);
      setVenue(response.data);
    } catch (err) {
      console.error("Error fetching venue:", err);
      setError("Failed to load venue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchVenue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)/venues");
    }
  };

  const handleShare = async () => {
    try {
      if (!venue) return;

      const shareMessage = `Check out this venue: ${venue.name}${
        venue.city && venue.country
          ? `\nLocation: ${venue.city}, ${venue.country}`
          : ""
      }${venue.website ? `\n${venue.website}` : ""}`;

      await Share.share({
        message: shareMessage,
        title: venue.name,
      });
    } catch (shareError) {
      if (
        shareError &&
        typeof shareError === "object" &&
        "message" in shareError &&
        shareError.message !== "User did not share"
      ) {
        Alert.alert("Error", "Failed to share venue");
        console.error("Error sharing venue:", shareError);
      }
    }
  };

  const handleInstagramPress = () => {
    if (venue?.instagram) {
      const username = venue.instagram.replace(/^@/, "");
      Linking.openURL(`https://instagram.com/${username}`);
    }
  };

  const handleWebsitePress = () => {
    if (venue?.website) {
      Linking.openURL(venue.website);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </>
    );
  }

  if (error || !venue) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || t("common.error")}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVenue}>
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} bounces={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {venue.coverImage ? (
            <Image
              source={{ uri: venue.coverImage }}
              style={styles.heroImage}
              resizeMode="cover"
              alt="Venue cover"
            />
          ) : (
            <View style={[styles.heroImage, styles.placeholderImage]}>
              <Building2 size={64} color={theme.colors.textSecondary} />
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleBackPress}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleShare}>
              <Share2 size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Type Badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {venue.type.replace(/_/g, " ")}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Logo + Name */}
          <View style={styles.headerRow}>
            {venue.logo && (
              <Image
                source={{ uri: venue.logo }}
                style={styles.logoImage}
                resizeMode="cover"
                alt="Venue logo"
              />
            )}
            <View style={styles.headerText}>
              <Text style={styles.name}>{venue.name}</Text>
              {venue.city && (
                <View style={styles.locationRow}>
                  <MapPin size={16} color={theme.colors.mutedForeground} />
                  <Text style={styles.locationText}>
                    {venue.city}, {venue.country}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats Row */}
          {venue._count && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Users size={18} color={theme.colors.primary} />
                <Text style={styles.statValue}>{venue._count.members}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.statItem}>
                <Building2 size={18} color={theme.colors.primary} />
                <Text style={styles.statValue}>{venue._count.sessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsRow}>
            {venue.instagram && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleInstagramPress}
              >
                <Instagram size={20} color={theme.colors.white} />
                <Text style={styles.actionButtonText}>Instagram</Text>
              </TouchableOpacity>
            )}
            {venue.website && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={handleWebsitePress}
              >
                <ExternalLink size={20} color={theme.colors.primary} />
                <Text style={styles.actionButtonSecondaryText}>Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Services */}
          {venue.services && venue.services.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services</Text>
              <View style={styles.serviceChips}>
                {venue.services.map((service) => (
                  <View key={service} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>
                      {service.replace(/_/g, " ")}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {venue.description && (
            <View style={styles.section}>
              <Markdown
                style={{
                  body: {
                    color: theme.colors.text,
                    fontSize: 16,
                    lineHeight: 24,
                  },
                  heading1: {
                    fontSize: 22,
                    fontWeight: "700",
                    color: theme.colors.text,
                    marginTop: 16,
                    marginBottom: 8,
                  },
                  heading2: {
                    fontSize: 20,
                    fontWeight: "700",
                    color: theme.colors.text,
                    marginTop: 12,
                    marginBottom: 6,
                  },
                  heading3: {
                    fontSize: 18,
                    fontWeight: "600",
                    color: theme.colors.text,
                    marginTop: 10,
                    marginBottom: 4,
                  },
                  strong: { fontWeight: "700" },
                  link: { color: theme.colors.primary },
                }}
              >
                {venue.description}
              </Markdown>
            </View>
          )}

          {/* Location Map */}
          {venue.latitude && venue.longitude && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              {venue.address && (
                <Text style={styles.address}>{venue.address}</Text>
              )}
              <EventLocationMap
                latitude={venue.latitude}
                longitude={venue.longitude}
                title={venue.name}
                city={venue.city || ""}
                country={venue.country}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 260,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtons: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white + "E6",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  typeBadge: {
    position: "absolute",
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
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
    paddingBottom: theme.spacing.xl * 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  logoImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.lg,
    justifyContent: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  actionsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.lg,
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  actionButtonSecondary: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  actionButtonSecondaryText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  address: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
  },
  serviceChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceChip: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  serviceChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.primaryDark,
    textTransform: "capitalize",
  },
});
