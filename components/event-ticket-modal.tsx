"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Loader2,
  Download,
  CheckCircle,
  Calendar,
  MapPin,
  Trophy,
  CreditCard,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TicketData {
  token: string;
  registrationId: string;
  bibNumber: string | null;
  checkedInAt: string | null;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  event: {
    title: string;
    slug: string;
    startDate: string | null;
    city: string;
    country: string;
    imageUrl: string | null;
  };
  variant: {
    name: string;
    distanceKm: number | null;
    startDate: string | null;
    startTime: string | null;
  };
}

interface EventTicketModalProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function EventTicketModal({
  eventId,
  open,
  onOpenChange,
}: EventTicketModalProps) {
  const t = useTranslations("events.ticket");
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const ticketRef = useRef<HTMLDivElement>(null);

  // ─── Fetch ticket ────────────────────────────────────────────────────────

  const fetchTicket = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/registration/ticket`);
      if (!res.ok) throw new Error("Failed to fetch ticket");
      const data = (await res.json()) as { ticket: TicketData };
      setTicket(data.ticket);

      // Generate QR code as data URL
      const qr = await QRCode.toDataURL(data.ticket.token, {
        width: 250,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(qr);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (open) {
      void fetchTicket();
    } else {
      setTicket(null);
      setQrDataUrl("");
    }
  }, [open, fetchTicket]);

  // ─── Download ticket as image ──────────────────────────────────────────

  const handleDownload = async () => {
    if (!ticketRef.current || !ticket) return;

    try {
      // Use html2canvas-like approach with canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 400;
      const height = 620;
      const dpr = 2;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Background
      ctx.fillStyle = "#FFFFFF";
      ctx.roundRect(0, 0, width, height, 16);
      ctx.fill();

      // Brand header
      ctx.fillStyle = "#7C3AED";
      ctx.roundRect(0, 0, width, 80, [16, 16, 0, 0]);
      ctx.fill();

      // Event title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      const title = ticket.event.title;
      ctx.fillText(
        title.length > 30 ? title.substring(0, 30) + "..." : title,
        width / 2,
        38
      );

      // Location
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      ctx.fillText(
        `${ticket.event.city}, ${ticket.event.country}`,
        width / 2,
        60
      );

      // Dashed divider
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, 92);
      ctx.lineTo(width - 20, 92);
      ctx.stroke();
      ctx.setLineDash([]);

      // Participant name
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
      ctx.fillText(ticket.user.name ?? ticket.user.email, width / 2, 125);

      // Variant
      ctx.fillStyle = "#6B7280";
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      let variantText = ticket.variant.name;
      if (ticket.variant.distanceKm) {
        variantText += ` — ${ticket.variant.distanceKm}km`;
      }
      ctx.fillText(variantText, width / 2, 150);

      // Bib number
      if (ticket.bibNumber) {
        ctx.fillStyle = "#7C3AED";
        ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
        ctx.fillText(`#${ticket.bibNumber}`, width / 2, 185);
      }

      // QR Code
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          qrImg.onload = () => {
            const qrSize = 200;
            const qrX = (width - qrSize) / 2;
            const qrY = ticket.bibNumber ? 200 : 170;
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
            resolve();
          };
          qrImg.src = qrDataUrl;
        });
      }

      // Date info at bottom
      const dateY = ticket.bibNumber ? 430 : 400;
      ctx.fillStyle = "#6B7280";
      ctx.font = "12px system-ui, -apple-system, sans-serif";
      if (ticket.variant.startDate) {
        const dateStr = new Date(ticket.variant.startDate).toLocaleDateString(
          undefined,
          { day: "numeric", month: "long", year: "numeric" }
        );
        ctx.fillText(dateStr, width / 2, dateY);
      }

      // Amount
      const amountY = dateY + 20;
      const amount = (ticket.amountCents / 100).toLocaleString(undefined, {
        style: "currency",
        currency: ticket.currency,
      });
      ctx.fillText(amount, width / 2, amountY);

      // Verified badge
      const badgeY = amountY + 30;
      ctx.fillStyle = "#059669";
      ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
      ctx.fillText("✓ Verified by Athlifyr", width / 2, badgeY);

      // Footer
      ctx.fillStyle = "#D1D5DB";
      ctx.font = "10px system-ui, -apple-system, sans-serif";
      ctx.fillText("athlifyr.com", width / 2, height - 16);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `ticket-${ticket.event.slug}-${ticket.registrationId.slice(-6)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading ticket:", error);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !ticket ? (
          <div className="py-20 text-center text-muted-foreground">
            <p>{t("noTicket")}</p>
          </div>
        ) : (
          <div ref={ticketRef} className="flex flex-col">
            {/* Header with event info */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 text-white">
              <h2 className="text-lg font-bold leading-tight">
                {ticket.event.title}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {ticket.event.city}, {ticket.event.country}
                </span>
              </div>
              {ticket.variant.startDate && (
                <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(ticket.variant.startDate).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                    {ticket.variant.startTime && (
                      <span className="ml-1">• {ticket.variant.startTime}</span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Dashed separator */}
            <div className="relative">
              <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-background" />
              <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background" />
              <div className="border-t-2 border-dashed border-muted-foreground/20" />
            </div>

            {/* Ticket body */}
            <div className="px-6 py-5">
              {/* Participant */}
              <div className="mb-4 text-center">
                <p className="text-lg font-bold">
                  {ticket.user.name ?? ticket.user.email}
                </p>
                <div className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>
                    {ticket.variant.name}
                    {ticket.variant.distanceKm &&
                      ` — ${ticket.variant.distanceKm}km`}
                  </span>
                </div>
              </div>

              {/* Bib Number */}
              {ticket.bibNumber && (
                <div className="mb-4 text-center">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("bibNumber")}
                  </span>
                  <p className="text-3xl font-black text-purple-600">
                    #{ticket.bibNumber}
                  </p>
                </div>
              )}

              {/* QR Code */}
              <div className="flex flex-col items-center">
                {qrDataUrl ? (
                  <div className="rounded-xl border-2 border-muted bg-white p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="Ticket QR Code"
                      width={200}
                      height={200}
                      className="h-[200px] w-[200px]"
                    />
                  </div>
                ) : (
                  <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl border-2 border-muted bg-muted/20">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {t("qrCodeInfo")}
                </p>
              </div>

              {/* Details row */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <CreditCard className="h-3 w-3" />
                    {t("amount")}
                  </span>
                  <p className="mt-0.5 text-sm font-semibold">
                    {(ticket.amountCents / 100).toLocaleString(undefined, {
                      style: "currency",
                      currency: ticket.currency,
                    })}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3" />
                    {t("status")}
                  </span>
                  <p className="mt-0.5 text-sm font-semibold text-green-600">
                    {t("confirmed")}
                  </p>
                </div>
              </div>

              {/* Checked-in badge */}
              {ticket.checkedInAt && (
                <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <Clock className="h-4 w-4" />
                  {t("checkedInAt", {
                    time: new Date(ticket.checkedInAt).toLocaleString(),
                  })}
                </div>
              )}

              {/* Verified badge */}
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Badge
                  variant="outline"
                  className="gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle className="h-3 w-3" />
                  {t("verifiedByAthlifyr")}
                </Badge>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t px-6 py-4">
              <Button
                onClick={() => void handleDownload()}
                variant="outline"
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                {t("downloadTicket")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
