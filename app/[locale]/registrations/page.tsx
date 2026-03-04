import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/page-container";
import { MyRegistrationsList } from "@/components/my-registrations-list";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "registrations" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function MyRegistrationsPage({ params }: PageProps) {
  const { locale } = await Promise.resolve(params);
  const session = await auth();
  const t = await getTranslations({ locale, namespace: "registrations" });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Fetch all registrations for this user (direct + guest)
  const registrations = await prisma.registration.findMany({
    where: {
      OR: [
        {
          userId: session.user.id,
          OR: [{ teamRole: null }, { teamRole: { not: "MEMBER" } }],
        },
        {
          guestEmail: session.user.email,
          teamRole: "MEMBER",
        },
      ],
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          startDate: true,
          city: true,
          country: true,
          imageUrl: true,
          hasLiveRace: true,
          liveStatus: true,
          checkInOpensAt: true,
          checkInClosesAt: true,
        },
      },
      variant: {
        select: {
          name: true,
          distanceKm: true,
          startDate: true,
          startTime: true,
        },
      },
    },
    orderBy: { event: { startDate: "desc" } },
  });

  // Separate upcoming and past registrations
  const now = new Date();
  const upcoming = registrations.filter((r) => r.event.startDate >= now);
  const past = registrations.filter((r) => r.event.startDate < now);

  return (
    <PageContainer size="lg" maxWidth="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-muted-foreground">{t("description")}</p>

      <MyRegistrationsList
        upcoming={upcoming.map((r) => ({
          id: r.id,
          status: r.status,
          bibNumber: r.bibNumber,
          checkedInAt: r.checkedInAt?.toISOString() ?? null,
          createdAt: r.createdAt.toISOString(),
          event: {
            id: r.event.id,
            title: r.event.title,
            slug: r.event.slug,
            startDate: r.event.startDate.toISOString(),
            city: r.event.city,
            country: r.event.country,
            imageUrl: r.event.imageUrl,
            hasLiveRace: r.event.hasLiveRace,
            liveStatus: r.event.liveStatus,
            checkInOpensAt: r.event.checkInOpensAt?.toISOString() ?? null,
            checkInClosesAt: r.event.checkInClosesAt?.toISOString() ?? null,
          },
          variant: r.variant
            ? {
                name: r.variant.name,
                distanceKm: r.variant.distanceKm,
                startDate: r.variant.startDate?.toISOString() ?? null,
                startTime: r.variant.startTime,
              }
            : null,
        }))}
        past={past.map((r) => ({
          id: r.id,
          status: r.status,
          bibNumber: r.bibNumber,
          checkedInAt: r.checkedInAt?.toISOString() ?? null,
          createdAt: r.createdAt.toISOString(),
          event: {
            id: r.event.id,
            title: r.event.title,
            slug: r.event.slug,
            startDate: r.event.startDate.toISOString(),
            city: r.event.city,
            country: r.event.country,
            imageUrl: r.event.imageUrl,
            hasLiveRace: r.event.hasLiveRace,
            liveStatus: r.event.liveStatus,
            checkInOpensAt: r.event.checkInOpensAt?.toISOString() ?? null,
            checkInClosesAt: r.event.checkInClosesAt?.toISOString() ?? null,
          },
          variant: r.variant
            ? {
                name: r.variant.name,
                distanceKm: r.variant.distanceKm,
                startDate: r.variant.startDate?.toISOString() ?? null,
                startTime: r.variant.startTime,
              }
            : null,
        }))}
        locale={locale}
      />
    </PageContainer>
  );
}
