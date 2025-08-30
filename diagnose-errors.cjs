const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic des erreurs de l\'application...');
console.log('==============================================');

// 1. Vérifier les fichiers de traduction
console.log('\n📁 Vérification des fichiers de traduction :');
const languages = ['fr', 'ar', 'en'];
const requiredNamespaces = ['common', 'auth', 'settings', 'nav', 'dashboard'];

languages.forEach(lang => {
  console.log(`\n🌍 Langue: ${lang}`);
  const langDir = path.join('public', 'locales', lang);
  
  if (!fs.existsSync(langDir)) {
    console.log(`❌ Dossier manquant: ${langDir}`);
    return;
  }
  
  requiredNamespaces.forEach(ns => {
    const filePath = path.join(langDir, `${ns}.json`);
    if (fs.existsSync(filePath)) {
      try {
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✅ ${ns}.json - OK`);
      } catch (e) {
        console.log(`❌ ${ns}.json - Erreur JSON: ${e.message}`);
      }
    } else {
      console.log(`⚠️  ${ns}.json - Manquant`);
    }
  });
});

// 2. Vérifier les fichiers de configuration
console.log('\n⚙️  Vérification des configurations :');
const configFiles = [
  'next.config.mjs',
  'tailwind.config.ts',
  'lib/i18n/index.ts',
  'lib/i18n/settings.ts'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - OK`);
  } else {
    console.log(`❌ ${file} - Manquant`);
  }
});

// 3. Vérifier les dépendances critiques
console.log('\n📦 Vérification du package.json :');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const criticalDeps = [
    'next',
    'react',
    'react-dom',
    'i18next',
    'react-i18next',
    'i18next-http-backend',
    'tailwindcss'
  ];
  
  criticalDeps.forEach(dep => {
    if (pkg.dependencies[dep] || pkg.devDependencies[dep]) {
      console.log(`✅ ${dep} - Installé`);
    } else {
      console.log(`❌ ${dep} - Manquant`);
    }
  });
} catch (e) {
  console.log('❌ Erreur lecture package.json:', e.message);
}

// 4. Recommandations
console.log('\n💡 Recommandations :');
console.log('1. Exécutez: npm install');
console.log('2. Nettoyez le cache: rm -rf .next');
console.log('3. Redémarrez: npm run dev');
console.log('4. Si les erreurs persistent, utilisez fix-css-and-translations.bat');

console.log('\n🎯 Diagnostic terminé !');