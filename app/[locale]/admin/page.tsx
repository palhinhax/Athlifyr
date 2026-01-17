"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, Mail, Instagram, Database } from "lucide-react";

// Lazy load admin components
const AdminEventsContent = lazy(() => import("./events/page"));
const AdminContactsContent = lazy(() => import("./contacts/page"));
const AdminMediaContent = lazy(() => import("./media/page"));
const AdminInstagramContent = lazy(() => import("./instagram/page"));

function AdminContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "events";

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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Gestão centralizada de eventos, contactos e conteúdo
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Eventos</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Mail className="h-4 w-4" />
            <span>Contactos</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Database className="h-4 w-4" />
            <span>Media</span>
          </TabsTrigger>
          <TabsTrigger value="instagram" className="gap-2">
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
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

        <TabsContent value="contacts" className="mt-6">
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

        <TabsContent value="media" className="mt-6">
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

        <TabsContent value="instagram" className="mt-6">
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
