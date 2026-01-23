"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { VenueReviewForm } from "@/components/venue-review-form";

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

interface VenueReviewsProps {
  venueId: string;
  userId?: string;
  locale: string;
}

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function VenueReviews({ venueId, userId, locale }: VenueReviewsProps) {
  const t = useTranslations("venues.reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  const fetchReviews = async () => {
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
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const otherReviews = reviews.filter((r) => r.user.id !== userId);

  return (
    <div className="space-y-6">
      {/* Review Form */}
      <VenueReviewForm
        venueId={venueId}
        userId={userId}
        existingReview={userReview}
        onReviewSubmitted={fetchReviews}
      />

      {/* Reviews List */}
      {(otherReviews.length > 0 || userReview) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t("allReviews")}
            </CardTitle>
            <CardDescription>
              {reviews.length} {t("reviewsCount")}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                            locale: dateLocale,
                          })}
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

              {otherReviews.length === 0 && !userReview && (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>{t("noReviews")}</p>
                  <p className="text-sm">{t("beFirst")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
