"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Dumbbell,
  Search,
  Loader2,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  startOfDay,
  isSameDay,
  parseISO,
  isAfter,
} from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";

interface Workout {
  id: string;
  name: string;
  description?: string | null;
  estimatedTime?: number | null;
  difficulty?: number | null;
  tags: string[];
}

interface VenueSession {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  type: string;
  _count?: {
    bookings: number;
  };
}

interface BulkWorkoutAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  onSuccess?: () => void;
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function BulkWorkoutAssignDialog({
  open,
  onOpenChange,
  venueId,
  onSuccess,
}: BulkWorkoutAssignDialogProps) {
  const t = useTranslations("venues.sessions");
  const tWorkout = useTranslations("workouts");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateLocale = localeMap[locale] || enUS;
  const { toast } = useToast();

  // Step state: 1 = select sessions, 2 = select workout
  const [step, setStep] = useState<1 | 2>(1);

  // Session selection
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<VenueSession[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Workout selection
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch sessions for selected date
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const dayStart = startOfDay(selectedDate);
      const dayEnd = addDays(dayStart, 1);

      const params = new URLSearchParams({
        from: dayStart.toISOString(),
        to: dayEnd.toISOString(),
      });

      const response = await fetch(
        `/api/venues/${venueId}/sessions?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch sessions");

      const data = await response.json();
      // Filter to only future sessions
      const futureSessions = (data.sessions || data || []).filter(
        (s: VenueSession) => isAfter(parseISO(s.startsAt), new Date())
      );
      setSessions(futureSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [venueId, selectedDate]);

  // Fetch workouts
  const fetchWorkouts = useCallback(async () => {
    setLoadingWorkouts(true);
    try {
      const params = new URLSearchParams({
        venueId,
        includePublic: "true",
      });

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const response = await fetch(`/api/workouts?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch workouts");

      const data = await response.json();
      setWorkouts(data.items || data.workouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoadingWorkouts(false);
    }
  }, [venueId, debouncedSearch]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedDate(new Date());
      setSelectedSessionIds([]);
      setSelectedWorkoutId(null);
      setSearchQuery("");
    }
  }, [open]);

  // Fetch sessions when date changes
  useEffect(() => {
    if (open && step === 1) {
      fetchSessions();
    }
  }, [open, step, fetchSessions]);

  // Fetch workouts when step 2
  useEffect(() => {
    if (open && step === 2) {
      fetchWorkouts();
    }
  }, [open, step, fetchWorkouts]);

  // Handle session selection
  const toggleSession = (sessionId: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const selectAllSessions = () => {
    setSelectedSessionIds(
      selectedSessionIds.length === sessions.length
        ? []
        : sessions.map((s) => s.id)
    );
  };

  // Navigate days
  const goToPreviousDay = () => {
    const newDate = addDays(selectedDate, -1);
    // Don't allow past days
    if (isAfter(startOfDay(newDate), startOfDay(addDays(new Date(), -1)))) {
      setSelectedDate(newDate);
      setSelectedSessionIds([]);
    }
  };

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
    setSelectedSessionIds([]);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    setSelectedSessionIds([]);
  };

  // Submit bulk assignment
  const handleSubmit = async () => {
    if (!selectedWorkoutId || selectedSessionIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/bulk-assign-workout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionIds: selectedSessionIds,
            workoutId: selectedWorkoutId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign workout");
      }

      const result = await response.json();

      toast({
        title: t("workoutAssignedToSessions"),
        description: t("workoutAssignedToSessionsDesc", {
          count: result.count,
        }),
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning workout:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to assign workout",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("bulkAssignWorkout")}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? t("bulkAssignSelectSessions")
              : t("bulkAssignSelectWorkout")}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <>
            {/* Date Navigation */}
            <div className="flex items-center justify-between rounded-lg border p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousDay}
                disabled={isSameDay(selectedDate, new Date())}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {format(selectedDate, "EEEE, d MMMM", { locale: dateLocale })}
                </span>
                {!isSameDay(selectedDate, new Date()) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToToday}
                    className="text-xs"
                  >
                    {t("today")}
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={goToNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Sessions List */}
            <div className="h-[350px] overflow-y-auto">
              {loadingSessions ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    {t("noSessionsThisDay")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("selectAnotherDay")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Select All */}
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-3 transition-colors hover:bg-muted/50"
                    onClick={selectAllSessions}
                  >
                    <Checkbox
                      checked={selectedSessionIds.length === sessions.length}
                      onCheckedChange={selectAllSessions}
                    />
                    <span className="text-sm font-medium">
                      {t("selectAllSessions", { count: sessions.length })}
                    </span>
                  </div>

                  {/* Sessions */}
                  {sessions.map((session) => {
                    const isSelected = selectedSessionIds.includes(session.id);
                    const startTime = format(
                      parseISO(session.startsAt),
                      "HH:mm"
                    );
                    const endTime = format(parseISO(session.endsAt), "HH:mm");

                    return (
                      <div
                        key={session.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                          isSelected && "border-primary bg-primary/5"
                        )}
                        onClick={() => toggleSession(session.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSession(session.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{session.title}</p>
                            <Badge variant="secondary" className="text-xs">
                              {session.type === "CLASS"
                                ? t("class")
                                : t("appointment")}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {startTime} - {endTime}
                            </span>
                            {session.capacity && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {session._count?.bookings || 0} /{" "}
                                {session.capacity}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter>
              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("sessionsSelected", { count: selectedSessionIds.length })}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={selectedSessionIds.length === 0}
                  >
                    {tCommon("next")}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Search Workouts */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={tWorkout("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm">
                <span className="font-medium">{t("assigningTo")}:</span>{" "}
                {selectedSessionIds.length}{" "}
                {selectedSessionIds.length === 1
                  ? t("session").toLowerCase()
                  : t("sessions").toLowerCase()}{" "}
                {t("on")}{" "}
                {format(selectedDate, "d MMM", { locale: dateLocale })}
              </p>
            </div>

            {/* Workouts List */}
            <div className="h-[300px] overflow-y-auto">
              {loadingWorkouts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : workouts.length === 0 ? (
                <div className="py-12 text-center">
                  <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    {tWorkout("noWorkoutsFound")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workouts.map((workout) => {
                    const isSelected = selectedWorkoutId === workout.id;
                    return (
                      <div
                        key={workout.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                          isSelected && "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedWorkoutId(workout.id)}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{workout.name}</p>
                          {workout.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {workout.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            {workout.estimatedTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {workout.estimatedTime} min
                              </span>
                            )}
                            {workout.tags.length > 0 && (
                              <span>{workout.tags.slice(0, 2).join(", ")}</span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter>
              <div className="flex w-full items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  {tCommon("back")}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedWorkoutId || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Dumbbell className="mr-2 h-4 w-4" />
                    )}
                    {t("assignWorkout")}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
