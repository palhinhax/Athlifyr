"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Gift,
  Trophy,
  Users,
  Loader2,
  ShieldCheck,
  ChevronDown,
  Ticket,
  LogIn,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTranslations, useLocale } from "next-intl";
import { GiveawayStatus } from "@prisma/client";

interface GiveawayTranslation {
  lang: string;
  title: string;
  details: string;
}

interface GiveawayData {
  id: string;
  status: GiveawayStatus;
  drawAt: string | null;
  drawnAt: string | null;
  prizeCount: number;
  participantsCount: number;
  secretHash: string | null;
  secretRevealed: string | null;
  finalParticipantsCount: number | null;
  winningTicketNumbers: number[];
  isWinner: boolean;
  translation: GiveawayTranslation | null;
  hasJoined: boolean;
  ticketNumber: number | null;
}

interface GiveawayCardProps {
  eventId: string;
}

export function GiveawayCard({ eventId }: GiveawayCardProps) {
  const { data: session } = useSession();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("events.giveaway");

  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);

  const fetchGiveaway = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/giveaway?lang=${locale}`);
      if (!res.ok) return;
      const data = await res.json();
      setGiveaway(data.giveaway);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [eventId, locale]);

  useEffect(() => {
    fetchGiveaway();
  }, [fetchGiveaway]);

  const handleJoin = async () => {
    if (!session) return;

    try {
      setIsJoining(true);
      const res = await fetch(`/api/giveaways/${giveaway!.id}/join`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to join");
      const data = await res.json();
      toast({ title: t("joinSuccess") });
      setGiveaway((prev) =>
        prev
          ? {
              ...prev,
              hasJoined: true,
              ticketNumber: data.ticketNumber,
              participantsCount: data.currentParticipantsCount,
            }
          : prev
      );
    } catch {
      toast({
        title: t("joinError"),
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading || !giveaway) return null;

  const isScheduled = giveaway.status === GiveawayStatus.SCHEDULED;
  const isDrawn = giveaway.status === GiveawayStatus.DRAWN;

  if (!isScheduled && !isDrawn) return null;

  const canJoin =
    isScheduled && (!giveaway.drawAt || new Date(giveaway.drawAt) > new Date());

  const isPendingDraw =
    isScheduled && giveaway.drawAt && new Date(giveaway.drawAt) <= new Date();

  const drawDate = giveaway.drawAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/Lisbon",
      }).format(new Date(giveaway.drawAt))
    : null;

  const shouldShowTransparencySection =
    !!giveaway.secretHash || !!giveaway.secretRevealed;

  const isWinner = isDrawn && giveaway.isWinner;

  return (
    <div
      className={`overflow-hidden rounded-lg border ${
        isWinner
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
          : "border-primary/20 bg-primary/5 dark:border-primary/15 dark:bg-primary/5"
      }`}
    >
      {/* Winner banner — only when user won */}
      {isWinner && (
        <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 dark:bg-emerald-900/40">
          <Trophy className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            {t("youWon")}
          </span>
        </div>
      )}

      {/* Main banner row */}
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: icon + info */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/15">
            <Gift className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {giveaway.translation?.title || t("title")}
              </span>
              {isDrawn && !isWinner && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {t("drawEnded")}
                </span>
              )}
              {isPendingDraw && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {t("drawPending")}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {giveaway.prizeCount === 1
                  ? t("prizeCount", { count: giveaway.prizeCount })
                  : t("prizeCountPlural", { count: giveaway.prizeCount })}
              </span>
              {giveaway.participantsCount >= 10 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {t("participantsCountPlural", {
                    count: giveaway.participantsCount,
                  })}
                </span>
              )}
              {drawDate && <span>{drawDate}</span>}
            </div>
          </div>
        </div>

        {/* Right: action / ticket */}
        <div className="flex shrink-0 items-center gap-2 sm:ml-4">
          {/* Ticket badge */}
          {giveaway.hasJoined && giveaway.ticketNumber !== null && (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                isWinner
                  ? "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <Ticket className="h-3 w-3" />#{giveaway.ticketNumber}
            </span>
          )}

          {/* Join button or login link */}
          {canJoin && !session && (
            <Button size="sm" asChild>
              <Link href={`/${locale}/auth/signin?callbackUrl=${pathname}`}>
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                {t("loginToParticipate")}
              </Link>
            </Button>
          )}
          {canJoin && session && (
            <Button
              size="sm"
              onClick={handleJoin}
              disabled={giveaway.hasJoined || isJoining}
              variant={giveaway.hasJoined ? "outline" : "default"}
            >
              {isJoining && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              {giveaway.hasJoined
                ? t("alreadyParticipating")
                : t("participate")}
            </Button>
          )}
        </div>
      </div>

      {/* Transparency section (collapsible) */}
      {shouldShowTransparencySection && (
        <Collapsible
          open={isTransparencyOpen}
          onOpenChange={setIsTransparencyOpen}
        >
          <CollapsibleTrigger className="flex w-full items-center gap-1.5 border-t px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t("transparency.transparency")}</span>
            <ChevronDown
              className={`ml-auto h-3.5 w-3.5 transition-transform ${isTransparencyOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 border-t px-4 py-3 text-xs">
            <div className="rounded bg-muted/50 p-2">
              <p className="font-medium">{t("transparency.howItWorks")}</p>
              <p className="mt-0.5 text-muted-foreground">
                {t("transparency.howItWorksExplanation")}
              </p>
            </div>

            {giveaway.secretHash && (
              <div>
                <p className="font-medium">{t("transparency.secretHash")}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("transparency.secretHashExplanation")}
                </p>
                <code className="mt-1 block break-all rounded bg-muted px-2 py-1 font-mono text-[11px]">
                  {giveaway.secretHash}
                </code>
              </div>
            )}

            {isDrawn && giveaway.finalParticipantsCount !== null && (
              <p className="text-muted-foreground">
                {t("transparency.finalParticipantsCount", {
                  count: giveaway.finalParticipantsCount,
                })}
              </p>
            )}

            {isDrawn && giveaway.winningTicketNumbers.length > 0 && (
              <div>
                <p className="font-medium">
                  {t("transparency.winningTickets")}
                </p>
                <p className="text-muted-foreground">
                  {giveaway.winningTicketNumbers.map((n) => `#${n}`).join(", ")}
                </p>
              </div>
            )}

            {isDrawn && giveaway.secretRevealed && (
              <div>
                <p className="font-medium">
                  {t("transparency.secretRevealed")}
                </p>
                <code className="mt-1 block break-all rounded bg-muted px-2 py-1 font-mono text-[11px]">
                  {giveaway.secretRevealed}
                </code>
                {giveaway.finalParticipantsCount !== null &&
                  giveaway.secretRevealed !== null &&
                  giveaway.winningTicketNumbers.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {giveaway.winningTicketNumbers.map((ticket, i) => (
                        <p
                          key={ticket}
                          className="break-all font-mono text-[11px] text-muted-foreground"
                        >
                          {t("transparency.verifyFormula", {
                            secret: giveaway.secretRevealed!,
                            rank: i + 1,
                            total: giveaway.finalParticipantsCount!,
                            winning: ticket,
                          })}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
