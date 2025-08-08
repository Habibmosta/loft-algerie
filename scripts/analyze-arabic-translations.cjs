const fs = require('fs');
const path = require('path');

console.log('🔍 ANALYSE SPÉCIALISÉE DES TRADUCTIONS ARABES\n');

// Fonction pour lire les fichiers de traduction avec gestion d'erreurs
function readTranslationFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      console.warn(`⚠️  Fichier non trouvé: ${filePath}`);
      return {};
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture de ${filePath}:`, error.message);
    return {};
  }
}

// Lire les fichiers de traduction
const arTranslations = readTranslationFile('../locales/ar/translation.json');
const frTranslations = readTranslationFile('../locales/fr/translation.json');
const enTranslations = readTranslationFile('../locales/en/translation.json');

// Fonction pour extraire toutes les clés d'un objet de traduction
function extractAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...extractAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Extraire toutes les clés de chaque langue
const arKeys = new Set(extractAllKeys(arTranslations));
const frKeys = new Set(extractAllKeys(frTranslations));
const enKeys = new Set(extractAllKeys(enTranslations));

// Trouver les clés manquantes en arabe
const missingInArabic = [];
const allReferenceKeys = new Set([...frKeys, ...enKeys]);

for (const key of allReferenceKeys) {
  if (!arKeys.has(key)) {
    missingInArabic.push(key);
  }
}

// Organiser par section
const missingBySection = {};
missingInArabic.forEach(key => {
  const section = key.split('.')[0];
  if (!missingBySection[section]) {
    missingBySection[section] = [];
  }
  missingBySection[section].push(key);
});

// Calculer les statistiques
const totalReferenceKeys = allReferenceKeys.size;
const totalArabicKeys = arKeys.size;
const coveragePercentage = Math.round((totalArabicKeys / totalReferenceKeys) * 100);

console.log('📊 STATISTIQUES GÉNÉRALES:');
console.log(`   - Clés de référence (FR + EN): ${totalReferenceKeys}`);
console.log(`   - Clés arabes existantes: ${totalArabicKeys}`);
console.log(`   - Clés manquantes en arabe: ${missingInArabic.length}`);
console.log(`   - Taux de couverture: ${coveragePercentage}%\n`);

// Analyser par section
console.log('📋 ANALYSE PAR SECTION:\n');

const sectionStats = {};
for (const section of new Set([...frKeys, ...enKeys].map(key => key.split('.')[0]))) {
  const sectionFrKeys = [...frKeys].filter(key => key.startsWith(section + '.'));
  const sectionEnKeys = [...enKeys].filter(key => key.startsWith(section + '.'));
  const sectionArKeys = [...arKeys].filter(key => key.startsWith(section + '.'));
  
  const totalSectionKeys = new Set([...sectionFrKeys, ...sectionEnKeys]).size;
  const arabicSectionKeys = sectionArKeys.length;
  const missingSectionKeys = missingBySection[section] ? missingBySection[section].length : 0;
  const sectionCoverage = totalSectionKeys > 0 ? Math.round((arabicSectionKeys / totalSectionKeys) * 100) : 0;
  
  sectionStats[section] = {
    total: totalSectionKeys,
    arabic: arabicSectionKeys,
    missing: missingSectionKeys,
    coverage: sectionCoverage
  };
  
  const status = sectionCoverage >= 90 ? '✅' : sectionCoverage >= 70 ? '🟡' : '🔴';
  console.log(`${status} ${section.toUpperCase()}: ${sectionCoverage}% (${arabicSectionKeys}/${totalSectionKeys})`);
}

console.log('\n❌ CLÉS MANQUANTES PAR SECTION:\n');

// Trier les sections par nombre de clés manquantes (priorité)
const sortedSections = Object.keys(missingBySection).sort((a, b) => {
  return missingBySection[b].length - missingBySection[a].length;
});

sortedSections.forEach(section => {
  const missing = missingBySection[section];
  const priority = missing.length > 20 ? '🔴 CRITIQUE' : missing.length > 10 ? '🟡 HAUTE' : '🟢 MOYENNE';
  
  console.log(`${priority} - ${section.toUpperCase()} (${missing.length} manquantes):`);
  missing.slice(0, 10).forEach(key => {
    console.log(`   - ${key}`);
  });
  if (missing.length > 10) {
    console.log(`   ... et ${missing.length - 10} autres`);
  }
  console.log('');
});

// Identifier les clés présentes en arabe mais absentes dans les références
const extraInArabic = [];
for (const key of arKeys) {
  if (!allReferenceKeys.has(key)) {
    extraInArabic.push(key);
  }
}

// Sauvegarder l'analyse
const analysis = {
  timestamp: new Date().toISOString(),
  summary: {
    totalReferenceKeys,
    totalArabicKeys,
    missingKeys: missingInArabic.length,
    extraKeys: extraInArabic.length,
    coveragePercentage
  },
  sectionStats,
  missingBySection,
  missingKeys: missingInArabic,
  extraKeys: extraInArabic,
  recommendations: {
    priority1: sortedSections.slice(0, 3),
    priority2: sortedSections.slice(3, 6),
    priority3: sortedSections.slice(6)
  },
  detailedAnalysis: {
    sectionsComplete: Object.keys(sectionStats).filter(s => sectionStats[s].coverage >= 90),
    sectionsPartial: Object.keys(sectionStats).filter(s => sectionStats[s].coverage > 0 && sectionStats[s].coverage < 90),
    sectionsMissing: Object.keys(sectionStats).filter(s => sectionStats[s].coverage === 0)
  }
};

fs.writeFileSync('arabic-translations-analysis.json', JSON.stringify(analysis, null, 2));
console.log('💾 Analyse sauvegardée dans: arabic-translations-analysis.json');

// Recommandations
console.log('\n🎯 RECOMMANDATIONS:');
console.log('\n🔴 PRIORITÉ CRITIQUE (à traiter en premier):');
analysis.recommendations.priority1.forEach(section => {
  const stats = sectionStats[section];
  console.log(`   - ${section}: ${stats.missing} clés manquantes (${stats.coverage}% couverture)`);
});

console.log('\n🟡 PRIORITÉ HAUTE:');
analysis.recommendations.priority2.forEach(section => {
  const stats = sectionStats[section];
  console.log(`   - ${section}: ${stats.missing} clés manquantes (${stats.coverage}% couverture)`);
});

console.log('\n📈 OBJECTIF: Atteindre 90% de couverture pour les sections critiques');