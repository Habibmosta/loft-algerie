const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des traductions communes...');

// Traductions communes essentielles
const commonTranslations = {
  fr: {
    "loading": "Chargement...",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "add": "Ajouter",
    "create": "Créer",
    "update": "Mettre à jour",
    "view": "Voir",
    "actions": "Actions",
    "name": "Nom",
    "description": "Description",
    "status": "Statut",
    "date": "Date",
    "time": "Heure",
    "search": "Rechercher",
    "filter": "Filtrer",
    "sort": "Trier",
    "export": "Exporter",
    "import": "Importer",
    "print": "Imprimer",
    "close": "Fermer",
    "open": "Ouvrir",
    "yes": "Oui",
    "no": "Non",
    "ok": "OK",
    "error": "Erreur",
    "success": "Succès",
    "warning": "Avertissement",
    "info": "Information",
    "confirm": "Confirmer",
    "back": "Retour",
    "next": "Suivant",
    "previous": "Précédent",
    "first": "Premier",
    "last": "Dernier",
    "page": "Page",
    "of": "de",
    "total": "Total",
    "selected": "Sélectionné",
    "all": "Tout",
    "none": "Aucun",
    "required": "Requis",
    "optional": "Optionnel",
    "submit": "Soumettre",
    "reset": "Réinitialiser",
    "clear": "Effacer",
    "refresh": "Actualiser",
    "reload": "Recharger"
  },
  ar: {
    "loading": "جاري التحميل...",
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "add": "إضافة",
    "create": "إنشاء",
    "update": "تحديث",
    "view": "عرض",
    "actions": "الإجراءات",
    "name": "الاسم",
    "description": "الوصف",
    "status": "الحالة",
    "date": "التاريخ",
    "time": "الوقت",
    "search": "بحث",
    "filter": "تصفية",
    "sort": "ترتيب",
    "export": "تصدير",
    "import": "استيراد",
    "print": "طباعة",
    "close": "إغلاق",
    "open": "فتح",
    "yes": "نعم",
    "no": "لا",
    "ok": "موافق",
    "error": "خطأ",
    "success": "نجح",
    "warning": "تحذير",
    "info": "معلومات",
    "confirm": "تأكيد",
    "back": "رجوع",
    "next": "التالي",
    "previous": "السابق",
    "first": "الأول",
    "last": "الأخير",
    "page": "صفحة",
    "of": "من",
    "total": "المجموع",
    "selected": "محدد",
    "all": "الكل",
    "none": "لا شيء",
    "required": "مطلوب",
    "optional": "اختياري",
    "submit": "إرسال",
    "reset": "إعادة تعيين",
    "clear": "مسح",
    "refresh": "تحديث",
    "reload": "إعادة تحميل"
  },
  en: {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "create": "Create",
    "update": "Update",
    "view": "View",
    "actions": "Actions",
    "name": "Name",
    "description": "Description",
    "status": "Status",
    "date": "Date",
    "time": "Time",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "export": "Export",
    "import": "Import",
    "print": "Print",
    "close": "Close",
    "open": "Open",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "first": "First",
    "last": "Last",
    "page": "Page",
    "of": "of",
    "total": "Total",
    "selected": "Selected",
    "all": "All",
    "none": "None",
    "required": "Required",
    "optional": "Optional",
    "submit": "Submit",
    "reset": "Reset",
    "clear": "Clear",
    "refresh": "Refresh",
    "reload": "Reload"
  }
};

// Mettre à jour les fichiers common.json
Object.keys(commonTranslations).forEach(lang => {
  const filePath = path.join('public', 'locales', lang, 'common.json');
  
  try {
    // Lire le fichier existant
    let existingTranslations = {};
    if (fs.existsSync(filePath)) {
      existingTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    // Fusionner avec les nouvelles traductions
    const mergedTranslations = {
      ...existingTranslations,
      ...commonTranslations[lang]
    };
    
    // Écrire le fichier mis à jour
    fs.writeFileSync(filePath, JSON.stringify(mergedTranslations, null, 2), 'utf8');
    console.log(`✅ ${lang}/common.json mis à jour`);
    
  } catch (error) {
    console.error(`❌ Erreur pour ${lang}/common.json:`, error.message);
  }
});

console.log('\n🎉 Traductions communes corrigées !');
console.log('📋 Les traductions de base sont maintenant disponibles.');