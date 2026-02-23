"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Download,
  Save,
  Eye,
  EyeOff,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { CanvasPreview } from "@/components/instagram/canvas-preview";
import { exportToImage } from "@/lib/instagram-export";
import { EventSearch } from "@/components/instagram/event-search";
import { TemplateSelector } from "@/components/instagram/template-selector";
import { BackgroundControls } from "@/components/instagram/background-controls";
import { EventHeroForm } from "@/components/instagram/event-hero-form";
import { CategoryCardForm } from "@/components/instagram/category-card-form";
import { WeeklyPicksForm } from "@/components/instagram/weekly-picks-form";
import { MinimalQuoteForm } from "@/components/instagram/minimal-quote-form";
import { MonthlyEventsForm } from "@/components/instagram/monthly-events-form";
import { BoldTextOverlayForm } from "@/components/instagram/bold-text-overlay-form";
import { SplitScreenForm } from "@/components/instagram/split-screen-form";
import { TestimonialStatsForm } from "@/components/instagram/testimonial-stats-form";
import { VerticalChallengeForm } from "@/components/instagram/vertical-challenge-form";
import { HookCtaForm } from "@/components/instagram/hook-cta-form";
import { VenuePromoForm } from "@/components/instagram/venue-promo-form";
import { GiveawayPromoForm } from "@/components/instagram/giveaway-promo-form";
import { AppDownloadForm } from "@/components/instagram/app-download-form";
import {
  type TemplateKey,
  type InstagramFormat,
  type TemplatePayload,
  type EventHeroPayload,
  type CategoryCardPayload,
  type WeeklyPicksPayload,
  type MinimalQuotePayload,
  type MonthlyEventsPayload,
  type BoldTextOverlayPayload,
  type SplitScreenPayload,
  type TestimonialStatsPayload,
  type VerticalChallengePayload,
  type HookCtaPayload,
  type VenuePromoPayload,
  type GiveawayPromoPayload,
  type AppDownloadPayload,
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

/**
 * Helper function to extract error message from upload response
 * Handles both JSON and plain text error responses
 */
async function getUploadErrorMessage(res: Response): Promise<string> {
  let errorMessage = "Upload failed";
  try {
    // Try to get response as text first
    const responseText = await res.text();
    console.error("Upload error response:", responseText);

    // Try to parse as JSON
    try {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Not JSON, use the text directly
      errorMessage = responseText || `Upload failed with status ${res.status}`;
    }
  } catch (parseError) {
    console.error("Could not read error response:", parseError);
    errorMessage = `Upload failed with status ${res.status}`;
  }
  return errorMessage;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  selected: boolean;
  weather?: {
    temperature: number;
    condition: string;
    icon: string | null;
  } | null;
}

interface SavedDraft {
  id: string;
  templateKey: string;
  format: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
}

export default function InstagramGeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewScale, setPreviewScale] = useState(PREVIEW_DEFAULT_SCALE);
  const [templateKey, setTemplateKey] = useState<TemplateKey>("T1");
  const [format, setFormat] = useState<InstagramFormat>("SQUARE");
  const [showGuides, setShowGuides] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  // Background state
  const [backgroundType, setBackgroundType] = useState<
    "solid" | "gradient" | "photo" | "transparent"
  >("gradient");
  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS.primary);
  const [selectedGradient, setSelectedGradient] = useState(BRAND_GRADIENTS[0]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [overlayIntensity, setOverlayIntensity] = useState(50);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // T1: Event Hero
  const [t1Title, setT1Title] = useState("HYROX LISBOA");
  const [t1Subtitle, setT1Subtitle] = useState("Singles • Doubles");
  const [t1MetaLine, setT1MetaLine] = useState("Mar 2026 • Lisboa");
  const [t1Cta, setT1Cta] = useState("Descobre em Athlifyr");

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
  const [t3WeekStart, setT3WeekStart] = useState(() => {
    // Default to today in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

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

  // T6: Bold Text Overlay
  const [t6MainText, setT6MainText] = useState("FIND YOUR CHALLENGE");
  const [t6SubText, setT6SubText] = useState("1000+ Events Available");
  const [t6Emoji, setT6Emoji] = useState("🔥");

  // T7: Split Screen
  const [t7LeftTitle, setT7LeftTitle] = useState("BEFORE");
  const [t7LeftSubtitle, setT7LeftSubtitle] = useState("Searching everywhere");
  const [t7RightTitle, setT7RightTitle] = useState("AFTER");
  const [t7RightSubtitle, setT7RightSubtitle] = useState(
    "One place. All sports."
  );
  const [t7VsText, setT7VsText] = useState("VS");
  const [t7HideVsBadge, setT7HideVsBadge] = useState(false);

  // T8: Testimonial/Stats
  const [t8StatNumber, setT8StatNumber] = useState("1000+");
  const [t8StatLabel, setT8StatLabel] = useState("EVENTOS DESCOBERTOS");
  const [t8Quote, setT8Quote] = useState(
    "A melhor plataforma para encontrar eventos desportivos em Portugal"
  );
  const [t8Author, setT8Author] = useState("João Silva");

  // T9: Vertical Challenge
  const [t9ChallengeTitle, setT9ChallengeTitle] = useState("30-DAY CHALLENGE");
  const [t9Steps, setT9Steps] = useState([
    "Complete 3 events this month",
    "Try a new sport",
    "Share your journey",
  ]);
  const [t9Hashtag, setT9Hashtag] = useState("AthlifyrChallenge");
  const [t9Cta, setT9Cta] = useState("Join Now");

  // T10: Hook + CTA
  const [t10Hook, setT10Hook] = useState("STOP SCROLLING");
  const [t10Body, setT10Body] = useState(
    "Discover 1000+ sports events across Portugal. From running to CrossFit, find your next challenge."
  );
  const [t10Cta, setT10Cta] = useState("DISCOVER NOW");

  // T11: Venue Promo
  const [t11VenueName, setT11VenueName] = useState("");
  const [t11VenueType, setT11VenueType] = useState("");
  const [t11Tagline, setT11Tagline] = useState("");
  const [t11Location, setT11Location] = useState("");
  const [t11Services, setT11Services] = useState<string[]>([]);
  const [t11LogoUrl, setT11LogoUrl] = useState<string | undefined>();
  const [t11Cta, setT11Cta] = useState("Descobre na Athlifyr");
  const [t11Instagram, setT11Instagram] = useState<string | undefined>();

  // T12: Giveaway Promo
  const [t12EventName, setT12EventName] = useState("");
  const [t12GiveawayTitle, setT12GiveawayTitle] = useState("SORTEIO");
  const [t12Prize, setT12Prize] = useState("1 Inscrição");
  const [t12DrawDate, setT12DrawDate] = useState("");
  const [t12HowToEnter, setT12HowToEnter] = useState<string[]>([
    "Visita a página do evento",
    "Clica em Participar",
  ]);
  const [t12Cta, setT12Cta] = useState("Participa Já");
  const [t12VerificationHash, setT12VerificationHash] = useState("");

  // T13: App Download Promo
  const [t13Headline, setT13Headline] = useState("Descarrega a App");
  const [t13Subheadline, setT13Subheadline] = useState(
    "Todos os eventos desportivos num só lugar"
  );
  const [t13Features, setT13Features] = useState<string[]>([
    "Descobre eventos perto de ti",
    "Inscreve-te diretamente",
    "Acompanha os resultados",
  ]);
  const [t13BadgeUrl, setT13BadgeUrl] = useState(
    "/images/badges/google-play-pt.png"
  );
  const [t13LegalText, setT13LegalText] = useState("");
  const [t13Cta, setT13Cta] = useState("Disponível no Google Play");

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

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
        let url = "/api/events/weekly";
        const params = new URLSearchParams();

        if (t3SportType !== "ALL") {
          params.append("sportType", t3SportType);
        }

        if (t3WeekStart) {
          params.append("startDate", t3WeekStart);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

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
  }, [templateKey, t3SportType, t3WeekStart]);

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
    city: string;
    country: string;
    sportTypes: string[];
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
      const sportName =
        event.sportTypes.length > 0 ? event.sportTypes[0] : "Event";
      setT1Subtitle(sportName);
    }

    setT1MetaLine(`${formattedDate} • ${event.city}, ${event.country}`);
    setT1Cta("Descobre em Athlifyr");

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
    const bg = (() => {
      if (backgroundType === "transparent") {
        return {
          type: "transparent" as const,
          value: "",
        };
      }
      if (backgroundType === "photo") {
        return {
          type: "photo" as const,
          value: photoUrl,
          overlayIntensity,
        };
      }
      if (backgroundType === "gradient") {
        return {
          type: "gradient" as const,
          value: selectedGradient,
        };
      }
      return {
        type: "solid" as const,
        value: selectedColor,
      };
    })();
    return bg;
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
        const selectedT3Events = t3AllEvents.filter((e) => e.selected);
        const t3EventItems =
          selectedT3Events.length > 0
            ? selectedT3Events.map(
                (e) => `${e.title} • ${e.date} • ${e.location}`
              )
            : t3Items.split("\n").filter(Boolean);

        const structuredT3Events =
          selectedT3Events.length > 0
            ? selectedT3Events.map((e) => ({
                title: e.title,
                date: e.date,
                location: e.location,
                weather: e.weather || null,
              }))
            : undefined;

        return {
          header: t3Header,
          items: t3EventItems,
          footer: t3Footer,
          background,
          events: structuredT3Events,
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

      case "T6":
        return {
          mainText: t6MainText,
          subText: t6SubText || undefined,
          emoji: t6Emoji || undefined,
          background,
        } as BoldTextOverlayPayload;

      case "T7":
        return {
          leftTitle: t7LeftTitle,
          leftSubtitle: t7LeftSubtitle || undefined,
          rightTitle: t7RightTitle,
          rightSubtitle: t7RightSubtitle || undefined,
          vsText: t7VsText || "VS",
          hideVsBadge: t7HideVsBadge,
          background,
        } as SplitScreenPayload;

      case "T8":
        return {
          statNumber: t8StatNumber,
          statLabel: t8StatLabel,
          quote: t8Quote || undefined,
          author: t8Author || undefined,
          background,
        } as TestimonialStatsPayload;

      case "T9":
        return {
          challengeTitle: t9ChallengeTitle,
          steps: t9Steps.filter(Boolean),
          hashtag: t9Hashtag || undefined,
          cta: t9Cta || undefined,
          background,
        } as VerticalChallengePayload;

      case "T10":
        return {
          hook: t10Hook,
          body: t10Body,
          cta: t10Cta,
          background,
        } as HookCtaPayload;

      case "T11":
        return {
          venueName: t11VenueName,
          venueType: t11VenueType,
          tagline: t11Tagline,
          location: t11Location,
          services: t11Services.length > 0 ? t11Services : undefined,
          logoUrl: t11LogoUrl,
          cta: t11Cta || undefined,
          instagram: t11Instagram,
          background,
        } as VenuePromoPayload;

      case "T12":
        return {
          eventName: t12EventName,
          giveawayTitle: t12GiveawayTitle,
          prize: t12Prize,
          drawDate: t12DrawDate || undefined,
          howToEnter: t12HowToEnter.filter((s) => s.trim()),
          cta: t12Cta || undefined,
          verificationHash: t12VerificationHash || undefined,
          background,
        } as GiveawayPromoPayload;

      case "T13":
        return {
          headline: t13Headline,
          subheadline: t13Subheadline,
          features: t13Features.filter((s) => s.trim()),
          badgeUrl: t13BadgeUrl,
          legalText: t13LegalText || undefined,
          cta: t13Cta || undefined,
          background,
        } as AppDownloadPayload;

      default:
        throw new Error(`Unknown template: ${templateKey}. Expected T1-T13.`);
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

      if (!res.ok) {
        const errorMessage = await getUploadErrorMessage(res);
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setPhotoUrl(data.file.url);
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

  const handleExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);

    try {
      // Export image (PNG with optional transparency)
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

      console.log("💾 Saving draft with payload:", {
        templateKey,
        format,
        payloadKeys: Object.keys(payload),
        hasEvents: "events" in payload,
      });

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

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Save draft failed:", errorData);
        throw new Error(errorData.error || "Failed to save draft");
      }

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

  const fetchDrafts = async () => {
    setIsLoadingDrafts(true);
    try {
      const res = await fetch("/api/instagram/drafts");
      if (!res.ok) throw new Error("Failed to fetch drafts");

      const data = await res.json();
      setDrafts(data);
    } catch (error) {
      console.error("Fetch drafts error:", error);
      toast({
        variant: "destructive",
        title: "Load failed",
        description: "Failed to load drafts.",
      });
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const loadDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/instagram/drafts/${draftId}`);
      if (!res.ok) throw new Error("Failed to load draft");

      const draft = await res.json();

      // Apply draft data to current state
      setTemplateKey(draft.templateKey as TemplateKey);
      setFormat(draft.format as InstagramFormat);

      // TODO: Apply payload data based on template type
      // This would need to set all the form fields based on draft.payload

      setShowDraftsModal(false);

      toast({
        title: "Draft loaded",
        description: "Your saved design has been loaded.",
      });
    } catch (error) {
      console.error("Load draft error:", error);
      toast({
        variant: "destructive",
        title: "Load failed",
        description: "Failed to load draft.",
      });
    }
  };

  const deleteDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/instagram/drafts/${draftId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete draft");

      // Remove from list
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));

      toast({
        title: "Draft deleted",
        description: "Your draft has been removed.",
      });
    } catch (error) {
      console.error("Delete draft error:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete draft.",
      });
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
          Instagram & TikTok Post Generator
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Create branded social media content with modern templates for
          Instagram and TikTok
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
              overlayIntensity={overlayIntensity}
              isUploadingPhoto={isUploadingPhoto}
              fileInputRef={fileInputRef}
              onBackgroundTypeChange={setBackgroundType}
              onColorChange={setSelectedColor}
              onGradientChange={setSelectedGradient}
              onOverlayIntensityChange={setOverlayIntensity}
              onPhotoUpload={handlePhotoUpload}
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
                weekStart={t3WeekStart}
                onWeekStartChange={setT3WeekStart}
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

            {templateKey === "T6" && (
              <BoldTextOverlayForm
                mainText={t6MainText}
                subText={t6SubText}
                emoji={t6Emoji}
                onMainTextChange={setT6MainText}
                onSubTextChange={setT6SubText}
                onEmojiChange={setT6Emoji}
              />
            )}

            {templateKey === "T7" && (
              <SplitScreenForm
                leftTitle={t7LeftTitle}
                leftSubtitle={t7LeftSubtitle}
                rightTitle={t7RightTitle}
                rightSubtitle={t7RightSubtitle}
                vsText={t7VsText}
                hideVsBadge={t7HideVsBadge}
                onLeftTitleChange={setT7LeftTitle}
                onLeftSubtitleChange={setT7LeftSubtitle}
                onRightTitleChange={setT7RightTitle}
                onRightSubtitleChange={setT7RightSubtitle}
                onVsTextChange={setT7VsText}
                onHideVsBadgeChange={setT7HideVsBadge}
              />
            )}

            {templateKey === "T8" && (
              <TestimonialStatsForm
                statNumber={t8StatNumber}
                statLabel={t8StatLabel}
                quote={t8Quote}
                author={t8Author}
                onStatNumberChange={setT8StatNumber}
                onStatLabelChange={setT8StatLabel}
                onQuoteChange={setT8Quote}
                onAuthorChange={setT8Author}
              />
            )}

            {templateKey === "T9" && (
              <VerticalChallengeForm
                challengeTitle={t9ChallengeTitle}
                steps={t9Steps}
                hashtag={t9Hashtag}
                cta={t9Cta}
                onChallengeTitleChange={setT9ChallengeTitle}
                onStepsChange={setT9Steps}
                onHashtagChange={setT9Hashtag}
                onCtaChange={setT9Cta}
              />
            )}

            {templateKey === "T10" && (
              <HookCtaForm
                hook={t10Hook}
                body={t10Body}
                cta={t10Cta}
                onHookChange={setT10Hook}
                onBodyChange={setT10Body}
                onCtaChange={setT10Cta}
              />
            )}

            {templateKey === "T11" && (
              <VenuePromoForm
                payload={{
                  venueName: t11VenueName,
                  venueType: t11VenueType,
                  tagline: t11Tagline,
                  location: t11Location,
                  services: t11Services,
                  logoUrl: t11LogoUrl,
                  cta: t11Cta,
                  instagram: t11Instagram,
                  background: getBackground(),
                }}
                onPayloadChange={(payload) => {
                  setT11VenueName(payload.venueName);
                  setT11VenueType(payload.venueType);
                  setT11Tagline(payload.tagline);
                  setT11Location(payload.location);
                  setT11Services(payload.services || []);
                  setT11LogoUrl(payload.logoUrl);
                  setT11Cta(payload.cta || "Descobre na Athlifyr");
                  setT11Instagram(payload.instagram);
                }}
              />
            )}

            {templateKey === "T12" && (
              <GiveawayPromoForm
                eventName={t12EventName}
                giveawayTitle={t12GiveawayTitle}
                prize={t12Prize}
                drawDate={t12DrawDate}
                howToEnter={t12HowToEnter}
                cta={t12Cta}
                verificationHash={t12VerificationHash}
                onEventNameChange={setT12EventName}
                onGiveawayTitleChange={setT12GiveawayTitle}
                onPrizeChange={setT12Prize}
                onDrawDateChange={setT12DrawDate}
                onHowToEnterChange={setT12HowToEnter}
                onCtaChange={setT12Cta}
                onVerificationHashChange={setT12VerificationHash}
              />
            )}

            {templateKey === "T13" && (
              <AppDownloadForm
                headline={t13Headline}
                subheadline={t13Subheadline}
                features={t13Features}
                badgeUrl={t13BadgeUrl}
                legalText={t13LegalText}
                cta={t13Cta}
                onHeadlineChange={setT13Headline}
                onSubheadlineChange={setT13Subheadline}
                onFeaturesChange={setT13Features}
                onBadgeUrlChange={setT13BadgeUrl}
                onLegalTextChange={setT13LegalText}
                onCtaChange={setT13Cta}
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

              <Button
                onClick={() => {
                  setShowDraftsModal(true);
                  fetchDrafts();
                }}
                variant="outline"
                className="w-full"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Load Draft
              </Button>

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
                    Export Image
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel: Preview */}
        <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-lg border bg-muted/50 p-4 sm:p-8">
          <div
            className="origin-center"
            style={{ transform: `scale(${previewScale})` }}
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
      </div>

      {/* Drafts Modal */}
      {showDraftsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowDraftsModal(false)}
        >
          <Card
            className="max-h-[80vh] w-full max-w-2xl overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Saved Drafts</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDraftsModal(false)}
              >
                ✕
              </Button>
            </div>

            {isLoadingDrafts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : drafts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No saved drafts yet. Create a design and click &quot;Save
                Draft&quot; to save it for later.
              </p>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {draft.templateKey} - {draft.format}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Saved: {new Date(draft.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadDraft(draft.id)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDraft(draft.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
