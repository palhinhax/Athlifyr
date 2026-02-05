"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Dumbbell,
  History,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { Link } from "@/i18n/routing";

interface SessionWorkout {
  id: string;
  workout: {
    id: string;
    name: string;
  };
}

interface PastBooking {
  id: string;
  hasLoggedWorkout: boolean;
  session: {
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
    venue: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
    };
    sessionWorkouts: SessionWorkout[];
  };
}

interface ProfilePastSessionsProps {
  bookings: PastBooking[];
  locale: string;
}

const localeMap: Record<string, Locale> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

export function ProfilePastSessions({
  bookings,
  locale,
}: ProfilePastSessionsProps) {
  const t = useTranslations("profile");
  const tWorkouts = useTranslations("workouts");

  const dateLocale = localeMap[locale] || pt;

  if (bookings.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <History className="h-6 w-6 text-primary" />
        {t("pastSessionsCount", { count: bookings.length })}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {bookings.map((booking) => {
          const hasWorkout = booking.session.sessionWorkouts.length > 0;
          const workoutId = hasWorkout
            ? booking.session.sessionWorkouts[0].workout.id
            : null;

          return (
            <Card key={booking.id} className="p-4">
              <Link href={`/venues/${booking.session.venue.slug}`}>
                <div className="transition-colors hover:opacity-80">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold">{booking.session.title}</h3>
                    {hasWorkout && (
                      <Badge variant="secondary" className="ml-2">
                        <Dumbbell className="mr-1 h-3 w-3" />
                        {t("hasWorkout")}
                      </Badge>
                    )}
                  </div>
                  <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(booking.session.startsAt, "EEEE, d MMMM", {
                        locale: dateLocale,
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(booking.session.startsAt, "HH:mm")} -{" "}
                      {format(booking.session.endsAt, "HH:mm")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {booking.session.venue.name}
                      {booking.session.venue.city &&
                        `, ${booking.session.venue.city}`}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Log Workout Button - only if session has a workout */}
              {hasWorkout && workoutId && (
                <Button
                  variant={booking.hasLoggedWorkout ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link
                    href={`/workouts/${workoutId}/log?sessionId=${booking.session.id}`}
                  >
                    {booking.hasLoggedWorkout ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {t("workoutLogged")}
                      </>
                    ) : (
                      <>
                        <Dumbbell className="mr-2 h-4 w-4" />
                        {tWorkouts("log.title")}
                      </>
                    )}
                  </Link>
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
