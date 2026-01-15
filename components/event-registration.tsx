"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

interface EventVariant {
  id: string;
  name: string;
  distanceKm?: number | null;
  startDate?: Date | string | null;
  startTime?: string | null;
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

interface EventRegistrationProps {
  eventId: string;
  variants?: EventVariant[];
}

export function EventRegistration({
  eventId,
  variants = [],
}: EventRegistrationProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const t = useTranslations("events.registration");
  const [userParticipation, setUserParticipation] =
    useState<Participation | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

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
          setParticipantsCount(data.counts.going);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [eventId]);

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

      const participation = await response.json();
      setUserParticipation(participation);
      setParticipantsCount((prev) => prev + 1);

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

      setUserParticipation(null);
      setSelectedVariantId("");
      setParticipantsCount((prev) => Math.max(0, prev - 1));

      toast({
        title: t("participationCancelled"),
        description: t("participationCancelledDesc"),
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

  if (status === "loading") {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">{t("willYouGo")}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {participantsCount} {t("participants")}
          </span>
        </div>
      </div>

      {!session?.user ? (
        <div className="text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            {t("loginToParticipate")}
          </p>
          <Button asChild size="sm">
            <a href="/auth/signin">{t("signIn")}</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Variant Selection */}
          {variants.length > 0 && !userParticipation && (
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
                  return (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                      {variant.distanceKm && ` - ${variant.distanceKm}km`}
                      {variantDate && ` (${variantDate})`}
                      {variant.startTime && ` ${variant.startTime}`}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Current Participation Status */}
          {userParticipation && (
            <div className="rounded-md bg-primary/10 p-3 text-sm">
              <div className="mb-1 flex items-center gap-2 font-medium text-primary">
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!userParticipation ? (
              <Button
                onClick={handleRegister}
                disabled={isLoading}
                className="flex-1"
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                {t("markAsGoing")}
              </Button>
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
        </div>
      )}
    </div>
  );
}
