import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { AuthVideoBackground } from "@/components/auth/auth-video-background";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { success, error } = await searchParams;
  const t = await getTranslations({ locale, namespace: "verifyEmail" });

  const isSuccess = success === "true";
  const errorType = error as
    | "missing_params"
    | "invalid_token"
    | "expired_token"
    | "server_error"
    | undefined;

  return (
    <AuthVideoBackground>
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {isSuccess ? (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-green-600 dark:text-green-400">
                {t("success.title")}
              </h1>
              <p className="mb-6 text-muted-foreground">
                {t("success.description")}
              </p>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/settings">{t("success.goToSettings")}</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/feed">{t("success.goToFeed")}</Link>
                </Button>
              </div>
            </>
          ) : errorType === "expired_token" ? (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                <AlertCircle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {t("expired.title")}
              </h1>
              <p className="mb-6 text-muted-foreground">
                {t("expired.description")}
              </p>
              <Button className="w-full" asChild>
                <Link href="/settings">{t("expired.requestNew")}</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-red-600 dark:text-red-400">
                {t("error.title")}
              </h1>
              <p className="mb-6 text-muted-foreground">
                {errorType === "invalid_token"
                  ? t("error.invalidToken")
                  : errorType === "missing_params"
                    ? t("error.missingParams")
                    : t("error.serverError")}
              </p>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/settings">{t("error.tryAgain")}</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">{t("error.contactSupport")}</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </AuthVideoBackground>
  );
}
