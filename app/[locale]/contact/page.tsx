"use client";

import { useTranslations } from "next-intl";
import { ContactForm } from "@/components/contact-form";
import { Headset, CalendarCheck, Dumbbell } from "lucide-react";

const infoCards = [
  { key: "techSupport" as const, Icon: Headset },
  { key: "eventPartnerships" as const, Icon: CalendarCheck },
  { key: "gymSales" as const, Icon: Dumbbell },
];

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <main className="min-h-screen bg-background pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="mb-6 font-headline text-5xl font-extrabold tracking-tighter text-foreground md:text-7xl">
              {t("title")}
            </h1>
            <div className="mb-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/60" />
            <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </section>

        {/* Info Cards Grid */}
        <section className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-3">
          {infoCards.map(({ key, Icon }) => (
            <div
              key={key}
              className="group rounded-xl border border-border/10 bg-card p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-4 font-headline text-xl font-bold">
                {t(`cards.${key}`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`cards.${key}Desc`)}
              </p>
            </div>
          ))}
        </section>

        {/* Contact Form - Full Width */}
        <section className="mb-32">
          <div className="rounded-xl bg-muted/50 p-10">
            <h2 className="mb-8 font-headline text-3xl font-bold">
              {t("formTitle")}
            </h2>
            <ContactForm showSubject />
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            {t("footer.directContact")}{" "}
            <a
              href="mailto:hello@athlifyr.com"
              className="text-primary hover:underline"
            >
              hello@athlifyr.com
            </a>
          </p>
          <p className="mt-2">
            {t("footer.responseTime")} <strong>{t("footer.hours")}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
