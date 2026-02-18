"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2, Building2 } from "lucide-react";
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
import { AdminVenueCard } from "@/components/admin/admin-venue-card";
import { AdminVenueCreateDialog } from "@/components/admin/admin-venue-create-dialog";
import { AdminVenueOwnerDialog } from "@/components/admin/admin-venue-owner-dialog";
import { AdminVenueFeeDialog } from "@/components/admin/admin-venue-fee-dialog";

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
  createdAt: string;
}

export default function AdminVenuesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    venueId: string;
  }>({ open: false, venueId: "" });

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
        title: "Erro",
        description: "Erro ao carregar venues",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (venueId: string) => {
    setConfirmDialog({ open: true, venueId });
  };

  const executeDelete = async (venueId: string) => {
    setConfirmDialog({ open: false, venueId: "" });

    try {
      const response = await fetch(`/api/admin/venues?id=${venueId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete venue");

      toast({
        title: "Sucesso",
        description: "Venue eliminado com sucesso",
      });

      fetchVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast({
        title: "Erro",
        description: "Erro ao eliminar venue",
        variant: "destructive",
      });
    }
  };

  const openOwnerDialog = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsOwnerDialogOpen(true);
  };

  const openFeeDialog = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsFeeDialogOpen(true);
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
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Gestão de Venues</h1>
          <p className="text-muted-foreground">
            Criar e gerir ginásios, boxes e estúdios
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Venue
        </Button>

        {/* Create Dialog */}
        <AdminVenueCreateDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={fetchVenues}
        />

        {/* Owner Dialog */}
        <AdminVenueOwnerDialog
          open={isOwnerDialogOpen}
          onOpenChange={setIsOwnerDialogOpen}
          venue={selectedVenue}
          onSuccess={fetchVenues}
        />

        {/* Fee Dialog */}
        <AdminVenueFeeDialog
          open={isFeeDialogOpen}
          onOpenChange={setIsFeeDialogOpen}
          venue={selectedVenue}
          onSuccess={fetchVenues}
        />
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
            <AdminVenueCard
              key={venue.id}
              venue={venue}
              onOpenFeeDialog={openFeeDialog}
              onOpenOwnerDialog={openOwnerDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar venue</AlertDialogTitle>
            <AlertDialogDescription>
              Tens a certeza que queres eliminar este venue? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => executeDelete(confirmDialog.venueId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
