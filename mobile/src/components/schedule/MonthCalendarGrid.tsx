import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "@/src/constants/theme";

interface MonthCalendarGridProps {
  currentMonth: Date;
  selectedDay: Date;
  activitiesByDay: Record<string, number>;
  onDaySelect: (day: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const WEEKDAYS: Record<string, string[]> = {
  pt: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  fr: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  it: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
};

const MONTH_NAMES: Record<string, string[]> = {
  pt: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  es: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  fr: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  de: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  it: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCalendarDays(currentMonth: Date): Date[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Start of calendar (Monday-based week)
  let dayOfWeek = firstDay.getDay(); // 0=Sun, 1=Mon, ...
  // Convert to Mon=0, Tue=1, ... Sun=6
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const calendarStart = new Date(firstDay);
  calendarStart.setDate(calendarStart.getDate() - dayOfWeek);

  // End of calendar (fill to complete last week)
  let endDayOfWeek = lastDay.getDay();
  endDayOfWeek = endDayOfWeek === 0 ? 6 : endDayOfWeek - 1;

  const calendarEnd = new Date(lastDay);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - endDayOfWeek));

  const days: Date[] = [];
  const current = new Date(calendarStart);
  while (current <= calendarEnd) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function MonthCalendarGrid({
  currentMonth,
  selectedDay,
  activitiesByDay,
  onDaySelect,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: MonthCalendarGridProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const weekDays = WEEKDAYS[lang] || WEEKDAYS.en;
  const monthNames = MONTH_NAMES[lang] || MONTH_NAMES.en;

  const today = useMemo(() => new Date(), []);

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  );

  const monthLabel = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <View style={styles.container}>
      {/* Header with navigation */}
      <View style={styles.navRow}>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={onPreviousMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onToday}
            style={styles.todayButton}
            activeOpacity={0.7}
          >
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.todayText}>{t("schedule.today")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNextMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekdayRow}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.daysGrid}>
        {calendarDays.map((day) => {
          const dayKey = formatDayKey(day);
          const count = activitiesByDay[dayKey] || 0;
          const isSelected = isSameDay(day, selectedDay);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <TouchableOpacity
              key={dayKey}
              onPress={() => onDaySelect(day)}
              activeOpacity={0.6}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                !isCurrentMonth && styles.dayCellOutside,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.dayTextToday,
                  isSelected && styles.dayTextSelected,
                  !isCurrentMonth && styles.dayTextOutside,
                ]}
              >
                {day.getDate()}
              </Text>

              {/* Activity dots */}
              {count > 0 && (
                <View style={styles.dotsRow}>
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        isSelected ? styles.dotSelected : styles.dotDefault,
                      ]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: "600",
    color: colors.text,
  },
  navButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  navButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  todayText: {
    fontSize: typography.fontSize.sm,
    fontWeight: "500",
    color: colors.primary,
  },
  weekdayRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  weekdayText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  dayCell: {
    width: `${100 / 7}%` as unknown as number,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    position: "relative",
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  dayCellOutside: {
    opacity: 0.35,
  },
  dayText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  dayTextToday: {
    fontWeight: "700",
    color: colors.primary,
  },
  dayTextSelected: {
    fontWeight: "700",
    color: colors.primary,
  },
  dayTextOutside: {
    color: colors.textSecondary,
  },
  dotsRow: {
    flexDirection: "row",
    position: "absolute",
    bottom: 4,
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotDefault: {
    backgroundColor: colors.primary,
  },
  dotSelected: {
    backgroundColor: colors.primary,
  },
});
