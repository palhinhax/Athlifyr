import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import type { GiveawayData } from "./giveawayTypes";

interface UseGiveawayParams {
  eventId: string;
}

export function useGiveaway({ eventId }: UseGiveawayParams) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinModal, setJoinModal] = useState<{
    visible: boolean;
    success: boolean;
    ticketNumber?: number;
  }>({ visible: false, success: false });

  const fetchGiveaway = useCallback(async () => {
    try {
      const res = await api.get(
        `/events/${eventId}/giveaway?lang=${i18n.language}`
      );
      setGiveaway(res.data.giveaway);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [eventId, i18n.language]);

  useEffect(() => {
    fetchGiveaway();
  }, [fetchGiveaway]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setIsJoining(true);
      const res = await api.post(`/giveaways/${giveaway!.id}/join`);
      const data = res.data;
      setJoinModal({
        visible: true,
        success: true,
        ticketNumber: data.ticketNumber,
      });
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
      setJoinModal({ visible: true, success: false });
    } finally {
      setIsJoining(false);
    }
  };

  const closeJoinModal = () =>
    setJoinModal((prev) => ({ ...prev, visible: false }));

  /* ── Derived state ── */

  const isScheduled = giveaway?.status === "SCHEDULED";
  const isDrawn = giveaway?.status === "DRAWN";

  const isPendingDraw =
    isScheduled &&
    !!giveaway?.drawAt &&
    new Date(giveaway.drawAt) <= new Date();

  const canJoin =
    isScheduled &&
    !isPendingDraw &&
    (!giveaway?.drawAt || new Date(giveaway.drawAt) > new Date());

  const drawDate = giveaway?.drawAt
    ? new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "long",
        timeZone: "Europe/Lisbon",
      }).format(new Date(giveaway.drawAt))
    : null;

  const isWinner = isDrawn && !!giveaway?.isWinner;

  const shouldShowTransparencySection =
    !!giveaway?.secretHash || !!giveaway?.secretRevealed;

  return {
    giveaway,
    isLoading,
    isJoining,
    isAuthenticated,
    joinModal,
    closeJoinModal,
    handleJoin,

    // Derived
    isScheduled,
    isDrawn,
    isPendingDraw,
    canJoin,
    drawDate,
    isWinner,
    shouldShowTransparencySection,
  };
}
