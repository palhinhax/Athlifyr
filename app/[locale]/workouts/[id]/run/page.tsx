import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { WorkoutRunner } from "@/components/workout-runner";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "workouts" });

  const workout = await prisma.workout.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: workout ? `${workout.name} - ${t("runner.inProgress")}` : t("title"),
  };
}

export default async function WorkoutRunPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const session = await auth();
  const { id } = await Promise.resolve(params);
  const { returnTo } = await searchParams;

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { orderIndex: "asc" },
        include: {
          exercises: {
            orderBy: { orderIndex: "asc" },
            include: {
              exercise: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  hasReps: true,
                  hasWeight: true,
                  hasDistance: true,
                  hasTime: true,
                  hasCalories: true,
                  hasHeight: true,
                },
              },
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!workout) {
    notFound();
  }

  return <WorkoutRunner workout={workout} returnTo={returnTo} />;
}
