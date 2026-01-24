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
import { Clock, Users, User, Tag, CheckCircle, Repeat } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
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
  const tBooking = useTranslations("venues.booking");
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
            <div className="flex flex-col gap-1">
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
              {session.recurringSessionId && (
                <Badge variant="outline">
                  <Repeat className="mr-1 h-3 w-3" />
                  {t("recurring")}
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
