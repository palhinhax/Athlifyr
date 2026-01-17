"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { AdminContactCard } from "@/components/admin-contact-card";
import { useLocale } from "next-intl";

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

export default function ContactsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const locale = useLocale();

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
            <AdminContactCard
              key={contact.id}
              contact={{
                ...contact,
                createdAt: new Date(contact.createdAt),
              }}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
}
