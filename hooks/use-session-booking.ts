import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

interface UseSessionBookingParams {
  venueId: string;
  userId?: string;
  onSuccess: () => void;
  optimisticBook?: (sessionId: string, bookingId: string) => void;
  optimisticCancelBooking?: (sessionId: string) => void;
}

export function useSessionBooking({
  venueId,
  userId,
  onSuccess,
  optimisticBook,
  optimisticCancelBooking,
}: UseSessionBookingParams) {
  const t = useTranslations("venues.sessions");
  const tBooking = useTranslations("venues.booking");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  );
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelInProgress, setCancelInProgress] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [sessionToCancel, setSessionToCancel] = useState<string | null>(null);

  // Get booking error message
  const getBookingErrorMessage = (reason: string): string => {
    const errorMap: Record<string, string> = {
      ALREADY_BOOKED: tBooking("alreadyBooked"),
      SESSION_FULL: tBooking("sessionFull"),
      NO_ACTIVE_SUBSCRIPTION: tBooking("noSubscription"),
      NOT_A_MEMBER: tBooking("notAllowed"),
      MEMBER_NOT_ACTIVE: tBooking("notAllowed"),
      SESSION_NOT_FOUND: tBooking("error"),
      SESSION_ALREADY_STARTED: tBooking("sessionAlreadyStarted"),
      BOOKING_DEADLINE_PASSED: tBooking("bookingDeadlinePassed"),
      LIMIT_REACHED: tBooking("limitReached"),
      OUTSIDE_TIME_WINDOW: tBooking("outsideTimeWindow"),
      SUBSCRIPTION_NOT_STARTED: tBooking("subscriptionNotStarted"),
      MAX_BOOKINGS_PER_DAY_REACHED: tBooking("limitReached"),
      MAX_BOOKINGS_PER_WEEK_REACHED: tBooking("limitReached"),
      MAX_BOOKINGS_PER_MONTH_REACHED: tBooking("maxBookingsPerMonthReached"),
      MAX_TOTAL_BOOKINGS_REACHED: tBooking("maxTotalBookingsReached"),
    };
    return errorMap[reason] || tBooking("error");
  };

  // Book session
  const handleBookSession = async (sessionId: string) => {
    if (!userId) {
      toast({
        title: t("signInToBook"),
        variant: "destructive",
      });
      return;
    }

    setBookingInProgress(sessionId);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/${sessionId}/book`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = getBookingErrorMessage(data.reason || "ERROR");
        throw new Error(errorMessage);
      }

      const booking = await response.json();

      // Optimistically update the UI immediately
      if (optimisticBook) {
        optimisticBook(sessionId, booking.id);
      }

      toast({
        title: t("bookingSuccess"),
        variant: "default",
      });

      // Background refresh to sync all data
      onSuccess();
    } catch (error) {
      console.error("Error booking session:", error);
      const errorMessage =
        error instanceof Error ? error.message : tBooking("error");
      toast({
        title: tCommon("error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(null);
    }
  };

  // Open cancel dialog
  const handleCancelBooking = (bookingId: string, sessionId?: string) => {
    setBookingToCancel(bookingId);
    setSessionToCancel(sessionId ?? null);
    setCancelDialogOpen(true);
  };

  // Map API cancellation reason to translation key
  const getCancellationErrorMessage = (
    reason: string,
    minimumMinutes?: number
  ): string => {
    const reasonMap: Record<string, string> = {
      BOOKING_NOT_FOUND: tBooking("error"),
      NOT_BOOKING_OWNER: tBooking("notBookingOwner"),
      ALREADY_CANCELLED: tBooking("alreadyCancelled"),
      ALREADY_ATTENDED: tBooking("alreadyAttended"),
      SESSION_ALREADY_STARTED: tBooking("sessionAlreadyStarted"),
      CANCELLATION_NOT_ALLOWED: tBooking("cancellationNotAllowed"),
      CANCELLATION_DEADLINE_PASSED: tBooking("cancellationDeadlinePassed", {
        minutes: minimumMinutes ?? 0,
      }),
    };
    return reasonMap[reason] || tBooking("error");
  };

  // Confirm cancel booking
  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    setCancelInProgress(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/bookings/${bookingToCancel}/cancel`,
        { method: "POST" }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = getCancellationErrorMessage(
          data.reason,
          data.minimumMinutes
        );
        throw new Error(errorMessage);
      }

      // Optimistically update the UI immediately
      if (optimisticCancelBooking && sessionToCancel) {
        optimisticCancelBooking(sessionToCancel);
      }

      toast({
        title: t("bookingCancelled"),
        variant: "default",
      });

      // Background refresh to sync all data
      onSuccess();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: tCommon("error"),
        description: error instanceof Error ? error.message : tBooking("error"),
        variant: "destructive",
      });
    } finally {
      setCancelInProgress(false);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      setSessionToCancel(null);
    }
  };

  return {
    bookingInProgress,
    cancelDialogOpen,
    cancelInProgress,
    setCancelDialogOpen,
    handleBookSession,
    handleCancelBooking,
    confirmCancelBooking,
  };
}
