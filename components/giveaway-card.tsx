"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Gift,
  Calendar,
  Trophy,
  Users,
  Loader2,
  ShieldCheck,
  ChevronDown,
  Ticket,
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
  winningTicketNumber: number | null;
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
    if (!session) {
      toast({ title: t("loginToParticipate") });
      return;
    }

    try {
      setIsJoining(true);
      const res = await fetch(`/api/giveaways/${giveaway!.id}/join`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to join");
      const data = await res.json();
      toast({ title: t("joinSuccess") });
      // Update state with ticket number from response + re-fetch for full state
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

  const isActive =
    giveaway.status === GiveawayStatus.SCHEDULED &&
    (!giveaway.drawAt || new Date(giveaway.drawAt) > new Date());

  const isDrawn = giveaway.status === GiveawayStatus.DRAWN;

  if (!isActive && !isDrawn) return null;

  const drawDate = giveaway.drawAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/Lisbon",
      }).format(new Date(giveaway.drawAt))
    : null;

  const shouldShowTransparencySection =
    !!giveaway.secretHash || !!giveaway.secretRevealed;

  const isWinner =
    isDrawn &&
    giveaway.ticketNumber !== null &&
    giveaway.winningTicketNumber !== null &&
    giveaway.ticketNumber === giveaway.winningTicketNumber;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{t("title")}</h3>
          {isDrawn && (
            <Badge variant="outline" className="ml-auto">
              {t("drawEnded")}
            </Badge>
          )}
        </div>

        {giveaway.translation && (
          <>
            <p className="mb-1 font-medium">{giveaway.translation.title}</p>
            <p className="mb-3 text-sm text-muted-foreground">
              {giveaway.translation.details}
            </p>
          </>
        )}

        <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            {giveaway.prizeCount === 1
              ? t("prizeCount", { count: giveaway.prizeCount })
              : t("prizeCountPlural", { count: giveaway.prizeCount })}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {giveaway.participantsCount === 1
              ? t("participantsCount", { count: giveaway.participantsCount })
              : t("participantsCountPlural", {
                  count: giveaway.participantsCount,
                })}
          </span>
          {drawDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {t("drawDate")}: {drawDate}
            </span>
          )}
        </div>

        {/* Permanent ticket number — shown prominently once joined */}
        {giveaway.hasJoined && giveaway.ticketNumber !== null && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2">
            <Ticket className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {t("transparency.yourTicketNumber", {
                number: giveaway.ticketNumber,
              })}
            </span>
            {isWinner && (
              <Badge className="ml-auto bg-yellow-500 text-yellow-950">
                🏆 {t("winner")}
              </Badge>
            )}
          </div>
        )}

        {isActive && (
          <Button
            className="w-full"
            onClick={handleJoin}
            disabled={giveaway.hasJoined || isJoining}
            variant={giveaway.hasJoined ? "outline" : "default"}
          >
            {isJoining ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {giveaway.hasJoined ? t("alreadyParticipating") : t("participate")}
          </Button>
        )}

        {/* Transparency Section - collapsed by default */}
        {shouldShowTransparencySection && (
          <Collapsible
            open={isTransparencyOpen}
            onOpenChange={setIsTransparencyOpen}
            className="mt-4 border-t pt-3"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {t("transparency.transparency")}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isTransparencyOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 text-sm">
              {/* How it works */}
              <div className="rounded-md bg-muted/50 p-3">
                <p className="mb-1 font-medium text-foreground">
                  {t("transparency.howItWorks")}
                </p>
                <p className="text-muted-foreground">
                  {t("transparency.howItWorksExplanation")}
                </p>
              </div>

              {/* Secret hash (public before draw) */}
              {giveaway.secretHash && (
                <div>
                  <p className="mb-1 font-medium text-foreground">
                    {t("transparency.secretHash")}
                  </p>
                  <p className="mb-1 text-xs text-muted-foreground">
                    {t("transparency.secretHashExplanation")}
                  </p>
                  <code className="block break-all rounded bg-muted px-2 py-1.5 font-mono text-xs">
                    {giveaway.secretHash}
                  </code>
                </div>
              )}

              {/* After draw: final participant count + winning ticket */}
              {isDrawn && giveaway.finalParticipantsCount !== null && (
                <p className="text-muted-foreground">
                  {t("transparency.finalParticipantsCount", {
                    count: giveaway.finalParticipantsCount,
                  })}
                </p>
              )}
              {isDrawn && giveaway.winningTicketNumber !== null && (
                <p className="font-medium text-foreground">
                  {t("transparency.winningTicketNumber", {
                    number: giveaway.winningTicketNumber,
                  })}
                </p>
              )}

              {/* Revealed secret + verify formula (after draw) */}
              {isDrawn && giveaway.secretRevealed && (
                <div>
                  <p className="mb-1 font-medium text-foreground">
                    {t("transparency.secretRevealed")}
                  </p>
                  <code className="block break-all rounded bg-muted px-2 py-1.5 font-mono text-xs">
                    {giveaway.secretRevealed}
                  </code>
                  {giveaway.finalParticipantsCount !== null &&
                    giveaway.winningTicketNumber !== null && (
                      <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
                        {t("transparency.verifyFormula", {
                          secret: giveaway.secretRevealed,
                          total: giveaway.finalParticipantsCount,
                          winning: giveaway.winningTicketNumber,
                        })}
                      </p>
                    )}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
