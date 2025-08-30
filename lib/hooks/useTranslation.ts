"use client";

import { useTranslation as useBaseTranslation } from 'react-i18next';

/**
 * Hook de traduction unifié compatible Vercel
 * Utilise react-i18next standard avec des améliorations
 */
export function useTranslation(namespaces?: string | string[]) {
  const { t: baseT, i18n, ready } = useBaseTranslation(namespaces);
  
  // Fonction de traduction améliorée
  const t = (key: string, options?: any): string => {
    try {
      const result = baseT(key, options);
      
      // Si la traduction n'est pas trouvée et qu'on a des namespaces
      if (result === key && namespaces) {
        const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces];
        
        // Essayer avec chaque namespace
        for (const ns of nsArray) {
          const namespacedKey = key.includes(':') ? key : `${ns}:${key}`;
          const nsResult = baseT(namespacedKey, options);
          
          if (nsResult !== namespacedKey) {
            return nsResult;
          }
        }
      }
      
      return result;
    } catch (error) {
      console.warn('Translation error:', error);
      return key;
    }
  };
  
  return {
    t,
    i18n,
    ready,
    changeLanguage: i18n.changeLanguage,
    language: i18n.language,
  };
}

export default useTranslation;
