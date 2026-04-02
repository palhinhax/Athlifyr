import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft,
  Info,
  Lock,
  BarChart3,
  Settings,
  CheckCircle,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CookiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.cookies" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
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
    <main className="min-h-screen bg-background pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {tLegal("back")}
          </Link>
        </Button>

        {/* Hero Section */}
        <header className="mb-16">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            {t("badge")}
          </div>
          <h1 className="mb-6 font-headline text-5xl font-extrabold tracking-tighter text-foreground md:text-6xl">
            {t("title")} 🍪
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Content */}
          <div className="space-y-20 lg:col-span-8">
            {/* What are Cookies? */}
            <section>
              <h2 className="mb-6 flex items-center gap-3 font-headline text-3xl font-bold">
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Info className="h-6 w-6" />
                </span>
                {t("sections.whatAre.title")}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("sections.whatAre.content")}
              </p>
            </section>

            {/* Cookie Types */}
            <section>
              <h2 className="mb-8 font-headline text-3xl font-bold">
                {t("sections.types.title")}
              </h2>
              <div className="grid gap-6 md:grid-cols-1">
                <div className="rounded-xl border-l-4 border-primary bg-muted/50 p-8">
                  <h3 className="mb-3 flex items-center gap-2 font-headline text-xl font-bold text-foreground">
                    <Lock className="h-5 w-5 text-primary" />
                    {t("sections.types.essential.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("sections.types.essential.description")}
                  </p>
                </div>
                <div className="rounded-xl border-l-4 border-amber-400 bg-muted/50 p-8">
                  <h3 className="mb-3 flex items-center gap-2 font-headline text-xl font-bold text-foreground">
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                    {t("sections.types.analytics.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("sections.types.analytics.description")}
                  </p>
                </div>
                <div className="rounded-xl border-l-4 border-orange-300 bg-muted/50 p-8">
                  <h3 className="mb-3 flex items-center gap-2 font-headline text-xl font-bold text-foreground">
                    <Settings className="h-5 w-5 text-orange-300" />
                    {t("sections.types.functional.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("sections.types.functional.description")}
                  </p>
                </div>
              </div>
            </section>

            {/* Third Party */}
            <section>
              <h2 className="mb-6 font-headline text-3xl font-bold">
                {t("sections.thirdParty.title")}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {t("sections.thirdParty.googleContent")}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-bold text-primary">
                    G
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      Google Analytics
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.table.rows.ga.purpose")}
                    </p>
                  </div>
                </a>
                <a
                  href="https://sentry.io/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-bold text-primary">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Sentry</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.table.rows.sentryReplay.purpose")}
                    </p>
                  </div>
                </a>
              </div>
            </section>

            {/* How to Manage Cookies — CTA Banner */}
            <section className="relative overflow-hidden rounded-2xl bg-primary p-10 text-primary-foreground">
              <div className="relative z-10 max-w-xl">
                <h2 className="mb-4 font-headline text-3xl font-bold">
                  {t("sections.manage.title")}
                </h2>
                <ul className="mb-6 space-y-2 opacity-90">
                  <li>• {t("sections.manage.banner")}</li>
                  <li>• {t("sections.manage.browser")}</li>
                  <li>
                    •{" "}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      {t("sections.manage.gaOptout")}
                    </a>
                  </li>
                </ul>
              </div>
              {/* Decorative background accent */}
              <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary-foreground/10" />
            </section>

            {/* Cookie Duration */}
            <section>
              <h2 className="mb-6 font-headline text-3xl font-bold">
                {t("sections.duration.title")}
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    {t("sections.duration.session")}
                  </strong>
                </li>
                <li>
                  <strong className="text-foreground">
                    {t("sections.duration.persistent")}
                  </strong>
                </li>
              </ul>
            </section>

            {/* Detailed Table */}
            <section>
              <h2 className="mb-8 font-headline text-3xl font-bold text-foreground">
                {t("sections.table.title")}
              </h2>
              <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">
                      {t("sections.table.title")}
                    </caption>
                    <thead>
                      <tr className="bg-muted text-sm font-bold uppercase tracking-widest text-foreground">
                        <th className="px-8 py-5">
                          {t("sections.table.headers.name")}
                        </th>
                        <th className="px-8 py-5">
                          {t("sections.table.headers.type")}
                        </th>
                        <th className="px-8 py-5">
                          {t("sections.table.headers.purpose")}
                        </th>
                        <th className="px-8 py-5">
                          {t("sections.table.headers.duration")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="px-8 py-6 font-semibold text-primary">
                          next-auth.session-token
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.sessionToken.type")}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.sessionToken.purpose")}
                        </td>
                        <td className="px-8 py-6">
                          {t("sections.table.rows.sessionToken.duration")}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="px-8 py-6 font-semibold text-primary">
                          NEXT_LOCALE
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.locale.type")}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.locale.purpose")}
                        </td>
                        <td className="px-8 py-6">
                          {t("sections.table.rows.locale.duration")}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="px-8 py-6 font-semibold text-primary">
                          athlifyr_cookie_consent
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.cookieConsent.type")}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.cookieConsent.purpose")}
                        </td>
                        <td className="px-8 py-6">
                          {t("sections.table.rows.cookieConsent.duration")}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="px-8 py-6 font-semibold text-primary">
                          _ga
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.ga.type")}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.ga.purpose")}
                        </td>
                        <td className="px-8 py-6">
                          {t("sections.table.rows.ga.duration")}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="px-8 py-6 font-semibold text-primary">
                          _gid
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.gid.type")}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.gid.purpose")}
                        </td>
                        <td className="px-8 py-6">
                          {t("sections.table.rows.gid.duration")}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="px-8 py-6 font-semibold text-primary">
                          sentryReplaySession
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.sentryReplay.type")}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.sentryReplay.purpose")}
                        </td>
                        <td className="px-8 py-6">
                          {t("sections.table.rows.sentryReplay.duration")}
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="px-8 py-6 font-semibold text-primary">
                          sentry-sc
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.sentrySc.type")}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">
                          {t("sections.table.rows.sentrySc.purpose")}
                        </td>
                        <td className="px-8 py-6">
                          {t("sections.table.rows.sentrySc.duration")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="mb-6 font-headline text-3xl font-bold">
                {t("sections.updates.title")}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("sections.updates.content")}
              </p>
            </section>

            {/* Questions */}
            <section>
              <h2 className="mb-6 font-headline text-3xl font-bold">
                {t("sections.questions.title")}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("sections.questions.content")}{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-primary hover:underline"
                >
                  →
                </Link>
              </p>
            </section>
          </div>

          {/* Right Column: Summary Card */}
          <aside className="sticky top-32 lg:col-span-4">
            <div className="rounded-2xl bg-card p-8 shadow-lg">
              <h3 className="mb-6 border-b border-border pb-4 font-headline text-xl font-bold">
                {t("summary.title")}
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="mb-1 block text-foreground">
                      {t("summary.items.manage")}
                    </strong>
                    {t("summary.items.essential")}
                  </p>
                </li>
                <li className="flex gap-4">
                  <Shield className="h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="mb-1 block text-foreground">
                      {t("summary.items.noSell")}
                    </strong>
                    {t("summary.items.sentry")}
                  </p>
                </li>
                <li className="flex gap-4">
                  <Zap className="h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="mb-1 block text-foreground">
                      {t("summary.items.functional")}
                    </strong>
                    {t("summary.items.analytics")}
                  </p>
                </li>
              </ul>
              <div className="mt-8 border-t border-border pt-8">
                <p className="mb-4 text-xs text-muted-foreground">
                  {t("lastUpdated", { date: formattedDate })}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
