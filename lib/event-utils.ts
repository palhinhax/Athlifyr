import { SportType } from "@prisma/client";

export const sportTypeLabels: Record<SportType, string> = {
  RUNNING: "Corrida",
  TRAIL: "Trail",
  HYROX: "HYROX",
  CROSSFIT: "CrossFit",
  OCR: "OCR",
  BTT: "BTT",
  CYCLING: "Ciclismo",
  SURF: "Surf",
  TRIATHLON: "Triatlo",
  SWIMMING: "Natação",
  OTHER: "Outros",
};

export const sportTypeIcons: Record<SportType, string> = {
  RUNNING: "🏃",
  TRAIL: "⛰️",
  HYROX: "💪",
  CROSSFIT: "🏋️",
  OCR: "🧗",
  BTT: "🚵",
  CYCLING: "🚴",
  SURF: "🏄",
  TRIATHLON: "🏊",
  SWIMMING: "🏊",
  OTHER: "🎯",
};

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
