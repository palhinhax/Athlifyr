"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, Loader2, Calendar, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  FeaturedEventCard,
  FeaturedEventData,
} from "@/components/featured-event-card";
import { SportBadge } from "@/components/sport-badge";
import { formatDateRange } from "@/lib/event-utils";
import type { SportType, EventVariant } from "@prisma/client";
import Image from "next/image";

interface EventSearchResult {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  city: string;
  country: string;
  imageUrl: string | null;
  isFeatured: boolean;
  sportTypes: SportType[];
  variants: Pick<EventVariant, "id" | "name" | "distanceKm">[];
  _count?: {
    participations: number;
  };
}

interface ShareEventDialogProps {
  venueId: string;
  venueName: string;
  onEventShared?: () => void;
  children: React.ReactNode;
}

export function ShareEventDialog({
  venueId,
  venueName,
  onEventShared,
  children,
}: Readonly<ShareEventDialogProps>) {
  const t = useTranslations("venues.shareEvent");
  const locale = useLocale();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"search" | "preview">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EventSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventSearchResult | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/events?search=${encodeURIComponent(searchQuery)}&limit=10`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.events || []);
        }
      } catch (error) {
        console.error("Error searching events:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectEvent = (event: EventSearchResult) => {
    setSelectedEvent(event);
    setStep("preview");
  };

  const handleBack = () => {
    setStep("search");
    setSelectedEvent(null);
  };

  const handleShare = async () => {
    if (!selectedEvent) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.trim(),
          eventId: selectedEvent.id,
          venueId: venueId,
          isPublic: false, // Venue posts are private to the venue feed
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to share event");
      }

      toast({
        title: t("successTitle"),
        description: t("successDescription"),
      });

      // Reset and close
      setOpen(false);
      setStep("search");
      setSelectedEvent(null);
      setMessage("");
      setSearchQuery("");

      if (onEventShared) {
        onEventShared();
      }
    } catch (error) {
      console.error("Error sharing event:", error);
      toast({
        title: t("errorTitle"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when closing
      setStep("search");
      setSelectedEvent(null);
      setMessage("");
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Convert EventSearchResult to FeaturedEventData
  const convertToFeaturedEventData = (
    event: EventSearchResult
  ): FeaturedEventData => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    city: event.city,
    country: event.country,
    imageUrl: event.imageUrl,
    isFeatured: event.isFeatured,
    sportTypes: event.sportTypes,
    variants: event.variants,
    interestedCount: event._count?.participations,
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "search" ? t("title") : t("previewTitle")}
          </DialogTitle>
          <DialogDescription>
            {step === "search"
              ? t("description", { venueName })
              : t("previewDescription")}
          </DialogDescription>
        </DialogHeader>

        {step === "search" ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {searchResults.length === 0 &&
                searchQuery.length >= 2 &&
                !isSearching && (
                  <p className="py-8 text-center text-muted-foreground">
                    {t("noResults")}
                  </p>
                )}
              {searchResults.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className="flex w-full items-center gap-4 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                >
                  {/* Event Image */}
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <Calendar className="h-6 w-6 text-primary/50" />
                      </div>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium">{event.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDateRange(
                            new Date(event.startDate),
                            event.endDate ? new Date(event.endDate) : null,
                            locale
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.city}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.sportTypes.slice(0, 3).map((sport) => (
                        <SportBadge key={sport} sportType={sport} size="sm" />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Back button */}
            <Button variant="ghost" size="sm" onClick={handleBack}>
              ← {t("back")}
            </Button>

            {/* Event Preview */}
            {selectedEvent && (
              <FeaturedEventCard
                event={convertToFeaturedEventData(selectedEvent)}
                showStats={false}
                showFriendsGoing={false}
                linkToEvent={false}
              />
            )}

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="share-message">{t("messageLabel")}</Label>
              <Textarea
                id="share-message"
                placeholder={t("messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleShare} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("sharing")}
                  </>
                ) : (
                  t("share")
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
