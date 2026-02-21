"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Download,
  Upload,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import {
  type Platform,
  type AssetSpec,
  getAssetsForPlatform,
} from "@/types/app-store-assets";

interface ImageResizerProps {
  platform: Platform;
}

/**
 * Resize mode: upload an image and batch-export it to all required
 * store dimensions. Uses a hidden <canvas> for pixel-level resize.
 */
export function ImageResizer({ platform }: ImageResizerProps) {
  const t = useTranslations("admin.appStoreAssets");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assets = getAssetsForPlatform(platform);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string>("");
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(
    () => new Set(assets.map((a) => a.id))
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // ── Upload source image ────────────────────────────────────────────────
  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSourceFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSourceImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Reset selection when platform changes
      setSelectedTargets(new Set(assets.map((a) => a.id)));
    },
    [assets]
  );

  const toggleTarget = useCallback((id: string) => {
    setSelectedTargets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedTargets((prev) =>
      prev.size === assets.length ? new Set() : new Set(assets.map((a) => a.id))
    );
  }, [assets]);

  // ── Resize and download each selected target ──────────────────────────
  const handleExportAll = useCallback(async () => {
    if (!sourceImage) return;
    setIsExporting(true);
    setExportProgress(0);

    const targets = assets.filter((a) => selectedTargets.has(a.id));
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = sourceImage;
    });

    for (let i = 0; i < targets.length; i++) {
      const spec = targets[i];
      setExportProgress(Math.round(((i + 1) / targets.length) * 100));

      const canvas = document.createElement("canvas");
      canvas.width = spec.width;
      canvas.height = spec.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      // Cover fit: scale to fill, center crop
      const srcAspect = img.width / img.height;
      const dstAspect = spec.width / spec.height;
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height;

      if (srcAspect > dstAspect) {
        // Source is wider → crop sides
        sw = img.height * dstAspect;
        sx = (img.width - sw) / 2;
      } else {
        // Source is taller → crop top/bottom
        sh = img.width / dstAspect;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, spec.width, spec.height);

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `${spec.id}-${spec.width}x${spec.height}.png`;
      link.href = dataUrl;
      link.click();

      // Small delay between downloads so browser doesn't block
      await new Promise((r) => setTimeout(r, 300));
    }

    toast({
      title: t("resize.exportDone"),
      description: t("resize.exportCount", { count: targets.length }),
    });

    setIsExporting(false);
    setExportProgress(0);
  }, [sourceImage, assets, selectedTargets, t]);

  const clearImage = useCallback(() => {
    setSourceImage(null);
    setSourceFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-5 w-5" />
            {t("resize.title")}
          </CardTitle>
          <CardDescription>{t("resize.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {!sourceImage ? (
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors hover:border-primary hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">{t("resize.dropHere")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPEG — {t("resize.maxSize")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{sourceFileName}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={clearImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourceImage}
                  alt="Source"
                  className="max-h-48 rounded border object-contain"
                />
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleUpload}
          />
        </CardContent>
      </Card>

      {/* Target sizes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {t("resize.outputSizes")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={toggleAll}>
              {selectedTargets.size === assets.length
                ? t("resize.deselectAll")
                : t("resize.selectAll")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {assets.map((spec) => (
              <AssetCheckbox
                key={spec.id}
                spec={spec}
                checked={selectedTargets.has(spec.id)}
                onToggle={() => toggleTarget(spec.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export button */}
      <Button
        className="w-full gap-2"
        size="lg"
        disabled={!sourceImage || selectedTargets.size === 0 || isExporting}
        onClick={handleExportAll}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("resize.exporting")} ({exportProgress}%)
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            {t("resize.exportSelected", { count: selectedTargets.size })}
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Small checkbox card ─────────────────────────────────────────────────────

function AssetCheckbox({
  spec,
  checked,
  onToggle,
}: {
  spec: AssetSpec;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
      onClick={onToggle}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <div className="min-w-0 flex-1">
        <Label className="cursor-pointer text-sm font-medium">
          {spec.label}
        </Label>
        <p className="text-xs text-muted-foreground">
          {spec.width} × {spec.height}px
        </p>
      </div>
      <div
        className="flex-shrink-0 rounded border bg-muted"
        style={{
          width: 32,
          height: 32 * (spec.height / spec.width),
          maxHeight: 32,
        }}
      />
    </div>
  );
}
