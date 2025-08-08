const fs = require('fs');

console.log('🚀 SYSTÈME DE RESTAURATION AUTOMATIQUE DES TRADUCTIONS ARABES\n');

// Dictionnaire de traductions automatiques français → arabe
const autoTranslationDict = {
  // Mots courants
  'Tableau de Bord': 'لوحة التحكم',
  'Dashboard': 'لوحة التحكم',
  'Bienvenue': 'مرحباً بك',
  'Welcome': 'مرحباً بك',
  'Connexion': 'تسجيل الدخول',
  'Login': 'تسجيل الدخول',
  'Inscription': 'التسجيل',
  'Register': 'التسجيل',
  'Mot de passe': 'كلمة المرور',
  'Password': 'كلمة المرور',
  'Email': 'البريد الإلكتروني',
  'Nom': 'الاسم',
  'Name': 'الاسم',
  'Adresse': 'العنوان',
  'Address': 'العنوان',
  'Téléphone': 'الهاتف',
  'Phone': 'الهاتف',
  
  // Actions
  'Créer': 'إنشاء',
  'Create': 'إنشاء',
  'Modifier': 'تعديل',
  'Edit': 'تعديل',
  'Supprimer': 'حذف',
  'Delete': 'حذف',
  'Enregistrer': 'حفظ',
  'Save': 'حفظ',
  'Annuler': 'إلغاء',
  'Cancel': 'إلغاء',
  'Mettre à jour': 'تحديث',
  'Update': 'تحديث',
  'Ajouter': 'إضافة',
  'Add': 'إضافة',
  'Rechercher': 'بحث',
  'Search': 'بحث',
  'Filtrer': 'تصفية',
  'Filter': 'تصفية',
  
  // États
  'Actif': 'نشط',
  'Active': 'نشط',
  'Inactif': 'غير نشط',
  'Inactive': 'غير نشط',
  'En cours': 'قيد التنفيذ',
  'In Progress': 'قيد التنفيذ',
  'Terminé': 'مكتمل',
  'Completed': 'مكتمل',
  'En attente': 'في الانتظار',
  'Pending': 'في الانتظار',
  'Annulé': 'ملغى',
  'Cancelled': 'ملغى',
  
  // Navigation
  'Accueil': 'الرئيسية',
  'Home': 'الرئيسية',
  'Paramètres': 'الإعدادات',
  'Settings': 'الإعدادات',
  'Profil': 'الملف الشخصي',
  'Profile': 'الملف الشخصي',
  'Aide': 'المساعدة',
  'Help': 'المساعدة',
  'À propos': 'حول',
  'About': 'حول',
  'Déconnexion': 'تسجيل الخروج',
  'Logout': 'تسجيل الخروج',
  
  // Métier immobilier
  'Loft': 'لوفت',
  'Lofts': 'اللوفت',
  'Propriété': 'عقار',
  'Property': 'عقار',
  'Propriétés': 'العقارات',
  'Properties': 'العقارات',
  'Réservation': 'حجز',
  'Reservation': 'حجز',
  'Réservations': 'الحجوزات',
  'Reservations': 'الحجوزات',
  'Tâche': 'مهمة',
  'Task': 'مهمة',
  'Tâches': 'المهام',
  'Tasks': 'المهام',
  'Facture': 'فاتورة',
  'Bill': 'فاتورة',
  'Factures': 'الفواتير',
  'Bills': 'الفواتير',
  'Transaction': 'معاملة',
  'Transactions': 'المعاملات',
  'Rapport': 'تقرير',
  'Report': 'تقرير',
  'Rapports': 'التقارير',
  'Reports': 'التقارير',
  
  // Temps et dates
  'Aujourd\'hui': 'اليوم',
  'Today': 'اليوم',
  'Hier': 'أمس',
  'Yesterday': 'أمس',
  'Demain': 'غداً',
  'Tomorrow': 'غداً',
  'Semaine': 'أسبوع',
  'Week': 'أسبوع',
  'Mois': 'شهر',
  'Month': 'شهر',
  'Année': 'سنة',
  'Year': 'سنة',
  'Date': 'التاريخ',
  'Heure': 'الوقت',
  'Time': 'الوقت',
  
  // Messages système
  'Chargement': 'جاري التحميل',
  'Loading': 'جاري التحميل',
  'Erreur': 'خطأ',
  'Error': 'خطأ',
  'Succès': 'نجح',
  'Success': 'نجح',
  'Attention': 'تنبيه',
  'Warning': 'تنبيه',
  'Information': 'معلومات',
  'Info': 'معلومات',
  'Confirmation': 'تأكيد',
  'Confirm': 'تأكيد'
};

