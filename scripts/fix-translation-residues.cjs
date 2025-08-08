const fs = require('fs');

console.log('🔧 CORRECTION DES RÉSIDUS DE TRADUCTION\n');

// Analyser les résidus identifiés par l'utilisateur
const identifiedResidues = [
  'lofts.filterByStatus',
  'lofts.filterByOwner', 
  'lofts.filterByZoneArea',
  'lofts.status.available',
  'lofts.status.occupied',
  'lofts.status.maintenance',
  'lofts.dailyRent',
  'lofts.owner',
  'lofts.zoneArea',
  'lofts.companyShare'
];

console.log('🔍 Résidus identifiés par l\'utilisateur:');
identifiedResidues.forEach(key => {
  console.log(`   - ${key}`);
});

// Lire les fichiers de traduction actuels
const frTranslations = JSON.parse(fs.readFileSync('../locales/fr/translation.json', 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync('../locales/en/translation.json', 'utf8'));
const arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));

// Fonction pour obtenir une valeur imbriquée
function getNestedValue(obj, key) {
  const keys = key.split('.');
  let current = obj;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return null;
    }
  }
  return current;
}

// Fonction pour définir une valeur imbriquée
function setNestedValue(obj, key, value) {
  const keys = key.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!current[k] || typeof current[k] !== 'object') {
      current[k] = {};
    }
    current = current[k];
  }
  
  current[keys[keys.length - 1]] = value;
}

// Traductions de correction pour les résidus
const residueFixes = {
  fr: {
    'lofts.filterByStatus': 'Filtrer par statut',
    'lofts.filterByOwner': 'Filtrer par propriétaire',
    'lofts.filterByZoneArea': 'Filtrer par zone',
    'lofts.status.available': 'Disponible',
    'lofts.status.occupied': 'Occupé',
    'lofts.status.maintenance': 'Maintenance',
    'lofts.dailyRent': 'Loyer journalier',
    'lofts.owner': 'Propriétaire',
    'lofts.zoneArea': 'Zone',
    'lofts.companyShare': 'Part de la société'
  },
  en: {
    'lofts.filterByStatus': 'Filter by status',
    'lofts.filterByOwner': 'Filter by owner',
    'lofts.filterByZoneArea': 'Filter by zone',
    'lofts.status.available': 'Available',
    'lofts.status.occupied': 'Occupied',
    'lofts.status.maintenance': 'Maintenance',
    'lofts.dailyRent': 'Daily rent',
    'lofts.owner': 'Owner',
    'lofts.zoneArea': 'Zone',
    'lofts.companyShare': 'Company share'
  },
  ar: {
    'lofts.filterByStatus': 'تصفية حسب الحالة',
    'lofts.filterByOwner': 'تصفية حسب المالك',
    'lofts.filterByZoneArea': 'تصفية حسب المنطقة',
    'lofts.status.available': 'متاح',
    'lofts.status.occupied': 'مشغول',
    'lofts.status.maintenance': 'صيانة',
    'lofts.dailyRent': 'الإيجار اليومي',
    'lofts.owner': 'المالك',
    'lofts.zoneArea': 'المنطقة',
    'lofts.companyShare': 'حصة الشركة'
  }
};

console.log('\n🔄 Vérification et correction des résidus...\n');

let fixedCount = { fr: 0, en: 0, ar: 0 };
const fixes = { fr: [], en: [], ar: [] };

// Vérifier et corriger chaque résidu
identifiedResidues.forEach(key => {
  console.log(`🔍 Vérification de: ${key}`);
  
  // Vérifier français
  const frValue = getNestedValue(frTranslations, key);
  if (!frValue || frValue === '' || frValue.startsWith('[AR]')) {
    const newValue = residueFixes.fr[key];
    if (newValue) {
      setNestedValue(frTranslations, key, newValue);
      fixes.fr.push({ key, oldValue: frValue || 'MANQUANT', newValue });
      fixedCount.fr++;
      console.log(`   🇫🇷 FR: "${frValue || 'MANQUANT'}" → "${newValue}"`);
    }
  } else {
    console.log(`   🇫🇷 FR: OK - "${frValue}"`);
  }
  
  // Vérifier anglais
  const enValue = getNestedValue(enTranslations, key);
  if (!enValue || enValue === '' || enValue.startsWith('[AR]')) {
    const newValue = residueFixes.en[key];
    if (newValue) {
      setNestedValue(enTranslations, key, newValue);
      fixes.en.push({ key, oldValue: enValue || 'MANQUANT', newValue });
      fixedCount.en++;
      console.log(`   🇬🇧 EN: "${enValue || 'MANQUANT'}" → "${newValue}"`);
    }
  } else {
    console.log(`   🇬🇧 EN: OK - "${enValue}"`);
  }
  
  // Vérifier arabe
  const arValue = getNestedValue(arTranslations, key);
  if (!arValue || arValue === '' || arValue.startsWith('[AR]')) {
    const newValue = residueFixes.ar[key];
    if (newValue) {
      setNestedValue(arTranslations, key, newValue);
      fixes.ar.push({ key, oldValue: arValue || 'MANQUANT', newValue });
      fixedCount.ar++;
      console.log(`   🇸🇦 AR: "${arValue || 'MANQUANT'}" → "${newValue}"`);
    }
  } else {
    console.log(`   🇸🇦 AR: OK - "${arValue}"`);
  }
  
  console.log('');
});

