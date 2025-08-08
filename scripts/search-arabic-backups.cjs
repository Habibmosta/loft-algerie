const fs = require('fs');
const path = require('path');

console.log('🔍 RECHERCHE DE SAUVEGARDES DE TRADUCTIONS ARABES\n');

// Fonction pour rechercher récursivement des fichiers
function searchFiles(dir, pattern, results = []) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorer certains dossiers
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(file)) {
          searchFiles(fullPath, pattern, results);
        }
      } else if (pattern.test(file)) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    // Ignorer les erreurs d'accès aux dossiers
  }
  
  return results;
}

// Patterns de recherche pour les fichiers de traduction arabes
const patterns = [
  /.*ar.*\.json$/i,           // Fichiers JSON contenant "ar"
  /.*arabic.*\.json$/i,       // Fichiers JSON contenant "arabic"
  /.*arabe.*\.json$/i,        // Fichiers JSON contenant "arabe"
  /translation.*ar/i,         // Fichiers de traduction arabes
  /ar.*translation/i          // Fichiers de traduction arabes
];

console.log('📁 Recherche de fichiers de sauvegarde...\n');

const foundFiles = [];

patterns.forEach((pattern, index) => {
  console.log(`🔎 Pattern ${index + 1}: ${pattern}`);
  const files = searchFiles('.', pattern);
  foundFiles.push(...files);
  
  if (files.length > 0) {
    files.forEach(file => {
      console.log(`   ✅ Trouvé: ${file}`);
    });
  } else {
    console.log('   ❌ Aucun fichier trouvé');
  }
  console.log('');
});

// Supprimer les doublons
const uniqueFiles = [...new Set(foundFiles)];

console.log(`📊 RÉSUMÉ: ${uniqueFiles.length} fichier(s) unique(s) trouvé(s)\n`);

// Analyser chaque fichier trouvé
const backupAnalysis = [];

for (const filePath of uniqueFiles) {
  console.log(`🔍 Analyse de: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si c'est un fichier JSON valide
    let jsonData = null;
    try {
      jsonData = JSON.parse(content);
    } catch (jsonError) {
      console.log('   ⚠️  Pas un JSON valide');
      continue;
    }
    
    // Compter les clés de traduction
    function countKeys(obj, prefix = '') {
      let count = 0;
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          count += countKeys(value, prefix ? `${prefix}.${key}` : key);
        } else {
          count++;
        }
      }
      return count;
    }
    
    const keyCount = countKeys(jsonData);
    const fileSize = Math.round(fs.statSync(filePath).size / 1024); // KB
    
    console.log(`   📊 ${keyCount} clés de traduction`);
    console.log(`   📏 ${fileSize} KB`);
    
    // Vérifier si c'est vraiment de l'arabe
    const sampleValues = [];
    function extractSampleValues(obj, samples = [], maxSamples = 5) {
      if (samples.length >= maxSamples) return samples;
      
      for (const [key, value] of Object.entries(obj)) {
        if (samples.length >= maxSamples) break;
        
        if (typeof value === 'string') {
          samples.push(value);
        } else if (typeof value === 'object' && value !== null) {
          extractSampleValues(value, samples, maxSamples);
        }
      }
      return samples;
    }
    
    const samples = extractSampleValues(jsonData);
    const hasArabicText = samples.some(text => /[\u0600-\u06FF]/.test(text));
    
    console.log(`   🔤 Contient de l'arabe: ${hasArabicText ? '✅' : '❌'}`);
    
    if (samples.length > 0) {
      console.log('   📝 Échantillons:');
      samples.slice(0, 3).forEach(sample => {
        const preview = sample.length > 50 ? sample.substring(0, 50) + '...' : sample;
        console.log(`      "${preview}"`);
      });
    }
    
    backupAnalysis.push({
      path: filePath,
      keyCount,
      fileSize,
      hasArabicText,
      samples: samples.slice(0, 3),
      isUseful: hasArabicText && keyCount > 10
    });
    
  } catch (error) {
    console.log(`   ❌ Erreur lors de l'analyse: ${error.message}`);
  }
  
  console.log('');
}

// Résumé et recommandations
console.log('🎯 RÉSUMÉ DE L\'ANALYSE:\n');

const usefulBackups = backupAnalysis.filter(b => b.isUseful);
const partialBackups = backupAnalysis.filter(b => b.hasArabicText && !b.isUseful);

if (usefulBackups.length > 0) {
  console.log('✅ SAUVEGARDES UTILES TROUVÉES:');
  usefulBackups.forEach(backup => {
    console.log(`   📁 ${backup.path}`);
    console.log(`      - ${backup.keyCount} clés`);
    console.log(`      - ${backup.fileSize} KB`);
    console.log(`      - Contient de l'arabe: ✅`);
  });
  console.log('');
}

if (partialBackups.length > 0) {
  console.log('🟡 SAUVEGARDES PARTIELLES:');
  partialBackups.forEach(backup => {
    console.log(`   📁 ${backup.path}`);
    console.log(`      - ${backup.keyCount} clés (trop peu)`);
  });
  console.log('');
}

if (usefulBackups.length === 0 && partialBackups.length === 0) {
  console.log('❌ AUCUNE SAUVEGARDE UTILE TROUVÉE');
  console.log('');
  console.log('💡 RECOMMANDATIONS:');
  console.log('   1. Vérifier les sauvegardes externes ou cloud');
  console.log('   2. Contacter l\'équipe pour d\'anciennes versions');
  console.log('   3. Procéder à la génération automatique de traductions');
  console.log('   4. Utiliser les traductions françaises comme base');
}

// Sauvegarder l'analyse
const searchResults = {
  timestamp: new Date().toISOString(),
  searchPatterns: patterns.map(p => p.toString()),
  filesFound: uniqueFiles,
  analysis: backupAnalysis,
  usefulBackups: usefulBackups.map(b => b.path),
  recommendations: usefulBackups.length > 0 ? 
    'Utiliser les sauvegardes trouvées pour restaurer les traductions' :
    'Procéder à la génération automatique de traductions'
};

fs.writeFileSync('arabic-backup-search-results.json', JSON.stringify(searchResults, null, 2));
console.log('💾 Résultats de recherche sauvegardés dans: arabic-backup-search-results.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
if (usefulBackups.length > 0) {
  console.log('1. Analyser les sauvegardes trouvées');
  console.log('2. Extraire les traductions valides');
  console.log('3. Fusionner avec les traductions existantes');
} else {
  console.log('1. Créer un dictionnaire de traductions automatiques');
  console.log('2. Utiliser les traductions françaises comme base');
  console.log('3. Générer les traductions manquantes');
}