import { useState, useCallback, useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import {
  Calendar,
  User,
  Activity,
  MessageCircle,
  Building2,
  MapPin,
  Dumbbell,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import { NotificationBell } from "@/src/components/NotificationBell";
import { CalendarButton } from "@/src/components/CalendarButton";
import { SearchButton } from "@/src/components/SearchButton";
import { LiftAnalysisButton } from "@/src/components/LiftAnalysisButton";
import { HeaderLogo } from "@/src/components/HeaderLogo";
import { VenuePickerModal } from "@/src/components/VenuePickerModal";
import { useActiveVenues, type ActiveVenue } from "@/src/hooks/useActiveVenues";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";

export default function TabLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: activeVenues = [] } = useActiveVenues();
  const [showVenuePicker, setShowVenuePicker] = useState(false);

  // Only show my-venues tab when logged in AND has venues
  const showMyVenuesTab = isAuthenticated && activeVenues.length > 0;

  // ── Pre-fetch venue detail + sessions for instant navigation ──
  useEffect(() => {
    if (activeVenues.length === 0) return;
    const now = new Date();
    const monthKey = format(now, "yyyy-MM");
    const from = startOfMonth(now).toISOString();
    const to = endOfMonth(now).toISOString();

    for (const venue of activeVenues) {
      // Pre-fetch venue detail
      queryClient.prefetchQuery({
        queryKey: ["venue", venue.slug],
        queryFn: () => api.get(`/venues/${venue.slug}`).then((r) => r.data),
        staleTime: 2 * 60 * 1000,
      });
      // Pre-fetch current month sessions
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
    }
  }, [activeVenues, queryClient]);

  // Calculate tab bar height with safe area
  const tabBarHeight = Platform.OS === "ios" ? 88 : 68 + insets.bottom;

  const tabBarPaddingBottom =
    Platform.OS === "ios" ? 24 : Math.max(8, insets.bottom);

  const navigateToVenue = useCallback(
    (venue: ActiveVenue) => {
      setShowVenuePicker(false);
      // Navigate directly to sessions tab for fastest access
      router.push(`/venues/${venue.slug}?tab=sessions`);
    },
    [router]
  );

  const handleMyVenuePress = useCallback(() => {
    if (activeVenues.length === 1) {
      // Single venue: navigate directly
      navigateToVenue(activeVenues[0]);
    } else if (activeVenues.length > 1) {
      // Multiple venues: show picker
      setShowVenuePicker(true);
    }
    // If no venues, the my-venues screen will be shown by default
  }, [activeVenues, navigateToVenue]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
            height: tabBarHeight,
            paddingBottom: tabBarPaddingBottom,
            paddingTop: 8,
          },
          headerTitle: () => <HeaderLogo />,
          headerRight: () => (
            <View style={styles.headerRight}>
              <LiftAnalysisButton />
              <SearchButton />
              <CalendarButton />
              <NotificationBell />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: t("navigation.feed"),
            tabBarIcon: ({ color, size }) => (
              <Activity color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: t("navigation.events"),
            tabBarIcon: ({ color, size }) => (
              <Calendar color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="venues"
          options={{
            title: t("navigation.venues"),
            tabBarIcon: ({ color, size }) => (
              <MapPin color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-venues"
          options={{
            // Hide tab when not logged in or no venues
            href: showMyVenuesTab ? undefined : null,
            title: t("navigation.myVenue"),
            tabBarIcon: ({ color, focused: _focused }) => {
              const singleVenue =
                activeVenues.length === 1 ? activeVenues[0] : null;

              return (
                <View
                  style={[
                    styles.centerTabIcon,
                    activeVenues.length > 0 && styles.centerTabIconActive,
                    singleVenue?.imageUrl && styles.centerTabIconWithImage,
                  ]}
                >
                  {singleVenue?.imageUrl ? (
                    <CachedImage
                      uri={singleVenue.imageUrl}
                      style={styles.venueLogo}
                      contentFit="cover"
                      alt={singleVenue.name}
                    />
                  ) : (
                    <Building2
                      color={
                        activeVenues.length > 0 ? theme.colors.white : color
                      }
                      size={28}
                    />
                  )}
                </View>
              );
            },
            tabBarLabel: () => null,
          }}
          listeners={{
            tabPress: (e) => {
              // Prevent default tab navigation when user has venues
              if (activeVenues.length > 0) {
                e.preventDefault();
                handleMyVenuePress();
              }
              // If no venues, allow default navigation to my-venues screen
            },
          }}
        />
        <Tabs.Screen
          name="exercises"
          options={{
            title: t("navigation.workouts"),
            tabBarIcon: ({ color, size }) => (
              <Dumbbell color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: t("navigation.messages"),
            tabBarIcon: ({ color, size }) => (
              <MessageCircle color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("navigation.profile"),
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Venue Picker Modal */}
      <VenuePickerModal
        visible={showVenuePicker}
        venues={activeVenues}
        onSelect={navigateToVenue}
        onClose={() => setShowVenuePicker(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 8,
  },
  centerTabIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 20 : 16,
    borderWidth: 3,
    borderColor: theme.colors.background,
    ...theme.shadows.lg,
    overflow: "hidden",
  },
  centerTabIconActive: {
    backgroundColor: theme.colors.primary,
  },
  centerTabIconWithImage: {
    backgroundColor: theme.colors.white,
    padding: 0,
  },
  venueLogo: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
});
