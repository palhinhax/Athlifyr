import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PublicFormClient } from "@/components/public-form-client";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const form = await prisma.form.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!form) return { title: "Form Not Found" };

  return {
    title: form.title,
    description: form.description || undefined,
  };
}

export default async function PublicFormPage({ params }: Readonly<Props>) {
  const { slug } = await params;

  const form = await prisma.form.findUnique({
    where: { slug },
    select: { id: true, title: true, status: true },
  });

  if (form?.status !== "ACTIVE") {
    notFound();
  }

  return <PublicFormClient slug={slug} />;
}
