import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "exercises" });

  return {
    title: `${t("title")} - Admin`,
  };
}

export default function AdminExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
