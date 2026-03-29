"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { AthliMessage } from "@/hooks/use-athli-chat";

interface AthliMessageBubbleProps {
  message: AthliMessage;
  userImage?: string | null;
  onSavePlan?: (messageId: string) => void;
  onSaveWorkout?: (messageId: string) => void;
  isSaving?: boolean;
}

export function AthliMessageBubble({
  message,
  userImage,
  onSavePlan,
  onSaveWorkout,
  isSaving,
}: AthliMessageBubbleProps) {
  const isUser = message.role === "user";
  const t = useTranslations("athli");

  return (
    <div
      className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      {isUser && userImage ? (
        <Image
          src={userImage}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
          )}
        >
          {isUser ? (
            <User className="h-3.5 w-3.5" />
          ) : (
            <Bot className="h-3.5 w-3.5" />
          )}
        </div>
      )}

      {/* Message */}
      <div className="max-w-[80%] space-y-2">
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted/80 text-foreground"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert [&_a]:text-primary [&_a]:underline [&_code]:text-xs [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-medium [&_li]:my-0.5 [&_ol]:my-1 [&_p]:my-1 [&_pre]:rounded-lg [&_pre]:bg-background/50 [&_pre]:p-2 [&_ul]:my-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Save Training Plan Button */}
        {message.planProposal && !message.planSaved && onSavePlan && (
          <Button
            onClick={() => onSavePlan(message.id)}
            disabled={isSaving}
            size="sm"
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
          >
            <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
            {t("savePlan")}
          </Button>
        )}

        {/* Save Workout Button */}
        {message.workoutProposal && !message.planSaved && onSaveWorkout && (
          <Button
            onClick={() => onSaveWorkout(message.id)}
            disabled={isSaving}
            size="sm"
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
          >
            <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
            {t("saveWorkout")}
          </Button>
        )}

        {/* Saved Confirmation */}
        {message.planSaved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            {message.proposalType === "workout"
              ? t("workoutSaved")
              : t("planSaved")}
          </div>
        )}
      </div>
    </div>
  );
}

interface AthliMessageListProps {
  messages: AthliMessage[];
  isLoading: boolean;
  userImage?: string | null;
  onSavePlan?: (messageId: string) => void;
  onSaveWorkout?: (messageId: string) => void;
}

export function AthliMessageList({
  messages,
  isLoading,
  userImage,
  onSavePlan,
  onSaveWorkout,
}: AthliMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
      {messages.map((msg) => (
        <AthliMessageBubble
          key={msg.id}
          message={msg}
          userImage={userImage}
          onSavePlan={onSavePlan}
          onSaveWorkout={onSaveWorkout}
          isSaving={isLoading}
        />
      ))}

      {isLoading && (
        <div className="flex gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div className="rounded-2xl bg-muted/80 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:0ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:150ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
