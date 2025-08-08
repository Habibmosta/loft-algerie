const fs = require('fs');

console.log('🔍 ANALYSE DES SECTIONS AVANCÉES\n');
console.log('📋 Sections cibles: conversations, notifications, reports\n');

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

// Fonction pour analyser une section en détail
function analyzeSection(translations, sectionName, language) {
  if (!translations[sectionName]) {
    return {
      exists: false,
      keys: [],
      subsections: {},
      patterns: []
    };
  }
  
  const keys = [];
  const subsections = {};
  const patterns = [];
  
  function extractKeys(section, prefix = sectionName) {
    for (const [key, value] of Object.entries(section)) {
      const fullKey = `${prefix}.${key}`;
      
      if (typeof value === 'object' && value !== null) {
        // C'est une sous-section
        const subsectionName = key;
        if (!subsections[subsectionName]) {
          subsections[subsectionName] = [];
        }
        
        extractKeys(value, fullKey);
      } else {
        // C'est une clé de traduction
        keys.push({
          key: fullKey,
          value: value,
          subsection: fullKey.split('.').slice(1, -1).join('.') || 'root',
          property: key,
          type: detectKeyType(key, value)
        });
        
        // Ajouter à la sous-section appropriée
        const subsectionName = fullKey.split('.').slice(1, -1).join('.') || 'root';
        if (!subsections[subsectionName]) {
          subsections[subsectionName] = [];
        }
        subsections[subsectionName].push(fullKey);
      }
    }
  }
  
  extractKeys(translations[sectionName]);
  
  // Détecter les patterns d'interface
  patterns.push(...detectUIPatterns(keys));
  
  return {
    exists: true,
    keys,
    subsections,
    patterns,
    totalKeys: keys.length
  };
}

// Fonction pour détecter le type d'une clé de traduction
function detectKeyType(key, value) {
  const keyLower = key.toLowerCase();
  const valueLower = value ? value.toLowerCase() : '';
  
  // Types d'interface
  if (keyLower.includes('button') || keyLower.includes('btn')) return 'button';
  if (keyLower.includes('title') || keyLower.includes('heading')) return 'title';
  if (keyLower.includes('description') || keyLower.includes('desc')) return 'description';
  if (keyLower.includes('placeholder')) return 'placeholder';
  if (keyLower.includes('label')) return 'label';
  if (keyLower.includes('error') || keyLower.includes('warning')) return 'message';
  if (keyLower.includes('success') || keyLower.includes('info')) return 'message';
  if (keyLower.includes('status')) return 'status';
  if (keyLower.includes('type') || keyLower.includes('category')) return 'category';
  if (keyLower.includes('date') || keyLower.includes('time')) return 'datetime';
  if (keyLower.includes('count') || keyLower.includes('number')) return 'numeric';
  
  // Types de contenu
  if (valueLower && (valueLower.includes('{') || valueLower.includes('%'))) return 'dynamic';
  if (keyLower.includes('action')) return 'action';
  if (keyLower.includes('navigation') || keyLower.includes('nav')) return 'navigation';
  
  return 'text';
}

// Fonction pour détecter les patterns d'interface
function detectUIPatterns(keys) {
  const patterns = [];
  const keysByType = {};
  
  // Grouper les clés par type
  keys.forEach(keyObj => {
    const type = keyObj.type;
    if (!keysByType[type]) {
      keysByType[type] = [];
    }
    keysByType[type].push(keyObj);
  });
  
  // Analyser les patterns
  Object.entries(keysByType).forEach(([type, typeKeys]) => {
    if (typeKeys.length > 1) {
      patterns.push({
        type: `${type}_pattern`,
        count: typeKeys.length,
        examples: typeKeys.slice(0, 3).map(k => k.key),
        description: `Pattern de ${type} répété ${typeKeys.length} fois`
      });
    }
  });
  
  return patterns;
}

// Sections cibles à analyser
const targetSections = ['conversations', 'notifications', 'reports'];

console.log('\n📊 ANALYSE DÉTAILLÉE PAR SECTION:\n');

const analysisResults = {};

