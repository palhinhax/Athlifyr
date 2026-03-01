import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLegal = await getTranslations("legal");
  const t = await getTranslations("legal.cookies");

  const formattedDate = new Date().toLocaleDateString(locale, {
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
        <h1>{t("title")} 🍪</h1>
        <p className="text-sm text-muted-foreground">
          {t("lastUpdated", { date: formattedDate })}
        </p>

        <p>{t("intro")}</p>

        <h2>{t("sections.whatAre.title")}</h2>
        <p>{t("sections.whatAre.content")}</p>

        <h2>{t("sections.types.title")}</h2>

        <h3>1. {t("sections.types.essential.title")} ✅</h3>
        <p>{t("sections.types.essential.description")}</p>
        <p>{t("sections.types.essential.examples")}</p>

        <h3>2. {t("sections.types.analytics.title")} 📊</h3>
        <p>{t("sections.types.analytics.description")}</p>
        <p>{t("sections.types.analytics.examples")}</p>

        <h3>3. {t("sections.types.functional.title")} ⚙️</h3>
        <p>{t("sections.types.functional.description")}</p>
        <p>{t("sections.types.functional.examples")}</p>

        <h2>{t("sections.thirdParty.title")}</h2>
        <p>
          {t("sections.thirdParty.googleContent")}{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
        </p>
        <p>
          {t("sections.thirdParty.sentryContent")}{" "}
          <a
            href="https://sentry.io/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sentry Privacy Policy
          </a>
        </p>

        <h2>{t("sections.manage.title")}</h2>
        <ul>
          <li>{t("sections.manage.banner")}</li>
          <li>{t("sections.manage.browser")}</li>
          <li>
            {t("sections.manage.gaOptout")}{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out
            </a>
          </li>
        </ul>

        <h2>{t("sections.duration.title")}</h2>
        <ul>
          <li>
            <strong>{t("sections.duration.session")}</strong>
          </li>
          <li>
            <strong>{t("sections.duration.persistent")}</strong>
          </li>
        </ul>

        <h2>{t("sections.table.title")}</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>{t("sections.table.headers.name")}</th>
                <th>{t("sections.table.headers.type")}</th>
                <th>{t("sections.table.headers.purpose")}</th>
                <th>{t("sections.table.headers.duration")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>next-auth.session-token</code>
                </td>
                <td>{t("sections.table.rows.sessionToken.type")}</td>
                <td>{t("sections.table.rows.sessionToken.purpose")}</td>
                <td>{t("sections.table.rows.sessionToken.duration")}</td>
              </tr>
              <tr>
                <td>
                  <code>NEXT_LOCALE</code>
                </td>
                <td>{t("sections.table.rows.locale.type")}</td>
                <td>{t("sections.table.rows.locale.purpose")}</td>
                <td>{t("sections.table.rows.locale.duration")}</td>
              </tr>
              <tr>
                <td>
                  <code>athlifyr_cookie_consent</code>
                </td>
                <td>{t("sections.table.rows.cookieConsent.type")}</td>
                <td>{t("sections.table.rows.cookieConsent.purpose")}</td>
                <td>{t("sections.table.rows.cookieConsent.duration")}</td>
              </tr>
              <tr>
                <td>
                  <code>_ga</code>
                </td>
                <td>{t("sections.table.rows.ga.type")}</td>
                <td>{t("sections.table.rows.ga.purpose")}</td>
                <td>{t("sections.table.rows.ga.duration")}</td>
              </tr>
              <tr>
                <td>
                  <code>_gid</code>
                </td>
                <td>{t("sections.table.rows.gid.type")}</td>
                <td>{t("sections.table.rows.gid.purpose")}</td>
                <td>{t("sections.table.rows.gid.duration")}</td>
              </tr>
              <tr>
                <td>
                  <code>sentryReplaySession</code>
                </td>
                <td>{t("sections.table.rows.sentryReplay.type")}</td>
                <td>{t("sections.table.rows.sentryReplay.purpose")}</td>
                <td>{t("sections.table.rows.sentryReplay.duration")}</td>
              </tr>
              <tr>
                <td>
                  <code>sentry-sc</code>
                </td>
                <td>{t("sections.table.rows.sentrySc.type")}</td>
                <td>{t("sections.table.rows.sentrySc.purpose")}</td>
                <td>{t("sections.table.rows.sentrySc.duration")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t("sections.updates.title")}</h2>
        <p>{t("sections.updates.content")}</p>

        <h2>{t("sections.questions.title")}</h2>
        <p>
          {t("sections.questions.content")} <Link href="/contact">→</Link>
        </p>

        <div className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h3 className="mt-0">{t("summary.title")}</h3>
          <ul className="mb-0">
            <li>🍪 {t("summary.items.essential")}</li>
            <li>📊 {t("summary.items.analytics")}</li>
            <li>🛡️ {t("summary.items.sentry")}</li>
            <li>⚙️ {t("summary.items.functional")}</li>
            <li>🔒 {t("summary.items.manage")}</li>
            <li>❌ {t("summary.items.noSell")}</li>
          </ul>
        </div>
      </article>
    </PageContainer>
  );
}
