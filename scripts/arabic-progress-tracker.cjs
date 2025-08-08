const fs = require('fs');

/**
 * Script de suivi des progrès de restauration des traductions arabes
 * Peut être exécuté à tout moment pour voir l'évolution
 */

console.log('📈 SUIVI DES PROGRÈS - RESTAURATION TRADUCTIONS ARABES\n');

// Lire l'analyse précédente si elle existe
let previousAnalysis = null;
try {
  if (fs.existsSync('arabic-translations-analysis.json')) {
    previousAnalysis = JSON.parse(fs.readFileSync('arabic-translations-analysis.json', 'utf8'));
  }
} catch (error) {
  console.log('ℹ️  Aucune analyse précédente trouvée');
}

// Exécuter une nouvelle analyse
function analyzeCurrentState() {
  const arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));
  const frTranslations = JSON.parse(fs.readFileSync('../locales/fr/translation.json', 'utf8'));
  const enTranslations = JSON.parse(fs.readFileSync('../locales/en/translation.json', 'utf8'));

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

  const arKeys = new Set(extractAllKeys(arTranslations));
  const frKeys = new Set(extractAllKeys(frTranslations));
  const enKeys = new Set(extractAllKeys(enTranslations));
  const allReferenceKeys = new Set([...frKeys, ...enKeys]);

  const missingInArabic = [];
  for (const key of allReferenceKeys) {
    if (!arKeys.has(key)) {
      missingInArabic.push(key);
    }
  }

  const totalReferenceKeys = allReferenceKeys.size;
  const totalArabicKeys = arKeys.size;
  const coveragePercentage = Math.round((totalArabicKeys / totalReferenceKeys) * 100);

  return {
    totalReferenceKeys,
    totalArabicKeys,
    missingKeys: missingInArabic.length,
    coveragePercentage,
    timestamp: new Date().toISOString()
  };
}

const currentAnalysis = analyzeCurrentState();

// Afficher les statistiques actuelles
console.log('📊 ÉTAT ACTUEL:');
console.log(`   - Clés de référence: ${currentAnalysis.totalReferenceKeys}`);
console.log(`   - Clés arabes: ${currentAnalysis.totalArabicKeys}`);
console.log(`   - Clés manquantes: ${currentAnalysis.missingKeys}`);
console.log(`   - Couverture: ${currentAnalysis.coveragePercentage}%`);

// Comparer avec l'analyse précédente si disponible
if (previousAnalysis) {
  console.log('\n📈 ÉVOLUTION DEPUIS LA DERNIÈRE ANALYSE:');
  
  const keysDiff = currentAnalysis.totalArabicKeys - previousAnalysis.summary.totalArabicKeys;
  const missingDiff = previousAnalysis.summary.missingKeys - currentAnalysis.missingKeys;
  const coverageDiff = currentAnalysis.coveragePercentage - previousAnalysis.summary.coveragePercentage;
  
  const keysIcon = keysDiff > 0 ? '📈' : keysDiff < 0 ? '📉' : '➡️';
  const missingIcon = missingDiff > 0 ? '✅' : missingDiff < 0 ? '❌' : '➡️';
  const coverageIcon = coverageDiff > 0 ? '🎯' : coverageDiff < 0 ? '⚠️' : '➡️';
  
  console.log(`   ${keysIcon} Clés ajoutées: ${keysDiff > 0 ? '+' : ''}${keysDiff}`);
  console.log(`   ${missingIcon} Clés manquantes réduites: ${missingDiff > 0 ? '+' : ''}${missingDiff}`);
  console.log(`   ${coverageIcon} Couverture: ${coverageDiff > 0 ? '+' : ''}${coverageDiff}%`);
  
  // Calculer le temps écoulé
  const previousTime = new Date(previousAnalysis.timestamp);
  const currentTime = new Date(currentAnalysis.timestamp);
  const timeDiff = Math.round((currentTime - previousTime) / (1000 * 60)); // en minutes
  
  if (timeDiff > 0) {
    console.log(`   ⏱️  Temps écoulé: ${timeDiff} minutes`);
    
    if (keysDiff > 0) {
      const rate = Math.round(keysDiff / (timeDiff / 60)); // clés par heure
      console.log(`   ⚡ Vitesse de restauration: ~${rate} clés/heure`);
    }
  }
}

// Objectifs et recommandations
console.log('\n🎯 OBJECTIFS:');
console.log('   - Court terme: 50% de couverture');
console.log('   - Moyen terme: 80% de couverture');
console.log('   - Long terme: 95% de couverture');

const currentCoverage = currentAnalysis.coveragePercentage;
if (currentCoverage < 50) {
  console.log('\n🔴 STATUT: Phase critique - Focus sur les sections de base');
  console.log('   Priorité: auth, common, nav');
} else if (currentCoverage < 80) {
  console.log('\n🟡 STATUT: Phase de développement - Fonctionnalités principales');
  console.log('   Priorité: lofts, tasks, transactions');
} else if (currentCoverage < 95) {
  console.log('\n🟢 STATUT: Phase de finalisation - Fonctionnalités avancées');
  console.log('   Priorité: settings, reservations, analytics');
} else {
  console.log('\n✅ STATUT: Objectif atteint - Maintenance et polish');
}

// Estimation du temps restant
const remainingKeys = currentAnalysis.missingKeys;
if (previousAnalysis) {
  const keysDiff = currentAnalysis.totalArabicKeys - previousAnalysis.summary.totalArabicKeys;
  
  // Calculer le temps écoulé
  const previousTime = new Date(previousAnalysis.timestamp);
  const currentTime = new Date(currentAnalysis.timestamp);
  const timeDiff = Math.round((currentTime - previousTime) / (1000 * 60)); // en minutes
  
  if (keysDiff > 0 && timeDiff > 0) {
    const rate = keysDiff / (timeDiff / 60); // clés par heure
    const estimatedHours = Math.round(remainingKeys / rate);
    console.log(`\n⏳ ESTIMATION: ~${estimatedHours}h restantes au rythme actuel`);
  }
}

// Sauvegarder l'historique des progrès
let progressHistory = [];
try {
  if (fs.existsSync('arabic-progress-history.json')) {
    progressHistory = JSON.parse(fs.readFileSync('arabic-progress-history.json', 'utf8'));
  }
} catch (error) {
  console.log('ℹ️  Création du fichier d\'historique');
}

progressHistory.push(currentAnalysis);

// Garder seulement les 50 dernières entrées
if (progressHistory.length > 50) {
  progressHistory = progressHistory.slice(-50);
}

fs.writeFileSync('arabic-progress-history.json', JSON.stringify(progressHistory, null, 2));
console.log('\n💾 Progrès sauvegardé dans l\'historique');

console.log('\n🚀 Pour continuer la restauration:');
console.log('   1. node restore-arabic-translations.cjs');
console.log('   2. node arabic-progress-tracker.cjs (pour suivre les progrès)');
console.log('   3. Répéter jusqu\'à atteindre l\'objectif');