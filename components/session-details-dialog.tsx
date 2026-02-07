"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Users,
  User,
  Tag,
  CheckCircle,
  Dumbbell,
  UserCircle,
  ClipboardList,
  UserPlus,
  X,
  Loader2,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { format, parseISO, differenceInMinutes, isPast } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AddParticipantDialog } from "@/components/add-participant-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getBookingTimeStatus,
  formatTimeUntilBookable,
} from "@/lib/venues/booking-status";

// Helper function to format exercise prescription
function formatExercisePrescription(ex: {
  prescribedReps: number | null;
  prescribedWeight: number | null;
  prescribedWeightUnit: string | null;
  prescribedDistance: number | null;
  prescribedDistanceUnit: string | null;
  prescribedTime: number | null;
  prescribedCalories: number | null;
  prescribedSets: number | null;
}): string {
  const parts: string[] = [];

  if (ex.prescribedSets) {
    parts.push(`${ex.prescribedSets}x`);
  }

  if (ex.prescribedReps) {
    parts.push(`${ex.prescribedReps}`);
  }

  if (ex.prescribedWeight) {
    const unit = ex.prescribedWeightUnit || "kg";
    parts.push(`@ ${ex.prescribedWeight}${unit}`);
  }

  if (ex.prescribedDistance) {
    const unit = ex.prescribedDistanceUnit || "m";
    parts.push(`${ex.prescribedDistance}${unit}`);
  }

  if (ex.prescribedTime) {
    if (ex.prescribedTime >= 60) {
      const mins = Math.floor(ex.prescribedTime / 60);
      const secs = ex.prescribedTime % 60;
      parts.push(
        secs > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${mins} min`
      );
    } else {
      parts.push(`${ex.prescribedTime}s`);
    }
  }

  if (ex.prescribedCalories) {
    parts.push(`${ex.prescribedCalories} cal`);
  }

  return parts.join(" ") || "";
}

interface SessionBooking {
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

interface SessionCoach {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: {
    name: string;
  };
  prescribedReps: number | null;
  prescribedWeight: number | null;
  prescribedWeightUnit: string | null;
  prescribedDistance: number | null;
  prescribedDistanceUnit: string | null;
  prescribedTime: number | null;
  prescribedCalories: number | null;
  prescribedSets: number | null;
  notes: string | null;
}

interface WorkoutBlock {
  id: string;
  type: string;
  name: string | null;
  rounds: number | null;
  timeCap: number | null;
  notes: string | null;
  exercises: WorkoutExercise[];
}

interface SessionWorkout {
  id: string;
  workout: {
    id: string;
    name: string;
    description: string | null;
    estimatedTime: number | null;
    difficulty: string | null;
    blocks?: WorkoutBlock[];
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
  coach?: SessionCoach | null;
  workouts?: SessionWorkout[];
  bookings?: SessionBooking[];
  _count: {
    bookings: number;
  };
  isBooked?: boolean;
  userBookingId?: string;
  bookingAdvanceDays?: number;
  bookingDeadlineMinutes?: number;
  cancellationDeadlineMinutes?: number;
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface SessionDetailsDialogProps {
  session: VenueSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
  userId?: string;
  hasActiveSubscription?: boolean;
  isOwnerOrAdmin?: boolean;
  canEditSessions?: boolean; // Coach or higher can edit sessions
  onBook?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  onEdit?: (session: VenueSession) => void;
  onDelete?: (session: VenueSession) => void;
  onParticipantAdded?: () => void;
  bookingInProgress?: string | null;
}

export function SessionDetailsDialog({
  session,
  open,
  onOpenChange,
  locale,
  userId,
  hasActiveSubscription = false,
  isOwnerOrAdmin = false,
  canEditSessions = false,
  onBook,
  onCancel,
  onEdit,
  onDelete,
  onParticipantAdded,
  bookingInProgress,
}: SessionDetailsDialogProps) {
  const [addParticipantOpen, setAddParticipantOpen] = useState(false);
  const [removingParticipant, setRemovingParticipant] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const t = useTranslations("venues.sessions");
  const tBooking = useTranslations("venues.booking");
  const tWorkouts = useTranslations("workouts");
  const tCommon = useTranslations("common");
  const dateLocale = localeMap[locale] || enUS;

  // Handle removing a participant
  const handleRemoveParticipant = async (bookingId: string) => {
    if (!session) return;

    setRemovingParticipant(bookingId);
    try {
      const response = await fetch(
        `/api/venues/${session.venueId}/sessions/${session.id}/remove-participant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove participant");
      }

      toast({
        title: t("participantRemoved"),
        description: t("participantRemovedDescription"),
      });

      // Refresh the session data
      onParticipantAdded?.();
    } catch (error) {
      console.error("Error removing participant:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error
            ? error.message
            : "Failed to remove participant",
        variant: "destructive",
      });
    } finally {
      setRemovingParticipant(null);
    }
  };

  if (!session) return null;

  const sessionStart = parseISO(session.startsAt);
  const sessionEnd = parseISO(session.endsAt);
  const duration = differenceInMinutes(sessionEnd, sessionStart);
  const isFull = session.capacity
    ? session._count.bookings >= session.capacity
    : false;
  const spotsLeft = session.capacity
    ? session.capacity - session._count.bookings
    : null;

  // Get booking time status with proper defaults
  const bookingTimeStatus = getBookingTimeStatus({
    sessionStartsAt: session.startsAt,
    bookingAdvanceDays: session.bookingAdvanceDays ?? 4,
    bookingDeadlineMinutes: session.bookingDeadlineMinutes ?? 0,
    cancellationDeadlineMinutes: session.cancellationDeadlineMinutes ?? 30,
    isBooked: session.isBooked,
  });

  // Determine if user can book/cancel based on time AND other conditions
  const canBook =
    userId &&
    hasActiveSubscription &&
    !session.isBooked &&
    !isFull &&
    bookingTimeStatus.canBook;
  const canCancel = userId && session.isBooked && bookingTimeStatus.canCancel;

  // Format time until bookable for display
  const timeUntilBookableText = bookingTimeStatus.timeUntilBookable
    ? formatTimeUntilBookable(bookingTimeStatus.timeUntilBookable, {
        days: (count) => t("daysCount", { count }),
        hours: (count) => t("hoursCount", { count }),
        minutes: (count) => t("minutesCount", { count }),
      })
    : "";

  // Check if user can log workout (past session with workout that user attended)
  const isPastSession = isPast(sessionStart);
  const hasWorkout = session.workouts && session.workouts.length > 0;
  const canLogWorkout = isPastSession && hasWorkout && session.isBooked;
  const workoutId = hasWorkout ? session.workouts![0].workout.id : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <DialogTitle className="text-xl">{session.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {format(sessionStart, "PPP", { locale: dateLocale })}
              </DialogDescription>
            </div>
            <div className="me-5 flex gap-1">
              {session.type === "CLASS" ? (
                <Badge variant="secondary">{t("class")}</Badge>
              ) : (
                <Badge variant="outline">
                  <User className="mr-1 h-3 w-3" />
                  {t("appointment")}
                </Badge>
              )}
              {session.isBooked && (
                <Badge variant="success">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {t("booked")}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(sessionStart, "HH:mm", { locale: dateLocale })} -{" "}
              {format(sessionEnd, "HH:mm", { locale: dateLocale })} ({duration}{" "}
              {t("minutes")})
            </span>
          </div>

          {/* Capacity */}
          {session.capacity && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {session._count.bookings} / {session.capacity}{" "}
                {t("participants")}
              </span>
              {isFull ? (
                <Badge variant="destructive" className="ml-auto">
                  {t("full")}
                </Badge>
              ) : spotsLeft !== null && spotsLeft <= 3 ? (
                <span className="ml-auto text-sm text-orange-600">
                  {t("spotsLeft", { count: spotsLeft })}
                </span>
              ) : null}
            </div>
          )}

          {/* Description */}
          {session.description && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 font-medium">{t("description")}</h4>
                <p className="text-sm text-muted-foreground">
                  {session.description}
                </p>
              </div>
            </>
          )}

          {/* Tags */}
          {session.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-medium">
                  <Tag className="h-4 w-4" />
                  {t("tags")}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {session.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Coach/Professional */}
          {session.coach && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-medium">
                  <UserCircle className="h-4 w-4" />
                  {t("assignedProfessional")}
                </h4>
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.coach.user.image || undefined}
                      alt={session.coach.user.name || ""}
                    />
                    <AvatarFallback>
                      {session.coach.user.name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {session.coach.user.name || t("unknownUser")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Workouts */}
          {session.workouts && session.workouts.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-medium">
                  <Dumbbell className="h-4 w-4" />
                  {t("workout")}
                </h4>
                <div className="space-y-3">
                  {session.workouts.map((sw) => (
                    <div
                      key={sw.id}
                      className="space-y-3 rounded-md border p-3"
                    >
                      {/* Workout Header */}
                      <div className="flex items-start justify-between">
                        <p className="text-lg font-semibold">
                          {sw.workout.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {sw.workout.estimatedTime && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {sw.workout.estimatedTime} min
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Difficulty */}
                      {sw.workout.difficulty && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-4 rounded-sm ${
                                i < Number(sw.workout.difficulty)
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {tWorkouts(
                              `form.difficultyLevels.${sw.workout.difficulty}`
                            )}
                          </span>
                        </div>
                      )}

                      {/* Workout Description */}
                      {sw.workout.description && (
                        <p className="text-sm text-muted-foreground">
                          {sw.workout.description}
                        </p>
                      )}

                      {/* Workout Blocks */}
                      {sw.workout.blocks && sw.workout.blocks.length > 0 && (
                        <div className="space-y-3 pt-2">
                          {sw.workout.blocks.map((block) => (
                            <div
                              key={block.id}
                              className="rounded-md bg-muted/50 p-3"
                            >
                              {/* Block Header */}
                              <div className="mb-2 flex items-center gap-2">
                                <Badge
                                  variant="default"
                                  className="text-xs font-medium"
                                >
                                  {block.type === "AMRAP"
                                    ? "AMRAP"
                                    : block.type === "FOR_TIME"
                                      ? "For Time"
                                      : block.type === "EMOM"
                                        ? "EMOM"
                                        : block.type === "TABATA"
                                          ? "Tabata"
                                          : block.type === "STRENGTH"
                                            ? "Strength"
                                            : block.type}
                                </Badge>
                                {block.name && (
                                  <span className="text-sm font-medium">
                                    {block.name}
                                  </span>
                                )}
                                {block.timeCap && (
                                  <span className="text-xs text-muted-foreground">
                                    ({Math.floor(block.timeCap / 60)} min)
                                  </span>
                                )}
                                {block.rounds && (
                                  <span className="text-xs text-muted-foreground">
                                    ({block.rounds}{" "}
                                    {block.rounds === 1 ? "round" : "rounds"})
                                  </span>
                                )}
                              </div>

                              {/* Block Notes */}
                              {block.notes && (
                                <p className="mb-2 text-xs italic text-muted-foreground">
                                  {block.notes}
                                </p>
                              )}

                              {/* Exercises */}
                              {block.exercises &&
                                block.exercises.length > 0 && (
                                  <ul className="space-y-1">
                                    {block.exercises.map((ex) => (
                                      <li
                                        key={ex.id}
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="font-medium">
                                          {formatExercisePrescription(ex)}
                                        </span>
                                        <span>{ex.exercise.name}</span>
                                        {ex.notes && (
                                          <span className="text-xs text-muted-foreground">
                                            ({ex.notes})
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Bookings (coach/admin view) */}
          {canEditSessions &&
            session.bookings &&
            session.bookings.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{t("bookings")}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddParticipantOpen(true)}
                    >
                      <UserPlus className="mr-1 h-4 w-4" />
                      {t("addParticipant")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {session.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-2 rounded-md border p-2"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm">
                          {booking.user?.name ||
                            booking.guestName ||
                            "Unknown User"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {booking.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveParticipant(booking.id)}
                          disabled={removingParticipant === booking.id}
                        >
                          {removingParticipant === booking.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          {/* Add Participant button when no bookings yet (coach/admin view) */}
          {canEditSessions &&
            (!session.bookings || session.bookings.length === 0) && (
              <>
                <Separator />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{t("bookings")}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddParticipantOpen(true)}
                    >
                      <UserPlus className="mr-1 h-4 w-4" />
                      {t("addParticipant")}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("noBookingsYet")}
                  </p>
                </div>
              </>
            )}
        </div>

        {/* Add Participant Dialog */}
        {canEditSessions && (
          <AddParticipantDialog
            open={addParticipantOpen}
            onOpenChange={setAddParticipantOpen}
            venueId={session.venueId}
            sessionId={session.id}
            onSuccess={() => {
              setAddParticipantOpen(false);
              onParticipantAdded?.();
            }}
          />
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {/* Show booking status message when user can't book due to time constraints */}
          {userId &&
            hasActiveSubscription &&
            !session.isBooked &&
            !isFull &&
            !bookingTimeStatus.canBook && (
              <div className="flex w-full items-center justify-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground sm:w-auto sm:flex-1">
                <CalendarClock className="h-4 w-4 flex-shrink-0" />
                <span>
                  {bookingTimeStatus.isPast
                    ? t("sessionPast")
                    : bookingTimeStatus.isNotYetBookable
                      ? t("bookingAvailableIn", { time: timeUntilBookableText })
                      : bookingTimeStatus.isTooLateToBook
                        ? t("bookingClosed")
                        : null}
                </span>
              </div>
            )}

          {/* Show cancellation closed message */}
          {userId &&
            session.isBooked &&
            !bookingTimeStatus.canCancel &&
            !bookingTimeStatus.isPast && (
              <div className="flex w-full items-center justify-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground sm:w-auto sm:flex-1">
                <XCircle className="h-4 w-4 flex-shrink-0" />
                <span>{t("cancellationClosed")}</span>
              </div>
            )}

          {/* Log Workout button for past sessions */}
          {canLogWorkout && workoutId && (
            <Button asChild className="flex-1">
              <Link href={`/workouts/${workoutId}/log?sessionId=${session.id}`}>
                <ClipboardList className="mr-2 h-4 w-4" />
                {tWorkouts("log.title")}
              </Link>
            </Button>
          )}

          {canBook && onBook && (
            <Button
              onClick={() => {
                onBook(session.id);
                onOpenChange(false);
              }}
              disabled={bookingInProgress === session.id}
              className="flex-1"
            >
              {bookingInProgress === session.id
                ? t("booking")
                : tBooking("book")}
            </Button>
          )}

          {canCancel && onCancel && session.userBookingId && (
            <Button
              variant="outline"
              onClick={() => {
                onCancel(session.userBookingId!);
                onOpenChange(false);
              }}
              className="flex-1"
            >
              {tBooking("cancel")}
            </Button>
          )}

          {canEditSessions && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onEdit?.(session);
                  onOpenChange(false);
                }}
              >
                {t("editSession")}
              </Button>
              {isOwnerOrAdmin && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete?.(session);
                    onOpenChange(false);
                  }}
                >
                  {t("deleteSession")}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
