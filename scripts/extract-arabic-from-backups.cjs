const fs = require('fs');

console.log('🔍 EXTRACTION DES TRADUCTIONS ARABES DEPUIS LES SAUVEGARDES\n');

// Lire le fichier simple-migration.cjs pour extraire les traductions arabes
let recoveredTranslations = {};

try {
  const migrationContent = fs.readFileSync('simple-migration.cjs', 'utf8');
  
  // Extraire la section ar: { ... } du fichier
  const arSectionMatch = migrationContent.match(/ar:\s*{([^}]+(?:{[^}]*}[^}]*)*)/s);
  
  if (arSectionMatch) {
    console.log('✅ Section arabe trouvée dans simple-migration.cjs');
    
    // Extraire manuellement les traductions arabes du contenu
    const arContent = arSectionMatch[0];
    
    // Parser les traductions ligne par ligne
    const lines = arContent.split('\n');
    
    for (const line of lines) {
      const match = line.match(/["']([^"']+)["']:\s*["']([^"']+)["']/);
      if (match) {
        const [, key, value] = match;
        if (value && /[\u0600-\u06FF]/.test(value)) { // Vérifier que c'est de l'arabe
          recoveredTranslations[key] = value;
        }
      }
    }
    
    console.log(`📊 ${Object.keys(recoveredTranslations).length} traductions arabes extraites`);
    
  } else {
    console.log('❌ Section arabe non trouvée dans simple-migration.cjs');
  }
  
} catch (error) {
  console.log(`❌ Erreur lors de la lecture de simple-migration.cjs: ${error.message}`);
}

// Rechercher d'autres sources potentielles
console.log('\n🔍 Recherche d\'autres sources...');

// Vérifier s'il y a d'autres fichiers avec des traductions arabes
const additionalSources = [
  'complete-arabic-translations.cjs',
  'add-missing-dashboard-translations.cjs'
];

for (const sourceFile of additionalSources) {
  try {
    if (fs.existsSync(sourceFile)) {
      const content = fs.readFileSync(sourceFile, 'utf8');
      
      // Rechercher des patterns de traductions arabes
      const arabicMatches = content.match(/["']([^"']*[\u0600-\u06FF][^"']*)["']/g);
      
      if (arabicMatches && arabicMatches.length > 0) {
        console.log(`✅ ${sourceFile}: ${arabicMatches.length} traductions arabes trouvées`);
        
        // Essayer d'extraire les paires clé-valeur
        const keyValueMatches = content.match(/["']([^"']+)["']:\s*["']([^"']*[\u0600-\u06FF][^"']*)["']/g);
        
        if (keyValueMatches) {
          for (const match of keyValueMatches) {
            const kvMatch = match.match(/["']([^"']+)["']:\s*["']([^"']+)["']/);
            if (kvMatch) {
              const [, key, value] = kvMatch;
              if (!recoveredTranslations[key]) { // Ne pas écraser les existantes
                recoveredTranslations[key] = value;
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`⚠️  Erreur lors de la lecture de ${sourceFile}: ${error.message}`);
  }
}

console.log(`\n📊 TOTAL RÉCUPÉRÉ: ${Object.keys(recoveredTranslations).length} traductions arabes`);

// Organiser les traductions par section
const translationsBySection = {};

for (const [key, value] of Object.entries(recoveredTranslations)) {
  const section = key.split('.')[0];
  if (!translationsBySection[section]) {
    translationsBySection[section] = {};
  }
  translationsBySection[section][key] = value;
}

console.log('\n📋 TRADUCTIONS PAR SECTION:');
for (const [section, translations] of Object.entries(translationsBySection)) {
  console.log(`   📁 ${section.toUpperCase()}: ${Object.keys(translations).length} traductions`);
}

// Convertir en structure imbriquée pour l'intégration
function flatToNested(flat) {
  const nested = {};
  
  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split('.');
    let current = nested;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) current[k] = {};
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return nested;
}

const nestedTranslations = flatToNested(recoveredTranslations);

// Lire le fichier de traductions arabes actuel
let currentArTranslations = {};
try {
  currentArTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));
} catch (error) {
  console.log('⚠️  Fichier de traductions arabes actuel non trouvé, création d\'un nouveau');
}

// Fusionner les traductions récupérées avec les existantes
function mergeDeep(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      // Ne pas écraser les traductions existantes
      if (!target[key]) {
        target[key] = source[key];
      }
    }
  }
}

const beforeCount = JSON.stringify(currentArTranslations).match(/[\u0600-\u06FF]/g)?.length || 0;

mergeDeep(currentArTranslations, nestedTranslations);

const afterCount = JSON.stringify(currentArTranslations).match(/[\u0600-\u06FF]/g)?.length || 0;

console.log(`\n📈 AMÉLIORATION: ${afterCount - beforeCount} caractères arabes ajoutés`);

// Sauvegarder les résultats
const backupResults = {
  timestamp: new Date().toISOString(),
  source: 'simple-migration.cjs and other backup files',
  recoveredTranslations,
  translationsBySection,
  nestedTranslations,
  stats: {
    totalRecovered: Object.keys(recoveredTranslations).length,
    sectionsAffected: Object.keys(translationsBySection).length,
    charactersAdded: afterCount - beforeCount
  }
};

fs.writeFileSync('arabic-backup-recovery.json', JSON.stringify(backupResults, null, 2));

// Créer une sauvegarde du fichier actuel avant modification
const backupPath = `../locales/ar/translation.backup.${Date.now()}.json`;
if (fs.existsSync('../locales/ar/translation.json')) {
  fs.copyFileSync('../locales/ar/translation.json', backupPath);
  console.log(`💾 Sauvegarde créée: ${backupPath}`);
}

// Sauvegarder le fichier de traductions mis à jour
fs.writeFileSync('../locales/ar/translation.json', JSON.stringify(currentArTranslations, null, 2));

console.log('\n✅ RÉCUPÉRATION TERMINÉE');
console.log('📁 Fichier mis à jour: locales/ar/translation.json');
console.log('📊 Résultats sauvegardés: arabic-backup-recovery.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Vérifier les traductions récupérées');
console.log('2. Exécuter l\'analyse de progression');
console.log('3. Continuer avec la génération automatique pour les clés manquantes');