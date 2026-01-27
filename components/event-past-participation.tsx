"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Trophy,
  Clock,
  Check,
  X,
  Users,
  Medal,
  Activity,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { formatTimeDisplay } from "@/lib/time-utils";
import { TimeInput } from "@/components/time-input";

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
  completionTime?: number | null;
  variantId?: string | null;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  } | null;
}

interface EventResult {
  id: string;
  time: string;
  timeSeconds?: number | null;
  position?: number | null;
  categoryPosition?: number | null;
  notes?: string | null;
  variantId?: string | null;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
  } | null;
}

interface EventPastParticipationProps {
  eventId: string;
  variants?: EventVariant[];
}

export function EventPastParticipation({
  eventId,
  variants = [],
}: EventPastParticipationProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const t = useTranslations("events.pastParticipation");
  const [userParticipation, setUserParticipation] =
    useState<Participation | null>(null);
  const [userResults, setUserResults] = useState<EventResult[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [completionTimeSeconds, setCompletionTimeSeconds] = useState<
    number | null
  >(null);
  const [position, setPosition] = useState<string>("");
  const [categoryPosition, setCategoryPosition] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

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
            setCompletionTimeSeconds(myParticipation.completionTime || null);
          }
        }
      } catch (error) {
        console.error("Error fetching participation:", error);
      }
    };

    fetchParticipation();
  }, [eventId, session?.user?.id, status]);

  // Fetch user's results for this event
  const fetchResults = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) return;

    try {
      const response = await fetch(`/api/events/${eventId}/results`);
      if (response.ok) {
        const data = await response.json();
        setUserResults(data.results || []);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }, [eventId, session?.user?.id, status]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Fetch total participants count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`/api/participations?eventId=${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setParticipantsCount(data.counts.going + (data.counts.went || 0));
          setCompletedCount(data.counts.went || 0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [eventId]);

  const handleMarkAsWent = async () => {
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
      // 1. Create participation
      const response = await fetch("/api/participations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          variantId: selectedVariantId || undefined,
          status: "went",
          completionTime: completionTimeSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const participation = await response.json();
      setUserParticipation(participation);
      setParticipantsCount((prev) => prev + 1);
      setCompletedCount((prev) => prev + 1);

      // 2. If user provided a time and selected a variant, also create a Result
      // This will link to UserPerformanceEntry and appear in the Performance section
      if (completionTimeSeconds && selectedVariantId) {
        const hours = Math.floor(completionTimeSeconds / 3600);
        const minutes = Math.floor((completionTimeSeconds % 3600) / 60);
        const secs = completionTimeSeconds % 60;
        const timeString =
          hours > 0
            ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
            : `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

        try {
          const resultResponse = await fetch(`/api/events/${eventId}/results`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              variantId: selectedVariantId,
              time: timeString,
              position: position ? parseInt(position, 10) : null,
              categoryPosition: categoryPosition
                ? parseInt(categoryPosition, 10)
                : null,
              notes: notes || null,
              isPublic: true,
            }),
          });

          if (resultResponse.ok) {
            const resultData = await resultResponse.json();
            setUserResults((prev) => [...prev, resultData.result]);
            toast({
              title: t("markedAsCompleted"),
              description: t("resultAddedToPerformance"),
            });
          }
        } catch (resultError) {
          console.error("Error creating result:", resultError);
          // Still show success for participation even if result creation failed
          toast({
            title: t("markedAsCompleted"),
            description: selectedVariantId
              ? `${t("completedVariant")} ${participation.variant?.name}`
              : t("participationRegistered"),
          });
        }
      } else {
        toast({
          title: t("markedAsCompleted"),
          description: selectedVariantId
            ? `${t("completedVariant")} ${participation.variant?.name}`
            : t("participationRegistered"),
        });
      }
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

  const handleUpdateTime = async () => {
    if (!session?.user || !userParticipation) return;

    setIsLoading(true);

    try {
      // 1. Update participation
      const response = await fetch("/api/participations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          completionTime: completionTimeSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update time");
      }

      const participation = await response.json();
      setUserParticipation(participation);
      setIsEditingTime(false);

      // 2. Update or create Result if time is provided
      if (completionTimeSeconds && userParticipation.variantId) {
        const hours = Math.floor(completionTimeSeconds / 3600);
        const minutes = Math.floor((completionTimeSeconds % 3600) / 60);
        const secs = completionTimeSeconds % 60;
        const timeString =
          hours > 0
            ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
            : `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

        // Check if result already exists for this variant
        const existingResult = userResults.find(
          (r) => r.variantId === userParticipation.variantId
        );

        if (existingResult) {
          // Update existing result
          await fetch(`/api/events/${eventId}/results`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              variantId: userParticipation.variantId,
              time: timeString,
              isPublic: true,
            }),
          });
        } else {
          // Create new result
          const resultResponse = await fetch(`/api/events/${eventId}/results`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              variantId: userParticipation.variantId,
              time: timeString,
              isPublic: true,
            }),
          });

          if (resultResponse.ok) {
            const resultData = await resultResponse.json();
            setUserResults((prev) => [...prev, resultData.result]);
          }
        }

        // Refresh results
        fetchResults();
      }

      toast({
        title: t("timeUpdated"),
        description: t("timeUpdatedDesc"),
      });
    } catch (error) {
      console.error("Error updating time:", error);
      toast({
        title: t("error"),
        description: t("updateError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveParticipation = async () => {
    if (!session?.user) return;

    setIsLoading(true);

    try {
      // 1. Delete associated results first
      if (userResults.length > 0) {
        for (const result of userResults) {
          if (result.variantId) {
            await fetch(
              `/api/events/${eventId}/results?variantId=${result.variantId}`,
              { method: "DELETE" }
            );
          }
        }
        setUserResults([]);
      }

      // 2. Delete participation
      const response = await fetch(`/api/participations?eventId=${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove");
      }

      setUserParticipation(null);
      setSelectedVariantId("");
      setCompletionTimeSeconds(null);
      setPosition("");
      setCategoryPosition("");
      setNotes("");
      setParticipantsCount((prev) => Math.max(0, prev - 1));
      setCompletedCount((prev) => Math.max(0, prev - 1));

      toast({
        title: t("participationRemoved"),
        description: t("participationRemovedDesc"),
      });
    } catch (error) {
      console.error("Error removing:", error);
      toast({
        title: t("error"),
        description: t("removalError"),
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
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold">{t("didYouParticipate")}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {participantsCount} {t("participants")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>
              {completedCount} {t("completedCount")}
            </span>
          </div>
        </div>
      </div>

      {!session?.user ? (
        <div className="text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            {t("loginToLog")}
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

          {/* Completion Time Input - Before Marking */}
          {!userParticipation && (
            <div className="space-y-4">
              {/* Time Input */}
              <div>
                <Label
                  htmlFor="completionTime"
                  className="mb-2 flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {t("completionTime")}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({t("optional")})
                  </span>
                </Label>
                <TimeInput
                  value={completionTimeSeconds}
                  onChange={setCompletionTimeSeconds}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("timeFormat")}
                </p>
              </div>

              {/* Advanced Options Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAdvancedOptions ? "rotate-180" : ""}`}
                />
                {t("moreDetails")}
              </button>

              {/* Advanced Options */}
              {showAdvancedOptions && (
                <div className="space-y-4 border-l-2 border-muted pl-2">
                  {/* Position */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="position"
                        className="mb-2 flex items-center gap-2"
                      >
                        <Medal className="h-4 w-4" />
                        {t("generalPosition")}
                      </Label>
                      <Input
                        id="position"
                        type="number"
                        min="1"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder={t("positionPlaceholder")}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="categoryPosition"
                        className="mb-2 flex items-center gap-2"
                      >
                        <Activity className="h-4 w-4" />
                        {t("categoryPosition")}
                      </Label>
                      <Input
                        id="categoryPosition"
                        type="number"
                        min="1"
                        value={categoryPosition}
                        onChange={(e) => setCategoryPosition(e.target.value)}
                        placeholder={t("positionPlaceholder")}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="mb-2 block">
                      {t("notes")}
                    </Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t("notesPlaceholder")}
                      className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Participation Status */}
          {userParticipation && (
            <div className="rounded-md bg-green-500/10 p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                <Trophy className="h-5 w-5" />
                {t("completedStatus")}
              </div>
              {userParticipation.variant && (
                <p className="mb-2 text-muted-foreground">
                  <span className="font-medium">{t("variant")}:</span>{" "}
                  {userParticipation.variant.name}
                  {userParticipation.variant.distanceKm &&
                    ` - ${userParticipation.variant.distanceKm}km`}
                </p>
              )}

              {/* Time Display/Edit */}
              {isEditingTime ? (
                <div className="space-y-2">
                  <Label htmlFor="editTime" className="text-xs">
                    {t("completionTime")}
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <TimeInput
                        value={completionTimeSeconds}
                        onChange={setCompletionTimeSeconds}
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      onClick={handleUpdateTime}
                      disabled={isLoading}
                      size="sm"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingTime(false);
                        setCompletionTimeSeconds(
                          userParticipation.completionTime || null
                        );
                      }}
                      disabled={isLoading}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {userParticipation.completionTime
                        ? formatTimeDisplay(userParticipation.completionTime)
                        : t("noTime")}
                    </span>
                  </div>
                  <Button
                    onClick={() => setIsEditingTime(true)}
                    variant="ghost"
                    size="sm"
                  >
                    {userParticipation.completionTime
                      ? t("editTime")
                      : t("addTime")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!userParticipation ? (
              <Button
                onClick={handleMarkAsWent}
                disabled={isLoading}
                className="flex-1"
                size="sm"
              >
                <Trophy className="mr-2 h-4 w-4" />
                {t("markAsCompleted")}
              </Button>
            ) : (
              <Button
                onClick={handleRemoveParticipation}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                {t("removeParticipation")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
