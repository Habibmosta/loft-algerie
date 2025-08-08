const fs = require('fs');

console.log('🧹 NETTOYAGE MASSIF DES RÉSIDUS DE TRADUCTION\n');

// Lire les fichiers de traduction
const frTranslations = JSON.parse(fs.readFileSync('../locales/fr/translation.json', 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync('../locales/en/translation.json', 'utf8'));
const arTranslations = JSON.parse(fs.readFileSync('../locales/ar/translation.json', 'utf8'));

// Dictionnaire étendu de traductions pour remplacer les chaînes vides
const massiveTranslationDict = {
  fr: {
    // Lofts - Gestion immobilière
    'loftUpdated': 'Loft mis à jour',
    'updatePropertyDetails': 'Mettre à jour les détails de la propriété',
    'allStatuses': 'Tous les statuts',
    'allOwners': 'Tous les propriétaires',
    'allZoneAreas': 'Toutes les zones',
    'couldNotLoadData': 'Impossible de charger les données',
    'loftInfoTitle': 'Informations du loft',
    'loftInfoDescription': 'Détails et caractéristiques du loft',
    'loftName': 'Nom du loft',
    'loftAddress': 'Adresse du loft',
    'pricePerDay': 'Prix par jour',
    'internetConnection': 'Connexion Internet',
    'companyPercentage': 'Pourcentage de la société',
    'ownerPercentage': 'Pourcentage du propriétaire',
    'total': 'Total',
    'shouldEqual100': 'Doit égaler 100%',
    'loftDescription': 'Description du loft',
    'utilityInformation': 'Informations sur les services publics',
    'waterCustomerCode': 'Code client eau',
    'waterContractCode': 'Code contrat eau',
    'waterMeterNumber': 'Numéro compteur eau',
    'electricityPdlRef': 'Référence PDL électricité',
    'electricityCustomerNumber': 'Numéro client électricité',
    'electricityMeterNumber': 'Numéro compteur électricité',
    'gasPdlRef': 'Référence PDL gaz',
    'gasCustomerNumber': 'Numéro client gaz',
    'gasMeterNumber': 'Numéro compteur gaz',
    'billingAlerts': 'Alertes de facturation',
    'billingAlertsDescription': 'Configuration des alertes de facturation',
    'waterBillFrequency': 'Fréquence facture eau',
    'selectFrequency': 'Sélectionner la fréquence',
    'nextWaterBill': 'Prochaine facture eau',
    'energyBillFrequency': 'Fréquence facture énergie',
    'nextEnergyBill': 'Prochaine facture énergie',
    'phoneNumber': 'Numéro de téléphone',
    'phoneBillFrequency': 'Fréquence facture téléphone',
    'nextPhoneBill': 'Prochaine facture téléphone',
    'internetBillFrequency': 'Fréquence facture internet',
    'nextInternetBill': 'Prochaine facture internet',
    'tvBillFrequency': 'Fréquence facture TV',
    'nextTvBill': 'Prochaine facture TV',
    'deleteConfirmTitle': 'Confirmer la suppression',
    'deleteConfirmMessage': 'Êtes-vous sûr de vouloir supprimer ce loft ?',
    'deleteConfirmPrompt': 'Tapez le nom du loft pour confirmer',
    'deleteInProgress': 'Suppression en cours',
    'deletingLoftData': 'Suppression des données du loft',
    'loftDeletedSuccess': 'Loft supprimé avec succès',
    'loftDataDeleted': 'Données du loft supprimées',
    'deleteError': 'Erreur de suppression',
    'deleteErrorMessage': 'Impossible de supprimer le loft',
    'deleteCancelled': 'Suppression annulée',
    'deleteConfirmationIncorrect': 'Confirmation incorrecte',
    'updating': 'Mise à jour en cours',
    'creating': 'Création en cours',
    'updateLoft': 'Mettre à jour le loft',
    
    // Tasks - Gestion des tâches
    'updateSuccess': 'Mise à jour réussie',
    'updateError': 'Erreur de mise à jour',
    'dueDateFormat': 'Format de date d\'échéance',
    'noDueDate': 'Aucune date d\'échéance',
    'updateStatus': 'Mettre à jour le statut',
    'createSuccess': 'Création réussie',
    'createError': 'Erreur de création',
    'assignedTo': 'Assigné à',
    'viewTask': 'Voir la tâche',
    'yourTasks': 'Vos tâches',
    'fillTaskInformation': 'Remplir les informations de la tâche',
    'taskTitle': 'Titre de la tâche',
    'taskDescription': 'Description de la tâche',
    'taskStatus': 'Statut de la tâche',
    'taskDueDate': 'Date d\'échéance',
    'assignTo': 'Assigner à',
    'updateTask': 'Mettre à jour la tâche',
    'memberCanOnlyUpdateStatus': 'Les membres ne peuvent que mettre à jour le statut',
    
    // Common - Éléments communs
    'error': 'Erreur',
    'view': 'Voir',
    'actions': 'Actions',
    'success': 'Succès',
    'back': 'Retour',
    'saving': 'Enregistrement en cours',
    'code': 'Code',
    'symbol': 'Symbole',
    'ratio': 'Ratio',
    'yes': 'Oui',
    'no': 'Non',
    'copyId': 'Copier l\'ID',
    'confirmDelete': 'Confirmer la suppression',
    'refresh': 'Actualiser',
    'selectOption': 'Sélectionner une option',
    'none': 'Aucun',
    'next': 'Suivant',
    'previous': 'Précédent',
    'today': 'Aujourd\'hui',
    'date': 'Date',
    'time': 'Heure',
    'add': 'Ajouter',
    'pickDate': 'Choisir une date',
    'pickDateRange': 'Choisir une plage de dates'
  },
  en: {
    // Lofts - Property management
    'loftUpdated': 'Loft updated',
    'updatePropertyDetails': 'Update property details',
    'allStatuses': 'All statuses',
    'allOwners': 'All owners',
    'allZoneAreas': 'All zones',
    'couldNotLoadData': 'Could not load data',
    'loftInfoTitle': 'Loft information',
    'loftInfoDescription': 'Loft details and characteristics',
    'loftName': 'Loft name',
    'loftAddress': 'Loft address',
    'pricePerDay': 'Price per day',
    'internetConnection': 'Internet connection',
    'companyPercentage': 'Company percentage',
    'ownerPercentage': 'Owner percentage',
    'total': 'Total',
    'shouldEqual100': 'Should equal 100%',
    'loftDescription': 'Loft description',
    'utilityInformation': 'Utility information',
    'waterCustomerCode': 'Water customer code',
    'waterContractCode': 'Water contract code',
    'waterMeterNumber': 'Water meter number',
    'electricityPdlRef': 'Electricity PDL reference',
    'electricityCustomerNumber': 'Electricity customer number',
    'electricityMeterNumber': 'Electricity meter number',
    'gasPdlRef': 'Gas PDL reference',
    'gasCustomerNumber': 'Gas customer number',
    'gasMeterNumber': 'Gas meter number',
    'billingAlerts': 'Billing alerts',
    'billingAlertsDescription': 'Billing alerts configuration',
    'waterBillFrequency': 'Water bill frequency',
    'selectFrequency': 'Select frequency',
    'nextWaterBill': 'Next water bill',
    'energyBillFrequency': 'Energy bill frequency',
    'nextEnergyBill': 'Next energy bill',
    'phoneNumber': 'Phone number',
    'phoneBillFrequency': 'Phone bill frequency',
    'nextPhoneBill': 'Next phone bill',
    'internetBillFrequency': 'Internet bill frequency',
    'nextInternetBill': 'Next internet bill',
    'tvBillFrequency': 'TV bill frequency',
    'nextTvBill': 'Next TV bill',
    'deleteConfirmTitle': 'Confirm deletion',
    'deleteConfirmMessage': 'Are you sure you want to delete this loft?',
    'deleteConfirmPrompt': 'Type the loft name to confirm',
    'deleteInProgress': 'Deletion in progress',
    'deletingLoftData': 'Deleting loft data',
    'loftDeletedSuccess': 'Loft deleted successfully',
    'loftDataDeleted': 'Loft data deleted',
    'deleteError': 'Deletion error',
    'deleteErrorMessage': 'Unable to delete loft',
    'deleteCancelled': 'Deletion cancelled',
    'deleteConfirmationIncorrect': 'Incorrect confirmation',
    'updating': 'Updating',
    'creating': 'Creating',
    'updateLoft': 'Update loft',
    
    // Tasks - Task management
    'updateSuccess': 'Update successful',
    'updateError': 'Update error',
    'dueDateFormat': 'Due date format',
    'noDueDate': 'No due date',
    'updateStatus': 'Update status',
    'createSuccess': 'Creation successful',
    'createError': 'Creation error',
    'assignedTo': 'Assigned to',
    'viewTask': 'View task',
    'yourTasks': 'Your tasks',
    'fillTaskInformation': 'Fill task information',
    'taskTitle': 'Task title',
    'taskDescription': 'Task description',
    'taskStatus': 'Task status',
    'taskDueDate': 'Due date',
    'assignTo': 'Assign to',
    'updateTask': 'Update task',
    'memberCanOnlyUpdateStatus': 'Members can only update status',
    
    // Common - Common elements
    'error': 'Error',
    'view': 'View',
    'actions': 'Actions',
    'success': 'Success',
    'back': 'Back',
    'saving': 'Saving',
    'code': 'Code',
    'symbol': 'Symbol',
    'ratio': 'Ratio',
    'yes': 'Yes',
    'no': 'No',
    'copyId': 'Copy ID',
    'confirmDelete': 'Confirm delete',
    'refresh': 'Refresh',
    'selectOption': 'Select option',
    'none': 'None',
    'next': 'Next',
    'previous': 'Previous',
    'today': 'Today',
    'date': 'Date',
    'time': 'Time',
    'add': 'Add',
    'pickDate': 'Pick date',
    'pickDateRange': 'Pick date range'
  },
  ar: {
    // Lofts - إدارة العقارات
    'loftUpdated': 'تم تحديث اللوفت',
    'updatePropertyDetails': 'تحديث تفاصيل العقار',
    'allStatuses': 'جميع الحالات',
    'allOwners': 'جميع المالكين',
    'allZoneAreas': 'جميع المناطق',
    'couldNotLoadData': 'لا يمكن تحميل البيانات',
    'loftInfoTitle': 'معلومات اللوفت',
    'loftInfoDescription': 'تفاصيل وخصائص اللوفت',
    'loftName': 'اسم اللوفت',
    'loftAddress': 'عنوان اللوفت',
    'pricePerDay': 'السعر لليوم',
    'internetConnection': 'اتصال الإنترنت',
    'companyPercentage': 'نسبة الشركة',
    'ownerPercentage': 'نسبة المالك',
    'total': 'المجموع',
    'shouldEqual100': 'يجب أن يساوي 100%',
    'loftDescription': 'وصف اللوفت',
    'utilityInformation': 'معلومات المرافق',
    'waterCustomerCode': 'رمز عميل المياه',
    'waterContractCode': 'رمز عقد المياه',
    'waterMeterNumber': 'رقم عداد المياه',
    'electricityPdlRef': 'مرجع PDL الكهرباء',
    'electricityCustomerNumber': 'رقم عميل الكهرباء',
    'electricityMeterNumber': 'رقم عداد الكهرباء',
    'gasPdlRef': 'مرجع PDL الغاز',
    'gasCustomerNumber': 'رقم عميل الغاز',
    'gasMeterNumber': 'رقم عداد الغاز',
    'billingAlerts': 'تنبيهات الفواتير',
    'billingAlertsDescription': 'إعداد تنبيهات الفواتير',
    'waterBillFrequency': 'تكرار فاتورة المياه',
    'selectFrequency': 'اختر التكرار',
    'nextWaterBill': 'فاتورة المياه التالية',
    'energyBillFrequency': 'تكرار فاتورة الطاقة',
    'nextEnergyBill': 'فاتورة الطاقة التالية',
    'phoneNumber': 'رقم الهاتف',
    'phoneBillFrequency': 'تكرار فاتورة الهاتف',
    'nextPhoneBill': 'فاتورة الهاتف التالية',
    'internetBillFrequency': 'تكرار فاتورة الإنترنت',
    'nextInternetBill': 'فاتورة الإنترنت التالية',
    'tvBillFrequency': 'تكرار فاتورة التلفزيون',
    'nextTvBill': 'فاتورة التلفزيون التالية',
    'deleteConfirmTitle': 'تأكيد الحذف',
    'deleteConfirmMessage': 'هل أنت متأكد من حذف هذا اللوفت؟',
    'deleteConfirmPrompt': 'اكتب اسم اللوفت للتأكيد',
    'deleteInProgress': 'الحذف قيد التنفيذ',
    'deletingLoftData': 'حذف بيانات اللوفت',
    'loftDeletedSuccess': 'تم حذف اللوفت بنجاح',
    'loftDataDeleted': 'تم حذف بيانات اللوفت',
    'deleteError': 'خطأ في الحذف',
    'deleteErrorMessage': 'لا يمكن حذف اللوفت',
    'deleteCancelled': 'تم إلغاء الحذف',
    'deleteConfirmationIncorrect': 'التأكيد غير صحيح',
    'updating': 'جاري التحديث',
    'creating': 'جاري الإنشاء',
    'updateLoft': 'تحديث اللوفت'
  }
};

// Fonction pour nettoyer massivement les résidus
function massiveCleanup(translations, language, dict) {
  let cleanedCount = 0;
  const cleanedKeys = [];
  
  function cleanObject(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        cleanObject(value, fullKey);
      } else if (typeof value === 'string') {
        // Nettoyer les chaînes vides et les marqueurs de fallback
        if (value === '' || value.startsWith('[AR]')) {
          // Chercher une traduction dans le dictionnaire
          const dictKey = fullKey.split('.').pop(); // Dernière partie de la clé
          if (dict[dictKey]) {
            obj[key] = dict[dictKey];
            cleanedKeys.push({ key: fullKey, oldValue: value, newValue: dict[dictKey] });
            cleanedCount++;
          }
        }
      }
    }
  }
  
  cleanObject(translations);
  return { cleanedCount, cleanedKeys };
}

