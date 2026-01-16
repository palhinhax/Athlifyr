"use client";

import Image from "next/image";

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

interface PhotoGalleryGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo, index: number) => void;
}

export function PhotoGalleryGrid({
  photos,
  onPhotoClick,
}: PhotoGalleryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:grid-cols-4 lg:grid-cols-5">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          onClick={() => onPhotoClick(photo, index)}
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
  );
}
