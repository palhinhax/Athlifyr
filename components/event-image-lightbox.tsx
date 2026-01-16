"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface EventImageLightboxProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export function EventImageLightbox({
  imageUrl,
  title,
  onClose,
}: EventImageLightboxProps) {
  const t = useTranslations("common");

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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

        {/* Empty div for spacing */}
        <div className="w-[100px]" />
      </div>

      {/* Main content area */}
      <div className="relative flex flex-1 items-center justify-center px-4">
        {/* Image */}
        <div
          className="relative flex max-h-[calc(100vh-150px)] w-full items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={imageUrl}
            alt={title}
            width={1600}
            height={900}
            className="max-h-[calc(100vh-150px)] w-auto rounded-lg object-contain"
          />
        </div>
      </div>

      {/* Bottom info */}
      <div className="safe-area-inset-bottom px-4 py-4">
        <div className="mx-auto max-w-lg rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-center text-white">{title}</p>
        </div>
      </div>
    </div>
  );
}