targetSections.forEach(section => {
  console.log(`🔍 Analyse de la section: ${section.toUpperCase()}`);
  
  // Analyser chaque langue
  const frAnalysis = analyzeSection(frTranslations, section, 'français');
  const enAnalysis = analyzeSection(enTranslations, section, 'anglais');
  const arAnalysis = analyzeSection(arTranslations, section, 'arabe');
  
  // Calculer les statistiques
  const maxKeys = Math.max(frAnalysis.totalKeys || 0, enAnalysis.totalKeys || 0, arAnalysis.totalKeys || 0);
  
  const frCoverage = maxKeys > 0 ? Math.round((frAnalysis.totalKeys / maxKeys) * 100) : 0;
  const enCoverage = maxKeys > 0 ? Math.round((enAnalysis.totalKeys / maxKeys) * 100) : 0;
  const arCoverage = maxKeys > 0 ? Math.round((arAnalysis.totalKeys / maxKeys) * 100) : 0;
  
  console.log(`   📊 Clés maximum détectées: ${maxKeys}`);
  console.log(`   🇫🇷 Français: ${frAnalysis.totalKeys || 0} clés (${frCoverage}%) - ${frAnalysis.exists ? 'Existe' : 'Manquant'}`);
  console.log(`   🇬🇧 Anglais: ${enAnalysis.totalKeys || 0} clés (${enCoverage}%) - ${enAnalysis.exists ? 'Existe' : 'Manquant'}`);
  console.log(`   🇸🇦 Arabe: ${arAnalysis.totalKeys || 0} clés (${arCoverage}%) - ${arAnalysis.exists ? 'Existe' : 'Manquant'}`);
  
  // Analyser les sous-sections
  const allSubsections = new Set([
    ...Object.keys(frAnalysis.subsections || {}),
    ...Object.keys(enAnalysis.subsections || {}),
    ...Object.keys(arAnalysis.subsections || {})
  ]);
  
  if (allSubsections.size > 0) {
    console.log(`   📁 Sous-sections détectées (${allSubsections.size}):`);
    [...allSubsections].forEach(subsection => {
      const frCount = (frAnalysis.subsections[subsection] || []).length;
      const enCount = (enAnalysis.subsections[subsection] || []).length;
      const arCount = (arAnalysis.subsections[subsection] || []).length;
      const maxCount = Math.max(frCount, enCount, arCount);
      
      const frPercent = maxCount > 0 ? Math.round((frCount / maxCount) * 100) : 0;
      const enPercent = maxCount > 0 ? Math.round((enCount / maxCount) * 100) : 0;
      const arPercent = maxCount > 0 ? Math.round((arCount / maxCount) * 100) : 0;
      
      const status = (frPercent >= 90 && enPercent >= 90 && arPercent >= 90) ? '✅' : 
                     (frPercent >= 70 && enPercent >= 70 && arPercent >= 70) ? '🟡' : '🔴';
      
      console.log(`      ${status} ${subsection}: FR ${frPercent}%, EN ${enPercent}%, AR ${arPercent}% (max ${maxCount} clés)`);
    });
  }
  
  // Analyser les patterns d'interface
  const allPatterns = [...(frAnalysis.patterns || []), ...(enAnalysis.patterns || []), ...(arAnalysis.patterns || [])];
  const uniquePatterns = allPatterns.reduce((acc, pattern) => {
    const existing = acc.find(p => p.type === pattern.type);
    if (existing) {
      existing.count = Math.max(existing.count, pattern.count);
    } else {
      acc.push(pattern);
    }
    return acc;
  }, []);
  
  if (uniquePatterns.length > 0) {
    console.log(`   🎨 Patterns d'interface détectés (${uniquePatterns.length}):`);
    uniquePatterns.forEach(pattern => {
      console.log(`      📋 ${pattern.type}: ${pattern.count} occurrences`);
      console.log(`         Exemples: ${pattern.examples.join(', ')}`);
    });
  }
  
  // Sauvegarder les résultats
  analysisResults[section] = {
    maxKeys,
    languages: {
      fr: frAnalysis,
      en: enAnalysis,
      ar: arAnalysis
    },
    coverage: {
      fr: frCoverage,
      en: enCoverage,
      ar: arCoverage,
      average: Math.round((frCoverage + enCoverage + arCoverage) / 3)
    },
    subsections: [...allSubsections],
    patterns: uniquePatterns,
    complexity: calculateComplexity(maxKeys, allSubsections.size, uniquePatterns.length)
  };
  
  console.log('');
});

// Fonction pour calculer la complexité d'une section
function calculateComplexity(keyCount, subsectionCount, patternCount) {
  const score = keyCount + (subsectionCount * 5) + (patternCount * 3);
  
  if (score > 100) return 'TRÈS ÉLEVÉE';
  if (score > 50) return 'ÉLEVÉE';
  if (score > 20) return 'MOYENNE';
  return 'FAIBLE';
}

// Calculer les statistiques globales
const globalStats = {
  totalSections: targetSections.length,
  sectionsWithData: Object.values(analysisResults).filter(s => s.maxKeys > 0).length,
  totalKeys: Object.values(analysisResults).reduce((sum, section) => sum + section.maxKeys, 0),
  averageCoverage: {
    fr: Math.round(Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.fr, 0) / targetSections.length),
    en: Math.round(Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.en, 0) / targetSections.length),
    ar: Math.round(Object.values(analysisResults).reduce((sum, section) => sum + section.coverage.ar, 0) / targetSections.length)
  },
  complexitySummary: Object.entries(analysisResults).reduce((acc, [section, data]) => {
    acc[data.complexity] = (acc[data.complexity] || 0) + 1;
    return acc;
  }, {})
};

