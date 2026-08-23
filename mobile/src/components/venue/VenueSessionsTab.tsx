import React, { useState, useMemo, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  Trash2,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { useVenueSessions } from "@/src/hooks/useVenueSessions";
import type { VenueSession } from "@/src/hooks/useVenueSessions";
import { SessionCard } from "@/src/components/venue/SessionCard";
import { SessionDetailSheet } from "@/src/components/venue/SessionDetailSheet";
import { SessionFormModal } from "@/src/components/venue/SessionFormModal";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { api } from "@/src/lib/api";
import axios from "axios";
import type { ToastType } from "@/src/hooks/useToast";
import {
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
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

interface VenueSessionsTabProps {
  venueId: string;
  userId: string | null;
  isOwnerOrAdmin: boolean;
  canEditSessions: boolean;
  hasActiveSubscription: boolean;
  allowPublicBooking?: boolean;
  showToast: (message: string, type?: ToastType) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get("window").width;
const PARENT_PADDING = 16; // tabContent padding from [slug].tsx
const CALENDAR_PADDING = 12;
// Available width = screen - parent padding both sides - calendar padding both sides
const AVAILABLE_WIDTH =
  SCREEN_WIDTH - PARENT_PADDING * 2 - CALENDAR_PADDING * 2;
const CELL_HEIGHT = Math.floor(AVAILABLE_WIDTH / 7) + 8;

// ── Component ──────────────────────────────────────────────────────────

export function VenueSessionsTab({
  venueId,
  userId,
  isOwnerOrAdmin,
  canEditSessions,
  hasActiveSubscription,
  allowPublicBooking = true,
  showToast,
}: VenueSessionsTabProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = dateFnsLocaleMap[i18n.language] || enUS;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ── Session state ──
  const [selectedSession, setSelectedSession] = useState<VenueSession | null>(
    null
  );
  const [detailSheetVisible, setDetailSheetVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<VenueSession | null>(
    null
  );
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  );

  // ── Confirm modal state ──
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: "cancel" | "delete" | "deleteRecurring";
    session: VenueSession | null;
    loading: boolean;
  }>({ visible: false, type: "cancel", session: null, loading: false });

  // ── Data fetching (React Query — cached for instant re-renders) ──

  const {
    sessions,
    isLoading,
    refetch,
    optimisticBook,
    optimisticCancelBooking,
    optimisticDelete,
  } = useVenueSessions(venueId, currentMonth);

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

  // ── Session action handlers ──

  const handleBook = useCallback(
    async (session: VenueSession) => {
      if (!userId) {
        showToast(t("sessions.signInToBook"), "warning");
        return;
      }
      setBookingInProgress(session.id);
      try {
        const res = await api.post(
          `/venues/${venueId}/sessions/${session.id}/book`
        );
        const bookingId = res.data?.booking?.id ?? res.data?.id ?? "temp";
        optimisticBook(session.id, bookingId);
        showToast(t("sessions.bookingSuccess"), "success");
        // Refetch in background to sync with server
        refetch();
      } catch (error) {
        let message = t("sessions.bookingError");
        if (axios.isAxiosError(error) && error.response?.data) {
          const reason = error.response.data.reason as string | undefined;
          const reasonMap: Record<string, string> = {
            ALREADY_BOOKED: t("sessions.alreadyBooked"),
            SESSION_FULL: t("sessions.sessionFull"),
            NO_ACTIVE_SUBSCRIPTION: t("sessions.noSubscription"),
            MAX_TOTAL_BOOKINGS_REACHED: t("sessions.maxTotalBookingsReached"),
            MAX_BOOKINGS_PER_DAY_REACHED: t("sessions.limitReached"),
            MAX_BOOKINGS_PER_WEEK_REACHED: t("sessions.limitReached"),
            MAX_BOOKINGS_PER_MONTH_REACHED: t("sessions.limitReached"),
            BOOKING_DEADLINE_PASSED: t("sessions.bookingDeadlinePassed"),
            SESSION_ALREADY_STARTED: t("sessions.sessionAlreadyStarted"),
            PUBLIC_BOOKING_DISABLED: t("sessions.publicBookingDisabled"),
          };
          if (reason && reasonMap[reason]) {
            message = reasonMap[reason];
          }
        }
        showToast(message, "error");
      } finally {
        setBookingInProgress(null);
      }
    },
    [userId, venueId, optimisticBook, refetch, t, showToast]
  );

  const handleMarkAttendance = useCallback(
    async (
      session: VenueSession,
      bookingId: string,
      status: "ATTENDED" | "NO_SHOW" | "BOOKED"
    ) => {
      try {
        await api.post(`/venues/${venueId}/sessions/${session.id}/attendance`, {
          bookingId,
          status,
        });
        showToast(t("sessions.attendanceUpdated"), "success");
        refetch();
      } catch {
        showToast(t("sessions.attendanceError"), "error");
      }
    },
    [venueId, refetch, t, showToast]
  );

  const handleCancelBooking = useCallback((session: VenueSession) => {
    if (!session.userBookingId) return;
    setConfirmModal({
      visible: true,
      type: "cancel",
      session,
      loading: false,
    });
  }, []);

  const executeCancelBooking = useCallback(async () => {
    const session = confirmModal.session;
    if (!session?.userBookingId) return;
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      await api.post(
        `/venues/${venueId}/bookings/${session.userBookingId}/cancel`
      );
      optimisticCancelBooking(session.id);
      showToast(t("sessions.bookingCancelled"), "success");
      refetch();
    } catch {
      showToast(t("sessions.cancelError"), "error");
    } finally {
      setConfirmModal({
        visible: false,
        type: "cancel",
        session: null,
        loading: false,
      });
    }
  }, [
    confirmModal.session,
    venueId,
    optimisticCancelBooking,
    refetch,
    t,
    showToast,
  ]);

  const handleDelete = useCallback((session: VenueSession) => {
    setConfirmModal({
      visible: true,
      type: session.recurringSessionId ? "deleteRecurring" : "delete",
      session,
      loading: false,
    });
  }, []);

  const executeDelete = useCallback(
    async (deleteAll = false) => {
      const session = confirmModal.session;
      if (!session) return;
      setConfirmModal((prev) => ({ ...prev, loading: true }));
      try {
        const url = deleteAll
          ? `/venues/${venueId}/sessions/${session.id}?deleteAll=true`
          : `/venues/${venueId}/sessions/${session.id}`;
        await api.delete(url);
        if (deleteAll) {
          refetch();
        } else {
          optimisticDelete(session.id);
        }
        showToast(t("sessions.deleteSuccess"), "success");
      } catch {
        showToast(t("sessions.deleteError"), "error");
      } finally {
        setConfirmModal({
          visible: false,
          type: "cancel",
          session: null,
          loading: false,
        });
      }
    },
    [confirmModal.session, venueId, optimisticDelete, refetch, t, showToast]
  );

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({
      visible: false,
      type: "cancel",
      session: null,
      loading: false,
    });
  }, []);

  const handleEdit = useCallback((session: VenueSession) => {
    setEditingSession(session);
    setFormModalVisible(true);
  }, []);

  const handleSessionPress = useCallback((session: VenueSession) => {
    setSelectedSession(session);
    setDetailSheetVisible(true);
  }, []);

  const handleCreateSession = useCallback(() => {
    setEditingSession(null);
    setFormModalVisible(true);
  }, []);

  // ── Keep selectedSession in sync with latest data ──
  const currentSelectedSession = useMemo(() => {
    if (!selectedSession) return null;
    // Find the latest version of the selected session from the sessions array
    return sessions.find((s) => s.id === selectedSession.id) || selectedSession;
  }, [selectedSession, sessions]);

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

  if (isLoading && sessions.length === 0) {
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isToday(selectedDate)
              ? t("sessions.today", "Hoje")
              : format(selectedDate, "EEEE, d MMMM", { locale: dateLocale })}
          </Text>
          {canEditSessions && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateSession}
            >
              <Plus size={16} color="#fff" />
              <Text style={styles.createButtonText}>
                {t("sessions.createSession")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedDateSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={40} color={theme.colors.textTertiary} />
            <Text style={styles.emptyStateText}>
              {t("sessions.noSessions", "Sem sessões agendadas para este dia")}
            </Text>
          </View>
        ) : (
          selectedDateSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              userId={userId}
              hasActiveSubscription={hasActiveSubscription}
              isOwnerOrAdmin={isOwnerOrAdmin}
              canEditSessions={canEditSessions}
              allowPublicBooking={allowPublicBooking}
              onPress={() => handleSessionPress(session)}
              onBook={() => handleBook(session)}
              onCancelBooking={() => handleCancelBooking(session)}
              onEdit={() => handleEdit(session)}
              onDelete={() => handleDelete(session)}
              bookingInProgress={bookingInProgress === session.id}
            />
          ))
        )}
      </View>

      {/* Session Detail Bottom Sheet */}
      <SessionDetailSheet
        visible={detailSheetVisible}
        onClose={() => {
          setDetailSheetVisible(false);
          setSelectedSession(null);
        }}
        session={currentSelectedSession}
        userId={userId}
        hasActiveSubscription={hasActiveSubscription}
        isOwnerOrAdmin={isOwnerOrAdmin}
        canEditSessions={canEditSessions}
        allowPublicBooking={allowPublicBooking}
        onMarkAttendance={(bookingId, status) => {
          if (currentSelectedSession) {
            handleMarkAttendance(currentSelectedSession, bookingId, status);
          }
        }}
        onBook={() => {
          if (currentSelectedSession) handleBook(currentSelectedSession);
        }}
        onCancelBooking={() => {
          if (currentSelectedSession) {
            setDetailSheetVisible(false);
            handleCancelBooking(currentSelectedSession);
          }
        }}
        onEdit={() => {
          if (currentSelectedSession) {
            setDetailSheetVisible(false);
            handleEdit(currentSelectedSession);
          }
        }}
        onDelete={() => {
          if (currentSelectedSession) {
            setDetailSheetVisible(false);
            handleDelete(currentSelectedSession);
          }
        }}
        bookingInProgress={
          currentSelectedSession
            ? bookingInProgress === currentSelectedSession.id
            : false
        }
      />

      {/* Create / Edit Session Modal */}
      <SessionFormModal
        visible={formModalVisible}
        onClose={() => {
          setFormModalVisible(false);
          setEditingSession(null);
        }}
        venueId={venueId}
        session={editingSession}
        defaultDate={selectedDate}
        onSuccess={() => refetch()}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmModal.visible}
        onClose={closeConfirmModal}
        title={
          confirmModal.type === "cancel"
            ? t("sessions.cancelBooking")
            : t("sessions.deleteSession")
        }
        message={
          confirmModal.type === "cancel"
            ? t("sessions.confirmCancel")
            : confirmModal.type === "deleteRecurring"
              ? t("sessions.confirmDeleteRecurring")
              : t("sessions.confirmDelete")
        }
        icon={
          confirmModal.type === "cancel" ? (
            <AlertTriangle size={28} color="#f97316" />
          ) : (
            <Trash2 size={28} color={theme.colors.error} />
          )
        }
        actions={
          confirmModal.type === "cancel"
            ? [
                {
                  label: t("sessions.cancelBooking"),
                  variant: "destructive",
                  onPress: executeCancelBooking,
                  loading: confirmModal.loading,
                },
                {
                  label: t("common.close"),
                  variant: "outline",
                  onPress: closeConfirmModal,
                },
              ]
            : confirmModal.type === "deleteRecurring"
              ? [
                  {
                    label: t("sessions.deleteOnlyThis"),
                    variant: "primary",
                    onPress: () => executeDelete(false),
                    loading: confirmModal.loading,
                  },
                  {
                    label: t("sessions.deleteAll"),
                    variant: "destructive",
                    onPress: () => executeDelete(true),
                    loading: confirmModal.loading,
                  },
                  {
                    label: t("common.close"),
                    variant: "outline",
                    onPress: closeConfirmModal,
                  },
                ]
              : [
                  {
                    label: t("sessions.deleteSession"),
                    variant: "destructive",
                    onPress: () => executeDelete(false),
                    loading: confirmModal.loading,
                  },
                  {
                    label: t("common.close"),
                    variant: "outline",
                    onPress: closeConfirmModal,
                  },
                ]
        }
      />
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    textTransform: "capitalize",
    flex: 1,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
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
});
