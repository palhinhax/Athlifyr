"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  folder?: "profiles" | "posts" | "events";
  onUploadComplete: (url: string, fileId: string, fileName: string) => void;
  currentImageUrl?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  buttonText?: string;
  className?: string;
}

export function ImageUpload({
  folder = "posts",
  onUploadComplete,
  currentImageUrl,
  maxSizeMB,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  buttonText = "Upload Image",
  className = "",
}: ImageUploadProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Determine max file size based on user role
  // Admins can upload up to 20MB, regular users up to 5MB
  const effectiveMaxSizeMB =
    maxSizeMB ?? (session?.user?.role === "ADMIN" ? 20 : 5);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Only ${acceptedFormats.map((f) => f.split("/")[1]).join(", ")} files are allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    const maxBytes = effectiveMaxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast({
        title: "File too large",
        description: `File size must be less than ${effectiveMaxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();

      onUploadComplete(data.file.url, data.file.fileId, data.file.fileName);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(currentImageUrl || null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview */}
      {previewUrl ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          {selectedFile && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No image selected
            </p>
          </div>
        </div>
      )}

      {/* Upload Controls */}
      <div className="flex gap-2">
        <label htmlFor="file-upload" className="flex-1">
          <input
            id="file-upload"
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Image
          </Button>
        </label>

        {selectedFile && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        Max file size: {effectiveMaxSizeMB}MB
        {session?.user?.role === "ADMIN" && " (Admin limit)"}. Supported
        formats:{" "}
        {acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")}
      </p>
    </div>
  );
}
