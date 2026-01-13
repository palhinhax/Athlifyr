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
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    sportType: string;
  };
  variant?: {
    name: string;
    distanceKm: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  } | null;
}

interface EventCalendarProps {
  participations: EventParticipation[];
}

const MONTHS = [
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
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function EventCalendar({ participations }: EventCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  // Get events for current month - use variant date if available, otherwise event date
  const eventsInMonth = participations.filter((p) => {
    const eventDate = p.variant?.startDate
      ? new Date(p.variant.startDate)
      : new Date(p.event.startDate);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear &&
      p.status === "going"
    );
  });

  // Create a map of dates to events
  const eventsByDate = new Map<number, EventParticipation[]>();
  eventsInMonth.forEach((p) => {
    const eventDate = p.variant?.startDate
      ? new Date(p.variant.startDate)
      : new Date(p.event.startDate);
    const day = eventDate.getDate();
    if (!eventsByDate.has(day)) {
      eventsByDate.set(day, []);
    }
    eventsByDate.get(day)!.push(p);
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
          Calendário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />O Meu Calendário de Eventos
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
              Ir para hoje
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
            const dayEvents = day ? eventsByDate.get(day) : null;
            const hasEvents = dayEvents && dayEvents.length > 0;

            return (
              <div
                key={index}
                className={cn(
                  "relative flex min-h-[48px] flex-col items-center justify-start rounded-md p-1",
                  day && "hover:bg-muted/50",
                  isToday(day!) && "bg-primary/10 font-bold",
                  day && isPast(day) && !hasEvents && "text-muted-foreground/50"
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
                    {hasEvents && (
                      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              isPast(day) ? "bg-green-500" : "bg-primary"
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

        {/* Events List for Current Month */}
        {eventsInMonth.length > 0 ? (
          <div className="mt-4 max-h-[200px] space-y-2 overflow-y-auto border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Eventos em {MONTHS[currentMonth]}:
            </h4>
            {eventsInMonth
              .sort((a, b) => {
                const dateA = a.variant?.startDate
                  ? new Date(a.variant.startDate)
                  : new Date(a.event.startDate);
                const dateB = b.variant?.startDate
                  ? new Date(b.variant.startDate)
                  : new Date(b.event.startDate);
                return dateA.getTime() - dateB.getTime();
              })
              .map((p) => {
                const eventDate = p.variant?.startDate
                  ? new Date(p.variant.startDate)
                  : new Date(p.event.startDate);
                const isPastEvent = eventDate < today;
                return (
                  <Link
                    key={p.id}
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
                            {eventDate.getDate()} {MONTHS[eventDate.getMonth()]}
                            {p.variant?.startTime &&
                              ` às ${p.variant.startTime}`}{" "}
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
                          {isPastEvent ? "Fui" : "Vou"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        ) : (
          <div className="mt-4 border-t pt-4 text-center text-sm text-muted-foreground">
            Sem eventos marcados em {MONTHS[currentMonth]}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Vou</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Fui</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
