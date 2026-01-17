import { RefObject } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { BRAND_COLORS, BRAND_GRADIENTS } from "@/types/instagram";

interface BackgroundControlsProps {
  backgroundType: "solid" | "gradient" | "photo" | "video";
  selectedColor: string;
  selectedGradient: string;
  photoUrl: string;
  videoUrl?: string;
  overlayIntensity: number;
  videoScale?: number;
  isUploadingPhoto: boolean;
  isUploadingVideo?: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  videoInputRef?: RefObject<HTMLInputElement>;
  onBackgroundTypeChange: (
    type: "solid" | "gradient" | "photo" | "video"
  ) => void;
  onColorChange: (color: string) => void;
  onGradientChange: (gradient: string) => void;
  onOverlayIntensityChange: (intensity: number) => void;
  onVideoScaleChange?: (scale: number) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BackgroundControls({
  backgroundType,
  selectedColor,
  selectedGradient,
  photoUrl,
  videoUrl = "",
  overlayIntensity,
  videoScale = 100,
  isUploadingPhoto,
  isUploadingVideo = false,
  fileInputRef,
  videoInputRef,
  onBackgroundTypeChange,
  onColorChange,
  onGradientChange,
  onOverlayIntensityChange,
  onVideoScaleChange,
  onPhotoUpload,
  onVideoUpload,
}: BackgroundControlsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Background</h2>

      {/* Background Type */}
      <div>
        <Label>Type</Label>
        <Select
          value={backgroundType}
          onValueChange={(v) =>
            onBackgroundTypeChange(
              v as "solid" | "gradient" | "photo" | "video"
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="photo">Photo</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Solid Color Picker */}
      {backgroundType === "solid" && (
        <div>
          <Label>Color</Label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(BRAND_COLORS).map(([name, color]) => (
              <button
                key={name}
                onClick={() => onColorChange(color)}
                className={`h-12 rounded-md border-2 transition-all ${
                  selectedColor === color
                    ? "border-white ring-2 ring-offset-2"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                title={name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Gradient Picker */}
      {backgroundType === "gradient" && (
        <div>
          <Label>Gradient</Label>
          <div className="grid grid-cols-2 gap-2">
            {BRAND_GRADIENTS.map((gradient, idx) => (
              <button
                key={idx}
                onClick={() => onGradientChange(gradient)}
                className={`h-16 rounded-md border-2 transition-all ${
                  selectedGradient === gradient
                    ? "border-white ring-2 ring-offset-2"
                    : "border-transparent"
                }`}
                style={{ background: gradient }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Photo Upload */}
      {backgroundType === "photo" && (
        <div className="space-y-4">
          <div>
            <Label>Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="w-full"
            >
              {isUploadingPhoto ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
            {photoUrl && (
              <div className="mt-2 text-xs text-muted-foreground">
                ✓ Photo uploaded
              </div>
            )}
          </div>

          {/* Overlay Intensity */}
          {photoUrl && (
            <div>
              <Label>Overlay Intensity: {overlayIntensity}%</Label>
              <Slider
                value={[overlayIntensity]}
                onValueChange={(v) => onOverlayIntensityChange(v[0])}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Darken photo to improve text readability
              </p>
            </div>
          )}
        </div>
      )}

      {/* Video Upload */}
      {backgroundType === "video" && (
        <div className="space-y-4">
          <div>
            <Label>Video</Label>
            {videoInputRef && (
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={onVideoUpload}
                className="hidden"
              />
            )}
            <Button
              variant="outline"
              onClick={() => videoInputRef?.current?.click()}
              disabled={isUploadingVideo}
              className="w-full"
            >
              {isUploadingVideo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
            {videoUrl && (
              <div className="mt-2 space-y-1">
                <div className="text-xs font-semibold text-green-600">
                  ✓ Video uploaded successfully
                </div>
                <div className="break-all text-xs text-muted-foreground">
                  {videoUrl}
                </div>
              </div>
            )}
            {!videoUrl && !isUploadingVideo && (
              <div className="mt-2 text-xs text-muted-foreground">
                Supported formats: MP4, WebM, QuickTime
              </div>
            )}
          </div>

          {/* Overlay Intensity */}
          {videoUrl && (
            <>
              <div>
                <Label>Overlay Intensity: {overlayIntensity}%</Label>
                <Slider
                  value={[overlayIntensity]}
                  onValueChange={(v) => onOverlayIntensityChange(v[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Darken video to improve text readability
                </p>
              </div>

              {/* Video Scale */}
              <div>
                <Label>Video Size: {videoScale}%</Label>
                <Slider
                  value={[videoScale]}
                  onValueChange={(v) => onVideoScaleChange?.(v[0])}
                  min={100}
                  max={200}
                  step={5}
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {videoScale <= 100
                    ? "Video fits inside frame (no cropping)"
                    : `Video zoomed to ${videoScale}% (may crop edges)`}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
