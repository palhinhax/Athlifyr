"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Download,
  Upload,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import {
  type Platform,
  type AssetSpec,
  type CanvasDesign,
  DEFAULT_CANVAS_DESIGN,
  getAssetsForPlatform,
} from "@/types/app-store-assets";
import { AssetCanvas } from "./asset-canvas";

interface AssetDesignerProps {
  platform: Platform;
}

/**
 * Full designer mode: build promotional images with device mockup,
 * backgrounds, text overlays, then export to specific store dimensions.
 */
export function AssetDesigner({ platform }: Readonly<AssetDesignerProps>) {
  const t = useTranslations("admin.appStoreAssets");
  const canvasRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const screenInputRef = useRef<HTMLInputElement>(null);

  const assets = getAssetsForPlatform(platform);
  const [selectedAsset, setSelectedAsset] = useState<AssetSpec>(assets[0]);
  const [design, setDesign] = useState<CanvasDesign>({
    ...DEFAULT_CANVAS_DESIGN,
    deviceType: platform === "ios" ? "iphone" : "android",
  });
  const [isExporting, setIsExporting] = useState(false);

  // Reset asset when platform changes
  const handleAssetChange = useCallback(
    (assetId: string) => {
      const found = assets.find((a) => a.id === assetId);
      if (found) setSelectedAsset(found);
    },
    [assets]
  );

  const updateDesign = useCallback(
    (patch: Partial<CanvasDesign>) =>
      setDesign((prev) => ({ ...prev, ...patch })),
    []
  );

  // ── Background image upload ────────────────────────────────────────────────
  const handleBgUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        updateDesign({
          backgroundType: "image",
          backgroundImageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    },
    [updateDesign]
  );

  // ── Screen image upload ────────────────────────────────────────────────────
  const handleScreenUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        updateDesign({ deviceScreenImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    },
    [updateDesign]
  );

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = useCallback(
    async (format: "png" | "jpeg") => {
      if (!canvasRef.current) return;
      setIsExporting(true);
      try {
        const { toPng, toJpeg } = await import("html-to-image");
        await document.fonts.ready;
        await new Promise((r) => setTimeout(r, 400));

        const el = canvasRef.current;
        const pixelRatio = selectedAsset.width / el.offsetWidth;
        const options = {
          quality: 0.95,
          pixelRatio,
          cacheBust: false,
          skipFonts: false,
          includeQueryParams: true,
          style: { transform: "scale(1)", transformOrigin: "top left" },
        };

        // html-to-image sometimes loses <img> src during cloning.
        // Retry up to 3 times to work around the race condition.
        let dataUrl = "";
        let lastError: unknown;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            dataUrl =
              format === "jpeg"
                ? await toJpeg(el, options)
                : await toPng(el, options);
            // Verify the result is not a blank/trivially small image
            if (dataUrl && dataUrl.length > 1000) break;
          } catch (e) {
            lastError = e;
          }
          // Wait before retrying to let images settle
          await new Promise((r) => setTimeout(r, 300));
        }

        if (!dataUrl || dataUrl.length <= 1000) {
          throw lastError || new Error("Export produced empty image");
        }

        const link = document.createElement("a");
        link.download = `${selectedAsset.id}-${selectedAsset.width}x${selectedAsset.height}.${format}`;
        link.href = dataUrl;
        link.click();

        toast({
          title: t("export.success"),
          description: `${selectedAsset.width}×${selectedAsset.height} ${format.toUpperCase()}`,
        });
      } catch (err) {
        console.error("Export error:", err);
        toast({
          title: t("export.error"),
          variant: "destructive",
        });
      } finally {
        setIsExporting(false);
      }
    },
    [selectedAsset, t]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* ── Canvas Preview ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("designer.preview")}</CardTitle>
          <CardDescription>
            {selectedAsset.width} × {selectedAsset.height}px —{" "}
            {selectedAsset.label}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center overflow-hidden">
          <div
            className="relative"
            style={{
              width: "100%",
              maxWidth: 600,
              aspectRatio: `${selectedAsset.width} / ${selectedAsset.height}`,
            }}
          >
            <AssetCanvas
              ref={canvasRef}
              design={design}
              width={selectedAsset.width}
              height={selectedAsset.height}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Asset size selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t("designer.assetSize")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedAsset.id} onValueChange={handleAssetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.label} ({a.width}×{a.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedAsset.description}
            </p>
          </CardContent>
        </Card>

        {/* Background */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {t("designer.background")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={design.backgroundType}
              onValueChange={(v) =>
                updateDesign({
                  backgroundType: v as CanvasDesign["backgroundType"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">{t("designer.bgSolid")}</SelectItem>
                <SelectItem value="gradient">
                  {t("designer.bgGradient")}
                </SelectItem>
                <SelectItem value="image">{t("designer.bgImage")}</SelectItem>
              </SelectContent>
            </Select>

            {design.backgroundType === "solid" && (
              <div className="flex items-center gap-2">
                <Label className="text-xs">{t("designer.color")}</Label>
                <input
                  type="color"
                  value={design.backgroundColor}
                  onChange={(e) =>
                    updateDesign({ backgroundColor: e.target.value })
                  }
                  className="h-8 w-12 cursor-pointer rounded border"
                />
              </div>
            )}

            {design.backgroundType === "gradient" && (
              <>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">{t("designer.from")}</Label>
                    <input
                      type="color"
                      value={design.gradientFrom}
                      onChange={(e) =>
                        updateDesign({ gradientFrom: e.target.value })
                      }
                      className="mt-1 h-8 w-full cursor-pointer rounded border"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">{t("designer.to")}</Label>
                    <input
                      type="color"
                      value={design.gradientTo}
                      onChange={(e) =>
                        updateDesign({ gradientTo: e.target.value })
                      }
                      className="mt-1 h-8 w-full cursor-pointer rounded border"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">
                    {t("designer.angle")} ({design.gradientAngle}°)
                  </Label>
                  <Slider
                    value={[design.gradientAngle]}
                    min={0}
                    max={360}
                    step={15}
                    onValueChange={([v]) => updateDesign({ gradientAngle: v })}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {design.backgroundType === "image" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => bgInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {t("designer.uploadBg")}
                </Button>
                <input
                  ref={bgInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBgUpload}
                />
                <div>
                  <Label className="text-xs">
                    {t("designer.overlay")} ({design.overlayOpacity}%)
                  </Label>
                  <Slider
                    value={[design.overlayOpacity]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([v]) => updateDesign({ overlayOpacity: v })}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">
                    {t("designer.overlayColor")}
                  </Label>
                  <input
                    type="color"
                    value={design.overlayColor}
                    onChange={(e) =>
                      updateDesign({ overlayColor: e.target.value })
                    }
                    className="h-8 w-12 cursor-pointer rounded border"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Device mockup */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t("designer.device")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">{t("designer.showDevice")}</Label>
              <Switch
                checked={design.showDevice}
                onCheckedChange={(v) => updateDesign({ showDevice: v })}
              />
            </div>

            {design.showDevice && (
              <>
                <Select
                  value={design.deviceType}
                  onValueChange={(v) =>
                    updateDesign({
                      deviceType: v as "iphone" | "android",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iphone">iPhone</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => screenInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {t("designer.uploadScreen")}
                </Button>
                <input
                  ref={screenInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenUpload}
                />

                <div>
                  <Label className="text-xs">
                    {t("designer.scale")} (
                    {Math.round(design.deviceScale * 100)}%)
                  </Label>
                  <Slider
                    value={[design.deviceScale]}
                    min={0.3}
                    max={2}
                    step={0.05}
                    onValueChange={([v]) => updateDesign({ deviceScale: v })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    {t("designer.offsetX")} ({design.deviceOffsetX}%)
                  </Label>
                  <Slider
                    value={[design.deviceOffsetX]}
                    min={-50}
                    max={50}
                    step={1}
                    onValueChange={([v]) => updateDesign({ deviceOffsetX: v })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">
                    {t("designer.offsetY")} ({design.deviceOffsetY}%)
                  </Label>
                  <Slider
                    value={[design.deviceOffsetY]}
                    min={-50}
                    max={50}
                    step={1}
                    onValueChange={([v]) => updateDesign({ deviceOffsetY: v })}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Text */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t("designer.text")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">{t("designer.headline")}</Label>
              <Input
                value={design.headline}
                onChange={(e) => updateDesign({ headline: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs">
                  {t("designer.fontSize")} ({design.headlineFontSize}px)
                </Label>
                <Slider
                  value={[design.headlineFontSize]}
                  min={24}
                  max={120}
                  step={2}
                  onValueChange={([v]) => updateDesign({ headlineFontSize: v })}
                  className="mt-1"
                />
              </div>
              <input
                type="color"
                value={design.headlineColor}
                onChange={(e) =>
                  updateDesign({ headlineColor: e.target.value })
                }
                className="h-8 w-10 cursor-pointer rounded border"
              />
            </div>

            <div>
              <Label className="text-xs">{t("designer.subheadline")}</Label>
              <Input
                value={design.subheadline}
                onChange={(e) => updateDesign({ subheadline: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs">
                  {t("designer.fontSize")} ({design.subheadlineFontSize}px)
                </Label>
                <Slider
                  value={[design.subheadlineFontSize]}
                  min={12}
                  max={64}
                  step={2}
                  onValueChange={([v]) =>
                    updateDesign({ subheadlineFontSize: v })
                  }
                  className="mt-1"
                />
              </div>
              <input
                type="color"
                value={design.subheadlineColor}
                onChange={(e) =>
                  updateDesign({ subheadlineColor: e.target.value })
                }
                className="h-8 w-10 cursor-pointer rounded border"
              />
            </div>

            {/* Alignment & Position */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <Button
                  variant={design.textAlign === "left" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateDesign({ textAlign: "left" })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    design.textAlign === "center" ? "default" : "outline"
                  }
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateDesign({ textAlign: "center" })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={design.textAlign === "right" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateDesign({ textAlign: "right" })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={
                    design.textPosition === "top" ? "default" : "outline"
                  }
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateDesign({ textPosition: "top" })}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    design.textPosition === "bottom" ? "default" : "outline"
                  }
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateDesign({ textPosition: "bottom" })}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t("designer.export")}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              onClick={() => handleExport("png")}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              PNG
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => handleExport("jpeg")}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              JPEG
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