console.log('🧹 Nettoyage massif en cours...\n');

// Nettoyer chaque langue
const frCleanup = massiveCleanup(frTranslations, 'fr', massiveTranslationDict.fr);
const enCleanup = massiveCleanup(enTranslations, 'en', massiveTranslationDict.en);
const arCleanup = massiveCleanup(arTranslations, 'ar', massiveTranslationDict.ar);

console.log(`🇫🇷 Français: ${frCleanup.cleanedCount} résidus nettoyés`);
console.log(`🇬🇧 Anglais: ${enCleanup.cleanedCount} résidus nettoyés`);
console.log(`🇸🇦 Arabe: ${arCleanup.cleanedCount} résidus nettoyés`);

// Afficher quelques exemples de nettoyage
if (frCleanup.cleanedKeys.length > 0) {
  console.log('\n📝 Exemples de nettoyage français:');
  frCleanup.cleanedKeys.slice(0, 5).forEach(({ key, oldValue, newValue }) => {
    console.log(`   ${key}: "${oldValue}" → "${newValue}"`);
  });
}

if (enCleanup.cleanedKeys.length > 0) {
  console.log('\n📝 Exemples de nettoyage anglais:');
  enCleanup.cleanedKeys.slice(0, 5).forEach(({ key, oldValue, newValue }) => {
    console.log(`   ${key}: "${oldValue}" → "${newValue}"`);
  });
}

