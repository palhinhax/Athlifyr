"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AdminExercisesClient } from "@/components/admin-exercises-client";
import { Loader2 } from "lucide-react";
import type { ExerciseCategory } from "@prisma/client";

interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  category: ExerciseCategory;
  isGlobal: boolean;
  createdById: string | null;
  createdBy?: {
    id: string;
    name: string | null;
  } | null;
  // Measurement fields
  hasReps: boolean;
  hasWeight: boolean;
  hasDistance: boolean;
  hasTime: boolean;
  hasCalories: boolean;
  hasHeight: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function AdminExercisesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("exercises");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

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

    // Fetch initial exercises
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        setExercises(data.exercises || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 20,
            totalCount: data.exercises?.length || 0,
            totalPages: 1,
          }
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
        setLoading(false);
      });
  }, [session, status, router]);

  if (status === "loading" || loading) {
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
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
      </div>
      <AdminExercisesClient
        initialExercises={exercises}
        initialPagination={pagination}
      />
    </div>
  );
}