console.log('🌍 STATISTIQUES GLOBALES:\n');
console.log(`📊 Sections analysées: ${globalStats.totalSections}`);
console.log(`📈 Sections avec données: ${globalStats.sectionsWithData}`);
console.log(`🔑 Total des clés: ${globalStats.totalKeys}`);
console.log(`📈 Couverture moyenne:`);
console.log(`   🇫🇷 Français: ${globalStats.averageCoverage.fr}%`);
console.log(`   🇬🇧 Anglais: ${globalStats.averageCoverage.en}%`);
console.log(`   🇸🇦 Arabe: ${globalStats.averageCoverage.ar}%`);
console.log(`🎯 Répartition par complexité:`);
Object.entries(globalStats.complexitySummary).forEach(([complexity, count]) => {
  console.log(`   ${complexity}: ${count} section(s)`);
});

// Identifier les priorités d'implémentation
console.log('\n🎯 PRIORITÉS D\'IMPLÉMENTATION:\n');

const priorities = [];

targetSections.forEach(section => {
  const sectionData = analysisResults[section];
  const avgCoverage = sectionData.coverage.average;
  const complexity = sectionData.complexity;
  const keyCount = sectionData.maxKeys;
  
  let priority = 'BASSE';
  let reason = '';
  
  if (keyCount === 0) {
    priority = 'CRITIQUE';
    reason = 'Section complètement manquante';
  } else if (avgCoverage < 70) {
    priority = 'HAUTE';
    reason = `Couverture insuffisante (${avgCoverage}%)`;
  } else if (avgCoverage < 90) {
    priority = 'MOYENNE';
    reason = `Couverture partielle (${avgCoverage}%)`;
  } else {
    priority = 'BASSE';
    reason = `Couverture satisfaisante (${avgCoverage}%)`;
  }
  
  priorities.push({
    section,
    priority,
    avgCoverage,
    keyCount,
    complexity,
    reason,
    details: sectionData
  });
});

// Trier par priorité
const priorityOrder = { 'CRITIQUE': 0, 'HAUTE': 1, 'MOYENNE': 2, 'BASSE': 3 };
priorities.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

priorities.forEach(({ section, priority, avgCoverage, keyCount, complexity, reason }) => {
  const icon = priority === 'CRITIQUE' ? '🔴' : priority === 'HAUTE' ? '🟡' : priority === 'MOYENNE' ? '🟠' : '🟢';
  console.log(`${icon} ${priority}: ${section.toUpperCase()}`);
  console.log(`   📊 ${keyCount} clés, ${avgCoverage}% couverture, complexité ${complexity}`);
  console.log(`   💡 ${reason}`);
  console.log('');
});

// Recommandations d'implémentation
console.log('💡 RECOMMANDATIONS D\'IMPLÉMENTATION:\n');

const criticalSections = priorities.filter(p => p.priority === 'CRITIQUE');
const highSections = priorities.filter(p => p.priority === 'HAUTE');

if (criticalSections.length > 0) {
  console.log('🔴 ACTIONS CRITIQUES:');
  criticalSections.forEach(({ section, details }) => {
    console.log(`   - Créer complètement la section ${section}`);
    console.log(`   - Développer ${details.maxKeys || 'N/A'} traductions`);
    console.log(`   - Implémenter ${details.subsections.length} sous-sections`);
  });
  console.log('');
}

if (highSections.length > 0) {
  console.log('🟡 ACTIONS PRIORITAIRES:');
  highSections.forEach(({ section, details }) => {
    const missingKeys = Math.round(details.maxKeys * (100 - details.coverage.average) / 100);
    console.log(`   - Compléter la section ${section}`);
    console.log(`   - Ajouter environ ${missingKeys} traductions manquantes`);
    console.log(`   - Harmoniser les sous-sections existantes`);
  });
  console.log('');
}

// Sauvegarder l'analyse complète
const fullAnalysis = {
  timestamp: new Date().toISOString(),
  targetSections,
  analysisResults,
  globalStats,
  priorities,
  recommendations: {
    immediate: criticalSections.map(p => ({
      section: p.section,
      action: 'Création complète requise',
      effort: 'Élevé',
      keys: p.keyCount
    })),
    priority: highSections.map(p => ({
      section: p.section,
      action: 'Complétion des traductions manquantes',
      effort: 'Moyen',
      keys: Math.round(p.keyCount * (100 - p.avgCoverage) / 100)
    }))
  }
};

fs.writeFileSync('advanced-sections-analysis.json', JSON.stringify(fullAnalysis, null, 2));

console.log('💾 Analyse complète sauvegardée: advanced-sections-analysis.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Créer des templates pour les patterns d\'interface identifiés');
console.log('2. Commencer par les sections critiques');
console.log('3. Développer les traductions par ordre de priorité');
console.log('4. Valider l\'intégration avec les sections existantes');