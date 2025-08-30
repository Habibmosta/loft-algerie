const fs = require('fs');
const path = require('path');

console.log('🔧 Correction complète des traductions d\'authentification...');

// Traductions complètes pour l'authentification
const authTranslations = {
  fr: {
    "welcomeBack": "Bon retour",
    "signInDescription": "Connectez-vous à votre compte",
    "signIn": "Se connecter",
    "email": "Email",
    "password": "Mot de passe",
    "forgotPassword": "Mot de passe oublié ?",
    "noAccount": "Vous n'avez pas de compte ?",
    "signUp": "S'inscrire",
    "demoAccounts": "Comptes de démonstration",
    "admin": "admin@loftmanager.com / password123",
    "manager": "manager@loftmanager.com / password123",
    "member": "member@loftmanager.com / password123",
    "enterEmail": "Entrez votre email",
    "enterPassword": "Entrez votre mot de passe",
    "signingIn": "Connexion...",
    "signOut": "Se déconnecter",
    "rememberMe": "Se souvenir de moi",
    "createAccount": "Créer un compte",
    "hasAccount": "Vous avez déjà un compte ?",
    "signUpDescription": "Créer un nouveau compte",
    "fullName": "Nom complet",
    "enterFullName": "Entrez votre nom complet"
  },
  ar: {
    "welcomeBack": "مرحباً بعودتك",
    "signInDescription": "قم بتسجيل الدخول إلى حسابك",
    "signIn": "تسجيل الدخول",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "forgotPassword": "نسيت كلمة المرور؟",
    "noAccount": "ليس لديك حساب؟",
    "signUp": "إنشاء حساب",
    "demoAccounts": "حسابات تجريبية",
    "admin": "admin@loftmanager.com / password123",
    "manager": "manager@loftmanager.com / password123",
    "member": "member@loftmanager.com / password123",
    "enterEmail": "أدخل بريدك الإلكتروني",
    "enterPassword": "أدخل كلمة المرور",
    "signingIn": "جاري تسجيل الدخول...",
    "signOut": "تسجيل الخروج",
    "rememberMe": "تذكرني",
    "createAccount": "إنشاء حساب",
    "hasAccount": "لديك حساب بالفعل؟",
    "signUpDescription": "إنشاء حساب جديد",
    "fullName": "الاسم الكامل",
    "enterFullName": "أدخل اسمك الكامل"
  },
  en: {
    "welcomeBack": "Welcome Back",
    "signInDescription": "Sign in to your account",
    "signIn": "Sign In",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "signUp": "Sign Up",
    "demoAccounts": "Demo Accounts",
    "admin": "admin@loftmanager.com / password123",
    "manager": "manager@loftmanager.com / password123",
    "member": "member@loftmanager.com / password123",
    "enterEmail": "Enter your email",
    "enterPassword": "Enter your password",
    "signingIn": "Signing in...",
    "signOut": "Sign Out",
    "rememberMe": "Remember me",
    "createAccount": "Create Account",
    "hasAccount": "Already have an account?",
    "signUpDescription": "Create a new account",
    "fullName": "Full Name",
    "enterFullName": "Enter your full name"
  }
};

// Mettre à jour les fichiers de traduction
Object.keys(authTranslations).forEach(lang => {
  const filePath = path.join('public', 'locales', lang, 'auth.json');
  
  try {
    // Lire le fichier existant s'il existe
    let existingTranslations = {};
    if (fs.existsSync(filePath)) {
      existingTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    // Fusionner avec les nouvelles traductions
    const mergedTranslations = {
      ...existingTranslations,
      ...authTranslations[lang]
    };
    
    // Écrire le fichier mis à jour
    fs.writeFileSync(filePath, JSON.stringify(mergedTranslations, null, 2), 'utf8');
    console.log(`✅ ${lang}/auth.json mis à jour`);
    
  } catch (error) {
    console.error(`❌ Erreur pour ${lang}/auth.json:`, error.message);
  }
});

// Vérifier que les fichiers sont valides
console.log('\n🔍 Vérification des fichiers JSON...');
Object.keys(authTranslations).forEach(lang => {
  const filePath = path.join('public', 'locales', lang, 'auth.json');
  try {
    JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`✅ ${lang}/auth.json - JSON valide`);
  } catch (error) {
    console.log(`❌ ${lang}/auth.json - Erreur JSON: ${error.message}`);
  }
});

console.log('\n🎉 Traductions d\'authentification corrigées !');
console.log('📋 Redémarrez le serveur de développement pour voir les changements.');