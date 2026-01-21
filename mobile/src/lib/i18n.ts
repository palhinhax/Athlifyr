import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translations
import en from "../locales/en/common.json";
import pt from "../locales/pt/common.json";
import es from "../locales/es/common.json";
import fr from "../locales/fr/common.json";
import de from "../locales/de/common.json";
import it from "../locales/it/common.json";

const LANGUAGE_KEY = "user-language";

const resources = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
};

// Language detector plugin
const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Try to get saved language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // Fallback to device locale
      const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "en";
      const supportedLocales = ["en", "pt", "es", "fr", "de", "it"];
      const locale = supportedLocales.includes(deviceLocale)
        ? deviceLocale
        : "en";
      callback(locale);
    } catch {
      callback("en");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error: unknown) {
      console.error("Error saving language:", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
