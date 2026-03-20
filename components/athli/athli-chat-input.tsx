"use client";

import { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AthliChatInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function AthliChatInput({
  onSend,
  isLoading,
  placeholder,
}: AthliChatInputProps) {
  const t = useTranslations("athli");
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await onSend(message);
  }, [input, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      // Auto-resize
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    },
    []
  );

  return (
    <div className="border-t bg-background/95 p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t("inputPlaceholder")}
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-xl border bg-muted/50 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          aria-label={t("send")}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
