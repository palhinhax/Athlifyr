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
}: {
  params: { id: string };
}) {
  const session = await auth();
  const { id } = await Promise.resolve(params);

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

  return <WorkoutRunner workout={workout} />;
}
