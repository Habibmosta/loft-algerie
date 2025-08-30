const fs = require('fs');
const path = require('path');

console.log('👀 Surveillance des erreurs CSS...');
console.log('==================================');

// Fonction pour analyser les erreurs CSS communes
function analyzeCSSErrors() {
  const results = {
    errors: [],
    warnings: [],
    suggestions: []
  };
  
  // Vérifier le fichier globals.css
  const globalsPath = 'app/globals.css';
  if (fs.existsSync(globalsPath)) {
    const content = fs.readFileSync(globalsPath, 'utf8');
    
    // Détecter les problèmes courants
    const issues = [
      {
        pattern: /-webkit-text-size-adjust:\s*[^;]*[^0-9%];/g,
        type: 'error',
        message: 'Valeur invalide pour -webkit-text-size-adjust'
      },
      {
        pattern: /(@[^{]*)\{([^}]*)\{/g,
        type: 'error', 
        message: 'Sélecteur CSS mal formé (accolades imbriquées)'
      },
      {
        pattern: /\}\s*\{/g,
        type: 'warning',
        message: 'Espacement manquant entre les règles CSS'
      },
      {
        pattern: /[^a-zA-Z0-9-_]\s*\{/g,
        type: 'warning',
        message: 'Sélecteur CSS potentiellement invalide'
      }
    ];
    
    issues.forEach(issue => {
      const matches = content.match(issue.pattern);
      if (matches) {
        results[issue.type === 'error' ? 'errors' : 'warnings'].push({
          file: 'app/globals.css',
          issue: issue.message,
          count: matches.length,
          examples: matches.slice(0, 3)
        });
      }
    });
  }
  
  // Vérifier les fichiers CSS dans .next (si ils existent)
  const nextCSSDir = '.next/static/css';
  if (fs.existsSync(nextCSSDir)) {
    const cssFiles = fs.readdirSync(nextCSSDir).filter(f => f.endsWith('.css'));
    
    if (cssFiles.length > 0) {
      results.suggestions.push({
        message: `${cssFiles.length} fichiers CSS générés trouvés`,
        action: 'Les erreurs peuvent venir de la compilation Tailwind'
      });
    }
  }
  
  return results;
}

// Fonction pour générer un rapport
function generateReport() {
  const analysis = analyzeCSSErrors();
  
  console.log('\n📊 Rapport d\'analyse CSS :');
  console.log('─'.repeat(40));
  
  if (analysis.errors.length > 0) {
    console.log('\n❌ Erreurs détectées :');
    analysis.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.issue}`);
      console.log(`   Fichier: ${error.file}`);
      console.log(`   Occurrences: ${error.count}`);
      if (error.examples.length > 0) {
        console.log(`   Exemples: ${error.examples.join(', ')}`);
      }
    });
  }
  
  if (analysis.warnings.length > 0) {
    console.log('\n⚠️  Avertissements :');
    analysis.warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning.issue}`);
      console.log(`   Fichier: ${warning.file}`);
      console.log(`   Occurrences: ${warning.count}`);
    });
  }
  
  if (analysis.suggestions.length > 0) {
    console.log('\n💡 Suggestions :');
    analysis.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.message}`);
      if (suggestion.action) {
        console.log(`   Action: ${suggestion.action}`);
      }
    });
  }
  
  if (analysis.errors.length === 0 && analysis.warnings.length === 0) {
    console.log('✅ Aucune erreur CSS détectée !');
  }
  
  console.log('\n🔧 Actions recommandées :');
  if (analysis.errors.length > 0) {
    console.log('1. Exécuter: node fix-css-errors.cjs');
    console.log('2. Redémarrer: restart-clean.bat');
  } else {
    console.log('1. CSS semble correct');
    console.log('2. Si des erreurs persistent dans le navigateur, nettoyer le cache');
  }
}

// Fonction pour corriger automatiquement
function autoFix() {
  console.log('\n🔧 Correction automatique...');
  
  const globalsPath = 'app/globals.css';
  if (fs.existsSync(globalsPath)) {
    let content = fs.readFileSync(globalsPath, 'utf8');
    let fixed = false;
    
    // Corrections automatiques
    const fixes = [
      {
        search: /-webkit-text-size-adjust:\s*[^;]*[^0-9%];/g,
        replace: '-webkit-text-size-adjust: 100%;',
        name: 'webkit-text-size-adjust'
      },
      {
        search: /(@[^{]*)\{([^}]*)\{/g,
        replace: '$1 {\n  $2 {',
        name: 'sélecteurs imbriqués'
      },
      {
        search: /\}\s*\{/g,
        replace: '}\n\n{',
        name: 'espacement des règles'
      }
    ];
    
    fixes.forEach(fix => {
      if (fix.search.test(content)) {
        content = content.replace(fix.search, fix.replace);
        fixed = true;
        console.log(`✅ Corrigé: ${fix.name}`);
      }
    });
    
    if (fixed) {
      fs.writeFileSync(globalsPath, content, 'utf8');
      console.log('✅ Fichier globals.css mis à jour');
    } else {
      console.log('ℹ️  Aucune correction nécessaire');
    }
  }
}

// Exécution principale
console.log('🔍 Analyse en cours...');
generateReport();

// Option pour correction automatique
const args = process.argv.slice(2);
if (args.includes('--fix')) {
  autoFix();
  console.log('\n🎉 Correction terminée !');
  console.log('📋 Redémarrez le serveur pour voir les changements.');
}

console.log('\n💡 Pour corriger automatiquement: node monitor-css-errors.cjs --fix');