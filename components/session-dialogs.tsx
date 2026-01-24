"use client";

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
import { useTranslations } from "next-intl";

interface SessionDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  isRecurring: boolean;
  deleteAll: boolean;
  onDeleteAllChange: (value: boolean) => void;
}

export function SessionDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  isRecurring,
  deleteAll,
  onDeleteAllChange,
}: SessionDeleteDialogProps) {
  const t = useTranslations("venues.sessions");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteSessionTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {isRecurring ? (
              <div className="space-y-3">
                <p>{t("deleteRecurringSessionWarning")}</p>
                <div className="flex items-start gap-2 rounded-md border p-3">
                  <input
                    type="checkbox"
                    id="delete-all"
                    checked={deleteAll}
                    onChange={(e) => onDeleteAllChange(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="delete-all" className="text-sm">
                    {t("deleteAllOccurrences")}
                  </label>
                </div>
              </div>
            ) : (
              t("deleteSessionWarning")
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SessionCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

export function SessionCancelDialog({
  open,
  onOpenChange,
  onConfirm,
  isCancelling,
}: SessionCancelDialogProps) {
  const t = useTranslations("venues.booking");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("cancelBookingTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("cancelBookingWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelling}>
            {t("no")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isCancelling}
          >
            {isCancelling ? t("cancelling") : t("yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
