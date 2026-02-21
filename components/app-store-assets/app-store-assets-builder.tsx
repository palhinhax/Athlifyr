"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smartphone, Tablet } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Platform } from "@/types/app-store-assets";
import { AssetDesigner } from "./asset-designer";
import { ImageResizer } from "./image-resizer";

/**
 * Root component for the App Store Assets Builder tab.
 * Provides a platform picker (Google Play / iOS) and two modes:
 *   1. Design mode – build promotional images with device mockups & text
 *   2. Resize mode – drop an existing image and export to required dimensions
 */
export function AppStoreAssetsBuilder() {
  const t = useTranslations("admin.appStoreAssets");
  const [platform, setPlatform] = useState<Platform>("google");
  const [mode, setMode] = useState<"design" | "resize">("design");

  const handlePlatformChange = useCallback((value: string) => {
    setPlatform(value as Platform);
  }, []);

  const handleModeChange = useCallback((value: string) => {
    setMode(value as "design" | "resize");
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform selector */}
          <Tabs value={platform} onValueChange={handlePlatformChange}>
            <TabsList className="w-full">
              <TabsTrigger value="google" className="flex-1 gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.5 12.92 20.16 13.19L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"
                    fill="currentColor"
                  />
                </svg>
                {t("platforms.google")}
              </TabsTrigger>
              <TabsTrigger value="ios" className="flex-1 gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.81 11.78 5.72 12.57 5.72C13.36 5.72 14.85 4.62 16.42 4.81C17.09 4.84 18.98 5.09 20.2 6.89C20.09 6.95 17.63 8.42 17.66 11.42C17.7 15 20.79 16.12 20.82 16.14C20.8 16.19 20.31 17.94 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
                    fill="currentColor"
                  />
                </svg>
                {t("platforms.ios")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mode selector */}
          <Tabs value={mode} onValueChange={handleModeChange}>
            <TabsList className="w-full">
              <TabsTrigger value="design" className="flex-1 gap-2">
                <Tablet className="h-4 w-4" />
                {t("modes.design")}
              </TabsTrigger>
              <TabsTrigger value="resize" className="flex-1 gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M15 4v7h5" />
                  <path d="M4 15h7v5" />
                </svg>
                {t("modes.resize")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Content area */}
      {mode === "design" ? (
        <AssetDesigner platform={platform} />
      ) : (
        <ImageResizer platform={platform} />
      )}
    </div>
  );
}
