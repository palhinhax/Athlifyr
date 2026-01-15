"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTranslations } from "@/lib/translations";

export function NavLinks() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [locale, setLocale] = useState("pt");

  // Extract locale from pathname (first segment after /)
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const pathLocale = segments[0];
    // Check if first segment is a valid locale
    if (["pt", "en", "es", "fr", "de", "it"].includes(pathLocale)) {
      setLocale(pathLocale);
    }
  }, [pathname]);

  const t = getTranslations(locale);

  return (
    <>
      {session && (
        <Link
          href={`/${locale}/profile`}
          className="text-sm font-medium hover:underline"
        >
          {t("nav.profile")}
        </Link>
      )}
      <Link
        href={`/${locale}/events`}
        className="text-sm font-medium hover:underline"
      >
        {t("nav.events")}
      </Link>
      <Link
        href={`/${locale}/map`}
        className="text-sm font-medium hover:underline"
      >
        {t("nav.map")}
      </Link>
      {session && (
        <Link
          href={`/${locale}/feed`}
          className="text-sm font-medium hover:underline"
        >
          {t("nav.feed")}
        </Link>
      )}
      <Link
        href={`/${locale}/contact`}
        className="text-sm font-medium hover:underline"
      >
        {t("nav.contact")}
      </Link>
      {session?.user?.role === "ADMIN" && (
        <>
          <Link
            href={`/${locale}/admin/instagram`}
            className="text-sm font-medium hover:underline"
          >
            {t("nav.instagram")}
          </Link>
          <Link
            href={`/${locale}/admin/contacts`}
            className="text-sm font-medium hover:underline"
          >
            {t("nav.contacts")}
          </Link>
        </>
      )}
    </>
  );
}
