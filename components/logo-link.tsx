"use client";

import { Link } from "@/i18n/routing";
import { analyticsEvent } from "@/lib/analytics";

export function LogoLink() {
  const handleLogoClick = () => {
    analyticsEvent("Logo_Click", {
      location: "header",
      destination: "homepage",
    });
  };

  return (
    <Link
      href="/"
      className="text-2xl font-bold transition-opacity hover:opacity-80"
      onClick={handleLogoClick}
    >
      Athlifyr
    </Link>
  );
}
