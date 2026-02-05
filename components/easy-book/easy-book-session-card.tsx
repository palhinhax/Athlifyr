"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { useTranslations } from "next-intl";

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
  _count: {
    bookings: number;
  };
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface EasyBookSessionCardProps {
  session: VenueSession;
  locale: string;
  onBook: (session: {
    id: string;
    title: string;
    startsAt: string;
    endsAt: string;
  }) => void;
}

export function EasyBookSessionCard({
  session,
  locale,
  onBook,
}: EasyBookSessionCardProps) {
  const t = useTranslations("venues.sessions");
  const tEasyBook = useTranslations("easyBook");
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

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium">{session.title}</h4>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            {format(sessionStart, "HH:mm", { locale: dateLocale })} -{" "}
            {format(sessionEnd, "HH:mm", { locale: dateLocale })}
          </span>
          <span>•</span>
          <span>{t("minute", { count: duration })}</span>
        </div>

        {/* Capacity indicator */}
        {session.capacity && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Users className="h-3 w-3 text-muted-foreground" />
            {isFull ? (
              <Badge variant="destructive" className="px-1.5 py-0 text-xs">
                {t("full")}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">
                {t("spotsLeft", { count: spotsLeft ?? 0 })}
              </span>
            )}
          </div>
        )}
      </div>

      <Button
        size="sm"
        onClick={() =>
          onBook({
            id: session.id,
            title: session.title,
            startsAt: session.startsAt,
            endsAt: session.endsAt,
          })
        }
        disabled={isFull}
        className="shrink-0"
      >
        {tEasyBook("bookNow")}
      </Button>
    </div>
  );
}
