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
  const t = await getTranslations("legal");
  const p = await getTranslations("legal.privacy");

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
            {t("back")}
          </Link>
        </Button>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1>{p("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {p("lastUpdated", { date: formattedDate })}
          </p>

          <p>{p("intro")}</p>

          <h2>{p("section1.title")}</h2>
          <p>{p("section1.intro")}</p>
          <ul>
            <li>
              <strong>{p("section1.accountData")}:</strong>{" "}
              {p("section1.accountDataDesc")}
            </li>
            <li>
              <strong>{p("section1.locationData")}:</strong>{" "}
              {p("section1.locationDataDesc")}
            </li>
            <li>
              <strong>{p("section1.contentData")}:</strong>{" "}
              {p("section1.contentDataDesc")}
            </li>
            <li>
              <strong>{p("section1.usageData")}:</strong>{" "}
              {p("section1.usageDataDesc")}
            </li>
            <li>
              <strong>{p("section1.technicalData")}:</strong>{" "}
              {p("section1.technicalDataDesc")}
            </li>
          </ul>

          <h2>{p("section2.title")}</h2>
          <p>{p("section2.intro")}</p>
          <ul>
            <li>{p("section2.item1")}</li>
            <li>{p("section2.item2")}</li>
            <li>{p("section2.item3")}</li>
            <li>{p("section2.item4")}</li>
            <li>{p("section2.item5")}</li>
            <li>{p("section2.item6")}</li>
            <li>{p("section2.item7")}</li>
          </ul>

          <h2>{p("section3.title")}</h2>
          <p>
            <strong>{p("section3.noSell")}</strong>
          </p>
          <p>{p("section3.intro")}</p>
          <ul>
            <li>
              <strong>{p("section3.google")}:</strong>{" "}
              {p("section3.googleDesc")}
            </li>
            <li>
              <strong>{p("section3.backblaze")}:</strong>{" "}
              {p("section3.backblazeDesc")}
            </li>
            <li>
              <strong>{p("section3.authorities")}:</strong>{" "}
              {p("section3.authoritiesDesc")}
            </li>
          </ul>

          <h2>{p("section4.title")}</h2>
          <p>{p("section4.content")}</p>

          <h2>{p("section5.title")}</h2>
          <p>{p("section5.intro")}</p>
          <ul>
            <li>
              <strong>{p("section5.access")}:</strong>{" "}
              {p("section5.accessDesc")}
            </li>
            <li>
              <strong>{p("section5.rectification")}:</strong>{" "}
              {p("section5.rectificationDesc")}
            </li>
            <li>
              <strong>{p("section5.erasure")}:</strong>{" "}
              {p("section5.erasureDesc")}
            </li>
            <li>
              <strong>{p("section5.portability")}:</strong>{" "}
              {p("section5.portabilityDesc")}
            </li>
            <li>
              <strong>{p("section5.objection")}:</strong>{" "}
              {p("section5.objectionDesc")}
            </li>
            <li>
              <strong>{p("section5.withdrawal")}:</strong>{" "}
              {p("section5.withdrawalDesc")}
            </li>
          </ul>
          <p>
            {p("section5.exercise")}{" "}
            <Link href="/contact">{p("section5.contactPage")}</Link>.
          </p>

          <h2>{p("section6.title")}</h2>
          <p>{p("section6.content1")}</p>
          <p>
            {p("section6.content2")}{" "}
            <Link href="/cookies">{p("section6.cookiePolicy")}</Link>.
          </p>

          <h2>{p("section7.title")}</h2>
          <p>{p("section7.intro")}</p>
          <ul>
            <li>{p("section7.item1")}</li>
            <li>{p("section7.item2")}</li>
            <li>{p("section7.item3")}</li>
            <li>{p("section7.item4")}</li>
          </ul>

          <h2>{p("section8.title")}</h2>
          <p>{p("section8.content")}</p>

          <h2>{p("section9.title")}</h2>
          <p>{p("section9.content")}</p>

          <h2>{p("section10.title")}</h2>
          <p>{p("section10.content")}</p>

          <h2>{p("section11.title")}</h2>
          <p>
            {p("section11.content")}{" "}
            <Link href="/contact">{p("section11.contactPage")}</Link>.
          </p>

          <div className="mt-12 rounded-lg border bg-muted/50 p-6">
            <h3 className="mt-0">{p("summary.title")}</h3>
            <ul className="mb-0">
              <li>✅ {p("summary.item1")}</li>
              <li>✅ {p("summary.item2")}</li>
              <li>✅ {p("summary.item3")}</li>
              <li>✅ {p("summary.item4")}</li>
              <li>✅ {p("summary.item5")}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
