import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

// Configuration simplifiée pour éviter les erreurs
const SUPPORTED_LANGUAGES = ['fr', 'ar', 'en'];
const BASIC_NAMESPACES = ['common', 'auth', 'settings', 'nav', 'dashboard'];

let initialized = false;

export function initializeI18n(options = {}) {
  if (initialized) {
    return Promise.resolve(i18n);
  }
  
  initialized = true;
  
  return i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: 'fr',
      fallbackLng: 'fr',
      debug: false, // Désactiver le debug pour réduire les logs
      
      ns: BASIC_NAMESPACES,
      defaultNS: 'common',
      
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
        crossDomain: false,
      },
      
      react: {
        useSuspense: false, // Désactiver suspense pour éviter les erreurs
        bindI18n: 'languageChanged',
      },
      
      // Gérer les clés manquantes silencieusement
      saveMissing: false,
      missingKeyHandler: () => null,
      
      ...options
    });
}

export { SUPPORTED_LANGUAGES, BASIC_NAMESPACES };
export default i18n;
