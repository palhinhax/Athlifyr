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
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  X,
  Clock,
  Users,
  UserCircle,
  CheckCircle,
  Dumbbell,
  Tag,
  Pencil,
  Trash2,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { VenueSession } from "@/src/hooks/useVenueSessions";

// ── Helpers ────────────────────────────────────────────────────────────

function formatSessionTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
  userId?: string;
  hasActiveSubscription: boolean;
  isOwnerOrAdmin: boolean;
  canEditSessions: boolean;
  onBook?: (sessionId: string) => void;
  onCancelBooking?: (bookingId: string, sessionId: string) => void;
  onEdit?: (session: VenueSession) => void;
  onDelete?: (session: VenueSession) => void;
  bookingInProgress?: string | null;
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
  const isBooking = bookingInProgress === session.id;

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
            onPress: () => {
              onDelete?.(session);
              onClose();
            },
          },
        ]
      );
    } else {
      Alert.alert(t("sessions.deleteSession"), t("sessions.confirmDelete"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("sessions.deleteSession"),
          style: "destructive",
          onPress: () => {
            onDelete?.(session);
            onClose();
          },
        },
      ]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: typeColor + "20" },
                ]}
              >
                <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                  {session.type === "CLASS"
                    ? t("sessions.class")
                    : t("sessions.appointment")}
                </Text>
              </View>
              {session.isBooked && (
                <View style={styles.bookedBadge}>
                  <CheckCircle size={12} color="#16a34a" />
                  <Text style={styles.bookedBadgeText}>
                    {t("sessions.booked")}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.title}>{session.title}</Text>

            {/* Time */}
            <View style={styles.infoRow}>
              <Clock size={16} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>
                {formatSessionTime(session.startsAt)} –{" "}
                {formatSessionTime(session.endsAt)} (
                {t("sessions.duration", { count: duration })})
              </Text>
            </View>

            {/* Coach */}
            {session.coach?.user?.name && (
              <View style={styles.infoRow}>
                <UserCircle size={16} color={theme.colors.textSecondary} />
                <Text style={styles.infoText}>
                  {t("sessions.coach")}: {session.coach.user.name}
                </Text>
              </View>
            )}

            {/* Capacity */}
            {session.capacity && (
              <View style={styles.infoRow}>
                <Users size={16} color={theme.colors.textSecondary} />
                <Text style={styles.infoText}>
                  {t("sessions.capacity")}: {bookings}/{session.capacity}
                  {isFull
                    ? ` – ${t("sessions.full")}`
                    : spotsLeft !== null && spotsLeft <= 3
                      ? ` – ${t("sessions.spotsLeft", { count: spotsLeft })}`
                      : ""}
                </Text>
              </View>
            )}

            {/* Tags */}
            {session.tags && session.tags.length > 0 && (
              <View style={styles.infoRow}>
                <Tag size={16} color={theme.colors.textSecondary} />
                <View style={styles.tagsContainer}>
                  {session.tags.map((tag, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Description */}
            {session.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t("sessions.description")}
                </Text>
                <Text style={styles.descriptionText}>
                  {session.description}
                </Text>
              </View>
            )}

            {/* Workouts */}
            {session.workouts && session.workouts.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Dumbbell size={16} color={theme.colors.primary} />
                  <Text style={styles.sectionTitle}>
                    {t("sessions.workout")}
                  </Text>
                </View>
                {session.workouts.map((sw) => (
                  <View key={sw.id} style={styles.workoutCard}>
                    <Text style={styles.workoutName}>{sw.workout.name}</Text>
                    {sw.workout.description && (
                      <Text style={styles.workoutDesc} numberOfLines={3}>
                        {sw.workout.description}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Attendees (for coach/owner) */}
            {canEditSessions &&
              session.bookings &&
              session.bookings.length > 0 && (
                <View style={styles.section}>
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => setShowAttendees(!showAttendees)}
                  >
                    <Users size={16} color={theme.colors.primary} />
                    <Text style={styles.sectionTitle}>
                      {t("sessions.attendees")} ({session.bookings.length})
                    </Text>
                  </TouchableOpacity>
                  {showAttendees &&
                    session.bookings.map((booking) => (
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
                        <Text style={styles.attendeeName}>
                          {booking.user?.name || booking.guestName || "Unknown"}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            booking.status === "ATTENDED" &&
                              styles.statusAttended,
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {booking.status}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}
          </ScrollView>

          {/* Action bar */}
          {!isPast && (
            <View style={styles.actionBar}>
              {/* Book */}
              {canBook && onBook && (
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => {
                    onBook(session.id);
                    onClose();
                  }}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.bookButtonText}>
                      {t("sessions.book")}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {/* Cancel booking */}
              {canCancel && onCancelBooking && session.userBookingId && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    Alert.alert(
                      t("sessions.cancelBooking"),
                      t("sessions.confirmCancel"),
                      [
                        { text: t("common.cancel"), style: "cancel" },
                        {
                          text: t("sessions.cancelBooking"),
                          style: "destructive",
                          onPress: () => {
                            onCancelBooking(session.userBookingId!, session.id);
                            onClose();
                          },
                        },
                      ]
                    );
                  }}
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
                  onPress={() => {
                    onEdit(session);
                    onClose();
                  }}
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
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 34, // safe area
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bookedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bookedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16a34a",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  tag: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  section: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  workoutCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  workoutName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  workoutDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  attendeeAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  attendeeInitial: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  attendeeName: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
  },
  statusAttended: {
    backgroundColor: "#dcfce7",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bookButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    justifyContent: "center",
    alignItems: "center",
  },
});