if (arCleanup.cleanedKeys.length > 0) {
  console.log('\n📝 Exemples de nettoyage arabe:');
  arCleanup.cleanedKeys.slice(0, 5).forEach(({ key, oldValue, newValue }) => {
    console.log(`   ${key}: "${oldValue}" → "${newValue}"`);
  });
}

// Créer des sauvegardes
const timestamp = Date.now();
console.log('\n💾 Création des sauvegardes...');

fs.writeFileSync(`../locales/fr/translation.backup.${timestamp}.json`, JSON.stringify(frTranslations, null, 2));
fs.writeFileSync(`../locales/en/translation.backup.${timestamp}.json`, JSON.stringify(enTranslations, null, 2));
fs.writeFileSync(`../locales/ar/translation.backup.${timestamp}.json`, JSON.stringify(arTranslations, null, 2));

// Sauvegarder les fichiers nettoyés
console.log('💾 Sauvegarde des fichiers nettoyés...');
fs.writeFileSync('../locales/fr/translation.json', JSON.stringify(frTranslations, null, 2));
fs.writeFileSync('../locales/en/translation.json', JSON.stringify(enTranslations, null, 2));
fs.writeFileSync('../locales/ar/translation.json', JSON.stringify(arTranslations, null, 2));

const totalCleaned = frCleanup.cleanedCount + enCleanup.cleanedCount + arCleanup.cleanedCount;

console.log('\n✅ NETTOYAGE MASSIF TERMINÉ !');
console.log(`🧹 Total des résidus nettoyés: ${totalCleaned}`);
console.log(`💾 Sauvegardes créées avec timestamp: ${timestamp}`);

// Sauvegarder le rapport de nettoyage
const cleanupReport = {
  timestamp: new Date().toISOString(),
  backupTimestamp: timestamp,
  cleanupResults: {
    fr: frCleanup,
    en: enCleanup,
    ar: arCleanup
  },
  totalCleaned,
  dictionarySize: {
    fr: Object.keys(massiveTranslationDict.fr).length,
    en: Object.keys(massiveTranslationDict.en).length,
    ar: Object.keys(massiveTranslationDict.ar).length
  }
};

fs.writeFileSync('massive-cleanup-report.json', JSON.stringify(cleanupReport, null, 2));

console.log('\n📊 Rapport de nettoyage sauvegardé: massive-cleanup-report.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Redémarrer l\'application pour voir les améliorations');
console.log('2. Tester l\'interface dans les 3 langues');
console.log('3. Vérifier que les résidus ont disparu');
console.log('4. Créer un commit pour sauvegarder le nettoyage');