"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge"; // Temporarily unused - Stripe disabled
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  // CheckCircle2, // Temporarily unused - Stripe disabled
  Construction,
  // CreditCard, // Temporarily unused - Stripe disabled
  // ExternalLink, // Temporarily unused - Stripe disabled
  Loader2,
  // RefreshCw, // Temporarily unused - Stripe disabled
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
  venueId: string;
  isOwner: boolean;
  userRole?: string;
  currentPaymentMode: "IN_APP" | "EXTERNAL" | "MIXED";
  externalPaymentInstructions?: string | null;
}

export function VenuePaymentsSettings({
  venueId,
  isOwner,
  userRole,
  currentPaymentMode,
  externalPaymentInstructions: _externalPaymentInstructions,
}: VenuePaymentsSettingsProps) {
  const t = useTranslations("venues.payments");

  // App admins can also manage payments
  const canManagePayments =
    isOwner || userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const [loading, setLoading] = useState(true);
  // Temporarily disabled - Stripe coming soon
  // const [activating, setActivating] = useState(false);
  // const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [paymentMode, setPaymentMode] = useState<
    "IN_APP" | "EXTERNAL" | "MIXED"
  >(currentPaymentMode);
  // const [instructions, setInstructions] = useState(
  //   externalPaymentInstructions || ""
  // );

  const fetchStripeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}/stripe/status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Error fetching Stripe status:", error);
    } finally {
      setLoading(false);
      // setRefreshing(false); // Temporarily disabled - Stripe coming soon
    }
  }, [venueId]);

  useEffect(() => {
    if (canManagePayments) {
      fetchStripeStatus();
    } else {
      setLoading(false);
    }
  }, [canManagePayments, fetchStripeStatus]);

  // Temporarily disabled - Stripe coming soon
  /*
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

      const { url } = await linkResponse.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error activating Stripe:", error);
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

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error continuing setup:", error);
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

      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening dashboard:", error);
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
  */

  const handleSavePaymentMode = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/payment-settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMode,
          // externalPaymentInstructions temporarily disabled
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment settings");
      }

      toast({
        title: t("saved"),
        description: t("saved"),
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error saving payment settings:", error);
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
    // Temporarily disabled - show "Coming Soon" message
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-amber-500" />
            <CardTitle>{t("comingSoon")}</CardTitle>
          </div>
          <CardDescription>{t("comingSoonDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled className="cursor-not-allowed opacity-50">
            {t("activateStripe")}
          </Button>
        </CardContent>
      </Card>
    );

    // Original implementation - uncomment when Stripe is ready
    /*
    if (!status || status.onboardingStatus === "NOT_STARTED") {
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
            <Button onClick={handleActivateStripe} disabled={activating}>
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
    */

    /*
    if (
      status.onboardingStatus === "PENDING" ||
      !status.chargesEnabled ||
      !status.payoutsEnabled
    ) {
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
            <CardDescription>
              {t("onboardingPendingDescription")}
            </CardDescription>
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
                  <span>{status.chargesEnabled ? "Yes" : "No"}</span>
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
                  <span>{status.payoutsEnabled ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleContinueSetup} disabled={activating}>
                {activating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("activating")}
                  </>
                ) : (
                  t("continueSetup")
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleRefreshStatus}
                disabled={refreshing}
              >
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

    if (status.onboardingStatus === "COMPLETE") {
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
            <Button variant="outline" onClick={handleOpenDashboard}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("openDashboard")}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (status.onboardingStatus === "RESTRICTED") {
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
            <Button variant="destructive" onClick={handleOpenDashboard}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("openDashboard")}
            </Button>
          </CardContent>
        </Card>
      );
    }
    */
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
          <div className="space-y-3">
            {/* IN_APP - Requires Stripe Complete */}
            <div
              className={`flex items-start space-x-3 rounded-lg border p-4 ${
                status?.onboardingStatus === "COMPLETE"
                  ? "cursor-pointer hover:bg-accent"
                  : "cursor-not-allowed opacity-60"
              }`}
              onClick={() => {
                if (status?.onboardingStatus === "COMPLETE") {
                  setPaymentMode("IN_APP");
                }
              }}
            >
              <div className="mt-0.5">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    paymentMode === "IN_APP"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {paymentMode === "IN_APP" && (
                    <div className="h-full w-full rounded-full bg-white p-0.5">
                      <div className="h-full w-full rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid flex-1 gap-1.5 leading-none">
                <Label
                  className={`font-medium ${
                    status?.onboardingStatus === "COMPLETE"
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                >
                  {t("inApp")}
                  {status?.onboardingStatus !== "COMPLETE" && (
                    <span className="ml-2 text-xs text-amber-600">
                      (Requer Stripe)
                    </span>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("inAppDescription")}
                </p>
              </div>
            </div>

            {/* EXTERNAL - Always available */}
            <div
              className="flex cursor-pointer items-start space-x-3 rounded-lg border p-4 hover:bg-accent"
              onClick={() => setPaymentMode("EXTERNAL")}
            >
              <div className="mt-0.5">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    paymentMode === "EXTERNAL"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {paymentMode === "EXTERNAL" && (
                    <div className="h-full w-full rounded-full bg-white p-0.5">
                      <div className="h-full w-full rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid flex-1 gap-1.5 leading-none">
                <Label className="cursor-pointer font-medium">
                  {t("external")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("externalDescription")}
                </p>
              </div>
            </div>

            {/* MIXED - Requires Stripe Complete */}
            <div
              className={`flex items-start space-x-3 rounded-lg border p-4 ${
                status?.onboardingStatus === "COMPLETE"
                  ? "cursor-pointer hover:bg-accent"
                  : "cursor-not-allowed opacity-60"
              }`}
              onClick={() => {
                if (status?.onboardingStatus === "COMPLETE") {
                  setPaymentMode("MIXED");
                }
              }}
            >
              <div className="mt-0.5">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    paymentMode === "MIXED"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {paymentMode === "MIXED" && (
                    <div className="h-full w-full rounded-full bg-white p-0.5">
                      <div className="h-full w-full rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid flex-1 gap-1.5 leading-none">
                <Label
                  className={`font-medium ${
                    status?.onboardingStatus === "COMPLETE"
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                >
                  {t("mixed")}
                  {status?.onboardingStatus !== "COMPLETE" && (
                    <span className="ml-2 text-xs text-amber-600">
                      (Requer Stripe)
                    </span>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("mixedDescription")}
                </p>
              </div>
            </div>
          </div>

          {(paymentMode === "IN_APP" || paymentMode === "MIXED") &&
            (!status || status.onboardingStatus !== "COMPLETE") && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-amber-900">
                    {t("stripeRequiredDescription")}
                  </p>
                </div>
              </div>
            )}

          {/* External Payment Instructions - Hidden for now */}
          {/* {(paymentMode === "EXTERNAL" || paymentMode === "MIXED") && (
            <div className="space-y-2">
              <Label htmlFor="instructions">{t("instructions")}</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={t("instructionsPlaceholder")}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {t("instructionsHint")}
              </p>
            </div>
          )} */}

          <div className="flex justify-end">
            <Button onClick={handleSavePaymentMode} disabled={saving}>
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
