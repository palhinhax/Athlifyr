"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function NavLinks() {
  const { data: session } = useSession();
  const t = useTranslations("nav");

  return (
    <>
      {session && (
        <Link href="/profile" className="text-sm font-medium hover:underline">
          {t("profile")}
        </Link>
      )}
      <Link href="/events" className="text-sm font-medium hover:underline">
        {t("events")}
      </Link>
      {session && (
        <Link href="/feed" className="text-sm font-medium hover:underline">
          {t("feed")}
        </Link>
      )}
      <Link href="/contact" className="text-sm font-medium hover:underline">
        {t("contact")}
      </Link>
      {session?.user?.role === "ADMIN" && (
        <>
          <Link
            href="/admin/instagram"
            className="text-sm font-medium hover:underline"
          >
            {t("instagram")}
          </Link>
          <Link
            href="/admin/contacts"
            className="text-sm font-medium hover:underline"
          >
            {t("contacts")}
          </Link>
        </>
      )}
    </>
  );
}
