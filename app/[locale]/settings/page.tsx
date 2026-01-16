import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield, Trophy, Languages } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FavoriteSportsSelector } from "@/components/favorite-sports-selector";
import { LanguageSelector } from "@/components/language-selector";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      locale: true,
      createdAt: true,
      favoriteSports: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">{t("title")}</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">{t("accountInfo")}</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("name")}</p>
                  <p className="font-medium">{user.name || t("notDefined")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("email")}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.role === "ADMIN" && (
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("role")}</p>
                    <p className="font-medium text-primary">
                      {t("administrator")}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 text-sm text-muted-foreground">
                {t("accountCreated")}{" "}
                {new Date(user.createdAt).toLocaleDateString(
                  locale === "pt"
                    ? "pt-PT"
                    : locale === "de"
                      ? "de-DE"
                      : locale === "es"
                        ? "es-ES"
                        : locale === "fr"
                          ? "fr-FR"
                          : locale === "it"
                            ? "it-IT"
                            : "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </div>
            </div>
          </Card>

          {/* Favorite Sports */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Trophy className="h-6 w-6" />
              {t("favoriteSports")}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("favoriteSportsDescription")}
            </p>
            <FavoriteSportsSelector
              initialFavorites={user.favoriteSports}
              locale={locale}
            />
          </Card>

          {/* Language Settings */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Languages className="h-6 w-6" />
              {t("language")}
            </h2>
            <LanguageSelector currentLocale={locale} userId={user.id} />
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">{t("privacy")}</h2>
            <p className="text-muted-foreground">{t("privacyComingSoon")}</p>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              {t("notifications")}
            </h2>
            <p className="text-muted-foreground">
              {t("notificationsComingSoon")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
