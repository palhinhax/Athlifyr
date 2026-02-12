import { Tabs } from "expo-router";
import {
  Newspaper,
  User,
  Calendar,
  Building2,
  Dumbbell,
  MessageCircle,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/src/constants/theme";
import { NotificationBell } from "@/src/components/NotificationBell";

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Calculate tab bar height with safe area
  const tabBarHeight = Platform.OS === "ios" ? 88 : 68 + insets.bottom;

  const tabBarPaddingBottom =
    Platform.OS === "ios" ? 24 : Math.max(8, insets.bottom);

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
        name="feed"
        options={{
          title: t("navigation.feed"),
          tabBarIcon: ({ color, size }) => (
            <Newspaper color={color} size={size} />
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
            <Building2 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
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
        name="exercises"
        options={{
          href: null, // Hide from tabs but keep route available for future use
        }}
      />
    </Tabs>
  );
}
