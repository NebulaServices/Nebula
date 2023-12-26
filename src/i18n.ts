import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en.json";
import translationES from "./locales/es.json";
import translationJA from "./locales/ja.json";

const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  ja: {
    translation: translationJA
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
