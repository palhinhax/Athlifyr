"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VenueReviewFormProps {
  venueId: string;
  userId?: string;
  existingReview?: {
    id: string;
    content: string;
  } | null;
  onReviewSubmitted: () => void;
}

export function VenueReviewForm({
  venueId,
  userId,
  existingReview,
  onReviewSubmitted,
}: VenueReviewFormProps) {
  const t = useTranslations("venues.reviews");
  const { toast } = useToast();
  const [content, setContent] = useState(existingReview?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(!!existingReview);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: t("loginRequired"),
        description: t("loginRequiredDescription"),
        variant: "destructive",
      });
      return;
    }

    if (content.trim().length < 10) {
      toast({
        title: t("tooShort"),
        description: t("tooShortDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/venues/${venueId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      toast({
        title: existingReview ? t("updated") : t("submitted"),
        description: existingReview
          ? t("updatedDescription")
          : t("submittedDescription"),
      });

      setContent("");
      setShowForm(false);
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !existingReview) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/venues/${venueId}/reviews`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      toast({
        title: t("deleted"),
        description: t("deletedDescription"),
      });

      setContent("");
      setShowForm(false);
      onReviewSubmitted();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("loginRequired")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!showForm && !existingReview) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        variant="outline"
        className="w-full"
      >
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        {t("writeReview")}
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingReview ? t("editReview") : t("writeReview")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("placeholder")}
            disabled={isSubmitting}
            className="min-h-[120px]"
            maxLength={2000}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {content.length}/2000 {t("characters")}
            </span>
            {content.trim().length > 0 && content.trim().length < 10 && (
              <span className="text-destructive">{t("minCharacters")}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || content.trim().length < 10}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {existingReview ? t("update") : t("submit")}
            </Button>
            {existingReview && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {t("delete")}
              </Button>
            )}
            {!existingReview && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setContent("");
                }}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
