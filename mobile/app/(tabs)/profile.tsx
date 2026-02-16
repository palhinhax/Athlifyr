import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "lucide-react-native";
import { useAuthStore } from "@/src/lib/auth-store";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import { useProfile } from "@/src/hooks/useProfile";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileStats } from "@/src/components/profile/ProfileStats";
import { EventsSection } from "@/src/components/profile/EventsSection";
import { OtherSections } from "@/src/components/profile/OtherSections";
import { PerformanceSection } from "@/src/components/profile/PerformanceSection";
import { theme } from "@/src/constants/theme";

export default function ProfileScreen() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    loadStoredAuth,
  } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const {
    stats,
    upcomingEvents,
    pastEvents,
    isLoading: profileLoading,
    refetch,
  } = useProfile(user?.id);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.safeArea}>
        <AuthRequiredView
          icon={User}
          titleKey="common.authTitle"
          descriptionKey="common.authDescription"
        />
      </View>
    );
  }

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ProfileHeader user={user} />
        <ProfileStats stats={stats} />
        <EventsSection
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
        />
        <PerformanceSection />
        <OtherSections friendsCount={stats.friendsCount} />
        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
});
