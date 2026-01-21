"use client";

import { Link } from "@/i18n/routing";
import { analyticsEvent } from "@/lib/analytics";

interface LogoLinkProps {
  locale: string;
}

export function LogoLink({ locale }: LogoLinkProps) {
  const handleLogoClick = () => {
    analyticsEvent("Logo_Click", {
      location: "header",
      destination: "homepage",
    });
  };

  return (
    <Link
      href={`/${locale}`}
      className="text-2xl font-bold transition-opacity hover:opacity-80"
      onClick={handleLogoClick}
    >
      Athlifyr
    </Link>
  );
}
