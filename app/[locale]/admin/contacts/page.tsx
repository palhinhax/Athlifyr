import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Mail, Calendar, User, MessageSquare } from "lucide-react";
import { getTranslations } from "@/lib/translations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const typeIcons: Record<string, string> = {
  suggestion: "💡",
  bug: "🐛",
  question: "❓",
  feedback: "💬",
  other: "📧",
};

const statusColors: Record<string, string> = {
  pending: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  in_progress:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

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
            <Card key={contact.id} className="p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">
                      {typeIcons[contact.type] || "📧"}
                    </span>
                    <h3 className="text-lg font-semibold">{contact.subject}</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {contact.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(contact.createdAt).toLocaleDateString(
                        locale === "pt" ? "pt-PT" : "en-US",
                        {
                          day: "2-digit",
                          month: locale === "pt" ? "short" : "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[contact.status] || statusColors.pending}`}
                >
                  {t(`admin.contacts.status.${contact.status}`)}
                </span>
              </div>
              <div className="rounded-md bg-muted p-4">
                <p className="whitespace-pre-wrap text-sm">{contact.message}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
