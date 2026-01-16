"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface PhotoGalleryUploadModalProps {
  preview: string;
  isUploading: boolean;
  onCancel: () => void;
  onConfirm: (caption: string) => Promise<void>;
}

export function PhotoGalleryUploadModal({
  preview,
  isUploading,
  onCancel,
  onConfirm,
}: PhotoGalleryUploadModalProps) {
  const t = useTranslations("profile");
  const [caption, setCaption] = useState("");

  const handleConfirm = async () => {
    await onConfirm(caption);
    setCaption("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-xl font-semibold">{t("publishPhoto")}</h3>

        {/* Preview */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={preview}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 512px"
            className="object-contain"
          />
        </div>

        {/* Caption input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            {t("photoCaption")}
          </label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={t("addPhoto")}
            maxLength={200}
            disabled={isUploading}
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {caption.length}/200
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isUploading}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isUploading}
            className="flex-1 gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {t("publish")}
          </Button>
        </div>
      </div>
    </div>
  );
}
