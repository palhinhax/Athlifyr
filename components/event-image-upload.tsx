"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";

interface EventImageUploadProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export function EventImageUpload({
  imageUrl,
  onImageUrlChange,
}: EventImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("admin.events");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: t("toast.invalidFile"),
        description: t("toast.invalidFileDesc"),
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t("toast.fileTooLarge"),
        description: t("toast.fileTooLargeDesc", { size: "5" }),
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "events");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadRes.json();
      onImageUrlChange(uploadData.file.url);

      toast({
        title: t("toast.imageUploaded"),
        description: t("toast.imageUploadedDesc"),
      });
    } catch {
      toast({
        variant: "destructive",
        title: t("toast.uploadError"),
        description: t("toast.uploadErrorDesc"),
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="grid gap-2">
      <Label>{t("eventImageLabel")}</Label>
      {imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onImageUrlChange("")}
            className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-2 h-4 w-4" />
          )}
          {imageUrl ? t("actions.changeImage") : t("actions.uploadImage")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("imageUrlDirectLabel")}
      </p>
      <Input
        id="imageUrl"
        name="imageUrl"
        value={imageUrl}
        onChange={(e) => onImageUrlChange(e.target.value)}
        placeholder="https://..."
      />
    </div>
  );
}
