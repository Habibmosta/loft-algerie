const fs = require('fs');

console.log('🚨 RESTAURATION D\'URGENCE DES SECTIONS FONDAMENTALES\n');

// Traductions de référence pour les sections fondamentales
const foundationTranslations = {
  fr: {
    auth: {
      signInDescription: "Connectez-vous à votre compte",
      welcomeBack: "Bon retour",
      email: "Email",
      enterEmail: "Entrez votre email",
      password: "Mot de passe",
      enterPassword: "Entrez votre mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      signingIn: "Connexion en cours...",
      signIn: "Se connecter",
      noAccount: "Pas de compte ?",
      signUp: "S'inscrire",
      demoAccounts: "Comptes de démonstration",
      admin: "Administrateur",
      manager: "Gestionnaire",
      member: "Membre",
      registrationFailed: "Échec de l'inscription",
      unexpectedError: "Une erreur inattendue s'est produite",
      signUpTitle: "Créer un compte",
      signUpDescription: "Créez votre compte pour commencer",
      fullName: "Nom complet",
      enterFullName: "Entrez votre nom complet",
      signingUp: "Création du compte...",
      haveAccount: "Déjà un compte ?",
      signOut: "Se déconnecter"
    },
    landing: {
      title: "Gestion Immobilière Loft Algérie",
      subtitle: "Solution complète pour la gestion de vos propriétés",
      description: "Gérez efficacement vos lofts, réservations, tâches et finances avec notre plateforme intégrée",
      getStarted: "Commencer",
      signIn: "Se connecter",
      features: {
        title: "Fonctionnalités",
        property: {
          title: "Gestion des Propriétés",
          description: "Gérez vos lofts et propriétés en toute simplicité"
        },
        financial: {
          title: "Gestion Financière",
          description: "Suivez vos revenus, dépenses et transactions"
        },
        tasks: {
          title: "Gestion des Tâches",
          description: "Organisez et suivez toutes vos tâches de maintenance"
        },
        notifications: {
          title: "Notifications",
          description: "Restez informé de tous les événements importants"
        }
      }
    },
    nav: {
      dashboard: "Tableau de Bord",
      lofts: "Lofts",
      tasks: "Tâches",
      reservations: "Réservations",
      transactions: "Transactions",
      reports: "Rapports",
      settings: "Paramètres",
      conversations: "Conversations",
      notifications: "Notifications",
      owners: "Propriétaires",
      teams: "Équipes",
      categories: "Catégories",
      currencies: "Devises",
      internetConnections: "Connexions Internet",
      paymentMethods: "Méthodes de Paiement",
      zoneAreas: "Zones",
      application: "Application"
    },
    theme: {
      light: "Clair",
      dark: "Sombre",
      system: "Système"
    }
  },
  en: {
    auth: {
      signInDescription: "Sign in to your account",
      welcomeBack: "Welcome back",
      email: "Email",
      enterEmail: "Enter your email",
      password: "Password",
      enterPassword: "Enter your password",
      forgotPassword: "Forgot password?",
      signingIn: "Signing in...",
      signIn: "Sign In",
      noAccount: "No account?",
      signUp: "Sign Up",
      demoAccounts: "Demo Accounts",
      admin: "Admin",
      manager: "Manager",
      member: "Member",
      registrationFailed: "Registration failed",
      unexpectedError: "An unexpected error occurred",
      signUpTitle: "Create Account",
      signUpDescription: "Create your account to get started",
      fullName: "Full Name",
      enterFullName: "Enter your full name",
      signingUp: "Creating account...",
      haveAccount: "Already have an account?",
      signOut: "Sign Out"
    },
    landing: {
      title: "Loft Algeria Property Management",
      subtitle: "Complete solution for managing your properties",
      description: "Efficiently manage your lofts, reservations, tasks and finances with our integrated platform",
      getStarted: "Get Started",
      signIn: "Sign In",
      features: {
        title: "Features",
        property: {
          title: "Property Management",
          description: "Manage your lofts and properties with ease"
        },
        financial: {
          title: "Financial Management",
          description: "Track your income, expenses and transactions"
        },
        tasks: {
          title: "Task Management",
          description: "Organize and track all your maintenance tasks"
        },
        notifications: {
          title: "Notifications",
          description: "Stay informed about all important events"
        }
      }
    },
    nav: {
      dashboard: "Dashboard",
      lofts: "Lofts",
      tasks: "Tasks",
      reservations: "Reservations",
      transactions: "Transactions",
      reports: "Reports",
      settings: "Settings",
      conversations: "Conversations",
      notifications: "Notifications",
      owners: "Owners",
      teams: "Teams",
      categories: "Categories",
      currencies: "Currencies",
      internetConnections: "Internet Connections",
      paymentMethods: "Payment Methods",
      zoneAreas: "Zone Areas",
      application: "Application"
    },
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System"
    }
  }
};

