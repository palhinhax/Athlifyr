"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  X,
  Loader2,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

interface VenueImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
  createdAt: string;
}

interface VenueGalleryProps {
  venueId: string;
  isOwner: boolean;
}

export function VenueGallery({ venueId, isOwner }: VenueGalleryProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const t = useTranslations("venues.gallery");

  const [images, setImages] = useState<VenueImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingCaption, setPendingCaption] = useState("");
  const [pendingImageUrl, setPendingImageUrl] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/venues/${venueId}/images`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Handle image upload
  const handleUploadComplete = (url: string) => {
    setPendingImageUrl(url);
  };

  // Save new image
  const handleSaveImage = async () => {
    if (!pendingImageUrl) return;

    setIsUploading(true);
    try {
      const res = await fetch(`/api/venues/${venueId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: pendingImageUrl,
          caption: pendingCaption || null,
        }),
      });

      if (res.ok) {
        toast({
          title: t("uploadSuccess"),
          description: t("imageAdded"),
        });
        setPendingImageUrl("");
        setPendingCaption("");
        setShowUploadDialog(false);
        fetchImages();
      } else {
        throw new Error("Failed to save image");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      toast({
        variant: "destructive",
        title: t("uploadError"),
        description: t("uploadErrorDesc"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId: string) => {
    setDeletingId(imageId);
    try {
      const res = await fetch(
        `/api/venues/${venueId}/images?imageId=${imageId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast({
          title: t("deleteSuccess"),
          description: t("imageDeleted"),
        });
        fetchImages();
        if (showLightbox && images.length <= 1) {
          setShowLightbox(false);
        } else if (currentIndex >= images.length - 1) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        variant: "destructive",
        title: t("deleteError"),
        description: t("deleteErrorDesc"),
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Navigate lightbox
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") setShowLightbox(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, goToPrevious, goToNext]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (images.length === 0 && !isOwner) {
    return null; // Don't show empty gallery to non-owners
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("title")}</h3>
        {isOwner && session && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploadDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("addImage")}
          </Button>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
          <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("noImages")}</p>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setShowUploadDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("addFirstImage")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
              onClick={() => {
                setCurrentIndex(index);
                setShowLightbox(true);
              }}
            >
              <Image
                src={image.imageUrl}
                alt={image.caption || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              {isOwner && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image.id);
                  }}
                  disabled={deletingId === image.id}
                >
                  {deletingId === image.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addImage")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {pendingImageUrl ? (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={pendingImageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setPendingImageUrl("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <ImageUpload
                id="venue-gallery-upload"
                folder="posts"
                onUploadComplete={(url) => handleUploadComplete(url)}
                buttonText={t("selectImage")}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="caption">{t("caption")}</Label>
              <Input
                id="caption"
                placeholder={t("captionPlaceholder")}
                value={pendingCaption}
                onChange={(e) => setPendingCaption(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setPendingImageUrl("");
                  setPendingCaption("");
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleSaveImage}
                disabled={!pendingImageUrl || isUploading}
              >
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {showLightbox && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setShowLightbox(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex].imageUrl}
              alt={images[currentIndex].caption || `Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            {images[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/60 p-4 text-center text-white">
                {images[currentIndex].caption}
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
