import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

interface UseSessionBookingParams {
  venueId: string;
  userId?: string;
  onSuccess: () => void;
}

export function useSessionBooking({
  venueId,
  userId,
  onSuccess,
}: UseSessionBookingParams) {
  const t = useTranslations("venues.sessions");
  const tBooking = useTranslations("venues.booking");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  );
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
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
      LIMIT_REACHED: tBooking("limitReached"),
      OUTSIDE_TIME_WINDOW: tBooking("outsideTimeWindow"),
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

      toast({
        title: t("bookingSuccess"),
        variant: "default",
      });

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
  const handleCancelBooking = (sessionId: string) => {
    setSessionToCancel(sessionId);
    setCancelDialogOpen(true);
  };

  // Confirm cancel booking
  const confirmCancelBooking = async () => {
    if (!sessionToCancel) return;

    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/${sessionToCancel}/cancel`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      toast({
        title: t("cancellationSuccess"),
        variant: "default",
      });

      onSuccess();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: tCommon("error"),
        description: tBooking("error"),
        variant: "destructive",
      });
    } finally {
      setCancelDialogOpen(false);
      setSessionToCancel(null);
    }
  };

  return {
    bookingInProgress,
    cancelDialogOpen,
    setCancelDialogOpen,
    handleBookSession,
    handleCancelBooking,
    confirmCancelBooking,
  };
}
