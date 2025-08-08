const fs = require('fs');

console.log('🔧 AMÉLIORATION DES TRADUCTIONS AVEC MARQUEURS DE FALLBACK\n');

// Dictionnaire étendu pour améliorer les traductions de fallback
const improvedTranslations = {
  // Lofts - Gestion immobilière
  'loftUpdated': 'تم تحديث اللوفت',
  'updatePropertyDetails': 'تحديث تفاصيل العقار',
  'filterByStatus': 'تصفية حسب الحالة',
  'allStatuses': 'جميع الحالات',
  'filterByOwner': 'تصفية حسب المالك',
  'allOwners': 'جميع المالكين',
  'filterByZoneArea': 'تصفية حسب المنطقة',
  'allZoneAreas': 'جميع المناطق',
  'dailyRent': 'الإيجار اليومي',
  'owner': 'المالك',
  'unknown': 'غير معروف',
  'zoneArea': 'المنطقة',
  'companyShare': 'حصة الشركة',
  'deleteConfirm': 'تأكيد الحذف',
  'noLoftsMatch': 'لا توجد لوفت مطابقة',
  'createNewLoft': 'إنشاء لوفت جديد',
  'addNewPropertyListing': 'إضافة عقار جديد',
  
  // Tasks - إدارة المهام
  'updateSuccess': 'تم التحديث بنجاح',
  'updateError': 'خطأ في التحديث',
  'dueDateFormat': 'تنسيق تاريخ الاستحقاق',
  'noDueDate': 'لا يوجد تاريخ استحقاق',
  'updateStatus': 'تحديث الحالة',
  'createSuccess': 'تم الإنشاء بنجاح',
  'createError': 'خطأ في الإنشاء',
  'assignedTo': 'مُعيَّن إلى',
  'viewTask': 'عرض المهمة',
  'yourTasks': 'مهامك',
  
  // Common - عام
  'error': 'خطأ',
  'success': 'نجح',
  'actions': 'الإجراءات',
  'back': 'رجوع',
  'saving': 'جاري الحفظ',
  'code': 'الرمز',
  'symbol': 'الرمز',
  'ratio': 'النسبة',
  'confirmDelete': 'تأكيد الحذف',
  'refresh': 'تحديث',
  'selectOption': 'اختر خياراً',
  'none': 'لا شيء',
  'next': 'التالي',
  'previous': 'السابق',
  'today': 'اليوم',
  'pickDate': 'اختر تاريخاً',
  'pickDateRange': 'اختر نطاق التاريخ'
};

// Lire le fichier de traductions arabes
const arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));

// Fonction pour définir une valeur par clé dans un objet imbriqué
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

// Fonction pour extraire toutes les entrées
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
const fallbackEntries = allEntries.filter(({ value }) => value && value.startsWith('[AR]'));

console.log(`📊 ${fallbackEntries.length} traductions avec marqueurs de fallback trouvées`);
console.log('🔄 Amélioration en cours...\n');

let improvedCount = 0;
const improvements = [];

fallbackEntries.forEach(({ key, value }) => {
  const keyParts = key.split('.');
  const lastPart = keyParts[keyParts.length - 1];
  
  // Rechercher une amélioration dans le dictionnaire
  if (improvedTranslations[lastPart]) {
    const newValue = improvedTranslations[lastPart];
    setNestedValue(arTranslations, key, newValue);
    improvements.push({ key, oldValue: value, newValue });
    improvedCount++;
  }
});

console.log(`✅ ${improvedCount} traductions améliorées`);

// Créer une sauvegarde
const backupPath = `../locales/ar/translation.backup.${Date.now()}.json`;
if (fs.existsSync('../locales/ar/translation.json')) {
  const originalContent = fs.readFileSync('../locales/ar/translation.json', 'utf8');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Sauvegarde créée: ${backupPath}`);
}

// Sauvegarder le fichier amélioré
fs.writeFileSync('../locales/ar/translation.json', JSON.stringify(arTranslations, null, 2));

console.log('\n📊 RÉSUMÉ:');
console.log(`   - Marqueurs de fallback traités: ${fallbackEntries.length}`);
console.log(`   - Traductions améliorées: ${improvedCount}`);
console.log(`   - Marqueurs restants: ${fallbackEntries.length - improvedCount}`);

console.log('\n✅ AMÉLIORATION TERMINÉE');
console.log(`📁 Fichier mis à jour: locales/ar/translation.json`);

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Exécuter une nouvelle validation');
console.log('2. Réviser manuellement les marqueurs restants');
console.log('3. Tester l\'interface utilisateur');