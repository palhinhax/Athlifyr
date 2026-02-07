import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { MyScheduleClient } from "@/components/my-schedule-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "schedule" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function MySchedulePage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Only accessible for users who are OWNER, ADMIN, or COACH at a venue
  const staffMembership = await prisma.venueMember.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      role: { in: ["OWNER", "ADMIN", "COACH"] },
    },
    select: { id: true },
  });

  if (!staffMembership) {
    redirect("/profile");
  }

  return <MyScheduleClient locale={locale} userId={session.user.id} />;
}
