"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Loader2, Download, Save, Eye, EyeOff } from "lucide-react";
import { CanvasPreview } from "@/components/instagram/canvas-preview";
import { exportToImage } from "@/lib/instagram-export";
import { exportToVideo } from "@/lib/instagram-video-export";
import { EventSearch } from "@/components/instagram/event-search";
import { TemplateSelector } from "@/components/instagram/template-selector";
import { BackgroundControls } from "@/components/instagram/background-controls";
import { EventHeroForm } from "@/components/instagram/event-hero-form";
import { CategoryCardForm } from "@/components/instagram/category-card-form";
import { WeeklyPicksForm } from "@/components/instagram/weekly-picks-form";
import { MinimalQuoteForm } from "@/components/instagram/minimal-quote-form";
import { MonthlyEventsForm } from "@/components/instagram/monthly-events-form";
import {
  type TemplateKey,
  type InstagramFormat,
  type TemplatePayload,
  type EventHeroPayload,
  type CategoryCardPayload,
  type WeeklyPicksPayload,
  type MinimalQuotePayload,
  type MonthlyEventsPayload,
  type Background,
  BRAND_COLORS,
  BRAND_GRADIENTS,
  INSTAGRAM_SIZES,
} from "@/types/instagram";

// Preview scaling constants
const PREVIEW_MAX_SCALE = 0.4;
const PREVIEW_MOBILE_BREAKPOINT = 1024;
const PREVIEW_MOBILE_PADDING = 60;
const PREVIEW_DESKTOP_CONTAINER_WIDTH = 800;
const PREVIEW_HEIGHT_RATIO = 0.7;
const PREVIEW_DEFAULT_SCALE = 0.3;

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  selected: boolean;
}

