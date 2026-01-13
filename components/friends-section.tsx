"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  UserPlus,
  Users,
  Check,
  X,
  Clock,
  UserMinus,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  friendshipStatus?: string | null;
  friendshipId?: string;
}

interface PendingRequest {
  id: string;
  sender: User;
  createdAt: string;
}

interface SentRequest {
  id: string;
  receiver: User;
  createdAt: string;
}

interface Friend extends User {
  friendshipId: string;
  since: string;
}

type Tab = "friends" | "pending" | "search";

export function FriendsSection() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFriends = useCallback(async () => {
    try {
      const res = await fetch("/api/friends");
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, []);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/friends?type=pending");
      if (res.ok) {
        const data = await res.json();
        setPendingRequests(data);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/friends?type=sent");
      if (res.ok) {
        const data = await res.json();
        setSentRequests(data);
      }
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchFriends();
      fetchPendingRequests();
      fetchSentRequests();
    }
  }, [session, fetchFriends, fetchPendingRequests, fetchSentRequests]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const sendFriendRequest = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        toast({
          title: "Pedido enviado!",
          description: "O teu pedido de amizade foi enviado.",
        });
        // Update search results to show pending status
        setSearchResults((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, friendshipStatus: "request_sent" }
              : user
          )
        );
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

  const respondToRequest = async (
    friendshipId: string,
    action: "accept" | "reject"
  ) => {
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
        fetchPendingRequests();
        if (action === "accept") {
          fetchFriends();
        }
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

  const cancelSentRequest = async (friendshipId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Pedido cancelado",
          description: "O pedido de amizade foi cancelado.",
        });
        fetchSentRequests();
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível cancelar o pedido.",
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

  const removeFriend = async (friendshipId: string) => {
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
        fetchFriends();
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

  if (!session?.user) return null;

  return (
    <div className="mt-12">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Users className="h-6 w-6 text-primary" />
        Amigos
        {pendingRequests.length > 0 && (
          <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {pendingRequests.length}
          </span>
        )}
      </h2>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b sm:gap-2">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex shrink-0 items-center gap-1 px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-4 ${
            activeTab === "friends"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Meus Amigos</span>
          <span className="sm:hidden">Amigos</span>
          <span className="text-xs">({friends.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex shrink-0 items-center gap-1 px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-4 ${
            activeTab === "pending"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          Pendentes
          {(pendingRequests.length > 0 || sentRequests.length > 0) && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {pendingRequests.length + sentRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex shrink-0 items-center gap-1 px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-4 ${
            activeTab === "search"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="h-4 w-4" />
          Procurar
        </button>
      </div>

      {/* Friends List */}
      {activeTab === "friends" && (
        <div>
          {friends.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Ainda não tens amigos
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Procura utilizadores e envia pedidos de amizade!
              </p>
              <Button onClick={() => setActiveTab("search")} variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Procurar Utilizadores
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <Card
                  key={friend.friendshipId}
                  className="flex items-center gap-3 p-4"
                >
                  <Link
                    href={`/user/${friend.id}`}
                    className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80"
                  >
                    {friend.image ? (
                      <Image
                        src={friend.image}
                        alt={friend.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                        {friend.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/user/${friend.id}`}
                      className="block truncate font-medium transition-colors hover:text-primary"
                    >
                      {friend.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {friend.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFriend(friend.friendshipId)}
                    disabled={isLoading}
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Requests */}
      {activeTab === "pending" && (
        <div className="space-y-6">
          {/* Received Requests */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Pedidos Recebidos ({pendingRequests.length})
            </h3>
            {pendingRequests.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Não tens pedidos de amizade recebidos.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="flex items-center gap-4 p-4"
                  >
                    <Link
                      href={`/user/${request.sender.id}`}
                      className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80"
                    >
                      {request.sender.image ? (
                        <Image
                          src={request.sender.image}
                          alt={request.sender.name || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                          {request.sender.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/user/${request.sender.id}`}
                        className="block font-medium transition-colors hover:text-primary"
                      >
                        {request.sender.name}
                      </Link>
                      <p className="truncate text-sm text-muted-foreground">
                        {request.sender.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => respondToRequest(request.id, "accept")}
                        disabled={isLoading}
                        className="gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => respondToRequest(request.id, "reject")}
                        disabled={isLoading}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                        Rejeitar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sent Requests */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Pedidos Enviados ({sentRequests.length})
            </h3>
            {sentRequests.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Não tens pedidos de amizade enviados.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {sentRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="flex items-center gap-4 p-4"
                  >
                    <Link
                      href={`/user/${request.receiver.id}`}
                      className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80"
                    >
                      {request.receiver.image ? (
                        <Image
                          src={request.receiver.image}
                          alt={request.receiver.name || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                          {request.receiver.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/user/${request.receiver.id}`}
                        className="block font-medium transition-colors hover:text-primary"
                      >
                        {request.receiver.name}
                      </Link>
                      <p className="truncate text-sm text-muted-foreground">
                        {request.receiver.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />A aguardar resposta
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => cancelSentRequest(request.id)}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Users */}
      {activeTab === "search" && (
        <div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Procurar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : searchQuery.length < 2 ? (
            <Card className="p-8 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Procura utilizadores
              </h3>
              <p className="text-sm text-muted-foreground">
                Escreve pelo menos 2 caracteres para procurar.
              </p>
            </Card>
          ) : searchResults.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhum resultado encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                Tenta procurar com outro nome ou email.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <Card key={user.id} className="flex items-center gap-4 p-4">
                  <Link
                    href={`/user/${user.id}`}
                    className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/user/${user.id}`}
                      className="block font-medium transition-colors hover:text-primary"
                    >
                      {user.name}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  {user.friendshipStatus === "friends" ? (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      Amigos
                    </span>
                  ) : user.friendshipStatus === "request_sent" ? (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Pedido enviado
                    </span>
                  ) : user.friendshipStatus === "request_received" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          respondToRequest(user.friendshipId!, "accept")
                        }
                        disabled={isLoading}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Aceitar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={isLoading}
                    >
                      <UserPlus className="mr-1 h-4 w-4" />
                      Adicionar
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
