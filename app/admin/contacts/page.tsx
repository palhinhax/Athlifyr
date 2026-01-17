import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { getTranslations } from "@/lib/translations";
import { AdminContactCard } from "@/components/admin-contact-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactsAdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Get user locale
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { locale: true },
  });

  const locale = user?.locale || "pt";
  const t = getTranslations(locale);

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: contacts.length,
    pending: contacts.filter((c) => c.status === "pending").length,
    inProgress: contacts.filter((c) => c.status === "in_progress").length,
    resolved: contacts.filter((c) => c.status === "resolved").length,
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{t("admin.contacts.title")}</h1>
        <p className="text-muted-foreground">
          {t("admin.contacts.description")}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">
            {t("admin.contacts.stats.total")}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-red-500">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">
            {t("admin.contacts.stats.pending")}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-orange-500">
            {stats.inProgress}
          </div>
          <div className="text-sm text-muted-foreground">
            {t("admin.contacts.stats.inProgress")}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-green-500">
            {stats.resolved}
          </div>
          <div className="text-sm text-muted-foreground">
            {t("admin.contacts.stats.resolved")}
          </div>
        </Card>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              {t("admin.contacts.noMessages")}
            </h3>
            <p className="text-muted-foreground">
              {t("admin.contacts.noMessagesDescription")}
            </p>
          </Card>
        ) : (
          contacts.map((contact) => (
            <AdminContactCard
              key={contact.id}
              contact={contact}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
}
