import { View, Text, StyleSheet } from "react-native";
import { CalendarClock, MapPin, Clock, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
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

interface DayDetailPanelProps {
  selectedDay: Date;
  sessions: ScheduleSession[];
  events: ScheduleEvent[];
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSelectedDayLabel(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function DayDetailPanel({
  selectedDay,
  sessions,
  events,
}: DayDetailPanelProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
  };

  const dateLocale = localeMap[lang] || "en-US";
  const dayLabel = formatSelectedDayLabel(selectedDay, dateLocale);

  const isEmpty = sessions.length === 0 && events.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.dayTitle}>{dayLabel}</Text>

      {isEmpty && (
        <View style={styles.emptyState}>
          <CalendarClock
            size={40}
            color={colors.textSecondary}
            style={{ opacity: 0.4 }}
          />
          <Text style={styles.emptyText}>
            {t("schedule.noActivitiesThisDay")}
          </Text>
        </View>
      )}

      {/* Events for selected day */}
      {events.map((event) => (
        <View key={event.id} style={[styles.card, styles.eventCard]}>
          <View style={styles.cardHeader}>
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

      {/* Sessions for selected day */}
      {sessions.map((session) => (
        <View key={session.id} style={styles.card}>
          <View style={styles.cardHeader}>
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
              {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  dayTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
    textTransform: "capitalize",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: spacing.sm,
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
});
