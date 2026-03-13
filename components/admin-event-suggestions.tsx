"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminNoteCard } from "@/components/admin-note-card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export function AdminEventSuggestions() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notes");
      if (!res.ok) return;
      const data = await res.json();
      const eventNotes = (data.notes as AdminNote[]).filter(
        (n) => n.type === "EVENT"
      );
      setNotes(eventNotes);
      setPendingCount(eventNotes.filter((n) => n.status === "pending").length);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
      const wasPending = notes.find((n) => n.id === id)?.status === "pending";
      const delta = wasPending ? 1 : 0;
      setPendingCount((prev) =>
        status === "pending" ? prev + 1 : prev - delta
      );
    } catch {
      // silently fail
    }
  };

  const handleAdminNotesChange = async (id: string, adminNotes: string) => {
    try {
      const res = await fetch(`/api/admin/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) return;
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, adminNotes } : n))
      );
    } catch {
      // silently fail
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      const deleted = notes.find((n) => n.id === id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (deleted?.status === "pending") {
        setPendingCount((prev) => prev - 1);
      }
    } catch {
      // silently fail
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Sem sugestões de eventos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{notes.length} sugestões</span>
        {pendingCount > 0 && (
          <Badge variant="secondary">{pendingCount} pendentes</Badge>
        )}
      </div>
      <div className="grid gap-4">
        {notes.map((note) => (
          <AdminNoteCard
            key={note.id}
            note={note}
            onStatusChange={handleStatusChange}
            onAdminNotesChange={handleAdminNotesChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
