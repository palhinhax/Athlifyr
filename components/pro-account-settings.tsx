"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ProAccountSettingsProps {
  isProAccountEnabled: boolean;
}

export function ProAccountSettings({
  isProAccountEnabled: initialState,
}: ProAccountSettingsProps) {
  const t = useTranslations("settings.proAccount");
  const { toast } = useToast();
  const router = useRouter();

  const [isProAccount, setIsProAccount] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleProAccount = async (checked: boolean) => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/pro-account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isProAccount: checked,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pro account settings");
      }

      setIsProAccount(checked);

      toast({
        title: checked ? t("enabled") : t("disabled"),
        description: checked ? t("enabledDesc") : t("disabledDesc"),
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating pro account settings:", error);
      toast({
        title: t("error"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pro Account Toggle */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border p-4 transition-colors",
          isProAccount
            ? "border-primary/50 bg-primary/5"
            : "border-border bg-muted/50"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "rounded-full p-2",
              isProAccount ? "bg-primary/20" : "bg-muted"
            )}
          >
            {isProAccount ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <Label
              htmlFor="pro-account"
              className="cursor-pointer text-base font-medium"
            >
              {t("toggle")}
            </Label>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <Switch
            id="pro-account"
            checked={isProAccount}
            onCheckedChange={handleToggleProAccount}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
