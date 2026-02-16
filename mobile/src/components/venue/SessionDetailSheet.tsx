import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Clock,
  Users,
  UserCircle,
  CheckCircle,
  Dumbbell,
  Tag,
  Pencil,
  Trash2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Repeat,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { VenueSession } from "@/src/hooks/useVenueSessions";

// ── Helpers ────────────────────────────────────────────────────────────

function formatSessionTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDurationMinutes(startsAt: string, endsAt: string): number {
  return Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000
  );
}

function getSessionTypeColor(type: string): string {
  switch (type) {
    case "CLASS":
      return "#3b82f6";
    case "APPOINTMENT":
      return "#8b5cf6";
    case "OPEN_GYM":
      return "#10b981";
    case "EVENT":
      return "#f59e0b";
    default:
      return theme.colors.textSecondary;
  }
}

// ── Props ──────────────────────────────────────────────────────────────

interface SessionDetailSheetProps {
  session: VenueSession | null;
  visible: boolean;
  onClose: () => void;
  userId?: string | null;
  hasActiveSubscription: boolean;
  isOwnerOrAdmin: boolean;
  canEditSessions: boolean;
  onBook?: () => void;
  onCancelBooking?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  bookingInProgress?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────

export function SessionDetailSheet({
  session,
  visible,
  onClose,
  userId,
  hasActiveSubscription,
  isOwnerOrAdmin,
  canEditSessions,
  onBook,
  onCancelBooking,
  onEdit,
  onDelete,
  bookingInProgress,
}: SessionDetailSheetProps) {
  const { t } = useTranslation();
  const [showAttendees, setShowAttendees] = useState(false);

  if (!session) return null;

  const typeColor = getSessionTypeColor(session.type);
  const bookings = session._count?.bookings ?? 0;
  const isFull = session.capacity ? bookings >= session.capacity : false;
  const isPast = new Date(session.startsAt) < new Date();
  const duration = getDurationMinutes(session.startsAt, session.endsAt);
  const spotsLeft = session.capacity ? session.capacity - bookings : null;
  const capacityPercent = session.capacity
    ? Math.min((bookings / session.capacity) * 100, 100)
    : 0;

  const canBook =
    !!userId &&
    hasActiveSubscription &&
    !session.isBooked &&
    !isFull &&
    !isPast;
  const canCancel = !!userId && !!session.isBooked && !isPast;

  const handleDelete = () => {
    if (session.recurringSessionId) {
      Alert.alert(
        t("sessions.deleteSession"),
        t("sessions.confirmDeleteRecurring"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("sessions.deleteOnlyThis"),
            onPress: () => onDelete?.(),
          },
        ]
      );
    } else {
      Alert.alert(t("sessions.deleteSession"), t("sessions.confirmDelete"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("sessions.deleteSession"),
          style: "destructive",
          onPress: () => onDelete?.(),
        },
      ]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* ── Navigation Header ── */}
        <View style={styles.navHeader}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle} numberOfLines={1}>
            {session.title}
          </Text>
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Section ── */}
          <View style={styles.heroSection}>
            {/* Type Badge + Status Badges */}
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: typeColor + "15" },
                ]}
              >
                <View
                  style={[styles.typeDot, { backgroundColor: typeColor }]}
                />
                <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                  {session.type === "CLASS"
                    ? t("sessions.class")
                    : t("sessions.appointment")}
                </Text>
              </View>

              {session.recurringSessionId && (
                <View style={styles.recurringBadge}>
                  <Repeat size={12} color={theme.colors.primary} />
                  <Text style={styles.recurringBadgeText}>
                    {t("sessions.recurring", "Recorrente")}
                  </Text>
                </View>
              )}

              {session.isBooked && (
                <View style={styles.bookedBadge}>
                  <CheckCircle size={14} color="#16a34a" />
                  <Text style={styles.bookedBadgeText}>
                    {t("sessions.booked")}
                  </Text>
                </View>
              )}

              {isPast && (
                <View style={styles.pastBadge}>
                  <Text style={styles.pastBadgeText}>
                    {t("sessions.sessionPast")}
                  </Text>
                </View>
              )}
            </View>

            {/* Title */}
            <Text style={styles.heroTitle}>{session.title}</Text>
          </View>

          {/* ── Info Cards ── */}
          <View style={styles.infoCardsGrid}>
            {/* Date & Time Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <CalendarDays size={18} color={theme.colors.primary} />
                <Text style={styles.infoCardLabel}>
                  {t("sessions.dateTime", "Data & Hora")}
                </Text>
              </View>
              <Text style={styles.infoCardValue}>
                {formatSessionDate(session.startsAt)}
              </Text>
              <View style={styles.timeBlock}>
                <Clock size={14} color={theme.colors.textSecondary} />
                <Text style={styles.timeText}>
                  {formatSessionTime(session.startsAt)} –{" "}
                  {formatSessionTime(session.endsAt)}
                </Text>
                <View style={styles.durationChip}>
                  <Text style={styles.durationChipText}>
                    {t("sessions.duration", { count: duration })}
                  </Text>
                </View>
              </View>
            </View>

            {/* Coach Card */}
            {session.coach?.user?.name && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <UserCircle size={18} color={theme.colors.primary} />
                  <Text style={styles.infoCardLabel}>
                    {t("sessions.coach")}
                  </Text>
                </View>
                <View style={styles.coachInfo}>
                  <View style={styles.coachAvatar}>
                    <Text style={styles.coachInitial}>
                      {session.coach.user.name[0]?.toUpperCase() || "?"}
                    </Text>
                  </View>
                  <Text style={styles.coachName}>
                    {session.coach.user.name}
                  </Text>
                </View>
              </View>
            )}

            {/* Capacity Card */}
            {session.capacity && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <Users size={18} color={theme.colors.primary} />
                  <Text style={styles.infoCardLabel}>
                    {t("sessions.capacity")}
                  </Text>
                </View>
                <View style={styles.capacityNumbers}>
                  <Text style={styles.capacityMain}>
                    {bookings}
                    <Text style={styles.capacitySlash}> / </Text>
                    {session.capacity}
                  </Text>
                  {isFull ? (
                    <View style={styles.fullChip}>
                      <AlertCircle size={12} color="#ef4444" />
                      <Text style={styles.fullChipText}>
                        {t("sessions.full")}
                      </Text>
                    </View>
                  ) : spotsLeft !== null && spotsLeft <= 5 ? (
                    <Text style={styles.spotsLeftText}>
                      {t("sessions.spotsLeft", { count: spotsLeft })}
                    </Text>
                  ) : null}
                </View>
                {/* Progress bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${capacityPercent}%`,
                        backgroundColor: isFull
                          ? "#ef4444"
                          : capacityPercent >= 75
                            ? "#f97316"
                            : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>

          {/* ── Tags ── */}
          {session.tags && session.tags.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Tag size={16} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Tags</Text>
              </View>
              <View style={styles.tagsContainer}>
                {session.tags.map((tag, i) => (
                  <View key={i} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Description ── */}
          {session.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t("sessions.description")}
              </Text>
              <Text style={styles.descriptionText}>{session.description}</Text>
            </View>
          )}

          {/* ── Workouts ── */}
          {session.workouts && session.workouts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Dumbbell size={16} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>{t("sessions.workout")}</Text>
              </View>
              {session.workouts.map((sw) => (
                <View key={sw.id} style={styles.workoutCard}>
                  <Text style={styles.workoutName}>{sw.workout.name}</Text>
                  {sw.workout.description && (
                    <Text style={styles.workoutDesc}>
                      {sw.workout.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* ── Attendees (coach/owner only) ── */}
          {canEditSessions &&
            session.bookings &&
            session.bookings.length > 0 && (
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.attendeesToggle}
                  onPress={() => setShowAttendees(!showAttendees)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionHeader}>
                    <Users size={16} color={theme.colors.primary} />
                    <Text style={styles.sectionTitle}>
                      {t("sessions.attendees")} ({session.bookings.length})
                    </Text>
                  </View>
                  {showAttendees ? (
                    <ChevronUp size={18} color={theme.colors.textSecondary} />
                  ) : (
                    <ChevronDown size={18} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>

                {showAttendees && (
                  <View style={styles.attendeesList}>
                    {session.bookings.map((booking) => (
                      <View key={booking.id} style={styles.attendeeRow}>
                        <View style={styles.attendeeAvatar}>
                          <Text style={styles.attendeeInitial}>
                            {(
                              booking.user?.name?.[0] ||
                              booking.guestName?.[0] ||
                              "?"
                            ).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.attendeeInfo}>
                          <Text style={styles.attendeeName}>
                            {booking.user?.name ||
                              booking.guestName ||
                              "Unknown"}
                          </Text>
                          {booking.guestEmail && (
                            <Text style={styles.attendeeEmail}>
                              {booking.guestEmail}
                            </Text>
                          )}
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            booking.status === "ATTENDED" &&
                              styles.statusAttended,
                            booking.status === "BOOKED" && styles.statusBooked,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              booking.status === "ATTENDED" &&
                                styles.statusTextAttended,
                              booking.status === "BOOKED" &&
                                styles.statusTextBooked,
                            ]}
                          >
                            {booking.status}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

          {/* Bottom spacer for action bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Fixed Action Bar ── */}
        {!isPast && (
          <View style={styles.actionBar}>
            {/* Book */}
            {canBook && onBook && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={onBook}
                disabled={bookingInProgress}
                activeOpacity={0.7}
              >
                {bookingInProgress ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.bookButtonText}>
                    {t("sessions.book")}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {/* No subscription message */}
            {!!userId &&
              !hasActiveSubscription &&
              !session.isBooked &&
              !canEditSessions && (
                <View style={styles.noSubMessage}>
                  <AlertCircle size={14} color="#f97316" />
                  <Text style={styles.noSubMessageText}>
                    {t("sessions.noSubscription")}
                  </Text>
                </View>
              )}

            {/* Full message */}
            {!!userId &&
              hasActiveSubscription &&
              !session.isBooked &&
              isFull && (
                <View style={styles.noSubMessage}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.noSubMessageText}>
                    {t("sessions.sessionFull")}
                  </Text>
                </View>
              )}

            {/* Cancel booking */}
            {canCancel && onCancelBooking && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancelBooking}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>
                  {t("sessions.cancelBooking")}
                </Text>
              </TouchableOpacity>
            )}

            {/* Edit */}
            {canEditSessions && onEdit && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <Pencil size={16} color={theme.colors.primary} />
                <Text style={styles.editButtonText}>
                  {t("sessions.editSession")}
                </Text>
              </TouchableOpacity>
            )}

            {/* Delete */}
            {isOwnerOrAdmin && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // ── Nav Header ──
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: Platform.OS === "ios" ? 56 : 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  navSpacer: {
    width: 40,
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginHorizontal: theme.spacing.sm,
  },

  // ── Scroll ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  // ── Hero Section ──
  heroSection: {
    marginBottom: theme.spacing.lg,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recurringBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.primary + "15",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  recurringBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  bookedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bookedBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16a34a",
  },
  pastBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pastBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    lineHeight: 30,
  },

  // ── Info Cards ──
  infoCardsGrid: {
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  infoCardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  durationChip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },

  // ── Coach ──
  coachInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  coachInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  coachName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },

  // ── Capacity ──
  capacityNumbers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  capacityMain: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
  },
  capacitySlash: {
    color: theme.colors.textSecondary,
    fontWeight: "400",
  },
  fullChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef2f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  fullChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ef4444",
  },
  spotsLeftText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f97316",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },

  // ── Sections ──
  section: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },

  // ── Tags ──
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    backgroundColor: theme.colors.primary + "10",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },

  // ── Description ──
  descriptionText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginTop: 10,
  },

  // ── Workouts ──
  workoutCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  workoutName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  workoutDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // ── Attendees ──
  attendeesToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attendeesList: {
    marginTop: 12,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  attendeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  attendeeInitial: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  attendeeEmail: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.colors.background,
  },
  statusBooked: {
    backgroundColor: "#dbeafe",
  },
  statusAttended: {
    backgroundColor: "#dcfce7",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statusTextBooked: {
    color: "#3b82f6",
  },
  statusTextAttended: {
    color: "#16a34a",
  },

  // ── Action Bar ──
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bookButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  noSubMessage: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff7ed",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  noSubMessageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#9a3412",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    justifyContent: "center",
    alignItems: "center",
  },
});
