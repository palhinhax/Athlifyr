"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Dumbbell,
  Loader2,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";
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
import { useUserVenues } from "@/hooks/use-user-venues";

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

interface AssignWorkoutToSessionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutId: string;
  workoutName: string;
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

export function AssignWorkoutToSessionsDialog({
  open,
  onOpenChange,
  workoutId,
  workoutName,
  onSuccess,
}: AssignWorkoutToSessionsDialogProps) {
  const t = useTranslations("workouts");
  const tVenues = useTranslations("venues.sessions");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateLocale = localeMap[locale] || enUS;
  const { toast } = useToast();

  // Get user's venues (only OWNER and ADMIN can assign workouts)
  const { venues, isLoading: loadingVenues } = useUserVenues();
  const manageableVenues = venues.filter(
    (v) => v.role === "OWNER" || v.role === "ADMIN" || v.role === "COACH"
  );

  // State
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<VenueSession[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
      setSelectedSessionIds([]);
      setSessions([]);
      // Auto-select venue if user only has one
      if (manageableVenues.length === 1) {
        setSelectedVenueId(manageableVenues[0].id);
      } else {
        setSelectedVenueId(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Fetch sessions when venue or date changes
  const fetchSessions = useCallback(async () => {
    if (!selectedVenueId) return;

    setLoadingSessions(true);
    try {
      const dayStart = startOfDay(selectedDate);
      const dayEnd = addDays(dayStart, 1);

      const params = new URLSearchParams({
        from: dayStart.toISOString(),
        to: dayEnd.toISOString(),
      });

      const response = await fetch(
        `/api/venues/${selectedVenueId}/sessions?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch sessions");

      const data = await response.json();
      // Filter to only future sessions
      const futureSessions = (data.sessions || data || []).filter(
        (s: VenueSession) => isAfter(parseISO(s.startsAt), new Date())
      );
      setSessions(futureSessions);
      setSelectedSessionIds([]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [selectedVenueId, selectedDate]);

  useEffect(() => {
    if (open && selectedVenueId) {
      fetchSessions();
    }
  }, [open, selectedVenueId, selectedDate, fetchSessions]);

  // Handle session selection
  const toggleSession = (sessionId: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const selectAllSessions = () => {
    if (selectedSessionIds.length === sessions.length) {
      setSelectedSessionIds([]);
    } else {
      setSelectedSessionIds(sessions.map((s) => s.id));
    }
  };

  // Navigate days
  const goToPreviousDay = () => {
    const newDate = addDays(selectedDate, -1);
    if (isAfter(startOfDay(newDate), startOfDay(addDays(new Date(), -1)))) {
      setSelectedDate(newDate);
    }
  };

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Submit assignment
  const handleSubmit = async () => {
    if (!selectedVenueId || selectedSessionIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/venues/${selectedVenueId}/sessions/bulk-assign-workout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionIds: selectedSessionIds,
            workoutId: workoutId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign workout");
      }

      const result = await response.json();

      toast({
        title: t("assignedToSessions"),
        description: t("assignedToSessionsDesc", {
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

  const selectedVenue = manageableVenues.find((v) => v.id === selectedVenueId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("assignToSessions")}</DialogTitle>
          <DialogDescription>
            {t("assignToSessionsDesc", { workout: workoutName })}
          </DialogDescription>
        </DialogHeader>

        {loadingVenues ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : manageableVenues.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              {t("noVenuesToAssign")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("noVenuesToAssignDesc")}
            </p>
          </div>
        ) : (
          <>
            {/* Venue Selection (if multiple) */}
            {manageableVenues.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("selectVenue")}
                </label>
                <Select
                  value={selectedVenueId || ""}
                  onValueChange={setSelectedVenueId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectVenuePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {manageableVenues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {venue.name}
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {venue.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedVenueId && (
              <>
                {/* Selected Venue Info */}
                {manageableVenues.length === 1 && selectedVenue && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {selectedVenue.name}
                    </span>
                  </div>
                )}

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
                      {format(selectedDate, "EEEE, d MMMM", {
                        locale: dateLocale,
                      })}
                    </span>
                    {!isSameDay(selectedDate, new Date()) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToToday}
                        className="text-xs"
                      >
                        {tVenues("today")}
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={goToNextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sessions List */}
                <div className="h-[300px] overflow-y-auto">
                  {loadingSessions ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="py-12 text-center">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        {tVenues("noSessionsThisDay")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tVenues("selectAnotherDay")}
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
                          checked={
                            selectedSessionIds.length === sessions.length
                          }
                          onCheckedChange={selectAllSessions}
                        />
                        <span className="text-sm font-medium">
                          {tVenues("selectAllSessions", {
                            count: sessions.length,
                          })}
                        </span>
                      </div>

                      {/* Sessions */}
                      {sessions.map((session) => {
                        const isSelected = selectedSessionIds.includes(
                          session.id
                        );
                        const startTime = format(
                          parseISO(session.startsAt),
                          "HH:mm"
                        );
                        const endTime = format(
                          parseISO(session.endsAt),
                          "HH:mm"
                        );

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
                                    ? tVenues("class")
                                    : tVenues("appointment")}
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
              </>
            )}

            <DialogFooter>
              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {tVenues("sessionsSelected", {
                    count: selectedSessionIds.length,
                  })}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      selectedSessionIds.length === 0 ||
                      !selectedVenueId ||
                      isSubmitting
                    }
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
