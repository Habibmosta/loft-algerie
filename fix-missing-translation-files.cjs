const fs = require('fs');
const path = require('path');

// Langues supportées
const languages = ['fr', 'ar', 'en'];

// Namespaces requis selon la configuration
const namespaces = [
  'common', 'auth', 'landing', 'bills', 'lofts', 'owners', 'teams', 
  'reservations', 'transactions', 'analytics', 'conversations', 
  'dashboard', 'executive', 'internetConnections', 'nav', 
  'notifications', 'paymentMethods', 'reports', 'settings', 
  'tasks', 'test', 'testSound', 'testTranslations', 'theme', 
  'unauthorized', 'zoneAreas', 'availability'
];

// Contenu par défaut pour chaque namespace
const defaultContent = {
  common: { loading: "Chargement...", save: "Enregistrer", cancel: "Annuler" },
  auth: { login: "Connexion", logout: "Déconnexion" },
  landing: { welcome: "Bienvenue" },
  bills: { title: "Factures" },
  lofts: { title: "Lofts" },
  owners: { title: "Propriétaires" },
  teams: { title: "Équipes" },
  reservations: { title: "Réservations" },
  transactions: { title: "Transactions" },
  analytics: { title: "Analytics" },
  conversations: { title: "Conversations" },
  dashboard: { title: "Tableau de bord" },
  executive: { title: "Exécutif" },
  internetConnections: { title: "Connexions Internet" },
  nav: { home: "Accueil", settings: "Paramètres" },
  notifications: { title: "Notifications" },
  paymentMethods: { title: "Méthodes de paiement" },
  reports: { title: "Rapports" },
  settings: { title: "Paramètres" },
  tasks: { title: "Tâches" },
  test: { title: "Test" },
  testSound: { title: "Test Son" },
  testTranslations: { title: "Test Traductions" },
  theme: { title: "Thème" },
  unauthorized: { message: "Non autorisé" },
  zoneAreas: { title: "Zones géographiques" },
  availability: { title: "Disponibilités" }
};

console.log('🔧 Création des fichiers de traduction manquants...');

languages.forEach(lang => {
  const langDir = path.join('public', 'locales', lang);
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
    console.log(`📁 Dossier créé: ${langDir}`);
  }
  
  namespaces.forEach(ns => {
    const filePath = path.join(langDir, `${ns}.json`);
    
    // Créer le fichier s'il n'existe pas
    if (!fs.existsSync(filePath)) {
      const content = defaultContent[ns] || { title: ns };
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      console.log(`✅ Fichier créé: ${filePath}`);
    }
  });
});

console.log('🎉 Tous les fichiers de traduction ont été créés !');