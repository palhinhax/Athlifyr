import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native";
import type { ConfirmModalAction } from "../ui/ConfirmModal";
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

  // Modal state (replaces native Alert.alert)
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message?: string;
    variant?: "success" | "error" | "warning" | "confirm";
    actions?: ConfirmModalAction[];
  } | null>(null);

  const closeModal = useCallback(() => {
    setModalConfig(null);
  }, []);

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
      setModalConfig({
        title: t("events.registration.authRequired"),
        message: t("events.registration.authRequiredDesc"),
        variant: "warning",
        actions: [
          {
            label: t("common.cancel"),
            variant: "outline",
            onPress: () => setModalConfig(null),
          },
          {
            label: t("common.signInButton"),
            variant: "primary",
            onPress: () => {
              setModalConfig(null);
              router.push("/auth/login");
            },
          },
        ],
      });
      return false;
    }
    return true;
  };

  /* ── Handlers ── */

  const handleCheckout = async () => {
    if (!requireAuth()) return;

    if (variants.length > 1 && !selectedVariantId) {
      setModalConfig({
        title: t("events.registration.selectVariantRequired"),
        message: t("events.registration.selectVariantRequiredDesc"),
        variant: "warning",
      });
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
      setModalConfig({
        title: t("events.registration.checkoutError"),
        message: message ?? t("events.registration.checkoutErrorDesc"),
        variant: "error",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleRegister = async () => {
    if (!requireAuth()) return;

    if (variants.length > 0 && !selectedVariantId) {
      setModalConfig({
        title: t("events.registration.selectVariantRequired"),
        message: t("events.registration.selectVariantRequiredDesc"),
        variant: "warning",
      });
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
      setModalConfig({
        title: t("events.registration.markedAsParticipant"),
        message: t("events.registration.participationRegistered"),
        variant: "success",
      });
    } catch {
      setModalConfig({
        title: t("common.error"),
        message: t("events.registration.registrationError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const performUnregister = async () => {
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
      setModalConfig({
        title: t("common.error"),
        message: t("events.registration.cancellationError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!isAuthenticated) return;
    const isInterested = userParticipation?.status === "interested";
    setModalConfig({
      title: isInterested
        ? t("events.registration.removeInterest")
        : t("events.registration.cancelParticipation"),
      message: isInterested
        ? t("events.registration.interestRemovedDesc")
        : t("events.registration.cancelParticipationDesc"),
      variant: "confirm",
      actions: [
        {
          label: t("common.cancel"),
          variant: "outline",
          onPress: () => setModalConfig(null),
        },
        {
          label: t("common.delete"),
          variant: "destructive",
          onPress: () => {
            setModalConfig(null);
            void performUnregister();
          },
        },
      ],
    });
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
      setModalConfig({
        title: t("events.registration.markedAsInterested"),
        message: t("events.registration.markedAsInterestedDesc"),
        variant: "success",
      });
    } catch {
      setModalConfig({
        title: t("common.error"),
        message: t("events.registration.registrationError"),
        variant: "error",
      });
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

    // Modal
    modalConfig,
    closeModal,
  };
}
