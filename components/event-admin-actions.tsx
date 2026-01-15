"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  ImagePlus,
  Loader2,
  Globe,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SportType, Language } from "@prisma/client";

// Languages configuration
const SUPPORTED_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

interface EventTranslation {
  language: Language;
  title: string;
  description: string;
  city: string;
  metaTitle: string;
  metaDescription: string;
}

interface VariantTranslation {
  language: Language;
  name: string;
  description: string;
}

interface VariantFormData {
  id?: string;
  name: string;
  distanceKm: string;
  startDate: string;
  startTime: string;
  translations: Record<Language, VariantTranslation>;
}

interface EventVariant {
  id: string;
  name: string;
  distanceKm: number | null;
  startDate: Date | null;
  startTime: string | null;
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
    variants: EventVariant[];
  };
}

export function EventAdminActions({ event }: EventAdminActionsProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Ficheiro inválido",
        description: "Por favor seleciona uma imagem.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ficheiro muito grande",
        description: "A imagem deve ter no máximo 5MB.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "events");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadRes.json();
      setFormData((prev) => ({ ...prev, imageUrl: uploadData.file.url }));

      toast({
        title: "Imagem carregada",
        description: "A imagem foi carregada com sucesso.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a imagem.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleVariantChange = (
    index: number,
    field: "name" | "distanceKm" | "startDate" | "startTime",
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
        variants: variants
          .filter((v) => v.name.trim())
          .map((v) => ({
            id: v.id,
            name: v.name,
            distanceKm: v.distanceKm ? parseInt(v.distanceKm) : null,
            startDate: v.startDate || null,
            startTime: v.startTime || null,
            translations: Object.values(v.translations).filter(
              (t) => t.name.trim() || t.description?.trim()
            ),
          })),
        translations: translationsToSave,
      };
      console.log("Updating event with payload:", payload);

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      toast({
        title: "Evento atualizado",
        description: "As alterações foram guardadas com sucesso.",
      });

      setIsEditOpen(false);
      router.refresh();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento.",
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
        title: "Evento eliminado",
        description: "O evento foi eliminado com sucesso.",
      });

      router.push("/events");
      router.refresh();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o evento.",
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
          <Button variant="outline" size="sm" className="gap-1 px-2 sm:px-3">
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Faz alterações aos detalhes do evento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* TODO: Update to multi-select for sportTypes array */}
            {/* <div className="grid gap-2">
              <Label htmlFor="sportType">Modalidade</Label>
              <select
                id="sportType"
                name="sportType"
                value={formData.sportType}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {Object.values(SportType).map((type) => (
                  <option key={type} value={type}>
                    {sportTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Data de Fim (opcional)</Label>
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
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Imagem do Evento</Label>
              {formData.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, imageUrl: "" }))
                    }
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="mr-2 h-4 w-4" />
                  )}
                  {formData.imageUrl ? "Alterar imagem" : "Carregar imagem"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ou insere um URL diretamente:
              </p>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="externalUrl">URL Externo (inscrições)</Label>
              <Input
                id="externalUrl"
                name="externalUrl"
                value={formData.externalUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            {/* Location Coordinates */}
            <div className="grid gap-4 rounded-lg border p-4">
              <h4 className="font-medium">Localização no Mapa</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="Ex: 41.5518"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="Ex: -8.4229"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="googleMapsUrl">
                  URL do Google Maps (opcional)
                </Label>
                <Input
                  id="googleMapsUrl"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Dica: Pesquisa o local no Google Maps, clica com o botão direito
                e copia as coordenadas.
              </p>
            </div>

            {/* Variants */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Variantes / Distâncias</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Nome (ex: 21km, Singles Pro)"
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(index, "name", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="km"
                        value={variant.distanceKm}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "distanceKm",
                            e.target.value
                          )
                        }
                        className="w-20"
                        type="number"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">
                          Data (opcional)
                        </Label>
                        <Input
                          type="date"
                          value={variant.startDate}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-xs text-muted-foreground">
                          Hora (opcional)
                        </Label>
                        <Input
                          type="time"
                          value={variant.startTime}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Variant Translations */}
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                        <Globe className="mr-1 inline h-3 w-3" />
                        Traduções desta variante
                      </summary>
                      <div className="mt-2 space-y-2 rounded-md bg-muted/50 p-2">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <div
                            key={lang.code}
                            className="flex items-center gap-2"
                          >
                            <span className="w-8 text-sm">{lang.flag}</span>
                            <Input
                              placeholder={`Nome em ${lang.name}`}
                              value={
                                variant.translations[lang.code]?.name || ""
                              }
                              onChange={(e) =>
                                handleVariantTranslationChange(
                                  index,
                                  lang.code,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="flex-1 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>

            {/* Translations Section */}
            <div className="grid gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Traduções</h4>
                {isLoadingTranslations && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Adiciona traduções para o evento aparecer corretamente em
                diferentes idiomas. O conteúdo original (PT) é usado como
                fallback.
              </p>

              <Tabs
                value={activeTranslationTab}
                onValueChange={(v) => setActiveTranslationTab(v as Language)}
              >
                <TabsList className="grid w-full grid-cols-6">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <TabsTrigger
                      key={lang.code}
                      value={lang.code}
                      className="text-xs"
                    >
                      <span className="mr-1">{lang.flag}</span>
                      <span className="hidden sm:inline">
                        {lang.code.toUpperCase()}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {SUPPORTED_LANGUAGES.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code}>
                    <div className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`title-${lang.code}`}>
                          Título ({lang.name})
                        </Label>
                        <Input
                          id={`title-${lang.code}`}
                          value={translations[lang.code]?.title || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              lang.code,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder={`Título em ${lang.name}`}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`description-${lang.code}`}>
                          Descrição ({lang.name})
                        </Label>
                        <textarea
                          id={`description-${lang.code}`}
                          value={translations[lang.code]?.description || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              lang.code,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder={`Descrição em ${lang.name}`}
                          className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`city-${lang.code}`}>
                          Cidade ({lang.name})
                        </Label>
                        <Input
                          id={`city-${lang.code}`}
                          value={translations[lang.code]?.city || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              lang.code,
                              "city",
                              e.target.value
                            )
                          }
                          placeholder={`Nome da cidade em ${lang.name}`}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`metaTitle-${lang.code}`}>
                          Meta Title SEO ({lang.name})
                        </Label>
                        <Input
                          id={`metaTitle-${lang.code}`}
                          value={translations[lang.code]?.metaTitle || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              lang.code,
                              "metaTitle",
                              e.target.value
                            )
                          }
                          placeholder={`Meta title para SEO em ${lang.name}`}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`metaDescription-${lang.code}`}>
                          Meta Description SEO ({lang.name})
                        </Label>
                        <Input
                          id={`metaDescription-${lang.code}`}
                          value={translations[lang.code]?.metaDescription || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              lang.code,
                              "metaDescription",
                              e.target.value
                            )
                          }
                          placeholder={`Meta description para SEO em ${lang.name}`}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "A guardar..." : "Guardar alterações"}
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
            className="gap-1 px-2 sm:px-3"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Evento</DialogTitle>
            <DialogDescription>
              Tens a certeza que queres eliminar este evento? Esta ação não pode
              ser revertida. Todos os dados associados (comentários, posts,
              inscrições) serão eliminados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "A eliminar..." : "Sim, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
