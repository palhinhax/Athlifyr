"use client";

import { useState, useEffect } from "react";
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

interface Venue {
  id: string;
  name: string;
  commissionType: "PERCENT" | "FIXED";
  commissionValue: number;
}

interface AdminVenueFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue | null;
  onSuccess: () => void;
}

export function AdminVenueFeeDialog({
  open,
  onOpenChange,
  venue,
  onSuccess,
}: AdminVenueFeeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feeFormData, setFeeFormData] = useState<{
    commissionType: "PERCENT" | "FIXED";
    commissionValue: string;
  }>({
    commissionType: "PERCENT",
    commissionValue: "",
  });

  // Update form when venue changes
  useEffect(() => {
    if (venue) {
      setFeeFormData({
        commissionType: venue.commissionType,
        commissionValue: venue.commissionValue.toString(),
      });
    }
  }, [venue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/venues/${venue.id}/fees`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionType: feeFormData.commissionType,
          commissionValue: parseInt(feeFormData.commissionValue),
        }),
      });

      if (!response.ok) throw new Error("Failed to update fees");

      toast({
        title: "Sucesso",
        description: "Comissões atualizadas com sucesso",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating fees:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar comissões",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerir Comissões</DialogTitle>
          <DialogDescription>
            Definir as comissões para {venue?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A guardar...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
