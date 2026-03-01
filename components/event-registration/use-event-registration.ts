"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { CustomField, CustomFieldAnswer } from "@/types/custom-fields";
import type {
  EventRegistrationProps,
  PaidRegistration,
  Participation,
  TeamMemberData,
  UserProfileData,
  RegistrationState,
  RegistrationActions,
  RegistrationDerived,
  EventVariant,
} from "./event-registration-types";

interface UseEventRegistrationReturn {
  state: RegistrationState;
  actions: RegistrationActions;
  derived: RegistrationDerived;
  session: ReturnType<typeof useSession>;
}

export function useEventRegistration({
  eventId,
  eventSlug,
  eventTitle,
  hasRegistrations = false,
  variants = [],
  registrationFieldSettings = {},
}: EventRegistrationProps): UseEventRegistrationReturn {
  const sessionData = useSession();
  const { data: session, status } = sessionData;
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("events.registration");
  const searchParams = useSearchParams();

  const [userParticipation, setUserParticipation] =
    useState<Participation | null>(null);
  const [paidRegistration, setPaidRegistration] =
    useState<PaidRegistration | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [registrationChecked, setRegistrationChecked] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isCancellingPending, setIsCancellingPending] = useState(false);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);
  const justCancelledRef = useRef(false);

  // Consent dialog state
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const consentFlowRef = useRef<"checkout" | "free">("checkout");
  const [userProfileData, setUserProfileData] =
    useState<UserProfileData | null>(null);

  // Custom fields state
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldAnswersMap, setCustomFieldAnswersMap] = useState<
    Record<number, CustomFieldAnswer[]>
  >({});

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  // ── Helpers for per-participant custom field answers ────────────────────
  const allCustomFieldAnswers: CustomFieldAnswer[] = Object.entries(
    customFieldAnswersMap
  ).flatMap(([idx, answers]) =>
    answers.map((a) => ({ ...a, participantIndex: Number(idx) }))
  );

  const resetCustomFieldAnswers = () => {
    setCustomFieldAnswersMap({});
  };

  // Derive required + optional field lists from registrationFieldSettings
  const requiredRegistrationFields = Object.entries(registrationFieldSettings)
    .filter(([, v]) => v === "required")
    .map(([k]) => k);
  const optionalRegistrationFields = Object.entries(registrationFieldSettings)
    .filter(([, v]) => v === "optional")
    .map(([k]) => k);
  const allConfiguredFields = [
    ...requiredRegistrationFields,
    ...optionalRegistrationFields,
  ];
  const hasConfiguredFields =
    allConfiguredFields.length > 0 || customFields.length > 0;

  // Compute selected variant's teamSize
  const selectedVariantTeamSize = (() => {
    const variant = variants.find((v) => v.id === selectedVariantId);
    return variant?.teamSize ?? 1;
  })();

  // For team variants, the consent dialog should ALWAYS show
  const needsConsentOrTeam = hasConfiguredFields || selectedVariantTeamSize > 1;

  // Initialize team members when variant changes
  useEffect(() => {
    const extraCount = selectedVariantTeamSize - 1;
    if (extraCount <= 0) {
      setTeamMembers([]);
      return;
    }
    setTeamMembers((prev) => {
      if (prev.length === extraCount) return prev;
      const members: TeamMemberData[] = [];
      for (let i = 0; i < extraCount; i++) {
        members.push(
          prev[i] ?? {
            name: "",
            email: "",
            dateOfBirth: "",
            citizenId: "",
            phone: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
          }
        );
      }
      return members;
    });
  }, [selectedVariantTeamSize]);

  // Fetch custom fields for this event
  useEffect(() => {
    if (!hasRegistrations) return;
    const fetchCustomFields = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}/custom-fields`);
        if (res.ok) {
          const data = (await res.json()) as CustomField[];
          setCustomFields(data);
        }
      } catch {
        // silent
      }
    };
    void fetchCustomFields();
  }, [eventId, hasRegistrations]);

  // Fetch user profile data when there are configured fields
  useEffect(() => {
    if (
      !hasConfiguredFields ||
      !hasRegistrations ||
      status !== "authenticated" ||
      !session?.user?.id
    )
      return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = (await res.json()) as UserProfileData;
          setUserProfileData({
            dateOfBirth: data.dateOfBirth,
            citizenId: data.citizenId,
            nationality: data.nationality,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    void fetchProfile();
  }, [hasConfiguredFields, hasRegistrations, session?.user?.id, status]);

  // When returning from Stripe checkout with session_id, confirm immediately
  useEffect(() => {
    const registrationParam = searchParams.get("registration");
    const sessionId = searchParams.get("session_id");

    if (registrationParam === "success" && sessionId && hasRegistrations) {
      const confirmRegistration = async () => {
        try {
          const res = await fetch(
            `/api/events/${eventId}/registration/confirm`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );
          if (res.ok) {
            const data = (await res.json()) as {
              registration: PaidRegistration | null;
            };
            if (data.registration) {
              setPaidRegistration(data.registration);
              setRegistrationChecked(true);
            }
          }
        } catch (error) {
          console.error("Error confirming registration:", error);
        }
      };

      void confirmRegistration();

      toast({
        title: t("paymentSuccessTitle"),
        description: t("paymentSuccessDesc"),
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("registration");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    } else if (registrationParam === "success") {
      toast({
        title: t("paymentSuccessTitle"),
        description: t("paymentSuccessDesc"),
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("registration");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    } else if (registrationParam === "cancelled") {
      justCancelledRef.current = true;
      setPaidRegistration(null);
      setRegistrationChecked(true);
      toast({
        title: t("paymentCancelledTitle"),
        description: t("paymentCancelledDesc"),
        variant: "destructive",
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("registration");
      window.history.replaceState({}, "", url.toString());

      void fetch(`/api/events/${eventId}/registration/cancel`, {
        method: "POST",
      }).catch(() => {});
    }
  }, [searchParams, toast, t, hasRegistrations, eventId]);

  // Fetch paid registration status
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!hasRegistrations || status !== "authenticated" || !session?.user?.id)
        return;

      if (justCancelledRef.current) return;

      const currentParams = new URLSearchParams(window.location.search);
      if (currentParams.get("registration") === "cancelled") return;

      try {
        const response = await fetch(
          `/api/events/${eventId}/registration/status`
        );
        if (response.ok) {
          const data = (await response.json()) as {
            registration: PaidRegistration | null;
          };
          if (justCancelledRef.current) return;
          if (data.registration) {
            setPaidRegistration(data.registration);
          }
        }
      } catch (error) {
        console.error("Error fetching registration status:", error);
      } finally {
        setRegistrationChecked(true);
      }
    };

    fetchRegistrationStatus();
  }, [eventId, hasRegistrations, session?.user?.id, status]);

  // Auto-poll when registration is PENDING
  useEffect(() => {
    if (
      !hasRegistrations ||
      paidRegistration?.status !== "PENDING" ||
      justCancelledRef.current
    )
      return;

    const pollInterval = setInterval(async () => {
      if (justCancelledRef.current) {
        clearInterval(pollInterval);
        return;
      }

      try {
        const response = await fetch(
          `/api/events/${eventId}/registration/status`
        );
        if (response.ok) {
          const data = (await response.json()) as {
            registration: PaidRegistration | null;
          };
          if (!data.registration) {
            setPaidRegistration(null);
            clearInterval(pollInterval);
          } else if (data.registration.status !== "PENDING") {
            setPaidRegistration(data.registration);
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error("Error polling registration status:", error);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      justCancelledRef.current = true;
      setPaidRegistration(null);
      void fetch(`/api/events/${eventId}/registration/cancel`, {
        method: "POST",
      }).catch(() => {});
    }, 120_000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [eventId, hasRegistrations, paidRegistration?.status]);

  // ── Variant helper functions ──────────────────────────────────────────

  const variantHasActivePrice = (variant: EventVariant): boolean => {
    const now = new Date();
    const phases = variant.pricingPhases ?? [];
    if (phases.length === 0) return false;
    return phases.some(
      (p) =>
        (!p.startDate || new Date(p.startDate) <= now) &&
        (!p.endDate || new Date(p.endDate) >= now)
    );
  };

  const isVariantSoldOut = (variant: EventVariant): boolean => {
    if (!variant.maxParticipants) return false;
    return (variant.registrationCount ?? 0) >= variant.maxParticipants;
  };

  // Compute active price for selected variant
  const activePrice = (() => {
    if (!hasRegistrations) return null;
    const now = new Date();
    const variant = variants.find((v) => v.id === selectedVariantId);
    const phases = variant?.pricingPhases ?? [];
    return (
      phases.find(
        (p) =>
          (!p.startDate || new Date(p.startDate) <= now) &&
          (!p.endDate || new Date(p.endDate) >= now)
      ) ?? null
    );
  })();

  const selectedVariantSoldOut = (() => {
    if (!selectedVariantId) return false;
    const variant = variants.find((v) => v.id === selectedVariantId);
    return variant ? isVariantSoldOut(variant) : false;
  })();

  const selectedVariantNoPrice = (() => {
    if (!selectedVariantId || !hasRegistrations) return false;
    const variant = variants.find((v) => v.id === selectedVariantId);
    return variant ? !variantHasActivePrice(variant) : false;
  })();

  const allVariantsSoldOut =
    variants.length > 0 &&
    variants.every((v) => {
      if (isVariantSoldOut(v)) return true;
      if (hasRegistrations && !variantHasActivePrice(v)) return true;
      return false;
    });

  // ── Action handlers ───────────────────────────────────────────────────

  const handleCheckout = async () => {
    if (!session?.user) {
      toast({
        title: t("authRequired"),
        description: t("authRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    if (variants.length > 0 && !selectedVariantId) {
      toast({
        title: t("selectVariantRequired"),
        description: t("selectVariantRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    const variantParam = selectedVariantId
      ? `?variant=${selectedVariantId}`
      : "";
    router.push(`/events/${eventSlug}/register${variantParam}`);
  };

  const proceedToCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariantId || undefined,
          customFieldAnswers:
            allCustomFieldAnswers.length > 0
              ? allCustomFieldAnswers
              : undefined,
          teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      const checkoutData = (await res.json()) as {
        url: string;
        registrationId?: string;
      };

      if (allCustomFieldAnswers.length > 0 && checkoutData.registrationId) {
        await fetch(`/api/events/${eventId}/custom-field-responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: allCustomFieldAnswers,
            registrationId: checkoutData.registrationId,
          }),
        });
        resetCustomFieldAnswers();
      }

      window.location.href = checkoutData.url;
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("registrationError"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleConsentConfirmed = () => {
    setShowConsentDialog(false);
    void fetch("/api/profile")
      .then((res) => res.json())
      .then((data: UserProfileData) => {
        setUserProfileData({
          dateOfBirth: data.dateOfBirth,
          citizenId: data.citizenId,
          nationality: data.nationality,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
        });
      })
      .catch(() => {});
    if (consentFlowRef.current === "free") {
      void proceedToFreeRegistration();
    } else {
      void proceedToCheckout();
    }
  };

  const handleRetryPayment = async () => {
    if (!paidRegistration) return;

    setIsRetryingPayment(true);
    try {
      const res = await fetch(`/api/events/${eventId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: paidRegistration.variantId || undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("registrationError"),
        variant: "destructive",
      });
      setIsRetryingPayment(false);
    }
  };

  const handleCancelPending = async () => {
    setIsCancellingPending(true);
    try {
      const res = await fetch(`/api/events/${eventId}/registration/cancel`, {
        method: "POST",
      });

      if (res.ok) {
        justCancelledRef.current = true;
        setPaidRegistration(null);
        toast({
          title: t("pendingCancelledTitle"),
          description: t("pendingCancelledDesc"),
        });
      } else {
        throw new Error("Failed to cancel");
      }
    } catch {
      toast({
        title: t("error"),
        description: t("registrationError"),
        variant: "destructive",
      });
    } finally {
      setIsCancellingPending(false);
    }
  };

  // Fetch user's current participation
  useEffect(() => {
    const fetchParticipation = async () => {
      if (status !== "authenticated" || !session?.user?.id) return;

      try {
        const response = await fetch(
          `/api/participations?eventId=${eventId}&userId=${session.user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          const myParticipation = data.participations[0];
          if (myParticipation) {
            setUserParticipation(myParticipation);
            setSelectedVariantId(myParticipation.variantId || "");
          }
        }
      } catch (error) {
        console.error("Error fetching participation:", error);
      }
    };

    fetchParticipation();
  }, [eventId, session?.user?.id, status]);

  // Fetch total participants count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`/api/participations?eventId=${eventId}`);
        if (response.ok) {
          const data = await response.json();
          if (hasRegistrations && data.counts.confirmedRegistrations != null) {
            setParticipantsCount(data.counts.confirmedRegistrations);
          } else {
            setParticipantsCount(data.counts.going);
          }
          setInterestedCount(data.counts.interested || 0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [eventId, hasRegistrations]);

  const handleRegister = async () => {
    if (!session?.user) {
      toast({
        title: t("authRequired"),
        description: t("authRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    if (variants.length > 0 && !selectedVariantId) {
      toast({
        title: t("selectVariantRequired"),
        description: t("selectVariantRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    if (needsConsentOrTeam) {
      consentFlowRef.current = "free";
      setShowConsentDialog(true);
      return;
    }

    await proceedToFreeRegistration();
  };

  const proceedToFreeRegistration = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/participations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          variantId: selectedVariantId || undefined,
          status: "going",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const participation = (await response.json()) as {
        id: string;
        status: string;
        variantId?: string | null;
        variant?: {
          id: string;
          name: string;
          distanceKm?: number | null;
        } | null;
      };

      if (allCustomFieldAnswers.length > 0) {
        await fetch(`/api/events/${eventId}/custom-field-responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: allCustomFieldAnswers,
            participationId: participation.id,
          }),
        });
        resetCustomFieldAnswers();
      }

      const wasInterested = userParticipation?.status === "interested";
      setUserParticipation(participation);
      setParticipantsCount((prev) => prev + 1);
      if (wasInterested) {
        setInterestedCount((prev) => Math.max(0, prev - 1));
      }

      const variantLabel = participation.variant?.name;
      const content = variantLabel
        ? `${t("sharePostWithVariant", { event: eventTitle, variant: variantLabel })}`
        : `${t("sharePost", { event: eventTitle })}`;
      setShareContent(content);
      setShowShareDialog(true);

      toast({
        title: t("markedAsParticipant"),
        description: selectedVariantId
          ? `${t("willParticipateIn")} ${participation.variant?.name}`
          : t("participationRegistered"),
      });
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: t("error"),
        description: t("registrationError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!session?.user) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/participations?eventId=${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to unregister");
      }

      const wasInterested = userParticipation?.status === "interested";
      setUserParticipation(null);
      setSelectedVariantId("");
      if (wasInterested) {
        setInterestedCount((prev) => Math.max(0, prev - 1));
      } else {
        setParticipantsCount((prev) => Math.max(0, prev - 1));
      }

      toast({
        title: wasInterested
          ? t("interestRemoved")
          : t("participationCancelled"),
        description: wasInterested
          ? t("interestRemovedDesc")
          : t("participationCancelledDesc"),
      });
    } catch (error) {
      console.error("Error unregistering:", error);
      toast({
        title: t("error"),
        description: t("cancellationError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkInterested = async () => {
    if (!session?.user) {
      toast({
        title: t("authRequired"),
        description: t("authRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/participations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          status: "interested",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as interested");
      }

      const participation = await response.json();
      setUserParticipation(participation);
      setInterestedCount((prev) => prev + 1);

      toast({
        title: t("markedAsInterested"),
        description: t("markedAsInterestedDesc"),
      });
    } catch (error) {
      console.error("Error marking interested:", error);
      toast({
        title: t("error"),
        description: t("registrationError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharePost = async () => {
    if (!session?.user || !shareContent.trim()) return;

    setIsSharing(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: shareContent,
          eventId,
          isPublic: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setShowShareDialog(false);
      toast({
        title: t("shareSuccess"),
        description: t("shareSuccessDesc"),
      });
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: t("error"),
        description: t("shareError"),
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return {
    state: {
      userParticipation,
      paidRegistration,
      selectedVariantId,
      isLoading,
      participantsCount,
      interestedCount,
      showShareDialog,
      shareContent,
      isSharing,
      registrationChecked,
      showTicketModal,
      isCancellingPending,
      isRetryingPayment,
      showConsentDialog,
      customFields,
      customFieldAnswersMap,
      teamMembers,
      userProfileData,
    },
    actions: {
      setSelectedVariantId,
      setShowShareDialog,
      setShareContent,
      setShowTicketModal,
      setShowConsentDialog,
      setCustomFieldAnswersMap,
      setTeamMembers,
      handleCheckout,
      handleRegister,
      handleUnregister,
      handleMarkInterested,
      handleSharePost,
      handleRetryPayment,
      handleCancelPending,
      handleConsentConfirmed,
    },
    derived: {
      activePrice,
      selectedVariantSoldOut,
      selectedVariantNoPrice,
      allVariantsSoldOut,
      selectedVariantTeamSize,
      needsConsentOrTeam,
      requiredRegistrationFields,
      optionalRegistrationFields,
      consentFlowRef,
    },
    session: sessionData,
  };
}
