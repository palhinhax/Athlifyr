"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface EventRegistrationBarProps {
  readonly minPrice: number | null;
  readonly currency: string;
  readonly registrationDeadline: string | null;
  readonly externalUrl: string | null;
  readonly hasRegistrations: boolean;
  readonly cancelled: boolean;
  readonly isPastEvent: boolean;
}

export function EventRegistrationBar({
  minPrice,
  currency,
  registrationDeadline,
  externalUrl,
  hasRegistrations,
  cancelled,
  isPastEvent,
}: EventRegistrationBarProps) {
  const t = useTranslations("events");

  if (cancelled || isPastEvent) return null;

  const formattedPrice =
    minPrice == null
      ? null
      : new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currency || "EUR",
          minimumFractionDigits: 2,
        }).format(minPrice);

  const handleCTAClick = () => {
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    } else {
      // Scroll to registration section
      const registrationEl = document.getElementById("event-registration");
      if (registrationEl) {
        registrationEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <div className="hidden md:block">
          {registrationDeadline && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {registrationDeadline}
            </p>
          )}
          {formattedPrice && (
            <p className="text-lg font-bold">
              {t("registrationBar.pricesFrom", { price: formattedPrice })}
            </p>
          )}
        </div>
        <button
          onClick={handleCTAClick}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-lg font-bold text-primary-foreground shadow-lg transition-transform active:scale-95 sm:px-12 sm:py-4"
        >
          {externalUrl && !hasRegistrations ? (
            <>
              {t("goToWebsite")}
              <ExternalLink className="h-4 w-4" />
            </>
          ) : (
            t("register")
          )}
        </button>
      </div>
    </div>
  );
}
