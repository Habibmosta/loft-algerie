const fs = require('fs');
const path = require('path');

console.log('🧪 Test des traductions en temps réel...');
console.log('=====================================');

// Clés de traduction à tester
const testKeys = [
  'auth.welcomeBack',
  'auth.signInDescription', 
  'auth.signIn',
  'auth.email',
  'auth.password',
  'auth.forgotPassword',
  'auth.noAccount',
  'auth.signUp',
  'auth.demoAccounts',
  'common.loading',
  'common.save',
  'common.cancel'
];

const languages = ['fr', 'ar', 'en'];

languages.forEach(lang => {
  console.log(`\n🌍 Langue: ${lang.toUpperCase()}`);
  console.log('─'.repeat(30));
  
  testKeys.forEach(key => {
    const [namespace, translationKey] = key.split('.');
    const filePath = path.join('public', 'locales', lang, `${namespace}.json`);
    
    try {
      if (fs.existsSync(filePath)) {
        const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const value = translations[translationKey];
        
        if (value) {
          console.log(`✅ ${key}: "${value}"`);
        } else {
          console.log(`❌ ${key}: MANQUANT`);
        }
      } else {
        console.log(`❌ ${key}: FICHIER MANQUANT (${namespace}.json)`);
      }
    } catch (error) {
      console.log(`❌ ${key}: ERREUR JSON`);
    }
  });
});

console.log('\n📊 Résumé du test:');
console.log('─'.repeat(30));

// Compter les traductions disponibles
let totalKeys = testKeys.length * languages.length;
let availableKeys = 0;

languages.forEach(lang => {
  testKeys.forEach(key => {
    const [namespace, translationKey] = key.split('.');
    const filePath = path.join('public', 'locales', lang, `${namespace}.json`);
    
    try {
      if (fs.existsSync(filePath)) {
        const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (translations[translationKey]) {
          availableKeys++;
        }
      }
    } catch (error) {
      // Ignorer les erreurs pour le comptage
    }
  });
});

const percentage = Math.round((availableKeys / totalKeys) * 100);
console.log(`📈 Traductions disponibles: ${availableKeys}/${totalKeys} (${percentage}%)`);

if (percentage === 100) {
  console.log('🎉 Toutes les traductions sont disponibles !');
} else if (percentage >= 80) {
  console.log('⚠️  La plupart des traductions sont disponibles');
} else {
  console.log('❌ Plusieurs traductions manquent');
}

console.log('\n💡 Pour corriger les traductions manquantes:');
console.log('   node fix-auth-translations-complete.cjs');
console.log('   node fix-common-translations.cjs');