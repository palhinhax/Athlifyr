"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Loader2,
  MapPin,
  Edit,
  Trash2,
  Building2,
  UserPlus,
  Search,
  DollarSign,
  Power,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminOwnershipClaims } from "@/components/admin-ownership-claims";
import { Badge } from "@/components/ui/badge";

// Local type definitions instead of importing from Prisma
type VenueType =
  | "CROSSFIT_BOX"
  | "GYM"
  | "PT_STUDIO"
  | "MASSAGE"
  | "PHYSIO"
  | "NUTRITION"
  | "OTHER";

interface Venue {
  id: string;
  name: string;
  slug: string;
  type: VenueType;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  commissionType: "PERCENT" | "FIXED";
  commissionValue: number;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

const venueTypeLabels: Record<string, string> = {
  CROSSFIT_BOX: "CrossFit Box",
  CROSSTRAINING_BOX: "CrossTraining Box",
  GYM: "Ginásio",
  PT_STUDIO: "Estúdio PT",
  MASSAGE: "Massagem",
  PHYSIO: "Fisioterapia",
  NUTRITION: "Nutrição",
  OTHER: "Outro",
};

// Extracted constants to avoid duplicated literals (S1192)
const TOAST_SUCCESS = "Sucesso";
const TOAST_ERROR = "Erro";
const JSON_HEADERS = { "Content-Type": "application/json" } as const;
const NO_NAME = "Sem nome";

export default function AdminVenuesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  // Fee form state
  const [feeFormData, setFeeFormData] = useState<{
    commissionType: "PERCENT" | "FIXED";
    commissionValue: string;
  }>({
    commissionType: "PERCENT",
    commissionValue: "",
  });

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    type: VenueType;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  }>({
    name: "",
    slug: "",
    type: "CROSSFIT_BOX",
    description: "",
    address: "",
    city: "",
    country: "Portugal",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetchVenues();
  }, [session, status, router]);

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/admin/venues");
      if (!response.ok) throw new Error("Failed to fetch venues");
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error("Error fetching venues:", error);
      toast({
        title: TOAST_ERROR,
        description: "Erro ao carregar venues",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    const normalized = name
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, "")
      .replaceAll(/[^a-z0-9]/g, "-");
    // Collapse consecutive dashes and trim edges without regex quantifiers
    return normalized.split("-").filter(Boolean).join("-");
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: generateSlug(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude
          ? Number.parseFloat(formData.latitude)
          : null,
        longitude: formData.longitude
          ? Number.parseFloat(formData.longitude)
          : null,
      };

      const response = await fetch("/api/admin/venues", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create venue");
      }

      toast({
        title: TOAST_SUCCESS,
        description: "Venue criado com sucesso",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchVenues();
    } catch (error) {
      console.error("Error creating venue:", error);
      toast({
        title: TOAST_ERROR,
        description:
          error instanceof Error ? error.message : "Erro ao criar venue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (venueId: string) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar venue",
      description:
        "Tens a certeza que queres eliminar este venue? Esta ação não pode ser desfeita.",
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        try {
          const response = await fetch(`/api/admin/venues?id=${venueId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete venue");

          toast({
            title: TOAST_SUCCESS,
            description: "Venue eliminado com sucesso",
          });

          fetchVenues();
        } catch (error) {
          console.error("Error deleting venue:", error);
          toast({
            title: TOAST_ERROR,
            description: "Erro ao eliminar venue",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleToggleActive = async (venue: Venue) => {
    const newStatus = !venue.isActive;
    const action = newStatus ? "ativar" : "desativar";

    setConfirmDialog({
      open: true,
      title: `${newStatus ? "Ativar" : "Desativar"} venue`,
      description: `Tens a certeza que queres ${action} o venue "${venue.name}"?`,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        try {
          const response = await fetch(`/api/admin/venues/${venue.id}/status`, {
            method: "PATCH",
            headers: JSON_HEADERS,
            body: JSON.stringify({ isActive: newStatus }),
          });

          if (!response.ok) throw new Error(`Failed to ${action} venue`);

          toast({
            title: TOAST_SUCCESS,
            description: `Venue ${newStatus ? "ativado" : "desativado"} com sucesso`,
          });

          fetchVenues();
        } catch (error) {
          console.error("Error toggling venue status:", error);
          toast({
            title: TOAST_ERROR,
            description: `Erro ao ${action} venue`,
            variant: "destructive",
          });
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: "CROSSFIT_BOX",
      description: "",
      address: "",
      city: "",
      country: "Portugal",
      latitude: "",
      longitude: "",
    });
  };

  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchedUsers([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to search users");
      const users = await response.json();
      setSearchedUsers(users);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: TOAST_ERROR,
        description: "Erro ao procurar utilizadores",
        variant: "destructive",
      });
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleSetOwner = async (userId: string) => {
    if (!selectedVenue) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/venues/${selectedVenue.id}/set-owner`,
        {
          method: "POST",
          headers: JSON_HEADERS,
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) throw new Error("Failed to set owner");

      toast({
        title: TOAST_SUCCESS,
        description: "Owner definido com sucesso",
      });

      setIsOwnerDialogOpen(false);
      setUserSearch("");
      setSearchedUsers([]);
      fetchVenues();
    } catch (error) {
      console.error("Error setting owner:", error);
      toast({
        title: TOAST_ERROR,
        description: "Erro ao definir owner",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveOwner = async () => {
    if (!selectedVenue) return;

    setConfirmDialog({
      open: true,
      title: "Remover owner",
      description: "Tens a certeza que queres remover o owner desta venue?",
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        setIsSubmitting(true);
        try {
          const response = await fetch(
            `/api/admin/venues/${selectedVenue.id}/remove-owner`,
            {
              method: "POST",
            }
          );

          if (!response.ok) throw new Error("Failed to remove owner");

          toast({
            title: TOAST_SUCCESS,
            description: "Owner removido com sucesso",
          });

          setIsOwnerDialogOpen(false);
          fetchVenues();
        } catch (error) {
          console.error("Error removing owner:", error);
          toast({
            title: TOAST_ERROR,
            description: "Erro ao remover owner",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const openOwnerDialog = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsOwnerDialogOpen(true);
    setUserSearch("");
    setSearchedUsers([]);
  };

  const openFeeDialog = (venue: Venue) => {
    setSelectedVenue(venue);
    setFeeFormData({
      commissionType: venue.commissionType,
      commissionValue: venue.commissionValue.toString(),
    });
    setIsFeeDialogOpen(true);
  };

  const handleFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/venues/${selectedVenue.id}/fees`,
        {
          method: "PATCH",
          headers: JSON_HEADERS,
          body: JSON.stringify({
            commissionType: feeFormData.commissionType,
            commissionValue: Number.parseInt(feeFormData.commissionValue),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update fees");

      toast({
        title: TOAST_SUCCESS,
        description: "Comissões atualizadas com sucesso",
      });

      setIsFeeDialogOpen(false);
      fetchVenues();
    } catch (error) {
      console.error("Error updating fees:", error);
      toast({
        title: TOAST_ERROR,
        description: "Erro ao atualizar comissões",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Ownership Claims Section */}
      <div className="mb-8">
        <AdminOwnershipClaims locale={locale} />
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Gestão de Venues</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Criar e gerir ginásios, boxes e estúdios
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Venue</DialogTitle>
              <DialogDescription>
                Preenche os dados para criar um novo venue
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="CrossFit Lisboa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="crossfit-lisboa"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL: /venues/{formData.slug || "slug"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: VenueType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(venueTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição do venue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Morada *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Rua exemplo, 123"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Lisboa"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Portugal"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">
                    Latitude
                    <span className="ml-1 text-xs text-muted-foreground">
                      (ex: 38.7223)
                    </span>
                  </Label>
                  <Input
                    id="latitude"
                    type="text"
                    inputMode="decimal"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="38.7223"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">
                    Longitude
                    <span className="ml-1 text-xs text-muted-foreground">
                      (ex: -9.1393)
                    </span>
                  </Label>
                  <Input
                    id="longitude"
                    type="text"
                    inputMode="decimal"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    placeholder="-9.1393"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                      criar...
                    </>
                  ) : (
                    "Criar Venue"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Set Owner Dialog */}
        <Dialog open={isOwnerDialogOpen} onOpenChange={setIsOwnerDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Gerir Owner</DialogTitle>
              <DialogDescription>
                Ver, definir ou remover o proprietário para{" "}
                {selectedVenue?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Current Owner Section */}
              {selectedVenue?.owner && (
                <div className="rounded-md border bg-muted/50 p-4">
                  <p className="mb-2 text-sm font-medium">Owner Atual:</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {selectedVenue.owner.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedVenue.owner.image}
                          alt={selectedVenue.owner.name || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {selectedVenue.owner.name?.[0] ||
                            selectedVenue.owner.email?.[0] ||
                            "?"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {selectedVenue.owner.name || NO_NAME}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedVenue.owner.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveOwner()}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="userSearch">
                  {selectedVenue?.owner
                    ? "Substituir Owner"
                    : "Procurar Utilizador"}
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="userSearch"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    placeholder="Nome ou email do utilizador"
                    className="pl-10"
                  />
                </div>
              </div>

              {searchingUsers && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {searchedUsers.length > 0 && (
                <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-md border p-2">
                  {searchedUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSetOwner(user.id)}
                      disabled={isSubmitting}
                      className="flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {user.name?.[0] || user.email?.[0] || "?"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {user.name || NO_NAME}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {userSearch.length >= 2 &&
                !searchingUsers &&
                searchedUsers.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhum utilizador encontrado
                  </div>
                )}

              {userSearch.length < 2 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Digite pelo menos 2 caracteres para procurar
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOwnerDialogOpen(false);
                  setUserSearch("");
                  setSearchedUsers([]);
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Fee Management Dialog */}
        <Dialog open={isFeeDialogOpen} onOpenChange={setIsFeeDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Gerir Comissões</DialogTitle>
              <DialogDescription>
                Definir as comissões para {selectedVenue?.name}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFeeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commissionType">Tipo de Comissão</Label>
                <Select
                  value={feeFormData.commissionType}
                  onValueChange={(value: "PERCENT" | "FIXED") =>
                    setFeeFormData({ ...feeFormData, commissionType: value })
                  }
                >
                  <SelectTrigger id="commissionType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Percentagem (%)</SelectItem>
                    <SelectItem value="FIXED">Valor Fixo (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionValue">
                  Valor da Comissão
                  {feeFormData.commissionType === "PERCENT"
                    ? " (%)"
                    : " (cêntimos)"}
                </Label>
                <Input
                  id="commissionValue"
                  type="number"
                  min="0"
                  step={feeFormData.commissionType === "PERCENT" ? "0.01" : "1"}
                  value={feeFormData.commissionValue}
                  onChange={(e) =>
                    setFeeFormData({
                      ...feeFormData,
                      commissionValue: e.target.value,
                    })
                  }
                  placeholder={
                    feeFormData.commissionType === "PERCENT" ? "0.00" : "0"
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {feeFormData.commissionType === "PERCENT"
                    ? "Percentagem sobre o valor da transação (ex: 10.00 = 10%)"
                    : "Valor fixo em cêntimos (ex: 1000 = 10.00€)"}
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFeeDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                      guardar...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {venues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Nenhum venue encontrado
            </h3>
            <p className="mb-4 text-center text-muted-foreground">
              Cria o teu primeiro venue para começar
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Venue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Card
              key={venue.id}
              className={`relative ${!venue.isActive ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/venues/${venue.slug}`}
                        className="truncate text-lg font-semibold hover:text-primary hover:underline"
                      >
                        {venue.name}
                      </Link>
                      <Badge
                        variant={venue.isActive ? "default" : "secondary"}
                        className={`shrink-0 ${venue.isActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"}`}
                      >
                        {venue.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {venueTypeLabels[venue.type]}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(venue)}
                      title={venue.isActive ? "Desativar" : "Ativar"}
                    >
                      <Power
                        className={`h-4 w-4 ${venue.isActive ? "text-green-500" : "text-gray-400"}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openFeeDialog(venue)}
                      title="Gerir Comissões"
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openOwnerDialog(venue)}
                      title="Definir Owner"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/${locale}/venues/${venue.slug}`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(venue.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  {venue.description && (
                    <p className="line-clamp-2 text-muted-foreground">
                      {venue.description}
                    </p>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate">{venue.address}</p>
                      <p className="text-muted-foreground">
                        {venue.city}, {venue.country}
                      </p>
                    </div>
                  </div>
                  {(venue.latitude || venue.longitude) && (
                    <div className="pt-2 text-xs text-muted-foreground">
                      <span className="block truncate">
                        📍 {venue.latitude?.toFixed(4)},{" "}
                        {venue.longitude?.toFixed(4)}
                      </span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/50 p-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 text-xs">
                      <p className="font-medium">
                        Comissão:{" "}
                        {venue.commissionType === "PERCENT"
                          ? `${(venue.commissionValue / 100).toFixed(2)}%`
                          : `${(venue.commissionValue / 100).toFixed(2)}€`}
                      </p>
                      <p className="text-muted-foreground">
                        {venue.commissionType === "PERCENT"
                          ? "Percentagem"
                          : "Valor fixo"}
                      </p>
                    </div>
                  </div>
                  {/* Owner Info */}
                  <div className="mt-2 flex items-center gap-2 rounded-md border bg-muted/50 p-2">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 text-xs">
                      {venue.owner ? (
                        <>
                          <p className="font-medium">
                            Owner: {venue.owner.name || NO_NAME}
                          </p>
                          <p className="text-muted-foreground">
                            {venue.owner.email}
                          </p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">
                          Sem owner definido
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDialog.onConfirm}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
