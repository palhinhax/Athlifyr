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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Calendar,
  User,
  ChevronDown,
  Loader2,
  Reply,
  Send,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

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

interface AdminContactCardProps {
  contact: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    createdAt: Date;
  };
  locale: string;
}

export function AdminContactCard({ contact, locale }: AdminContactCardProps) {
  const [status, setStatus] = useState(contact.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [adminName, setAdminName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("admin.contacts");

  const statusLabels: Record<string, string> = {
    pending: t("statusLabels.pending"),
    in_progress: t("statusLabels.in_progress"),
    resolved: t("statusLabels.resolved"),
    closed: t("statusLabels.closed"),
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/contact/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        router.refresh();
        toast({
          title: t("toast.statusUpdated"),
          description: t("toast.statusUpdatedDesc", {
            status: statusLabels[newStatus],
          }),
        });
      } else {
        toast({
          title: t("toast.error"),
          description: t("toast.updateError"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
      toast({
        title: t("toast.error"),
        description: t("toast.updateErrorOccurred"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast({
        title: t("toast.error"),
        description: t("toast.emptyMessage"),
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyMessage,
          adminName: adminName.trim() || undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: t("toast.emailSent"),
          description: t("toast.emailSentDesc", { email: contact.email }),
        });
        setIsReplyDialogOpen(false);
        setReplyMessage("");
        setAdminName("");
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: t("toast.sendError"),
          description: error.error || t("toast.sendErrorDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: t("toast.error"),
        description: t("toast.sendErrorOccurred"),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: t("toast.contactDeleted"),
          description: t("toast.contactDeletedDesc"),
        });
        setIsDeleteDialogOpen(false);
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: t("toast.deleteError"),
          description: error.error || t("toast.deleteErrorDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: t("toast.error"),
        description: t("toast.deleteErrorOccurred"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">{typeIcons[contact.type] || "📧"}</span>
              <h3 className="text-lg font-semibold">{contact.subject}</h3>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {contact.name}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(contact.createdAt).toLocaleDateString(
                  locale === "pt" ? "pt-PT" : "en-US",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReplyDialogOpen(true)}
            >
              <Reply className="mr-2 h-4 w-4" />
              {t("actions.reply")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("actions.delete")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${statusColors[status] || statusColors.pending}`}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span>{statusLabels[status] || statusLabels.pending}</span>
                  )}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  <span className="mr-2">🔴</span>
                  {t("statusLabels.pending")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("in_progress")}
                >
                  <span className="mr-2">🟠</span>
                  {t("statusLabels.in_progress")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("resolved")}
                >
                  <span className="mr-2">🟢</span>
                  {t("statusLabels.resolved")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("closed")}>
                  <span className="mr-2">⚫</span>
                  {t("statusLabels.closed")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md bg-muted p-4">
          <p className="whitespace-pre-wrap text-sm">{contact.message}</p>
        </div>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("replyDialog.title", { name: contact.name })}
            </DialogTitle>
            <DialogDescription>
              {t("replyDialog.description", {
                email: contact.email,
                subject: contact.subject,
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">
                {t("replyDialog.adminName")}
                <span className="ml-1 text-xs text-muted-foreground">
                  {t("replyDialog.adminNameHelp")}
                </span>
              </Label>
              <Input
                id="adminName"
                placeholder={t("replyDialog.adminNamePlaceholder")}
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replyMessage">
                {t("replyDialog.message")}{" "}
                <span className="text-destructive">
                  {t("replyDialog.required")}
                </span>
              </Label>
              <textarea
                id="replyMessage"
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t("replyDialog.messagePlaceholder")}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t("replyDialog.messageHelp")}
              </p>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="mb-1 font-semibold">
                {t("replyDialog.originalMessage")}
              </p>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {contact.message}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReplyDialogOpen(false);
                setReplyMessage("");
                setAdminName("");
              }}
              disabled={isSending}
            >
              {t("actions.cancel")}
            </Button>
            <Button onClick={handleSendReply} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("actions.sending")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("actions.send")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description", { name: contact.name })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-md bg-muted p-4">
              <p className="mb-2 text-sm font-semibold">
                {t("deleteDialog.subject")}: {contact.subject}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("deleteDialog.email")}: {contact.email}
              </p>
            </div>

            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm font-semibold text-destructive">
                {t("deleteDialog.warning")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("deleteDialog.warningDesc")}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("actions.deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("deleteDialog.confirmButton")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
