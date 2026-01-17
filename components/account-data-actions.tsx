"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Trash2, AlertTriangle } from "lucide-react";

export function AccountDataActions() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const locale = useLocale();
  const t = useTranslations("settings");

  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/user/data-export", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `athlifyr-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading data:", error);
      alert(t("downloadDataError"));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      alert(t("deleteConfirmationError"));
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Sign out and redirect to home
      await signOut({ callbackUrl: `/${locale}` });
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(t("deleteAccountError"));
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Download Data */}
      <div className="flex items-start justify-between rounded-lg border p-4">
        <div className="flex-1">
          <h3 className="font-semibold">{t("downloadData")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("downloadDataDescription")}
          </p>
        </div>
        <Button
          onClick={handleDownloadData}
          disabled={isDownloading}
          variant="outline"
          size="sm"
          className="ml-4"
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? t("downloading") : t("download")}
        </Button>
      </div>

      {/* Delete Account */}
      <div className="flex items-start justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">
            {t("deleteAccount")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("deleteAccountDescription")}
          </p>
        </div>
        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          variant="destructive"
          size="sm"
          className="ml-4"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("deleteAccountConfirmTitle")}
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <p>{t("deleteAccountWarning")}</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>{t("deleteWarning1")}</li>
                <li>{t("deleteWarning2")}</li>
                <li>{t("deleteWarning3")}</li>
                <li>{t("deleteWarning4")}</li>
              </ul>
              <div className="pt-4">
                <label
                  htmlFor="delete-confirmation"
                  className="block text-sm font-medium"
                >
                  {t("deleteConfirmationLabel")}
                </label>
                <input
                  id="delete-confirmation"
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteConfirmation("");
              }}
              disabled={isDeleting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmation !== "DELETE"}
            >
              {isDeleting ? t("deleting") : t("deleteAccountPermanent")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
