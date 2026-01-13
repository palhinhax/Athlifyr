"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Loader2, Camera } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

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

interface PublicPhotoGalleryProps {
  userId: string;
}

export function PublicPhotoGallery({ userId }: PublicPhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/photos?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
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

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Camera className="h-6 w-6 text-primary" />
          Galeria
        </h2>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return null; // Don't show the section if there are no photos
  }

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Camera className="h-6 w-6 text-primary" />
          Galeria ({photos.length})
        </h2>
      </div>

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
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </button>
        ))}
      </div>

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

          {/* Bottom info */}
          <div className="safe-area-inset-bottom px-4 py-4">
            {/* Caption and date */}
            <div className="mx-auto max-w-lg rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
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
          </div>
        </div>
      )}
    </div>
  );
}
