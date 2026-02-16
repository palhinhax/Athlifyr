import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  Clock,
  Users,
} from "lucide-react-native";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "@/src/constants/theme";

interface ScheduleSession {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  venue: {
    name: string;
  };
  userRole?: "COACH" | "CLIENT";
  _count: {
    bookings: number;
  };
  capacity: number | null;
}

interface ScheduleEvent {
  id: string;
  title: string;
  startsAt: string;
  city: string;
  country: string;
  variantName: string | null;
  variantDistance: number | null;
}

export default function MyScheduleScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSchedule = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);

      const response = await api.get(
        `/my-schedule?from=${now.toISOString()}&to=${futureDate.toISOString()}`
      );

      const data = response.data;

      // Combine coach and client sessions
      const allSessions = [
        ...(data.sessions || []),
        ...(data.clientSessions || []),
      ];

      // Filter future only and sort
      const futureSessions = allSessions
        .filter((s: ScheduleSession) => new Date(s.startsAt) > now)
        .sort(
          (a: ScheduleSession, b: ScheduleSession) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        )
        .slice(0, 20); // Limit to 20 items

      const futureEvents = (data.events || [])
        .filter((e: ScheduleEvent) => new Date(e.startsAt) > now)
        .sort(
          (a: ScheduleEvent, b: ScheduleEvent) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        )
        .slice(0, 20); // Limit to 20 items

      setSessions(futureSessions);
      setEvents(futureEvents);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedule();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return t("schedule.today");
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t("common.tomorrow");
    } else {
      return date.toLocaleDateString(t("common.locale"), {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(t("common.locale"), {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Not authenticated → show sign in required
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("schedule.title")}</Text>
        </View>
        <AuthRequiredView
          icon={CalendarClock}
          titleKey="common.authTitle"
          descriptionKey="common.authDescription"
        />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("schedule.title")}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("schedule.title")}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Upcoming Events */}
        {events.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("schedule.upcomingEvents")}
            </Text>
            {events.map((event) => (
              <View key={event.id} style={[styles.card, styles.eventCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>
                    {formatDate(event.startsAt)}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{t("common.event")}</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>{event.title}</Text>
                {event.variantName && (
                  <Text style={styles.cardSubtitle}>
                    {event.variantName}
                    {event.variantDistance && ` • ${event.variantDistance}km`}
                  </Text>
                )}
                <View style={styles.cardFooter}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={styles.cardLocation}>
                    {event.city}, {event.country}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Upcoming Sessions */}
        {sessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("schedule.upcomingSessions")}
            </Text>
            {sessions.map((session) => (
              <View key={session.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>
                    {formatDate(session.startsAt)}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      session.userRole === "COACH" && styles.badgePrimary,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {session.userRole === "COACH"
                        ? t("schedule.asCoach")
                        : t("schedule.asParticipant")}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>{session.title}</Text>
                <Text style={styles.cardSubtitle}>{session.venue.name}</Text>
                <View style={styles.cardFooter}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={styles.cardTime}>
                    {formatTime(session.startsAt)} -{" "}
                    {formatTime(session.endsAt)}
                  </Text>
                  {session.capacity && (
                    <>
                      <Users
                        size={14}
                        color={colors.textSecondary}
                        style={{ marginLeft: 12 }}
                      />
                      <Text style={styles.cardCapacity}>
                        {session._count.bookings}/{session.capacity}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {sessions.length === 0 && events.length === 0 && (
          <View style={styles.emptyState}>
            <CalendarClock
              size={64}
              color={colors.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <Text style={styles.emptyTitle}>
              {t("schedule.noUpcomingSessions")}
            </Text>
            <Text style={styles.emptyDescription}>
              {t("schedule.noUpcomingEvents")}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: "700",
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardDate: {
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.secondary + "20",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgePrimary: {
    backgroundColor: colors.primary + "20",
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    color: colors.text,
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  cardLocation: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  cardTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  cardCapacity: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl * 3,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  signInButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  signInButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: "600",
    color: colors.white,
  },
});
