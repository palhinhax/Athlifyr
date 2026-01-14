"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Download, Save, Eye, EyeOff, Upload } from "lucide-react";
import { CanvasPreview } from "@/components/instagram/canvas-preview";
import { exportToImage } from "@/lib/instagram-export";
import {
  type TemplateKey,
  type InstagramFormat,
  type TemplatePayload,
  type EventHeroPayload,
  type CategoryCardPayload,
  type WeeklyPicksPayload,
  type MinimalQuotePayload,
  type Background,
  BRAND_COLORS,
  BRAND_GRADIENTS,
  INSTAGRAM_SIZES,
} from "@/types/instagram";

export default function InstagramGeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template and format state
  const [templateKey, setTemplateKey] = useState<TemplateKey>("T1");
  const [format, setFormat] = useState<InstagramFormat>("SQUARE");
  const [showGuides, setShowGuides] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  // Background state
  const [backgroundType, setBackgroundType] = useState<
    "solid" | "gradient" | "photo"
  >("gradient");
  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS.primary);
  const [selectedGradient, setSelectedGradient] = useState(BRAND_GRADIENTS[0]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [overlayIntensity, setOverlayIntensity] = useState(50);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Template payload states
  // T1: Event Hero
  const [t1Title, setT1Title] = useState("HYROX LISBOA");
  const [t1Subtitle, setT1Subtitle] = useState("Singles • Doubles");
  const [t1MetaLine, setT1MetaLine] = useState("Mar 2026 • Lisboa");
  const [t1Cta, setT1Cta] = useState("Descobre na Athlifyr");

  // T2: Category Card
  const [t2CategoryTitle, setT2CategoryTitle] = useState("TRAIL");
  const [t2Chips, setT2Chips] = useState("20K, 50K, Ultra");
  const [t2Tagline, setT2Tagline] = useState("Encontra eventos perto de ti");

  // T3: Weekly Picks
  const [t3Header, setT3Header] = useState("EVENTOS DA SEMANA");
  const [t3Items, setT3Items] = useState(
    "Trail Mondego • 20K\nHYROX Lisboa • Singles\nMaratona do Porto"
  );
  const [t3Footer, setT3Footer] = useState("athlifyr.com");

  // T4: Minimal Quote
  const [t4Quote, setT4Quote] = useState(
    "O único treino mau é aquele que não fizeste"
  );
  const [t4Footer, setT4Footer] = useState("Athlifyr");

  // Draft management
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  const getBackground = (): Background => {
    if (backgroundType === "photo") {
      return {
        type: "photo",
        value: photoUrl,
        overlayIntensity,
      };
    }
    if (backgroundType === "gradient") {
      return {
        type: "gradient",
        value: selectedGradient,
      };
    }
    return {
      type: "solid",
      value: selectedColor,
    };
  };

  const getPayload = (): TemplatePayload => {
    const background = getBackground();

    switch (templateKey) {
      case "T1":
        return {
          title: t1Title,
          subtitle: t1Subtitle || undefined,
          metaLine: t1MetaLine || undefined,
          cta: t1Cta || undefined,
          background,
        } as EventHeroPayload;

      case "T2":
        return {
          categoryTitle: t2CategoryTitle,
          chips: t2Chips
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          tagline: t2Tagline,
          background,
        } as CategoryCardPayload;

      case "T3":
        return {
          header: t3Header,
          items: t3Items.split("\n").filter(Boolean),
          footer: t3Footer,
          background,
        } as WeeklyPicksPayload;

      case "T4":
        return {
          quote: t4Quote,
          footer: t4Footer,
          background,
        } as MinimalQuotePayload;

      default:
        throw new Error(
          `Unknown template: ${templateKey}. Expected T1, T2, T3, or T4.`
        );
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select an image.",
      });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "instagram");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setPhotoUrl(data.file.url);
      setBackgroundType("photo");

      toast({
        title: "Image uploaded",
        description: "Background image uploaded successfully.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image.",
      });
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExport = async (exportFormat: "png" | "jpeg") => {
    if (!canvasRef.current) return;

    try {
      const size = INSTAGRAM_SIZES[format];
      const filename = `athlifyr-${templateKey.toLowerCase()}-${size.ratio.replace(":", "x")}`;

      await exportToImage({
        element: canvasRef.current,
        filename,
        format: exportFormat,
      });

      toast({
        title: "Export successful",
        description: `Image exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description:
          error instanceof Error ? error.message : "Failed to export image.",
      });
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const res = await fetch("/api/instagram/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateKey,
          format,
          payload: getPayload(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save draft");

      toast({
        title: "Draft saved",
        description: "Your design has been saved as a draft.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save draft.",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Instagram Post Generator
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Create branded Instagram content with Athlifyr templates
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[400px,1fr] lg:gap-6">
          {/* Left Panel: Controls */}
          <div className="space-y-4 lg:space-y-6">
            <Card className="p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Template & Format</h2>

              {/* Template Selector */}
              <div className="mb-4">
                <Label>Template</Label>
                <Select
                  value={templateKey}
                  onValueChange={(v) => setTemplateKey(v as TemplateKey)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T1">T1: Event Hero</SelectItem>
                    <SelectItem value="T2">T2: Category Card</SelectItem>
                    <SelectItem value="T3">T3: Weekly Picks</SelectItem>
                    <SelectItem value="T4">T4: Minimal Quote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Selector */}
              <div className="mb-4">
                <Label>Format</Label>
                <Select
                  value={format}
                  onValueChange={(v) => setFormat(v as InstagramFormat)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SQUARE">
                      Square (1:1) - 1080x1080
                    </SelectItem>
                    <SelectItem value="PORTRAIT">
                      Portrait (4:5) - 1080x1350
                    </SelectItem>
                    <SelectItem value="STORY">
                      Story (9:16) - 1080x1920
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Show Guides Toggle */}
              <div className="flex items-center justify-between">
                <Label>Show Safe Area Guides</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGuides(!showGuides)}
                >
                  {showGuides ? (
                    <Eye className="mr-2 h-4 w-4" />
                  ) : (
                    <EyeOff className="mr-2 h-4 w-4" />
                  )}
                  {showGuides ? "Hide" : "Show"}
                </Button>
              </div>

              {/* Show Logo Toggle */}
              <div className="flex items-center justify-between">
                <Label>Show Logo</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogo(!showLogo)}
                >
                  {showLogo ? (
                    <Eye className="mr-2 h-4 w-4" />
                  ) : (
                    <EyeOff className="mr-2 h-4 w-4" />
                  )}
                  {showLogo ? "Hide" : "Show"}
                </Button>
              </div>
            </Card>

            {/* Background Card */}
            <Card className="p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Background</h2>

              {/* Background Type */}
              <div className="mb-4">
                <Label>Type</Label>
                <Select
                  value={backgroundType}
                  onValueChange={(v) =>
                    setBackgroundType(v as typeof backgroundType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Solid Color Picker */}
              {backgroundType === "solid" && (
                <div className="mb-4">
                  <Label>Color</Label>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {Object.entries(BRAND_COLORS).map(([name, color]) => (
                      <button
                        key={name}
                        className={`h-10 w-full rounded border-2 ${
                          selectedColor === color
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        title={name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Gradient Picker */}
              {backgroundType === "gradient" && (
                <div className="mb-4">
                  <Label>Gradient</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {BRAND_GRADIENTS.map((gradient, index) => (
                      <button
                        key={index}
                        className={`h-16 w-full rounded border-2 ${
                          selectedGradient === gradient
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        style={{ background: gradient }}
                        onClick={() => setSelectedGradient(gradient)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              {backgroundType === "photo" && (
                <div className="mb-4">
                  <Label>Upload Photo</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="w-full"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {photoUrl ? "Change Photo" : "Upload Photo"}
                  </Button>

                  {photoUrl && (
                    <div className="mt-4">
                      <Label>Overlay Intensity ({overlayIntensity}%)</Label>
                      <Slider
                        value={[overlayIntensity]}
                        onValueChange={(v) => setOverlayIntensity(v[0])}
                        min={0}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Template Fields Card */}
            <Card className="p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Content</h2>

              {/* T1: Event Hero */}
              {templateKey === "T1" && (
                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={t1Title}
                      onChange={(e) => setT1Title(e.target.value)}
                      maxLength={50}
                      placeholder="Event name"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t1Title.length}/50
                    </p>
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={t1Subtitle}
                      onChange={(e) => setT1Subtitle(e.target.value)}
                      maxLength={40}
                      placeholder="Singles • Doubles"
                    />
                  </div>
                  <div>
                    <Label>Date/Location</Label>
                    <Input
                      value={t1MetaLine}
                      onChange={(e) => setT1MetaLine(e.target.value)}
                      maxLength={30}
                      placeholder="Mar 2026 • Lisboa"
                    />
                  </div>
                  <div>
                    <Label>CTA</Label>
                    <Input
                      value={t1Cta}
                      onChange={(e) => setT1Cta(e.target.value)}
                      maxLength={30}
                      placeholder="Descobre na Athlifyr"
                    />
                  </div>
                </div>
              )}

              {/* T2: Category Card */}
              {templateKey === "T2" && (
                <div className="space-y-4">
                  <div>
                    <Label>Category Title *</Label>
                    <Input
                      value={t2CategoryTitle}
                      onChange={(e) => setT2CategoryTitle(e.target.value)}
                      maxLength={20}
                      placeholder="TRAIL"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t2CategoryTitle.length}/20
                    </p>
                  </div>
                  <div>
                    <Label>Keywords (comma separated, 2-3 items) *</Label>
                    <Input
                      value={t2Chips}
                      onChange={(e) => setT2Chips(e.target.value)}
                      placeholder="20K, 50K, Ultra"
                    />
                  </div>
                  <div>
                    <Label>Tagline *</Label>
                    <Input
                      value={t2Tagline}
                      onChange={(e) => setT2Tagline(e.target.value)}
                      maxLength={40}
                      placeholder="Encontra eventos perto de ti"
                    />
                  </div>
                </div>
              )}

              {/* T3: Weekly Picks */}
              {templateKey === "T3" && (
                <div className="space-y-4">
                  <div>
                    <Label>Header *</Label>
                    <Input
                      value={t3Header}
                      onChange={(e) => setT3Header(e.target.value)}
                      maxLength={30}
                      placeholder="EVENTOS DA SEMANA"
                    />
                  </div>
                  <div>
                    <Label>Items (one per line, 3-5 items) *</Label>
                    <textarea
                      value={t3Items}
                      onChange={(e) => setT3Items(e.target.value)}
                      placeholder="Trail Mondego • 20K&#10;HYROX Lisboa • Singles&#10;Maratona do Porto"
                      className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <Label>Footer *</Label>
                    <Input
                      value={t3Footer}
                      onChange={(e) => setT3Footer(e.target.value)}
                      maxLength={30}
                      placeholder="athlifyr.com"
                    />
                  </div>
                </div>
              )}

              {/* T4: Minimal Quote */}
              {templateKey === "T4" && (
                <div className="space-y-4">
                  <div>
                    <Label>Quote *</Label>
                    <textarea
                      value={t4Quote}
                      onChange={(e) => setT4Quote(e.target.value)}
                      maxLength={200}
                      placeholder="Your motivational quote..."
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t4Quote.length}/200
                    </p>
                  </div>
                  <div>
                    <Label>Footer</Label>
                    <Input
                      value={t4Footer}
                      onChange={(e) => setT4Footer(e.target.value)}
                      maxLength={20}
                      placeholder="Athlifyr"
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Actions Card */}
            <Card className="p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Export</h2>
              <div className="space-y-2">
                <Button onClick={() => handleExport("png")} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
                </Button>
                <Button
                  onClick={() => handleExport("jpeg")}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download JPG
                </Button>
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  disabled={isSavingDraft}
                  className="w-full"
                >
                  {isSavingDraft ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Draft
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Panel: Preview */}
          <div className="flex items-start justify-center">
            <Card className="inline-block w-full p-4 sm:p-8">
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <p className="text-sm text-muted-foreground">
                  {INSTAGRAM_SIZES[format].width} x{" "}
                  {INSTAGRAM_SIZES[format].height} (
                  {INSTAGRAM_SIZES[format].ratio})
                </p>
              </div>
              <div
                className="flex justify-center overflow-auto"
                style={{ maxHeight: "80vh" }}
              >
                <div
                  className="origin-top"
                  style={{
                    transform: "scale(0.25)",
                    transformOrigin: "top center",
                  }}
                >
                  <CanvasPreview
                    ref={canvasRef}
                    templateKey={templateKey}
                    format={format}
                    payload={getPayload()}
                    showGuides={showGuides}
                    showLogo={showLogo}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
