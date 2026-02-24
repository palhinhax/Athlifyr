"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StickyNote, Loader2 } from "lucide-react";
import { AdminNoteCard } from "@/components/admin-note-card";
import { useTranslations } from "next-intl";

interface AdminNoteUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface AdminNote {
  id: string;
  userId: string;
  type: "EVENT" | "VENUE" | "OTHER";
  title: string;
  message: string;
  location: string | null;
  date: string | null;
  sportType: string | null;
  url: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  user: AdminNoteUser;
}

interface NoteStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  dismissed: number;
  byType: {
    event: number;
    venue: number;
    other: number;
  };
}

export default function AdminNotesPage() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [stats, setStats] = useState<NoteStats | null>(null);
  const t = useTranslations("admin.notes");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/notes");
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data.notes);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update note");
      const data = await response.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? data.note : n)));
      // Update stats
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleAdminNotesChange = async (id: string, adminNotes: string) => {
    try {
      const response = await fetch(`/api/admin/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!response.ok) throw new Error("Failed to update note");
      const data = await response.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? data.note : n)));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n.id !== id));
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
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
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">
              {t("stats.total")}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {stats.pending}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("stats.pending")}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-500">
              {stats.inProgress}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("stats.inProgress")}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {stats.resolved}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("stats.resolved")}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-400">
              {stats.dismissed}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("stats.dismissed")}
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card className="p-12 text-center">
            <StickyNote className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">{t("noNotes")}</h3>
            <p className="text-muted-foreground">{t("noNotesDescription")}</p>
          </Card>
        ) : (
          notes.map((note) => (
            <AdminNoteCard
              key={note.id}
              note={note}
              onStatusChange={handleStatusChange}
              onAdminNotesChange={handleAdminNotesChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
