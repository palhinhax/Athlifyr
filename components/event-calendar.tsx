"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface EventParticipation {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: Date | string;
    city: string;
    country: string;
    sportTypes: string[];
  };
  variant?: {
    name: string;
    distanceKm: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  } | null;
}

interface VenueSessionBooking {
  id: string;
  session: {
    id: string;
    title: string;
    startsAt: Date | string;
    endsAt: Date | string;
    venue: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
    };
  };
}

type CalendarItem =
  | { type: "event"; data: EventParticipation }
  | { type: "session"; data: VenueSessionBooking };

interface EventCalendarProps {
  participations: EventParticipation[];
  sessionBookings?: VenueSessionBooking[];
}

export function EventCalendar({
  participations,
  sessionBookings = [],
}: EventCalendarProps) {
  const t = useTranslations("profile");
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get month and weekday names from translations
  const MONTHS = [
    t("months.january"),
    t("months.february"),
    t("months.march"),
    t("months.april"),
    t("months.may"),
    t("months.june"),
    t("months.july"),
    t("months.august"),
    t("months.september"),
    t("months.october"),
    t("months.november"),
    t("months.december"),
  ];

  const WEEKDAYS = [
    t("weekdays.sun"),
    t("weekdays.mon"),
    t("weekdays.tue"),
    t("weekdays.wed"),
    t("weekdays.thu"),
    t("weekdays.fri"),
    t("weekdays.sat"),
  ];

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  // Get events for current month - use variant date if available, otherwise event date
  const eventsInMonth = participations.filter((p) => {
    // Use variant date if variant exists and has a valid startDate
    const eventDate =
      p.variant?.startDate && p.variant.startDate !== null
        ? new Date(p.variant.startDate)
        : new Date(p.event.startDate);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear &&
      p.status === "going"
    );
  });

  // Get session bookings for current month
  const sessionsInMonth = sessionBookings.filter((b) => {
    const sessionDate = new Date(b.session.startsAt);
    return (
      sessionDate.getMonth() === currentMonth &&
      sessionDate.getFullYear() === currentYear
    );
  });

  // Create a map of dates to items (events + sessions)
  const itemsByDate = new Map<number, CalendarItem[]>();

  // Add events
  eventsInMonth.forEach((p) => {
    // Use variant date if variant exists and has a valid startDate
    const eventDate =
      p.variant?.startDate && p.variant.startDate !== null
        ? new Date(p.variant.startDate)
        : new Date(p.event.startDate);
    const day = eventDate.getDate();
    if (!itemsByDate.has(day)) {
      itemsByDate.set(day, []);
    }
    itemsByDate.get(day)!.push({ type: "event", data: p });
  });

  // Add session bookings
  sessionsInMonth.forEach((b) => {
    const sessionDate = new Date(b.session.startsAt);
    const day = sessionDate.getDate();
    if (!itemsByDate.has(day)) {
      itemsByDate.set(day, []);
    }
    itemsByDate.get(day)!.push({ type: "session", data: b });
  });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return (
      date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          {t("calendar")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {t("myEventCalendar")}
          </DialogTitle>
        </DialogHeader>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={goToToday}
            >
              {t("goToToday")}
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayItems = day ? itemsByDate.get(day) : null;
            const hasItems = dayItems && dayItems.length > 0;

            return (
              <div
                key={index}
                className={cn(
                  "relative flex min-h-[48px] flex-col items-center justify-start rounded-md p-1",
                  day && "hover:bg-muted/50",
                  isToday(day!) && "bg-primary/10 font-bold",
                  day && isPast(day) && !hasItems && "text-muted-foreground/50"
                )}
              >
                {day && (
                  <>
                    <span
                      className={cn(
                        "text-sm",
                        isToday(day) &&
                          "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      )}
                    >
                      {day}
                    </span>
                    {hasItems && (
                      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                        {dayItems
                          .slice(0, 3)
                          .map((item: CalendarItem, i: number) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                item.type === "session"
                                  ? "bg-blue-500"
                                  : isPast(day)
                                    ? "bg-green-500"
                                    : "bg-primary"
                              )}
                            />
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Events and Sessions List for Current Month */}
        {eventsInMonth.length > 0 || sessionsInMonth.length > 0 ? (
          <div className="mt-4 max-h-[200px] space-y-2 overflow-y-auto border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t("eventsInMonth", { month: MONTHS[currentMonth] })}
            </h4>
            {/* Combine and sort all items */}
            {[
              ...eventsInMonth.map((p) => ({
                type: "event" as const,
                data: p,
                date:
                  p.variant?.startDate && p.variant.startDate !== null
                    ? new Date(p.variant.startDate)
                    : new Date(p.event.startDate),
              })),
              ...sessionsInMonth.map((b) => ({
                type: "session" as const,
                data: b,
                date: new Date(b.session.startsAt),
              })),
            ]
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((item) => {
                const isPastEvent = item.date < today;

                if (item.type === "event") {
                  const p = item.data;
                  return (
                    <Link
                      key={`event-${p.id}`}
                      href={`/events/${p.event.slug}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className={cn(
                          "rounded-md border p-2 transition-colors hover:bg-muted",
                          isPastEvent && "border-green-500/30 bg-green-500/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {p.event.title}
                              {p.variant && (
                                <span className="font-normal text-muted-foreground">
                                  {" "}
                                  • {p.variant.name}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.date.getDate()}{" "}
                              {MONTHS[item.date.getMonth()]}
                              {p.variant?.startTime &&
                                ` ${t("at")} ${p.variant.startTime}`}{" "}
                              • {p.event.city}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                              isPastEvent
                                ? "bg-green-500/10 text-green-600"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {isPastEvent ? t("went") : t("going")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  // Session booking
                  const b = item.data;
                  const sessionTime = item.date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <Link
                      key={`session-${b.id}`}
                      href={`/venues/${b.session.venue.slug}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className={cn(
                          "rounded-md border p-2 transition-colors hover:bg-muted",
                          "border-blue-500/30 bg-blue-500/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {b.session.title}
                              <span className="font-normal text-muted-foreground">
                                {" "}
                                • {b.session.venue.name}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.date.getDate()}{" "}
                              {MONTHS[item.date.getMonth()]}
                              {` ${t("at")} ${sessionTime}`}
                              {b.session.venue.city &&
                                ` • ${b.session.venue.city}`}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                            {t("booked")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
          </div>
        ) : (
          <div className="mt-4 border-t pt-4 text-center text-sm text-muted-foreground">
            {t("noEventsInMonth", { month: MONTHS[currentMonth] })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>{t("going")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>{t("went")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>{t("booked")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
