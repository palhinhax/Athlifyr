"use client";

import { useTranslations } from "next-intl";
import { MessageSquarePlus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
  messages: { content: string }[];
}

interface AthliConversationListProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function AthliConversationList({
  conversations,
  activeConversationId,
  onSelect,
  onNew,
  onDelete,
}: AthliConversationListProps) {
  const t = useTranslations("athli");

  return (
    <div className="flex flex-col border-r">
      <div className="flex items-center justify-between border-b p-2.5">
        <span className="text-xs font-medium text-muted-foreground">
          {t("conversations")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onNew}
          title={t("newConversation")}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              {t("noConversations")}
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex cursor-pointer items-center gap-1.5 border-b px-2.5 py-2 transition-colors hover:bg-muted/50",
                activeConversationId === conv.id && "bg-muted"
              )}
              onClick={() => onSelect(conv.id)}
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-xs">
                {conv.title ||
                  conv.messages[0]?.content?.substring(0, 40) ||
                  t("newConversation")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
