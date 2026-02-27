"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Check,
  X,
  Users,
  Share2,
  Send,
  Target,
  Loader2,
  CreditCard,
  Ticket,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventTicketModal } from "@/components/event-ticket-modal";
import { RegistrationConsentDialog } from "@/components/registration-consent-dialog";
import { CustomFieldsForm } from "@/components/custom-fields-form";
import type { CustomField, CustomFieldAnswer } from "@/types/custom-fields";

interface PricingPhase {
  id: string;
  name: string | null;
  price: number;
  currency: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
}

interface EventVariant {
  id: string;
  name: string;
  distanceKm?: number | null;
  startDate?: Date | string | null;
  startTime?: string | null;
  maxParticipants?: number | null;
  registrationCount?: number;
  pricingPhases?: PricingPhase[];
}

interface Participation {
  id: string;
  status: string;
  variantId?: string | null;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  } | null;
}

interface PaidRegistration {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
  variantId: string;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  } | null;
  amountCents: number;
  currency: string;
}

interface EventRegistrationProps {
  eventId: string;
  eventTitle: string;
  hasRegistrations?: boolean;
  variants?: EventVariant[];
  registrationFieldSettings?: Record<string, string>;
}

export function EventRegistration({
  eventId,
  eventTitle,
  hasRegistrations = false,
  variants = [],
  registrationFieldSettings = {},
}: EventRegistrationProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
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
  const [userProfileData, setUserProfileData] = useState<{
    dateOfBirth: string | null;
    citizenId: string | null;
    nationality: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
  } | null>(null);

  // Custom fields state
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldAnswers, setCustomFieldAnswers] = useState<
    CustomFieldAnswer[]
  >([]);

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
          const data = (await res.json()) as {
            dateOfBirth: string | null;
            citizenId: string | null;
            nationality: string | null;
            emergencyContactName: string | null;
            emergencyContactPhone: string | null;
          };
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
      // Confirm registration directly with Stripe (safety-net, don't rely on webhook)
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
      // Clean up the URL params without reloading
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
      // User cancelled Stripe checkout — clear any stale PENDING registration
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

      // Also tell the backend to delete the stale PENDING registration immediately
      void fetch(`/api/events/${eventId}/registration/cancel`, {
        method: "POST",
      }).catch(() => {
        // Ignore errors — backend cleanup is best-effort
      });
    }
  }, [searchParams, toast, t, hasRegistrations, eventId]);

  // Fetch paid registration status for hasRegistrations mode
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!hasRegistrations || status !== "authenticated" || !session?.user?.id)
        return;

      // If user just cancelled checkout, don't re-fetch (it would restore the stale PENDING)
      if (justCancelledRef.current) return;

      // Also check URL param directly in case the ref hasn't been set yet
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
          // Double-check ref after async fetch — cancel handler may have run during the request
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

  // Auto-poll when registration is PENDING (webhook may be delayed)
  useEffect(() => {
    if (
      !hasRegistrations ||
      paidRegistration?.status !== "PENDING" ||
      justCancelledRef.current
    )
      return;

    const pollInterval = setInterval(async () => {
      // Stop polling if user cancelled in the meantime
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
            // Registration was cleaned up (Stripe session expired/cancelled)
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

    // Stop polling after 2 minutes max — auto-expire stale PENDING
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      justCancelledRef.current = true;
      setPaidRegistration(null);
      // Delete the stale PENDING registration from the database
      void fetch(`/api/events/${eventId}/registration/cancel`, {
        method: "POST",
      }).catch(() => {});
    }, 120_000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [eventId, hasRegistrations, paidRegistration?.status]);

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

  // Check if a variant is sold out
  const isVariantSoldOut = (variant: EventVariant): boolean => {
    if (!variant.maxParticipants) return false;
    return (variant.registrationCount ?? 0) >= variant.maxParticipants;
  };

  // Check if the currently selected variant is sold out
  const selectedVariantSoldOut = (() => {
    if (!selectedVariantId) return false;
    const variant = variants.find((v) => v.id === selectedVariantId);
    return variant ? isVariantSoldOut(variant) : false;
  })();

  // Check if ALL variants are sold out
  const allVariantsSoldOut =
    variants.length > 0 && variants.every((v) => isVariantSoldOut(v));

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

    // Show consent dialog if event has configured fields (required or optional)
    if (hasConfiguredFields) {
      consentFlowRef.current = "checkout";
      setShowConsentDialog(true);
      return;
    }

    await proceedToCheckout();
  };

  // Actually proceed to Stripe checkout (called directly or after consent)
  const proceedToCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariantId || undefined,
          customFieldAnswers:
            customFieldAnswers.length > 0 ? customFieldAnswers : undefined,
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

      // Save custom field answers linked to the PENDING registration
      if (customFieldAnswers.length > 0 && checkoutData.registrationId) {
        await fetch(`/api/events/${eventId}/custom-field-responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: customFieldAnswers,
            registrationId: checkoutData.registrationId,
          }),
        });
        setCustomFieldAnswers([]);
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

  // Called when user confirms consent dialog
  const handleConsentConfirmed = () => {
    setShowConsentDialog(false);
    // Re-fetch profile to update local data after potential profile save
    void fetch("/api/profile")
      .then((res) => res.json())
      .then(
        (data: {
          dateOfBirth: string | null;
          citizenId: string | null;
          nationality: string | null;
          emergencyContactName: string | null;
          emergencyContactPhone: string | null;
        }) => {
          setUserProfileData({
            dateOfBirth: data.dateOfBirth,
            citizenId: data.citizenId,
            nationality: data.nationality,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
          });
        }
      )
      .catch(() => {});
    // Route to the correct flow based on what triggered the consent dialog
    if (consentFlowRef.current === "free") {
      void proceedToFreeRegistration();
    } else {
      void proceedToCheckout();
    }
  };

  // Retry payment for a PENDING registration (creates a new Stripe checkout session)
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

  // Cancel a PENDING registration (delete it and free the spot)
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
          // For paid registration events, count confirmed registrations
          // For free events, count "going" participations
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

    // Show consent dialog if event has configured fields (required or optional)
    if (hasConfiguredFields) {
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
        headers: {
          "Content-Type": "application/json",
        },
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

      // Save custom field answers if any
      if (customFieldAnswers.length > 0) {
        await fetch(`/api/events/${eventId}/custom-field-responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: customFieldAnswers,
            participationId: participation.id,
          }),
        });
        setCustomFieldAnswers([]);
      }

      const wasInterested = userParticipation?.status === "interested";
      setUserParticipation(participation);
      setParticipantsCount((prev) => prev + 1);
      if (wasInterested) {
        setInterestedCount((prev) => Math.max(0, prev - 1));
      }

      // Prepare share content in user's language
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
      // Decrement the correct counter based on previous status
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
        headers: {
          "Content-Type": "application/json",
        },
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

  if (status === "loading") {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">
          {hasRegistrations ? t("registerTitle") : t("willYouGo")}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {participantsCount} {t("participants")}
            </span>
          </div>
          {interestedCount > 0 && (
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>
                {interestedCount} {t("interestedCount")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── PAID REGISTRATION MODE ─────────────────────────── */}
      {hasRegistrations ? (
        !session?.user ? (
          <div className="text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              {t("loginToParticipate")}
            </p>
            <Button asChild size="sm">
              <Link href="/auth/signin">{t("signIn")}</Link>
            </Button>
          </div>
        ) : !registrationChecked ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : paidRegistration?.status === "CONFIRMED" ? (
          /* User has a confirmed paid registration */
          <div className="space-y-4">
            <div className="rounded-md bg-p-brand/10 p-4 text-sm">
              <div className="mb-1 flex items-center gap-2 font-medium text-p-brand">
                <Check className="h-5 w-5" />
                {t("registrationConfirmed")}
              </div>
              {paidRegistration.variant && (
                <p className="text-muted-foreground">
                  {t("variant")}: {paidRegistration.variant.name}
                  {paidRegistration.variant.distanceKm &&
                    ` - ${paidRegistration.variant.distanceKm}km`}
                  {paidRegistration.variant.startDate && (
                    <span className="ml-1">
                      (
                      {new Date(
                        paidRegistration.variant.startDate
                      ).toLocaleDateString("pt-PT", {
                        day: "numeric",
                        month: "short",
                      })}
                      {paidRegistration.variant.startTime &&
                        ` ${paidRegistration.variant.startTime}`}
                      )
                    </span>
                  )}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                <CreditCard className="mr-1 inline-block h-3 w-3" />
                {t("paymentConfirmed")} •{" "}
                {(paidRegistration.amountCents / 100).toLocaleString("pt-PT", {
                  style: "currency",
                  currency: paidRegistration.currency,
                })}
              </p>
            </div>
            <Button
              onClick={() => setShowTicketModal(true)}
              variant="outline"
              className="w-full gap-2"
            >
              <Ticket className="h-4 w-4" />
              {t("showTicket")}
            </Button>
            <EventTicketModal
              eventId={eventId}
              open={showTicketModal}
              onOpenChange={setShowTicketModal}
            />
          </div>
        ) : paidRegistration?.status === "PENDING" ? (
          /* User has a pending registration (payment processing) */
          <div className="space-y-4">
            <div className="rounded-md bg-amber-500/10 p-4 text-sm">
              <div className="mb-1 flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
                {t("registrationPending")}
              </div>
              <p className="text-muted-foreground">
                {t("registrationPendingDesc")}
              </p>
              {paidRegistration.variant && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {paidRegistration.variant.name}
                  {paidRegistration.variant.distanceKm
                    ? ` (${paidRegistration.variant.distanceKm}km)`
                    : ""}
                </p>
              )}
            </div>

            {/* Action buttons: Retry or Cancel */}
            <div className="flex gap-3">
              <Button
                onClick={handleRetryPayment}
                disabled={isRetryingPayment || isCancellingPending}
                className="flex-1 gap-2"
              >
                {isRetryingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                {t("retryPayment")}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelPending}
                disabled={isRetryingPayment || isCancellingPending}
                className="gap-2"
              >
                {isCancellingPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                {t("cancelPending")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* All variants sold out message */}
            {allVariantsSoldOut && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm">
                <div className="flex items-center gap-2 font-medium text-destructive">
                  <X className="h-5 w-5" />
                  {t("allSoldOut")}
                </div>
                <p className="mt-1 text-muted-foreground">
                  {t("allSoldOutDesc")}
                </p>
              </div>
            )}

            {/* Variant Selection */}
            {variants.length > 0 && !allVariantsSoldOut && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t("chooseVariant")}
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading}
                >
                  <option value="">{t("selectVariantPlaceholder")}</option>
                  {variants.map((variant) => {
                    const variantDate = variant.startDate
                      ? new Date(variant.startDate).toLocaleDateString(
                          "pt-PT",
                          { day: "numeric", month: "short" }
                        )
                      : null;
                    const soldOut = isVariantSoldOut(variant);
                    return (
                      <option
                        key={variant.id}
                        value={variant.id}
                        disabled={soldOut}
                      >
                        {variant.name}
                        {variant.distanceKm && ` - ${variant.distanceKm}km`}
                        {variantDate && ` (${variantDate})`}
                        {variant.startTime && ` ${variant.startTime}`}
                        {soldOut && ` — ${t("soldOut")}`}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Sold Out indicator for selected variant */}
            {selectedVariantSoldOut && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
                <span className="font-semibold text-destructive">
                  {t("soldOut")}
                </span>
                <span className="ml-1 text-muted-foreground">
                  — {t("variantSoldOutDesc")}
                </span>
              </div>
            )}

            {/* Active Price Display */}
            {activePrice && !selectedVariantSoldOut && (
              <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                  {activePrice.name ?? t("currentPrice")}:{" "}
                </span>
                <span className="text-lg font-bold">
                  {activePrice.price.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: activePrice.currency,
                  })}
                </span>
              </div>
            )}

            {!allVariantsSoldOut && (
              <>
                <Button
                  onClick={() => void handleCheckout()}
                  disabled={
                    isLoading ||
                    selectedVariantSoldOut ||
                    (variants.length > 0 && !selectedVariantId)
                  }
                  className="w-full"
                  size="lg"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isLoading ? t("redirectingToPayment") : t("registerAndPay")}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {t("securePaymentInfo")}
                </p>
              </>
            )}
          </div>
        )
      ) : /* ── FREE PARTICIPATION MODE ──────────────────────── */
      !session?.user ? (
        <div className="text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            {t("loginToParticipate")}
          </p>
          <Button asChild size="sm">
            <Link href="/auth/signin">{t("signIn")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* All variants sold out message */}
          {allVariantsSoldOut && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm">
              <div className="flex items-center gap-2 font-medium text-destructive">
                <X className="h-5 w-5" />
                {t("allSoldOut")}
              </div>
              <p className="mt-1 text-muted-foreground">
                {t("allSoldOutDesc")}
              </p>
            </div>
          )}

          {/* Variant Selection */}
          {variants.length > 0 && !userParticipation && !allVariantsSoldOut && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("chooseVariant")}
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isLoading}
              >
                <option value="">{t("selectVariantPlaceholder")}</option>
                {variants.map((variant) => {
                  const variantDate = variant.startDate
                    ? new Date(variant.startDate).toLocaleDateString("pt-PT", {
                        day: "numeric",
                        month: "short",
                      })
                    : null;
                  const soldOut = isVariantSoldOut(variant);
                  return (
                    <option
                      key={variant.id}
                      value={variant.id}
                      disabled={soldOut}
                    >
                      {variant.name}
                      {variant.distanceKm && ` - ${variant.distanceKm}km`}
                      {variantDate && ` (${variantDate})`}
                      {variant.startTime && ` ${variant.startTime}`}
                      {soldOut && ` — ${t("soldOut")}`}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Sold Out indicator for selected variant (free mode) */}
          {selectedVariantSoldOut && !userParticipation && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
              <span className="font-semibold text-destructive">
                {t("soldOut")}
              </span>
              <span className="ml-1 text-muted-foreground">
                — {t("variantSoldOutDesc")}
              </span>
            </div>
          )}

          {/* Current Participation Status */}
          {userParticipation && userParticipation.status === "going" && (
            <div className="rounded-md bg-p-brand/10 p-3 text-sm">
              <div className="mb-1 flex items-center gap-2 font-medium text-p-brand">
                <Check className="h-4 w-4" />
                {t("registered")}
              </div>
              {userParticipation.variant && (
                <p className="text-muted-foreground">
                  {t("variant")}: {userParticipation.variant.name}
                  {userParticipation.variant.distanceKm &&
                    ` - ${userParticipation.variant.distanceKm}km`}
                  {userParticipation.variant.startDate && (
                    <span className="ml-1">
                      (
                      {new Date(
                        userParticipation.variant.startDate
                      ).toLocaleDateString("pt-PT", {
                        day: "numeric",
                        month: "short",
                      })}
                      {userParticipation.variant.startTime &&
                        ` ${userParticipation.variant.startTime}`}
                      )
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          {userParticipation && userParticipation.status === "interested" && (
            <div className="rounded-md bg-amber-500/10 p-3 text-sm">
              <div className="mb-1 flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                <Target className="h-4 w-4" />
                {t("markedAsInterested")}
              </div>
              <p className="text-muted-foreground">{t("interestedDesc")}</p>
            </div>
          )}

          {/* Action Buttons */}
          {!allVariantsSoldOut && (
            <div className="flex gap-3">
              {!userParticipation ? (
                <>
                  <Button
                    onClick={handleRegister}
                    disabled={isLoading || selectedVariantSoldOut}
                    className="flex-1"
                    size="sm"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {t("markAsGoing")}
                  </Button>
                  <Button
                    onClick={handleMarkInterested}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    {t("markAsInterested")}
                  </Button>
                </>
              ) : userParticipation.status === "interested" ? (
                <>
                  <Button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="flex-1"
                    size="sm"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {t("markAsGoing")}
                  </Button>
                  <Button
                    onClick={handleUnregister}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
                    size="sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t("removeInterest")}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleUnregister}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <X className="mr-2 h-4 w-4" />
                  {t("cancelParticipation")}
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Registration Consent Dialog */}
      {hasConfiguredFields && (
        <RegistrationConsentDialog
          open={showConsentDialog}
          onOpenChange={setShowConsentDialog}
          requiredFields={requiredRegistrationFields}
          optionalFields={optionalRegistrationFields}
          userProfile={userProfileData}
          onConfirm={handleConsentConfirmed}
          hasCustomFields={customFields.length > 0}
          customFields={customFields}
          customFieldAnswers={customFieldAnswers}
          customFieldsSlot={
            customFields.length > 0 ? (
              <CustomFieldsForm
                fields={customFields}
                answers={customFieldAnswers}
                onAnswersChange={setCustomFieldAnswers}
              />
            ) : undefined
          }
        />
      )}

      {/* Share Post Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              {t("shareDialogTitle")}
            </DialogTitle>
            <DialogDescription>{t("shareDialogDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <textarea
              value={shareContent}
              onChange={(e) => setShareContent(e.target.value)}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              maxLength={500}
            />
            <p className="text-right text-xs text-muted-foreground">
              {shareContent.length}/500
            </p>
          </div>
          <DialogFooter className="flex-row gap-2 sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowShareDialog(false)}
              disabled={isSharing}
            >
              {t("shareSkip")}
            </Button>
            <Button
              onClick={handleSharePost}
              disabled={isSharing || !shareContent.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSharing ? t("sharePublishing") : t("sharePublish")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
