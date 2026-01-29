"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface NotificationSettingsProps {
  emailVerified: boolean;
  emailNotificationsEnabled: boolean;
  userEmail: string;
}

export function NotificationSettings({
  emailVerified,
  emailNotificationsEnabled,
  userEmail,
}: NotificationSettingsProps) {
  const t = useTranslations("settings.notificationsSettings");
  const { toast } = useToast();
  const router = useRouter();

  const [isEmailNotificationsEnabled, setIsEmailNotificationsEnabled] =
    useState(emailNotificationsEnabled);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleToggleEmailNotifications = async (checked: boolean) => {
    if (!emailVerified) {
      toast({
        title: t("verificationRequired"),
        description: t("verificationRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailNotifications: checked,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification settings");
      }

      setIsEmailNotificationsEnabled(checked);

      toast({
        title: checked ? t("notificationsEnabled") : t("notificationsDisabled"),
        description: checked
          ? t("notificationsEnabledDesc")
          : t("notificationsDisabledDesc"),
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: t("error"),
        description: t("errorUpdating"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingVerification(true);

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send verification email");
      }

      setVerificationSent(true);

      toast({
        title: t("verificationSent"),
        description: t("verificationSentDesc", { email: userEmail }),
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: t("error"),
        description: t("errorSendingVerification"),
        variant: "destructive",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Verification Status */}
      <div
        className={cn(
          "rounded-lg border p-4",
          emailVerified
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
            : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
        )}
      >
        <div className="flex items-start gap-3">
          {emailVerified ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
          )}
          <div className="flex-1">
            <h4
              className={cn(
                "font-medium",
                emailVerified
                  ? "text-green-800 dark:text-green-200"
                  : "text-amber-800 dark:text-amber-200"
              )}
            >
              {emailVerified ? t("emailVerified") : t("emailNotVerified")}
            </h4>
            <p
              className={cn(
                "mt-1 text-sm",
                emailVerified
                  ? "text-green-700 dark:text-green-300"
                  : "text-amber-700 dark:text-amber-300"
              )}
            >
              {emailVerified
                ? t("emailVerifiedDesc")
                : t("emailNotVerifiedDesc")}
            </p>

            {!emailVerified && (
              <Button
                onClick={handleSendVerificationEmail}
                disabled={isSendingVerification || verificationSent}
                variant="outline"
                size="sm"
                className="mt-3 border-amber-300 bg-white hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900 dark:hover:bg-amber-800"
              >
                {isSendingVerification ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("sendingVerification")}
                  </>
                ) : verificationSent ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t("verificationSent")}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    {t("sendVerificationEmail")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Email Notifications Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <Label htmlFor="email-notifications" className="font-medium">
              {t("emailNotifications")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("emailNotificationsDesc")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          <button
            id="email-notifications"
            role="switch"
            aria-checked={isEmailNotificationsEnabled}
            onClick={() =>
              handleToggleEmailNotifications(!isEmailNotificationsEnabled)
            }
            disabled={!emailVerified || isSaving}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
              isEmailNotificationsEnabled ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                isEmailNotificationsEnabled ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