// Lire les fichiers actuels
const frTranslations = JSON.parse(fs.readFileSync('../locales/fr/translation.json', 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync('../locales/en/translation.json', 'utf8'));

console.log('📖 Fichiers actuels chargés');

// Fonction pour fusionner les traductions
function mergeTranslations(existing, foundation) {
  const merged = { ...existing };
  
  Object.entries(foundation).forEach(([section, translations]) => {
    if (!merged[section]) {
      merged[section] = {};
    }
    
    // Fusionner récursivement
    function deepMerge(target, source) {
      Object.entries(source).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], value);
        } else {
          // Ne remplacer que si la valeur est vide ou manquante
          if (!target[key] || target[key] === '' || target[key].trim() === '') {
            target[key] = value;
          }
        }
      });
    }
    
    deepMerge(merged[section], translations);
  });
  
  return merged;
}

// Restaurer les traductions françaises
console.log('🔄 Restauration des traductions françaises...');
const restoredFr = mergeTranslations(frTranslations, foundationTranslations.fr);

// Restaurer les traductions anglaises
console.log('🔄 Restauration des traductions anglaises...');
const restoredEn = mergeTranslations(enTranslations, foundationTranslations.en);

// Créer des sauvegardes
const timestamp = Date.now();
console.log('💾 Création des sauvegardes...');

fs.writeFileSync(`../locales/fr/translation.backup.${timestamp}.json`, JSON.stringify(frTranslations, null, 2));
fs.writeFileSync(`../locales/en/translation.backup.${timestamp}.json`, JSON.stringify(enTranslations, null, 2));

// Sauvegarder les fichiers restaurés
console.log('💾 Sauvegarde des fichiers restaurés...');
fs.writeFileSync('../locales/fr/translation.json', JSON.stringify(restoredFr, null, 2));
fs.writeFileSync('../locales/en/translation.json', JSON.stringify(restoredEn, null, 2));

// Calculer les statistiques de restauration
function countRestoredKeys(original, restored) {
  let count = 0;
  
  function countKeys(orig, rest, prefix = '') {
    Object.entries(rest).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const origSection = orig[key] || {};
        countKeys(origSection, value, fullKey);
      } else {
        const origValue = orig[key];
        if (!origValue || origValue === '' || origValue.trim() === '') {
          count++;
        }
      }
    });
  }
  
  // Compter seulement les sections fondamentales
  ['auth', 'landing', 'nav', 'theme'].forEach(section => {
    if (restored[section]) {
      countKeys(original[section] || {}, restored[section], section);
    }
  });
  
  return count;
}

const frRestored = countRestoredKeys(frTranslations, restoredFr);
const enRestored = countRestoredKeys(enTranslations, restoredEn);

console.log('\n✅ RESTAURATION TERMINÉE AVEC SUCCÈS !');
console.log(`🇫🇷 Français: ${frRestored} clés restaurées`);
console.log(`🇬🇧 Anglais: ${enRestored} clés restaurées`);
console.log(`💾 Sauvegardes créées avec timestamp: ${timestamp}`);

// Sauvegarder le rapport de restauration
const restorationReport = {
  timestamp: new Date().toISOString(),
  backupTimestamp: timestamp,
  sectionsRestored: ['auth', 'landing', 'nav', 'theme'],
  statistics: {
    fr: {
      keysRestored: frRestored,
      backupFile: `../locales/fr/translation.backup.${timestamp}.json`
    },
    en: {
      keysRestored: enRestored,
      backupFile: `../locales/en/translation.backup.${timestamp}.json`
    }
  },
  totalKeysRestored: frRestored + enRestored
};

fs.writeFileSync('emergency-restoration-report.json', JSON.stringify(restorationReport, null, 2));

console.log('\n📊 Rapport de restauration sauvegardé: emergency-restoration-report.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Exécuter un nouvel audit pour vérifier la restauration');
console.log('2. Valider la qualité des traductions restaurées');
console.log('3. Tester l\'interface utilisateur');
console.log('4. Créer un commit pour sauvegarder la restauration');