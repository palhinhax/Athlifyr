import * as Sentry from "@sentry/nextjs";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const referer = headersList.get("referer") || "";

  Sentry.captureMessage("404 Not Found (locale route)", {
    level: "warning",
    tags: { feature: "not-found" },
    extra: {
      pathname,
      referer,
    },
  });

  const t = await getTranslations("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">{t("notFound.heading")}</h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        {t("notFound.description")}
      </p>
      <Button asChild>
        <Link href="/">{t("notFound.backHome")}</Link>
      </Button>
    </div>
  );
}
