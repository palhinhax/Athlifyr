"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  UserCircle,
  Search,
  Loader2,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  UserX,
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
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface VenueSession {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  type: string;
  coachId: string | null;
  _count?: {
    bookings: number;
  };
}

interface StaffMember {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface BulkCoachAssignDialogProps {
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

export function BulkCoachAssignDialog({
  open,
  onOpenChange,
  venueId,
  onSuccess,
}: BulkCoachAssignDialogProps) {
  const t = useTranslations("venues.sessions");
  const tVenues = useTranslations("venues");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateLocale = localeMap[locale] || enUS;
  const { toast } = useToast();

  // Step state: 1 = select sessions, 2 = select coach
  const [step, setStep] = useState<1 | 2>(1);

  // Session selection
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<VenueSession[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Staff selection
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch venue staff/members (only OWNER, ADMIN, COACH - not CLIENT)
  const fetchStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/members`);
      if (!response.ok) throw new Error("Failed to fetch staff");

      const data = await response.json();
      // Filter to only show staff (OWNER, ADMIN, COACH) - exclude CLIENT role
      const STAFF_ROLES = new Set(["OWNER", "ADMIN", "COACH"]);
      const staffMembers = (data.members || []).filter((member: StaffMember) =>
        STAFF_ROLES.has(member.role)
      );
      setStaff(staffMembers);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]);
    } finally {
      setLoadingStaff(false);
    }
  }, [venueId]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedDate(new Date());
      setSelectedSessionIds([]);
      setSelectedCoachId(null);
      setSearchQuery("");
    }
  }, [open]);

  // Fetch sessions when date changes
  useEffect(() => {
    if (open && step === 1) {
      fetchSessions();
    }
  }, [open, step, fetchSessions]);

  // Fetch staff when step 2
  useEffect(() => {
    if (open && step === 2) {
      fetchStaff();
    }
  }, [open, step, fetchStaff]);

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

  // Filter staff by search
  const filteredStaff = debouncedSearch
    ? staff.filter((member) => {
        const search = debouncedSearch.toLowerCase();
        return (
          member.user.name?.toLowerCase().includes(search) ||
          member.user.email?.toLowerCase().includes(search)
        );
      })
    : staff;

  // Submit bulk assignment
  const handleSubmit = async () => {
    if (selectedSessionIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/bulk-assign-coach`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionIds: selectedSessionIds,
            coachId: selectedCoachId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign coach");
      }

      const result = await response.json();

      toast({
        title: selectedCoachId
          ? t("coachAssignedToSessions")
          : t("coachRemovedFromSessions"),
        description: selectedCoachId
          ? t("coachAssignedToSessionsDesc", { count: result.count })
          : t("coachRemovedFromSessionsDesc", { count: result.count }),
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning coach:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to assign coach",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "OWNER":
        return "default";
      case "ADMIN":
        return "secondary";
      case "COACH":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("bulkAssignCoach")}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? t("bulkAssignCoachSelectSessions")
              : t("bulkAssignCoachSelectProfessional")}
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
                      onClick={(e) => e.stopPropagation()}
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
                          onClick={(e) => e.stopPropagation()}
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
            {/* Search Staff */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchStaff")}
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

            {/* Staff List */}
            <div className="h-[300px] overflow-y-auto">
              {loadingStaff ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Remove Coach Option */}
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                      selectedCoachId === null && "border-primary bg-primary/5"
                    )}
                    onClick={() => setSelectedCoachId(null)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <UserX className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t("noCoachAssigned")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("removeCoachFromSessions")}
                      </p>
                    </div>
                    {selectedCoachId === null && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {filteredStaff.length === 0 ? (
                    <div className="py-8 text-center">
                      <UserCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        {t("noStaffFound")}
                      </p>
                    </div>
                  ) : (
                    filteredStaff.map((member) => {
                      const isSelected = selectedCoachId === member.userId;
                      return (
                        <div
                          key={member.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                            isSelected && "border-primary bg-primary/5"
                          )}
                          onClick={() => setSelectedCoachId(member.userId)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={member.user.image || undefined}
                              alt={member.user.name || "Staff"}
                            />
                            <AvatarFallback>
                              {getInitials(member.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {member.user.name || member.user.email}
                              </p>
                              <Badge
                                variant={getRoleBadgeVariant(member.role)}
                                className="text-xs"
                              >
                                {tVenues(`roles.${member.role}`)}
                              </Badge>
                            </div>
                            {member.user.email && member.user.name && (
                              <p className="text-xs text-muted-foreground">
                                {member.user.email}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      );
                    })
                  )}
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
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserCircle className="mr-2 h-4 w-4" />
                    )}
                    {selectedCoachId ? t("assignCoach") : t("removeCoach")}
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
