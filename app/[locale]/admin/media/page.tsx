"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Image as ImageIcon,
  AlertTriangle,
  Search,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface MediaFile {
  fileId: string;
  fileName: string;
  url: string;
  contentType: string;
  contentLength: number;
  uploadTimestamp: number;
  folder: string;
  isOrphan: boolean;
  usageType?: "post" | "profile" | "event" | "instagram" | "avatar";
  usageId?: string;
  usageTitle?: string;
}

interface MediaStats {
  totalFiles: number;
  totalSize: number;
  orphanFiles: number;
  orphanSize: number;
  byFolder: Record<string, number>;
  byType: {
    post: number;
    profile: number;
    event: number;
    instagram: number;
    avatar: number;
    orphan: number;
  };
}

export default function MediaManagerPage() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOrphans, setFilterOrphans] = useState(false);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  // Infinite scroll state
  const [displayedFiles, setDisplayedFiles] = useState<MediaFile[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/media");
      if (!response.ok) throw new Error("Failed to fetch media");
      const data = await response.json();
      setFiles(data.files);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm("Tem a certeza que quer eliminar este ficheiro?")) {
      return;
    }

    try {
      // Add file to deleting set
      setDeletingFiles((prev) => new Set(prev).add(fileId));

      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId, fileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      // Remove file from local state
      setFiles((prev) => prev.filter((f) => f.fileId !== fileId));

      // Update stats
      if (stats) {
        const deletedFile = files.find((f) => f.fileId === fileId);
        if (deletedFile) {
          setStats({
            ...stats,
            totalFiles: stats.totalFiles - 1,
            totalSize: stats.totalSize - deletedFile.contentLength,
            orphanFiles: deletedFile.isOrphan
              ? stats.orphanFiles - 1
              : stats.orphanFiles,
            orphanSize: deletedFile.isOrphan
              ? stats.orphanSize - deletedFile.contentLength
              : stats.orphanSize,
            byFolder: {
              ...stats.byFolder,
              [deletedFile.folder]: stats.byFolder[deletedFile.folder] - 1,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Erro ao eliminar ficheiro. Por favor tenta novamente.");
    } finally {
      // Remove file from deleting set
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleDeleteAllOrphans = async () => {
    const orphanFiles = files.filter((f) => f.isOrphan);

    if (orphanFiles.length === 0) {
      alert("Não há ficheiros órfãos para eliminar.");
      return;
    }

    const totalSize = formatBytes(
      orphanFiles.reduce((sum, f) => sum + f.contentLength, 0)
    );

    if (
      !confirm(
        `Tem a certeza que quer eliminar ${orphanFiles.length} ficheiros órfãos (${totalSize})?\n\nEsta ação não pode ser desfeita!`
      )
    ) {
      return;
    }

    let deletedCount = 0;
    let failedCount = 0;

    for (const file of orphanFiles) {
      try {
        setDeletingFiles((prev) => new Set(prev).add(file.fileId));

        const response = await fetch("/api/admin/media", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileId: file.fileId,
            fileName: file.fileName,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete file");
        }

        deletedCount++;

        // Remove file from local state
        setFiles((prev) => prev.filter((f) => f.fileId !== file.fileId));
      } catch (error) {
        console.error(`Error deleting file ${file.fileName}:`, error);
        failedCount++;
      } finally {
        setDeletingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(file.fileId);
          return newSet;
        });
      }
    }

    // Refresh stats after bulk delete
    await fetchMedia();

    alert(
      `Eliminação concluída!\n\nEliminados: ${deletedCount}\nFalhados: ${failedCount}`
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter files based on search and filter criteria
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      if (filterOrphans && !file.isOrphan) return false;
      if (filterFolder !== "all" && file.folder !== filterFolder) return false;
      if (
        searchQuery &&
        !file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [files, filterOrphans, filterFolder, searchQuery]);

  // Load more files for infinite scroll
  const loadMoreFiles = useCallback(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newFiles = filteredFiles.slice(startIndex, endIndex);

    if (newFiles.length > 0) {
      setDisplayedFiles((prev) => [...prev, ...newFiles]);
      setPage((prev) => prev + 1);
    }

    if (endIndex >= filteredFiles.length) {
      setHasMore(false);
    }
  }, [page, filteredFiles]);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayedFiles(filteredFiles.slice(0, ITEMS_PER_PAGE));
    setPage(2);
    setHasMore(filteredFiles.length > ITEMS_PER_PAGE);
  }, [filteredFiles]);

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreFiles();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreFiles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const folders = stats ? Object.keys(stats.byFolder) : [];

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Media Manager</h1>
        <p className="text-muted-foreground">
          Gere todos os ficheiros do Backblaze B2 e identifique ficheiros órfãos
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Total de Ficheiros
                </p>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(stats.totalSize)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Ficheiros Órfãos
                </p>
                <p className="text-2xl font-bold">{stats.orphanFiles}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(stats.orphanSize)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div>
              <p className="mb-2 text-sm font-medium">Por Tipo</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Posts:</span>
                  <span className="font-medium">{stats.byType.post}</span>
                </div>
                <div className="flex justify-between">
                  <span>Eventos:</span>
                  <span className="font-medium">{stats.byType.event}</span>
                </div>
                <div className="flex justify-between">
                  <span>Perfis:</span>
                  <span className="font-medium">{stats.byType.profile}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avatares:</span>
                  <span className="font-medium">{stats.byType.avatar}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div>
              <p className="mb-2 text-sm font-medium">Por Pasta</p>
              <div className="space-y-1 text-xs">
                {Object.entries(stats.byFolder).map(([folder, count]) => (
                  <div key={folder} className="flex justify-between">
                    <span className="capitalize">{folder}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Actions */}
      {stats && stats.orphanFiles > 0 && (
        <Card className="border-amber-500/50 bg-amber-50/50 p-4 dark:bg-amber-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">
                  {stats.orphanFiles} ficheiro
                  {stats.orphanFiles !== 1 ? "s" : ""} órfão
                  {stats.orphanFiles !== 1 ? "s" : ""} encontrado
                  {stats.orphanFiles !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Estes ficheiros não estão a ser utilizados e podem ser
                  eliminados para libertar {formatBytes(stats.orphanSize)}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAllOrphans}
              disabled={deletingFiles.size > 0}
              className="whitespace-nowrap"
            >
              {deletingFiles.size > 0 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A eliminar...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar Todos os Órfãos
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome do ficheiro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="orphans"
                checked={filterOrphans}
                onCheckedChange={(checked) =>
                  setFilterOrphans(checked as boolean)
                }
              />
              <label htmlFor="orphans" className="text-sm font-medium">
                Apenas órfãos
              </label>
            </div>
            <select
              value={filterFolder}
              onChange={(e) => setFilterFolder(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todas as pastas</option>
              {folders.map((folder) => (
                <option key={folder} value={folder} className="capitalize">
                  {folder}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          A mostrar {displayedFiles.length} de {filteredFiles.length} ficheiros
        </div>
      </Card>

      {/* Files Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedFiles.map((file) => (
          <Card
            key={file.fileId}
            className={`overflow-hidden ${file.isOrphan ? "border-amber-500/50" : ""}`}
          >
            <div className="relative aspect-square bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.url}
                alt={file.fileName}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {file.isOrphan && (
                <div className="absolute right-2 top-2 rounded-full bg-amber-500 p-1">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="p-3">
              <p
                className="mb-1 truncate text-xs font-medium"
                title={file.fileName}
              >
                {file.fileName.split("/").pop()}
              </p>
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-1.5 py-0.5 capitalize">
                  {file.folder}
                </span>
                <span>{formatBytes(file.contentLength)}</span>
              </div>
              {file.isOrphan ? (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Órfão - Não utilizado</span>
                </div>
              ) : (
                <div className="text-xs text-green-600">
                  <span className="font-medium capitalize">
                    {file.usageType}:
                  </span>{" "}
                  <span className="truncate">{file.usageTitle}</span>
                </div>
              )}
              <div className="mt-2 text-xs text-muted-foreground">
                {formatDate(file.uploadTimestamp)}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                {file.isOrphan && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteFile(file.fileId, file.fileName)}
                    disabled={deletingFiles.has(file.fileId)}
                  >
                    {deletingFiles.has(file.fileId) ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && displayedFiles.length > 0 && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {displayedFiles.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Nenhum ficheiro encontrado</p>
          <p className="text-sm text-muted-foreground">
            Tenta ajustar os filtros de pesquisa
          </p>
        </Card>
      )}
    </div>
  );
}
