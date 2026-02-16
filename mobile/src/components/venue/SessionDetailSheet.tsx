import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
} from "lucide-react-native";
import { format, parseISO } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { theme } from "@/src/constants/theme";
import type {
  VenueSession,
  WorkoutExercise,
} from "@/src/hooks/useVenueSessions";

const dateFnsLocaleMap: Record<string, Locale> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

// ── Helpers ────────────────────────────────────────────────────────────

function formatSessionTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatSessionDate(dateStr: string, locale: Locale): string {
  return format(parseISO(dateStr), "EEEE, d MMMM yyyy", { locale });
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

// Returns a color between green (#22c55e) → orange (#f97316) → red (#ef4444)
function getCapacityColor(percent: number): string {
  if (percent >= 100) return "#ef4444";
  if (percent >= 75) {
    // Orange → Red (75-100%)
    const t = (percent - 75) / 25;
    const r = Math.round(249 + (239 - 249) * t);
    const g = Math.round(115 + (68 - 115) * t);
    const b = Math.round(22 + (68 - 22) * t);
    return `rgb(${r},${g},${b})`;
  }
  if (percent >= 40) {
    // Green → Orange (40-75%)
    const t = (percent - 40) / 35;
    const r = Math.round(34 + (249 - 34) * t);
    const g = Math.round(197 + (115 - 197) * t);
    const b = Math.round(94 + (22 - 94) * t);
    return `rgb(${r},${g},${b})`;
  }
  // Green (0-40%)
  return "#22c55e";
}

// Format exercise prescription into a compact string (e.g. "3x 10 @ 60kg")
function formatExercisePrescription(ex: WorkoutExercise): string {
  const parts: string[] = [];

  if (ex.prescribedSets) {
    parts.push(`${ex.prescribedSets}x`);
  }

  if (ex.prescribedReps) {
    parts.push(`${ex.prescribedReps}`);
  }

  if (ex.prescribedWeight) {
    const unit = ex.prescribedWeightUnit || "kg";
    parts.push(`@ ${ex.prescribedWeight}${unit}`);
  }

  if (ex.prescribedDistance) {
    const unit = ex.prescribedDistanceUnit || "m";
    parts.push(`${ex.prescribedDistance}${unit}`);
  }

  if (ex.prescribedTime) {
    if (ex.prescribedTime >= 60) {
      const mins = Math.floor(ex.prescribedTime / 60);
      const secs = ex.prescribedTime % 60;
      parts.push(
        secs > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${mins} min`
      );
    } else {
      parts.push(`${ex.prescribedTime}s`);
    }
  }

  if (ex.prescribedCalories) {
    parts.push(`${ex.prescribedCalories} cal`);
  }

  return parts.join(" ") || "";
}

// Format block type into a readable label using translations
function formatBlockType(type: string, t: (key: string) => string): string {
  const key = `workouts.blocks.${type}`;
  const translated = t(key);
  // If translation returns the key itself, fall back to the raw type
  return translated !== key ? translated : type;
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
  const { t, i18n } = useTranslation();
  const dateLocale = dateFnsLocaleMap[i18n.language] || enUS;
  const [showAttendees, setShowAttendees] = useState(false);

  // Debug logging to check if workouts data is present
  useEffect(() => {
    if (session) {
      console.log("SessionDetailSheet - session workouts:", session.workouts);
      console.log(
        "SessionDetailSheet - full session:",
        JSON.stringify(session, null, 2)
      );
    }
  }, [session]);

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
    onDelete?.();
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
                {formatSessionDate(session.startsAt, dateLocale)}
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
                  {session.coach.user.image ? (
                    <Image
                      source={{ uri: session.coach.user.image }}
                      style={styles.coachAvatarImage}
                      accessible
                      accessibilityLabel={session.coach.user.name || ""}
                      alt={session.coach.user.name || ""}
                    />
                  ) : (
                    <View style={styles.coachAvatar}>
                      <Text style={styles.coachInitial}>
                        {session.coach.user.name[0]?.toUpperCase() || "?"}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.coachName}>
                    {session.coach.user.name}
                  </Text>
                </View>
              </View>
            )}

            {/* Capacity Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Users size={18} color={theme.colors.primary} />
                <Text style={styles.infoCardLabel}>
                  {session.capacity
                    ? t("sessions.capacity")
                    : t("sessions.attendees")}
                </Text>
              </View>
              <View style={styles.capacityNumbers}>
                {session.capacity ? (
                  <Text style={styles.capacityMain}>
                    {bookings}
                    <Text style={styles.capacitySlash}> / </Text>
                    {session.capacity}
                  </Text>
                ) : (
                  <Text style={styles.capacityMain}>{bookings}</Text>
                )}
                {isFull ? (
                  <View style={styles.fullChip}>
                    <AlertCircle size={12} color="#ef4444" />
                    <Text style={styles.fullChipText}>
                      {t("sessions.full")}
                    </Text>
                  </View>
                ) : spotsLeft !== null ? (
                  <Text style={styles.spotsLeftText}>
                    {t("sessions.spotsLeft", { count: spotsLeft })}
                  </Text>
                ) : null}
              </View>
              {/* Gradient progress bar (only when capacity is set) */}
              {session.capacity && (
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${capacityPercent}%`,
                        backgroundColor: getCapacityColor(capacityPercent),
                      },
                    ]}
                  />
                </View>
              )}
            </View>
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
                  {/* Workout Header */}
                  <View style={workoutStyles.workoutHeader}>
                    <Text style={workoutStyles.workoutName}>
                      {sw.workout.name}
                    </Text>
                    {sw.workout.estimatedTime && (
                      <View style={workoutStyles.workoutTimeBadge}>
                        <Clock size={12} color={theme.colors.textSecondary} />
                        <Text style={workoutStyles.workoutTimeBadgeText}>
                          {sw.workout.estimatedTime} min
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Difficulty */}
                  {sw.workout.difficulty && (
                    <View style={workoutStyles.difficultyRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            workoutStyles.difficultyBar,
                            {
                              backgroundColor:
                                i < Number(sw.workout.difficulty)
                                  ? theme.colors.primary
                                  : theme.colors.border,
                            },
                          ]}
                        />
                      ))}
                      <Text style={workoutStyles.difficultyLabel}>
                        {t(
                          `workouts.difficultyLevels.${sw.workout.difficulty}`
                        )}
                      </Text>
                    </View>
                  )}

                  {/* Description */}
                  {sw.workout.description && (
                    <Text style={styles.workoutDesc}>
                      {sw.workout.description}
                    </Text>
                  )}

                  {/* Workout Blocks */}
                  {sw.workout.blocks && sw.workout.blocks.length > 0 && (
                    <View style={workoutStyles.blocksContainer}>
                      {sw.workout.blocks.map((block) => (
                        <View key={block.id} style={workoutStyles.blockCard}>
                          {/* Block Header */}
                          <View style={workoutStyles.blockHeader}>
                            <View style={workoutStyles.blockTypeBadge}>
                              <Text style={workoutStyles.blockTypeBadgeText}>
                                {formatBlockType(block.type, t)}
                              </Text>
                            </View>
                            {block.name && (
                              <Text style={workoutStyles.blockName}>
                                {block.name}
                              </Text>
                            )}
                            {block.timeCap && (
                              <Text style={workoutStyles.blockMeta}>
                                ({Math.floor(block.timeCap / 60)} min)
                              </Text>
                            )}
                            {block.rounds && (
                              <Text style={workoutStyles.blockMeta}>
                                ({block.rounds}{" "}
                                {block.rounds === 1 ? "round" : "rounds"})
                              </Text>
                            )}
                          </View>

                          {/* Block Notes */}
                          {block.notes && (
                            <Text style={workoutStyles.blockNotes}>
                              {block.notes}
                            </Text>
                          )}

                          {/* Exercises */}
                          {block.exercises && block.exercises.length > 0 && (
                            <View style={workoutStyles.exercisesList}>
                              {block.exercises.map((ex) => (
                                <View
                                  key={ex.id}
                                  style={workoutStyles.exerciseRow}
                                >
                                  <View style={workoutStyles.exerciseDot} />
                                  {formatExercisePrescription(ex) !== "" && (
                                    <Text
                                      style={workoutStyles.exercisePrescription}
                                    >
                                      {formatExercisePrescription(ex)}
                                    </Text>
                                  )}
                                  <Text style={workoutStyles.exerciseName}>
                                    {ex.exercise.name}
                                  </Text>
                                  {ex.notes && (
                                    <Text style={workoutStyles.exerciseNotes}>
                                      ({ex.notes})
                                    </Text>
                                  )}
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
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
                onPress={() => {
                  onBook();
                  onClose();
                }}
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
                onPress={() => {
                  onCancelBooking();
                  onClose();
                }}
                disabled={bookingInProgress}
                activeOpacity={0.7}
              >
                {bookingInProgress ? (
                  <ActivityIndicator size="small" color={theme.colors.text} />
                ) : (
                  <Text style={styles.cancelButtonText}>
                    {t("sessions.cancelBooking")}
                  </Text>
                )}
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
  coachAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  workoutDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
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

// ── Workout Detail Styles (split to avoid TS inference limit) ──────────

const workoutStyles = StyleSheet.create({
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    flex: 1,
  },
  workoutTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  workoutTimeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  difficultyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 8,
  },
  difficultyBar: {
    height: 4,
    width: 20,
    borderRadius: 2,
  },
  difficultyLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  blocksContainer: {
    gap: 10,
    marginTop: 10,
  },
  blockCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  blockTypeBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  blockTypeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  blockName: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  blockMeta: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  blockNotes: {
    fontSize: 12,
    fontStyle: "italic",
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  exercisesList: {
    gap: 4,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    paddingVertical: 2,
  },
  exerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  exercisePrescription: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  exerciseName: {
    fontSize: 13,
    color: theme.colors.text,
  },
  exerciseNotes: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
