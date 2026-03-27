"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Bot,
  Calendar,
  Mail,
  Instagram,
  Database,
  Building2,
  Users,
  Flag,
  Dumbbell,
  Bug,
  Smartphone,
  Gift,
  MessageCircle,
  StickyNote,
  Apple,
  Coins,
  Globe,
  Share2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { AdminPushDebug } from "@/components/admin/admin-push-debug";

// Lazy load admin components
const AdminEventsContent = lazy(() => import("./events/page"));
const AdminContactsContent = lazy(() => import("./contacts/page"));
const AdminMediaContent = lazy(() => import("./media/page"));
const AdminInstagramContent = lazy(() => import("./instagram/page"));
const AdminVenuesContent = lazy(() => import("./venues/page"));
const AdminUsersContent = lazy(() => import("./users/page"));
const AdminReportsContent = lazy(() => import("./reports/page"));
const AdminExercisesContent = lazy(() => import("./exercises/page"));
const AdminAppStoreAssetsContent = lazy(
  () => import("./app-store-assets/page")
);
const AdminGiveawaysContent = lazy(() => import("./giveaways/page"));
const AdminPostsContent = lazy(() => import("./posts/page"));
const AdminNotesContent = lazy(() => import("./notes/page"));
const AdminConversationsContent = lazy(() => import("./conversations/page"));
const AdminAppleSettingsContent = lazy(() => import("./apple-settings/page"));
const AdminCreditsContent = lazy(() => import("./credits/page"));
const AdminScrapingContent = lazy(() => import("./scraping/page"));
const AdminSocialContent = lazy(() => import("./social/page"));

function AdminContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "events";
  const t = useTranslations("admin.dashboard");
  const locale = useLocale();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  const handleTabChange = (value: string) => {
    router.push(`/${locale}/admin?tab=${value}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="mb-6">
          <TabsList className="flex h-auto flex-wrap gap-1 p-1">
            <TabsTrigger
              value="events"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.events")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="venues"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.venues")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Users className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.users")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.posts")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.contacts")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Database className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.media")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="instagram"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Instagram className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.instagram")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="exercises"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Dumbbell className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.exercises")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Flag className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.reports")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="app-store-assets"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">
                {t("tabs.appStoreAssets")}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="debug"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Bug className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Debug</span>
            </TabsTrigger>
            <TabsTrigger
              value="giveaways"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Gift className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.giveaways")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <StickyNote className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.notes")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="conversations"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Bot className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">
                {t("tabs.conversations")}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="apple-settings"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Apple className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">
                {t("tabs.appleSettings")}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="credits"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Coins className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.credits")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="scraping"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.scraping")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="flex-1 gap-1.5 px-2.5 py-1.5 sm:px-3"
            >
              <Share2 className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.social")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="events">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminEventsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="venues">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminVenuesContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="users">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminUsersContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="posts">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminPostsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="contacts">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminContactsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="media">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminMediaContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="instagram">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminInstagramContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="exercises">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminExercisesContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="reports">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminReportsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="app-store-assets">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminAppStoreAssetsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="debug">
          <div className="space-y-4">
            <AdminPushDebug />
          </div>
        </TabsContent>

        <TabsContent value="giveaways">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminGiveawaysContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="notes">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminNotesContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="conversations">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminConversationsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="apple-settings">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminAppleSettingsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="credits">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminCreditsContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="scraping">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminScrapingContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="social">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <AdminSocialContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
