"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface EventVariant {
  id: string;
  name: string;
  distanceKm?: number | null;
}

interface Participation {
  id: string;
  status: string;
  variantId?: string | null;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
  } | null;
}

interface EventRegistrationProps {
  eventId: string;
  variants?: EventVariant[];
}

export function EventRegistration({
  eventId,
  variants = [],
}: EventRegistrationProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [userParticipation, setUserParticipation] =
    useState<Participation | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

  // Fetch user's current participation
  useEffect(() => {
    const fetchParticipation = async () => {
      if (status !== "authenticated" || !session?.user?.id) return;

      try {
        const response = await fetch(
          `/api/participations?eventId=${eventId}&userId=${session.user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          const myParticipation = data.participations[0];
          if (myParticipation) {
            setUserParticipation(myParticipation);
            setSelectedVariantId(myParticipation.variantId || "");
          }
        }
      } catch (error) {
        console.error("Error fetching participation:", error);
      }
    };

    fetchParticipation();
  }, [eventId, session?.user?.id, status]);

  // Fetch total participants count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`/api/participations?eventId=${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setParticipantsCount(data.counts.going);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [eventId]);

  const handleRegister = async () => {
    if (!session?.user) {
      toast({
        title: "Autenticação necessária",
        description: "Faz login para marcar participação",
        variant: "destructive",
      });
      return;
    }

    if (variants.length > 0 && !selectedVariantId) {
      toast({
        title: "Seleciona uma variante",
        description: "Escolhe a distância em que vais participar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/participations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          variantId: selectedVariantId || undefined,
          status: "going",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const participation = await response.json();
      setUserParticipation(participation);
      setParticipantsCount((prev) => prev + 1);

      toast({
        title: "✅ Marcado como participante!",
        description: selectedVariantId
          ? `Vais participar em ${participation.variant?.name}`
          : "Participação registada",
      });
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registar a participação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!session?.user) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/participations?eventId=${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to unregister");
      }

      setUserParticipation(null);
      setSelectedVariantId("");
      setParticipantsCount((prev) => Math.max(0, prev - 1));

      toast({
        title: "Participação cancelada",
        description: "Já não estás marcado neste evento",
      });
    } catch (error) {
      console.error("Error unregistering:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a participação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Vais participar?</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{participantsCount} participantes</span>
        </div>
      </div>

      {!session?.user ? (
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-3">Faz login para marcar que vais participar</p>
          <Button asChild>
            <a href="/auth/signin">Fazer Login</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Variant Selection */}
          {variants.length > 0 && !userParticipation && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Escolhe a distância/variante:
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isLoading}
              >
                <option value="">Seleciona uma variante</option>
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                    {variant.distanceKm && ` - ${variant.distanceKm} km`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Current Participation Status */}
          {userParticipation && (
            <div className="rounded-md bg-primary/10 p-3 text-sm">
              <div className="mb-1 flex items-center gap-2 font-medium text-primary">
                <Check className="h-4 w-4" />
                Estás registado neste evento
              </div>
              {userParticipation.variant && (
                <p className="text-muted-foreground">
                  Variante: {userParticipation.variant.name}
                  {userParticipation.variant.distanceKm &&
                    ` - ${userParticipation.variant.distanceKm} km`}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!userParticipation ? (
              <Button
                onClick={handleRegister}
                disabled={isLoading}
                className="flex-1"
              >
                <Check className="mr-2 h-4 w-4" />
                Marcar como Vou
              </Button>
            ) : (
              <Button
                onClick={handleUnregister}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar Participação
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
