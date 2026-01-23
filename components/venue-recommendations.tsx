"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface VenueRecommendationsProps {
  venueId: string;
  userId?: string;
  className?: string;
}

export function VenueRecommendations({
  venueId,
  userId,
  className,
}: VenueRecommendationsProps) {
  const t = useTranslations("venues.recommendations");
  const { toast } = useToast();
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [userHasRecommended, setUserHasRecommended] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}/likes`);
      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data = await response.json();
      setRecommendationCount(data.recommendationCount);
      setUserHasRecommended(data.userHasRecommended);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRecommendation = async () => {
    if (!userId) {
      toast({
        title: t("loginRequired"),
        description: t("loginRequiredDescription"),
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/venues/${venueId}/likes`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to toggle recommendation");

      const data = await response.json();
      setRecommendationCount(data.recommendationCount);
      setUserHasRecommended(data.userHasRecommended);

      // Show success toast
      toast({
        title:
          data.action === "recommended" ? t("recommended") : t("unrecommended"),
        description:
          data.action === "recommended"
            ? t("recommendedDescription")
            : t("unrecommendedDescription"),
      });
    } catch (error) {
      console.error("Error toggling recommendation:", error);
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex animate-pulse items-center gap-2", className)}>
        <div className="h-9 w-20 rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant={userHasRecommended ? "default" : "outline"}
        size="sm"
        onClick={handleToggleRecommendation}
        disabled={isSubmitting}
        className="gap-1.5"
      >
        <Star
          className={cn(
            "h-4 w-4 transition-all",
            userHasRecommended && "fill-current"
          )}
        />
        <span className="font-medium">{recommendationCount}</span>
        <span className="hidden sm:inline">{t("recommendations")}</span>
      </Button>
    </div>
  );
}
