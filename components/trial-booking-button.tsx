"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, GraduationCap } from "lucide-react";

interface TrialBookingButtonProps {
  venueId: string;
  venueName: string;
  userId?: string;
  enableTrialBooking: boolean;
  onSuccess?: () => void;
}

export function TrialBookingButton({
  venueId,
  venueName,
  userId,
  enableTrialBooking,
  onSuccess: _onSuccess,
}: TrialBookingButtonProps) {
  const t = useTranslations("venues.trialBooking");
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is eligible for trial booking
  useEffect(() => {
    async function checkEligibility() {
      if (!userId || !enableTrialBooking) {
        setIsEligible(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/venues/${venueId}/bookings/user?userId=${userId}`
        );

        if (response.ok) {
          const data = await response.json();
          // User is eligible if they have NO bookings at this venue
          setIsEligible(
            !data.bookings ||
              (Array.isArray(data.bookings) && data.bookings.length === 0)
          );
        } else {
          setIsEligible(false);
        }
      } catch (error) {
        console.error("Error checking trial eligibility:", error);
        setIsEligible(false);
      } finally {
        setLoading(false);
      }
    }

    checkEligibility();
  }, [userId, venueId, enableTrialBooking]);

  // Don't render if not enabled, not authenticated, or not eligible
  if (!enableTrialBooking || !userId || loading) {
    return null;
  }

  if (!isEligible) {
    return null;
  }

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleRequestTrial = async () => {
    setSubmitting(true);
    // This will open the session selection dialog
    // For now, we'll just show a message
    toast({
      title: t("bookTrial"),
      description: t("requestDescription"),
    });
    setDialogOpen(false);
    setSubmitting(false);
  };

  return (
    <>
      <Button onClick={handleOpenDialog} variant="outline" className="gap-2">
        <GraduationCap className="h-4 w-4" />
        {t("bookTrial")}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("requestDescription")}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              {t("selectSessionPrompt", { venueName })}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleRequestTrial} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("bookTrial")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
