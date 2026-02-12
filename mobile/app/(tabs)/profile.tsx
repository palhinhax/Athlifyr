import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import { GuestView } from "@/src/components/profile/GuestView";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileStats } from "@/src/components/profile/ProfileStats";
import { EventsSection } from "@/src/components/profile/EventsSection";
import { OtherSections } from "@/src/components/profile/OtherSections";

// ─── Types ─────────────────────────────────────────────────────

interface ProfileEvent {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  city: string | null;
  country: string | null;
  sportTypes: string[];
}

interface Participation {
  id: string;
  status: string;
  event: ProfileEvent;
  variant: {
    name: string;
    distanceKm: number | null;
  } | null;
}

interface ProfileStats {
  upcomingEvents: number;
  pastEvents: number;
  friendsCount: number;
}

interface ProfileData {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  stats: ProfileStats;
  participations: Participation[];
  isOwnProfile: boolean;
}

// ─── Main Profile Screen ───────────────────────────────────────

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();
  const { t } = useTranslation();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = useCallback(async (userId: string) => {
    try {
      setProfileLoading(true);
      setProfileError(false);
      const response = await api.get<ProfileData>(`/users/${userId}`);
      setProfileData(response.data);
    } catch {
      setProfileError(true);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  useEffect(() => {
    if (user?.id) {
      fetchProfileData(user.id);
    }
  }, [user?.id, fetchProfileData]);

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    await fetchProfileData(user.id);
    setRefreshing(false);
  }, [user?.id, fetchProfileData]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GuestView />
      </SafeAreaView>
    );
  }

  const stats = profileData?.stats ?? {
    upcomingEvents: 0,
    pastEvents: 0,
    friendsCount: 0,
  };
  const participations = profileData?.participations ?? [];
  const now = new Date();
  const upcomingEvents = participations.filter(
    (p) => new Date(p.event.startDate) > now && p.status === "going"
  );
  const pastEvents = participations.filter(
    (p) => new Date(p.event.startDate) <= now && p.status === "going"
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <ProfileHeader user={user} />

        <ProfileStats stats={stats} />

        {profileLoading && !profileData && (
          <View style={styles.profileLoadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.profileLoadingText}>
              {t("profile.loadingProfile")}
            </Text>
          </View>
        )}

        {profileError && !profileData && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {t("profile.errorLoadingProfile")}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => user.id && fetchProfileData(user.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <EventsSection
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
        />

        <OtherSections friendsCount={stats.friendsCount} />

        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
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
  profileLoadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  profileLoadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
