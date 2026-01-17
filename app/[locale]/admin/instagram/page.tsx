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
  type MonthlyEventsPayload,
  type Background,
  BRAND_COLORS,
  BRAND_GRADIENTS,
  INSTAGRAM_SIZES,
} from "@/types/instagram";

// Preview scaling constants
const PREVIEW_MAX_SCALE = 0.4; // Maximum scale for preview
const PREVIEW_MOBILE_BREAKPOINT = 1024; // Breakpoint for mobile layout (px)
const PREVIEW_MOBILE_PADDING = 60; // Padding on mobile (px)
const PREVIEW_DESKTOP_CONTAINER_WIDTH = 800; // Container width on desktop (px)
const PREVIEW_HEIGHT_RATIO = 0.7; // Preview height as ratio of viewport height
const PREVIEW_DEFAULT_SCALE = 0.3; // Default scale before calculation

export default function InstagramGeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewScale, setPreviewScale] = useState(PREVIEW_DEFAULT_SCALE);

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
  const [t3AllEvents, setT3AllEvents] = useState<
    Array<{
      id: string;
      title: string;
      date: string;
      location: string;
      selected: boolean;
    }>
  >([]);
  const [isLoadingWeeklyEvents, setIsLoadingWeeklyEvents] = useState(false);

  // T4: Minimal Quote
  const [t4Quote, setT4Quote] = useState(
    "O único treino mau é aquele que não fizeste"
  );
  const [t4Footer, setT4Footer] = useState("Athlifyr");

  // T5: Monthly Events
  const [t5Month, setT5Month] = useState("2026-01"); // YYYY-MM format
  const [t5SportType, setT5SportType] = useState("TRAIL");
  const [t5Events, setT5Events] = useState<
    Array<{
      id: string;
      title: string;
      date: string;
      location: string;
      selected: boolean;
    }>
  >([]);
  const [isLoadingMonthlyEvents, setIsLoadingMonthlyEvents] = useState(false);

  // Draft management
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Event search and selection
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [eventSearchResults, setEventSearchResults] = useState<
    Array<{
      id: string;
      title: string;
      slug: string;
      startDate: string;
      endDate: string | null;
      location: string;
      sport: { name: string };
      variants: Array<{ name: string }>;
    }>
  >([]);
  const [isSearchingEvents, setIsSearchingEvents] = useState(false);
  const [showEventSearch, setShowEventSearch] = useState(false);

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

  // Search events with debounce
  useEffect(() => {
    if (!eventSearchQuery.trim()) {
      setEventSearchResults([]);
      return;
    }

    const searchEvents = async () => {
      setIsSearchingEvents(true);
      try {
        const res = await fetch(
          `/api/events?search=${encodeURIComponent(eventSearchQuery)}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setEventSearchResults(data.events || []);
        }
      } catch (error) {
        console.error("Error searching events:", error);
      } finally {
        setIsSearchingEvents(false);
      }
    };

    const timeoutId = setTimeout(searchEvents, 300);
    return () => clearTimeout(timeoutId);
  }, [eventSearchQuery]);

  // Load monthly events for T5
  useEffect(() => {
    if (templateKey !== "T5") return;

    const loadMonthlyEvents = async () => {
      setIsLoadingMonthlyEvents(true);
      try {
        const res = await fetch(
          `/api/events/monthly?month=${t5Month}&sportType=${t5SportType}`
        );
        if (res.ok) {
          const data = await res.json();
          const eventsWithSelection = (data.events || []).map(
            (event: {
              id: string;
              title: string;
              date: string;
              location: string;
            }) => ({
              ...event,
              selected: true, // Select all by default
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

  // Load weekly events for T3
  useEffect(() => {
    if (templateKey !== "T3") return;

    const loadWeeklyEvents = async () => {
      setIsLoadingWeeklyEvents(true);
      try {
        const res = await fetch("/api/events/weekly");
        if (res.ok) {
          const data = await res.json();
          const eventsWithSelection = (data.events || []).map(
            (event: {
              id: string;
              title: string;
              date: string;
              location: string;
            }) => ({
              ...event,
              selected: true, // Select all by default
            })
          );
          setT3AllEvents(eventsWithSelection);
        }
      } catch (error) {
        console.error("Error loading weekly events:", error);
      } finally {
        setIsLoadingWeeklyEvents(false);
      }
    };

    loadWeeklyEvents();
  }, [templateKey]);

  const handleSelectEvent = (event: (typeof eventSearchResults)[0]) => {
    // Format date - show day and month, or date range if endDate exists
    const startDate = new Date(event.startDate);
    let formattedDate: string;

    if (event.endDate) {
      const endDate = new Date(event.endDate);
      const isSameMonth =
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear();

      if (isSameMonth) {
        // Same month: "15-18 jan 2026"
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const month = startDate.toLocaleDateString("pt-PT", { month: "short" });
        const year = startDate.getFullYear();
        formattedDate = `${startDay}-${endDay} ${month} ${year}`;
      } else {
        // Different months: "15 jan - 18 fev 2026"
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
      // Single date: "15 jan 2026"
      formattedDate = startDate.toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    // Set template to T1 (Event Hero)
    setTemplateKey("T1");

    // Fill in the fields
    setT1Title(event.title.toUpperCase());

    // Subtitle: variants or sport
    if (event.variants && event.variants.length > 0) {
      const variantNames = event.variants
        .slice(0, 2)
        .map((v) => v.name)
        .join(" • ");
      setT1Subtitle(variantNames);
    } else {
      setT1Subtitle(event.sport.name);
    }

    // Meta line: date and location
    setT1MetaLine(`${formattedDate} • ${event.location}`);

    // CTA
    setT1Cta("Descobre na Athlifyr");

    // Close search and show success
    setShowEventSearch(false);
    setEventSearchQuery("");
    setEventSearchResults([]);

    toast({
      title: "Evento selecionado",
      description: `Template preenchido com dados de "${event.title}"`,
    });
  };

  // Toggle event selection for T3 (Weekly Events)
  const toggleT3Event = (eventId: string) => {
    setT3AllEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, selected: !event.selected } : event
      )
    );
  };

  // Toggle event selection for T5 (Monthly Events)
  const toggleT5Event = (eventId: string) => {
    setT5Events((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, selected: !event.selected } : event
      )
    );
  };

  // Select/Deselect all events for T3
  const toggleAllT3Events = (selected: boolean) => {
    setT3AllEvents((prev) => prev.map((event) => ({ ...event, selected })));
  };

  // Select/Deselect all events for T5
  const toggleAllT5Events = (selected: boolean) => {
    setT5Events((prev) => prev.map((event) => ({ ...event, selected })));
  };

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
        // Use selected events from t3AllEvents if available, otherwise fall back to manual input
        const t3EventItems =
          t3AllEvents.length > 0
            ? t3AllEvents
                .filter((e) => e.selected)
                .map((e) => `${e.title} • ${e.date}`)
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
        // Only include selected events
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
          sportType: t5SportType,
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

    // Save current guide state and temporarily disable
    const previousGuidesState = showGuides;
    setShowGuides(false);

    // Wait for React to re-render without guides
    await new Promise((resolve) => setTimeout(resolve, 100));

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
    } finally {
      // Restore previous guides state
      setShowGuides(previousGuidesState);
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
    <div className="min-h-screen overflow-x-hidden bg-muted/30 pb-8">
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

        {/* Event Search Section */}
        <Card className="mb-4 p-4 sm:mb-6 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Quick Start from Event</h2>
              <p className="text-sm text-muted-foreground">
                Search and select an event to auto-fill template
              </p>
            </div>
            <Button
              variant={showEventSearch ? "secondary" : "default"}
              onClick={() => setShowEventSearch(!showEventSearch)}
              size="sm"
            >
              {showEventSearch ? "Hide" : "Search Event"}
            </Button>
          </div>

          {showEventSearch && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Input
                  placeholder="Search events by name..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {isSearchingEvents && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {eventSearchResults.length > 0 && (
                <div className="space-y-2">
                  {eventSearchResults.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleSelectEvent(event)}
                      className="w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {event.sport.name} •{" "}
                        {new Date(event.startDate).toLocaleDateString("pt-PT", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        • {event.location}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {eventSearchQuery &&
                !isSearchingEvents &&
                eventSearchResults.length === 0 && (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No events found. Try a different search term.
                  </div>
                )}
            </div>
          )}
        </Card>

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
                    <SelectItem value="T5">T5: Monthly Events</SelectItem>
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
                      autoComplete="off"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t1Subtitle.length}/40
                    </p>
                  </div>
                  <div>
                    <Label>Date/Location</Label>
                    <Input
                      value={t1MetaLine}
                      onChange={(e) => setT1MetaLine(e.target.value)}
                      maxLength={30}
                      placeholder="Mar 2026 • Lisboa"
                      autoComplete="off"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t1MetaLine.length}/30
                    </p>
                  </div>
                  <div>
                    <Label>CTA</Label>
                    <Input
                      value={t1Cta}
                      onChange={(e) => setT1Cta(e.target.value)}
                      maxLength={30}
                      placeholder="Descobre na Athlifyr"
                      autoComplete="off"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t1Cta.length}/30
                    </p>
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
                    <Label>Keywords (comma separated, 2-4 items) *</Label>
                    <Input
                      value={t2Chips}
                      onChange={(e) => setT2Chips(e.target.value)}
                      placeholder="20K, 50K, Ultra, XL"
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

                  {/* Event Selection List */}
                  <div className="rounded-md border border-input bg-muted/50 p-4">
                    {isLoadingWeeklyEvents ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2 text-sm">
                          A carregar eventos...
                        </span>
                      </div>
                    ) : t3AllEvents.length > 0 ? (
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold">
                            Eventos desta semana (
                            {t3AllEvents.filter((e) => e.selected).length}/
                            {t3AllEvents.length} selecionados):
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllT3Events(true)}
                              className="h-7 text-xs"
                            >
                              Selecionar todos
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllT3Events(false)}
                              className="h-7 text-xs"
                            >
                              Limpar
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {t3AllEvents.map((event) => (
                            <label
                              key={event.id}
                              className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                            >
                              <input
                                type="checkbox"
                                checked={event.selected}
                                onChange={() => toggleT3Event(event.id)}
                                className="mt-1 h-4 w-4 rounded border-gray-300"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {event.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {event.date} • {event.location}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-3 text-center text-sm text-muted-foreground">
                          Nenhum evento encontrado para esta semana.
                        </p>
                        <div>
                          <Label>Items manuais (um por linha, 3-5 items)</Label>
                          <textarea
                            value={t3Items}
                            onChange={(e) => setT3Items(e.target.value)}
                            placeholder="Trail Mondego • 20K&#10;HYROX Lisboa • Singles&#10;Maratona do Porto"
                            className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>
                    )}
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

              {/* T5: Monthly Events */}
              {templateKey === "T5" && (
                <div className="space-y-4">
                  <div>
                    <Label>Mês *</Label>
                    <Input
                      type="month"
                      value={t5Month}
                      onChange={(e) => setT5Month(e.target.value)}
                      placeholder="2026-01"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Seleciona o mês para listar eventos
                    </p>
                  </div>
                  <div>
                    <Label>Tipo de Desporto *</Label>
                    <Select
                      value={t5SportType}
                      onValueChange={(v) => setT5SportType(v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRAIL">🏔️ Trail</SelectItem>
                        <SelectItem value="RUNNING">🏃 Corrida</SelectItem>
                        <SelectItem value="BTT">🚵 BTT</SelectItem>
                        <SelectItem value="HYROX">💪 HYROX</SelectItem>
                        <SelectItem value="TRIATHLON">🏊 Triatlo</SelectItem>
                        <SelectItem value="CYCLING">🚴 Ciclismo</SelectItem>
                        <SelectItem value="OCR">🧗 OCR</SelectItem>
                        <SelectItem value="CROSSFIT">🏋️ CrossFit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-md border border-input bg-muted/50 p-4">
                    {isLoadingMonthlyEvents ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2 text-sm">
                          A carregar eventos...
                        </span>
                      </div>
                    ) : t5Events.length > 0 ? (
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold">
                            {t5Events.filter((e) => e.selected).length}/
                            {t5Events.length} eventos selecionados:
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllT5Events(true)}
                              className="h-7 text-xs"
                            >
                              Selecionar todos
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllT5Events(false)}
                              className="h-7 text-xs"
                            >
                              Limpar
                            </Button>
                          </div>
                        </div>
                        <div className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
                          {t5Events.map((event) => (
                            <label
                              key={event.id}
                              className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                            >
                              <input
                                type="checkbox"
                                checked={event.selected}
                                onChange={() => toggleT5Event(event.id)}
                                className="mt-1 h-4 w-4 rounded border-gray-300"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {event.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {event.date} • {event.location}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          💡 Dica: Seleciona apenas os eventos mais importantes
                          (máximo 8 aparecem no post)
                        </p>
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        Nenhum evento encontrado para este mês e tipo de
                        desporto.
                      </p>
                    )}
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
          <div className="flex items-start justify-center overflow-hidden">
            <Card className="w-full overflow-hidden p-4 sm:p-8 lg:inline-block lg:w-auto">
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <p className="text-sm text-muted-foreground">
                  {INSTAGRAM_SIZES[format].width} x{" "}
                  {INSTAGRAM_SIZES[format].height} (
                  {INSTAGRAM_SIZES[format].ratio})
                </p>
              </div>
              <div
                className="flex justify-center overflow-hidden"
                style={{ maxHeight: "80vh" }}
              >
                {/* Scaling wrapper - dimensions match canvas size for proper transform calculation */}
                <div
                  className="origin-top"
                  style={{
                    width: `${INSTAGRAM_SIZES[format].width}px`,
                    height: `${INSTAGRAM_SIZES[format].height}px`,
                    transform: `scale(${previewScale})`,
                    transformOrigin: "center top",
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
