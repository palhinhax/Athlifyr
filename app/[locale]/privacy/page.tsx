import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLegal = await getTranslations("legal");
  const t = await getTranslations("legal.privacy");

  const formattedDate = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {tLegal("back")}
          </Link>
        </Button>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1>{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("lastUpdated", { date: formattedDate })}
          </p>

          <p>{t("intro")}</p>

          <h2>{t("sections.dataCollection.title")}</h2>
          <p>{t("sections.dataCollection.content")}</p>

          <h2>{t("sections.dataUsage.title")}</h2>
          <p>{t("sections.dataUsage.content")}</p>

          <h2>{t("sections.dataSharing.title")}</h2>
          <p>{t("sections.dataSharing.content")}</p>

          <h2>{t("sections.dataRetention.title")}</h2>
          <p>{t("sections.dataRetention.content")}</p>

          <h2>{t("sections.rights.title")}</h2>
          <p>{t("sections.rights.content")}</p>

          <h2>{t("sections.cookies.title")}</h2>
          <p>{t("sections.cookies.content")}</p>

          <h2>{t("sections.security.title")}</h2>
          <p>{t("sections.security.content")}</p>

          <h2>{t("sections.children.title")}</h2>
          <p>{t("sections.children.content")}</p>

          <h2>{t("sections.internationalTransfers.title")}</h2>
          <p>{t("sections.internationalTransfers.content")}</p>

          <h2>{t("sections.changes.title")}</h2>
          <p>{t("sections.changes.content")}</p>

          <h2>{t("sections.contact.title")}</h2>
          <p>{t("sections.contact.content")}</p>

          <div className="mt-12 rounded-lg border bg-muted/50 p-6">
            <h3 className="mt-0">{t("summary.title")}</h3>
            <ul className="mb-0">
              <li>✅ {t("summary.items.necessary")}</li>
              <li>✅ {t("summary.items.noSell")}</li>
              <li>✅ {t("summary.items.rights")}</li>
              <li>✅ {t("summary.items.cookies")}</li>
              <li>✅ {t("summary.items.protected")}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
