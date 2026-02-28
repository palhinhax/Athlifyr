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
  winningTicketAttempts: number[];
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

  const isPendingDraw =
    isScheduled && giveaway.drawAt && new Date(giveaway.drawAt) <= new Date();

  const canJoin =
    isScheduled &&
    !isPendingDraw &&
    (!giveaway.drawAt || new Date(giveaway.drawAt) > new Date());

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
      className={`overflow-hidden rounded-xl border shadow-sm ${
        isWinner
          ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-700 dark:from-emerald-950/40 dark:to-teal-950/30"
          : "border-border bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/10"
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
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: icon + info */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-sm dark:from-teal-600 dark:to-emerald-600">
            <Gift className="h-5 w-5 text-white" />
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
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {t("drawPending")}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
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
            <Button
              size="sm"
              asChild
              className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm hover:from-teal-700 hover:to-emerald-700 dark:from-teal-500 dark:to-emerald-500"
            >
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
              className={
                !giveaway.hasJoined
                  ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm hover:from-teal-700 hover:to-emerald-700 dark:from-teal-500 dark:to-emerald-500"
                  : ""
              }
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
          <CollapsibleTrigger className="flex w-full items-center gap-1.5 border-t border-border/50 px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t("transparency.transparency")}</span>
            <ChevronDown
              className={`ml-auto h-3.5 w-3.5 transition-transform ${isTransparencyOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 border-t border-border/50 px-4 py-4 text-xs">
            {/* Step-by-step explanation */}
            <div className="rounded-lg bg-muted/40 p-3 dark:bg-muted/20">
              <p className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {t("transparency.howItWorks")}
              </p>
              <div className="mt-2 space-y-1.5 text-muted-foreground">
                <p>{t("transparency.step1")}</p>
                <p>{t("transparency.step2")}</p>
                <p>{t("transparency.step3")}</p>
              </div>
            </div>

            {/* Formula explanation */}
            <div className="rounded-lg border border-dashed border-border/60 bg-background/50 p-3 dark:bg-background/20">
              <p className="font-semibold text-foreground">
                {t("transparency.formulaTitle")}
              </p>
              <code className="mt-1.5 block rounded-md bg-muted px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground">
                SHA-256(&quot;secret | rank | attempt&quot;) % N + 1 = winner
              </code>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {t("transparency.formulaExplanation")}
              </p>
            </div>

            {/* Commit hash */}
            {giveaway.secretHash && (
              <div className="rounded-lg border border-border/40 p-3">
                <p className="font-semibold text-foreground">
                  {t("transparency.secretHash")}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t("transparency.secretHashExplanation")}
                </p>
                <code className="mt-1.5 block break-all rounded-md bg-muted px-3 py-2 font-mono text-[11px] text-foreground">
                  {giveaway.secretHash}
                </code>
              </div>
            )}

            {/* Post-draw: final count */}
            {isDrawn && giveaway.finalParticipantsCount !== null && (
              <p className="text-muted-foreground">
                {t("transparency.finalParticipantsCount", {
                  count: giveaway.finalParticipantsCount,
                })}
              </p>
            )}

            {/* Post-draw: winning tickets */}
            {isDrawn && giveaway.winningTicketNumbers.length > 0 && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                  {t("transparency.winningTickets")}
                </p>
                <p className="mt-0.5 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {giveaway.winningTicketNumbers.map((n) => `#${n}`).join(", ")}
                </p>
              </div>
            )}

            {/* Post-draw: revealed secret + verification */}
            {isDrawn && giveaway.secretRevealed && (
              <div className="rounded-lg border border-border/40 p-3">
                <p className="font-semibold text-foreground">
                  {t("transparency.secretRevealed")}
                </p>
                <code className="mt-1.5 block break-all rounded-md bg-muted px-3 py-2 font-mono text-[11px] text-foreground">
                  {giveaway.secretRevealed}
                </code>
                {giveaway.finalParticipantsCount !== null &&
                  giveaway.secretRevealed !== null &&
                  giveaway.winningTicketNumbers.length > 0 && (
                    <div className="mt-3 rounded-md bg-muted/50 p-2.5 dark:bg-muted/20">
                      <p className="mb-1.5 text-[11px] font-medium text-foreground">
                        {t("transparency.verifyTitle")}
                      </p>
                      {giveaway.winningTicketNumbers.map((ticket, i) => {
                        const attempt =
                          giveaway.winningTicketAttempts?.[i] ?? 0;
                        return (
                          <p
                            key={ticket}
                            className="break-all font-mono text-[11px] leading-relaxed text-muted-foreground"
                          >
                            {t("transparency.verifyFormula", {
                              secret: giveaway.secretRevealed!,
                              rank: i + 1,
                              attempt,
                              total: giveaway.finalParticipantsCount!,
                              winning: ticket,
                            })}
                          </p>
                        );
                      })}
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
