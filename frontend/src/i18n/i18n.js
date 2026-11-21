import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly (works with Vite)
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';

i18n
  .use(LanguageDetector)       // Detects language from browser / localStorage
  .use(initReactI18next)        // Passes i18n to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      mr: { translation: mrTranslation },
    },
    fallbackLng: 'en',           // If a key is missing, fall back to English
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,        // React already handles XSS
    },
    detection: {
      // Order of detection sources
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Key to store the selected language in localStorage
      lookupLocalStorage: 'ka_language',
      caches: ['localStorage'],
    },
  });

export default i18n;
