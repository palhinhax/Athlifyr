"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "athlifyr_cookie_consent";

export function CookieConsent() {
  const t = useTranslations("legal.cookieConsent");
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing banner slightly for better UX
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        essential: true,
        analytics: true,
        functional: true,
        timestamp: new Date().toISOString(),
      })
    );
    hideBanner();
    // Enable Google Analytics if present
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        essential: true,
        analytics: false,
        functional: false,
        timestamp: new Date().toISOString(),
      })
    );
    hideBanner();
    // Disable Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  const hideBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 p-4 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <Card className="mx-auto max-w-3xl border-2 bg-background p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <Cookie className="h-8 w-8 shrink-0 text-primary" />
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">{t("title")}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAcceptAll} size="sm">
                {t("acceptAll")}
              </Button>
              <Button
                onClick={handleAcceptEssential}
                variant="outline"
                size="sm"
              >
                {t("acceptEssential")}
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/cookies">{t("learnMore")}</Link>
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleAcceptEssential}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