export default function InstagramGeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [previewScale, setPreviewScale] = useState(PREVIEW_DEFAULT_SCALE);
  const [templateKey, setTemplateKey] = useState<TemplateKey>("T1");
  const [format, setFormat] = useState<InstagramFormat>("SQUARE");
  const [showGuides, setShowGuides] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  // Background state
  const [backgroundType, setBackgroundType] = useState<
    "solid" | "gradient" | "photo" | "video"
  >("gradient");
  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS.primary);
  const [selectedGradient, setSelectedGradient] = useState(BRAND_GRADIENTS[0]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [overlayIntensity, setOverlayIntensity] = useState(50);
  const [videoScale, setVideoScale] = useState(100); // Default 100% (contain)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoDuration, setVideoDuration] = useState(5); // Default 5 seconds
  const [exportProgress, setExportProgress] = useState(0); // Export progress 0-100

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
  const [t3AllEvents, setT3AllEvents] = useState<EventItem[]>([]);
  const [t3SportType, setT3SportType] = useState("ALL");

  // T4: Minimal Quote
  const [t4Quote, setT4Quote] = useState(
    "O único treino mau é aquele que não fizeste"
  );
  const [t4Footer, setT4Footer] = useState("Athlifyr");

  // T5: Monthly Events
  const [t5Month, setT5Month] = useState("2026-01");
  const [t5SportType, setT5SportType] = useState("ALL");
  const [t5Events, setT5Events] = useState<EventItem[]>([]);
  const [isLoadingMonthlyEvents, setIsLoadingMonthlyEvents] = useState(false);

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Calculate responsive preview scale
  useEffect(() => {
    const calculateScale = () => {
      const size = INSTAGRAM_SIZES[format];
      const containerWidth =
        window.innerWidth < PREVIEW_MOBILE_BREAKPOINT
          ? window.innerWidth - PREVIEW_MOBILE_PADDING
          : PREVIEW_DESKTOP_CONTAINER_WIDTH;
      const containerHeight = window.innerHeight * PREVIEW_HEIGHT_RATIO;

      const scaleByWidth = containerWidth / size.width;
      const scaleByHeight = containerHeight / size.height;

      const scale = Math.min(scaleByWidth, scaleByHeight, PREVIEW_MAX_SCALE);
      setPreviewScale(scale);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [format]);

  // Load weekly events for T3
  useEffect(() => {
    if (templateKey !== "T3") return;

    const loadWeeklyEvents = async () => {
      try {
        const url =
          t3SportType === "ALL"
            ? "/api/events/weekly"
            : `/api/events/weekly?sportType=${t3SportType}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const eventsWithSelection = (data.events || []).map(
            (event: Omit<EventItem, "selected">) => ({
              ...event,
              selected: true,
            })
          );
          setT3AllEvents(eventsWithSelection);
        }
      } catch (error) {
        console.error("Error loading weekly events:", error);
      }
    };

    loadWeeklyEvents();
  }, [templateKey, t3SportType]);

  // Load monthly events for T5
  useEffect(() => {
    if (templateKey !== "T5") return;

    const loadMonthlyEvents = async () => {
      setIsLoadingMonthlyEvents(true);
      try {
        const url =
          t5SportType === "ALL"
            ? `/api/events/monthly?month=${t5Month}&sportType=ALL`
            : `/api/events/monthly?month=${t5Month}&sportType=${t5SportType}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const eventsWithSelection = (data.events || []).map(
            (event: Omit<EventItem, "selected">) => ({
              ...event,
              selected: true,
            })
          );
          setT5Events(eventsWithSelection);
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao carregar eventos",
            description: "Não foi possível carregar os eventos do mês.",
          });
        }
      } catch (error) {
        console.error("Error loading monthly events:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar eventos",
          description: "Ocorreu um erro ao carregar os eventos.",
        });
      } finally {
        setIsLoadingMonthlyEvents(false);
      }
    };

    loadMonthlyEvents();
  }, [templateKey, t5Month, t5SportType]);

  const handleSelectEvent = (event: {
    title: string;
    startDate: string;
    endDate: string | null;
    location: string;
    sport: { name: string };
    variants: Array<{ name: string }>;
  }) => {
    const startDate = new Date(event.startDate);
    let formattedDate: string;

    if (event.endDate) {
      const endDate = new Date(event.endDate);
      const isSameMonth =
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear();

      if (isSameMonth) {
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const month = startDate.toLocaleDateString("pt-PT", { month: "short" });
        const year = startDate.getFullYear();
        formattedDate = `${startDay}-${endDay} ${month} ${year}`;
      } else {
        const startFormatted = startDate.toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "short",
        });
        const endFormatted = endDate.toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "short",
        });
        const year = endDate.getFullYear();
        formattedDate = `${startFormatted} - ${endFormatted} ${year}`;
      }
    } else {
      formattedDate = startDate.toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    setTemplateKey("T1");
    setT1Title(event.title.toUpperCase());

    if (event.variants && event.variants.length > 0) {
      const variantNames = event.variants
        .slice(0, 2)
        .map((v) => v.name)
        .join(" • ");
      setT1Subtitle(variantNames);
    } else {
      setT1Subtitle(event.sport.name);
    }

    setT1MetaLine(`${formattedDate} • ${event.location}`);
    setT1Cta("Descobre na Athlifyr");

    toast({
      title: "Evento selecionado",
      description: `Template preenchido com dados de "${event.title}"`,
    });
  };

  const toggleT3Event = (eventId: string) => {
    setT3AllEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, selected: !event.selected } : event
      )
    );
  };

  const toggleT5Event = (eventId: string) => {
    setT5Events((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, selected: !event.selected } : event
      )
    );
  };

  const toggleAllT3Events = (selected: boolean) => {
    setT3AllEvents((prev) => prev.map((event) => ({ ...event, selected })));
  };

  const toggleAllT5Events = (selected: boolean) => {
    setT5Events((prev) => prev.map((event) => ({ ...event, selected })));
  };

  const getBackground = (): Background => {
    if (backgroundType === "video") {
      return {
        type: "video",
        value: videoUrl,
        overlayIntensity,
        videoScale,
      };
    }
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
        const t3EventItems =
          t3AllEvents.length > 0
            ? t3AllEvents
                .filter((e) => e.selected)
                .map((e) => `${e.title} • ${e.date} • ${e.location}`)
            : t3Items.split("\n").filter(Boolean);

        return {
          header: t3Header,
          items: t3EventItems,
          footer: t3Footer,
          background,
        } as WeeklyPicksPayload;

      case "T4":
        return {
          quote: t4Quote,
          footer: t4Footer,
          background,
        } as MinimalQuotePayload;

      case "T5":
        const selectedEvents = t5Events
          .filter((e) => e.selected)
          .map((e) => ({
            title: e.title,
            date: e.date,
            location: e.location,
          }));

        return {
          month: new Date(t5Month + "-01")
            .toLocaleDateString("pt-PT", {
              month: "long",
              year: "numeric",
            })
            .toUpperCase(),
          sportType: t5SportType === "ALL" ? "TODOS" : t5SportType,
          events: selectedEvents,
          footer: "athlifyr.com",
          background,
        } as MonthlyEventsPayload;

      default:
        throw new Error(
          `Unknown template: ${templateKey}. Expected T1, T2, T3, T4, or T5.`
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
      setPhotoUrl(data.url);
      setBackgroundType("photo");

      toast({
        title: "Photo uploaded",
        description: "Background photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        variant: "destructive",
        title: "Ficheiro inválido",
        description: "Por favor seleciona um vídeo.",
      });
      return;
    }

    setIsUploadingVideo(true);
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
      setVideoUrl(data.url);
      setBackgroundType("video");

      toast({
        title: "Vídeo carregado",
        description: "Vídeo de fundo foi carregado com sucesso.",
      });
    } catch (error) {
      console.error("Video upload error:", error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Falha ao carregar vídeo. Tenta novamente.",
      });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);

    try {
      // Export video if background is video
      if (backgroundType === "video" && videoUrl) {
        toast({
          title: "Exporting video...",
          description: `Exporting ${videoDuration}s video. Please wait...`,
        });

        setExportProgress(0);

        await exportToVideo({
          element: canvasRef.current,
          filename: `athlifyr-${templateKey.toLowerCase()}-${format.toLowerCase()}`,
          format,
          duration: videoDuration, // Use user-selected duration
          onProgress: setExportProgress, // Update progress
        });

        toast({
          title: "Video exported!",
          description: "Your video has been downloaded successfully.",
        });
        return;
      }

      // Export image for other backgrounds
      await exportToImage({
        element: canvasRef.current,
        filename: `athlifyr-${templateKey.toLowerCase()}-${format.toLowerCase()}`,
        format: "png",
        quality: 0.95,
      });
      toast({
        title: "Exported successfully",
        description: `Your ${format} post has been downloaded.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to export. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const payload = getPayload();
      const res = await fetch("/api/instagram/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateKey,
          format,
          payload,
          showLogo,
        }),
      });

      if (!res.ok) throw new Error("Failed to save draft");

      toast({
        title: "Draft saved",
        description: "Your design has been saved as a draft.",
      });
    } catch (error) {
      console.error("Save draft error:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save draft. Please try again.",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Instagram Post Generator
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Create branded Instagram content with Athlifyr templates
        </p>
      </div>

      <EventSearch onEventSelect={handleSelectEvent} />

      <div className="grid gap-4 lg:grid-cols-[400px,1fr] lg:gap-6">
        {/* Left Panel: Controls */}
        <div className="space-y-4 lg:space-y-6">
          <Card className="p-4 sm:p-6">
            <TemplateSelector
              templateKey={templateKey}
              format={format}
              onTemplateChange={setTemplateKey}
              onFormatChange={setFormat}
            />
          </Card>

          <Card className="p-4 sm:p-6">
            <BackgroundControls
              backgroundType={backgroundType}
              selectedColor={selectedColor}
              selectedGradient={selectedGradient}
              photoUrl={photoUrl}
              videoUrl={videoUrl}
              overlayIntensity={overlayIntensity}
              videoScale={videoScale}
              isUploadingPhoto={isUploadingPhoto}
              isUploadingVideo={isUploadingVideo}
              fileInputRef={fileInputRef}
              videoInputRef={videoInputRef}
              onBackgroundTypeChange={setBackgroundType}
              onColorChange={setSelectedColor}
              onGradientChange={setSelectedGradient}
              onOverlayIntensityChange={setOverlayIntensity}
              onVideoScaleChange={setVideoScale}
              onPhotoUpload={handlePhotoUpload}
              onVideoUpload={handleVideoUpload}
            />
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Content</h2>

            {templateKey === "T1" && (
              <EventHeroForm
                title={t1Title}
                subtitle={t1Subtitle}
                metaLine={t1MetaLine}
                cta={t1Cta}
                onTitleChange={setT1Title}
                onSubtitleChange={setT1Subtitle}
                onMetaLineChange={setT1MetaLine}
                onCtaChange={setT1Cta}
              />
            )}

            {templateKey === "T2" && (
              <CategoryCardForm
                categoryTitle={t2CategoryTitle}
                chips={t2Chips}
                tagline={t2Tagline}
                onCategoryTitleChange={setT2CategoryTitle}
                onChipsChange={setT2Chips}
                onTaglineChange={setT2Tagline}
              />
            )}

            {templateKey === "T3" && (
              <WeeklyPicksForm
                header={t3Header}
                items={t3Items}
                footer={t3Footer}
                onHeaderChange={setT3Header}
                onItemsChange={setT3Items}
                onFooterChange={setT3Footer}
                allEvents={t3AllEvents}
                onToggleEvent={toggleT3Event}
                onToggleAllEvents={toggleAllT3Events}
                sportType={t3SportType}
                onSportTypeChange={setT3SportType}
                onEventsLoaded={setT3AllEvents}
              />
            )}

            {templateKey === "T4" && (
              <MinimalQuoteForm
                quote={t4Quote}
                footer={t4Footer}
                onQuoteChange={setT4Quote}
                onFooterChange={setT4Footer}
              />
            )}

            {templateKey === "T5" && (
              <MonthlyEventsForm
                month={t5Month}
                sportType={t5SportType}
                events={t5Events}
                isLoading={isLoadingMonthlyEvents}
                onMonthChange={setT5Month}
                onSportTypeChange={setT5SportType}
                onToggleEvent={toggleT5Event}
                onToggleAllEvents={toggleAllT5Events}
              />
            )}
          </Card>

          {/* Actions Card */}
          <Card className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Actions</h2>
            <div className="space-y-3">
              <Button
                onClick={() => setShowGuides(!showGuides)}
                variant="outline"
                className="w-full"
              >
                {showGuides ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Guides
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Guides
                  </>
                )}
              </Button>

              <Button
                onClick={() => setShowLogo(!showLogo)}
                variant="outline"
                className="w-full"
              >
                {showLogo ? "Hide Logo" : "Show Logo"}
              </Button>

              <Button
                onClick={handleSaveDraft}
                variant="outline"
                disabled={isSavingDraft}
                className="w-full"
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>

              {/* Video Duration Control - Only show when video background is selected */}
              {backgroundType === "video" && videoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Video Duration
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {videoDuration}s
                    </span>
                  </div>
                  <Slider
                    value={[videoDuration]}
                    onValueChange={(value) => setVideoDuration(value[0])}
                    min={1}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Longer videos may take more time to export
                  </p>
                </div>
              )}

              {/* Progress Bar - Show during export */}
              {isExporting && exportProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Export Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {exportProgress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleExport}
                className="w-full"
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    {backgroundType === "video" && videoUrl
                      ? "Export Video"
                      : "Export Image"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel: Preview */}
        <div className="flex items-center justify-center rounded-lg border bg-muted/50 p-4 sm:p-8">
          <div style={{ transform: `scale(${previewScale})` }}>
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
      </div>
    </div>
  );
}
