"use client";

import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type VenueType =
  | "CROSSFIT_BOX"
  | "CROSSTRAINING_BOX"
  | "GYM"
  | "PT_STUDIO"
  | "MASSAGE"
  | "PHYSIO"
  | "NUTRITION"
  | "OTHER";

interface VenueFormData {
  name: string;
  slug: string;
  type: VenueType;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
}

const INITIAL_FORM_DATA: VenueFormData = {
  name: "",
  slug: "",
  type: "CROSSFIT_BOX",
  description: "",
  address: "",
  city: "",
  country: "Portugal",
  latitude: "",
  longitude: "",
};

interface AdminVenueCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AdminVenueCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: AdminVenueCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VenueFormData>(INITIAL_FORM_DATA);

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

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      const response = await fetch("/api/admin/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create venue");
      }

      toast({
        title: "Sucesso",
        description: "Venue criado com sucesso",
      });

      onOpenChange(false);
      resetForm();
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao criar venue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Label htmlFor="slug">Slug (gerado automaticamente)</Label>
            <Input id="slug" value={formData.slug} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: VenueType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CROSSFIT_BOX">CrossFit Box</SelectItem>
                <SelectItem value="CROSSTRAINING_BOX">
                  CrossTraining Box
                </SelectItem>
                <SelectItem value="GYM">Ginásio</SelectItem>
                <SelectItem value="PT_STUDIO">Estúdio PT</SelectItem>
                <SelectItem value="MASSAGE">Massagem</SelectItem>
                <SelectItem value="PHYSIO">Fisioterapia</SelectItem>
                <SelectItem value="NUTRITION">Nutrição</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
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
              placeholder="Breve descrição do venue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Morada *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Rua Exemplo, 123"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                placeholder="38.7223"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
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
                onOpenChange(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A criar...
                </>
              ) : (
                "Criar Venue"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
