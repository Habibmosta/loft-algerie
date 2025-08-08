const fs = require('fs');

console.log('🔍 VALIDATION DE LA QUALITÉ DES TRADUCTIONS ARABES\n');

// Lire le fichier de traductions arabes
let arTranslations = {};
try {
  arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));
  console.log('✅ Fichier de traductions arabes chargé avec succès');
} catch (error) {
  console.error('❌ Erreur lors du chargement du fichier arabe:', error.message);
  process.exit(1);
}

// Fonction pour extraire toutes les clés et valeurs
function extractAllEntries(obj, prefix = '') {
  const entries = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      entries.push(...extractAllEntries(value, fullKey));
    } else {
      entries.push({ key: fullKey, value });
    }
  }
  return entries;
}

const allEntries = extractAllEntries(arTranslations);
console.log(`📊 ${allEntries.length} entrées de traduction à valider\n`);

// Tests de validation
const validationResults = {
  syntaxErrors: [],
  emptyValues: [],
  arabicTextIssues: [],
  fallbackMarkers: [],
  duplicateValues: [],
  formatIssues: [],
  qualityIssues: []
};

console.log('🔍 VALIDATION EN COURS...\n');

// 1. Validation de la syntaxe JSON (déjà fait par le parsing)
console.log('✅ 1. Syntaxe JSON: Valide');

// 2. Vérification des valeurs vides
console.log('🔍 2. Vérification des valeurs vides...');
allEntries.forEach(({ key, value }) => {
  if (!value || value.trim() === '') {
    validationResults.emptyValues.push(key);
  }
});

if (validationResults.emptyValues.length === 0) {
  console.log('✅ Aucune valeur vide trouvée');
} else {
  console.log(`⚠️  ${validationResults.emptyValues.length} valeurs vides trouvées`);
}

// 3. Vérification du contenu arabe
console.log('🔍 3. Vérification du contenu arabe...');
const arabicRegex = /[\u0600-\u06FF]/;

allEntries.forEach(({ key, value }) => {
  if (value && !arabicRegex.test(value) && !value.startsWith('[AR]')) {
    // Exceptions pour les valeurs qui peuvent être en caractères latins
    const exceptions = ['email', 'url', 'http', 'www', 'admin', 'manager', 'member'];
    const isException = exceptions.some(exc => key.toLowerCase().includes(exc) || value.toLowerCase().includes(exc));
    
    if (!isException) {
      validationResults.arabicTextIssues.push({ key, value });
    }
  }
});

if (validationResults.arabicTextIssues.length === 0) {
  console.log('✅ Toutes les traductions contiennent du texte arabe approprié');
} else {
  console.log(`⚠️  ${validationResults.arabicTextIssues.length} traductions sans texte arabe`);
}

// 4. Détection des marqueurs de fallback
console.log('🔍 4. Détection des marqueurs de fallback...');
allEntries.forEach(({ key, value }) => {
  if (value && value.startsWith('[AR]')) {
    validationResults.fallbackMarkers.push({ key, value });
  }
});

console.log(`📊 ${validationResults.fallbackMarkers.length} traductions avec marqueurs de fallback`);

// 5. Détection des doublons
console.log('🔍 5. Détection des valeurs dupliquées...');
const valueMap = new Map();
allEntries.forEach(({ key, value }) => {
  if (value && value.trim() !== '') {
    if (valueMap.has(value)) {
      valueMap.get(value).push(key);
    } else {
      valueMap.set(value, [key]);
    }
  }
});

valueMap.forEach((keys, value) => {
  if (keys.length > 1) {
    // Ignorer les doublons légitimes (comme "حفظ", "تعديل", etc.)
    const commonValues = ['حفظ', 'تعديل', 'حذف', 'إنشاء', 'تحديث', 'إلغاء', 'نعم', 'لا'];
    if (!commonValues.includes(value)) {
      validationResults.duplicateValues.push({ value, keys });
    }
  }
});

if (validationResults.duplicateValues.length === 0) {
  console.log('✅ Aucun doublon problématique trouvé');
} else {
  console.log(`⚠️  ${validationResults.duplicateValues.length} valeurs dupliquées détectées`);
}

// 6. Validation du format des traductions
console.log('🔍 6. Validation du format...');
allEntries.forEach(({ key, value }) => {
  if (value) {
    // Vérifier les caractères de contrôle indésirables
    if (/[\x00-\x1F\x7F]/.test(value)) {
      validationResults.formatIssues.push({ key, value, issue: 'Caractères de contrôle' });
    }
    
    // Vérifier les espaces excessifs
    if (/\s{3,}/.test(value)) {
      validationResults.formatIssues.push({ key, value, issue: 'Espaces excessifs' });
    }
    
    // Vérifier les points de suspension incorrects
    if (value.includes('...') && !value.includes('…')) {
      // Acceptable pour "جاري التحميل..."
      if (!value.includes('جاري التحميل')) {
        validationResults.formatIssues.push({ key, value, issue: 'Points de suspension' });
      }
    }
  }
});

if (validationResults.formatIssues.length === 0) {
  console.log('✅ Format des traductions correct');
} else {
  console.log(`⚠️  ${validationResults.formatIssues.length} problèmes de format détectés`);
}

// 7. Validation de la qualité linguistique
console.log('🔍 7. Validation de la qualité linguistique...');

