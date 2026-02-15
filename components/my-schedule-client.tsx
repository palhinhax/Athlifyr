"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ExternalLink,
  Pencil,
  MapPin,
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
  differenceInMinutes,
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
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <CalendarClock className="h-8 w-8 text-primary" />
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>

        {/* Today's summary */}
        {todayItemCount > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {t("todaySessions", { count: todayItemCount })}
            </span>
          </div>
        )}
      </div>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("upcomingEvents")}</h2>
            <Link href="/events">
              <Button variant="ghost" size="sm">
                {t("viewAllEvents")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <ScheduleEventCard
                key={`upcoming-event-${event.id}`}
                event={event}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions Section */}
      {upcomingSessions.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">
            {t("upcomingSessions")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <ScheduleSessionCard
                key={`upcoming-session-${session.id}`}
                session={session}
                locale={locale}
                dateLocale={dateLocale}
                onClick={() => handleSessionClick(session)}
                onEdit={() => handleEditSession(session)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Sessions for Selected Day */}
        <div className="order-2 lg:order-1">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold">
              {format(selectedDay, "PPP", { locale: dateLocale })}
            </h3>

            {selectedDayItems.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">
                  {t("noSessionsThisDay")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayItems.map(({ type, item }) =>
                  type === "session" ? (
                    <ScheduleSessionCard
                      key={`session-${item.id}`}
                      session={item as ScheduleSession}
                      locale={locale}
                      dateLocale={dateLocale}
                      onClick={() =>
                        handleSessionClick(item as ScheduleSession)
                      }
                      onEdit={() => handleEditSession(item as ScheduleSession)}
                    />
                  ) : (
                    <ScheduleEventCard
                      key={`event-${item.id}`}
                      event={item as ScheduleEvent}
                      locale={locale}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="order-1 lg:order-2">
          <div className="rounded-lg border bg-card">
            {/* Header with navigation */}
            <div className="flex items-center justify-between border-b p-2 md:p-4">
              <h3 className="text-base font-semibold capitalize md:text-lg">
                {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
              </h3>

              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  <CalendarIcon className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">{t("today")}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
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
                        "flex min-h-[52px] flex-col items-center justify-start gap-1 rounded-md p-1.5 text-sm transition-colors md:min-h-[56px] md:p-2",
                        "hover:bg-accent",
                        isSelected &&
                          "border-2 border-primary bg-primary/10 ring-2 ring-primary ring-offset-2",
                        !isCurrentMonth && "text-muted-foreground opacity-40",
                        isTodayDate && "font-bold"
                      )}
                    >
                      <span className="text-xs md:text-sm">
                        {format(day, "d")}
                      </span>

                      {/* Item count badge */}
                      {itemCount > 0 && (
                        <span
                          className={cn(
                            "min-w-[18px] rounded-full px-1 py-0.5 text-center text-[9px] font-semibold leading-none",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/15 text-primary"
                          )}
                        >
                          {itemCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
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
}

function ScheduleEventCard({ event, locale }: ScheduleEventCardProps) {
  const tEvents = useTranslations("events");

  const eventDate = parseISO(event.startsAt);
  const dateLocale = localeMap[locale] || enUS;

  return (
    <Link
      href={`/events/${event.eventSlug}`}
      className="block cursor-pointer rounded-lg border bg-gradient-to-r from-accent/5 to-primary/5 p-4 transition-colors hover:from-accent/10 hover:to-primary/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Time */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-accent" />
            <span className="text-lg font-bold text-accent">
              {format(eventDate, "PPP", { locale: dateLocale })}
            </span>
            {event.startTime && (
              <>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {event.startTime}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h4 className="mt-2 text-lg font-semibold">{event.title}</h4>

          {/* Variant */}
          {event.variantName && (
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {event.variantName}
                {event.variantDistance && ` - ${event.variantDistance} km`}
              </Badge>
            </div>
          )}

          {/* Location */}
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.city}, {event.country}
          </div>

          {/* Sport types */}
          {event.sportTypes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {event.sportTypes.map((sport) => (
                <Badge key={sport} variant="outline" className="text-xs">
                  {sport}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="shrink-0">
          <Badge variant="default" className="bg-accent text-accent-foreground">
            {tEvents("registered")}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

// --- Session Card Sub-component ---

interface ScheduleSessionCardProps {
  session: ScheduleSession;
  locale: string;
  dateLocale: Locale;
  onClick: () => void;
  onEdit: () => void;
}

function ScheduleSessionCard({
  session,
  locale: _locale,
  dateLocale,
  onClick,
  onEdit,
}: ScheduleSessionCardProps) {
  const t = useTranslations("schedule");

  const sessionStart = parseISO(session.startsAt);
  const sessionEnd = parseISO(session.endsAt);
  const duration = differenceInMinutes(sessionEnd, sessionStart);
  const isFull = session.capacity
    ? session._count.bookings >= session.capacity
    : false;
  const spotsLeft = session.capacity
    ? session.capacity - session._count.bookings
    : null;

  return (
    <div
      className="cursor-pointer rounded-lg border bg-background p-4 transition-colors hover:bg-muted/30"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Time + Title */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-lg font-bold text-primary">
              {format(sessionStart, "HH:mm", { locale: dateLocale })}
            </span>
            <span className="text-sm text-muted-foreground">–</span>
            <span className="text-sm text-muted-foreground">
              {format(sessionEnd, "HH:mm", { locale: dateLocale })}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <h4 className="font-semibold">{session.title}</h4>
            {session.userRole && (
              <Badge
                variant={session.userRole === "COACH" ? "default" : "secondary"}
                className="text-[10px]"
              >
                {session.userRole === "COACH"
                  ? t("asCoach")
                  : t("asParticipant")}
              </Badge>
            )}
          </div>

          {/* Venue */}
          <Link
            href={`/venues/${session.venue.slug}`}
            className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {session.venue.logo ? (
              <Avatar className="h-4 w-4">
                <AvatarImage
                  src={session.venue.logo}
                  alt={session.venue.name}
                />
                <AvatarFallback className="text-[8px]">
                  {session.venue.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Building2 className="h-3.5 w-3.5" />
            )}
            {session.venue.name}
            <ExternalLink className="h-3 w-3" />
          </Link>

          {/* Meta info */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration} min
            </span>

            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {session._count.bookings}
              {session.capacity ? `/${session.capacity}` : ""}{" "}
              {t("participants")}
            </span>

            {session.workouts.length > 0 && (
              <span className="flex items-center gap-1">
                <Dumbbell className="h-3.5 w-3.5" />
                {session.workouts.length}{" "}
                {session.workouts.length === 1 ? t("workout") : t("workouts")}
              </span>
            )}
          </div>

          {/* Tags */}
          {session.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {session.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Participants preview */}
          {session.bookings.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                {t("bookedParticipants")}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {session.bookings.slice(0, 8).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage
                        src={booking.user?.image || undefined}
                        alt={booking.user?.name || booking.guestName || ""}
                      />
                      <AvatarFallback className="text-[8px]">
                        {(booking.user?.name || booking.guestName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">
                      {booking.user?.name || booking.guestName || t("guest")}
                    </span>
                  </div>
                ))}
                {session.bookings.length > 8 && (
                  <span className="flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    +{session.bookings.length - 8}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions and status */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          {session.userRole === "COACH" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title={t("editSession")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}

          {isFull ? (
            <Badge variant="destructive" className="text-xs">
              {t("full")}
            </Badge>
          ) : spotsLeft !== null && spotsLeft <= 3 ? (
            <Badge variant="outline" className="text-xs text-orange-600">
              {t("spotsLeft", { count: spotsLeft })}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
}
