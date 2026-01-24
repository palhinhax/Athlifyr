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
import { Loader2, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Venue {
  id: string;
  name: string;
}

interface AdminVenueOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue | null;
  onSuccess: () => void;
}

export function AdminVenueOwnerDialog({
  open,
  onOpenChange,
  venue,
  onSuccess,
}: AdminVenueOwnerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

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
        title: "Erro",
        description: "Erro ao procurar utilizadores",
        variant: "destructive",
      });
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleSetOwner = async (userId: string) => {
    if (!venue) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/venues/${venue.id}/set-owner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to set owner");

      toast({
        title: "Sucesso",
        description: "Owner definido com sucesso",
      });

      onOpenChange(false);
      setUserSearch("");
      setSearchedUsers([]);
      onSuccess();
    } catch (error) {
      console.error("Error setting owner:", error);
      toast({
        title: "Erro",
        description: "Erro ao definir owner",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setUserSearch("");
          setSearchedUsers([]);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Definir Owner</DialogTitle>
          <DialogDescription>
            Procurar e definir o proprietário para {venue?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userSearch">Procurar Utilizador</Label>
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
                      {user.name || "Sem nome"}
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
              onOpenChange(false);
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
  );
}
