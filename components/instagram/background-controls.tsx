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
  backgroundType: "solid" | "gradient" | "photo" | "transparent";
  selectedColor: string;
  selectedGradient: string;
  photoUrl: string;
  overlayIntensity: number;
  isUploadingPhoto: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onBackgroundTypeChange: (
    type: "solid" | "gradient" | "photo" | "transparent"
  ) => void;
  onColorChange: (color: string) => void;
  onGradientChange: (gradient: string) => void;
  onOverlayIntensityChange: (intensity: number) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BackgroundControls({
  backgroundType,
  selectedColor,
  selectedGradient,
  photoUrl,
  overlayIntensity,
  isUploadingPhoto,
  fileInputRef,
  onBackgroundTypeChange,
  onColorChange,
  onGradientChange,
  onOverlayIntensityChange,
  onPhotoUpload,
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
              v as "solid" | "gradient" | "photo" | "transparent"
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
            <SelectItem value="transparent">Transparent</SelectItem>
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
    </div>
  );
}
