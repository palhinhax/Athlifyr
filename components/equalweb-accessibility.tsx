"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/**
 * EqualWeb Accessibility Widget
 * Only loads in production environment to provide accessibility features
 * for users with disabilities (screen readers, keyboard navigation, etc.)
 *
 * @see https://www.equalweb.com/
 */
export function EqualWebAccessibility() {
  const locale = useLocale();

  useEffect(() => {
    // Only load EqualWeb in production
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // Map locale to EqualWeb language codes
    const languageMap: Record<string, string> = {
      pt: "PT-PT",
      en: "EN",
      es: "ES",
      fr: "FR",
      de: "DE",
      it: "IT",
    };

    const menuLanguage = languageMap[locale] || "EN";

    // Configure EqualWeb
    (window as Window & { interdeal?: unknown }).interdeal = {
      get sitekey() {
        return "505a37fd962504e5b84ec96a71ab066a";
      },
      get domains() {
        return {
          js: "https://cdn.equalweb.com/",
          acc: "https://access.equalweb.com/",
        };
      },
      Position: "left",
      Menulang: menuLanguage,
      draggable: true,
      btnStyle: {
        vPosition: ["80%", "80%"],
        margin: ["0", "0"],
        scale: ["0.5", "0.5"],
        color: {
          main: "#6e7577",
          second: "#ffffff",
        },
        icon: {
          outline: false,
          outlineColor: "#ffffff",
          type: 12,
          shape: "circle",
        },
      },
    };

    // Load EqualWeb script
    const script = document.createElement("script");
    script.src = "https://cdn.equalweb.com/core/5.2.4/accessibility.js";
    script.defer = true;
    script.integrity =
      "sha512-EuBSvNEVtJiE0GAEIBk3f5CXEIRBX+My0TWG431iOl5KmATPwveYaUX8NftlPwBjDRsItN8g295hkfhsZoeJHQ==";
    script.crossOrigin = "anonymous";
    script.setAttribute("data-cfasync", "true");

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [locale]);

  return null; // This component doesn't render anything
}
