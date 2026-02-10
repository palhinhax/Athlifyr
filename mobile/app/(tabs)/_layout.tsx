import { Tabs } from "expo-router";
import { Calendar, MapPin, User, MessageCircle, Activity } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/src/constants/theme";
import { NotificationBell } from "@/src/components/NotificationBell";

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Calculate tab bar height with safe area
  const tabBarHeight = Platform.OS === "ios"
    ? 88
    : 68 + insets.bottom;

  const tabBarPaddingBottom = Platform.OS === "ios"
    ? 24
    : Math.max(8, insets.bottom);

  return (
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
        headerRight: () => <NotificationBell />,
      }}
    >
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
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: t("navigation.feed"),
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.centerTabIcon,
                focused && styles.centerTabIconActive,
              ]}
            >
              <Activity
                color={focused ? theme.colors.white : color}
                size={28}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: t("navigation.exercises"),
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
          href: null, // Hide from tabs but keep route available
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t("navigation.messages"),
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("navigation.profile"),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
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
