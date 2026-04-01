import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft,
  Shield,
  SlidersHorizontal,
  Lock,
  Eye,
  PenLine,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

const sectionKeys = [
  "dataCollection",
  "dataUsage",
  "dataSharing",
  "dataRetention",
  "rights",
  "cookies",
  "security",
  "children",
  "internationalTransfers",
  "changes",
  "contact",
] as const;

const tableRowKeys = ["profile", "vitals", "geo", "transactions"] as const;

function SectionContent({
  sectionKey,
  index,
  t,
}: {
  sectionKey: (typeof sectionKeys)[number];
  index: number;
  t: (key: string) => string;
}) {
  if (sectionKey === "dataCollection") {
    return (
      <div className="space-y-4 rounded-xl bg-card p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <p className="leading-relaxed text-muted-foreground">
          {t(`sections.${sectionKey}.content`)}
        </p>
      </div>
    );
  }

  if (sectionKey === "dataUsage") {
    return (
      <div className="rounded-xl bg-card p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <p className="leading-relaxed text-muted-foreground">
          {t(`sections.${sectionKey}.content`)}
        </p>
      </div>
    );
  }

  if (sectionKey === "rights") {
    return (
      <div className="space-y-6 rounded-xl bg-muted/50 p-8">
        <p className="leading-relaxed text-muted-foreground">
          {t(`sections.${sectionKey}.content`)}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-4 text-center">
            <Eye className="mx-auto mb-3 h-8 w-8 text-primary" />
            <p className="text-sm font-bold text-foreground">
              {t("sections.rights.title").replace(/^\d+\.\s*/, "")}
            </p>
          </div>
          <div className="p-4 text-center">
            <PenLine className="mx-auto mb-3 h-8 w-8 text-primary" />
            <p className="text-sm font-bold text-foreground">
              {t("sections.dataRetention.title").replace(/^\d+\.\s*/, "")}
            </p>
          </div>
          <div className="p-4 text-center">
            <Trash2 className="mx-auto mb-3 h-8 w-8 text-primary" />
            <p className="text-sm font-bold text-foreground">
              {t("sections.contact.title").replace(/^\d+\.\s*/, "")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (sectionKey === "security") {
    return (
      <div className="rounded-xl bg-card p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-6">
          <div className="hidden h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 md:flex">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <p className="leading-relaxed text-muted-foreground">
            {t(`sections.${sectionKey}.content`)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-8 ${
        index % 2 === 0
          ? "bg-card shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
          : "bg-muted/50"
      }`}
    >
      <p className="leading-relaxed text-muted-foreground">
        {t(`sections.${sectionKey}.content`)}
      </p>
    </div>
  );
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
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            {t("badge")}
          </div>
          <h1 className="mb-6 font-headline text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("lastUpdated", { date: formattedDate })}
          </p>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Content */}
          <div className="space-y-16 lg:col-span-8">
            {sectionKeys.map((key, index) => (
              <div key={key} className="space-y-6">
                <h2 className="flex items-center gap-3 font-headline text-2xl font-bold text-foreground">
                  <span className="h-8 w-2 rounded-full bg-primary" />
                  {t(`sections.${key}.title`)}
                </h2>
                <SectionContent sectionKey={key} index={index} t={t} />
              </div>
            ))}
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Key Highlights Card */}
              <div className="rounded-xl border border-border/10 bg-card p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                <h3 className="mb-8 font-headline text-xl font-extrabold tracking-tight text-foreground">
                  {t("highlights.title")}
                </h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {t("highlights.privacyByDesign")}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("highlights.privacyByDesignDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {t("highlights.totalControl")}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("highlights.totalControlDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {t("highlights.encryption")}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("highlights.encryptionDesc")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA inside highlights card */}
                <div className="mt-12 rounded-xl bg-primary p-6 text-primary-foreground">
                  <h4 className="mb-2 font-bold">{t("questions.title")}</h4>
                  <p className="mb-4 text-sm opacity-90">
                    {t("questions.description")}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 font-bold hover:underline"
                  >
                    {t("questions.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Data Usage Summary Table */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="overflow-hidden rounded-xl bg-muted/50">
          <div className="border-b border-border/10 bg-card px-8 py-6">
            <h3 className="font-headline text-xl font-bold text-foreground">
              {t("table.title")}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/50 text-sm uppercase tracking-wider text-muted-foreground">
                  <th className="px-8 py-4 font-bold">{t("table.category")}</th>
                  <th className="px-8 py-4 font-bold">{t("table.purpose")}</th>
                  <th className="px-8 py-4 font-bold">
                    {t("table.retention")}
                  </th>
                  <th className="px-8 py-4 font-bold">
                    {t("table.thirdParties")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 bg-card">
                {tableRowKeys.map((rowKey) => (
                  <tr key={rowKey}>
                    <td className="px-8 py-6">
                      <div className="font-bold text-foreground">
                        {t(`table.rows.${rowKey}.name`)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t(`table.rows.${rowKey}.detail`)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      {t(`table.rows.${rowKey}.purpose`)}
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      {t(`table.rows.${rowKey}.retention`)}
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      {t(`table.rows.${rowKey}.thirdParties`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
