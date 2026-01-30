"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { analyticsEvent } from "@/lib/analytics";

export function NavLinks() {
  const { data: session } = useSession();
  const t = useTranslations("nav");

  const handleNavClick = (destination: string) => {
    analyticsEvent("Navigation_Click", {
      destination,
      location: "header",
      authenticated: session ? "true" : "false",
    });
  };

  return (
    <>
      {session && (
        <Link
          href="/profile"
          className="text-sm font-medium hover:underline"
          onClick={() => handleNavClick("profile")}
        >
          {t("profile")}
        </Link>
      )}
      <Link
        href="/events"
        className="text-sm font-medium hover:underline"
        onClick={() => handleNavClick("events")}
      >
        {t("events")}
      </Link>
      <Link
        href="/venues"
        className="text-sm font-medium hover:underline"
        onClick={() => handleNavClick("venues")}
      >
        {t("venues")}
      </Link>
      {session && (
        <Link
          href="/workouts"
          className="text-sm font-medium hover:underline"
          onClick={() => handleNavClick("workouts")}
        >
          {t("workouts")}
        </Link>
      )}
      {session && (
        <Link
          href="/feed"
          className="text-sm font-medium hover:underline"
          onClick={() => handleNavClick("feed")}
        >
          {t("feed")}
        </Link>
      )}
      {session && (
        <Link
          href="/chat"
          className="text-sm font-medium hover:underline"
          onClick={() => handleNavClick("messages")}
        >
          {t("messages")}
        </Link>
      )}
      {session?.user?.role === "ADMIN" && (
        <Link
          href="/admin"
          className="text-sm font-medium hover:underline"
          onClick={() => handleNavClick("admin")}
        >
          {t("admin")}
        </Link>
      )}
    </>
  );
}
