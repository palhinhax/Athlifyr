"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { SessionDetailsDialog } from "@/components/session-details-dialog";
import { VenueSessionModal } from "@/components/venue-session-modal";
import { SessionDeleteDialog } from "@/components/session-dialogs";
import {
  CalendarClock,
  Clock,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ExternalLink,
  MapPin,
  ArrowRight,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  addDays,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
} from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ScheduleVenue {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

interface ScheduleBooking {
  id: string;
  status: string;
  guestName?: string | null;
  guestEmail?: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface ScheduleWorkout {
  id: string;
  workout: {
    id: string;
    name: string;
    description: string | null;
    estimatedTime: number | null;
    difficulty: string | null;
  };
}

interface ScheduleSession {
  id: string;
  venueId: string;
  type: "CLASS" | "APPOINTMENT";
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  coachId: string | null;
  tags: string[];
  recurringSessionId: string | null;
  venue: ScheduleVenue;
  _count: {
    bookings: number;
  };
  bookings: ScheduleBooking[];
  workouts: ScheduleWorkout[];
  userRole?: "COACH" | "CLIENT";
  bookingId?: string;
  bookingStatus?: string;
}

interface ScheduleEvent {
  id: string;
  type: "EVENT";
  title: string;
  eventSlug: string;
  startsAt: string;
  startTime: string | null;
  city: string;
  country: string;
  sportTypes: string[];
  variantName: string | null;
  variantDistance: number | null;
  participationStatus: string;
  cancelled: boolean;
  imageUrl: string | null;
  participantCount: number;
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface MyScheduleClientProps {
  locale: string;
  userId: string;
}

export function MyScheduleClient({ locale, userId }: MyScheduleClientProps) {
  const t = useTranslations("schedule");
  const tSessions = useTranslations("venues.sessions");
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const dateLocale = localeMap[locale] || enUS;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Session details dialog state
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<ScheduleSession | null>(null);

  // Edit session modal state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<ScheduleSession | null>(
    null
  );

  // Delete session dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] =
    useState<ScheduleSession | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);

  // Calculate date ranges using date-fns for reliability
  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);

  // Fetch sessions and events
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("from", monthStart.toISOString());
      params.set("to", addDays(monthEnd, 1).toISOString());

      const response = await fetch(`/api/my-schedule?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }

      const data = await response.json();

      // Combine coach and client sessions
      const allSessions = [
        ...(data.sessions || []),
        ...(data.clientSessions || []),
      ];

      setSessions(allSessions);
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setSessions([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [monthStart, monthEnd]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Sessions and events by day for calendar indicators
  const itemsByDay = useMemo(() => {
    const map: Record<string, number> = {};

    // Add sessions
    sessions.forEach((session) => {
      const dayKey = format(parseISO(session.startsAt), "yyyy-MM-dd");
      map[dayKey] = (map[dayKey] || 0) + 1;
    });

    // Add events
    events.forEach((event) => {
      const dayKey = format(parseISO(event.startsAt), "yyyy-MM-dd");
      map[dayKey] = (map[dayKey] || 0) + 1;
    });

    return map;
  }, [sessions, events]);

  // Items for selected day
  const selectedDayItems = useMemo(() => {
    const daySessions = sessions.filter((session) =>
      isSameDay(parseISO(session.startsAt), selectedDay)
    );

    const dayEvents = events.filter((event) =>
      isSameDay(parseISO(event.startsAt), selectedDay)
    );

    // Combine and sort by time
    const combined = [
      ...daySessions.map((s) => ({
        type: "session" as const,
        item: s,
        time: parseISO(s.startsAt),
      })),
      ...dayEvents.map((e) => ({
        type: "event" as const,
        item: e,
        time: parseISO(e.startsAt),
      })),
    ].sort((a, b) => a.time.getTime() - b.time.getTime());

    return combined;
  }, [sessions, events, selectedDay]);

  // Navigation
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  // Session actions
  const handleSessionClick = (session: ScheduleSession) => {
    setSelectedSession(session);
    setSessionDetailsOpen(true);
  };

  const handleEditSession = (session: ScheduleSession) => {
    setSessionToEdit(session);
    setSessionModalOpen(true);
  };

  const handleDeleteSession = (session: ScheduleSession) => {
    setSessionToDelete(session);
    setDeleteAll(false);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    setDeleteInProgress(true);
    try {
      const url =
        deleteAll && sessionToDelete.recurringSessionId
          ? `/api/venues/${sessionToDelete.venueId}/sessions/${sessionToDelete.id}?deleteAll=true`
          : `/api/venues/${sessionToDelete.venueId}/sessions/${sessionToDelete.id}`;

      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      toast({
        title: tSessions("deleteSuccess"),
        variant: "default",
      });

      fetchSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: tCommon("error"),
        description: tSessions("deleteError"),
        variant: "destructive",
      });
    } finally {
      setDeleteInProgress(false);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
      setDeleteAll(false);
    }
  };

  // Calendar rendering
  const calendarMonthStart = startOfMonth(currentDate);
  const calendarMonthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(calendarMonthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(calendarMonthEnd, { weekStartsOn: 1 });
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

  // Count today's items
  const todayItemCount = useMemo(() => {
    const todayKey = format(new Date(), "yyyy-MM-dd");
    return itemsByDay[todayKey] || 0;
  }, [itemsByDay]);

  // Upcoming events (max 5, future only)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => parseISO(event.startsAt) > now)
      .sort(
        (a, b) =>
          parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime()
      )
      .slice(0, 5);
  }, [events]);

  // Upcoming sessions (max 5, future only)
  const upcomingSessions = useMemo(() => {
    const now = new Date();
    return sessions
      .filter((session) => parseISO(session.startsAt) > now)
      .sort(
        (a, b) =>
          parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime()
      )
      .slice(0, 5);
  }, [sessions]);

  if (loading && sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center p-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page Header */}
      <div className="mb-6 md:mb-8 md:flex md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight md:text-4xl md:font-extrabold">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="mt-4 hidden gap-3 md:flex">
          {todayItemCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold shadow-sm">
              <CalendarIcon className="h-4 w-4 text-primary" />
              {t("todaySessions", { count: todayItemCount })}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Calendar + Daily Agenda */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* Calendar */}
        <div className="order-1 xl:col-span-8">
          {/* Monthly Calendar Grid */}
          <section className="rounded-2xl border border-border/40 bg-card p-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] md:p-8">
            {/* Calendar Header */}
            <div className="mb-4 flex items-center justify-between md:mb-8">
              <h2 className="font-headline text-lg font-bold capitalize md:text-xl">
                {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
              </h2>
              <div className="flex items-center gap-2 md:rounded-lg md:bg-muted md:p-1">
                <button
                  onClick={goToPreviousMonth}
                  className="rounded-lg p-1 transition-all hover:bg-muted md:rounded-md md:p-1.5 md:hover:bg-card"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goToToday}
                  className="hidden px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground md:block"
                >
                  {t("today")}
                </button>
                <button
                  onClick={goToNextMonth}
                  className="rounded-lg p-1 transition-all hover:bg-muted md:rounded-md md:p-1.5 md:hover:bg-card"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile: Compact Calendar Grid */}
            <div className="md:hidden">
              {/* Week day headers */}
              <div className="mb-2 grid grid-cols-7 gap-1 text-center">
                {localizedWeekDays.map((day) => (
                  <span
                    key={`mobile-header-${day}`}
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Calendar days - compact */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const dayKey = format(day, "yyyy-MM-dd");
                  const itemCount = itemsByDay[dayKey] || 0;
                  const isSelected = isSameDay(day, selectedDay);
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth() &&
                    day.getFullYear() === currentDate.getFullYear();
                  const isTodayDate = isToday(day);

                  return (
                    <button
                      key={dayKey}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "relative flex aspect-square items-center justify-center text-sm transition-colors",
                        !isCurrentMonth && "text-muted-foreground/30",
                        isCurrentMonth && "font-medium",
                        isSelected &&
                          "rounded-xl bg-primary font-bold text-primary-foreground shadow-md",
                        isTodayDate && !isSelected && "font-bold",
                        !isSelected && "hover:bg-muted"
                      )}
                    >
                      {format(day, "d")}
                      {/* Dot indicator for items */}
                      {itemCount > 0 && !isSelected && (
                        <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Full Calendar Grid */}
            <div className="hidden md:block">
              <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
                {/* Week day headers */}
                {localizedWeekDays.map((day) => (
                  <div
                    key={`desktop-header-${day}`}
                    className="bg-muted/50 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day) => {
                  const dayKey = format(day, "yyyy-MM-dd");
                  const itemCount = itemsByDay[dayKey] || 0;
                  const isSelected = isSameDay(day, selectedDay);
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth() &&
                    day.getFullYear() === currentDate.getFullYear();
                  const isTodayDate = isToday(day);

                  return (
                    <button
                      key={dayKey}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "relative flex h-24 flex-col bg-card p-2 text-left transition-colors hover:bg-primary/5",
                        !isCurrentMonth && "text-muted-foreground/40",
                        isSelected &&
                          "z-10 bg-primary/5 ring-2 ring-inset ring-primary",
                        isTodayDate && "font-bold"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm",
                          isTodayDate &&
                            "inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
                          !isTodayDate &&
                            isCurrentMonth &&
                            "font-bold text-foreground"
                        )}
                      >
                        {format(day, "d")}
                      </span>

                      {/* Day event indicators */}
                      {itemCount > 0 && (
                        <div className="mt-auto space-y-1">
                          <div className="truncate rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {itemCount}{" "}
                            {itemCount === 1
                              ? t("itemSingular")
                              : t("itemPlural")}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Right: Daily Focus & Agenda */}
        <div className="order-2 xl:col-span-4">
          <section className="rounded-2xl border border-border/40 bg-card p-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] md:p-6 xl:h-full">
            {/* Day header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {isToday(selectedDay)
                    ? t("today")
                    : format(selectedDay, "EEEE", { locale: dateLocale })}
                </p>
                <h2 className="font-headline text-2xl font-extrabold">
                  {format(selectedDay, "d MMMM", { locale: dateLocale })}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarClock className="h-6 w-6" />
              </div>
            </div>

            {/* Timeline */}
            {selectedDayItems.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground/20" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("noSessionsThisDay")}
                </p>
              </div>
            ) : (
              <div className="relative space-y-8">
                {/* Timeline line */}
                <div className="absolute bottom-2 left-[15px] top-2 w-0.5 bg-border" />

                {selectedDayItems.map(({ type, item }) => {
                  if (type === "session") {
                    const session = item as ScheduleSession;
                    const sessionStart = parseISO(session.startsAt);
                    const sessionEnd = parseISO(session.endsAt);
                    const isCoach = session.userRole === "COACH";

                    return (
                      <button
                        type="button"
                        key={`timeline-session-${session.id}`}
                        className="relative w-full cursor-pointer pl-10 text-left"
                        onClick={() => handleSessionClick(session)}
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-primary bg-card" />

                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <span className="text-xs font-bold text-muted-foreground">
                              {format(sessionStart, "HH:mm", {
                                locale: dateLocale,
                              })}{" "}
                              –{" "}
                              {format(sessionEnd, "HH:mm", {
                                locale: dateLocale,
                              })}
                            </span>
                            <span
                              className={cn(
                                "rounded px-2 py-0.5 text-[10px] font-black uppercase",
                                isCoach
                                  ? "bg-primary/10 text-primary"
                                  : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              )}
                            >
                              {isCoach ? t("asCoach") : t("asParticipant")}
                            </span>
                          </div>
                          <h4 className="font-headline font-bold">
                            {session.title}
                          </h4>
                          {session.description && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {session.description}
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">
                              {session.venue.name}
                            </span>
                          </div>
                          {/* Participants */}
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                              {session._count.bookings}
                              {session.capacity
                                ? `/${session.capacity}`
                                : ""}{" "}
                              {t("participants")}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  } else {
                    const event = item as ScheduleEvent;
                    const eventDate = parseISO(event.startsAt);

                    return (
                      <Link
                        key={`timeline-event-${event.id}`}
                        href={`/events/${event.eventSlug}`}
                        className="relative block pl-10"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-blue-500 bg-card" />

                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <span className="text-xs font-bold text-muted-foreground">
                              {event.startTime ||
                                format(eventDate, "HH:mm", {
                                  locale: dateLocale,
                                })}
                            </span>
                            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                              {t("eventLabel")}
                            </span>
                          </div>
                          <h4 className="font-headline font-bold">
                            {event.title}
                          </h4>
                          <div className="mt-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">
                              {event.city}, {event.country}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })}
              </div>
            )}

            {/* Upcoming Sessions mini-list */}
            {upcomingSessions.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-4 font-headline text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {t("upcomingSessions")}
                </h3>
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 3).map((session) => {
                    const sessionStart = parseISO(session.startsAt);
                    return (
                      <button
                        key={`mini-session-${session.id}`}
                        type="button"
                        className="w-full cursor-pointer rounded-lg border border-border/60 bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40"
                        onClick={() => handleSessionClick(session)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground">
                            {format(sessionStart, "EEE, d MMM", {
                              locale: dateLocale,
                            })}
                          </span>
                          <span className="text-xs font-bold text-primary">
                            {format(sessionStart, "HH:mm", {
                              locale: dateLocale,
                            })}
                          </span>
                        </div>
                        <h4 className="mt-1 text-sm font-bold">
                          {session.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {session.venue.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Upcoming Events Section - order-3 so it appears after daily agenda on mobile */}
        {upcomingEvents.length > 0 && (
          <div className="order-3 xl:col-span-8">
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold md:text-2xl">
                  {t("upcomingEvents")}
                </h2>
                <Link
                  href="/events"
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  {t("viewAllEvents")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <ScheduleEventCard
                    key={`upcoming-event-${event.id}`}
                    event={event}
                    locale={locale}
                    dateLocale={dateLocale}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Session Details Dialog */}
      <SessionDetailsDialog
        session={selectedSession}
        open={sessionDetailsOpen}
        onOpenChange={setSessionDetailsOpen}
        locale={locale}
        userId={userId}
        isOwnerOrAdmin={true}
        canEditSessions={true}
        onEdit={(session) => {
          handleEditSession(session as unknown as ScheduleSession);
        }}
        onDelete={(session) => {
          handleDeleteSession(session as unknown as ScheduleSession);
        }}
        onParticipantAdded={fetchSessions}
      />

      {/* Edit Session Modal */}
      {sessionToEdit && (
        <VenueSessionModal
          open={sessionModalOpen}
          onOpenChange={(open) => {
            setSessionModalOpen(open);
            if (!open) setSessionToEdit(null);
          }}
          venueId={sessionToEdit.venueId}
          userId={userId}
          session={sessionToEdit}
          onSuccess={() => {
            setSessionModalOpen(false);
            setSessionToEdit(null);
            fetchSessions();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <SessionDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteSession}
        isDeleting={deleteInProgress}
        isRecurring={!!sessionToDelete?.recurringSessionId}
        deleteAll={deleteAll}
        onDeleteAllChange={setDeleteAll}
      />
    </div>
  );
}

// --- Event Card Sub-component ---

interface ScheduleEventCardProps {
  event: ScheduleEvent;
  locale: string;
  dateLocale: Locale;
}

function ScheduleEventCard({
  event,
  locale: _locale,
  dateLocale,
}: Readonly<ScheduleEventCardProps>) {
  const tEvents = useTranslations("events");
  const t = useTranslations("schedule");

  const eventDate = parseISO(event.startsAt);
  const isCancelled = event.cancelled;

  return (
    <Link
      href={`/events/${event.eventSlug}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]",
        isCancelled && "opacity-60"
      )}
    >
      {/* Image Header */}
      <div className="relative h-40 bg-muted">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover grayscale-[0.2] transition-all group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-muted">
            <CalendarIcon className="h-12 w-12 text-primary/20" />
          </div>
        )}

        {/* Registered / Cancelled badge */}
        {isCancelled ? (
          <Badge
            variant="destructive"
            className="absolute right-4 top-4 text-[10px]"
          >
            {tEvents("cancelled")}
          </Badge>
        ) : (
          <div className="absolute right-4 top-4 rounded-full bg-card/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm backdrop-blur">
            {tEvents("registered")}
          </div>
        )}

        {/* Date badge */}
        <div className="absolute bottom-4 left-4 flex min-w-[56px] flex-col items-center rounded-xl bg-card p-3 shadow-lg">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            {format(eventDate, "MMM", { locale: dateLocale })}
          </span>
          <span className="text-xl font-extrabold leading-none text-foreground">
            {format(eventDate, "dd")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className={cn(
            "font-headline text-lg font-bold",
            isCancelled && "text-muted-foreground line-through"
          )}
        >
          {event.title}
        </h3>

        {/* Variant */}
        {event.variantName && (
          <p className="mt-1 text-xs font-semibold text-primary">
            {event.variantName}
            {event.variantDistance && ` · ${event.variantDistance} km`}
          </p>
        )}

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              {event.city}, {event.country}
            </span>
          </div>
          {event.startTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{event.startTime}</span>
            </div>
          )}
        </div>

        {/* Footer: participants + details */}
        <div className="mt-6 flex items-center justify-between">
          {event.participantCount > 10 ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground">
                {event.participantCount} {t("participants")}
              </span>
            </div>
          ) : (
            <div />
          )}
          <span className="flex items-center gap-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {t("viewDetails")}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
