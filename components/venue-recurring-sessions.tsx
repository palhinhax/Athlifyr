"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Clock,
  Users,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  RefreshCw,
  Calendar,
  Repeat,
} from "lucide-react";
import { format } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";

interface RecurringSession {
  id: string;
  venueId: string;
  type: "CLASS" | "APPOINTMENT";
  title: string;
  description: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number | null;
  tags: string[];
  isActive: boolean;
  generatedUntil: string | null;
  _count: {
    sessions: number;
  };
}

interface VenueRecurringSessionsProps {
  venueId: string;
  locale: string;
  isOwnerOrAdmin: boolean;
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

const dayOfWeekNames: Record<string, string[]> = {
  pt: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  es: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  fr: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  de: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  it: [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
};

export function VenueRecurringSessions({
  venueId,
  locale,
  isOwnerOrAdmin,
}: VenueRecurringSessionsProps) {
  const t = useTranslations("venues.sessions");
  const tRecurring = useTranslations("venues.recurring");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [recurringSessions, setRecurringSessions] = useState<
    RecurringSession[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] =
    useState<RecurringSession | null>(null);
  const [deleteFutureSessions, setDeleteFutureSessions] = useState(true);

  const dateLocale = localeMap[locale] || enUS;
  const dayNames = dayOfWeekNames[locale] || dayOfWeekNames.en;

  const fetchRecurringSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/venues/${venueId}/recurring-sessions`);

      if (!response.ok) {
        throw new Error("Failed to fetch recurring sessions");
      }

      const data = await response.json();
      setRecurringSessions(data.recurringSessions || []);
    } catch (error) {
      console.error("Error fetching recurring sessions:", error);
      toast({
        title: tCommon("error"),
        description: tRecurring("fetchError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [venueId, toast, tCommon, tRecurring]);

  useEffect(() => {
    if (isOwnerOrAdmin) {
      fetchRecurringSessions();
    }
  }, [isOwnerOrAdmin, fetchRecurringSessions]);

  const handleToggleActive = async (session: RecurringSession) => {
    try {
      setActionLoading(session.id);

      const response = await fetch(
        `/api/venues/${venueId}/recurring-sessions/${session.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !session.isActive }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update recurring session");
      }

      toast({
        title: session.isActive ? tRecurring("paused") : tRecurring("resumed"),
        variant: "default",
      });

      fetchRecurringSessions();
    } catch (error) {
      console.error("Error toggling recurring session:", error);
      toast({
        title: tCommon("error"),
        description: tRecurring("updateError"),
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (session: RecurringSession) => {
    setSessionToDelete(session);
    setDeleteFutureSessions(true);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;

    try {
      setActionLoading(sessionToDelete.id);

      const response = await fetch(
        `/api/venues/${venueId}/recurring-sessions/${sessionToDelete.id}?deleteFutureSessions=${deleteFutureSessions}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete recurring session");
      }

      toast({
        title: tRecurring("deleted"),
        variant: "default",
      });

      setDeleteDialogOpen(false);
      setSessionToDelete(null);
      fetchRecurringSessions();
    } catch (error) {
      console.error("Error deleting recurring session:", error);
      toast({
        title: tCommon("error"),
        description: tRecurring("deleteError"),
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateMore = async (session: RecurringSession) => {
    try {
      setActionLoading(session.id);

      const response = await fetch(
        `/api/venues/${venueId}/recurring-sessions/${session.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ weeks: 12 }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate sessions");
      }

      const data = await response.json();

      toast({
        title: tRecurring("generated"),
        description: tRecurring("generatedCount", { count: data.count }),
        variant: "default",
      });

      fetchRecurringSessions();
    } catch (error) {
      console.error("Error generating sessions:", error);
      toast({
        title: tCommon("error"),
        description: tRecurring("generateError"),
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOwnerOrAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            {tRecurring("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Spinner className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            {tRecurring("title")}
          </CardTitle>
          <CardDescription>{tRecurring("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {recurringSessions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Repeat className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {tRecurring("noRecurringSessions")}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {tRecurring("createHint")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recurringSessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    session.isActive ? "bg-card" : "bg-muted/50 opacity-60"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{session.title}</h4>
                      <Badge
                        variant={session.isActive ? "default" : "secondary"}
                      >
                        {session.isActive
                          ? tRecurring("active")
                          : tRecurring("paused")}
                      </Badge>
                      <Badge variant="outline">
                        {session.type === "CLASS"
                          ? t("class")
                          : t("appointment")}
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {dayNames[session.dayOfWeek]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.startTime} - {session.endTime}
                      </span>
                      {session.capacity && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {session.capacity}
                        </span>
                      )}
                      <span className="text-xs">
                        {tRecurring("sessionsGenerated", {
                          count: session._count.sessions,
                        })}
                      </span>
                    </div>

                    {session.generatedUntil && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {tRecurring("generatedUntil", {
                          date: format(
                            new Date(session.generatedUntil),
                            "PPP",
                            {
                              locale: dateLocale,
                            }
                          ),
                        })}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={actionLoading === session.id}
                      >
                        {actionLoading === session.id ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(session)}
                      >
                        {session.isActive ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            {tRecurring("pause")}
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            {tRecurring("resume")}
                          </>
                        )}
                      </DropdownMenuItem>
                      {session.isActive && (
                        <DropdownMenuItem
                          onClick={() => handleGenerateMore(session)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {tRecurring("generateMore")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteClick(session)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {tRecurring("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tRecurring("deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tRecurring("deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-center gap-2 rounded-lg border p-3">
            <input
              type="checkbox"
              id="deleteFutureSessions"
              checked={deleteFutureSessions}
              onChange={(e) => setDeleteFutureSessions(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="deleteFutureSessions" className="text-sm">
              {tRecurring("deleteFutureSessions")}
            </label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tRecurring("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
