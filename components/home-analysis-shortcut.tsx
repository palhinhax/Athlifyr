"use client";

import { useState } from "react";
import { Camera, Activity, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoAnalysisUpload } from "@/components/video-analysis-upload";
import { analyticsEvent } from "@/lib/analytics";
import * as Sentry from "@sentry/nextjs";

type AnalysisType = "motion" | "lift";

interface HomeAnalysisShortcutProps {
  title: string;
  description: string;
  motionTitle: string;
  motionDescription: string;
  liftTitle: string;
  liftDescription: string;
}

export function HomeAnalysisShortcut({
  title,
  description,
  motionTitle,
  motionDescription,
  liftTitle,
  liftDescription,
}: HomeAnalysisShortcutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    analyticsEvent("Homepage_Analysis_Shortcut_Click", {
      location: "hero_section",
    });
    Sentry.metrics.count("analysis_camera_click", 1, {
      attributes: { source: "homepage" },
    });
  };

  const handleSelectType = (type: AnalysisType) => {
    setAnalysisType(type);
    analyticsEvent("Homepage_Analysis_Type_Selected", {
      type,
    });
    Sentry.metrics.count("analysis_type_selected", 1, {
      attributes: { type, source: "homepage" },
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
      {/* Camera Button with "New" badge */}
      <Button
        variant="outline"
        size="lg"
        onClick={handleOpen}
        className="group relative gap-2 border-accent/30 bg-accent/5 px-6 hover:border-accent/50 hover:bg-accent/10"
      >
        <Camera className="h-5 w-5 text-accent transition-transform group-hover:scale-110" />
        <span className="font-medium">{title}</span>
      </Button>

      {/* Analysis Type Selection Dialog */}
      <Dialog open={isOpen && !analysisType} onOpenChange={handleCloseAll}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-accent" />
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
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
                  {motionTitle}
                </p>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  {motionDescription}
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
                  {liftTitle}
                </p>
                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                  {liftDescription}
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
            analyticsEvent("Homepage_Analysis_Success", {
              type: analysisType,
            });
            Sentry.metrics.count("analysis_completed", 1, {
              attributes: { type: analysisType, source: "homepage" },
            });
          }}
        />
      )}
    </>
  );
}
