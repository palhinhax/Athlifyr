"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface MonthCalendarViewProps {
  currentDate: Date;
  selectedDay: Date;
  locale: string;
  sessionsByDay: Record<string, number>;
  onDaySelect: (day: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function MonthCalendarView({
  currentDate,
  selectedDay,
  locale,
  sessionsByDay,
  onDaySelect,
  onPrevious,
  onNext,
  onToday,
}: MonthCalendarViewProps) {
  const t = useTranslations("venues.sessions");
  const dateLocale = localeMap[locale] || enUS;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDaysLocalized: Record<string, string[]> = {
    pt: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    fr: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    it: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
  };

  const localizedWeekDays = weekDaysLocalized[locale] || weekDaysLocalized.en;

  return (
    <div className="rounded-lg border bg-card">
      {/* Header with navigation */}
      <div className="flex items-center justify-between border-b p-2 md:p-4">
        <h3 className="text-base font-semibold md:text-lg">
          {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
        </h3>

        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            <CalendarIcon className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">{t("today")}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-2 md:p-4">
        {/* Week day headers */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {localizedWeekDays.map((day) => (
            <div
              key={day}
              className="py-1 text-center text-xs font-medium text-muted-foreground md:py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const sessionCount = sessionsByDay[dayKey] || 0;
            const isSelected = isSameDay(day, selectedDay);
            const isCurrentMonth =
              day.getMonth() === currentDate.getMonth() &&
              day.getFullYear() === currentDate.getFullYear();
            const isTodayDate = isToday(day);

            return (
              <button
                key={dayKey}
                onClick={() => onDaySelect(day)}
                className={cn(
                  "relative flex min-h-[45px] flex-col items-center justify-center rounded-md p-1.5 text-sm transition-colors md:min-h-[50px] md:p-2",
                  "hover:bg-accent",
                  isSelected &&
                    "border-2 border-green-600 bg-green-50 ring-2 ring-green-600 ring-offset-2",
                  !isCurrentMonth && "text-muted-foreground opacity-40",
                  isTodayDate && "font-bold"
                )}
              >
                <span className={cn("text-xs md:text-sm")}>
                  {format(day, "d")}
                </span>

                {/* Session indicators */}
                {sessionCount > 0 && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {Array.from({ length: Math.min(sessionCount, 3) }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-0.5 w-0.5 rounded-full md:h-1 md:w-1",
                            isSelected ? "bg-green-600" : "bg-primary"
                          )}
                        />
                      )
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
