import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft,
  CheckCircle,
  Star,
  Shield,
  Users,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.terms" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

const sectionKeys = [
  "acceptance",
  "description",
  "account",
  "userContent",
  "prohibited",
  "intellectual",
  "disclaimer",
  "limitation",
  "termination",
  "changes",
  "law",
  "contact",
] as const;

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLegal = await getTranslations("legal");
  const t = await getTranslations("legal.terms");

  const formattedDate = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-background pb-20 pt-32">
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
            {t("title")} 📜
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("lastUpdated", { date: formattedDate })}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="space-y-8 lg:col-span-8">
            {sectionKeys.map((key, index) => {
              const num = String(index + 1).padStart(2, "0");
              const isEven = index % 2 === 0;

              return (
                <section
                  key={key}
                  className={`rounded-xl p-8 md:p-10 ${
                    isEven
                      ? "bg-card shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                      : "bg-muted/50"
                  }`}
                >
                  <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                      {num}
                    </span>
                    {t(`sections.${key}.title`)}
                  </h2>

                  {key === "account" ? (
                    <div className="space-y-3 leading-relaxed text-muted-foreground">
                      <p>{t(`sections.${key}.content`)}</p>
                      <ul className="space-y-3">
                        {[t(`sections.${key}.content`).split(". ")][0].map(
                          (item, i) =>
                            i > 0 ? (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                                <span>{item.replace(/\.$/, "")}</span>
                              </li>
                            ) : null
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="leading-relaxed text-muted-foreground">
                      {t(`sections.${key}.content`)}
                    </p>
                  )}
                </section>
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Quick Summary Card */}
              <div className="rounded-xl border border-border/10 bg-card p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                <h3 className="mb-6 text-xl font-bold text-foreground">
                  {t("summary.title")}
                </h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {t("summary.excellence")}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("summary.excellenceDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {t("summary.security")}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("summary.securityDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {t("summary.community")}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("summary.communityDesc")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-border/15 pt-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("lastUpdated", { date: "" }).replace(": ", "")}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* CTA Support Card */}
              <div className="relative overflow-hidden rounded-xl bg-primary p-8">
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-bold text-primary-foreground">
                    {t("questions.title")}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-primary-foreground/80">
                    {t("questions.description")}
                  </p>
                  <Button
                    asChild
                    className="w-full rounded-xl bg-primary-foreground font-bold text-primary hover:bg-primary-foreground/90"
                  >
                    <Link href="/contact">{t("questions.cta")}</Link>
                  </Button>
                </div>
                <HelpCircle className="absolute -bottom-4 -right-4 h-24 w-24 rotate-12 text-primary-foreground/10" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
