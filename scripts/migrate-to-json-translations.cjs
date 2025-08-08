const fs = require('fs');
const path = require('path');

console.log('🔄 MIGRATION VERS LE SYSTÈME DE TRADUCTIONS JSON\n');

// Lire les traductions JSON actuelles
const frTranslations = JSON.parse(fs.readFileSync('../locales/fr/translation.json', 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync('../locales/en/translation.json', 'utf8'));
const arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));

console.log('✅ Traductions JSON chargées');
console.log(`   🇫🇷 Français: ${JSON.stringify(frTranslations).length} caractères`);
console.log(`   🇬🇧 Anglais: ${JSON.stringify(enTranslations).length} caractères`);
console.log(`   🇸🇦 Arabe: ${JSON.stringify(arTranslations).length} caractères`);

// Créer une nouvelle configuration i18next
const newI18nConfig = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-fs-backend';

// Import des traductions JSON
import frTranslations from '../../locales/fr/translation.json';
import enTranslations from '../../locales/en/translation.json';
import arTranslations from '../../locales/ar/translation.json';

const resources = {
  fr: {
    translation: frTranslations
  },
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Langue par défaut
    fallbackLng: 'fr',
    
    interpolation: {
      escapeValue: false
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;
`;

// Créer une nouvelle configuration serveur
const newServerConfig = `import { cookies } from 'next/headers';
import frTranslations from '../../locales/fr/translation.json';
import enTranslations from '../../locales/en/translation.json';
import arTranslations from '../../locales/ar/translation.json';

export type Language = 'en' | 'fr' | 'ar';

const translations = {
  fr: frTranslations,
  en: enTranslations,
  ar: arTranslations
};

export async function getTranslations(): Promise<(key: string) => string> {
  const cookieStore = await cookies();
  
  // Try to get language from cookie
  let language = cookieStore.get('language')?.value as Language;
  
  // Debug logging
  console.log('Server getTranslations - Cookie language:', language);
  
  // If no language cookie is set, default to Arabic
  if (!language || !translations[language]) {
    language = 'ar';
    console.log('Server getTranslations - Using default language:', language);
  }
  
  return (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    const result = value || key;
    console.log(\`Server translation - Key: \${key}, Language: \${language}, Result: \${result}\`);
    return result;
  };
}

export { translations };
`;

// Créer un nouveau contexte client
const newClientContext = `'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import frTranslations from '../../locales/fr/translation.json';
import enTranslations from '../../locales/en/translation.json';
import arTranslations from '../../locales/ar/translation.json';

export type Language = 'en' | 'fr' | 'ar';

const translations = {
  fr: frTranslations,
  en: enTranslations,
  ar: arTranslations
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    // Load language from cookie or localStorage
    const savedLanguage = document.cookie
      .split('; ')
      .find(row => row.startsWith('language='))
      ?.split('=')[1] as Language;
    
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Save to cookie
    document.cookie = \`language=\${lang}; path=/; max-age=31536000\`; // 1 year
    // Reload page to apply server-side translations
    window.location.reload();
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
`;

console.log('\n🔄 Création des nouveaux fichiers de configuration...');

// Sauvegarder les anciens fichiers
const timestamp = Date.now();
if (fs.existsSync('../lib/i18n/server.ts')) {
  fs.copyFileSync('../lib/i18n/server.ts', `../lib/i18n/server.backup.${timestamp}.ts`);
}
if (fs.existsSync('../lib/i18n/context.tsx')) {
  fs.copyFileSync('../lib/i18n/context.tsx', `../lib/i18n/context.backup.${timestamp}.tsx`);
}

// Écrire les nouveaux fichiers
fs.writeFileSync('../lib/i18n/server-new.ts', newServerConfig);
fs.writeFileSync('../lib/i18n/context-new.tsx', newClientContext);
fs.writeFileSync('../lib/i18n/i18n-config.ts', newI18nConfig);

console.log('✅ Nouveaux fichiers de configuration créés:');
console.log('   📄 lib/i18n/server-new.ts');
console.log('   📄 lib/i18n/context-new.tsx');
console.log('   📄 lib/i18n/i18n-config.ts');

// Créer un script de remplacement
const replacementScript = `#!/bin/bash
# Script pour remplacer les anciens fichiers par les nouveaux

echo "🔄 Remplacement des fichiers i18n..."

# Sauvegarder les anciens fichiers
cp lib/i18n/server.ts lib/i18n/server.backup.${timestamp}.ts
cp lib/i18n/context.tsx lib/i18n/context.backup.${timestamp}.tsx

# Remplacer par les nouveaux
mv lib/i18n/server-new.ts lib/i18n/server.ts
mv lib/i18n/context-new.tsx lib/i18n/context.tsx

echo "✅ Remplacement terminé!"
echo "🚀 Redémarrez l'application pour voir les changements"
`;

fs.writeFileSync('../replace-i18n-files.sh', replacementScript);
fs.chmodSync('../replace-i18n-files.sh', '755');

// Créer un script PowerShell pour Windows
const replacementScriptPS = `# Script PowerShell pour remplacer les fichiers i18n

Write-Host "🔄 Remplacement des fichiers i18n..." -ForegroundColor Yellow

# Sauvegarder les anciens fichiers
Copy-Item "lib/i18n/server.ts" "lib/i18n/server.backup.${timestamp}.ts"
Copy-Item "lib/i18n/context.tsx" "lib/i18n/context.backup.${timestamp}.tsx"

# Remplacer par les nouveaux
Move-Item "lib/i18n/server-new.ts" "lib/i18n/server.ts" -Force
Move-Item "lib/i18n/context-new.tsx" "lib/i18n/context.tsx" -Force

Write-Host "✅ Remplacement terminé!" -ForegroundColor Green
Write-Host "🚀 Redémarrez l'application pour voir les changements" -ForegroundColor Cyan
`;

fs.writeFileSync('../replace-i18n-files.ps1', replacementScriptPS);

console.log('\n📋 INSTRUCTIONS DE MIGRATION:');
console.log('');
console.log('1. 🔄 Remplacer les fichiers de configuration:');
console.log('   Windows: .\\replace-i18n-files.ps1');
console.log('   Linux/Mac: ./replace-i18n-files.sh');
console.log('');
console.log('2. 🚀 Redémarrer l\'application');
console.log('');
console.log('3. 🧪 Tester l\'interface dans les 3 langues');

// Créer un rapport de migration
const migrationReport = {
  timestamp: new Date().toISOString(),
  backupTimestamp: timestamp,
  filesCreated: [
    'lib/i18n/server-new.ts',
    'lib/i18n/context-new.tsx', 
    'lib/i18n/i18n-config.ts',
    'replace-i18n-files.sh',
    'replace-i18n-files.ps1'
  ],
  backupFiles: [
    `lib/i18n/server.backup.${timestamp}.ts`,
    `lib/i18n/context.backup.${timestamp}.tsx`
  ],
  translationStats: {
    fr: Object.keys(frTranslations).length,
    en: Object.keys(enTranslations).length,
    ar: Object.keys(arTranslations).length
  },
  nextSteps: [
    'Run replacement script',
    'Restart application',
    'Test interface in all languages',
    'Verify translations are working'
  ]
};

fs.writeFileSync('i18n-migration-report.json', JSON.stringify(migrationReport, null, 2));

console.log('\n💾 Rapport de migration sauvegardé: i18n-migration-report.json');

console.log('\n⚠️  IMPORTANT:');
console.log('   Les nouveaux fichiers utilisent les traductions JSON de locales/');
console.log('   Cela devrait résoudre le problème des résidus dans l\'interface');
console.log('   Après le remplacement, l\'application utilisera nos traductions corrigées');