// Fonction pour générer une traduction automatique
function generateArabicTranslation(frenchText, englishText, key) {
  // Priorité 1: Recherche directe dans le dictionnaire
  if (autoTranslationDict[frenchText]) {
    return autoTranslationDict[frenchText];
  }
  
  if (autoTranslationDict[englishText]) {
    return autoTranslationDict[englishText];
  }
  
  // Priorité 2: Recherche par mots-clés
  for (const [frWord, arTranslation] of Object.entries(autoTranslationDict)) {
    if (frenchText && frenchText.toLowerCase().includes(frWord.toLowerCase())) {
      return arTranslation;
    }
    if (englishText && englishText.toLowerCase().includes(frWord.toLowerCase())) {
      return arTranslation;
    }
  }
  
  // Priorité 3: Traductions basées sur le contexte de la clé
  const keyParts = key.split('.');
  const section = keyParts[0];
  const subkey = keyParts[keyParts.length - 1];
  
  // Traductions contextuelles par section
  const contextualTranslations = {
    auth: {
      signIn: 'تسجيل الدخول',
      signUp: 'التسجيل',
      signOut: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      fullName: 'الاسم الكامل',
      welcomeBack: 'مرحباً بعودتك',
      admin: 'مدير',
      manager: 'مدير',
      member: 'عضو'
    },
    common: {
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      create: 'إنشاء',
      update: 'تحديث',
      add: 'إضافة',
      view: 'عرض',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      yes: 'نعم',
      no: 'لا',
      actions: 'الإجراءات',
      name: 'الاسم',
      date: 'التاريخ',
      time: 'الوقت'
    },
    nav: {
      dashboard: 'لوحة التحكم',
      lofts: 'اللوفت',
      tasks: 'المهام',
      reservations: 'الحجوزات',
      transactions: 'المعاملات',
      reports: 'التقارير',
      settings: 'الإعدادات',
      conversations: 'المحادثات',
      notifications: 'الإشعارات'
    },
    landing: {
      title: 'إدارة العقارات',
      subtitle: 'نظام شامل لإدارة العقارات',
      getStarted: 'ابدأ الآن',
      signIn: 'تسجيل الدخول',
      features: 'الميزات'
    },
    theme: {
      light: 'فاتح',
      dark: 'داكن',
      system: 'النظام'
    }
  };
  
  if (contextualTranslations[section] && contextualTranslations[section][subkey]) {
    return contextualTranslations[section][subkey];
  }
  
  // Priorité 4: Traductions génériques basées sur les patterns courants
  const genericPatterns = {
    title: 'العنوان',
    subtitle: 'العنوان الفرعي',
    description: 'الوصف',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    status: 'الحالة',
    type: 'النوع',
    category: 'الفئة',
    amount: 'المبلغ',
    total: 'المجموع',
    date: 'التاريخ',
    time: 'الوقت',
    created: 'تم الإنشاء',
    updated: 'تم التحديث',
    deleted: 'تم الحذف'
  };
  
  if (genericPatterns[subkey]) {
    return genericPatterns[subkey];
  }
  
  // Priorité 5: Fallback - utiliser le texte français avec marqueur
  return frenchText ? `[AR] ${frenchText}` : `[AR] ${englishText || key}`;
}

// Lire les fichiers de traduction
console.log('📖 Lecture des fichiers de traduction...');

const frTranslations = JSON.parse(fs.readFileSync('../locales/fr/translation.json', 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync('../locales/en/translation.json', 'utf8'));
const arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));

// Fonction pour extraire toutes les clés d'un objet
function extractAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...extractAllKeys(value, fullKey));
    } else {
      keys.push({ key: fullKey, value });
    }
  }
  return keys;
}

// Fonction pour obtenir une valeur par clé dans un objet imbriqué
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

// Extraire toutes les clés de référence
const frKeys = extractAllKeys(frTranslations);
const enKeys = extractAllKeys(enTranslations);

