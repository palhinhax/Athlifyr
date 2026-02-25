"use client";

import { useState } from "react";
import { Camera, Activity, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as Sentry from "@sentry/nextjs";
import { VideoAnalysisUpload } from "@/components/video-analysis-upload";
import { analyticsEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";

type AnalysisType = "motion" | "lift";

export function AnalysisButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);
  const t = useTranslations("nav");

  const handleOpen = () => {
    setIsOpen(true);
    analyticsEvent("Topbar_Analysis_Click", {
      location: "topbar",
    });
    Sentry.metrics.count("analysis_camera_click", 1, {
      attributes: { source: "topbar" },
    });
  };

  const handleSelectType = (type: AnalysisType) => {
    setAnalysisType(type);
    analyticsEvent("Topbar_Analysis_Type_Selected", { type });
    Sentry.metrics.count("analysis_type_selected", 1, {
      attributes: { type, source: "topbar" },
    });
  };

  const handleCloseUpload = () => {
    setAnalysisType(null);
  };

  const handleCloseAll = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setAnalysisType(null);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpen}
              className="relative"
              aria-label={t("videoAnalysis")}
            >
              <Camera className="h-5 w-5" />
              <Badge
                variant="default"
                className="absolute -right-1.5 -top-1.5 h-4 min-w-0 bg-gradient-to-r from-orange-500 to-red-500 px-1 py-0 text-[8px] font-bold uppercase leading-none text-white shadow-sm"
              >
                {t("new")}
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("videoAnalysis")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Analysis Type Selection Dialog */}
      <Dialog open={isOpen && !analysisType} onOpenChange={handleCloseAll}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-accent" />
              {t("videoAnalysis")}
            </DialogTitle>
            <DialogDescription>
              {t("videoAnalysisDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {/* Motion Analysis Option */}
            <button
              onClick={() => handleSelectType("motion")}
              className="group flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-md dark:border-blue-900 dark:bg-blue-950/30 dark:hover:border-blue-700 dark:hover:bg-blue-950/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900 dark:text-blue-400">
                <Activity className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {t("motionAnalysis")}
                </p>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  {t("motionAnalysisDescription")}
                </p>
              </div>
            </button>

            {/* Lift Analysis Option */}
            <button
              onClick={() => handleSelectType("lift")}
              className="group flex items-start gap-4 rounded-lg border border-orange-200 bg-orange-50/50 p-4 text-left transition-all hover:border-orange-400 hover:bg-orange-50 hover:shadow-md dark:border-orange-900 dark:bg-orange-950/30 dark:hover:border-orange-700 dark:hover:bg-orange-950/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-transform group-hover:scale-110 dark:bg-orange-900 dark:text-orange-400">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  {t("liftAnalysis")}
                </p>
                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                  {t("liftAnalysisDescription")}
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Analysis Upload Dialog */}
      {analysisType && (
        <VideoAnalysisUpload
          type={analysisType}
          open={!!analysisType}
          onOpenChange={(open) => {
            if (!open) handleCloseUpload();
          }}
          onSuccess={() => {
            analyticsEvent("Topbar_Analysis_Success", {
              type: analysisType,
            });
            Sentry.metrics.count("analysis_completed", 1, {
              attributes: { type: analysisType, source: "topbar" },
            });
          }}
        />
      )}
    </>
  );
}

interface AnalysisMenuItemProps {
  onClick?: () => void;
}

/**
 * Analysis menu item for mobile navigation.
 * Renders as a nav link-style button with "New" badge.
 */
export function AnalysisMobileMenuItem({ onClick }: AnalysisMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);
  const t = useTranslations("nav");

  const handleOpen = () => {
    setIsOpen(true);
    analyticsEvent("MobileNav_Analysis_Click", {
      location: "mobile_nav",
    });
    Sentry.metrics.count("analysis_camera_click", 1, {
      attributes: { source: "mobile" },
    });
  };

  const handleSelectType = (type: AnalysisType) => {
    setAnalysisType(type);
    analyticsEvent("MobileNav_Analysis_Type_Selected", { type });
    Sentry.metrics.count("analysis_type_selected", 1, {
      attributes: { type, source: "mobile" },
    });
  };

  const handleCloseUpload = () => {
    setAnalysisType(null);
  };

  const handleCloseAll = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setAnalysisType(null);
    } else {
      // Dialog is opening — close the mobile menu overlay
      onClick?.();
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
      >
        <div className="flex items-center gap-3">
          <Camera className="h-4 w-4" />
          {t("videoAnalysis")}
        </div>
        <Badge
          variant="default"
          className="bg-gradient-to-r from-orange-500 to-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white"
        >
          {t("new")}
        </Badge>
      </button>

      {/* Analysis Type Selection Dialog */}
      <Dialog open={isOpen && !analysisType} onOpenChange={handleCloseAll}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-accent" />
              {t("videoAnalysis")}
            </DialogTitle>
            <DialogDescription>
              {t("videoAnalysisDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <button
              onClick={() => handleSelectType("motion")}
              className="group flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-md dark:border-blue-900 dark:bg-blue-950/30 dark:hover:border-blue-700 dark:hover:bg-blue-950/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900 dark:text-blue-400">
                <Activity className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {t("motionAnalysis")}
                </p>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  {t("motionAnalysisDescription")}
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelectType("lift")}
              className="group flex items-start gap-4 rounded-lg border border-orange-200 bg-orange-50/50 p-4 text-left transition-all hover:border-orange-400 hover:bg-orange-50 hover:shadow-md dark:border-orange-900 dark:bg-orange-950/30 dark:hover:border-orange-700 dark:hover:bg-orange-950/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-transform group-hover:scale-110 dark:bg-orange-900 dark:text-orange-400">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  {t("liftAnalysis")}
                </p>
                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                  {t("liftAnalysisDescription")}
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Analysis Upload Dialog */}
      {analysisType && (
        <VideoAnalysisUpload
          type={analysisType}
          open={!!analysisType}
          onOpenChange={(open) => {
            if (!open) handleCloseUpload();
          }}
          onSuccess={() => {
            analyticsEvent("MobileNav_Analysis_Success", {
              type: analysisType,
            });
            Sentry.metrics.count("analysis_completed", 1, {
              attributes: { type: analysisType, source: "mobile" },
            });
          }}
        />
      )}
    </>
  );
}
