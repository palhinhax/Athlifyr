"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "@/i18n/routing";
import {
  Copy,
  Loader2,
  Calendar,
  MapPin,
  ExternalLink,
  Globe,
  PenLine,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDateShort } from "@/lib/event-utils";
import { toast } from "@/components/ui/use-toast";

interface DuplicateEvent {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  city: string;
  country: string;
  imageUrl: string | null;
  origin: string | null;
}

interface DuplicateGroup {
  events: DuplicateEvent[];
  reason: string;
  score: number;
}

interface DuplicatesResponse {
  groups: DuplicateGroup[];
  total: number;
  eventsAnalysed: number;
}

function ReasonBadge({ reason }: { reason: string }) {
  const t = useTranslations("admin.duplicates");
  const reasons = reason.split(", ");

  return (
    <div className="flex flex-wrap gap-1">
      {reasons.map((r) => {
        const variant =
          r === "near-identical-name"
            ? "destructive"
            : r === "same-location"
              ? "secondary"
              : "outline";
        const label =
          r === "near-identical-name"
            ? t("reasons.nearIdenticalName")
            : r === "similar-name"
              ? t("reasons.similarName")
              : r === "close-dates"
                ? t("reasons.closeDates")
                : t("reasons.sameLocation");
        return (
          <Badge key={r} variant={variant} className="text-[10px]">
            {label}
          </Badge>
        );
      })}
    </div>
  );
}

function ScoreIndicator({ score }: { score: number }) {
  const pct = Math.round((score / 1.5) * 100);
  const color =
    pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-amber-500" : "bg-yellow-400";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{pct}%</span>
    </div>
  );
}

export function AdminEventDuplicates() {
  const t = useTranslations("admin.duplicates");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DuplicatesResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DuplicateEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCheck = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/events/duplicates");
      if (res.ok) {
        const json: DuplicatesResponse = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Error checking duplicates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({
          title: t("deleteSuccess"),
          description: deleteTarget.title,
        });
        // Remove deleted event from the data
        setData((prev) => {
          if (!prev) return prev;
          const groups = prev.groups
            .map((g) => ({
              ...g,
              events: g.events.filter((e) => e.id !== deleteTarget.id),
            }))
            .filter((g) => g.events.length > 1);
          return {
            ...prev,
            groups,
            total: groups.length,
          };
        });
      } else {
        toast({
          title: t("deleteError"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && !data) {
      handleCheck();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Copy className="h-4 w-4" />
            {t("button")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t("loading")}</p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-3 text-sm">
                <span>{t("analysed", { count: data.eventsAnalysed })}</span>
                <span className="text-muted-foreground">•</span>
                <span
                  className={
                    data.total > 0
                      ? "font-medium text-amber-600 dark:text-amber-400"
                      : "font-medium text-green-600 dark:text-green-400"
                  }
                >
                  {data.total > 0
                    ? t("found", { count: data.total })
                    : t("noDuplicates")}
                </span>
              </div>

              {/* Duplicate groups */}
              {data.groups.map((group, idx) => (
                <div key={idx} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <ReasonBadge reason={group.reason} />
                    <ScoreIndicator score={group.score} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-md border bg-background p-3"
                      >
                        <h4 className="mb-2 line-clamp-2 text-sm font-semibold">
                          {event.title}
                        </h4>
                        {/* Origin badge */}
                        <div className="mb-1.5">
                          {event.origin ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              <Globe className="h-2.5 w-2.5" />
                              {t("origin.scraping")}: {event.origin}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              <PenLine className="h-2.5 w-2.5" />
                              {t("origin.manual")}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>
                              {formatDateShort(new Date(event.startDate))}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>
                              {event.city}, {event.country}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {t("viewEvent")}
                          </Link>
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            {t("manage")}
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(event)}
                            className="ml-auto inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                            {t("deleteEvent")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Refresh button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCheck}
                  disabled={isLoading}
                >
                  {t("refresh")}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDescription")}
              {deleteTarget && (
                <span className="mt-1 block font-medium text-foreground">
                  {deleteTarget.title}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                t("deleteEvent")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
