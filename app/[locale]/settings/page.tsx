import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield, Trophy, Languages } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FavoriteSportsSelector } from "@/components/favorite-sports-selector";
import { LanguageSelector } from "@/components/language-selector";
import { getTranslations } from "@/lib/translations";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
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

  const locale = user.locale || "pt";
  const t = getTranslations(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">{t("settings.title")}</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              {t("settings.accountInfo")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.name")}
                  </p>
                  <p className="font-medium">
                    {user.name || t("settings.notDefined")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.email")}
                  </p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.role === "ADMIN" && (
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.role")}
                    </p>
                    <p className="font-medium text-primary">
                      {t("settings.administrator")}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 text-sm text-muted-foreground">
                {t("settings.accountCreated")}{" "}
                {new Date(user.createdAt).toLocaleDateString(
                  locale === "pt" ? "pt-PT" : "en-US",
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
              {t("settings.favoriteSports")}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("settings.favoriteSportsDescription")}
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
              {t("settings.language")}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("settings.languageDescription")}
            </p>
            <LanguageSelector currentLocale={locale} userId={user.id} />
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              {t("settings.privacy")}
            </h2>
            <p className="text-muted-foreground">
              {t("settings.privacyComingSoon")}
            </p>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              {t("settings.notifications")}
            </h2>
            <p className="text-muted-foreground">
              {t("settings.notificationsComingSoon")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
