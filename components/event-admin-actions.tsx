"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Building2, X, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SportType, Language } from "@prisma/client";
import { useTranslations } from "next-intl";
import { EventImageUpload } from "@/components/event-image-upload";
import { SportTypeSelector } from "@/components/sport-type-selector";
import {
  EventVariantsManager,
  type VariantFormData,
  type VariantTranslation,
} from "@/components/event-variants-manager";
import {
  EventTranslationsEditor,
  type EventTranslation,
} from "@/components/event-translations-editor";
import { EventLocationFields } from "@/components/event-location-fields";

// Languages configuration
const SUPPORTED_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

interface EventVariant {
  id: string;
  name: string;
  distanceKm: number | null;
  elevationGainM: number | null;
  startDate: Date | null;
  startTime: string | null;
}

interface FeaturedVenue {
  id: string;
  slug: string;
  name: string;
  type: string;
  logo: string | null;
  city: string | null;
  country: string;
}

interface EventAdminActionsProps {
  event: {
    id: string;
    title: string;
    description: string;
    sportTypes: SportType[];
    startDate: Date;
    endDate: Date | null;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    googleMapsUrl: string | null;
    imageUrl: string | null;
    externalUrl: string | null;
    stravaRouteEmbed: string | null;
    featuredVenueId: string | null;
    featuredVenue: FeaturedVenue | null;
    variants: EventVariant[];
  };
}

