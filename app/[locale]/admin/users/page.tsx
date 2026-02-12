"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  MoreVertical,
  Shield,
  Ban,
  Trash2,
  UserCog,
  Bell,
  Megaphone,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AdminPushNotificationDialog } from "@/components/admin/admin-push-notification-dialog";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  locale: string | null;
  createdAt: string;
  isBanned?: boolean;
  devices?: {
    web: number;
    mobile: number;
    total: number;
  };
  _count?: {
    posts: number;
    comments: number;
  };
}

const LOCALE_FLAGS: Record<string, { flag: string; label: string }> = {
  pt: { flag: "🇵🇹", label: "PT" },
  en: { flag: "🇬🇧", label: "EN" },
  es: { flag: "🇪🇸", label: "ES" },
  fr: { flag: "🇫🇷", label: "FR" },
  de: { flag: "🇩🇪", label: "DE" },
  it: { flag: "🇮🇹", label: "IT" },
};

export default function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [pushTargetUser, setPushTargetUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        search: searchTerm,
        role: roleFilter,
      });
      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar utilizadores",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleBanUser = async (user: User) => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/ban`, {
        method: "POST",
      });
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: user.isBanned
            ? "Utilizador desbloqueado"
            : "Utilizador bloqueado",
        });
        fetchUsers();
      } else {
        throw new Error("Failed to ban user");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao bloquear utilizador",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSendPush = (user: User | null) => {
    setPushTargetUser(user);
    setIsPushDialogOpen(true);
  };

  const confirmChangeRole = async () => {
    if (!selectedUser) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Role do utilizador alterada",
        });
        setIsRoleDialogOpen(false);
        fetchUsers();
      } else {
        throw new Error("Failed to change role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao alterar role",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Utilizador eliminado",
        });
        setIsDeleteDialogOpen(false);
        fetchUsers();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao eliminar utilizador",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerir Utilizadores</h1>
          <p className="text-muted-foreground">
            {totalCount} {totalCount === 1 ? "utilizador" : "utilizadores"} no
            total
          </p>
        </div>
        <Button onClick={() => handleSendPush(null)} variant="outline">
          <Megaphone className="mr-2 h-4 w-4" />
          Notificar Todos
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="MOD">MOD</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Cards View */}
      <div className="space-y-3 md:hidden">
        {users.length === 0 ? (
          <div className="rounded-lg border px-4 py-8 text-center text-muted-foreground">
            Nenhum utilizador encontrado
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">
                        {user.name || "Sem nome"}
                      </span>
                      {user.isBanned && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSendPush(user)}>
                      <Bell className="mr-2 h-4 w-4" />
                      Enviar Notificação
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleChangeRole(user)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Alterar Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBanUser(user)}>
                      <Ban className="mr-2 h-4 w-4" />
                      {user.isBanned ? "Desbloquear" : "Bloquear"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteUser(user)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : user.role === "MOD"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {user.role}
                  </span>
                  {user.devices && user.devices.total > 0 ? (
                    <div className="inline-flex items-center gap-1">
                      {user.devices.web > 0 && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          title={`${user.devices.web} Web device${user.devices.web > 1 ? "s" : ""}`}
                        >
                          🌐 {user.devices.web}
                        </span>
                      )}
                      {user.devices.mobile > 0 && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          title={`${user.devices.mobile} Mobile device${user.devices.mobile > 1 ? "s" : ""}`}
                        >
                          <Smartphone className="h-3 w-3" />
                          {user.devices.mobile}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-900/30 dark:text-gray-500">
                      <Smartphone className="h-3 w-3" />0
                    </span>
                  )}
                  {user.locale && LOCALE_FLAGS[user.locale] && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      title={user.locale.toUpperCase()}
                    >
                      {LOCALE_FLAGS[user.locale].flag}{" "}
                      {LOCALE_FLAGS[user.locale].label}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("pt-PT")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden rounded-lg border md:block">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Utilizador
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-3 text-center text-sm font-medium">
                <span className="inline-flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5" />
                  Devices
                </span>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium">
                Língua
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Data Registo
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nenhum utilizador encontrado
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image && (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <div>
                        <span className="font-medium">
                          {user.name || "Sem nome"}
                        </span>
                        {user.isBanned && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Bloqueado
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : user.role === "MOD"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.devices && user.devices.total > 0 ? (
                      <div className="inline-flex items-center gap-1">
                        {user.devices.web > 0 && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            title={`${user.devices.web} Web device${user.devices.web > 1 ? "s" : ""}`}
                          >
                            🌐 {user.devices.web}
                          </span>
                        )}
                        {user.devices.mobile > 0 && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            title={`${user.devices.mobile} Mobile device${user.devices.mobile > 1 ? "s" : ""}`}
                          >
                            <Smartphone className="h-3 w-3" />
                            {user.devices.mobile}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-900/30 dark:text-gray-500">
                        <Smartphone className="h-3 w-3" />0
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.locale && LOCALE_FLAGS[user.locale] ? (
                      <span
                        className="text-sm"
                        title={user.locale.toUpperCase()}
                      >
                        {LOCALE_FLAGS[user.locale].flag}{" "}
                        {LOCALE_FLAGS[user.locale].label}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("pt-PT")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSendPush(user)}>
                          <Bell className="mr-2 h-4 w-4" />
                          Enviar Notificação
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(user)}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Alterar Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBanUser(user)}>
                          <Ban className="mr-2 h-4 w-4" />
                          {user.isBanned ? "Desbloquear" : "Bloquear"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Role do Utilizador</DialogTitle>
            <DialogDescription>
              Alterar a role de{" "}
              <span className="font-medium">{selectedUser?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    USER
                  </div>
                </SelectItem>
                <SelectItem value="MOD">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    MOD
                  </div>
                </SelectItem>
                <SelectItem value="ADMIN">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    ADMIN
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={isActionLoading}
            >
              Cancelar
            </Button>
            <Button onClick={confirmChangeRole} disabled={isActionLoading}>
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A guardar...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Utilizador</DialogTitle>
            <DialogDescription>
              Tens a certeza que queres eliminar{" "}
              <span className="font-medium">{selectedUser?.name}</span>? Esta
              ação não pode ser revertida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isActionLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteUser}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A eliminar...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Push Notification Dialog */}
      <AdminPushNotificationDialog
        open={isPushDialogOpen}
        onOpenChange={setIsPushDialogOpen}
        targetUser={pushTargetUser}
      />
    </div>
  );
}
