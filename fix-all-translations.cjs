// Script pour corriger toutes les traductions avec la syntaxe incorrecte
const fs = require('fs');
const path = require('path');

console.log('🔧 Correction automatique des traductions...\n');

// Fonction pour parcourir récursivement les fichiers
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

// Fonction pour corriger un fichier
function fixTranslationsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;

  // Patterns à corriger
  const patterns = [
    // t('namespace.key') -> t('namespace:key')
    {
      pattern: /t\('([a-zA-Z]+)\.([^']+)'\)/g,
      replacement: "t('$1:$2')",
      description: "t('namespace.key') → t('namespace:key')"
    },
    // t('namespace.key', options) -> t('namespace:key', options)
    {
      pattern: /t\('([a-zA-Z]+)\.([^']+)',\s*([^)]+)\)/g,
      replacement: "t('$1:$2', $3)",
      description: "t('namespace.key', options) → t('namespace:key', options)"
    }
  ];

  patterns.forEach(({ pattern, replacement, description }) => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(`📝 ${filePath}:`);
      matches.forEach(match => {
        console.log(`  - ${match} → ${match.replace(pattern, replacement)}`);
      });
      updatedContent = updatedContent.replace(pattern, replacement);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    return true;
  }
  return false;
}

// Parcourir les dossiers
const foldersToCheck = ['app', 'components', 'lib'];
let totalFixed = 0;

foldersToCheck.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`🔍 Vérification du dossier: ${folder}/`);
    walkDir(folder, (filePath) => {
      if (fixTranslationsInFile(filePath)) {
        totalFixed++;
      }
    });
  }
});

console.log(`\n✅ Correction terminée!`);
console.log(`📊 ${totalFixed} fichier(s) corrigé(s)`);

if (totalFixed > 0) {
  console.log('\n🚀 Prochaines étapes:');
  console.log('1. Vérifiez les changements avec: git diff');
  console.log('2. Testez votre application');
  console.log('3. Commitez les changements si tout fonctionne');
} else {
  console.log('\n🎉 Aucune correction nécessaire - toutes les traductions utilisent déjà la bonne syntaxe!');
}