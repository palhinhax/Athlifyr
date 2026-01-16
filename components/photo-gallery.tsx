"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  ImagePlus,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Camera,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { useTranslations } from "next-intl";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export function PhotoGallery() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchPhotos();
    }
  }, [session, fetchPhotos]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Ficheiro inválido",
        description: "Por favor seleciona uma imagem.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ficheiro muito grande",
        description: "A imagem deve ter no máximo 5MB.",
      });
      return;
    }

    // Show upload modal with preview
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    setCaption("");
    setShowUploadModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelUpload = () => {
    if (pendingPreview) {
      URL.revokeObjectURL(pendingPreview);
    }
    setPendingFile(null);
    setPendingPreview(null);
    setCaption("");
    setShowUploadModal(false);
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;

    setIsUploading(true);
    try {
      // Upload to B2
      const formData = new FormData();
      formData.append("file", pendingFile);
      formData.append("folder", "profiles");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadRes.json();

      // Create photo record with caption
      const photoRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.file.url,
          caption: caption.trim() || null,
        }),
      });

      if (!photoRes.ok) {
        throw new Error("Failed to save photo");
      }

      const newPhoto = await photoRes.json();
      setPhotos((prev) => [newPhoto, ...prev]);

      toast({
        title: "Foto publicada!",
        description: "A tua foto foi adicionada à galeria.",
      });

      // Clean up
      if (pendingPreview) {
        URL.revokeObjectURL(pendingPreview);
      }
      setPendingFile(null);
      setPendingPreview(null);
      setCaption("");
      setShowUploadModal(false);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível publicar a foto.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        setSelectedPhoto(null);
        toast({
          title: "Foto eliminada",
          description: "A foto foi removida da galeria.",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível eliminar a foto.",
      });
    }
  };

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setShowConfirmDelete(false);
  };

  const goToPrevious = useCallback(() => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  }, [selectedIndex, photos]);

  const goToNext = useCallback(() => {
    if (selectedIndex < photos.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  }, [selectedIndex, photos]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, goToPrevious, goToNext]);

  if (!session?.user) return null;

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Camera className="h-6 w-6 text-primary" />
          Galeria ({photos.length})
        </h2>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            Publicar Foto
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : photos.length === 0 ? (
        <Card className="p-12 text-center">
          <Camera className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            {t("profile.noPhotosYet")}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("profile.shareTrainingMoments")}
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            {t("profile.publishFirstPhoto")}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:grid-cols-4 lg:grid-cols-5">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => openLightbox(photo, index)}
              className="group relative aspect-square overflow-hidden rounded-md bg-muted"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption || "Foto"}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={closeLightbox}
        >
          {/* Top bar - only close button */}
          <div className="safe-area-inset-top flex items-center justify-between px-4 py-3">
            <button
              onClick={closeLightbox}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
              <span className="text-sm font-medium">Fechar</span>
            </button>

            <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {selectedIndex + 1} / {photos.length}
            </div>

            {/* Empty div for spacing */}
            <div className="w-[100px]" />
          </div>

          {/* Main content area */}
          <div className="relative flex flex-1 items-center justify-center px-4">
            {/* Previous button */}
            {selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            )}

            {/* Next button */}
            {selectedIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-4"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            )}

            {/* Image */}
            <div
              className="relative flex max-h-[calc(100vh-220px)] w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption || "Foto"}
                width={1200}
                height={800}
                className="max-h-[calc(100vh-220px)] w-auto rounded-lg object-contain"
              />
            </div>
          </div>

          {/* Bottom info and delete button */}
          <div className="safe-area-inset-bottom px-4 py-4">
            {/* Caption and date */}
            <div className="mx-auto mb-4 max-w-lg rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              {selectedPhoto.caption && (
                <p className="mb-2 text-center text-white">
                  {selectedPhoto.caption}
                </p>
              )}
              <p className="text-center text-sm text-white/70">
                {formatDistanceToNow(new Date(selectedPhoto.createdAt), {
                  addSuffix: true,
                  locale: pt,
                })}
              </p>
            </div>

            {/* Delete button - at the bottom, separate from close */}
            {!showConfirmDelete ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(true);
                }}
                className="mx-auto flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm">Apagar foto</span>
              </button>
            ) : (
              <div
                className="mx-auto flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    handleDeletePhoto(selectedPhoto.id);
                    setShowConfirmDelete(false);
                  }}
                  className="flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-white transition-colors hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && pendingPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={cancelUpload}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-xl font-semibold">Publicar Foto</h3>

            {/* Preview */}
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={pendingPreview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-contain"
              />
            </div>

            {/* Caption input */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Descrição (opcional)
              </label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Adiciona uma descrição à tua foto..."
                maxLength={200}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {caption.length}/200
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={cancelUpload}
                disabled={isUploading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmUpload}
                disabled={isUploading}
                className="flex-1 gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                Publicar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
