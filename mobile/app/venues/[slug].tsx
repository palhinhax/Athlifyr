import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useFocusEffect,
} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, ArrowLeft, Share2, Building2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import { useVenueDetail } from "@/src/hooks/useVenueDetail";
import { useAuthStore } from "@/src/lib/auth-store";
import { VenueAboutTab } from "@/src/components/venue/VenueAboutTab";
import { VenueTeamTab } from "@/src/components/venue/VenueTeamTab";
import { VenuePlansTab } from "@/src/components/venue/VenuePlansTab";
import { VenueSessionsTab } from "@/src/components/venue/VenueSessionsTab";
import { VenueFeedTab } from "@/src/components/venue/VenueFeedTab";

const PUBLIC_TABS = ["feed", "about", "plans", "sessions", "team"] as const;
type TabId = (typeof PUBLIC_TABS)[number];

export default function VenueDetailScreen() {
  const { slug, tab } = useLocalSearchParams<{ slug: string; tab?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { venue, isLoading, error, refetch } = useVenueDetail(slug ?? "");

  // ── Auth & role computation ──
  const userId = useAuthStore((s) => s.user?.id) ?? null;
  const userRole = useAuthStore((s) => s.user?.role) ?? null;

  // Invalidate venue sessions cache when screen gains focus
  // This ensures bookings cancelled on the website are reflected immediately
  // Use background refetch so cached data is shown instantly
  useFocusEffect(
    useCallback(() => {
      if (venue?.id) {
        queryClient.invalidateQueries({
          queryKey: ["venueSessions", venue.id],
        });
      }
      // Background refetch — don't block the UI, cached data is already displayed
      refetch();
    }, [venue?.id, queryClient, refetch])
  );

  const isOwnerOrAdmin = useMemo(() => {
    if (!userId || !venue) return false;
    if (userRole === "ADMIN") return true;
    return venue.members.some(
      (m) => m.user.id === userId && (m.role === "OWNER" || m.role === "ADMIN")
    );
  }, [userId, userRole, venue]);

  const canEditSessions = useMemo(() => {
    if (!userId || !venue) return false;
    if (userRole === "ADMIN") return true;
    return venue.members.some(
      (m) =>
        m.user.id === userId &&
        (m.role === "OWNER" || m.role === "ADMIN" || m.role === "COACH")
    );
  }, [userId, userRole, venue]);

  // Use centralized API validation for subscription status
  // This eliminates duplicated logic and ensures consistency between web and mobile
  const hasActiveSubscription = useMemo(() => {
    if (!venue) return false;

    // Use the centralized userSubscriptionStatus from the API
    return venue.userSubscriptionStatus?.hasSubscription ?? false;
  }, [venue]);

  // Determine which tabs are visible based on venue.visibleTabs config
  const visibleTabs = useMemo<TabId[]>(() => {
    if (!venue) return [...PUBLIC_TABS];
    const configured = venue.visibleTabs ?? [...PUBLIC_TABS];
    return PUBLIC_TABS.filter((tab) => configured.includes(tab));
  }, [venue]);

  // Use tab query param as initial tab (e.g. from My Venues shortcut → sessions)
  const initialTab = PUBLIC_TABS.includes(tab as TabId)
    ? (tab as TabId)
    : "feed";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // Ensure the active tab is always a visible one
  const currentTab = visibleTabs.includes(activeTab)
    ? activeTab
    : (visibleTabs[0] ?? "about");

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
        console.error("Error sharing venue:", shareError);
      }
    }
  };

  if (isLoading && !venue) {
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
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : t("common.error")}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case "feed":
        return <VenueFeedTab venueId={venue.id} />;
      case "about":
        return <VenueAboutTab venue={venue} />;
      case "plans":
        return <VenuePlansTab plans={venue.plans} />;
      case "sessions":
        return (
          <VenueSessionsTab
            venueId={venue.id}
            userId={userId}
            isOwnerOrAdmin={isOwnerOrAdmin}
            canEditSessions={canEditSessions}
            hasActiveSubscription={hasActiveSubscription}
          />
        );
      case "team":
        return <VenueTeamTab members={venue.members} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Status Bar Overlay */}
      <View style={[styles.statusBarOverlay, { height: insets.top }]} />

      {/* Bottom Navigation Bar Overlay */}
      <View style={[styles.bottomBarOverlay, { height: insets.bottom }]} />

      <ScrollView
        style={styles.container}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {venue.coverImage ? (
            <CachedImage
              uri={venue.coverImage}
              style={styles.heroImage}
              contentFit="cover"
              alt="Venue cover"
              priority="high"
            />
          ) : (
            <View style={[styles.heroImage, styles.placeholderImage]}>
              <Building2 size={64} color={theme.colors.textSecondary} />
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={[styles.navButtons, { top: insets.top + 8 }]}>
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

        {/* Header: Logo + Name + Location */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            {venue.logo && (
              <CachedImage
                uri={venue.logo}
                style={styles.logoImage}
                contentFit="cover"
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
        </View>

        {/* Tab Bar */}
        {visibleTabs.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarContent}
            style={styles.tabBar}
          >
            {visibleTabs.map((tab) => {
              const isActive = tab === currentTab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabItemText,
                      isActive && styles.tabItemTextActive,
                    ]}
                  >
                    {t(`venueDetail.tabs.${tab}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Tab Content */}
        <View style={styles.tabContent}>{renderTabContent()}</View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  statusBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 10,
  },
  bottomBarOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 10,
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
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
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
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabBarContent: {
    paddingHorizontal: theme.spacing.md,
    gap: 4,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  tabItemTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  tabContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
});
