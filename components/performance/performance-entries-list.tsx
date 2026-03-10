"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatTime, formatPace } from "@/lib/performance/scoring";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Medal,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { EditRunDialog } from "./edit-run-dialog";
import { EditStrengthDialog } from "./edit-strength-dialog";
import { useToast } from "@/components/ui/use-toast";
import { type PerformanceEntry } from "./types";
import { Link } from "@/i18n/routing";

export type { PerformanceEntry };

function EntryActions({
  entry,
  activityLabel,
  onEdit,
  onDelete,
}: {
  entry: PerformanceEntry;
  activityLabel: string;
  onEdit: (entry: PerformanceEntry) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      {entry.runActivityId && (
        <Link href={`/profile/activities/${entry.runActivityId}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-600"
            title={activityLabel}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </Link>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEdit(entry)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={() => onDelete(entry.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}

interface PerformanceEntriesListProps {
  entries: PerformanceEntry[];
  type: "RUN" | "TRAIL" | "STRENGTH";
  onRefresh: () => void;
}

export function PerformanceEntriesList({
  entries,
  type,
  onRefresh,
}: PerformanceEntriesListProps) {
  const t = useTranslations("performance");
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<PerformanceEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredEntries = entries
    .filter((e) => e.type === type)
    .sort(
      (a, b) =>
        new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    );

  const displayedEntries = isExpanded
    ? filteredEntries
    : filteredEntries.slice(0, 5);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/profile/performance?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast({
        title: t("success"),
        description: t("entries.deleted"),
      });
      onRefresh();
    } catch {
      toast({
        title: t("error"),
        description: t("entries.deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (filteredEntries.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">{t("entries.title")}</h3>
        <span className="text-sm text-muted-foreground">
          {filteredEntries.length} {t("entries.count")}
        </span>
      </div>

      {/* Mobile card layout */}
      <div className="space-y-2 sm:hidden">
        {displayedEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start justify-between rounded-md border p-3"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-xs text-muted-foreground">
                {new Date(entry.performedAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              {type === "RUN" || type === "TRAIL" ? (
                <>
                  {entry.eventResult && (
                    <Link
                      href={`/events/${entry.eventResult.eventSlug}`}
                      className="group flex items-center gap-1 hover:text-primary"
                    >
                      <span className="line-clamp-1 text-sm font-medium">
                        {entry.eventResult.eventTitle}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  )}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
                    {entry.distanceKm != null && (
                      <span className="font-medium">
                        {entry.distanceKm.toFixed(1)} km
                      </span>
                    )}
                    {entry.timeSeconds != null && (
                      <span>{formatTime(entry.timeSeconds)}</span>
                    )}
                    {entry.distanceKm && entry.timeSeconds && (
                      <span className="text-muted-foreground">
                        {formatPace(entry.timeSeconds / entry.distanceKm)}/km
                      </span>
                    )}
                    {entry.elevationGainM != null &&
                      entry.elevationGainM > 0 && (
                        <span className="text-muted-foreground">
                          ↑{entry.elevationGainM}m
                        </span>
                      )}
                  </div>
                  {entry.eventResult?.position && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Medal className="h-3 w-3" />#{entry.eventResult.position}
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-0.5 text-sm">
                  <span className="font-medium">
                    {entry.exerciseName || "-"}
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground">
                    {entry.weightKg != null && <span>{entry.weightKg} kg</span>}
                    {entry.reps != null && <span>{entry.reps} reps</span>}
                    {entry.weightKg && entry.reps && (
                      <span>
                        e1RM{" "}
                        {(entry.weightKg * (1 + entry.reps / 30)).toFixed(1)} kg
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="ml-2 flex shrink-0 items-center gap-0.5">
              <EntryActions
                entry={entry}
                activityLabel={t("activity.viewActivity")}
                onEdit={setEditEntry}
                onDelete={setDeleteId}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">
                {t("entries.date")}
              </TableHead>
              {type === "RUN" || type === "TRAIL" ? (
                <>
                  <TableHead className="hidden sm:table-cell">
                    {t("entries.event")}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    {t("entries.distance")}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    {t("entries.time")}
                  </TableHead>
                  <TableHead className="hidden whitespace-nowrap md:table-cell">
                    {t("entries.pace")}
                  </TableHead>
                  <TableHead className="hidden whitespace-nowrap lg:table-cell">
                    {t("entries.elevation")}
                  </TableHead>
                </>
              ) : (
                <>
                  <TableHead>{t("entries.exercise")}</TableHead>
                  <TableHead className="whitespace-nowrap">
                    {t("entries.weight")}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    {t("entries.reps")}
                  </TableHead>
                  <TableHead className="hidden whitespace-nowrap sm:table-cell">
                    {t("entries.e1rm")}
                  </TableHead>
                </>
              )}
              <TableHead className="w-[80px] sm:w-[100px]">
                {t("entries.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap">
                  {new Date(entry.performedAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                {type === "RUN" || type === "TRAIL" ? (
                  <>
                    <TableCell className="hidden sm:table-cell">
                      {entry.eventResult ? (
                        <Link
                          href={`/events/${entry.eventResult.eventSlug}`}
                          className="group flex items-center gap-1.5 hover:text-primary"
                        >
                          <span className="line-clamp-1 font-medium">
                            {entry.eventResult.eventTitle}
                          </span>
                          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          {entry.eventResult.position && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Medal className="h-3 w-3" />#
                              {entry.eventResult.position}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {entry.distanceKm?.toFixed(1)} km
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {entry.timeSeconds ? formatTime(entry.timeSeconds) : "-"}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap md:table-cell">
                      {entry.distanceKm && entry.timeSeconds
                        ? formatPace(entry.timeSeconds / entry.distanceKm)
                        : "-"}
                      /km
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap lg:table-cell">
                      {entry.elevationGainM ? `${entry.elevationGainM}m` : "-"}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">
                      {entry.exerciseName || "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {entry.weightKg} kg
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {entry.reps}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      {entry.weightKg && entry.reps
                        ? `${(entry.weightKg * (1 + entry.reps / 30)).toFixed(1)} kg`
                        : "-"}
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <EntryActions
                      entry={entry}
                      activityLabel={t("activity.viewActivity")}
                      onEdit={setEditEntry}
                      onDelete={setDeleteId}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredEntries.length > 5 && (
        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              {t("entries.showLess")}
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              {t("entries.showMore", { count: filteredEntries.length - 5 })}
            </>
          )}
        </Button>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("entries.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("entries.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("entries.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("entries.deleting") : t("entries.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit dialogs */}
      {editEntry && (type === "RUN" || type === "TRAIL") && (
        <EditRunDialog
          entry={editEntry}
          open={!!editEntry}
          onOpenChange={(open: boolean) => !open && setEditEntry(null)}
          onSuccess={() => {
            setEditEntry(null);
            onRefresh();
          }}
        />
      )}

      {editEntry && type === "STRENGTH" && (
        <EditStrengthDialog
          entry={editEntry}
          open={!!editEntry}
          onOpenChange={(open: boolean) => !open && setEditEntry(null)}
          onSuccess={() => {
            setEditEntry(null);
            onRefresh();
          }}
        />
      )}
    </Card>
  );
}
