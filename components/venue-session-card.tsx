"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Users,
  User,
  CheckCircle,
  Pencil,
  Trash2,
  UserCircle,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  getBookingTimeStatus,
  formatTimeUntilBookable,
} from "@/lib/venues/booking-status";

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
  userId: string;
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
  coach?: SessionCoach | null;
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

export interface VenueSessionCardProps {
  session: VenueSession;
  locale: string;
  userId?: string;
  hasActiveSubscription?: boolean;
  isOwnerOrAdmin?: boolean;
  canEditSessions?: boolean; // Coach or higher can edit sessions
  isCompact?: boolean;
  onBook?: (sessionId: string) => void;
  onCancel?: (bookingId: string, sessionId?: string) => void;
  onEdit?: (session: VenueSession) => void;
  onDelete?: (session: VenueSession) => void;
  onClick?: (session: VenueSession) => void;
  bookingInProgress?: string | null;
}

export function VenueSessionCard({
  session,
  locale,
  userId,
  hasActiveSubscription = false,
  isOwnerOrAdmin = false,
  canEditSessions = false,
  isCompact = false,
  onBook,
  onCancel,
  onEdit,
  onDelete,
  onClick,
  bookingInProgress,
}: VenueSessionCardProps) {
  const t = useTranslations("venues.sessions");
  const tBooking = useTranslations("venues.booking");
  const dateLocale = localeMap[locale] || enUS;

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

  return (
    <div
      onClick={() => onClick?.(session)}
      className={cn(
        "group relative rounded-lg border bg-card p-3 transition-all hover:shadow-md",
        onClick && "cursor-pointer",
        isCompact && "p-2",
        bookingTimeStatus.isPast && "opacity-60"
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4
            className={cn("font-medium", isCompact ? "text-sm" : "text-base")}
          >
            {session.title}
          </h4>
        </div>

        {/* Badges */}
        <div className="flex items-end gap-1">
          {session.type === "CLASS" ? (
            <Badge variant="secondary" className="text-xs">
              {t("class")}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              <User className="mr-1 h-3 w-3" />
              {t("appointment")}
            </Badge>
          )}

          {session.isBooked && (
            <Badge variant="success" className="text-xs">
              <CheckCircle className="mr-1 h-3 w-3" />
              {t("booked")}
            </Badge>
          )}
        </div>
      </div>

      {/* Time + Coach row */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span>
            {format(sessionStart, "HH:mm", { locale: dateLocale })} -{" "}
            {format(sessionEnd, "HH:mm", { locale: dateLocale })}
          </span>
          <span className="mx-0.5">•</span>
          <span>{t("minute", { count: duration })}</span>
        </div>

        {/* Coach */}
        {session.coach && (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={session.coach.user.image || undefined}
                alt={session.coach.user.name || ""}
              />
              <AvatarFallback className="text-[10px]">
                {session.coach.user.name?.charAt(0)?.toUpperCase() || (
                  <UserCircle className="h-3 w-3" />
                )}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate text-xs text-muted-foreground">
              {session.coach.user.name}
            </span>
          </div>
        )}
      </div>

      {/* Capacity row */}
      <div className="mb-2 flex items-center gap-2">
        {/* Capacity */}
        {session.capacity ? (
          <div className="flex items-center gap-1 text-xs">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {session._count.bookings} / {session.capacity}
            </span>
            {isFull ? (
              <Badge variant="destructive" className="ml-1 text-xs">
                {t("full")}
              </Badge>
            ) : spotsLeft !== null && spotsLeft <= 3 ? (
              <span className="ml-1 text-xs text-orange-600">
                {t("spotsLeft", { count: spotsLeft })}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Actions */}
      {!isCompact && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Show booking status message when user can't book due to time constraints */}
          {userId &&
            hasActiveSubscription &&
            !session.isBooked &&
            !isFull &&
            !bookingTimeStatus.canBook && (
              <div className="flex flex-1 items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {bookingTimeStatus.isPast
                    ? t("sessionPast")
                    : bookingTimeStatus.isNotYetBookable
                      ? t("bookingAvailableIn", { time: timeUntilBookableText })
                      : t("bookingClosed")}
                </span>
              </div>
            )}

          {/* Show cancellation closed message */}
          {userId &&
            session.isBooked &&
            !bookingTimeStatus.canCancel &&
            !bookingTimeStatus.isPast && (
              <div className="flex flex-1 items-center gap-1.5 text-xs text-muted-foreground">
                <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{t("cancellationClosed")}</span>
              </div>
            )}

          {canBook && onBook && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onBook(session.id);
              }}
              disabled={bookingInProgress === session.id}
              className="flex-1 text-xs"
            >
              {bookingInProgress === session.id
                ? t("booking")
                : tBooking("book")}
            </Button>
          )}

          {canCancel && onCancel && session.userBookingId && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(session.userBookingId!, session.id);
              }}
              className="flex-1 text-xs"
            >
              {tBooking("cancel")}
            </Button>
          )}

          {/* Coaches can edit sessions */}
          {canEditSessions && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(session);
              }}
              className="text-xs"
            >
              <Pencil className="mr-1 h-3 w-3" />
              {t("editSession")}
            </Button>
          )}

          {/* Only owners/admins can delete future sessions */}
          {isOwnerOrAdmin && !bookingTimeStatus.isPast && (
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(session);
              }}
              className="text-xs"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              {t("deleteSession")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
