"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { Link } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";

interface VenueBooking {
  id: string;
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
  };
}

interface ProfileUpcomingSessionsProps {
  bookings: VenueBooking[];
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

export function ProfileUpcomingSessions({
  bookings: initialBookings,
  locale,
}: ProfileUpcomingSessionsProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const tVenues = useTranslations("venues.booking");
  const { toast } = useToast();

  const [bookings, setBookings] = useState(initialBookings);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<VenueBooking | null>(
    null
  );
  const [cancelInProgress, setCancelInProgress] = useState(false);

  const dateLocale = localeMap[locale] || pt;

  const openCancelDialog = (booking: VenueBooking, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setCancelInProgress(true);

    try {
      const response = await fetch(
        `/api/venues/${bookingToCancel.session.venue.id}/bookings/${bookingToCancel.id}/cancel`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      toast({
        title: tVenues("cancelled"),
        variant: "default",
      });

      // Remove booking from list
      setBookings((prev) => prev.filter((b) => b.id !== bookingToCancel.id));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancelInProgress(false);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  if (bookings.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Clock className="h-6 w-6 text-primary" />
          {t("upcomingSessionsCount", { count: bookings.length })}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <Card key={booking.id} className="p-4">
              <Link href={`/venues/${booking.session.venue.slug}`}>
                <div className="transition-colors hover:opacity-80">
                  <h3 className="mb-2 font-semibold">
                    {booking.session.title}
                  </h3>
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
              <Button
                variant="outline"
                size="sm"
                className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  openCancelDialog(booking, e);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                {tVenues("cancelBooking")}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Cancel booking dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tVenues("confirmCancel")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tVenues("confirmCancelDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelInProgress}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              disabled={cancelInProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelInProgress ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {tVenues("cancelBooking")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
