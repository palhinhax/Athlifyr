"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  PremiumModal,
  PremiumModalHeader,
  PremiumModalBody,
  PremiumModalFooter,
  PremiumModalAction,
  PremiumModalCancel,
} from "@/components/ui/premium-modal";

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
    <PremiumModal open={open} onOpenChange={onOpenChange} size="max-w-md">
      <PremiumModalHeader
        title={t("shareDialogTitle")}
        description={t("shareDialogDesc")}
      />
      <PremiumModalBody className="space-y-3">
        <textarea
          value={shareContent}
          onChange={(e) => onShareContentChange(e.target.value)}
          className="min-h-[120px] w-full resize-none rounded-xl border-none bg-surface-container-low p-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
          maxLength={500}
          placeholder={t("shareDialogDesc")}
        />
        <p className="text-right text-xs text-muted-foreground">
          {shareContent.length}/500
        </p>
      </PremiumModalBody>
      <PremiumModalFooter>
        <PremiumModalCancel disabled={isSharing}>
          {t("shareSkip")}
        </PremiumModalCancel>
        <PremiumModalAction
          onClick={onShare}
          disabled={isSharing || !shareContent.trim()}
        >
          <Send className="h-4 w-4" />
          {isSharing ? t("sharePublishing") : t("sharePublish")}
        </PremiumModalAction>
      </PremiumModalFooter>
    </PremiumModal>
  );
}
