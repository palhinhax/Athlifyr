import { Metadata } from "next";
import { UnlimitedPresentationClient } from "@/components/presentations/unlimited-training-center-client";

export const metadata: Metadata = {
  title: "Athlifyr para Unlimited Training Center | Apresentação",
  description:
    "Descobre como o Athlifyr pode transformar a gestão do Unlimited Training Center em Mafra. Plataforma gratuita de gestão e comunidade para CrossFit.",
  robots: "noindex, nofollow",
};

export default function UnlimitedTrainingCenterPresentation() {
  return <UnlimitedPresentationClient />;
}
