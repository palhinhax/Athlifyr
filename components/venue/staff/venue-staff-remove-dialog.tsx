"use client";

import { useTranslations } from "next-intl";
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
import type { VenueMember } from "./types";

interface VenueStaffRemoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: VenueMember | null;
  onConfirm: () => void;
}

export function VenueStaffRemoveDialog({
  open,
  onOpenChange,
  member,
  onConfirm,
}: VenueStaffRemoveDialogProps) {
  const t = useTranslations("venues.staff");
  const tCommon = useTranslations("common");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("removeStaff")}</AlertDialogTitle>
          <AlertDialogDescription>
            {member && t("confirmRemove", { name: member.user.name })}
            <br />
            <span className="text-destructive">
              {t("confirmRemoveWarning")}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("removeStaff")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
