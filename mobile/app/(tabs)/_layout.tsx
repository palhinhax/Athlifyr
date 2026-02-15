import { useState, useCallback } from "react";
import { Tabs } from "expo-router";
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
import { StyleSheet, Platform, View, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/src/constants/theme";
import { NotificationBell } from "@/src/components/NotificationBell";
import { CalendarButton } from "@/src/components/CalendarButton";
import { HeaderLogo } from "@/src/components/HeaderLogo";
import { VenuePickerModal } from "@/src/components/VenuePickerModal";
import { useActiveVenues, type ActiveVenue } from "@/src/hooks/useActiveVenues";
import { API_URL } from "@/src/lib/api";

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: activeVenues = [] } = useActiveVenues();
  const [showVenuePicker, setShowVenuePicker] = useState(false);

  // Calculate tab bar height with safe area
  const tabBarHeight = Platform.OS === "ios" ? 88 : 68 + insets.bottom;

  const tabBarPaddingBottom =
    Platform.OS === "ios" ? 24 : Math.max(8, insets.bottom);

  const navigateToVenue = useCallback((venue: ActiveVenue) => {
    setShowVenuePicker(false);
    // Open venue page in the web app
    const venueUrl = `${API_URL}/venues/${venue.slug}`;
    Linking.openURL(venueUrl);
  }, []);

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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            title: t("navigation.myVenue"),
            tabBarIcon: ({ color, focused: _focused }) => (
              <View
                style={[
                  styles.centerTabIcon,
                  activeVenues.length > 0 && styles.centerTabIconActive,
                ]}
              >
                <Building2
                  color={activeVenues.length > 0 ? theme.colors.white : color}
                  size={28}
                />
              </View>
            ),
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
            title: t("navigation.exercises"),
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
  },
  centerTabIconActive: {
    backgroundColor: theme.colors.primary,
  },
});