// Patterns de qualité à vérifier
const qualityChecks = [
  {
    name: 'Cohérence des terminaisons',
    pattern: /ة$/,
    description: 'Vérifier l\'usage approprié du ta marbuta'
  },
  {
    name: 'Direction du texte',
    pattern: /[\u0600-\u06FF]/,
    description: 'Présence de caractères arabes'
  }
];

// Vérifications spécifiques par contexte
const contextChecks = {
  'auth': ['تسجيل', 'دخول', 'خروج', 'مرور'],
  'dashboard': ['لوحة', 'تحكم', 'إدارة'],
  'common': ['حفظ', 'إلغاء', 'تعديل', 'حذف'],
  'lofts': ['لوفت', 'عقار', 'إدارة'],
  'tasks': ['مهام', 'مهمة', 'إنجاز']
};

let qualityScore = 0;
let totalChecks = 0;

Object.entries(contextChecks).forEach(([section, expectedTerms]) => {
  const sectionEntries = allEntries.filter(({ key }) => key.startsWith(section + '.'));
  
  expectedTerms.forEach(term => {
    totalChecks++;
    const hasTermInSection = sectionEntries.some(({ value }) => value && value.includes(term));
    if (hasTermInSection) {
      qualityScore++;
    } else {
      validationResults.qualityIssues.push({
        section,
        term,
        issue: `Terme attendu "${term}" non trouvé dans la section ${section}`
      });
    }
  });
});

const qualityPercentage = totalChecks > 0 ? Math.round((qualityScore / totalChecks) * 100) : 100;
console.log(`📊 Score de qualité linguistique: ${qualityPercentage}% (${qualityScore}/${totalChecks})`);

// Résumé des résultats
console.log('\n📋 RÉSUMÉ DE LA VALIDATION:\n');

const totalIssues = validationResults.emptyValues.length + 
                   validationResults.arabicTextIssues.length + 
                   validationResults.duplicateValues.length + 
                   validationResults.formatIssues.length + 
                   validationResults.qualityIssues.length;

if (totalIssues === 0) {
  console.log('🎉 VALIDATION RÉUSSIE - Aucun problème critique détecté !');
} else {
  console.log(`⚠️  ${totalIssues} problèmes détectés au total`);
}

// Détail des problèmes
if (validationResults.emptyValues.length > 0) {
  console.log(`\n❌ VALEURS VIDES (${validationResults.emptyValues.length}):`);
  validationResults.emptyValues.slice(0, 5).forEach(key => {
    console.log(`   - ${key}`);
  });
  if (validationResults.emptyValues.length > 5) {
    console.log(`   ... et ${validationResults.emptyValues.length - 5} autres`);
  }
}

if (validationResults.fallbackMarkers.length > 0) {
  console.log(`\n🔄 MARQUEURS DE FALLBACK (${validationResults.fallbackMarkers.length}) - À réviser:`);
  validationResults.fallbackMarkers.slice(0, 5).forEach(({ key, value }) => {
    console.log(`   - ${key}: "${value}"`);
  });
  if (validationResults.fallbackMarkers.length > 5) {
    console.log(`   ... et ${validationResults.fallbackMarkers.length - 5} autres`);
  }
}

if (validationResults.arabicTextIssues.length > 0) {
  console.log(`\n🔤 PROBLÈMES DE TEXTE ARABE (${validationResults.arabicTextIssues.length}):`);
  validationResults.arabicTextIssues.slice(0, 3).forEach(({ key, value }) => {
    console.log(`   - ${key}: "${value}"`);
  });
}

// Statistiques finales
console.log('\n📊 STATISTIQUES FINALES:');
console.log(`   - Total des traductions: ${allEntries.length}`);
console.log(`   - Traductions avec texte arabe: ${allEntries.filter(({ value }) => arabicRegex.test(value)).length}`);
console.log(`   - Marqueurs de fallback: ${validationResults.fallbackMarkers.length}`);
console.log(`   - Score de qualité: ${qualityPercentage}%`);

const overallScore = Math.round(((allEntries.length - totalIssues) / allEntries.length) * 100);
console.log(`   - Score global: ${overallScore}%`);

// Sauvegarder les résultats
const validationReport = {
  timestamp: new Date().toISOString(),
  totalTranslations: allEntries.length,
  validationResults,
  qualityScore: qualityPercentage,
  overallScore,
  recommendations: []
};

// Générer des recommandations
if (validationResults.fallbackMarkers.length > 0) {
  validationReport.recommendations.push('Réviser manuellement les traductions avec marqueurs [AR]');
}

if (validationResults.emptyValues.length > 0) {
  validationReport.recommendations.push('Compléter les valeurs vides');
}

if (qualityPercentage < 80) {
  validationReport.recommendations.push('Améliorer la cohérence terminologique');
}

fs.writeFileSync('arabic-validation-report.json', JSON.stringify(validationReport, null, 2));

console.log('\n💾 Rapport de validation sauvegardé: arabic-validation-report.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
if (validationResults.fallbackMarkers.length > 0) {
  console.log('1. Réviser les traductions avec marqueurs [AR]');
}
console.log('2. Tester l\'interface utilisateur en arabe');
console.log('3. Configurer le support RTL');
console.log('4. Effectuer des tests d\'intégration');