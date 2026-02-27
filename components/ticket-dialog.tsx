"use client";

import { Ticket, MapPin, Calendar, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventDate: Date | string;
  eventCity: string;
  variantName?: string | null;
  bibNumber?: string | null;
  registrationId: string;
  participantName?: string | null;
}

export function TicketDialog({
  open,
  onOpenChange,
  eventTitle,
  eventDate,
  eventCity,
  variantName,
  bibNumber,
  registrationId,
  participantName,
}: TicketDialogProps) {
  const t = useTranslations("events.registration");

  const formattedDate = new Date(eventDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            {t("ticketTitle")}
          </DialogTitle>
        </DialogHeader>

        {/* Ticket card */}
        <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-card">
          {/* Header strip */}
          <div className="bg-primary px-4 py-3 text-primary-foreground">
            <p className="text-xs font-medium uppercase tracking-wider opacity-80">
              {t("ticketConfirmed")}
            </p>
            <h3 className="mt-0.5 text-base font-bold leading-tight">
              {eventTitle}
            </h3>
          </div>

          {/* Divider with notches */}
          <div className="relative flex items-center">
            <div className="-ml-3 h-6 w-6 rounded-full bg-background" />
            <div className="flex-1 border-t-2 border-dashed border-border" />
            <div className="-mr-3 h-6 w-6 rounded-full bg-background" />
          </div>

          {/* Body */}
          <div className="space-y-3 px-4 pb-4">
            {participantName && (
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("ticketParticipant")}
                  </p>
                  <p className="text-sm font-semibold">{participantName}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("ticketDate")}
                </p>
                <p className="text-sm font-semibold">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("ticketLocation")}
                </p>
                <p className="text-sm font-semibold">{eventCity}</p>
              </div>
            </div>

            {variantName && (
              <div className="flex items-start gap-3">
                <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("ticketVariant")}
                  </p>
                  <p className="text-sm font-semibold">{variantName}</p>
                </div>
              </div>
            )}

            {bibNumber && (
              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("ticketBib")}
                  </p>
                  <p className="text-sm font-semibold">{bibNumber}</p>
                </div>
              </div>
            )}

            {/* Registration reference */}
            <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">{t("ticketId")}</p>
              <p className="mt-0.5 font-mono text-xs font-medium text-foreground">
                {registrationId.toUpperCase().slice(-12)}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          {t("ticketClose")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
