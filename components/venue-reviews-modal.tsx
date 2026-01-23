"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { VenueReviewForm } from "@/components/venue-review-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface VenueReviewsModalProps {
  venueId: string;
  userId?: string;
  locale: string;
  trigger?: React.ReactNode;
}

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function VenueReviewsModal({
  venueId,
  userId,
  locale,
  trigger,
}: VenueReviewsModalProps) {
  const t = useTranslations("venues.reviews");
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      setReviews(data.reviews);

      // Find user's review if exists
      if (userId) {
        const myReview = data.reviews.find((r: Review) => r.user.id === userId);
        setUserReview(myReview || null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [venueId, userId]);

  useEffect(() => {
    if (open) {
      fetchReviews();
    }
  }, [open, fetchReviews]);

  const otherReviews = reviews.filter((r) => r.user.id !== userId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger || (
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          {t("title")}
        </Button>
      )}
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {reviews.length} {t("reviewsCount")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Form */}
          <VenueReviewForm
            venueId={venueId}
            userId={userId}
            existingReview={userReview}
            onReviewSubmitted={fetchReviews}
          />

          {/* Reviews List */}
          {otherReviews.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">{t("allReviews")}</h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {otherReviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex gap-4 rounded-lg border p-4"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={review.user.image || undefined}
                            alt={review.user.name || "User"}
                          />
                          <AvatarFallback>
                            {review.user.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">
                                {review.user.name || t("anonymous")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(review.createdAt),
                                  {
                                    addSuffix: true,
                                    locale: dateLocale,
                                  }
                                )}
                                {review.updatedAt !== review.createdAt && (
                                  <span className="ml-1">({t("edited")})</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {review.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {otherReviews.length === 0 && !userReview && !isLoading && (
            <div className="py-8 text-center text-muted-foreground">
              <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>{t("noReviews")}</p>
              <p className="text-sm">{t("beFirst")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
