"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-6xl font-bold">{t("code")}</h1>
      <h2 className="mb-4 text-2xl font-semibold">{t("title")}</h2>
      <p className="mb-4 max-w-md text-center text-muted-foreground">
        {t("description")}
      </p>
      <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
        {t("suggestion")}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            {t("backHome")}
          </Button>
        </Link>
        <Link href="/events">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            {t("browseEvents")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
