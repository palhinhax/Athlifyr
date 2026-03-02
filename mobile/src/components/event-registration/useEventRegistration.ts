import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import type { EventVariant } from "@/src/types";
import type { Participation, PaidRegistration } from "./eventRegistrationUtils";
import {
  getActivePrice,
  isVariantSoldOut,
  allVariantsSoldOut,
  allVariantsNoPrice,
} from "./eventRegistrationUtils";

interface UseEventRegistrationParams {
  eventId: string;
  variants: EventVariant[];
  hasRegistrations: boolean;
}

export function useEventRegistration({
  eventId,
  variants,
  hasRegistrations,
}: UseEventRegistrationParams) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Social participation state (free events)
  const [userParticipation, setUserParticipation] =
    useState<Participation | null>(null);

  // Paid registration state
  const [paidRegistration, setPaidRegistration] =
    useState<PaidRegistration | null>(null);
  const [registrationChecked, setRegistrationChecked] = useState(false);

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);

  // Auto-select single variant
  useEffect(() => {
    if (variants.length === 1 && !selectedVariantId) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, selectedVariantId]);

  /* ── Data fetching ── */

  const fetchParticipation = useCallback(async () => {
    if (!isAuthenticated || !user?.id || hasRegistrations) return;
    try {
      const response = await api.get(
        `/participations?eventId=${eventId}&userId=${user.id}`
      );
      const data = response.data;
      const myParticipation = data.participations?.[0];
      if (myParticipation) {
        setUserParticipation(myParticipation);
        if (myParticipation.variantId && variants.length > 0) {
          setSelectedVariantId(myParticipation.variantId);
        }
      }
    } catch {
      // ignore
    }
  }, [eventId, isAuthenticated, user?.id, variants, hasRegistrations]);

  const fetchPaidRegistration = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !hasRegistrations) {
      setRegistrationChecked(true);
      return;
    }
    try {
      const response = await api.get(`/events/${eventId}/registration/status`);
      if (response.data?.registration) {
        setPaidRegistration(response.data.registration);
      }
    } catch {
      // 404 = no registration yet, that's fine
    } finally {
      setRegistrationChecked(true);
    }
  }, [eventId, isAuthenticated, user?.id, hasRegistrations]);

  const fetchCounts = useCallback(async () => {
    try {
      const response = await api.get(`/participations?eventId=${eventId}`);
      const data = response.data;
      setParticipantsCount(data.counts?.going || 0);
      setInterestedCount(data.counts?.interested || 0);
    } catch {
      // ignore
    }
  }, [eventId]);

  useEffect(() => {
    fetchParticipation();
    fetchPaidRegistration();
    fetchCounts();
  }, [fetchParticipation, fetchPaidRegistration, fetchCounts]);

  /* ── Auth guard helper ── */

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      Alert.alert(
        t("events.registration.authRequired"),
        t("events.registration.authRequiredDesc"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.signInButton"),
            onPress: () => router.push("/auth/login"),
          },
        ]
      );
      return false;
    }
    return true;
  };

  /* ── Handlers ── */

  const handleCheckout = async () => {
    if (!requireAuth()) return;

    if (variants.length > 1 && !selectedVariantId) {
      Alert.alert(
        t("events.registration.selectVariantRequired"),
        t("events.registration.selectVariantRequiredDesc")
      );
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await api.post(`/events/${eventId}/checkout`, {
        variantId: selectedVariantId || undefined,
      });
      const checkoutUrl: string = res.data.url;
      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
        await fetchPaidRegistration();
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      Alert.alert(
        t("events.registration.checkoutError"),
        message ?? t("events.registration.checkoutErrorDesc")
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleRegister = async () => {
    if (!requireAuth()) return;

    if (variants.length > 0 && !selectedVariantId) {
      Alert.alert(
        t("events.registration.selectVariantRequired"),
        t("events.registration.selectVariantRequiredDesc")
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/participations", {
        eventId,
        variantId: selectedVariantId || undefined,
        status: "going",
      });
      const wasInterested = userParticipation?.status === "interested";
      setUserParticipation(response.data);
      setParticipantsCount((prev) => prev + 1);
      if (wasInterested) setInterestedCount((prev) => Math.max(0, prev - 1));
      Alert.alert(
        t("events.registration.markedAsParticipant"),
        t("events.registration.participationRegistered")
      );
    } catch {
      Alert.alert(
        t("common.error"),
        t("events.registration.registrationError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!isAuthenticated) return;
    const isInterested = userParticipation?.status === "interested";
    Alert.alert(
      isInterested
        ? t("events.registration.removeInterest")
        : t("events.registration.cancelParticipation"),
      isInterested
        ? t("events.registration.interestRemovedDesc")
        : t("events.registration.cancelParticipationDesc"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await api.delete(`/participations?eventId=${eventId}`);
              const prevStatus = userParticipation?.status;
              setUserParticipation(null);
              setSelectedVariantId("");
              if (prevStatus === "interested") {
                setInterestedCount((prev) => Math.max(0, prev - 1));
              } else {
                setParticipantsCount((prev) => Math.max(0, prev - 1));
              }
            } catch {
              Alert.alert(
                t("common.error"),
                t("events.registration.cancellationError")
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkInterested = async () => {
    if (!requireAuth()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/participations", {
        eventId,
        status: "interested",
      });
      setUserParticipation(response.data);
      setInterestedCount((prev) => prev + 1);
      Alert.alert(
        t("events.registration.markedAsInterested"),
        t("events.registration.markedAsInterestedDesc")
      );
    } catch {
      Alert.alert(
        t("common.error"),
        t("events.registration.registrationError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Derived state ── */

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const activePrice = selectedVariant ? getActivePrice(selectedVariant) : null;
  const selectedSoldOut = selectedVariant
    ? isVariantSoldOut(selectedVariant)
    : false;
  const soldOut = allVariantsSoldOut(variants);
  const noPrice = allVariantsNoPrice(variants);

  return {
    // State
    isAuthenticated,
    userParticipation,
    paidRegistration,
    registrationChecked,
    selectedVariantId,
    setSelectedVariantId,
    isLoading,
    isCheckingOut,
    participantsCount,
    interestedCount,

    // Derived
    selectedVariant,
    activePrice,
    selectedSoldOut,
    soldOut,
    noPrice,

    // Handlers
    handleCheckout,
    handleRegister,
    handleUnregister,
    handleMarkInterested,
  };
}
