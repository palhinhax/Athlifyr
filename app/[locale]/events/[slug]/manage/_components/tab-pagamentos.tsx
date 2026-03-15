"use client";

import { useState } from "react";
import {
  Loader2,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { StripeStatusBadge } from "./stripe-status-badge";
import type { EventDetails } from "./types";

interface TabPagamentosProps {
  event: EventDetails;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
  populateEvent: (data: EventDetails) => void;
}

export function TabPagamentos({
  event,
  onSave,
  populateEvent,
}: TabPagamentosProps) {
  const t = useTranslations("manage.payments");
  const tErr = useTranslations("manage.errors");

  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const handleToggleRegistrations = async (checked: boolean) => {
    try {
      await onSave({ hasRegistrations: checked });
      toast({
        title: checked ? t("registrationsEnabled") : t("registrationsDisabled"),
      });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleStripeConnect = async () => {
    setIsStripeLoading(true);
    try {
      if (!event.stripeAccountId) {
        const res = await fetch(`/api/events/${event.id}/stripe/connect`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to create Stripe account");
      }
      const linkRes = await fetch(
        `/api/events/${event.id}/stripe/onboarding-link`,
        { method: "POST" }
      );
      if (!linkRes.ok) throw new Error("Failed to get onboarding link");
      const { url } = (await linkRes.json()) as { url: string };
      window.location.href = url;
    } catch {
      toast({
        title: tErr("saveError"),
        description: t("stripeError"),
        variant: "destructive",
      });
      setIsStripeLoading(false);
    }
  };

  const handleSyncStripeStatus = async () => {
    setIsStripeLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/stripe/status`);
      if (!res.ok) {
        throw new Error(`Failed to sync Stripe status: ${res.status}`);
      }
      const refreshed = await fetch(`/api/events/${event.id}`);
      if (refreshed.ok) {
        const data = (await refreshed.json()) as EventDetails;
        populateEvent(data);
      }
      toast({ title: t("statusUpdated") });
    } catch {
      toast({
        title: tErr("saveError"),
        description: t("stripeVerifyError"),
        variant: "destructive",
      });
    } finally {
      setIsStripeLoading(false);
    }
  };

  const handleOpenDashboard = async () => {
    setIsStripeLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/stripe/login-link`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to get dashboard link");
      const { url } = (await res.json()) as { url: string };
      globalThis.open(url, "_blank");
    } catch {
      toast({
        title: tErr("saveError"),
        description: t("stripeError"),
        variant: "destructive",
      });
    } finally {
      setIsStripeLoading(false);
    }
  };

  return (
    <TabsContent value="payments" className="space-y-6">
      {/* Registration toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("platformRegistrations")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("acceptRegistrations")}</Label>
              <p className="text-xs text-muted-foreground">
                {event.stripeOnboardingStatus === "COMPLETE"
                  ? t("registrationsEnabledHelp")
                  : t("registrationsDisabledHelp")}
              </p>
            </div>
            <Switch
              checked={event.hasRegistrations}
              disabled={event.stripeOnboardingStatus !== "COMPLETE"}
              onCheckedChange={(checked) =>
                void handleToggleRegistrations(checked)
              }
            />
          </div>
          {event.stripeOnboardingStatus !== "COMPLETE" && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{t("stripeRequired")}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe Connect */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("stripeConnect")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StripeStatusBadge status={event.stripeOnboardingStatus} />

          <div className="space-y-1 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>{t("stripeInfo")}</p>
            {event.commissionPercent > 0 && (
              <p>{t("commission", { percent: event.commissionPercent })}</p>
            )}
          </div>

          {event.stripeAccountId && (
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span className="text-muted-foreground">
                {t("stripeAccountId")}
              </span>
              <code className="font-mono text-xs">{event.stripeAccountId}</code>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {event.stripeOnboardingStatus === "COMPLETE" ? (
              <Button
                onClick={() => void handleOpenDashboard()}
                disabled={isStripeLoading}
                className="gap-2"
              >
                {isStripeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {t("openDashboard")}
              </Button>
            ) : (
              <Button
                onClick={() => void handleStripeConnect()}
                disabled={isStripeLoading}
                className="gap-2"
              >
                {isStripeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                {event.stripeAccountId
                  ? t("continueOnboarding")
                  : t("setupStripe")}
              </Button>
            )}

            {event.stripeAccountId && (
              <Button
                variant="outline"
                onClick={() => void handleSyncStripeStatus()}
                disabled={isStripeLoading}
                className="gap-2"
              >
                {isStripeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {t("verifyStatus")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
