"use client";

import { Share2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventRegistrationShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareContent: string;
  onShareContentChange: (content: string) => void;
  isSharing: boolean;
  onShare: () => void;
}

export function EventRegistrationShareDialog({
  open,
  onOpenChange,
  shareContent,
  onShareContentChange,
  isSharing,
  onShare,
}: EventRegistrationShareDialogProps) {
  const t = useTranslations("events.registration");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {t("shareDialogTitle")}
          </DialogTitle>
          <DialogDescription>{t("shareDialogDesc")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <textarea
            value={shareContent}
            onChange={(e) => onShareContentChange(e.target.value)}
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            maxLength={500}
          />
          <p className="text-right text-xs text-muted-foreground">
            {shareContent.length}/500
          </p>
        </div>
        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSharing}
          >
            {t("shareSkip")}
          </Button>
          <Button
            onClick={onShare}
            disabled={isSharing || !shareContent.trim()}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSharing ? t("sharePublishing") : t("sharePublish")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
