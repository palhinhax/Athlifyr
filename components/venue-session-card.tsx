"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, User, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

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

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface VenueSessionCardProps {
  session: VenueSession;
  locale: string;
  userId?: string;
  hasActiveSubscription?: boolean;
  isOwnerOrAdmin?: boolean;
  isCompact?: boolean;
  onBook?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
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

  const canBook =
    userId && hasActiveSubscription && !session.isBooked && !isFull;
  const canCancel = userId && session.isBooked;

  return (
    <div
      onClick={() => onClick?.(session)}
      className={cn(
        "group relative rounded-lg border bg-card p-3 transition-all hover:shadow-md",
        onClick && "cursor-pointer",
        isCompact && "p-2"
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
          <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>
              {format(sessionStart, "HH:mm", { locale: dateLocale })} -{" "}
              {format(sessionEnd, "HH:mm", { locale: dateLocale })}
            </span>
            <span className="mx-0.5">•</span>
            <span>{t("minute", { count: duration })}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1">
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
            <Badge variant="default" className="text-xs">
              <CheckCircle className="mr-1 h-3 w-3" />
              {t("booked")}
            </Badge>
          )}
        </div>
      </div>

      {/* Capacity */}
      {session.capacity && (
        <div className="mb-2 flex items-center gap-1 text-xs">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">
            {session._count.bookings} / {session.capacity}
          </span>
          {isFull ? (
            <Badge variant="destructive" className="ml-auto text-xs">
              {t("full")}
            </Badge>
          ) : spotsLeft !== null && spotsLeft <= 3 ? (
            <span className="ml-auto text-xs text-orange-600">
              {t("spotsLeft", { count: spotsLeft })}
            </span>
          ) : null}
        </div>
      )}

      {/* Actions */}
      {!isCompact && (
        <div className="mt-3 flex flex-wrap gap-2">
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

          {canCancel && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(session.id);
              }}
              className="flex-1 text-xs"
            >
              {tBooking("cancel")}
            </Button>
          )}

          {isOwnerOrAdmin && (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
