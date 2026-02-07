"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  User,
  Mail,
  Shield,
  Trophy,
  Languages,
  Database,
  CreditCard,
  Bell,
  Settings,
  Palette,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FavoriteSportsSelector } from "@/components/favorite-sports-selector";
import { LanguageSelector } from "@/components/language-selector";
import { AccountDataActions } from "@/components/account-data-actions";
import { SubscriptionsHistory } from "@/components/subscriptions-history";
import { NotificationSettings } from "@/components/notification-settings";
import { ThemeSelector } from "@/components/theme-selector";
import type { SportType } from "@prisma/client";

interface SettingsTabsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    favoriteSports: SportType[];
    emailVerified: Date | null;
    emailNotifications: boolean;
  };
  locale: string;
}

export function SettingsTabs({ user, locale }: SettingsTabsProps) {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "notifications" | "account"
  >("profile");

  const formatDate = (date: Date) => {
    const localeMap: Record<string, string> = {
      pt: "pt-PT",
      de: "de-DE",
      es: "es-ES",
      fr: "fr-FR",
      it: "it-IT",
      en: "en-US",
    };

    return new Date(date).toLocaleDateString(localeMap[locale] || "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) =>
        setActiveTab(
          v as "profile" | "preferences" | "notifications" | "account"
        )
      }
      className="w-full"
    >
      <TabsList className="mb-6 grid w-full grid-cols-4">
        <TabsTrigger
          value="profile"
          className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
        >
          <User className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{t("tabs.profile")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="preferences"
          className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{t("tabs.preferences")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
        >
          <Bell className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{t("tabs.notifications")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="account"
          className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
        >
          <Database className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{t("tabs.account")}</span>
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile" className="space-y-6">
        {/* Account Information */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">{t("accountInfo")}</h2>
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
              {t("accountCreated")} {formatDate(user.createdAt)}
            </div>
          </div>
        </Card>

        {/* Favorite Sports */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Trophy className="h-5 w-5" />
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
      </TabsContent>

      {/* Preferences Tab */}
      <TabsContent value="preferences" className="space-y-6">
        {/* Language Settings */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Languages className="h-5 w-5" />
            {t("language")}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("languageDescription")}
          </p>
          <LanguageSelector currentLocale={locale} userId={user.id} />
        </Card>

        {/* Theme Settings */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Palette className="h-5 w-5" />
            {t("theme")}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("themeDescription")}
          </p>
          <ThemeSelector />
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications" className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Bell className="h-5 w-5" />
            {t("notifications")}
          </h2>
          <NotificationSettings
            emailVerified={!!user.emailVerified}
            emailNotificationsEnabled={user.emailNotifications}
            userEmail={user.email}
          />
        </Card>
      </TabsContent>

      {/* Account Tab */}
      <TabsContent value="account" className="space-y-6">
        {/* Subscriptions History */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <CreditCard className="h-5 w-5" />
            {t("subscriptions.title")}
          </h2>
          <SubscriptionsHistory />
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Database className="h-5 w-5" />
            {t("privacy")}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {t("privacyDescription")}
          </p>
          <AccountDataActions />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
