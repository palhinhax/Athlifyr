"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Calendar, User, MessageSquare, Loader2 } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

interface ContactStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

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

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em Progresso",
  resolved: "Resolvido",
  closed: "Fechado",
};

export default function ContactsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data.contacts);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contactos</h2>
        <p className="text-muted-foreground">
          Gere todas as mensagens de contacto recebidas
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {stats.pending}
            </div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-500">
              {stats.inProgress}
            </div>
            <div className="text-sm text-muted-foreground">Em Progresso</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {stats.resolved}
            </div>
            <div className="text-sm text-muted-foreground">Resolvidos</div>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Nenhuma mensagem</h3>
            <p className="text-muted-foreground">
              Quando receber mensagens, elas aparecerão aqui
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
                      {new Date(contact.createdAt).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[contact.status] || statusColors.pending}`}
                >
                  {statusLabels[contact.status] || contact.status}
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
