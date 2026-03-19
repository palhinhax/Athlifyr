"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function CreditLegalDisclaimer() {
  const t = useTranslations("credits");

  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("legal.disclaimer")}{" "}
        <Link href="/terms#credits" className="underline hover:text-foreground">
          {t("legal.termsApply")}
        </Link>
      </p>
    </div>
  );
}
