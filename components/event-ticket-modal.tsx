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
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 400;
      const hasBib = !!ticket.bibNumber;
      const height = 620;
      const dpr = 2;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // ── Background: white body ──────────────────────────────────────────
      ctx.fillStyle = "#FFFFFF";
      ctx.roundRect(0, 0, width, height, 16);
      ctx.fill();

      // ── Athlifyr logo — full-card watermark (cover, centred) ───────────
      // Fetch as text → Blob URL so canvas can draw it without cross-origin issues.
      // The SVG already has the brand orange/gold colours — no tinting needed.
      try {
        const logoResponse = await fetch("/logo.svg");
        const svgText = await logoResponse.text();
        // Remove the first path that has fill="none" and acts as an invisible
        // background mask, hiding the actual logo shapes beneath it
        const cleaned = svgText.replace(/<path fill="none"[^/]*\/>/i, "");
        const blob = new Blob([cleaned], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        await new Promise<void>((resolve) => {
          const logoImg = new Image();
          logoImg.onload = () => {
            const naturalW = 766;
            const naturalH = 754;
            const scale = Math.max(width / naturalW, height / naturalH);
            const drawW = naturalW * scale;
            const drawH = naturalH * scale;
            const drawX = (width - drawW) / 2;
            const drawY = (height - drawH) / 2;
            ctx.save();
            ctx.roundRect(0, 0, width, height, 16);
            ctx.clip();
            ctx.globalAlpha = 0.85;
            ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
            ctx.restore();
            URL.revokeObjectURL(url);
            resolve();
          };
          logoImg.onerror = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          logoImg.src = url;
        });
      } catch {
        // Logo is optional decoration — silently skip
      }

      // ── Golden header block (mirrors the modal header) ──────────────────
      const headerH = hasBib ? 130 : 110;
      const headerGrad = ctx.createLinearGradient(0, 0, width, 0);
      headerGrad.addColorStop(0, "#F5A623");
      headerGrad.addColorStop(1, "rgba(245,166,35,0.75)");
      ctx.fillStyle = headerGrad;
      ctx.roundRect(0, 0, width, headerH, [16, 16, 0, 0]);
      ctx.fill();

      // ── "ATHLIFYR" wordmark top-right (in golden header — dark text) ────
      ctx.fillStyle = "rgba(26,14,0,0.5)";
      ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("ATHLIFYR", width - 20, 22);

      // ── Event title (in golden header — dark text) ───────────────────────
      ctx.fillStyle = "#1a0e00";
      ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      const title = ticket.event.title;
      ctx.fillText(
        title.length > 34 ? title.substring(0, 34) + "…" : title,
        width / 2,
        48
      );

      // ── Location (in golden header — muted dark) ─────────────────────────
      ctx.fillStyle = "rgba(26,14,0,0.6)";
      ctx.font = "12px system-ui, -apple-system, sans-serif";
      ctx.fillText(
        `${ticket.event.city}, ${ticket.event.country}`,
        width / 2,
        66
      );

      // ── Thin dark divider (in golden header) ─────────────────────────────
      ctx.strokeStyle = "rgba(26,14,0,0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(24, 80);
      ctx.lineTo(width - 24, 80);
      ctx.stroke();

      // ── Participant name + bib row (in golden header) ─────────────────────
      const participantName = ticket.user.name ?? ticket.user.email;
      const maxNameWidth = hasBib ? width - 140 : width - 48;

      // Left: label + name
      ctx.fillStyle = "rgba(26,14,0,0.6)";
      ctx.font = "9px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("PARTICIPANTE", 24, 98);

      ctx.fillStyle = "#1a0e00";
      ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
      const nameMeasured = ctx.measureText(participantName).width;
      const nameTruncated =
        nameMeasured > maxNameWidth
          ? participantName.substring(
              0,
              Math.floor((maxNameWidth / nameMeasured) * participantName.length)
            ) + "…"
          : participantName;
      ctx.fillText(nameTruncated, 24, 116);

      // Right: dorsal label + number (when present)
      if (hasBib) {
        ctx.fillStyle = "rgba(26,14,0,0.6)";
        ctx.font = "9px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("DORSAL", width - 24, 98);

        ctx.fillStyle = "#1a0e00";
        ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
        ctx.fillText(`#${ticket.bibNumber}`, width - 24, 122);
      }

      ctx.textAlign = "center";

      // ── Variant strip (white body area, muted dark text) ─────────────────
      let variantText = ticket.variant.name;
      if (ticket.variant.distanceKm)
        variantText += ` · ${ticket.variant.distanceKm}km`;
      ctx.fillStyle = "rgba(26,14,0,0.55)";
      ctx.font = "12px system-ui, -apple-system, sans-serif";
      ctx.fillText(variantText, width / 2, hasBib ? 148 : 138);

      // ── Dashed separator ──────────────────────────────────────────────────
      const sepY = hasBib ? 162 : 152;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(26,14,0,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, sepY);
      ctx.lineTo(width - 20, sepY);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── QR Code (white bg so it stays scannable) ─────────────────────────
      const qrTopY = sepY + 20;
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          qrImg.onload = () => {
            const qrSize = 180;
            const qrPad = 10;
            const qrX = (width - qrSize) / 2;
            ctx.fillStyle = "#FFFFFF";
            ctx.roundRect(
              qrX - qrPad,
              qrTopY - qrPad,
              qrSize + qrPad * 2,
              qrSize + qrPad * 2,
              10
            );
            ctx.fill();
            ctx.drawImage(qrImg, qrX, qrTopY, qrSize, qrSize);
            resolve();
          };
          qrImg.src = qrDataUrl;
        });
      }

      // ── Footer details (white body — dark muted text) ─────────────────────
      const footerY = qrTopY + 230;

      if (ticket.variant.startDate) {
        const dateStr = new Date(ticket.variant.startDate).toLocaleDateString(
          undefined,
          { day: "numeric", month: "long", year: "numeric" }
        );
        ctx.fillStyle = "rgba(26,14,0,0.55)";
        ctx.font = "11px system-ui, -apple-system, sans-serif";
        ctx.fillText(dateStr, width / 2, footerY);
      }

      const amount = (ticket.amountCents / 100).toLocaleString(undefined, {
        style: "currency",
        currency: ticket.currency,
      });
      ctx.fillStyle = "rgba(26,14,0,0.55)";
      ctx.font = "11px system-ui, -apple-system, sans-serif";
      ctx.fillText(amount, width / 2, footerY + 18);

      // Verified
      ctx.fillStyle = "#1a0e00";
      ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
      ctx.fillText("✓ Verified by Athlifyr", width / 2, footerY + 40);

      // Footer wordmark
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
      ctx.fillText("athlifyr.com", width / 2, height - 14);

      // ── Trigger download ──────────────────────────────────────────────────
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
            <div className="bg-gradient-to-r from-[#F5A623] to-[#F5A623]/75 px-6 py-5 text-[#1a0e00]">
              <h2 className="text-lg font-bold leading-tight">
                {ticket.event.title}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-[#1a0e00]/70">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {ticket.event.city}, {ticket.event.country}
                </span>
              </div>
              {ticket.variant.startDate && (
                <div className="mt-1 flex items-center gap-2 text-sm text-[#1a0e00]/70">
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

              {/* Participant name + bib in header */}
              <div className="mt-3 flex items-center justify-between border-t border-[#1a0e00]/20 pt-3">
                <div>
                  <p className="text-xs text-[#1a0e00]/60">
                    {t("participant")}
                  </p>
                  <p className="font-semibold leading-tight">
                    {ticket.user.name ?? ticket.user.email}
                  </p>
                </div>
                {ticket.bibNumber && (
                  <div className="text-right">
                    <p className="text-xs text-[#1a0e00]/60">
                      {t("bibNumber")}
                    </p>
                    <p className="text-2xl font-black leading-tight tracking-tight">
                      #{ticket.bibNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dashed separator */}
            <div className="relative">
              <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-background" />
              <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background" />
              <div className="border-t-2 border-dashed border-muted-foreground/20" />
            </div>

            {/* Ticket body */}
            <div className="px-6 py-5">
              {/* Participant + variant */}
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
