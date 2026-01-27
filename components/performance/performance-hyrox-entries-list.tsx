"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatTime } from "@/lib/performance/scoring";
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
import { Pencil, Trash2, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { EditHyroxDialog } from "./edit-hyrox-dialog";
import { useToast } from "@/components/ui/use-toast";
import type { HyroxEntry, HyroxCategory } from "./types";

interface PerformanceHyroxEntriesListProps {
  entries: HyroxEntry[];
  onRefresh: () => void;
}

export function PerformanceHyroxEntriesList({
  entries,
  onRefresh,
}: PerformanceHyroxEntriesListProps) {
  const t = useTranslations("performance");
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<HyroxEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedEntries = [...entries].sort(
    (a, b) =>
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );

  const displayedEntries = isExpanded
    ? sortedEntries
    : sortedEntries.slice(0, 5);
  const hasMore = sortedEntries.length > 5;

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/profile/performance/${deleteId}`, {
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
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("entries.deleteError"),
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (entries.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="mb-4 font-medium">
        {t("entries.title")} ({entries.length} {t("entries.count")})
      </h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("entries.date")}</TableHead>
              <TableHead>{t("hyrox.category")}</TableHead>
              <TableHead>{t("entries.time")}</TableHead>
              <TableHead>{t("hyrox.event")}</TableHead>
              <TableHead className="w-[100px]">
                {t("entries.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.performedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {t(`hyrox.categories.${categoryToKey(entry.hyroxCategory)}`)}
                </TableCell>
                <TableCell>{formatTime(entry.timeSeconds)}</TableCell>
                <TableCell>
                  {entry.eventName && (
                    <div className="flex items-center gap-1">
                      <span>{entry.eventName}</span>
                      {entry.location && (
                        <span className="flex items-center gap-0.5 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {entry.location}
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditEntry(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteId(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
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
              {t("entries.showMore", { count: sortedEntries.length - 5 })}
            </>
          )}
        </Button>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("entries.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("entries.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("entries.cancel")}
            </AlertDialogCancel>
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

      {/* Edit Dialog */}
      {editEntry && (
        <EditHyroxDialog
          entry={editEntry}
          open={!!editEntry}
          onOpenChange={(isOpen: boolean) => !isOpen && setEditEntry(null)}
          onSuccess={() => {
            setEditEntry(null);
            onRefresh();
          }}
        />
      )}
    </Card>
  );
}

// Helper to convert category enum to translation key
function categoryToKey(category: HyroxCategory | string): string {
  const mapping: Record<string, string> = {
    OPEN_MEN: "openMen",
    OPEN_WOMEN: "openWomen",
    PRO_MEN: "proMen",
    PRO_WOMEN: "proWomen",
    ELITE_15_MEN: "elite15Men",
    ELITE_15_WOMEN: "elite15Women",
    DOUBLES_MEN: "doublesMen",
    DOUBLES_WOMEN: "doublesWomen",
    DOUBLES_MIXED: "doublesMixed",
    RELAY_MEN: "relayMen",
    RELAY_WOMEN: "relayWomen",
    RELAY_MIXED: "relayMixed",
    AGE_GROUP_16_29_MEN: "ageGroup1629Men",
    AGE_GROUP_16_29_WOMEN: "ageGroup1629Women",
    AGE_GROUP_30_34_MEN: "ageGroup3034Men",
    AGE_GROUP_30_34_WOMEN: "ageGroup3034Women",
    AGE_GROUP_35_39_MEN: "ageGroup3539Men",
    AGE_GROUP_35_39_WOMEN: "ageGroup3539Women",
    AGE_GROUP_40_44_MEN: "ageGroup4044Men",
    AGE_GROUP_40_44_WOMEN: "ageGroup4044Women",
    AGE_GROUP_45_49_MEN: "ageGroup4549Men",
    AGE_GROUP_45_49_WOMEN: "ageGroup4549Women",
    AGE_GROUP_50_54_MEN: "ageGroup5054Men",
    AGE_GROUP_50_54_WOMEN: "ageGroup5054Women",
    AGE_GROUP_55_59_MEN: "ageGroup5559Men",
    AGE_GROUP_55_59_WOMEN: "ageGroup5559Women",
    AGE_GROUP_60_64_MEN: "ageGroup6064Men",
    AGE_GROUP_60_64_WOMEN: "ageGroup6064Women",
    AGE_GROUP_65_69_MEN: "ageGroup6569Men",
    AGE_GROUP_65_69_WOMEN: "ageGroup6569Women",
    AGE_GROUP_70_PLUS_MEN: "ageGroup70PlusMen",
    AGE_GROUP_70_PLUS_WOMEN: "ageGroup70PlusWomen",
    ADAPTIVE: "adaptive",
  };
  return mapping[category] || category;
}
