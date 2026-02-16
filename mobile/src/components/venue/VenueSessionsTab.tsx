import React, { useEffect, useState, useCallback, useMemo } from "react";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";

const dateFnsLocaleMap: Record<string, Locale> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

// ── Types ──────────────────────────────────────────────────────────────

interface Session {
  id: string;
  title: string;
  type: string;
  startsAt: string;
  endsAt: string;
  maxCapacity: number | null;
  currentBookings: number;
  coach?: {
    user: { id: string; name: string; image: string | null };
  } | null;
  _count?: { bookings: number };
}

interface VenueSessionsTabProps {
  venueId: string;
}

// ── Helpers ────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get("window").width;
const PARENT_PADDING = 16; // tabContent padding from [slug].tsx
const CALENDAR_PADDING = 12;
// Available width = screen - parent padding both sides - calendar padding both sides
const AVAILABLE_WIDTH =
  SCREEN_WIDTH - PARENT_PADDING * 2 - CALENDAR_PADDING * 2;
const CELL_HEIGHT = Math.floor(AVAILABLE_WIDTH / 7) + 8;

function formatSessionTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getSessionTypeColor(type: string): string {
  switch (type) {
    case "CLASS":
      return "#3b82f6";
    case "OPEN_GYM":
      return "#10b981";
    case "PERSONAL":
      return "#8b5cf6";
    case "EVENT":
      return "#f59e0b";
    default:
      return theme.colors.textSecondary;
  }
}

// ── Component ──────────────────────────────────────────────────────────

