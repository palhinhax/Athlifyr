"use client";

import { CheckCircle, Clock, AlertTriangle, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

export function StripeStatusBadge({ status }: { status: string }) {
  const t = useTranslations("manage.payments");

  if (status === "COMPLETE") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
        <CheckCircle className="h-4 w-4" />
        {t("stripeActive")}
      </div>
    );
  }
  if (status === "PENDING") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
        <Clock className="h-4 w-4" />
        {t("stripePending")}
      </div>
    );
  }
  if (status === "RESTRICTED") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
        <AlertTriangle className="h-4 w-4" />
        {t("stripeRestricted")}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
      <CreditCard className="h-4 w-4" />
      {t("stripeNotConfigured")}
    </div>
  );
}
