"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bot, X, History, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAthliChat } from "@/hooks/use-athli-chat";
import { AthliMessageList } from "@/components/athli/athli-message-list";
import { AthliChatInput } from "@/components/athli/athli-chat-input";
import { AthliWelcome } from "@/components/athli/athli-welcome";
import { AthliConversationList } from "@/components/athli/athli-conversation-list";

// Pages where Athli should be hidden
const HIDDEN_ON_PATHS = ["/chat", "/admin"];

export function AthliFloatingChat() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations("athli");
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const {
    messages,
    conversations,
    conversationId,
    isLoading,
    sendMessage,
    loadConversation,
    startNewConversation,
    deleteConversation,
    saveProposedPlan,
    saveProposedWorkout,
  } = useAthliChat();

  const shouldHide = HIDDEN_ON_PATHS.some((path) => pathname.includes(path));

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setShowHistory(false);
  }, []);

  const handleSuggestionClick = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage]
  );

  const handleSelectConversation = useCallback(
    (id: string) => {
      loadConversation(id);
      setShowHistory(false);
    },
    [loadConversation]
  );

  const handleNewConversation = useCallback(() => {
    startNewConversation();
    setShowHistory(false);
  }, [startNewConversation]);

  // Don't render on hidden paths or if not logged in
  if (shouldHide || !session?.user) {
    return null;
  }

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-[420px] transform transition-all duration-300 ease-out sm:bottom-24 sm:right-6",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        )}
      >
        <div className="flex h-[min(75vh,560px)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {showHistory ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setShowHistory(false)}
                    aria-label={t("backToChat")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">Athli</p>
                  <p className="text-xs text-white/80">{t("subtitle")}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!showHistory && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setShowHistory(true)}
                    title={t("history")}
                    aria-label={t("history")}
                  >
                    <History className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={handleClose}
                  aria-label={t("close")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {showHistory ? (
            <AthliConversationList
              conversations={conversations}
              activeConversationId={conversationId}
              onSelect={handleSelectConversation}
              onNew={handleNewConversation}
              onDelete={deleteConversation}
            />
          ) : (
            <>
              {messages.length === 0 ? (
                <AthliWelcome onSuggestionClick={handleSuggestionClick} />
              ) : (
                <AthliMessageList
                  messages={messages}
                  isLoading={isLoading}
                  userImage={session.user.image}
                  onSavePlan={saveProposedPlan}
                  onSaveWorkout={saveProposedWorkout}
                />
              )}
              <AthliChatInput onSend={sendMessage} isLoading={isLoading} />
            </>
          )}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14",
          isOpen
            ? "rotate-90 bg-muted text-muted-foreground"
            : "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
        )}
        aria-label={isOpen ? t("close") : t("open")}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
}
