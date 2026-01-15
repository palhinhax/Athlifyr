"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ImagePlus, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CreatePostProps {
  eventId?: string;
  onPostCreated?: () => void;
}

export function CreatePost({ eventId, onPostCreated }: CreatePostProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const t = useTranslations("events");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de ficheiro inválido",
        description: "Seleciona uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ficheiro muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("folder", "posts");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      const uploadedUrl = data.file?.url || data.url;

      if (!uploadedUrl) {
        throw new Error("Upload response missing URL");
      }

      setImageUrl(uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro ao enviar imagem",
        description: "Não foi possível enviar a imagem",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Escreve algo antes de publicar",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image first if exists
      let finalImageUrl = imageUrl;
      if (imageFile && !imageUrl) {
        console.log("Uploading image file:", imageFile.name);
        finalImageUrl = (await handleUploadImage()) || "";
        console.log("Image upload result:", finalImageUrl || "FAILED");

        // If image upload failed, don't proceed
        if (!finalImageUrl && imageFile) {
          toast({
            title: "Erro ao enviar imagem",
            description: "Não foi possível enviar a imagem. Tenta novamente.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Creating post with imageUrl:", finalImageUrl || "none");

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl: finalImageUrl || undefined,
          eventId: eventId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      // Reset form
      setContent("");
      setImageFile(null);
      setImagePreview("");
      setImageUrl("");

      toast({
        title: "✅ Post publicado!",
        description: "O teu post foi publicado com sucesso",
      });

      // Callback to refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Erro ao publicar",
        description: "Não foi possível publicar o post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 flex items-start gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={eventId ? t("sharePost") : t("sharePostFeed")}
            className="min-h-[80px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isSubmitting || isUploading}
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted">
            <div className="relative aspect-square w-full">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white shadow-lg transition-all hover:scale-110 hover:bg-black/90"
              disabled={isSubmitting || isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="post-image">
              <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isSubmitting || isUploading || !!imagePreview}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSubmitting || isUploading || !!imagePreview}
                onClick={() => document.getElementById("post-image")?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                {t("addPhoto")}
              </Button>
            </label>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={
              isSubmitting || isUploading || (!content.trim() && !imageFile)
            }
          >
            {isSubmitting || isUploading ? (
              t("publish")
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t("publish")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
