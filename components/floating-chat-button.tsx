"use client";

import { useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function FloatingChatButton() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Close handler - reset form after animation
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Reset form after animation completes
    setTimeout(() => {
      setFormKey((prev) => prev + 1);
    }, 300);
  }, []);

  return (
    <>
      {/* Chat Popup */}
      <div
        className={cn(
          "fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-[380px] transform transition-all duration-300 ease-out sm:bottom-24 sm:right-6",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        )}
      >
        <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("contact.title")}</h3>
                  <p className="text-xs text-primary-foreground/80">
                    {t("contact.footer.responseTime")}{" "}
                    {t("contact.footer.hours")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:max-h-[400px]">
            <ContactForm
              key={formKey}
              compact
              showSubject={false}
              showInlineSuccess
              onSuccess={handleClose}
            />
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14",
          isOpen && "rotate-90 bg-muted text-muted-foreground"
        )}
        aria-label={isOpen ? t("common.close") : t("contact.title")}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
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