// Créer un map des clés de référence
const referenceKeys = new Map();

frKeys.forEach(({ key, value }) => {
  referenceKeys.set(key, { fr: value, en: null });
});

enKeys.forEach(({ key, value }) => {
  if (referenceKeys.has(key)) {
    referenceKeys.get(key).en = value;
  } else {
    referenceKeys.set(key, { fr: null, en: value });
  }
});

console.log(`📊 ${referenceKeys.size} clés de référence trouvées`);

// Identifier les clés manquantes en arabe
const missingKeys = [];
const existingArKeys = new Set(extractAllKeys(arTranslations).map(item => item.key));

for (const [key] of referenceKeys) {
  if (!existingArKeys.has(key)) {
    missingKeys.push(key);
  }
}

console.log(`❌ ${missingKeys.length} clés manquantes en arabe`);

// Générer les traductions manquantes par priorité
const priorityOrder = ['auth', 'common', 'nav', 'landing', 'theme', 'lofts', 'tasks', 'dashboard'];
const missingByPriority = {};

missingKeys.forEach(key => {
  const section = key.split('.')[0];
  const priority = priorityOrder.indexOf(section) !== -1 ? priorityOrder.indexOf(section) : 999;
  
  if (!missingByPriority[priority]) {
    missingByPriority[priority] = [];
  }
  missingByPriority[priority].push(key);
});

// Traiter les clés par ordre de priorité
let generatedCount = 0;
const generatedTranslations = {};

console.log('\n🔄 Génération des traductions par priorité...\n');

Object.keys(missingByPriority).sort((a, b) => parseInt(a) - parseInt(b)).forEach(priority => {
  const keys = missingByPriority[priority];
  const sectionName = keys[0]?.split('.')[0] || 'autres';
  
  console.log(`📁 Section: ${sectionName.toUpperCase()} (${keys.length} clés)`);
  
  keys.forEach(key => {
    const reference = referenceKeys.get(key);
    const frText = reference?.fr;
    const enText = reference?.en;
    
    const arabicTranslation = generateArabicTranslation(frText, enText, key);
    
    generatedTranslations[key] = arabicTranslation;
    setNestedValue(arTranslations, key, arabicTranslation);
    
    generatedCount++;
    
    // Afficher quelques exemples
    if (keys.indexOf(key) < 3) {
      console.log(`   ✅ ${key}: "${arabicTranslation}"`);
    }
  });
  
  if (keys.length > 3) {
    console.log(`   ... et ${keys.length - 3} autres traductions générées`);
  }
  console.log('');
});

console.log(`🎉 ${generatedCount} traductions générées avec succès!`);

// Créer une sauvegarde avant modification
const backupPath = `../locales/ar/translation.backup.${Date.now()}.json`;
if (fs.existsSync('../locales/ar/translation.json')) {
  const originalContent = fs.readFileSync('../locales/ar/translation.json', 'utf8');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Sauvegarde créée: ${backupPath}`);
}

// Sauvegarder le fichier mis à jour
fs.writeFileSync('../locales/ar/translation.json', JSON.stringify(arTranslations, null, 2));

// Sauvegarder les détails de la génération
const generationReport = {
  timestamp: new Date().toISOString(),
  totalGenerated: generatedCount,
  generatedTranslations,
  priorityOrder,
  missingByPriority: Object.keys(missingByPriority).reduce((acc, priority) => {
    acc[priority] = {
      section: missingByPriority[priority][0]?.split('.')[0] || 'autres',
      count: missingByPriority[priority].length,
      keys: missingByPriority[priority]
    };
    return acc;
  }, {}),
  dictionaryUsed: Object.keys(autoTranslationDict).length,
  backupPath
};

fs.writeFileSync('arabic-generation-report.json', JSON.stringify(generationReport, null, 2));

console.log('\n✅ RESTAURATION AUTOMATIQUE TERMINÉE');
console.log(`📁 Fichier mis à jour: locales/ar/translation.json`);
console.log(`📊 Rapport sauvegardé: arabic-generation-report.json`);
console.log(`💾 Sauvegarde: ${backupPath}`);

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Vérifier les traductions générées');
console.log('2. Exécuter les tests de validation');
console.log('3. Ajuster les traductions si nécessaire');
console.log('4. Passer aux sections suivantes');