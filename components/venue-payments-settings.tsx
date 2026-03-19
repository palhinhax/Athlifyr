"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PaymentStatus {
  accountId: string | null;
  onboardingStatus: "NOT_STARTED" | "PENDING" | "COMPLETE" | "RESTRICTED";
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  lastWebhookAt: string | null;
}

interface VenuePaymentsSettingsProps {
  readonly venueId: string;
  readonly isOwner: boolean;
  readonly userRole?: string;
  readonly currentPaymentMode: "IN_APP" | "EXTERNAL" | "MIXED";
  readonly externalPaymentInstructions?: string | null;
}

function StripeNotConfigured({
  onActivate,
  activating,
  t,
}: {
  readonly onActivate: () => void;
  readonly activating: boolean;
  readonly t: (key: string) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>{t("notConfigured")}</CardTitle>
        </div>
        <CardDescription>{t("notConfiguredDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onActivate} disabled={activating}>
          {activating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("activating")}
            </>
          ) : (
            t("activateStripe")
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function StripePending({
  status,
  onContinue,
  onRefresh,
  activating,
  refreshing,
  t,
}: {
  readonly status: PaymentStatus;
  readonly onContinue: () => void;
  readonly onRefresh: () => void;
  readonly activating: boolean;
  readonly refreshing: boolean;
  readonly t: (key: string) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>{t("onboardingPending")}</CardTitle>
          </div>
          <Badge variant="secondary">
            {t("status")}: {t("onboardingPending")}
          </Badge>
        </div>
        <CardDescription>{t("onboardingPendingDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label>{t("chargesEnabled")}</Label>
            <div className="mt-1 flex items-center gap-2">
              {status.chargesEnabled ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              <span>
                {status.chargesEnabled ? t("active") : t("onboardingPending")}
              </span>
            </div>
          </div>
          <div>
            <Label>{t("payoutsEnabled")}</Label>
            <div className="mt-1 flex items-center gap-2">
              {status.payoutsEnabled ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              <span>
                {status.payoutsEnabled ? t("active") : t("onboardingPending")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onContinue} disabled={activating}>
            {activating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("activating")}
              </>
            ) : (
              t("continueSetup")
            )}
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {t("refreshStatus")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StripeComplete({
  onOpenDashboard,
  t,
}: {
  readonly onOpenDashboard: () => void;
  readonly t: (key: string) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>{t("active")}</CardTitle>
          </div>
          <Badge variant="default" className="bg-green-600">
            {t("active")}
          </Badge>
        </div>
        <CardDescription>{t("activeDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p>{t("receivesDirectly")}</p>
        </div>
        <Button variant="outline" onClick={onOpenDashboard}>
          <ExternalLink className="mr-2 h-4 w-4" />
          {t("openDashboard")}
        </Button>
      </CardContent>
    </Card>
  );
}

function StripeRestricted({
  onOpenDashboard,
  t,
}: {
  readonly onOpenDashboard: () => void;
  readonly t: (key: string) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>{t("restricted")}</CardTitle>
        </div>
        <CardDescription>{t("restrictedDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={onOpenDashboard}>
          <ExternalLink className="mr-2 h-4 w-4" />
          {t("openDashboard")}
        </Button>
      </CardContent>
    </Card>
  );
}

function PaymentModeOption({
  selected,
  disabled,
  onSelect,
  label,
  description,
  requiresStripe,
  stripeRequiredLabel,
}: {
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly onSelect: () => void;
  readonly label: string;
  readonly description: string;
  readonly requiresStripe: boolean;
  readonly stripeRequiredLabel?: string;
}) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      className={`flex items-start space-x-3 rounded-lg border p-4 ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:bg-accent"
      }`}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="mt-0.5">
        <div
          className={`h-4 w-4 rounded-full border-2 ${
            selected ? "border-primary bg-primary" : "border-muted-foreground"
          }`}
        >
          {selected && (
            <div className="h-full w-full rounded-full bg-white p-0.5">
              <div className="h-full w-full rounded-full bg-primary" />
            </div>
          )}
        </div>
      </div>
      <div className="grid flex-1 gap-1.5 leading-none">
        <Label
          className={`font-medium ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {label}
          {requiresStripe && stripeRequiredLabel && (
            <span className="ml-2 text-xs text-amber-600">
              ({stripeRequiredLabel})
            </span>
          )}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function VenuePaymentsSettings({
  venueId,
  isOwner,
  userRole,
  currentPaymentMode,
  externalPaymentInstructions: _externalPaymentInstructions,
}: VenuePaymentsSettingsProps) {
  const t = useTranslations("venues.payments");

  const canManagePayments =
    isOwner || userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [paymentMode, setPaymentMode] = useState<
    "IN_APP" | "EXTERNAL" | "MIXED"
  >(currentPaymentMode);

  const isStripeComplete = status?.onboardingStatus === "COMPLETE";

  const fetchStripeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}/stripe/status`);
      if (response.ok) {
        const data = (await response.json()) as PaymentStatus;
        setStatus(data);
      }
    } catch (error) {
      console.error("Error fetching Stripe status:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [venueId]);

  useEffect(() => {
    if (canManagePayments) {
      fetchStripeStatus();
    } else {
      setLoading(false);
    }
  }, [canManagePayments, fetchStripeStatus]);

  const handleActivateStripe = async () => {
    setActivating(true);
    try {
      const connectResponse = await fetch(
        `/api/venues/${venueId}/stripe/connect`,
        { method: "POST" }
      );

      if (!connectResponse.ok) {
        throw new Error("Failed to create Stripe account");
      }

      const linkResponse = await fetch(
        `/api/venues/${venueId}/stripe/onboarding-link`,
        { method: "POST" }
      );

      if (!linkResponse.ok) {
        throw new Error("Failed to create onboarding link");
      }

      const { url } = (await linkResponse.json()) as { url: string };
      globalThis.location.href = url;
    } catch {
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  const handleContinueSetup = async () => {
    setActivating(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/stripe/onboarding-link`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to create onboarding link");
      }

      const { url } = (await response.json()) as { url: string };
      globalThis.location.href = url;
    } catch {
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  const handleOpenDashboard = async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}/stripe/login-link`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create login link");
      }

      const { url } = (await response.json()) as { url: string };
      globalThis.open(url, "_blank");
    } catch {
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await fetchStripeStatus();
  };

  const handleSavePaymentMode = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/payment-settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMode }),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment settings");
      }

      toast({
        title: t("saved"),
        description: t("saved"),
      });

      globalThis.location.reload();
    } catch {
      toast({
        title: t("saveFailed"),
        description: t("saveFailed"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!canManagePayments) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <p className="text-sm text-amber-900">{t("ownerOnly")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderStripeStatus = () => {
    if (!status || status.onboardingStatus === "NOT_STARTED") {
      return (
        <StripeNotConfigured
          onActivate={() => void handleActivateStripe()}
          activating={activating}
          t={t}
        />
      );
    }

    if (
      status.onboardingStatus === "PENDING" ||
      !status.chargesEnabled ||
      !status.payoutsEnabled
    ) {
      return (
        <StripePending
          status={status}
          onContinue={() => void handleContinueSetup()}
          onRefresh={() => void handleRefreshStatus()}
          activating={activating}
          refreshing={refreshing}
          t={t}
        />
      );
    }

    if (status.onboardingStatus === "COMPLETE") {
      return (
        <StripeComplete
          onOpenDashboard={() => void handleOpenDashboard()}
          t={t}
        />
      );
    }

    if (status.onboardingStatus === "RESTRICTED") {
      return (
        <StripeRestricted
          onOpenDashboard={() => void handleOpenDashboard()}
          t={t}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      {renderStripeStatus()}

      <Card>
        <CardHeader>
          <CardTitle>{t("paymentModeTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3" role="radiogroup">
            <PaymentModeOption
              selected={paymentMode === "IN_APP"}
              disabled={!isStripeComplete}
              onSelect={() => setPaymentMode("IN_APP")}
              label={t("inApp")}
              description={t("inAppDescription")}
              requiresStripe={!isStripeComplete}
              stripeRequiredLabel={t("stripeRequired")}
            />

            <PaymentModeOption
              selected={paymentMode === "EXTERNAL"}
              disabled={false}
              onSelect={() => setPaymentMode("EXTERNAL")}
              label={t("external")}
              description={t("externalDescription")}
              requiresStripe={false}
            />

            <PaymentModeOption
              selected={paymentMode === "MIXED"}
              disabled={!isStripeComplete}
              onSelect={() => setPaymentMode("MIXED")}
              label={t("mixed")}
              description={t("mixedDescription")}
              requiresStripe={!isStripeComplete}
              stripeRequiredLabel={t("stripeRequired")}
            />
          </div>

          {(paymentMode === "IN_APP" || paymentMode === "MIXED") &&
            !isStripeComplete && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-amber-900">
                    {t("stripeRequiredDescription")}
                  </p>
                </div>
              </div>
            )}

          <div className="flex justify-end">
            <Button
              onClick={() => void handleSavePaymentMode()}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saved")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
