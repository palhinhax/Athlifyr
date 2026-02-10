"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  GraduationCap,
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { pt, enUS, es, fr, de, it, type Locale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TrialSession {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  _count: {
    bookings: number;
  };
}

interface TrialBookingButtonProps {
  venueId: string;
  venueName: string;
  userId?: string;
  enableTrialBooking: boolean;
  locale?: string;
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function TrialBookingButton({
  venueId,
  venueName,
  userId,
  enableTrialBooking,
  locale = "en",
}: TrialBookingButtonProps) {
  const t = useTranslations("venues.trialBooking");
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessions, setSessions] = useState<TrialSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const dateLocale = localeMap[locale] || enUS;

  // Check if user is eligible for trial booking
  useEffect(() => {
    async function checkEligibility() {
      if (!userId || !enableTrialBooking) {
        setIsEligible(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/venues/${venueId}/bookings/user?userId=${userId}`
        );

        if (response.ok) {
          const data = await response.json();
          // User is eligible if they have NO bookings at this venue
          setIsEligible(
            !data.bookings ||
              (Array.isArray(data.bookings) && data.bookings.length === 0)
          );
        } else {
          setIsEligible(false);
        }
      } catch (error) {
        console.error("Error checking trial eligibility:", error);
        setIsEligible(false);
      } finally {
        setLoading(false);
      }
    }

    checkEligibility();
  }, [userId, venueId, enableTrialBooking]);

  // Fetch sessions when dialog opens or month changes
  useEffect(() => {
    if (!dialogOpen) return;

    async function fetchSessions() {
      setSessionsLoading(true);
      try {
        const from = startOfMonth(currentMonth).toISOString();
        const to = addDays(endOfMonth(currentMonth), 1).toISOString();

        const response = await fetch(
          `/api/venues/${venueId}/sessions?from=${from}&to=${to}`
        );

        if (response.ok) {
          const data = await response.json();
          // Only show future sessions
          const now = new Date();
          const futureSessions = (data.sessions || []).filter(
            (s: TrialSession) => new Date(s.startsAt) > now
          );
          setSessions(futureSessions);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setSessionsLoading(false);
      }
    }

    fetchSessions();
  }, [dialogOpen, venueId, currentMonth]);

  // Sessions for selected day
  const sessionsForDay = useMemo(() => {
    return sessions.filter((session) =>
      isSameDay(new Date(session.startsAt), selectedDay)
    );
  }, [sessions, selectedDay]);

  // Days that have sessions (for calendar indicators)
  const daysWithSessions = useMemo(() => {
    const days = new Set<string>();
    sessions.forEach((session) => {
      days.add(format(new Date(session.startsAt), "yyyy-MM-dd"));
    });
    return days;
  }, [sessions]);

  // Don't render if not enabled, not authenticated, or not eligible
  if (!enableTrialBooking || !userId || loading) {
    return null;
  }

  if (!isEligible) {
    return null;
  }

  const handleOpenDialog = () => {
    setSelectedSessionId(null);
    setDialogOpen(true);
  };

  const handleRequestTrial = async () => {
    if (!selectedSessionId) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/trial-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selectedSessionId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to request trial class");
      }

      toast({
        title: t("requestSent"),
        description: t("requestDescription"),
      });
      setDialogOpen(false);
      setSelectedSessionId(null);
      // After successful booking, user is no longer eligible
      setIsEligible(false);
    } catch (error) {
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Generate calendar days for the month
  const generateCalendarDays = () => {
    const monthStartDate = startOfMonth(currentMonth);
    const monthEndDate = endOfMonth(currentMonth);
    const startDayOfWeek = monthStartDate.getDay(); // 0 = Sunday
    const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Monday = 0

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Previous month filler days
    for (let i = adjustedStart - 1; i >= 0; i--) {
      days.push({
        date: addDays(monthStartDate, -i - 1),
        isCurrentMonth: false,
      });
    }

    // Current month days
    let current = monthStartDate;
    while (current <= monthEndDate) {
      days.push({ date: new Date(current), isCurrentMonth: true });
      current = addDays(current, 1);
    }

    // Fill remaining days to complete the grid (up to 42 = 6 rows × 7 days)
    while (days.length % 7 !== 0) {
      days.push({
        date: addDays(monthEndDate, days.length - adjustedStart - monthEndDate.getDate() + 1),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="w-full gap-2 bg-green-600 text-white hover:bg-green-700 sm:w-auto"
        size="lg"
      >
        <GraduationCap className="h-4 w-4" />
        {t("bookTrial")}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              {t("title")}
            </DialogTitle>
            <DialogDescription>
              {t("dialogDescription", { venueName })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Mini Calendar */}
            <div className="rounded-lg border p-3">
              {/* Month navigation */}
              <div className="mb-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const prev = new Date(currentMonth);
                    prev.setMonth(prev.getMonth() - 1);
                    setCurrentMonth(prev);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium capitalize">
                  {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = new Date(currentMonth);
                    next.setMonth(next.getMonth() + 1);
                    setCurrentMonth(next);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Day of week headers */}
              <div className="mb-1 grid grid-cols-7 gap-1 text-center">
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {t(`days.${day}`)}
                    </div>
                  )
                )}
              </div>

              {/* Calendar grid */}
              {sessionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(({ date, isCurrentMonth }, i) => {
                    const dayKey = format(date, "yyyy-MM-dd");
                    const hasSessions = daysWithSessions.has(dayKey);
                    const isSelected = isSameDay(date, selectedDay);
                    const isPast = date < today && !isSameDay(date, today);
                    const isToday = isSameDay(date, today);

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={!isCurrentMonth || isPast || !hasSessions}
                        onClick={() => {
                          setSelectedDay(date);
                          setSelectedSessionId(null);
                        }}
                        className={cn(
                          "relative flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors",
                          !isCurrentMonth && "text-muted-foreground/30",
                          isCurrentMonth &&
                            !isPast &&
                            hasSessions &&
                            "cursor-pointer hover:bg-accent",
                          isCurrentMonth &&
                            isPast &&
                            "text-muted-foreground/50",
                          isCurrentMonth &&
                            !hasSessions &&
                            !isPast &&
                            "text-muted-foreground/70",
                          isSelected &&
                            hasSessions &&
                            "bg-green-600 text-white hover:bg-green-700",
                          isToday && !isSelected && "font-bold"
                        )}
                      >
                        {date.getDate()}
                        {hasSessions && !isSelected && (
                          <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sessions list for selected day */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                {format(selectedDay, "EEEE, d MMMM", { locale: dateLocale })}
              </h4>

              {sessionsForDay.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t("noSessionsForDay")}
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {sessionsForDay.map((session) => {
                      const isFull =
                        session.capacity !== null &&
                        session._count.bookings >= session.capacity;
                      const isSelected = selectedSessionId === session.id;

                      return (
                        <button
                          key={session.id}
                          type="button"
                          disabled={isFull}
                          onClick={() =>
                            setSelectedSessionId(
                              isSelected ? null : session.id
                            )
                          }
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                            isFull
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer hover:bg-accent",
                            isSelected &&
                              "border-green-600 bg-green-50 dark:bg-green-950/20"
                          )}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {session.title}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(session.startsAt), "HH:mm")} -{" "}
                                {format(new Date(session.endsAt), "HH:mm")}
                              </span>
                              {session.capacity !== null && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {session._count.bookings}/{session.capacity}
                                </span>
                              )}
                            </div>
                          </div>
                          {isFull && (
                            <Badge variant="secondary" className="text-xs">
                              {t("sessionFull")}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Selected session confirmation */}
            {selectedSession && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {t("confirmSession", {
                    title: selectedSession.title,
                    date: format(
                      new Date(selectedSession.startsAt),
                      "d MMMM",
                      { locale: dateLocale }
                    ),
                    time: format(
                      new Date(selectedSession.startsAt),
                      "HH:mm"
                    ),
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleRequestTrial}
              disabled={submitting || !selectedSessionId}
              className="gap-2 bg-green-600 text-white hover:bg-green-700"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("sendRequest")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
