"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Camera, Loader2, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ProfileImageUploadProps {
  currentImage: string | null;
  userName: string | null;
  onImageUpdate?: (newImageUrl: string | null) => void;
}

export function ProfileImageUpload({
  currentImage,
  userName,
  onImageUpdate,
}: ProfileImageUploadProps) {
  const { update } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Ficheiro inválido",
        description: "Por favor seleciona uma imagem.",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ficheiro muito grande",
        description: "A imagem deve ter no máximo 5MB.",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profiles");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const uploadData = await uploadRes.json();
      const newImageUrl = uploadData.file.url;

      // Update profile with new image
      const profileRes = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: newImageUrl }),
      });

      if (!profileRes.ok) {
        throw new Error("Failed to update profile");
      }

      setImageUrl(newImageUrl);
      setPreviewUrl(null);

      // Update session
      await update({ image: newImageUrl });

      toast({
        title: "Foto atualizada!",
        description: "A tua foto de perfil foi alterada com sucesso.",
      });

      onImageUpdate?.(newImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setPreviewUrl(null);
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a foto.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: null }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove image");
      }

      setImageUrl(null);
      await update({ image: null });

      toast({
        title: "Foto removida",
        description: "A tua foto de perfil foi removida.",
      });

      onImageUpdate?.(null);
    } catch (error) {
      console.error("Error removing image:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a foto.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = previewUrl || imageUrl;

  return (
    <div className="relative flex flex-col items-center">
      {/* Profile Image */}
      <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={userName || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {/* Preview Cancel Button */}
        {previewUrl && !isUploading && (
          <button
            onClick={cancelPreview}
            className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-destructive-foreground shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-1.5"
        >
          <Camera className="h-4 w-4" />
          {imageUrl ? "Alterar" : "Adicionar"}
        </Button>

        {imageUrl && !previewUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
