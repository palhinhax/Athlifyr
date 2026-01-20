"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Shield,
  User,
  Mail,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  isVerified: boolean;
  _count: {
    posts: number;
    comments: number;
    participations: number;
  };
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const ITEMS_PER_PAGE = 20;

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      router.push("/admin");
    }
  }, [session, status, router]);

  // Fetch users
  useEffect(() => {
    if (status === "loading" || !session) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: ITEMS_PER_PAGE.toString(),
          ...(debouncedSearch && { search: debouncedSearch }),
        });

        const response = await fetch(`/api/admin/users?${params}`);
        if (!response.ok) throw new Error("Failed to fetch users");

        const data: UsersResponse = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalUsers(data.pagination.total);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar utilizadores",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedSearch, session, status]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Sucesso",
        description: "Função do utilizador atualizada",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar função",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerificationToggle = async (
    userId: string,
    isVerified: boolean
  ) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !isVerified }),
      });

      if (!response.ok) throw new Error("Failed to update verification");

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isVerified: !isVerified } : user
        )
      );

      toast({
        title: "Sucesso",
        description: `Utilizador ${!isVerified ? "verificado" : "não verificado"}`,
      });
    } catch (error) {
      console.error("Error updating verification:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar verificação",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setActionLoading(userToDelete.id);
    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setTotalUsers((prev) => prev - 1);

      toast({
        title: "Sucesso",
        description: "Utilizador eliminado",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro",
        description: "Erro ao eliminar utilizador",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setUserToDelete(null);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "MOD":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-3 w-3" />;
      case "MOD":
        return <UserCheck className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestão de Utilizadores</h2>
        <p className="text-muted-foreground">
          {totalUsers} utilizador{totalUsers !== 1 ? "es" : ""} registado
          {totalUsers !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <UserX className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Nenhum utilizador encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Tenta alterar os termos de pesquisa"
                : "Ainda não há utilizadores registados"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilizador</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Verificado</TableHead>
                    <TableHead>Atividade</TableHead>
                    <TableHead>Registado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback>
                              {user.name?.[0]?.toUpperCase() ||
                                user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.name || "Sem nome"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {user.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          className="gap-1"
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Badge variant="default" className="gap-1">
                            <UserCheck className="h-3 w-3" />
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <UserX className="h-3 w-3" />
                            Não
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span>{user._count.posts} posts</span>
                          <span>{user._count.comments} comentários</span>
                          <span>
                            {user._count.participations} participações
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreVertical className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleVerificationToggle(
                                  user.id,
                                  user.isVerified
                                )
                              }
                            >
                              {user.isVerified ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Remover Verificação
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Verificar Utilizador
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                              Alterar Função
                            </DropdownMenuLabel>
                            {user.role !== "USER" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user.id, "USER")
                                }
                              >
                                <User className="mr-2 h-4 w-4" />
                                USER
                              </DropdownMenuItem>
                            )}
                            {user.role !== "MOD" && (
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, "MOD")}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                MOD
                              </DropdownMenuItem>
                            )}
                            {user.role !== "ADMIN" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user.id, "ADMIN")
                                }
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                ADMIN
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setUserToDelete(user)}
                              className="text-destructive focus:text-destructive"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Eliminar Utilizador
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-4">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Seguinte
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Utilizador</AlertDialogTitle>
            <AlertDialogDescription>
              Tens a certeza que queres eliminar o utilizador{" "}
              <strong>{userToDelete?.name || userToDelete?.email}</strong>?
              <br />
              <br />
              Esta ação é irreversível e irá eliminar:
              <ul className="mt-2 list-inside list-disc">
                <li>{userToDelete?._count.posts} posts</li>
                <li>{userToDelete?._count.comments} comentários</li>
                <li>
                  {userToDelete?._count.participations} participações em eventos
                </li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
