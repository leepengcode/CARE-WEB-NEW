import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import km from "./locales/km/translation.json";
import zh from "./locales/zh/translation.json";

const savedLang = typeof window !== 'undefined' ? localStorage.getItem("lang") : null;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      km: { translation: km },
      zh: { translation: zh },
    },
    lng: savedLang || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n; 