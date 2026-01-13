"use client";

import Image from "next/image";
import { EventCalendar } from "@/components/event-calendar";
import { Button } from "@/components/ui/button";
import { UserPlus, Check, Clock, UserMinus, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface EventParticipation {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: Date | string;
    city: string;
    sportType: string;
  };
  variant?: {
    name: string;
    distanceKm: number | null;
  } | null;
}

interface PublicProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  stats: {
    upcomingEvents: number;
    pastEvents: number;
    friendsCount: number;
    commentsCount: number;
  };
  participations: EventParticipation[];
  friendshipStatus: string | null;
  friendshipId: string | undefined;
  isLoggedIn: boolean;
}

export function PublicProfileHeader({
  user,
  stats,
  participations,
  friendshipStatus: initialFriendshipStatus,
  friendshipId: initialFriendshipId,
  isLoggedIn,
}: PublicProfileHeaderProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [friendshipStatus, setFriendshipStatus] = useState(
    initialFriendshipStatus
  );
  const [friendshipId, setFriendshipId] = useState(initialFriendshipId);
  const [isLoading, setIsLoading] = useState(false);

  const sendFriendRequest = async () => {
    if (!isLoggedIn) {
      toast({
        variant: "destructive",
        title: "Não autenticado",
        description: "Precisas de fazer login para adicionar amigos.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (res.ok) {
        toast({
          title: "Pedido enviado!",
          description: "O teu pedido de amizade foi enviado.",
        });
        setFriendshipStatus("request_sent");
        router.refresh();
      } else {
        const error = await res.json();
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.error || "Não foi possível enviar o pedido.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Algo correu mal. Tenta novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const respondToRequest = async (action: "accept" | "reject") => {
    if (!friendshipId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast({
          title: action === "accept" ? "Amigo adicionado!" : "Pedido rejeitado",
          description:
            action === "accept"
              ? "Agora são amigos."
              : "O pedido foi rejeitado.",
        });
        if (action === "accept") {
          setFriendshipStatus("friends");
        } else {
          setFriendshipStatus(null);
          setFriendshipId(undefined);
        }
        router.refresh();
      } else {
        const error = await res.json();
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.error || "Algo correu mal.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Algo correu mal. Tenta novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async () => {
    if (!friendshipId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Amigo removido",
          description: "A amizade foi removida.",
        });
        setFriendshipStatus(null);
        setFriendshipId(undefined);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível remover o amigo.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Algo correu mal. Tenta novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:items-start">
      {/* Profile Image */}
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-muted">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <EventCalendar participations={participations} />
            {isLoggedIn && (
              <>
                {friendshipStatus === "friends" ? (
                  <Button
                    variant="outline"
                    onClick={removeFriend}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <UserMinus className="h-4 w-4" />
                    Remover Amigo
                  </Button>
                ) : friendshipStatus === "request_sent" ? (
                  <Button variant="outline" disabled className="gap-2">
                    <Clock className="h-4 w-4" />
                    Pedido Enviado
                  </Button>
                ) : friendshipStatus === "request_received" ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => respondToRequest("accept")}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Aceitar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => respondToRequest("reject")}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={sendFriendRequest}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar Amigo
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.upcomingEvents}
            </div>
            <div className="text-sm text-muted-foreground">
              Próximos Eventos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.pastEvents}
            </div>
            <div className="text-sm text-muted-foreground">
              Eventos Passados
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.friendsCount}
            </div>
            <div className="text-sm text-muted-foreground">Amigos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.commentsCount}
            </div>
            <div className="text-sm text-muted-foreground">Comentários</div>
          </div>
        </div>
      </div>
    </div>
  );
}
