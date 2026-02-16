import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  Clock,
  Users,
  CheckCircle,
  Pencil,
  Trash2,
  UserCircle,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { VenueSession } from "@/src/hooks/useVenueSessions";

// ── Helpers ────────────────────────────────────────────────────────────

function formatSessionTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

function getDurationMinutes(startsAt: string, endsAt: string): number {
  return Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000
  );
}

// ── Props ──────────────────────────────────────────────────────────────

interface SessionCardProps {
  session: VenueSession;
  userId?: string | null;
  hasActiveSubscription: boolean;
  isOwnerOrAdmin: boolean;
  canEditSessions: boolean;
  onPress?: (session: VenueSession) => void;
  onBook?: () => void;
  onCancelBooking?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  bookingInProgress?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────

export function SessionCard({
  session,
  userId,
  hasActiveSubscription,
  isOwnerOrAdmin,
  canEditSessions,
  onPress,
  onBook,
  onCancelBooking,
  onEdit,
  onDelete,
  bookingInProgress,
}: SessionCardProps) {
  const { t } = useTranslation();

  const typeColor = getSessionTypeColor(session.type);
  const bookings = session._count?.bookings ?? 0;
  const isFull = session.capacity ? bookings >= session.capacity : false;
  const spotsLeft = session.capacity ? session.capacity - bookings : null;
  const isPast = new Date(session.startsAt) < new Date();
  const duration = getDurationMinutes(session.startsAt, session.endsAt);

  // Booking logic
  const canBook =
    !!userId &&
    hasActiveSubscription &&
    !session.isBooked &&
    !isFull &&
    !isPast;
  const canCancel = !!userId && !!session.isBooked && !isPast;

  const isBooking = !!bookingInProgress;

  return (
    <TouchableOpacity
      style={[styles.card, isPast && styles.cardPast]}
      activeOpacity={0.7}
      onPress={() => onPress?.(session)}
    >
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: typeColor }]} />

      <View style={styles.content}>
        {/* Row 1: Type badge + booked badge */}
        <View style={styles.topRow}>
          <View
            style={[styles.typeBadge, { backgroundColor: typeColor + "20" }]}
          >
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>
              {session.type === "CLASS"
                ? t("sessions.class")
                : t("sessions.appointment")}
            </Text>
          </View>

          <View style={styles.badgesRight}>
            {session.isBooked && (
              <View style={styles.bookedBadge}>
                <CheckCircle size={12} color="#16a34a" />
                <Text style={styles.bookedText}>{t("sessions.booked")}</Text>
              </View>
            )}
            {session.recurringSessionId && (
              <Text style={styles.recurringIcon}>🔁</Text>
            )}
          </View>
        </View>

        {/* Row 2: Title */}
        <Text style={styles.title} numberOfLines={1}>
          {session.title}
        </Text>

        {/* Row 3: Time + Duration */}
        <View style={styles.metaRow}>
          <View style={styles.timeRow}>
            <Clock size={13} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>
              {formatSessionTime(session.startsAt)} –{" "}
              {formatSessionTime(session.endsAt)}
            </Text>
          </View>
          <Text style={styles.durationText}>
            {t("sessions.duration", { count: duration })}
          </Text>
        </View>

        {/* Row 4: Coach + Capacity */}
        <View style={styles.metaRow}>
          {session.coach?.user?.name ? (
            <View style={styles.coachRow}>
              <UserCircle size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {session.coach.user.name}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {session.capacity ? (
            <View style={styles.capacityRow}>
              <Users size={13} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>
                {bookings}/{session.capacity}
              </Text>
              {isFull ? (
                <View style={styles.fullBadge}>
                  <Text style={styles.fullBadgeText}>{t("sessions.full")}</Text>
                </View>
              ) : spotsLeft !== null && spotsLeft <= 3 ? (
                <Text style={styles.spotsLeftText}>
                  {t("sessions.spotsLeft", { count: spotsLeft })}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Row 5: Action buttons */}
        {!isPast && (
          <View style={styles.actionsRow}>
            {/* Book button */}
            {canBook && onBook && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={onBook}
                disabled={isBooking}
                activeOpacity={0.7}
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

            {/* Cancel booking button */}
            {canCancel && onCancelBooking && session.userBookingId && (
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

            {/* Edit button (coach+) */}
            {canEditSessions && onEdit && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <Pencil size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            )}

            {/* Delete button (owner/admin only) */}
            {isOwnerOrAdmin && onDelete && (
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteIconButton]}
                onPress={onDelete}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Past session indicator */}
        {isPast && (
          <Text style={styles.pastText}>{t("sessions.sessionPast")}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
  },
  cardPast: {
    opacity: 0.6,
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badgesRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  bookedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16a34a",
  },
  recurringIcon: {
    fontSize: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  durationText: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  capacityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fullBadge: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fullBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ef4444",
  },
  spotsLeftText: {
    fontSize: 10,
    color: "#f97316",
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  bookButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconButton: {
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },
  pastText: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontStyle: "italic",
    marginTop: 2,
  },
});
