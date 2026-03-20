import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";

interface AccessibilityPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AccessibilityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "legal.accessibility",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://www.athlifyr.com/${locale}/accessibility`,
    },
  };
}

export default async function AccessibilityPage({
  params,
}: AccessibilityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLegal = await getTranslations("legal");
  const t = await getTranslations("legal.accessibility");

  const formattedDate = new Date(2026, 2, 20).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageContainer size="lg" maxWidth="max-w-4xl">
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

        {/* Intro / Commitment */}
        <h2>{t("intro.title")}</h2>
        <p>{t("intro.content")}</p>

        {/* Current Support */}
        <h2>{t("currentSupport.title")}</h2>

        <h3>{t("currentSupport.web.title")}</h3>
        <ul>
          <li>{t("currentSupport.web.items.language")}</li>
          <li>{t("currentSupport.web.items.skipLink")}</li>
          <li>{t("currentSupport.web.items.semanticHtml")}</li>
          <li>{t("currentSupport.web.items.headingHierarchy")}</li>
          <li>{t("currentSupport.web.items.imageAlt")}</li>
          <li>{t("currentSupport.web.items.screenReader")}</li>
          <li>{t("currentSupport.web.items.modals")}</li>
          <li>{t("currentSupport.web.items.tabs")}</li>
          <li>{t("currentSupport.web.items.cookieConsent")}</li>
          <li>{t("currentSupport.web.items.notifications")}</li>
          <li>{t("currentSupport.web.items.ariaLabels")}</li>
          <li>{t("currentSupport.web.items.darkMode")}</li>
        </ul>

        <h3>{t("currentSupport.mobile.title")}</h3>
        <ul>
          <li>{t("currentSupport.mobile.items.eventCards")}</li>
          <li>{t("currentSupport.mobile.items.searchInput")}</li>
          <li>{t("currentSupport.mobile.items.viewToggle")}</li>
          <li>{t("currentSupport.mobile.items.loadingIndicators")}</li>
          <li>{t("currentSupport.mobile.items.translations")}</li>
          <li>{t("currentSupport.mobile.items.touchTargets")}</li>
        </ul>

        {/* Testing Methods */}
        <h2>{t("testing.title")}</h2>
        <p>{t("testing.content")}</p>
        <ul>
          <li>{t("testing.items.automated")}</li>
          <li>{t("testing.items.keyboard")}</li>
          <li>{t("testing.items.screenReaders")}</li>
          <li>{t("testing.items.codeReview")}</li>
          <li>{t("testing.items.wcag")}</li>
        </ul>

        {/* Known Limitations */}
        <h2>{t("limitations.title")}</h2>
        <p>{t("limitations.content")}</p>
        <ul>
          <li>{t("limitations.items.maps")}</li>
          <li>{t("limitations.items.colorContrast")}</li>
          <li>{t("limitations.items.formErrors")}</li>
          <li>{t("limitations.items.loadingStates")}</li>
          <li>{t("limitations.items.mobileLabels")}</li>
          <li>{t("limitations.items.textScaling")}</li>
          <li>{t("limitations.items.thirdParty")}</li>
        </ul>

        {/* Contact */}
        <h2>{t("contact.title")}</h2>
        <p>{t("contact.content")}</p>
        <p>
          <a
            href={`mailto:${t("contact.email")}?subject=${encodeURIComponent(t("contact.subject"))}`}
          >
            {t("contact.emailLabel", { email: t("contact.email") })}
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          {t("contact.subjectHint", { subject: t("contact.subject") })}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("contact.responseTime")}
        </p>

        {/* Standards */}
        <h2>{t("standards.title")}</h2>
        <p>{t("standards.content")}</p>

        <div className="mt-12 rounded-lg border bg-muted/50 p-6">
          <p className="mb-0 text-sm text-muted-foreground">
            {t("standards.note")}
          </p>
        </div>
      </article>
    </PageContainer>
  );
}
