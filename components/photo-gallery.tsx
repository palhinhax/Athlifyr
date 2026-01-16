"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { PhotoGalleryHeader } from "@/components/photo-gallery-header";
import { PhotoGalleryGrid } from "@/components/photo-gallery-grid";
import { PhotoGalleryEmptyState } from "@/components/photo-gallery-empty-state";
import { PhotoGalleryLightbox } from "@/components/photo-gallery-lightbox";
import { PhotoGalleryUploadModal } from "@/components/photo-gallery-upload-modal";

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
  const t = useTranslations("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  // Fetch photos
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

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: t("invalidFile"),
        description: t("pleaseSelectImage"),
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t("fileTooLarge"),
        description: t("maxFileSize"),
      });
      return;
    }

    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    setShowUploadModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cancel upload
  const cancelUpload = () => {
    if (pendingPreview) {
      URL.revokeObjectURL(pendingPreview);
    }
    setPendingFile(null);
    setPendingPreview(null);
    setShowUploadModal(false);
  };

  // Confirm upload
  const confirmUpload = async (caption: string) => {
    if (!pendingFile) return;

    setIsUploading(true);
    try {
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
        title: t("photoPublished"),
        description: t("photoPublishedDesc"),
      });

      if (pendingPreview) {
        URL.revokeObjectURL(pendingPreview);
      }
      setPendingFile(null);
      setPendingPreview(null);
      setShowUploadModal(false);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: t("publishError"),
        description: t("publishErrorDesc"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Delete photo
  const handleDeletePhoto = async (photoId: string) => {
    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        setSelectedPhoto(null);
        toast({
          title: t("photoDeleted"),
          description: t("photoDeletedDesc"),
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        variant: "destructive",
        title: t("deleteError"),
        description: t("deleteErrorDesc"),
      });
    }
  };

  // Lightbox navigation
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

  if (!session?.user) return null;

  return (
    <div className="mt-12">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <PhotoGalleryHeader
        photoCount={photos.length}
        isUploading={isUploading}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : photos.length === 0 ? (
        <PhotoGalleryEmptyState
          onUploadClick={() => fileInputRef.current?.click()}
        />
      ) : (
        <PhotoGalleryGrid photos={photos} onPhotoClick={openLightbox} />
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <PhotoGalleryLightbox
          photo={selectedPhoto}
          currentIndex={selectedIndex}
          totalPhotos={photos.length}
          showConfirmDelete={showConfirmDelete}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onDelete={handleDeletePhoto}
          onShowDeleteConfirm={() => setShowConfirmDelete(true)}
          onCancelDelete={() => setShowConfirmDelete(false)}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && pendingPreview && (
        <PhotoGalleryUploadModal
          preview={pendingPreview}
          isUploading={isUploading}
          onCancel={cancelUpload}
          onConfirm={confirmUpload}
        />
      )}
    </div>
  );
}
