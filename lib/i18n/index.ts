import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions } from './settings'

// Define supported languages and namespaces
export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];
export const NAMESPACES = ['common', 'auth', 'landing', 'bills', 'lofts', 'owners', 'teams', 'reservations', 'transactions', 'analytics', 'conversations', 'dashboard', 'executive', 'internetConnections', 'nav', 'notifications', 'paymentMethods', 'reports', 'settings', 'tasks', 'test', 'testSound', 'testTranslations', 'theme', 'unauthorized', 'zoneAreas', 'availability'] as const;
export type Namespace = typeof NAMESPACES[number];

let initialized = false;

// Export a function to initialize i18n when needed
export function initializeI18n(options = {}) {
  if (initialized) {
    return Promise.resolve(i18n);
  }
  
  initialized = true;
  
  const i18nInstance = i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
  
  return i18nInstance.init({
    ...getOptions(),
    ...options,
    // Configure backend to load translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Enable cross-origin requests if needed
      crossDomain: false,
    },
    // Configure language detection
    detection: {
      // Order of detection methods
      order: ['cookie', 'htmlTag', 'path', 'subdomain', 'localStorage'],
      // Caches to save the detected language
      caches: ['cookie', 'localStorage'],
      // Cookie name to store language preference
      lookupCookie: 'language',
      // LocalStorage key to store language preference
      lookupLocalStorage: 'language',
      // HTML tag attribute to use for language detection
      htmlTag: typeof document !== 'undefined' ? document.documentElement : undefined,
    },
    // Configure namespace handling
    ns: NAMESPACES,
    defaultNS: 'common',
    // Handle missing keys in development
    fallbackLng: 'fr',
    debug: false, // Désactiver le debug pour réduire les logs d'erreur
    // Additional configuration
    react: {
      // Désactiver suspense pour éviter les erreurs de chargement
      useSuspense: false,
      // Bind the react component to the i18n instance
      bindI18n: 'languageChanged',
    },
    // Custom handler for missing keys - silencieux
    saveMissing: false,
    missingKeyHandler: () => null, // Gérer silencieusement les clés manquantes
  })
}

export default i18n