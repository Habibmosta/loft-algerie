const fs = require('fs');

console.log('🔍 DÉTECTION DES CLÉS ARABES MANQUANTES BASÉE SUR L\'USAGE RÉEL\n');

// Lire les clés réellement utilisées dans l'application
let usedKeys = [];
try {
  const realKeysData = JSON.parse(fs.readFileSync('real-translation-keys.json', 'utf8'));
  usedKeys = realKeysData.allKeys || [];
  console.log(`📋 Clés réellement utilisées dans l'app: ${usedKeys.length}`);
} catch (error) {
  console.warn('⚠️  Fichier real-translation-keys.json non trouvé, utilisation de l\'analyse complète');
  // Fallback vers l'analyse complète
  try {
    const analysisData = JSON.parse(fs.readFileSync('arabic-translations-analysis.json', 'utf8'));
    usedKeys = [...analysisData.missingKeys, ...Object.keys(analysisData.sectionStats)];
  } catch (fallbackError) {
    console.error('❌ Impossible de charger les données d\'analyse');
    process.exit(1);
  }
}

// Lire les traductions arabes existantes
let arTranslations = {};
try {
  arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));
} catch (error) {
  console.error('❌ Impossible de lire le fichier de traductions arabes');
  process.exit(1);
}

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

const existingArKeys = new Set(extractAllKeys(arTranslations));

// Trouver les clés utilisées mais manquantes en arabe
const missingInArabic = usedKeys.filter(key => !existingArKeys.has(key));

// Organiser par section et priorité
const missingBySection = {};
const sectionPriority = {
  // Sections critiques pour l'expérience utilisateur de base
  'auth': 'CRITIQUE',
  'common': 'CRITIQUE', 
  'nav': 'CRITIQUE',
  'dashboard': 'CRITIQUE',
  
  // Sections importantes pour les fonctionnalités métier
  'lofts': 'HAUTE',
  'tasks': 'HAUTE',
  'bills': 'HAUTE',
  
  // Sections avancées
  'reservations': 'MOYENNE',
  'transactions': 'MOYENNE',
  'settings': 'MOYENNE',
  
  // Sections spécialisées
  'executive': 'BASSE',
  'analytics': 'BASSE',
  'reports': 'BASSE'
};

missingInArabic.forEach(key => {
  const section = key.split('.')[0];
  if (!missingBySection[section]) {
    missingBySection[section] = [];
  }
  missingBySection[section].push(key);
});

// Calculer les statistiques
console.log('📊 STATISTIQUES BASÉES SUR L\'USAGE RÉEL:');
console.log(`   - Clés utilisées dans l'app: ${usedKeys.length}`);
console.log(`   - Clés arabes existantes: ${existingArKeys.size}`);
console.log(`   - Clés manquantes en arabe: ${missingInArabic.length}`);
console.log(`   - Taux de couverture: ${Math.round(((usedKeys.length - missingInArabic.length) / usedKeys.length) * 100)}%\n`);

// Afficher par priorité
console.log('🎯 CLÉS MANQUANTES PAR PRIORITÉ:\n');

const priorityOrder = ['CRITIQUE', 'HAUTE', 'MOYENNE', 'BASSE'];
const sectionsByPriority = {};

Object.keys(missingBySection).forEach(section => {
  const priority = sectionPriority[section] || 'MOYENNE';
  if (!sectionsByPriority[priority]) {
    sectionsByPriority[priority] = [];
  }
  sectionsByPriority[priority].push(section);
});

priorityOrder.forEach(priority => {
  if (sectionsByPriority[priority]) {
    const icon = priority === 'CRITIQUE' ? '🔴' : priority === 'HAUTE' ? '🟡' : priority === 'MOYENNE' ? '🟠' : '🟢';
    console.log(`${icon} PRIORITÉ ${priority}:`);
    
    sectionsByPriority[priority].forEach(section => {
      const missing = missingBySection[section];
      console.log(`   📁 ${section.toUpperCase()}: ${missing.length} clés manquantes`);
      
      // Afficher les 5 premières clés pour donner un aperçu
      missing.slice(0, 5).forEach(key => {
        console.log(`      - ${key}`);
      });
      if (missing.length > 5) {
        console.log(`      ... et ${missing.length - 5} autres`);
      }
      console.log('');
    });
  }
});

// Générer des recommandations d'action
const criticalSections = sectionsByPriority['CRITIQUE'] || [];
const highSections = sectionsByPriority['HAUTE'] || [];

console.log('💡 RECOMMANDATIONS D\'ACTION:\n');

if (criticalSections.length > 0) {
  console.log('🔴 ACTION IMMÉDIATE REQUISE:');
  criticalSections.forEach(section => {
    const count = missingBySection[section].length;
    console.log(`   - Restaurer ${section}: ${count} clés (bloque l'expérience utilisateur de base)`);
  });
  console.log('');
}

if (highSections.length > 0) {
  console.log('🟡 ACTION PRIORITAIRE:');
  highSections.forEach(section => {
    const count = missingBySection[section].length;
    console.log(`   - Compléter ${section}: ${count} clés (fonctionnalités métier importantes)`);
  });
  console.log('');
}

// Sauvegarder l'analyse focalisée
const focusedAnalysis = {
  timestamp: new Date().toISOString(),
  basedOnRealUsage: true,
  summary: {
    totalUsedKeys: usedKeys.length,
    existingArabicKeys: existingArKeys.size,
    missingKeys: missingInArabic.length,
    coveragePercentage: Math.round(((usedKeys.length - missingInArabic.length) / usedKeys.length) * 100)
  },
  missingBySection,
  missingKeys: missingInArabic,
  priorityMapping: sectionPriority,
  sectionsByPriority,
  actionPlan: {
    immediate: criticalSections.map(s => ({
      section: s,
      count: missingBySection[s].length,
      keys: missingBySection[s]
    })),
    priority: highSections.map(s => ({
      section: s,
      count: missingBySection[s].length,
      keys: missingBySection[s]
    }))
  }
};

fs.writeFileSync('missing-arabic-keys-focused.json', JSON.stringify(focusedAnalysis, null, 2));
console.log('💾 Analyse focalisée sauvegardée dans: missing-arabic-keys-focused.json');

console.log('\n🚀 PROCHAINES ÉTAPES RECOMMANDÉES:');
console.log('1. Rechercher dans l\'historique Git les anciennes traductions');
console.log('2. Créer un script de restauration automatique');
console.log('3. Commencer par les sections CRITIQUES');
console.log('4. Valider chaque section avant de passer à la suivante');