export function EventAdminActions({ event }: EventAdminActionsProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("admin.events");

  // Featured venue state
  const [selectedVenue, setSelectedVenue] = useState<FeaturedVenue | null>(
    event.featuredVenue
  );
  const [venueSearch, setVenueSearch] = useState("");
  const [venueSearchResults, setVenueSearchResults] = useState<FeaturedVenue[]>(
    []
  );
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    sportTypes: event.sportTypes,
    startDate: event.startDate.toISOString().split("T")[0],
    endDate: event.endDate?.toISOString().split("T")[0] || "",
    city: event.city,
    country: event.country,
    latitude: event.latitude?.toString() || "",
    longitude: event.longitude?.toString() || "",
    googleMapsUrl: event.googleMapsUrl || "",
    imageUrl: event.imageUrl || "",
    externalUrl: event.externalUrl || "",
    stravaRouteEmbed: event.stravaRouteEmbed || "",
    featuredVenueId: event.featuredVenueId || "",
  });

  // Helper to create empty variant translations
  const createEmptyVariantTranslations = (): Record<
    Language,
    VariantTranslation
  > => {
    const trans: Record<Language, VariantTranslation> = {} as Record<
      Language,
      VariantTranslation
    >;
    SUPPORTED_LANGUAGES.forEach((lang) => {
      trans[lang.code] = {
        language: lang.code,
        name: "",
        description: "",
      };
    });
    return trans;
  };

  const [variants, setVariants] = useState<VariantFormData[]>(
    event.variants.map((v) => ({
      id: v.id,
      name: v.name,
      distanceKm: v.distanceKm?.toString() || "",
      elevationGainM: v.elevationGainM?.toString() || "",
      startDate: v.startDate
        ? new Date(v.startDate).toISOString().split("T")[0]
        : "",
      startTime: v.startTime || "",
      translations: createEmptyVariantTranslations(),
    }))
  );

  // Translations state
  const [translations, setTranslations] = useState<
    Record<Language, EventTranslation>
  >(() => {
    const initial: Record<Language, EventTranslation> = {} as Record<
      Language,
      EventTranslation
    >;
    SUPPORTED_LANGUAGES.forEach((lang) => {
      initial[lang.code] = {
        language: lang.code,
        title: "",
        description: "",
        city: "",
        metaTitle: "",
        metaDescription: "",
      };
    });
    return initial;
  });
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);
  const [activeTranslationTab, setActiveTranslationTab] = useState<Language>(
    "en" as Language
  );

  // Fetch translations when edit dialog opens
  const fetchTranslations = useCallback(async () => {
    setIsLoadingTranslations(true);
    try {
      const response = await fetch(`/api/events/${event.id}/translations`);
      if (response.ok) {
        const data = await response.json();

        // Event translations
        const translationsMap: Record<Language, EventTranslation> =
          {} as Record<Language, EventTranslation>;
        SUPPORTED_LANGUAGES.forEach((lang) => {
          const existing = data.translations?.find(
            (t: EventTranslation) => t.language === lang.code
          );
          translationsMap[lang.code] = existing || {
            language: lang.code,
            title: "",
            description: "",
            city: "",
            metaTitle: "",
            metaDescription: "",
          };
        });
        setTranslations(translationsMap);

        // Variant translations
        if (data.variantTranslations) {
          setVariants((prev) =>
            prev.map((v) => {
              if (!v.id) return v;
              const variantTrans = data.variantTranslations[v.id];
              if (!variantTrans) return v;

              const newTranslations = { ...v.translations };
              SUPPORTED_LANGUAGES.forEach((lang) => {
                const existing = variantTrans.find(
                  (t: VariantTranslation) => t.language === lang.code
                );
                if (existing) {
                  newTranslations[lang.code] = {
                    language: lang.code,
                    name: existing.name || "",
                    description: existing.description || "",
                  };
                }
              });
              return { ...v, translations: newTranslations };
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
    } finally {
      setIsLoadingTranslations(false);
    }
  }, [event.id]);

  useEffect(() => {
    if (isEditOpen) {
      fetchTranslations();
    }
  }, [isEditOpen, fetchTranslations]);

  const handleTranslationChange = (
    language: Language,
    field: keyof EventTranslation,
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value,
      },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSportType = (sportType: SportType) => {
    setFormData((prev) => {
      const currentSports = prev.sportTypes;
      if (currentSports.includes(sportType)) {
        // Remove if already selected (but keep at least one)
        if (currentSports.length > 1) {
          return {
            ...prev,
            sportTypes: currentSports.filter((s) => s !== sportType),
          };
        }
        return prev;
      } else {
        // Add if not selected
        return {
          ...prev,
          sportTypes: [...currentSports, sportType],
        };
      }
    });
  };

  const handleVariantChange = (
    index: number,
    field: "name" | "distanceKm" | "elevationGainM" | "startDate" | "startTime",
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        distanceKm: "",
        elevationGainM: "",
        startDate: "",
        startTime: "",
        translations: createEmptyVariantTranslations(),
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantTranslationChange = (
    variantIndex: number,
    language: Language,
    field: keyof VariantTranslation,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              translations: {
                ...v.translations,
                [language]: {
                  ...v.translations[language],
                  [field]: value,
                },
              },
            }
          : v
      )
    );
  };

  // Venue search function
  const searchVenues = useCallback(async (query: string) => {
    if (query.length < 2) {
      setVenueSearchResults([]);
      return;
    }

    setIsSearchingVenues(true);
    try {
      const response = await fetch(
        `/api/venues?search=${encodeURIComponent(query)}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setVenueSearchResults(
          data.venues?.map((v: FeaturedVenue) => ({
            id: v.id,
            slug: v.slug,
            name: v.name,
            type: v.type,
            logo: v.logo,
            city: v.city,
            country: v.country,
          })) || []
        );
      }
    } catch (error) {
      console.error("Error searching venues:", error);
    } finally {
      setIsSearchingVenues(false);
    }
  }, []);

  // Debounced venue search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (venueSearch) {
        searchVenues(venueSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [venueSearch, searchVenues]);

  const handleSelectVenue = (venue: FeaturedVenue) => {
    setSelectedVenue(venue);
    setFormData((prev) => ({ ...prev, featuredVenueId: venue.id }));
    setVenueSearch("");
    setVenueSearchResults([]);
  };

  const handleRemoveVenue = () => {
    setSelectedVenue(null);
    setFormData((prev) => ({ ...prev, featuredVenueId: "" }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // Prepare translations - only include non-empty ones
      const translationsToSave = Object.values(translations).filter(
        (t) => t.title.trim() || t.description.trim()
      );

      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        featuredVenueId: formData.featuredVenueId || null,
        variants: variants
          .filter((v) => v.name.trim())
          .map((v) => ({
            id: v.id,
            name: v.name,
            distanceKm: v.distanceKm ? parseFloat(v.distanceKm) : null,
            elevationGainM: v.elevationGainM
              ? parseFloat(v.elevationGainM)
              : null,
            startDate: v.startDate || null,
            startTime: v.startTime || null,
            translations: Object.values(v.translations).filter(
              (t) => t.name.trim() || t.description?.trim()
            ),
          })),
        translations: translationsToSave,
      };

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      toast({
        title: t("toast.eventUpdated"),
        description: t("toast.eventUpdatedDesc"),
      });

      setIsEditOpen(false);
      router.refresh();
    } catch {
      toast({
        title: t("toast.updateError"),
        description: t("toast.updateErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast({
        title: t("toast.eventDeleted"),
        description: t("toast.eventDeletedDesc"),
      });

      router.push("/events");
      router.refresh();
    } catch {
      toast({
        title: t("toast.deleteError"),
        description: t("toast.deleteErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-white/20 bg-black/30 px-2 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white sm:px-3"
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">{t("editButton")}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px] lg:max-w-[1100px]">
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
            <DialogDescription>{t("editDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t("titleLabel")}</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{t("descriptionLabel")}</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <SportTypeSelector
              selectedSportTypes={formData.sportTypes}
              onToggleSportType={toggleSportType}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">{t("startDateLabel")}</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">{t("endDateLabel")}</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">{t("cityLabel")}</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">{t("countryLabel")}</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <EventImageUpload
              imageUrl={formData.imageUrl}
              onImageUrlChange={(url) =>
                setFormData((prev) => ({ ...prev, imageUrl: url }))
              }
            />

            <div className="grid gap-2">
              <Label htmlFor="externalUrl">{t("externalUrlLabel")}</Label>
              <Input
                id="externalUrl"
                name="externalUrl"
                value={formData.externalUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stravaRouteEmbed">{t("stravaEmbedLabel")}</Label>
              <textarea
                id="stravaRouteEmbed"
                name="stravaRouteEmbed"
                value={formData.stravaRouteEmbed}
                onChange={handleInputChange}
                placeholder='<iframe height="405" width="590" frameborder="0" allowtransparency="true" scrolling="no" src="https://www.strava.com/routes/..."></iframe>'
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="text-xs text-muted-foreground">
                {t("stravaEmbedHelp")}
              </p>
            </div>

            {/* Featured Venue Selector */}
            <div className="grid gap-2">
              <Label>{t("featuredVenueLabel")}</Label>
              {selectedVenue ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                    {selectedVenue.logo ? (
                      <img
                        src={selectedVenue.logo}
                        alt={selectedVenue.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{selectedVenue.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedVenue.city}, {selectedVenue.country}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveVenue}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={venueSearch}
                      onChange={(e) => setVenueSearch(e.target.value)}
                      placeholder={t("searchVenuePlaceholder")}
                      className="pl-10"
                    />
                  </div>
                  {isSearchingVenues && (
                    <div className="flex items-center justify-center py-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  )}
                  {venueSearchResults.length > 0 && (
                    <div className="max-h-[200px] overflow-y-auto rounded-md border">
                      {venueSearchResults.map((venue) => (
                        <button
                          key={venue.id}
                          type="button"
                          onClick={() => handleSelectVenue(venue)}
                          className="flex w-full items-center gap-3 p-2 text-left transition-colors hover:bg-muted"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
                            {venue.logo ? (
                              <img
                                src={venue.logo}
                                alt={venue.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {venue.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {venue.city}, {venue.country}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {t("featuredVenueHelp")}
              </p>
            </div>

            <EventLocationFields
              latitude={formData.latitude}
              longitude={formData.longitude}
              googleMapsUrl={formData.googleMapsUrl}
              onLatitudeChange={(value) =>
                setFormData((prev) => ({ ...prev, latitude: value }))
              }
              onLongitudeChange={(value) =>
                setFormData((prev) => ({ ...prev, longitude: value }))
              }
              onGoogleMapsUrlChange={(value) =>
                setFormData((prev) => ({ ...prev, googleMapsUrl: value }))
              }
            />

            <EventVariantsManager
              variants={variants}
              onVariantChange={handleVariantChange}
              onAddVariant={addVariant}
              onRemoveVariant={removeVariant}
              onVariantTranslationChange={handleVariantTranslationChange}
            />

            <EventTranslationsEditor
              translations={translations}
              activeTab={activeTranslationTab}
              isLoading={isLoadingTranslations}
              onTranslationChange={handleTranslationChange}
              onTabChange={setActiveTranslationTab}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isLoading}
            >
              {t("cancelButton")}
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? t("actions.saving") : t("actions.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1 bg-red-600/80 px-2 backdrop-blur-sm hover:bg-red-700/90 sm:px-3"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("deleteButton")}</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>{t("deleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isLoading}
            >
              {t("cancelButton")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? t("deletingButton") : t("confirmDeleteButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
