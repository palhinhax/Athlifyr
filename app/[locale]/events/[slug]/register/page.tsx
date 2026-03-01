import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Language } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { RegistrationFlow } from "@/components/registration-flow";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
  searchParams: {
    variant?: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "events.registration" });

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale as Language } },
    },
  });

  if (!event) return {};

  const translation = event.translations[0];
  const title = translation?.title || event.title;

  return {
    title: `${t("registerTitle")} — ${title}`,
    robots: { index: false, follow: false },
  };
}

export default async function RegisterPage({
  params,
  searchParams,
}: PageProps) {
  const { slug, locale } = await params;
  const { variant: variantId } = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(
      `/${locale}/auth/signin?callbackUrl=/${locale}/events/${slug}/register${variantId ? `?variant=${variantId}` : ""}`
    );
  }

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale as Language } },
      variants: {
        include: {
          translations: { where: { language: locale as Language } },
          pricingPhases: { orderBy: { startDate: "asc" } },
          _count: {
            select: {
              registrations: { where: { status: "CONFIRMED" } },
              participations: { where: { status: "going" } },
            },
          },
        },
        orderBy: { startDate: "asc" },
      },
      pricingPhases: { orderBy: { startDate: "asc" } },
    },
  });

  if (!event || !event.hasRegistrations) {
    notFound();
  }

  // Check if event is cancelled
  if (event.cancelled) {
    redirect(`/${locale}/events/${slug}`);
  }

  // Check deadline
  if (
    event.registrationDeadline &&
    new Date(event.registrationDeadline) < new Date()
  ) {
    redirect(`/${locale}/events/${slug}`);
  }

  // Fetch custom fields
  const customFields = await prisma.eventCustomField.findMany({
    where: { eventId: event.id },
    orderBy: { order: "asc" },
  });

  // Fetch user profile
  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      dateOfBirth: true,
      citizenId: true,
      nationality: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
    },
  });

  // Check if user already has a CONFIRMED registration
  const existingReg = await prisma.registration.findFirst({
    where: {
      userId: session.user.id,
      eventId: event.id,
      status: "CONFIRMED",
      teamMemberIndex: 0,
    },
  });

  if (existingReg) {
    redirect(`/${locale}/events/${slug}`);
  }

  // Apply translations
  const translation = event.translations[0];
  const eventTitle = translation?.title || event.title;

  const translatedVariants = event.variants.map((v) => {
    const vt = v.translations[0];
    return {
      id: v.id,
      name: vt?.name || v.name,
      distanceKm: v.distanceKm,
      startDate: v.startDate?.toISOString() ?? null,
      startTime: v.startTime,
      maxParticipants: v.maxParticipants,
      teamSize: v.teamSize,
      registrationCount: v._count.registrations + v._count.participations,
      pricingPhases: v.pricingPhases.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        currency: p.currency,
        startDate: p.startDate?.toISOString() ?? null,
        endDate: p.endDate?.toISOString() ?? null,
      })),
    };
  });

  return (
    <RegistrationFlow
      eventId={event.id}
      eventSlug={slug}
      eventTitle={eventTitle}
      variants={translatedVariants}
      initialVariantId={variantId ?? null}
      registrationFieldSettings={
        (event.registrationFieldSettings as Record<string, string>) ?? {}
      }
      customFields={customFields.map((cf) => ({
        id: cf.id,
        eventId: cf.eventId,
        label: cf.label,
        type: cf.type as "SELECT" | "BOOLEAN",
        options: cf.options as string[],
        required: cf.required,
        priceCents: cf.priceCents,
        currency: cf.currency,
        order: cf.order,
      }))}
      userProfile={
        userProfile
          ? {
              dateOfBirth: userProfile.dateOfBirth?.toISOString() ?? null,
              citizenId: userProfile.citizenId,
              nationality: userProfile.nationality,
              emergencyContactName: userProfile.emergencyContactName,
              emergencyContactPhone: userProfile.emergencyContactPhone,
            }
          : null
      }
    />
  );
}
