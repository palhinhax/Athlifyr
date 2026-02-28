"use client";

import { Users, Target } from "lucide-react";
import { useTranslations } from "next-intl";

interface EventRegistrationHeaderProps {
  hasRegistrations: boolean;
  participantsCount: number;
  interestedCount: number;
}

export function EventRegistrationHeader({
  hasRegistrations,
  participantsCount,
  interestedCount,
}: EventRegistrationHeaderProps) {
  const t = useTranslations("events.registration");

  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xl font-bold">
        {hasRegistrations ? t("registerTitle") : t("willYouGo")}
      </h3>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>
            {participantsCount} {t("participants")}
          </span>
        </div>
        {interestedCount > 0 && (
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>
              {interestedCount} {t("interestedCount")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
