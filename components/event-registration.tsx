"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, X, Users, Share2, Send, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  eventTitle: string;
  variants?: EventVariant[];
}

export function EventRegistration({
  eventId,
  eventTitle,
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
  const [interestedCount, setInterestedCount] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareContent, setShareContent] = useState("");
  const [isSharing, setIsSharing] = useState(false);

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
          setInterestedCount(data.counts.interested || 0);
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
        title: wasInterested ? t("interestRemoved") : t("participationCancelled"),
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
        <h3 className="text-xl font-bold">{t("willYouGo")}</h3>
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

      {!session?.user ? (
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
              <p className="text-muted-foreground">
                {t("interestedDesc")}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!userParticipation ? (
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
        </div>
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
