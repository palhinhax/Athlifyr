"use client";

import { Camera, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface PhotoGalleryEmptyStateProps {
  onUploadClick: () => void;
}

export function PhotoGalleryEmptyState({
  onUploadClick,
}: PhotoGalleryEmptyStateProps) {
  const t = useTranslations("profile");

  return (
    <Card className="p-12 text-center">
      <Camera className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">{t("noPhotosYet")}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {t("shareTrainingMoments")}
      </p>
      <Button onClick={onUploadClick} variant="outline" className="gap-2">
        <ImagePlus className="h-4 w-4" />
        {t("publishFirstPhoto")}
      </Button>
    </Card>
  );
}
