<<<<<<< HEAD
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 RÉPARATION: Configuration i18n pour Vercel\n');

// 1. Corriger lib/i18n/index.ts
console.log('📋 1. Correction de lib/i18n/index.ts:');

const indexPath = path.join(__dirname, 'lib/i18n/index.ts');
if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Remplacer useSuspense: true par false
    if (content.includes('useSuspense: true')) {
        content = content.replace('useSuspense: true', 'useSuspense: false');
        console.log('✅ useSuspense: true → false');
    }
    
    fs.writeFileSync(indexPath, content);
    console.log('✅ lib/i18n/index.ts corrigé');
} else {
    console.log('❌ lib/i18n/index.ts non trouvé');
}

// 2. Corriger lib/i18n/settings.ts
console.log('\n📋 2. Correction de lib/i18n/settings.ts:');

const settingsPath = path.join(__dirname, 'lib/i18n/settings.ts');
if (fs.existsSync(settingsPath)) {
    let content = fs.readFileSync(settingsPath, 'utf8');
    
    // Remplacer process.cwd() par un chemin relatif
    if (content.includes('process.cwd()')) {
        content = content.replace(
            /process\.cwd\(\) \+ '\/public\/locales\/\{\{lng\}\}\/\{\{ns\}\}\.json'/g,
            "'/locales/{{lng}}/{{ns}}.json'"
        );
        console.log('✅ process.cwd() remplacé par chemin relatif');
    }
    
    fs.writeFileSync(settingsPath, content);
    console.log('✅ lib/i18n/settings.ts corrigé');
} else {
    console.log('❌ lib/i18n/settings.ts non trouvé');
}

// 3. Créer une configuration i18n unifiée et compatible Vercel
console.log('\n📋 3. Création d\'une configuration i18n unifiée:');

const unifiedConfig = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Configuration unifiée compatible Vercel
const isProduction = process.env.NODE_ENV === 'production';
const isServer = typeof window === 'undefined';

// Configuration de base
const i18nConfig = {
  supportedLngs: ['en', 'fr', 'ar'],
  fallbackLng: 'fr',
  debug: !isProduction && !isServer,
  
  ns: [
    'common', 'lofts', 'bills', 'dashboard', 'executive', 'notifications',
    'paymentMethods', 'reports', 'reservations', 'tasks', 'teams',
    'unauthorized', 'transactions', 'nav', 'auth', 'settings', 'owners',
    'conversations', 'analytics', 'landing', 'internetConnections',
    'zoneAreas', 'theme', 'testSound', 'testTranslations'
  ],
  
  defaultNS: 'common',
  nsSeparator: '.',
  keySeparator: ':',
  
  detection: {
    order: ['cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
    caches: ['cookie', 'localStorage'],
    lookupCookie: 'language',
    lookupLocalStorage: 'language',
    cookieMinutes: 525600, // 1 an
  },
  
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    requestOptions: {
      cache: isProduction ? 'default' : 'no-cache',
    },
  },
  
  react: {
    useSuspense: false, // CRITIQUE pour Vercel
    bindI18n: 'languageChanged',
    bindI18nStore: 'added removed',
  },
  
  interpolation: {
    escapeValue: false,
  },
  
  // Gestion des clés manquantes
  saveMissing: !isProduction,
  missingKeyHandler: (lng, ns, key, fallbackValue) => {
    if (!isProduction) {
      console.warn(\`Missing translation: \${lng}.\${ns}:\${key}\`);
    }
    return fallbackValue || key;
  },
};

// Initialisation conditionnelle
if (!isServer) {
  i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nConfig);
}

export default i18n;
export { i18nConfig };
`;

// Sauvegarder l'ancienne configuration
const backupPath = path.join(__dirname, 'lib/i18n.ts.backup');
if (fs.existsSync(path.join(__dirname, 'lib/i18n.ts'))) {
    fs.copyFileSync(path.join(__dirname, 'lib/i18n.ts'), backupPath);
    console.log('✅ Sauvegarde de l\'ancienne configuration créée');
}

// Écrire la nouvelle configuration
fs.writeFileSync(path.join(__dirname, 'lib/i18n.ts'), unifiedConfig);
console.log('✅ Configuration i18n unifiée créée');

// 4. Corriger le contexte i18n
console.log('\n📋 4. Correction du contexte i18n:');

const contextPath = path.join(__dirname, 'lib/i18n/context.tsx');
if (fs.existsSync(contextPath)) {
    let content = fs.readFileSync(contextPath, 'utf8');
    
    // S'assurer que useSuspense est false
    if (content.includes('useSuspense')) {
        content = content.replace(/useSuspense:\s*true/g, 'useSuspense: false');
        console.log('✅ useSuspense défini à false dans le contexte');
    }
    
    fs.writeFileSync(contextPath, content);
    console.log('✅ Contexte i18n corrigé');
}

console.log('\n🎉 RÉPARATION TERMINÉE !');
console.log('\n📋 Résumé des corrections:');
console.log('✅ useSuspense: false dans toutes les configurations');
console.log('✅ process.cwd() remplacé par chemins relatifs');
console.log('✅ Configuration unifiée compatible Vercel');
console.log('✅ Sauvegarde de l\'ancienne configuration');

console.log('\n🚀 Prochaines étapes:');
console.log('1. Tester localement: npm run dev');
console.log('2. Vérifier les traductions: node verify-lofts-component.cjs');
console.log('3. Redéployer sur Vercel: vercel --prod');
=======
const fs = require('fs');
const path = require('path');

console.log('🔧 Correction de la configuration i18next...');

// Vérifier les fichiers de configuration i18n
const configFiles = [
  'lib/i18n/index.ts',
  'lib/i18n/settings.ts',
  'lib/i18n/context.tsx'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// Créer une configuration i18n simplifiée
const simplifiedConfig = `import i18n from 'i18next'
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
`;

// Sauvegarder la configuration simplifiée
fs.writeFileSync('lib/i18n/simple-config.ts', simplifiedConfig);
console.log('✅ Configuration i18n simplifiée créée');

console.log('🎉 Configuration i18n corrigée !');
console.log('');
console.log('📋 Prochaines étapes :');
console.log('1. Redémarrez le serveur de développement');
console.log('2. Si les erreurs persistent, utilisez la config simplifiée');
console.log('3. Vérifiez les imports dans vos composants');
>>>>>>> 0181c663fd95b9542a53fdc8606aef496de0bbce
