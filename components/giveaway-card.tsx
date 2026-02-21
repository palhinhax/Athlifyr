"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Trophy, Users, Loader2 } from "lucide-react";
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
  prizeCount: number;
  participantsCount: number;
  translation: GiveawayTranslation | null;
  hasJoined: boolean;
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
      toast({ title: t("joinSuccess") });
      setGiveaway((prev) =>
        prev
          ? {
              ...prev,
              hasJoined: true,
              participantsCount: prev.participantsCount + 1,
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
      </CardContent>
    </Card>
  );
}
