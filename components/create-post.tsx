"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ImagePlus, Video, X, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PostWithDetails {
  id: string;
  content: string;
  imageUrl: string | null;
  mediaType?: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface CreatePostProps {
  readonly eventId?: string;
  readonly venueId?: string;
  readonly onPostCreated?: (post?: PostWithDetails) => void;
  readonly userImage?: string | null;
  readonly userName?: string | null;
}

export function CreatePost({
  eventId,
  venueId,
  onPostCreated,
  userImage,
  userName,
}: CreatePostProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  // Use correct namespace based on context
  const t = useTranslations(venueId ? "venues.posts" : "events");
  const tAdmin = useTranslations("admin.posts.toast");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // General posts (no venue/event) are public by default, venue/event posts are private by default
  const [isPublic, setIsPublic] = useState(!eventId && !venueId);

  // Use props if provided, otherwise fall back to session
  const displayImage = userImage ?? session?.user?.image;
  const displayName = userName ?? session?.user?.name;

  // Determine placeholder text based on context
  const placeholderText =
    eventId || venueId ? t("sharePost") : t("sharePostFeed");

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    // Validate file type
    if (!isImage && !isVideo) {
      toast({
        title: tAdmin("invalidFileType"),
        description: "Apenas imagens e vídeos são permitidos",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: tAdmin("fileTooLarge"),
        description: isVideo
          ? "O vídeo não pode exceder 50MB"
          : tAdmin("fileTooLargeDesc"),
        variant: "destructive",
      });
      return;
    }

    setMediaFile(file);
    setMediaType(isVideo ? "video" : "image");

    // Create preview
    if (isVideo) {
      setMediaPreview(URL.createObjectURL(file));
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    if (mediaPreview && mediaType === "video") {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview("");
    setMediaUrl("");
    setMediaType("image");
  };

  const handleUploadMedia = async () => {
    if (!mediaFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", mediaFile);
      formData.append("folder", "posts");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload media");
      }

      const data = await response.json();
      const uploadedUrl = data.file?.url || data.url;

      if (!uploadedUrl) {
        throw new Error("Upload response missing URL");
      }

      setMediaUrl(uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: tAdmin("uploadError"),
        description: tAdmin("uploadErrorDesc"),
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: tAdmin("emptyContent"),
        description: tAdmin("emptyContentDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media first if exists
      let finalMediaUrl = mediaUrl;
      if (mediaFile && !mediaUrl) {
        console.log("Uploading media file:", mediaFile.name);
        finalMediaUrl = (await handleUploadMedia()) || "";
        console.log("Media upload result:", finalMediaUrl || "FAILED");

        // If media upload failed, don't proceed
        if (!finalMediaUrl && mediaFile) {
          toast({
            title: tAdmin("uploadError"),
            description: tAdmin("uploadErrorDesc"),
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Creating post with mediaUrl:", finalMediaUrl || "none");

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl: finalMediaUrl || undefined,
          mediaType: finalMediaUrl ? mediaType : undefined,
          eventId: eventId || undefined,
          venueId: venueId || undefined,
          isPublic: isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();

      // Reset form
      setContent("");
      setMediaFile(null);
      setMediaPreview("");
      setMediaUrl("");
      setMediaType("image");
      setIsPublic(!eventId && !venueId); // Reset: public for general posts, private for venue/event posts

      toast({
        title: tAdmin("postPublished"),
        description: tAdmin("postPublishedDesc"),
      });

      // Callback to refresh posts
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: tAdmin("publishError"),
        description: tAdmin("publishErrorDesc"),
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
    <div>
      <form onSubmit={handleSubmit}>
        {/* Composer header: avatar + input/placeholder */}
        <div className="flex gap-4">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={displayName || "User"}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                {displayName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholderText}
              className="min-h-[44px] w-full resize-none rounded-xl bg-muted/50 px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground/70 hover:bg-muted focus:min-h-[100px] focus:bg-muted/50 focus:outline-none focus:ring-0"
              disabled={isSubmitting || isUploading}
            />
          </div>
        </div>

        {/* Media Preview */}
        {mediaPreview && (
          <div className="relative mt-3 max-h-[500px] w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-muted/50 to-muted">
            {mediaType === "video" ? (
              <video
                src={mediaPreview}
                controls
                className="h-auto max-h-[500px] w-full object-contain"
              >
                <track kind="captions" srcLang="en" label="English" />
              </video>
            ) : (
              <Image
                src={mediaPreview}
                alt="Preview"
                width={600}
                height={600}
                className="h-auto max-h-[500px] w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <button
              type="button"
              onClick={handleRemoveMedia}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white shadow-lg transition-all hover:scale-110 hover:bg-black/90"
              disabled={isSubmitting || isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Actions bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Photo button */}
            <label htmlFor="post-media-photo">
              <input
                id="post-media-photo"
                type="file"
                accept="image/*"
                onChange={handleMediaSelect}
                className="hidden"
                disabled={isSubmitting || isUploading || !!mediaPreview}
              />
              <button
                type="button"
                disabled={isSubmitting || isUploading || !!mediaPreview}
                onClick={() =>
                  document.getElementById("post-media-photo")?.click()
                }
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <ImagePlus className="h-4 w-4 text-primary" />
                {t("addPhoto")}
              </button>
            </label>

            {/* Video button */}
            <label htmlFor="post-media-video">
              <input
                id="post-media-video"
                type="file"
                accept="video/*"
                onChange={handleMediaSelect}
                className="hidden"
                disabled={isSubmitting || isUploading || !!mediaPreview}
              />
              <button
                type="button"
                disabled={isSubmitting || isUploading || !!mediaPreview}
                onClick={() =>
                  document.getElementById("post-media-video")?.click()
                }
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <Video className="h-4 w-4 text-primary" />
                {t("addVideo")}
              </button>
            </label>

            {/* Public/Private Toggle */}
            {(venueId || eventId) && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                  disabled={isSubmitting || isUploading}
                />
                <Label
                  htmlFor="isPublic"
                  className="flex cursor-pointer items-center gap-1.5 text-sm font-normal"
                >
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {t("makePublic")}
                  </span>
                  {!isPublic && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({t("currentlyPrivate")})
                    </span>
                  )}
                </Label>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting || isUploading || (!content.trim() && !mediaFile)
            }
            className="rounded-xl bg-gradient-to-br from-primary to-primary/60 px-6 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-50"
          >
            {t("publish")}
          </button>
        </div>
      </form>
    </div>
  );
}