export function VenueSessionsTab({ venueId }: VenueSessionsTabProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = dateFnsLocaleMap[i18n.language] || enUS;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ── Data fetching ──

  const fetchSessions = useCallback(
    async (month: Date) => {
      try {
        setLoading(true);
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const response = await api.get(`/venues/${venueId}/sessions`, {
          params: { from: start.toISOString(), to: end.toISOString() },
        });

        const raw = response.data;
        let sessionsData: Session[] = [];
        if (Array.isArray(raw)) {
          sessionsData = raw;
        } else if (
          raw &&
          typeof raw === "object" &&
          Array.isArray(raw.sessions)
        ) {
          sessionsData = raw.sessions;
        }

        setSessions(sessionsData || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    },
    [venueId]
  );

  useEffect(() => {
    fetchSessions(currentMonth);
  }, [currentMonth, fetchSessions]);

  // ── Calendar computation ──

  const calendarWeeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    // Split into weeks of exactly 7 days
    const weeks: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }
    return weeks;
  }, [currentMonth]);

  const sessionsPerDay = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach((session) => {
      const dateKey = format(new Date(session.startsAt), "yyyy-MM-dd");
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });
    return counts;
  }, [sessions]);

  const selectedDateSessions = useMemo(
    () =>
      sessions.filter((session) =>
        isSameDay(new Date(session.startsAt), selectedDate)
      ),
    [sessions, selectedDate]
  );

  // ── Handlers ──

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleDayPress = (day: Date) => setSelectedDate(day);

  // ── Weekday labels ──

  const weekDayLabels = [
    t("calendar.mondayShort", "Seg"),
    t("calendar.tuesdayShort", "Ter"),
    t("calendar.wednesdayShort", "Qua"),
    t("calendar.thursdayShort", "Qui"),
    t("calendar.fridayShort", "Sex"),
    t("calendar.saturdayShort", "Sáb"),
    t("calendar.sundayShort", "Dom"),
  ];

  // ── Loading state ──

  if (loading && sessions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // ── Render ──

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        {/* Month navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={handlePreviousMonth}
            style={styles.monthButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
          </Text>
          <TouchableOpacity
            onPress={handleNextMonth}
            style={styles.monthButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronRight size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Weekday header row */}
        <View style={styles.weekRow}>
          {weekDayLabels.map((label, i) => (
            <View key={i} style={styles.cell}>
              <Text style={styles.weekDayText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Separator */}
        <View style={styles.weekDaySeparator} />

        {/* Calendar grid — row by row */}
        {calendarWeeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const sessionCount = sessionsPerDay[dateKey] || 0;
              const inCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);
              const isSelected = isSameDay(day, selectedDate);

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[styles.cell, styles.dayCell]}
                  onPress={() => handleDayPress(day)}
                  activeOpacity={0.6}
                  disabled={!inCurrentMonth}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      isSelected && styles.dayCircleSelected,
                      isTodayDate && !isSelected && styles.dayCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !inCurrentMonth && styles.dayTextOutside,
                        isTodayDate && !isSelected && styles.dayTextToday,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {format(day, "d")}
                    </Text>
                  </View>

                  {/* Session indicator dots */}
                  <View style={styles.dotRow}>
                    {sessionCount > 0 && inCurrentMonth ? (
                      Array.from({ length: Math.min(sessionCount, 3) }).map(
                        (_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.sessionDot,
                              isSelected && styles.sessionDotSelected,
                            ]}
                          />
                        )
                      )
                    ) : (
                      <View style={styles.dotPlaceholder} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Sessions for selected date */}
      <View style={styles.sessionsSection}>
        <Text style={styles.sectionTitle}>
          {isToday(selectedDate)
            ? t("sessions.today", "Hoje")
            : format(selectedDate, "EEEE, d MMMM", { locale: dateLocale })}
        </Text>

        {selectedDateSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={40} color={theme.colors.textTertiary} />
            <Text style={styles.emptyStateText}>
              {t("sessions.noSessions", "Sem sessões agendadas para este dia")}
            </Text>
          </View>
        ) : (
          selectedDateSessions.map((session) => {
            const typeColor = getSessionTypeColor(session.type);
            const bookings =
              session.currentBookings || session._count?.bookings || 0;

            return (
              <View key={session.id} style={styles.sessionCard}>
                {/* Left accent bar */}
                <View
                  style={[styles.sessionAccent, { backgroundColor: typeColor }]}
                />

                <View style={styles.sessionContent}>
                  {/* Type badge + time */}
                  <View style={styles.sessionTopRow}>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: typeColor + "20" },
                      ]}
                    >
                      <Text
                        style={[styles.typeBadgeText, { color: typeColor }]}
                      >
                        {session.type.replace("_", " ")}
                      </Text>
                    </View>
                    <View style={styles.sessionTime}>
                      <Clock size={13} color={theme.colors.textSecondary} />
                      <Text style={styles.sessionTimeText}>
                        {formatSessionTime(session.startsAt)} -{" "}
                        {formatSessionTime(session.endsAt)}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.sessionTitle}>{session.title}</Text>

                  {/* Meta row */}
                  <View style={styles.sessionMetaRow}>
                    {session.coach?.user?.name && (
                      <Text style={styles.sessionMetaText}>
                        🏋️ {session.coach.user.name}
                      </Text>
                    )}
                    {session.maxCapacity && (
                      <View style={styles.capacityBadge}>
                        <Users size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.capacityText}>
                          {bookings}/{session.maxCapacity}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  // Calendar
  calendarContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: CALENDAR_PADDING,
    marginBottom: theme.spacing.md,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
    textTransform: "capitalize",
  },

  // Week row — the key to a correct 7-column grid
  weekRow: {
    flexDirection: "row",
  },

  // Every cell fills exactly 1/7 of the row
  cell: {
    flex: 1,
    height: CELL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  weekDayText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  weekDaySeparator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
    marginBottom: 4,
    opacity: 0.5,
  },

  // Day cells
  dayCell: {
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircleSelected: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  dayTextOutside: {
    color: theme.colors.textTertiary,
    opacity: 0.3,
  },
  dayTextToday: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },

  // Session indicator dots
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
    height: 6,
  },
  sessionDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.primary,
  },
  sessionDotSelected: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  dotPlaceholder: {
    height: 5,
  },

  // Sessions list
  sessionsSection: {
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textTransform: "capitalize",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: "center",
    lineHeight: 20,
  },

  // Session card
  sessionCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
  },
  sessionAccent: {
    width: 4,
  },
  sessionContent: {
    flex: 1,
    padding: theme.spacing.md,
    gap: 6,
  },
  sessionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sessionTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionTimeText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 20,
  },
  sessionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  sessionMetaText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  capacityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  capacityText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
});
