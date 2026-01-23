"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2, Reply, Trash2 } from "lucide-react";
import { VenueReviewForm } from "@/components/venue-review-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface ReviewReply {
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
  replies?: ReviewReply[];
}

interface VenueReviewsModalProps {
  venueId: string;
  userId?: string;
  locale: string;
  isOwnerOrAdmin?: boolean;
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
  isOwnerOrAdmin,
  trigger,
}: VenueReviewsModalProps) {
  const t = useTranslations("venues.reviews");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

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

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyContent.trim() || replyContent.length < 10) {
      toast({
        title: t("tooShort"),
        description: t("tooShortDescription"),
        variant: "destructive",
      });
      return;
    }

    setSubmittingReply(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/reviews/${reviewId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: replyContent }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit reply");

      toast({
        title: t("submitted"),
        description: t("submittedDescription"),
      });

      setReplyContent("");
      setReplyingTo(null);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast({
        title: t("error"),
        description: t("replyError"),
        variant: "destructive",
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    try {
      const response = await fetch(
        `/api/venues/${venueId}/reviews/${reviewId}/replies?replyId=${replyId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete reply");

      toast({
        title: t("replyDeleted"),
      });

      fetchReviews();
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast({
        title: t("error"),
        description: t("replyError"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("title")}
          </Button>
        )}
      </DialogTrigger>
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
          {/* Review Form - only for authenticated users */}
          {userId && (
            <>
              <VenueReviewForm
                venueId={venueId}
                userId={userId}
                existingReview={userReview}
                onReviewSubmitted={fetchReviews}
              />
              {reviews.length > 0 && <Separator />}
            </>
          )}

          {/* Reviews List - PUBLIC (visible to all) */}
          {reviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{t("allReviews")}</h3>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex gap-4 rounded-lg border p-4">
                        <Avatar className="h-10 w-10 shrink-0">
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
                            {/* Reply button (only for admin/owner) */}
                            {isOwnerOrAdmin &&
                              userId &&
                              review.user.id !== userId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReplyingTo(review.id)}
                                >
                                  <Reply className="mr-1 h-4 w-4" />
                                  {t("reply")}
                                </Button>
                              )}
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {review.content}
                          </p>

                          {/* Replies */}
                          {review.replies && review.replies.length > 0 && (
                            <div className="mt-4 space-y-2 border-l-2 border-primary/20 pl-4">
                              <p className="text-xs font-semibold text-primary">
                                {t("venueResponse")}
                              </p>
                              {review.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="rounded-md bg-muted/50 p-3"
                                >
                                  <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={reply.user.image || undefined}
                                        alt={reply.user.name || "Admin"}
                                      />
                                      <AvatarFallback>
                                        {reply.user.name?.[0]?.toUpperCase() ||
                                          "A"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                          {reply.user.name || t("anonymous")}
                                        </p>
                                        {(isOwnerOrAdmin ||
                                          reply.user.id === userId) && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              handleDeleteReply(
                                                review.id,
                                                reply.id
                                              )
                                            }
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                          new Date(reply.createdAt),
                                          {
                                            addSuffix: true,
                                            locale: dateLocale,
                                          }
                                        )}
                                      </p>
                                      <p className="mt-1 text-sm">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === review.id && (
                        <div className="ml-14 rounded-lg border border-primary/20 bg-muted/30 p-4">
                          <p className="mb-2 text-sm font-semibold">
                            {t("writeReply")}
                          </p>
                          <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={t("replyPlaceholder")}
                            rows={3}
                            className="mb-2"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReply(review.id)}
                              disabled={
                                submittingReply || replyContent.length < 10
                              }
                            >
                              {submittingReply && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {t("replySubmit")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                            >
                              {t("replyCancel")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {reviews.length === 0 && !isLoading && (
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
