"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  User,
  CheckCircle,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Repeat,
} from "lucide-react";
import {
  format,
  eachDayOfInterval,
  isToday,
  isSameDay,
  parseISO,
  differenceInMinutes,
  addDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { VenueSessionModal } from "@/components/venue-session-modal";

interface SessionBooking {
  id: string;
  status: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface VenueSession {
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
  recurringSession?: {
    id: string;
    isActive: boolean;
  } | null;
  bookings?: SessionBooking[];
  _count: {
    bookings: number;
  };
  isBooked?: boolean;
}

interface VenueSessionsCalendarProps {
  venueId: string;
  locale: string;
  userId?: string;
  hasActiveSubscription?: boolean;
  isOwnerOrAdmin?: boolean;
  venueDefaults?: {
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultBookingDeadlineMinutes: number;
    defaultCancellationDeadlineMinutes: number;
  };
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function VenueSessionsCalendar({
  venueId,
  locale,
  userId,
  hasActiveSubscription = false,
  isOwnerOrAdmin = false,
  venueDefaults,
}: VenueSessionsCalendarProps) {
  const t = useTranslations("venues.sessions");
  const tBooking = useTranslations("venues.booking");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [sessions, setSessions] = useState<VenueSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date()); // Selected day for calendar view
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  );
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState<string | null>(null);

  // Session management state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<VenueSession | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<VenueSession | null>(
    null
  );
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [defaultSessionDate, setDefaultSessionDate] = useState<
    Date | undefined
  >(undefined);

  // Recurring delete options dialog state
  const [recurringDeleteDialogOpen, setRecurringDeleteDialogOpen] =
    useState(false);
  const [deleteOption, setDeleteOption] = useState<"single" | "future">(
    "single"
  );

  // Session details modal state
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<VenueSession | null>(
    null
  );

  const dateLocale = localeMap[locale] || enUS;

  // Calculate month range for calendar view
  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);

  // Stable ISO strings for fetch dependency (always fetch full month)
  const fetchStartISO = useMemo(() => monthStart.toISOString(), [monthStart]);
  const fetchEndISO = useMemo(
    () => addDays(monthEnd, 1).toISOString(),
    [monthEnd]
  );

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("from", fetchStartISO);
      params.set("to", fetchEndISO);

      const response = await fetch(
        `/api/venues/${venueId}/sessions?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();

      // If user is logged in, check their bookings
      let sessionsWithBookingStatus = data.sessions;
      if (userId) {
        const bookingsResponse = await fetch(
          `/api/venues/${venueId}/bookings/user`
        );
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const bookedSessionIds = new Set(
            bookingsData.bookings
              .filter(
                (b: { status: string }) =>
                  b.status === "BOOKED" || b.status === "ATTENDED"
              )
              .map((b: { sessionId: string }) => b.sessionId)
          );
          sessionsWithBookingStatus = data.sessions.map(
            (session: VenueSession) => ({
              ...session,
              isBooked: bookedSessionIds.has(session.id),
            })
          );
        }
      }

      setSessions(sessionsWithBookingStatus);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: t("loadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [venueId, fetchStartISO, fetchEndISO, userId, t, toast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Navigation handlers (always navigate by month)
  const goToPreviousWeek = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  // Map API error reasons to translation keys
  const getBookingErrorMessage = (reason: string): string => {
    const errorMap: Record<string, string> = {
      ALREADY_BOOKED: tBooking("alreadyBooked"),
      SESSION_FULL: tBooking("sessionFull"),
      NO_ACTIVE_SUBSCRIPTION: tBooking("noSubscription"),
      NOT_A_MEMBER: tBooking("notAllowed"),
      MEMBER_NOT_ACTIVE: tBooking("notAllowed"),
      SESSION_NOT_FOUND: tBooking("error"),
      LIMIT_REACHED: tBooking("limitReached"),
      OUTSIDE_TIME_WINDOW: tBooking("outsideTimeWindow"),
    };
    return errorMap[reason] || tBooking("error");
  };

  // Booking handlers
  const handleBookSession = async (sessionId: string) => {
    if (!userId) {
      toast({
        title: t("signInToBook"),
        variant: "destructive",
      });
      return;
    }

    setBookingInProgress(sessionId);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/${sessionId}/book`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = getBookingErrorMessage(data.reason || "ERROR");
        throw new Error(errorMessage);
      }

      toast({
        title: t("bookingSuccess"),
        variant: "default",
      });

      fetchSessions();
    } catch (error) {
      console.error("Error booking session:", error);
      const errorMessage =
        error instanceof Error ? error.message : tBooking("error");
      toast({
        title: tCommon("error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(null);
    }
  };

  const handleCancelBooking = async () => {
    if (!sessionToCancel) return;

    setBookingInProgress(sessionToCancel);
    setCancelDialogOpen(false);

    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/${sessionToCancel}/book`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Cancellation failed");
      }

      toast({
        title: t("bookingCancelled"),
        variant: "default",
      });

      fetchSessions();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: tCommon("error"),
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(null);
      setSessionToCancel(null);
    }
  };

  const openCancelDialog = (sessionId: string) => {
    setSessionToCancel(sessionId);
    setCancelDialogOpen(true);
  };

  // Session management handlers
  const openCreateSessionModal = (date?: Date) => {
    setSessionToEdit(null);
    setDefaultSessionDate(date);
    setSessionModalOpen(true);
  };

  const openEditSessionModal = (session: VenueSession) => {
    setSessionToEdit(session);
    setDefaultSessionDate(undefined);
    setSessionModalOpen(true);
  };

  const openDeleteDialog = (session: VenueSession) => {
    setSessionToDelete(session);
    // If it's a recurring session, show the recurring delete options dialog
    if (session.recurringSessionId) {
      setDeleteOption("single");
      setRecurringDeleteDialogOpen(true);
    } else {
      // Regular session - show simple delete dialog
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteSession = async (
    option: "single" | "future" = "single"
  ) => {
    if (!sessionToDelete) return;

    setDeleteInProgress(true);

    try {
      const params = new URLSearchParams();
      // "future" option deletes all future sessions AND cancels the recurrence
      if (option === "future") {
        params.set("deleteRecurring", "true");
      }

      const url =
        `/api/venues/${venueId}/sessions/${sessionToDelete.id}` +
        (params.toString() ? `?${params.toString()}` : "");

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete session");
      }

      const result = await response.json();

      if (result.deletedRecurring) {
        toast({
          title: t("allFutureDeleted"),
          description: t("deletedCount", { count: result.deletedCount || 0 }),
          variant: "default",
        });
      } else {
        toast({
          title: t("sessionDeleted"),
          variant: "default",
        });
      }

      fetchSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to delete session",
        variant: "destructive",
      });
    } finally {
      setDeleteInProgress(false);
      setDeleteDialogOpen(false);
      setRecurringDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleSessionModalSuccess = () => {
    fetchSessions();
    // Close details modal if open after edit
    setSessionDetailsOpen(false);
    setSelectedSession(null);
  };

  // Open session details modal
  const openSessionDetails = (session: VenueSession) => {
    setSelectedSession(session);
    setSessionDetailsOpen(true);
  };

  // Edit from details modal
  const handleEditFromDetails = () => {
    if (selectedSession) {
      setSessionDetailsOpen(false);
      openEditSessionModal(selectedSession);
    }
  };

  // Delete from details modal
  const handleDeleteFromDetails = () => {
    if (selectedSession) {
      setSessionDetailsOpen(false);
      openDeleteDialog(selectedSession);
    }
  };

  // Get sessions for a specific day
  const getSessionsForDay = (day: Date) => {
    return sessions.filter((session) =>
      isSameDay(parseISO(session.startsAt), day)
    );
  };

  // Render session card
  const renderSessionCard = (session: VenueSession, compact = false) => {
    const isPast = new Date(session.startsAt) < new Date();
    const isFull =
      session.capacity !== null && session._count.bookings >= session.capacity;
    const availableSpots =
      session.capacity !== null
        ? session.capacity - session._count.bookings
        : null;

    return (
      <div
        key={session.id}
        className={cn(
          "cursor-pointer rounded-lg border bg-card p-3 transition-all hover:shadow-md",
          isPast && "opacity-60",
          session.isBooked && "border-primary bg-primary/5",
          compact && "p-2"
        )}
        onClick={() => openSessionDetails(session)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openSessionDetails(session);
          }
        }}
      >
        {/* Header: Title and time */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {session.recurringSessionId && (
              <Repeat className="h-3 w-3 shrink-0 text-muted-foreground" />
            )}
            <h4
              className={cn(
                "truncate font-medium",
                compact ? "text-sm" : "text-base"
              )}
            >
              {session.title}
            </h4>
            {session.isBooked && (
              <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
            )}
          </div>
          <div
            className={cn(
              "flex shrink-0 items-center gap-1 text-muted-foreground",
              compact ? "text-xs" : "text-sm"
            )}
          >
            <Clock className="h-3 w-3" />
            <span>
              {format(parseISO(session.startsAt), "HH:mm", {
                locale: dateLocale,
              })}
              {" - "}
              {format(parseISO(session.endsAt), "HH:mm", {
                locale: dateLocale,
              })}
            </span>
          </div>
        </div>

        {/* Footer: Capacity info and action button */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isPast && (
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                {t("pastSession")}
              </Badge>
            )}

            {/* Capacity info */}
            {isPast ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {t("hadAttendees", { count: session._count.bookings })}
              </span>
            ) : session.capacity !== null ? (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isFull ? "text-destructive" : "text-muted-foreground"
                )}
              >
                <Users className="h-3 w-3" />
                {isFull
                  ? t("full")
                  : t("spotsLeft", { count: availableSpots ?? 0 })}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {t("unlimited")}
              </span>
            )}
          </div>

          {/* Action button - only for non-past sessions */}
          {!isPast && (
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              {session.isBooked ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openCancelDialog(session.id)}
                  disabled={bookingInProgress === session.id}
                  className="h-7 px-2 text-xs"
                >
                  {bookingInProgress === session.id ? (
                    <Spinner className="h-3 w-3" />
                  ) : (
                    t("cancelBooking")
                  )}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleBookSession(session.id)}
                  disabled={
                    isFull ||
                    !hasActiveSubscription ||
                    bookingInProgress === session.id
                  }
                  className="h-7 px-2 text-xs"
                >
                  {bookingInProgress === session.id ? (
                    <Spinner className="h-3 w-3" />
                  ) : (
                    t("bookSession")
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {session.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {session.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Admin actions */}
        {isOwnerOrAdmin && !compact && (
          <div
            className="mt-3 flex items-center justify-end gap-2 border-t pt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openEditSessionModal(session);
              }}
              className="text-xs"
            >
              <Pencil className="mr-1 h-3 w-3" />
              {t("editSession")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDeleteDialog(session);
              }}
              disabled={deleteInProgress}
              className="text-xs"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              {t("deleteSession")}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render week view (now month view)
  const renderWeekView = () => {
    // Get month range
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    // Get sessions for selected day
    const selectedDaySessions = getSessionsForDay(selectedDay);

    return (
      <div className="space-y-6">
        {/* Month Calendar Grid */}
        <div className="rounded-lg border p-2 md:p-4">
          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7 gap-1 md:mb-2">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
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
              const daySessions = getSessionsForDay(day);
              const isCurrentDay = isToday(day);
              const isSelected = isSameDay(day, selectedDay);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const hasSessionsIndicator = daySessions.length > 0;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative min-h-[45px] rounded-lg border p-1.5 text-center transition-all hover:border-primary hover:bg-primary/5 md:min-h-[50px] md:p-2",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                    isCurrentDay && "font-semibold",
                    isSelected &&
                      "border-green-600 bg-green-50 ring-2 ring-green-600 ring-offset-2"
                  )}
                >
                  <div
                    className={cn(
                      "text-xs md:text-sm",
                      isCurrentDay && "font-semibold"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  {hasSessionsIndicator && (
                    <div className="mt-0.5 flex justify-center gap-0.5 md:mt-1">
                      {daySessions.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className="h-0.5 w-0.5 rounded-full bg-primary md:h-1 md:w-1"
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {format(selectedDay, "EEEE, d MMMM yyyy", { locale: dateLocale })}
              {isToday(selectedDay) && (
                <Badge variant="default" className="ml-2">
                  {t("today")}
                </Badge>
              )}
            </h3>
            {isOwnerOrAdmin && (
              <Button
                size="sm"
                onClick={() => openCreateSessionModal(selectedDay)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("createSession")}
              </Button>
            )}
          </div>

          {selectedDaySessions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {t("noSessionsThisDay")}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedDaySessions.map((session) =>
                renderSessionCard(session, false)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            {t("today")}
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Show month name */}
          <span className="ml-2 font-medium">
            {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
          </span>
        </div>

        {/* Create session button */}
        <div className="flex items-center gap-2">
          {isOwnerOrAdmin && (
            <Button onClick={() => openCreateSessionModal()}>
              <Plus className="mr-2 h-4 w-4" />
              {t("createSession")}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">{t("noSessionsThisWeek")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("noSessionsDescription")}
          </p>
        </div>
      ) : (
        renderWeekView()
      )}

      {/* Cancel booking dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmCancel")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmCancelDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking}>
              {tCommon("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete session dialog (non-recurring) */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteSessionConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteSessionDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInProgress}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteSession("single")}
              disabled={deleteInProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteInProgress ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {t("deleteSession")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete recurring session dialog */}
      <AlertDialog
        open={recurringDeleteDialogOpen}
        onOpenChange={(open) => {
          setRecurringDeleteDialogOpen(open);
          if (!open) setDeleteOption("single");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteRecurringTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteRecurringDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-4">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
              <input
                type="radio"
                name="deleteOption"
                value="single"
                checked={deleteOption === "single"}
                onChange={() => setDeleteOption("single")}
                className="mt-1"
              />
              <div>
                <p className="font-medium">{t("deleteOnlyThis")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("deleteOnlyThisDescription")}
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
              <input
                type="radio"
                name="deleteOption"
                value="future"
                checked={deleteOption === "future"}
                onChange={() => setDeleteOption("future")}
                className="mt-1"
              />
              <div>
                <p className="font-medium">{t("deleteAllFuture")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("deleteAllFutureDescription")}
                </p>
              </div>
            </label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInProgress}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteSession(deleteOption)}
              disabled={deleteInProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteInProgress ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {t("deleteSession")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit session modal */}
      <VenueSessionModal
        open={sessionModalOpen}
        onOpenChange={setSessionModalOpen}
        venueId={venueId}
        session={sessionToEdit}
        defaultDate={defaultSessionDate}
        onSuccess={handleSessionModalSuccess}
        venueDefaults={venueDefaults}
      />

      {/* Session details modal */}
      <Dialog open={sessionDetailsOpen} onOpenChange={setSessionDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedSession?.title}
              {selectedSession?.recurringSessionId && (
                <Badge variant="outline" className="ml-2 gap-1">
                  <Repeat className="h-3 w-3" />
                  {t("recurringSession")}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4">
              {/* Date and time */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {format(
                    parseISO(selectedSession.startsAt),
                    "EEEE, d MMMM yyyy",
                    {
                      locale: localeMap[locale] || pt,
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {format(parseISO(selectedSession.startsAt), "HH:mm")} -{" "}
                  {format(parseISO(selectedSession.endsAt), "HH:mm")}
                </span>
                <span className="text-xs">
                  (
                  {differenceInMinutes(
                    parseISO(selectedSession.endsAt),
                    parseISO(selectedSession.startsAt)
                  )}{" "}
                  min)
                </span>
              </div>

              {/* Capacity */}
              {selectedSession.capacity && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {selectedSession._count.bookings} /{" "}
                    {selectedSession.capacity} {t("participants")}
                  </span>
                  {selectedSession._count.bookings >=
                    selectedSession.capacity && (
                    <Badge variant="destructive" className="text-xs">
                      {t("full")}
                    </Badge>
                  )}
                </div>
              )}

              {/* Description */}
              {selectedSession.description && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {selectedSession.tags && selectedSession.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedSession.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Participants list */}
              {selectedSession.bookings &&
                selectedSession.bookings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4" />
                      {t("attendees")} ({selectedSession.bookings.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center gap-2 rounded-full bg-muted px-3 py-1"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={booking.user.image || undefined}
                              alt={booking.user.name || ""}
                            />
                            <AvatarFallback className="text-xs">
                              {booking.user.name
                                ? booking.user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {booking.user.name || "?"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* No participants message - different for past vs future sessions */}
              {(!selectedSession.bookings ||
                selectedSession.bookings.length === 0) && (
                <div className="text-sm italic text-muted-foreground">
                  {new Date(selectedSession.startsAt) < new Date()
                    ? t("hadAttendees", { count: 0 })
                    : t("noBookings")}
                </div>
              )}

              {/* Booking status - only for future sessions */}
              {selectedSession.isBooked &&
                new Date(selectedSession.startsAt) >= new Date() && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {t("youAreBooked")}
                    </span>
                  </div>
                )}

              {/* Actions - only for future sessions */}
              {new Date(selectedSession.startsAt) >= new Date() && (
                <div className="flex flex-col gap-2 border-t pt-2">
                  {/* User booking actions */}
                  {!isOwnerOrAdmin && hasActiveSubscription && (
                    <>
                      {selectedSession.isBooked ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSessionDetailsOpen(false);
                            openCancelDialog(selectedSession.id);
                          }}
                        >
                          {t("cancelBooking")}
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSessionDetailsOpen(false);
                            handleBookSession(selectedSession.id);
                          }}
                          disabled={
                            bookingInProgress !== null ||
                            (selectedSession.capacity !== null &&
                              selectedSession._count.bookings >=
                                selectedSession.capacity)
                          }
                        >
                          {bookingInProgress ? (
                            <Spinner className="mr-2 h-4 w-4" />
                          ) : null}
                          {t("bookSession")}
                        </Button>
                      )}
                    </>
                  )}

                  {/* Admin actions */}
                  {isOwnerOrAdmin && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleEditFromDetails}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {t("editSession")}
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={handleDeleteFromDetails}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("deleteSession")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
