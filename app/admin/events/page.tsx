"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  X,
  ImagePlus,
  Loader2,
  Calendar,
  MapPin,
  ExternalLink,
  Search,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SportType } from "@prisma/client";
import { sportTypeLabels, formatDateShort } from "@/lib/event-utils";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  sportType: SportType;
  startDate: string;
  city: string;
  country: string;
  imageUrl: string | null;
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state for new event
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sportType: SportType.RUNNING,
    startDate: "",
    endDate: "",
    city: "",
    country: "Portugal",
    imageUrl: "",
    externalUrl: "",
  });

  const [variants, setVariants] = useState<
    { name: string; distanceKm: string; startDate: string; startTime: string }[]
  >([{ name: "", distanceKm: "", startDate: "", startTime: "" }]);

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.role === "ADMIN") {
      fetchEvents();
    }
  }, [session]);

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
      { name: "", distanceKm: "", startDate: "", startTime: "" },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      sportType: SportType.RUNNING,
      startDate: "",
      endDate: "",
      city: "",
      country: "Portugal",
      imageUrl: "",
      externalUrl: "",
    });
    setVariants([{ name: "", distanceKm: "", startDate: "", startTime: "" }]);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.startDate || !formData.city) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preenche o título, data e cidade.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          variants: variants
            .filter((v) => v.name.trim())
            .map((v) => ({
              name: v.name,
              distanceKm: v.distanceKm ? parseInt(v.distanceKm) : null,
              startDate: v.startDate || null,
              startTime: v.startTime || null,
            })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const newEvent = await response.json();
      setEvents((prev) => [newEvent, ...prev]);

      toast({
        title: "Evento criado",
        description: "O evento foi criado com sucesso.",
      });

      setIsCreateOpen(false);
      resetForm();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter events by search query
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || isLoading) {
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Eventos</h1>
            <p className="text-muted-foreground">
              {events.length} eventos no total
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Evento</DialogTitle>
                <DialogDescription>
                  Preenche os detalhes do novo evento.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nome do evento"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descrição do evento..."
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="grid gap-2">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Data de Início *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Data de Fim</Label>
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
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Lisboa"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Portugal"
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
                          {variants.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeVariant(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting ? "A criar..." : "Criar Evento"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              {searchQuery ? "Nenhum evento encontrado" : "Sem eventos"}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchQuery
                ? "Tenta uma pesquisa diferente."
                : "Cria o primeiro evento para começar."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Evento
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-40 w-full">
                    <Image
                      src={event.imageUrl || "/placeholder-event.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      {sportTypeLabels[event.sportType]}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-1 font-semibold">
                      {event.title}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDateShort(new Date(event.startDate))}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {event.city}, {event.country}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Ver evento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
