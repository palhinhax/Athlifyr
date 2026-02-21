import { useState, useEffect, useMemo, useCallback } from "react";
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
import { ArrowLeft, CalendarClock } from "lucide-react-native";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import { MonthCalendarGrid } from "@/src/components/schedule/MonthCalendarGrid";
import { DayDetailPanel } from "@/src/components/schedule/DayDetailPanel";
import { colors, typography, spacing } from "@/src/constants/theme";

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

function formatDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function MyScheduleScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(() => new Date());

  const fetchSchedule = useCallback(
    async (month: Date) => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        // Fetch a range covering 1 month before and 1 month after the current month
        const from = new Date(month.getFullYear(), month.getMonth() - 1, 1);
        const to = new Date(month.getFullYear(), month.getMonth() + 2, 0);

        const response = await api.get(
          `/my-schedule?from=${from.toISOString()}&to=${to.toISOString()}`
        );

        const data = response.data;

        // Combine coach and client sessions
        const allSessions: ScheduleSession[] = [
          ...(data.sessions || []),
          ...(data.clientSessions || []),
        ].sort(
          (a: ScheduleSession, b: ScheduleSession) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );

        const allEvents: ScheduleEvent[] = (data.events || []).sort(
          (a: ScheduleEvent, b: ScheduleEvent) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );

        setSessions(allSessions);
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    fetchSchedule(currentMonth);
  }, [fetchSchedule, currentMonth]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSchedule(currentMonth);
  }, [fetchSchedule, currentMonth]);

  // Build a map of day → activity count for the calendar dots
  const activitiesByDay = useMemo(() => {
    const map: Record<string, number> = {};

    sessions.forEach((s) => {
      const key = formatDayKey(new Date(s.startsAt));
      map[key] = (map[key] || 0) + 1;
    });

    events.forEach((e) => {
      const key = formatDayKey(new Date(e.startsAt));
      map[key] = (map[key] || 0) + 1;
    });

    return map;
  }, [sessions, events]);

  // Filter sessions and events for the selected day
  const selectedDaySessions = useMemo(
    () => sessions.filter((s) => isSameDay(new Date(s.startsAt), selectedDay)),
    [sessions, selectedDay]
  );

  const selectedDayEvents = useMemo(
    () => events.filter((e) => isSameDay(new Date(e.startsAt), selectedDay)),
    [events, selectedDay]
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today);
  }, []);

  const handleDaySelect = useCallback((day: Date) => {
    setSelectedDay(day);
    // If selecting a day in a different month, navigate to that month
    setCurrentMonth((prev) => {
      if (
        day.getMonth() !== prev.getMonth() ||
        day.getFullYear() !== prev.getFullYear()
      ) {
        return new Date(day.getFullYear(), day.getMonth(), 1);
      }
      return prev;
    });
  }, []);

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
        {/* Month Calendar Grid */}
        <MonthCalendarGrid
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          activitiesByDay={activitiesByDay}
          onDaySelect={handleDaySelect}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        {/* Selected Day Detail */}
        <DayDetailPanel
          selectedDay={selectedDay}
          sessions={selectedDaySessions}
          events={selectedDayEvents}
        />
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
});
