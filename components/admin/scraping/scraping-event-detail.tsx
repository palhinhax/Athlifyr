"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  ExternalLink,
  FileText,
  Trash2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ScrapedVariant {
  id: string;
  name: string;
  distance_km: number | null;
  elevation_gain_m: number | null;
  start_time: string | null;
  price: number | null;
  currency: string;
}

interface ScrapedPricingPhase {
  id: string;
  variant_name: string | null;
  phase_name: string | null;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  currency: string;
}

interface ScrapedDocument {
  id: string;
  document_type: string;
  original_url: string | null;
  file_name: string | null;
  downloaded: boolean;
}

interface ScrapedEventDetail {
  id: string;
  source_name: string;
  source_url: string;
  title: string;
  description: string | null;
  sport_types: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  city: string | null;
  country: string;
  organizer_name: string | null;
  external_url: string | null;
  image_url: string | null;
  review_status: string;
  review_notes: string | null;
  admin_notes: string | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  ai_input: string | null;
  ai_output: string | null;
  variants: ScrapedVariant[];
  pricing_phases: ScrapedPricingPhase[];
  documents: ScrapedDocument[];
}

interface ScrapingEventDetailProps {
  eventId: string | null;
  apiUrl: string;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export function ScrapingEventDetail({
  eventId,
  apiUrl,
  open,
  onClose,
  onUpdated,
}: Readonly<ScrapingEventDetailProps>) {
  const t = useTranslations("admin.scraping");
  const [event, setEvent] = useState<ScrapedEventDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rescraping, setRescraping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!eventId || !open) return;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/events/${eventId}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data: ScrapedEventDetail = await res.json();
        setEvent(data);
        setReviewStatus(data.review_status);
        setReviewNotes(data.review_notes || "");
        setAdminNotes(data.admin_notes || "");
        setIsHidden(data.is_hidden);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, open, apiUrl]);

  const handleSave = async () => {
    if (!eventId) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review_status: reviewStatus,
          review_notes: reviewNotes || null,
          admin_notes: adminNotes || null,
          is_hidden: isHidden,
        }),
      });
      if (!res.ok) throw new Error("Failed to update event");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!eventId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiUrl}/events/${eventId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleRescrape = async () => {
    if (!eventId) return;
    setRescraping(true);
    try {
      const res = await fetch(`${apiUrl}/events/${eventId}/rescrape`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to re-scrape event");
      const data: ScrapedEventDetail = await res.json();
      setEvent(data);
      setReviewStatus(data.review_status);
      setReviewNotes(data.review_notes || "");
      setAdminNotes(data.admin_notes || "");
      setIsHidden(data.is_hidden);
      onUpdated();
    } catch (error) {
      console.error("Error re-scraping event:", error);
    } finally {
      setRescraping(false);
    }
  };

  const handleGenerate = async () => {
    if (!eventId) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch(`${apiUrl}/events/${eventId}/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ detail: "Generation failed" }));
        throw new Error(errData.detail || "Generation failed");
      }
      onUpdated();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setGenerateError(error.message);
      }
      console.error("Error generating event:", error);
    } finally {
      setGenerating(false);
    }
  };

  // AI generation requires at least an image
  const canGenerate = Boolean(event?.image_url && event.image_url !== "null");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  const renderBody = () => {
    if (loading) {
      return (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!event) return null;

    const hasAiData = event.ai_input || event.ai_output;

    return (
      <div className="space-y-6">
        {hasAiData ? (
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                {t("eventDetail.tabDetails")}
              </TabsTrigger>
              <TabsTrigger value="ai-input" className="flex-1">
                {t("eventDetail.tabAiInput")}
              </TabsTrigger>
              <TabsTrigger value="ai-output" className="flex-1">
                {t("eventDetail.tabAiOutput")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              {renderDetailsContent(event)}
            </TabsContent>
            <TabsContent value="ai-input">
              <pre className="max-h-[60vh] overflow-auto rounded-lg border bg-muted/50 p-4 text-xs">
                {event.ai_input
                  ? JSON.stringify(JSON.parse(event.ai_input), null, 2)
                  : t("eventDetail.noAiData")}
              </pre>
            </TabsContent>
            <TabsContent value="ai-output">
              <pre className="max-h-[60vh] overflow-auto rounded-lg border bg-muted/50 p-4 text-xs">
                {event.ai_output
                  ? JSON.stringify(JSON.parse(event.ai_output), null, 2)
                  : t("eventDetail.noAiData")}
              </pre>
            </TabsContent>
          </Tabs>
        ) : (
          renderDetailsContent(event)
        )}
      </div>
    );
  };

  const renderDetailsContent = (ev: ScrapedEventDetail) => {
    return (
      <div className="space-y-6">
        {/* Event image */}
        {ev.image_url && ev.image_url !== "null" && (
          <div className="relative h-[200px] overflow-hidden rounded-lg border">
            <Image
              src={ev.image_url}
              alt={ev.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              unoptimized
            />
          </div>
        )}

        {/* Event info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.source")}
            </Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{ev.source_name}</Badge>
              <a
                href={ev.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.dates")}
            </Label>
            <p>
              {formatDate(ev.start_date)}
              {ev.end_date &&
                ev.end_date !== ev.start_date &&
                ` — ${formatDate(ev.end_date)}`}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.location")}
            </Label>
            <p>
              {ev.city || "—"}, {ev.country}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.organizer")}
            </Label>
            <p>{ev.organizer_name || "—"}</p>
          </div>
          {ev.sport_types && (
            <div>
              <Label className="text-muted-foreground">
                {t("eventDetail.sportTypes")}
              </Label>
              <p>{ev.sport_types}</p>
            </div>
          )}
        </div>

        {ev.description && (
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.description")}
            </Label>
            <p className="mt-1 max-h-[120px] overflow-y-auto whitespace-pre-wrap text-sm">
              {ev.description}
            </p>
          </div>
        )}

        {/* Variants */}
        {ev.variants.length > 0 && (
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.variants")} ({ev.variants.length})
            </Label>
            <div className="mt-2 space-y-2">
              {ev.variants.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded border p-2 text-sm"
                >
                  <span className="font-medium">{v.name}</span>
                  <div className="flex gap-3 text-muted-foreground">
                    {!!v.distance_km && <span>{v.distance_km} km</span>}
                    {!!v.elevation_gain_m && (
                      <span>↑{v.elevation_gain_m}m</span>
                    )}
                    {!!v.price && (
                      <span>
                        {v.price} {v.currency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {ev.documents.length > 0 && (
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.documents")} ({ev.documents.length})
            </Label>
            <div className="mt-2 space-y-1">
              {ev.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded border p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>{doc.file_name || doc.document_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.downloaded ? "default" : "secondary"}>
                      {doc.downloaded
                        ? t("eventDetail.downloaded")
                        : t("eventDetail.pending")}
                    </Badge>
                    {doc.original_url && (
                      <a
                        href={doc.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t("eventDetail.openDocument")}
                      >
                        <ExternalLink className="h-4 w-4 text-primary hover:text-primary/80" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review actions */}
        <div className="space-y-4 border-t pt-4">
          {/* Admin notes — extra info sent to AI, not affected by re-scraping */}
          <div>
            <Label className="text-muted-foreground">
              {t("eventDetail.adminNotes")}
            </Label>
            <p className="mb-2 text-xs text-muted-foreground">
              {t("eventDetail.adminNotesHelp")}
            </p>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t("eventDetail.adminNotesPlaceholder")}
              rows={3}
            />
          </div>

          {/* Generate Event with AI */}
          <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t("eventDetail.generateTitle")}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("eventDetail.generateDescription")}
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={
                  generating || saving || deleting || rescraping || !canGenerate
                }
                className="shrink-0"
              >
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {generating
                  ? t("eventDetail.generating")
                  : t("eventDetail.generate")}
              </Button>
            </div>
            {!canGenerate && (
              <p className="mt-2 text-sm text-amber-600">
                {t("eventDetail.generateRequiresMedia")}
              </p>
            )}
            {generateError && (
              <p className="mt-2 text-sm text-destructive">{generateError}</p>
            )}
          </div>

          <h4 className="font-semibold">{t("eventDetail.review")}</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t("eventDetail.reviewStatus")}</Label>
              <Select value={reviewStatus} onValueChange={setReviewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    {t("events.statusPending")}
                  </SelectItem>
                  <SelectItem value="approved">
                    {t("events.statusApproved")}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {t("events.statusRejected")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 self-end">
              <input
                type="checkbox"
                id="is-hidden"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="is-hidden">{t("eventDetail.hideEvent")}</Label>
            </div>
          </div>
          <div>
            <Label>{t("eventDetail.reviewNotes")}</Label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder={t("eventDetail.reviewNotesPlaceholder")}
              rows={3}
            />
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting || saving || rescraping || generating}
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t("eventDetail.delete")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRescrape}
                disabled={deleting || saving || rescraping || generating}
              >
                {rescraping ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {t("eventDetail.rescrape")}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                {t("eventDetail.cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || deleting || rescraping || generating}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("eventDetail.save")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {loading ? t("eventDetail.loading") : event?.title || ""}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("eventDetail.review")}
          </DialogDescription>
        </DialogHeader>
        {renderBody()}
      </DialogContent>
    </Dialog>
  );
}
