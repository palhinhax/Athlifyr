"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Calendar,
  Mail,
  Instagram,
  Database,
  Building2,
  Users,
  Flag,
} from "lucide-react";
import { useTranslations } from "next-intl";

// Lazy load admin components
const AdminEventsContent = lazy(() => import("./events/page"));
const AdminContactsContent = lazy(() => import("./contacts/page"));
const AdminMediaContent = lazy(() => import("./media/page"));
const AdminInstagramContent = lazy(() => import("./instagram/page"));
const AdminVenuesContent = lazy(() => import("./venues/page"));
const AdminUsersContent = lazy(() => import("./users/page"));
const AdminReportsContent = lazy(() => import("./reports/page"));

function AdminContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "events";
  const t = useTranslations("admin.dashboard");

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
    router.push(`/admin?tab=${value}`);
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
        <div className="mb-6 overflow-x-auto">
          <TabsList className="h-auto w-full">
            <TabsTrigger value="events" className="flex-1 gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.events")}</span>
            </TabsTrigger>
            <TabsTrigger value="venues" className="flex-1 gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.venues")}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.users")}</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex-1 gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.contacts")}</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1 gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.media")}</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex-1 gap-2">
              <Instagram className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.instagram")}</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.reports")}</span>
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
