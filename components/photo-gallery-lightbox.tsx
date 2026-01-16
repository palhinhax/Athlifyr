"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
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

interface PhotoGalleryLightboxProps {
  photo: Photo;
  currentIndex: number;
  totalPhotos: number;
  showConfirmDelete: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onDelete: (photoId: string) => void;
  onShowDeleteConfirm: () => void;
  onCancelDelete: () => void;
}

export function PhotoGalleryLightbox({
  photo,
  currentIndex,
  totalPhotos,
  showConfirmDelete,
  onClose,
  onPrevious,
  onNext,
  onDelete,
  onShowDeleteConfirm,
  onCancelDelete,
}: PhotoGalleryLightboxProps) {
  const t = useTranslations("profile");

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onPrevious();
      if (e.key === "ArrowRight" && currentIndex < totalPhotos - 1) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalPhotos, onClose, onPrevious, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="safe-area-inset-top flex items-center justify-between px-4 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
          <span className="text-sm font-medium">{t("close")}</span>
        </button>

        <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {totalPhotos}
        </div>

        {/* Empty div for spacing */}
        <div className="w-[100px]" />
      </div>

      {/* Main content area */}
      <div className="relative flex flex-1 items-center justify-center px-4">
        {/* Previous button */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        )}

        {/* Next button */}
        {currentIndex < totalPhotos - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
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
            src={photo.imageUrl}
            alt={photo.caption || "Foto"}
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
          {photo.caption && (
            <p className="mb-2 text-center text-white">{photo.caption}</p>
          )}
          <p className="text-center text-sm text-white/70">
            {formatDistanceToNow(new Date(photo.createdAt), {
              addSuffix: true,
              locale: pt,
            })}
          </p>
        </div>

        {/* Delete button */}
        {!showConfirmDelete ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDeleteConfirm();
            }}
            className="mx-auto flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">{t("deletePhoto")}</span>
          </button>
        ) : (
          <div
            className="mx-auto flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCancelDelete}
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {t("cancel")}
            </button>
            <button
              onClick={() => {
                onDelete(photo.id);
                onCancelDelete();
              }}
              className="flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-white transition-colors hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
              {t("confirm")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
