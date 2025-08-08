const fs = require('fs');

console.log('🔍 ANALYSE DE LA COUVERTURE DES SECTIONS CRITIQUES\n');
console.log('📋 Sections cibles: lofts, tasks, reservations\n');

// Lire les fichiers de traduction
function readTranslationFile(filePath, language) {
  try {
    if (fs.existsSync(filePath)) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${language.toUpperCase()}: Fichier chargé avec succès`);
      return content;
    } else {
      console.warn(`⚠️  ${language.toUpperCase()}: Fichier non trouvé - ${filePath}`);
      return {};
    }
  } catch (error) {
    console.error(`❌ ${language.toUpperCase()}: Erreur lors de la lecture - ${error.message}`);
    return {};
  }
}

const frTranslations = readTranslationFile('../locales/fr/translation.json', 'français');
const enTranslations = readTranslationFile('../locales/en/translation.json', 'anglais');
const arTranslations = readTranslationFile('../locales/ar/translation.json', 'arabe');

// Fonction pour extraire les clés d'une section spécifique
function extractSectionKeys(obj, sectionName) {
  if (!obj[sectionName]) return [];
  
  const keys = [];
  
  function extractKeys(section, prefix = sectionName) {
    for (const [key, value] of Object.entries(section)) {
      const fullKey = `${prefix}.${key}`;
      
      if (typeof value === 'object' && value !== null) {
        extractKeys(value, fullKey);
      } else {
        keys.push({
          key: fullKey,
          value: value,
          subsection: fullKey.split('.').slice(1, -1).join('.') || 'root',
          property: key
        });
      }
    }
  }
  
  extractKeys(obj[sectionName]);
  return keys;
}

// Sections cibles à analyser
const targetSections = ['lofts', 'tasks', 'reservations'];

console.log('\n📊 ANALYSE PAR SECTION:\n');

const analysisResults = {};

targetSections.forEach(section => {
  console.log(`🔍 Analyse de la section: ${section.toUpperCase()}`);
  
  // Extraire les clés pour chaque langue
  const frKeys = extractSectionKeys(frTranslations, section);
  const enKeys = extractSectionKeys(enTranslations, section);
  const arKeys = extractSectionKeys(arTranslations, section);
  
  // Créer des sets pour les comparaisons
  const frKeySet = new Set(frKeys.map(item => item.key));
  const enKeySet = new Set(enKeys.map(item => item.key));
  const arKeySet = new Set(arKeys.map(item => item.key));
  
  // Calculer les statistiques
  const allKeys = new Set([...frKeySet, ...enKeySet]);
  const totalKeys = allKeys.size;
  
  const frCoverage = Math.round((frKeySet.size / totalKeys) * 100);
  const enCoverage = Math.round((enKeySet.size / totalKeys) * 100);
  const arCoverage = Math.round((arKeySet.size / totalKeys) * 100);
  
  // Identifier les clés manquantes
  const missingInFr = [...allKeys].filter(key => !frKeySet.has(key));
  const missingInEn = [...allKeys].filter(key => !enKeySet.has(key));
  const missingInAr = [...allKeys].filter(key => !arKeySet.has(key));
  
  // Analyser les sous-sections
  const subsections = {};
  [...allKeys].forEach(key => {
    const parts = key.split('.');
    const subsection = parts.slice(1, -1).join('.') || 'root';
    
    if (!subsections[subsection]) {
      subsections[subsection] = {
        total: 0,
        fr: 0,
        en: 0,
        ar: 0
      };
    }
    
    subsections[subsection].total++;
    if (frKeySet.has(key)) subsections[subsection].fr++;
    if (enKeySet.has(key)) subsections[subsection].en++;
    if (arKeySet.has(key)) subsections[subsection].ar++;
  });
  
  // Afficher les résultats
  console.log(`   📊 Total des clés: ${totalKeys}`);
  console.log(`   🇫🇷 Français: ${frKeys.length} clés (${frCoverage}%)`);
  console.log(`   🇬🇧 Anglais: ${enKeys.length} clés (${enCoverage}%)`);
  console.log(`   🇸🇦 Arabe: ${arKeys.length} clés (${arCoverage}%)`);
  
  if (missingInFr.length > 0) {
    console.log(`   ❌ Manquant en français: ${missingInFr.length} clés`);
  }
  if (missingInEn.length > 0) {
    console.log(`   ❌ Manquant en anglais: ${missingInEn.length} clés`);
  }
  if (missingInAr.length > 0) {
    console.log(`   ❌ Manquant en arabe: ${missingInAr.length} clés`);
  }
  
  // Analyser les sous-sections
  console.log(`   📁 Sous-sections (${Object.keys(subsections).length}):`);
  Object.entries(subsections).forEach(([subsection, stats]) => {
    const frPercent = Math.round((stats.fr / stats.total) * 100);
    const enPercent = Math.round((stats.en / stats.total) * 100);
    const arPercent = Math.round((stats.ar / stats.total) * 100);
    
    const status = (frPercent >= 90 && enPercent >= 90 && arPercent >= 90) ? '✅' : 
                   (frPercent >= 70 && enPercent >= 70 && arPercent >= 70) ? '🟡' : '🔴';
    
    console.log(`      ${status} ${subsection || 'root'}: FR ${frPercent}%, EN ${enPercent}%, AR ${arPercent}% (${stats.total} clés)`);
  });
  
  // Sauvegarder les résultats
  analysisResults[section] = {
    totalKeys,
    coverage: {
      fr: { count: frKeys.length, percentage: frCoverage, missing: missingInFr },
      en: { count: enKeys.length, percentage: enCoverage, missing: missingInEn },
      ar: { count: arKeys.length, percentage: arCoverage, missing: missingInAr }
    },
    subsections,
    keys: {
      fr: frKeys,
      en: enKeys,
      ar: arKeys
    }
  };
  
  console.log('');
});

// Calculer les statistiques globales
const globalStats = {
  totalSections: targetSections.length,
  totalKeys: Object.values(analysisResults).reduce((sum, section) => sum + section.totalKeys, 0),
  averageCoverage: {
    fr: Math.round(Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.fr.percentage, 0) / targetSections.length),
    en: Math.round(Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.en.percentage, 0) / targetSections.length),
    ar: Math.round(Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.ar.percentage, 0) / targetSections.length)
  },
  totalMissing: {
    fr: Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.fr.missing.length, 0),
    en: Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.en.missing.length, 0),
    ar: Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.ar.missing.length, 0)
  }
};

console.log('🌍 STATISTIQUES GLOBALES:\n');
console.log(`📊 Sections analysées: ${globalStats.totalSections}`);
console.log(`🔑 Total des clés: ${globalStats.totalKeys}`);
console.log(`📈 Couverture moyenne:`);
console.log(`   🇫🇷 Français: ${globalStats.averageCoverage.fr}%`);
console.log(`   🇬🇧 Anglais: ${globalStats.averageCoverage.en}%`);
console.log(`   🇸🇦 Arabe: ${globalStats.averageCoverage.ar}%`);
console.log(`❌ Total des clés manquantes:`);
console.log(`   🇫🇷 Français: ${globalStats.totalMissing.fr} clés`);
console.log(`   🇬🇧 Anglais: ${globalStats.totalMissing.en} clés`);
console.log(`   🇸🇦 Arabe: ${globalStats.totalMissing.ar} clés`);

// Identifier les priorités
console.log('\n🎯 PRIORITÉS D\'ACTION:\n');

const priorities = [];

targetSections.forEach(section => {
  const sectionData = analysisResults[section];
  const avgCoverage = (sectionData.coverage.fr.percentage + sectionData.coverage.en.percentage + sectionData.coverage.ar.percentage) / 3;
  const totalMissing = sectionData.coverage.fr.missing.length + sectionData.coverage.en.missing.length + sectionData.coverage.ar.missing.length;
  
  let priority = 'BASSE';
  if (avgCoverage < 70 || totalMissing > 50) priority = 'CRITIQUE';
  else if (avgCoverage < 85 || totalMissing > 20) priority = 'HAUTE';
  else if (avgCoverage < 95 || totalMissing > 5) priority = 'MOYENNE';
  
  priorities.push({
    section,
    priority,
    avgCoverage: Math.round(avgCoverage),
    totalMissing,
    details: sectionData
  });
});

// Trier par priorité
const priorityOrder = { 'CRITIQUE': 0, 'HAUTE': 1, 'MOYENNE': 2, 'BASSE': 3 };
priorities.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

priorities.forEach(({ section, priority, avgCoverage, totalMissing }) => {
  const icon = priority === 'CRITIQUE' ? '🔴' : priority === 'HAUTE' ? '🟡' : priority === 'MOYENNE' ? '🟠' : '🟢';
  console.log(`${icon} ${priority}: ${section.toUpperCase()} - ${avgCoverage}% couverture, ${totalMissing} clés manquantes`);
});

// Sauvegarder l'analyse complète
const fullAnalysis = {
  timestamp: new Date().toISOString(),
  targetSections,
  analysisResults,
  globalStats,
  priorities,
  recommendations: priorities.map(p => ({
    section: p.section,
    action: p.priority === 'CRITIQUE' ? 'Action immédiate requise' : 
            p.priority === 'HAUTE' ? 'Traitement prioritaire' : 
            p.priority === 'MOYENNE' ? 'Amélioration recommandée' : 'Maintenance standard'
  }))
};

fs.writeFileSync('core-sections-analysis.json', JSON.stringify(fullAnalysis, null, 2));

console.log('\n💾 Analyse complète sauvegardée: core-sections-analysis.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Créer un analyseur spécialisé pour ces sections');
console.log('2. Extraire la terminologie métier existante');
console.log('3. Commencer par la section la plus critique');
console.log('4. Développer des traductions contextuelles');