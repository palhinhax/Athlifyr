"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { Mail, MessageSquare, AlertCircle } from "lucide-react";
import { PageContainer } from "@/components/page-container";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <PageContainer maxWidth="max-w-3xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Contact Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center p-6 text-center">
          <MessageSquare className="mb-3 h-8 w-8 text-primary" />
          <h3 className="mb-1 font-semibold">{t("cards.suggestions")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("cards.suggestionsDesc")}
          </p>
        </Card>

        <Card className="flex flex-col items-center p-6 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-orange-500" />
          <h3 className="mb-1 font-semibold">{t("cards.reportProblem")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("cards.reportProblemDesc")}
          </p>
        </Card>

        <Card className="flex flex-col items-center p-6 text-center">
          <Mail className="mb-3 h-8 w-8 text-blue-500" />
          <h3 className="mb-1 font-semibold">{t("cards.questions")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("cards.questionsDesc")}
          </p>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="p-6">
        <ContactForm showSubject />
      </Card>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
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
    </PageContainer>
  );
}
