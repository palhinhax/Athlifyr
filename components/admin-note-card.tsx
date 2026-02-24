"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  User,
  ChevronDown,
  Trash2,
  ExternalLink,
  StickyNote,
  Building2,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";

const typeIcons: Record<string, React.ReactNode> = {
  EVENT: <Calendar className="h-4 w-4" />,
  VENUE: <Building2 className="h-4 w-4" />,
  OTHER: <StickyNote className="h-4 w-4" />,
};

const typeColors: Record<string, string> = {
  EVENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  VENUE:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const statusColors: Record<string, string> = {
  pending: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  in_progress:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

interface AdminNoteUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface AdminNoteCardProps {
  note: {
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
  };
  onStatusChange: (id: string, status: string) => void;
  onAdminNotesChange: (id: string, adminNotes: string) => void;
  onDelete: (id: string) => void;
}

export function AdminNoteCard({
  note,
  onStatusChange,
  onAdminNotesChange,
  onDelete,
}: AdminNoteCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localAdminNotes, setLocalAdminNotes] = useState(note.adminNotes || "");
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("admin.notes");

  const statusLabels: Record<string, string> = {
    pending: t("statusLabels.pending"),
    in_progress: t("statusLabels.in_progress"),
    resolved: t("statusLabels.resolved"),
    dismissed: t("statusLabels.dismissed"),
  };

  const typeLabels: Record<string, string> = {
    EVENT: t("types.event"),
    VENUE: t("types.venue"),
    OTHER: t("types.other"),
  };

  const handleSaveNotes = () => {
    onAdminNotesChange(note.id, localAdminNotes);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
    setIsDeleteDialogOpen(false);
  };

  const createdDate = new Date(note.createdAt);

  return (
    <>
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className={typeColors[note.type]}>
                  <span className="mr-1">{typeIcons[note.type]}</span>
                  {typeLabels[note.type]}
                </Badge>
                <Badge
                  variant="secondary"
                  className={statusColors[note.status]}
                >
                  {statusLabels[note.status] || note.status}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold">{note.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {t("changeStatus")}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => onStatusChange(note.id, value)}
                      disabled={note.status === value}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Message */}
          <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm">
            {note.message}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{note.user.name || note.user.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {createdDate.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {note.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{note.location}</span>
              </div>
            )}
            {note.date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{note.date}</span>
              </div>
            )}
            {note.sportType && (
              <div className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                <span>{note.sportType}</span>
              </div>
            )}
            {note.url && (
              <a
                href={note.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>{t("externalLink")}</span>
              </a>
            )}
          </div>

          {/* Admin Notes */}
          <div className="border-t pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{t("internalNotes")}</span>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  {note.adminNotes ? t("editNotes") : t("addNotes")}
                </Button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={localAdminNotes}
                  onChange={(e) => setLocalAdminNotes(e.target.value)}
                  placeholder={t("notesPlaceholder")}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    {t("save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLocalAdminNotes(note.adminNotes || "");
                      setIsEditing(false);
                    }}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            ) : note.adminNotes ? (
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {note.adminNotes}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                {t("noInternalNotes")}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("deleteDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