// Rechercher d'autres résidus potentiels dans les fichiers
console.log('🔍 Recherche d\'autres résidus potentiels...\n');

function findPotentialResidues(translations, language) {
  const residues = [];
  
  function searchResidues(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        searchResidues(value, fullKey);
      } else if (typeof value === 'string') {
        // Détecter les patterns de résidus
        if (value.startsWith('[AR]') || 
            value === '' || 
            value.includes('.') && value.split('.').length > 1 && !value.includes(' ')) {
          residues.push({ key: fullKey, value });
        }
      }
    }
  }
  
  searchResidues(translations);
  return residues;
}

const frResidues = findPotentialResidues(frTranslations, 'fr');
const enResidues = findPotentialResidues(enTranslations, 'en');
const arResidues = findPotentialResidues(arTranslations, 'ar');

console.log(`🇫🇷 Résidus potentiels français: ${frResidues.length}`);
if (frResidues.length > 0) {
  frResidues.slice(0, 5).forEach(r => {
    console.log(`   - ${r.key}: "${r.value}"`);
  });
  if (frResidues.length > 5) {
    console.log(`   ... et ${frResidues.length - 5} autres`);
  }
}

console.log(`🇬🇧 Résidus potentiels anglais: ${enResidues.length}`);
if (enResidues.length > 0) {
  enResidues.slice(0, 5).forEach(r => {
    console.log(`   - ${r.key}: "${r.value}"`);
  });
  if (enResidues.length > 5) {
    console.log(`   ... et ${enResidues.length - 5} autres`);
  }
}

console.log(`🇸🇦 Résidus potentiels arabes: ${arResidues.length}`);
if (arResidues.length > 0) {
  arResidues.slice(0, 5).forEach(r => {
    console.log(`   - ${r.key}: "${r.value}"`);
  });
  if (arResidues.length > 5) {
    console.log(`   ... et ${arResidues.length - 5} autres`);
  }
}

// Créer des sauvegardes avant modification
const timestamp = Date.now();
console.log('\n💾 Création des sauvegardes...');

if (fixedCount.fr > 0) {
  fs.writeFileSync(`../locales/fr/translation.backup.${timestamp}.json`, JSON.stringify(frTranslations, null, 2));
}
if (fixedCount.en > 0) {
  fs.writeFileSync(`../locales/en/translation.backup.${timestamp}.json`, JSON.stringify(enTranslations, null, 2));
}
if (fixedCount.ar > 0) {
  fs.writeFileSync(`../locales/ar/translation.backup.${timestamp}.json`, JSON.stringify(arTranslations, null, 2));
}

// Sauvegarder les fichiers corrigés
console.log('💾 Sauvegarde des fichiers corrigés...');
fs.writeFileSync('../locales/fr/translation.json', JSON.stringify(frTranslations, null, 2));
fs.writeFileSync('../locales/en/translation.json', JSON.stringify(enTranslations, null, 2));
fs.writeFileSync('../locales/ar/translation.json', JSON.stringify(arTranslations, null, 2));

// Résumé des corrections
console.log('\n✅ CORRECTION DES RÉSIDUS TERMINÉE !');
console.log(`🇫🇷 Français: ${fixedCount.fr} résidus corrigés`);
console.log(`🇬🇧 Anglais: ${fixedCount.en} résidus corrigés`);
console.log(`🇸🇦 Arabe: ${fixedCount.ar} résidus corrigés`);
console.log(`💾 Sauvegardes créées avec timestamp: ${timestamp}`);

// Sauvegarder le rapport de correction
const correctionReport = {
  timestamp: new Date().toISOString(),
  backupTimestamp: timestamp,
  identifiedResidues,
  fixedCount,
  fixes,
  potentialResidues: {
    fr: frResidues.length,
    en: enResidues.length,
    ar: arResidues.length
  },
  totalFixed: fixedCount.fr + fixedCount.en + fixedCount.ar
};

fs.writeFileSync('translation-residues-fix-report.json', JSON.stringify(correctionReport, null, 2));

console.log('\n📊 Rapport de correction sauvegardé: translation-residues-fix-report.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Tester l\'interface pour vérifier que les résidus ont disparu');
console.log('2. Vérifier les autres résidus potentiels détectés');
console.log('3. Redémarrer l\'application pour voir les changements');
console.log('4. Créer un commit pour sauvegarder les corrections');