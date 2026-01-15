import ptMessages from "@/messages/pt.json";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import frMessages from "@/messages/fr.json";
import deMessages from "@/messages/de.json";
import itMessages from "@/messages/it.json";

type Messages = typeof ptMessages;

const messagesMap: Record<string, Messages> = {
  pt: ptMessages,
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages,
};

export function getTranslations(locale: string = "pt") {
  const messages: Messages = messagesMap[locale] || ptMessages;

  return function t(key: string): string {
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      if (typeof value === "object" && value !== null) {
        value = (value as Record<string, unknown>)[k];
      }
    }

    return typeof value === "string" ? value : key;
  };
}
