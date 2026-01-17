"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      } else {
        console.error("Failed to update contact status");
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
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
                <span>{statusLabels[status] || "Pendente"}</span>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
              <span className="mr-2">🔴</span>
              Pendente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
              <span className="mr-2">🟠</span>
              Em Progresso
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("resolved")}>
              <span className="mr-2">🟢</span>
              Resolvido
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("closed")}>
              <span className="mr-2">⚫</span>
              Fechado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md bg-muted p-4">
        <p className="whitespace-pre-wrap text-sm">{contact.message}</p>
      </div>
    </Card>
  );
}
