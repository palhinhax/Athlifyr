"use client";

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
} from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { useTranslations } from "next-intl";

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
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
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
  onBook?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  onEdit?: (session: VenueSession) => void;
  onDelete?: (session: VenueSession) => void;
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
  onBook,
  onCancel,
  onEdit,
  onDelete,
  bookingInProgress,
}: SessionDetailsDialogProps) {
  const t = useTranslations("venues.sessions");
  const tVenues = useTranslations("venues");
  const tBooking = useTranslations("venues.booking");
  const tWorkouts = useTranslations("workouts");
  const dateLocale = localeMap[locale] || enUS;

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

  const canBook =
    userId && hasActiveSubscription && !session.isBooked && !isFull;
  const canCancel = userId && session.isBooked;

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
            <div className="me-5 flex flex-col gap-1">
              {session.type === "CLASS" ? (
                <Badge variant="secondary">{t("class")}</Badge>
              ) : (
                <Badge variant="outline">
                  <User className="mr-1 h-3 w-3" />
                  {t("appointment")}
                </Badge>
              )}
              {session.isBooked && (
                <Badge variant="default">
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
                    <p className="text-xs text-muted-foreground">
                      {tVenues(`roles.${session.coach.role}`)}
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

          {/* Bookings (owner view) */}
          {isOwnerOrAdmin &&
            session.bookings &&
            session.bookings.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-2 font-medium">{t("bookings")}</h4>
                  <div className="space-y-2">
                    {session.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-2 rounded-md border p-2"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {booking.user.name || "Unknown User"}
                        </span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
        </div>

        <DialogFooter className="gap-2">
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

          {canCancel && onCancel && (
            <Button
              variant="outline"
              onClick={() => {
                onCancel(session.id);
                onOpenChange(false);
              }}
              className="flex-1"
            >
              {tBooking("cancel")}
            </Button>
          )}

          {isOwnerOrAdmin && (
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
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete?.(session);
                  onOpenChange(false);
                }}
              >
                {t("deleteSession")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
