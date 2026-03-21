"use client";

import { Link } from "@/i18n/routing";
import { analyticsEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";

export function LogoLink() {
  const tNav = useTranslations("navigation");

  const handleLogoClick = () => {
    analyticsEvent("Logo_Click", {
      location: "header",
      destination: "homepage",
    });
  };

  return (
    <Link
      href="/"
      className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-2xl font-bold text-transparent transition-opacity hover:opacity-80"
      onClick={handleLogoClick}
      aria-label={`Athlifyr - ${tNav("home")}`}
    >
      Athlifyr
    </Link>
  );
}
