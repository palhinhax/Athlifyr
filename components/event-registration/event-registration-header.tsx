"use client";

import { useTranslations } from "next-intl";

interface EventRegistrationHeaderProps {
  hasRegistrations: boolean;
}

export function EventRegistrationHeader({
  hasRegistrations,
}: EventRegistrationHeaderProps) {
  const t = useTranslations("events.registration");

  return (
    <h4 className="text-on-surface-variant mb-6 text-xs font-bold uppercase tracking-widest">
      {hasRegistrations ? t("registerTitle") : t("willYouGo")}
    </h4>
  );
}
