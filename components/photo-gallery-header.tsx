"use client";

import { Camera, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface PhotoGalleryHeaderProps {
  photoCount: number;
  isUploading: boolean;
  onUploadClick: () => void;
}

export function PhotoGalleryHeader({
  photoCount,
  isUploading,
  onUploadClick,
}: PhotoGalleryHeaderProps) {
  const t = useTranslations("profile");

  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <Camera className="h-6 w-6 text-primary" />
        {t("gallery")} ({photoCount})
      </h2>

      <Button onClick={onUploadClick} disabled={isUploading} className="gap-2">
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        {t("publishPhoto")}
      </Button>
    </div>
  );
}
