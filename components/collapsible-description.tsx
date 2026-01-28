"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface CollapsibleDescriptionProps {
  description: string;
  maxHeight?: number; // in pixels
}

// Custom image component for markdown with lightbox
function MarkdownImage({
  src,
  alt,
  onImageClick,
}: {
  src?: string;
  alt?: string;
  onImageClick: (src: string, alt: string) => void;
}) {
  if (!src) return null;

  return (
    <span className="my-4 block">
      <Image
        src={src}
        alt={alt || "Image"}
        width={800}
        height={450}
        className="cursor-pointer rounded-lg object-cover transition-transform hover:scale-[1.02]"
        style={{ width: "100%", height: "auto", maxHeight: "400px" }}
        onClick={() => onImageClick(src, alt || "Image")}
        unoptimized={src.startsWith("http")}
      />
      {alt && alt !== "Image" && (
        <span className="mt-2 block text-center text-sm text-muted-foreground">
          {alt}
        </span>
      )}
    </span>
  );
}

// Lightbox component for viewing images
function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="max-h-[90vh] w-auto rounded-lg object-contain"
          unoptimized={src.startsWith("http")}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

export function CollapsibleDescription({
  description,
  maxHeight = 300,
}: CollapsibleDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const t = useTranslations("common");

  const handleImageClick = (src: string, alt: string) => {
    setLightboxImage({ src, alt });
  };

  // Check if description needs collapsing (more than ~400 characters or multiple paragraphs)
  const needsCollapsing =
    description.length > 400 || description.split("\n\n").length > 3;

  const markdownComponents = {
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <MarkdownImage src={src} alt={alt} onImageClick={handleImageClick} />
    ),
  };

  if (!needsCollapsing) {
    return (
      <>
        <div className="prose prose-slate dark:prose-invert max-w-none overflow-x-hidden break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {description}
          </ReactMarkdown>
        </div>
        {lightboxImage && (
          <ImageLightbox
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClose={() => setLightboxImage(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "" : "relative"
        }`}
        style={{
          maxHeight: isExpanded ? "none" : `${maxHeight}px`,
        }}
      >
        <div className="prose prose-slate dark:prose-invert max-w-none overflow-x-hidden break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {description}
          </ReactMarkdown>
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <>
              {t("showLess")}
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              {t("showMore")}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
