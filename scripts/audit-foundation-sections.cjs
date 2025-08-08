const fs = require('fs');

console.log('🔍 AUDIT DE QUALITÉ DES SECTIONS FONDAMENTALES\n');
console.log('📋 Sections cibles: auth, landing, nav, theme\n');

// Lire les fichiers de traduction
function readTranslationFile(filePath, language) {
  try {
    if (fs.existsSync(filePath)) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${language.toUpperCase()}: Fichier chargé avec succès`);
      return content;
    } else {
      console.warn(`⚠️  ${language.toUpperCase()}: Fichier non trouvé - ${filePath}`);
      return {};
    }
  } catch (error) {
    console.error(`❌ ${language.toUpperCase()}: Erreur lors de la lecture - ${error.message}`);
    return {};
  }
}

const frTranslations = readTranslationFile('../locales/fr/translation.json', 'français');
const enTranslations = readTranslationFile('../locales/en/translation.json', 'anglais');
const arTranslations = readTranslationFile('../locales/ar/translation.json', 'arabe');

// Fonction pour évaluer la qualité d'une traduction
function evaluateTranslationQuality(key, value, language, sectionType) {
  const issues = [];
  let score = 100;
  
  // Vérifications de base
  if (!value || value.trim() === '') {
    issues.push({ type: 'empty', severity: 'critical', message: 'Valeur vide' });
    score -= 50;
    return { score: 0, issues };
  }
  
  // Vérifications spécifiques par langue
  if (language === 'ar') {
    // Vérifier la présence de caractères arabes
    const arabicRegex = /[\u0600-\u06FF]/;
    if (!arabicRegex.test(value) && !value.startsWith('[AR]')) {
      // Exceptions pour certains termes techniques
      const exceptions = ['email', 'admin', 'manager', 'member', 'http', 'www'];
      const isException = exceptions.some(exc => key.toLowerCase().includes(exc) || value.toLowerCase().includes(exc));
      
      if (!isException) {
        issues.push({ type: 'no_arabic', severity: 'high', message: 'Pas de caractères arabes' });
        score -= 30;
      }
    }
    
    // Vérifier les marqueurs de fallback
    if (value.startsWith('[AR]')) {
      issues.push({ type: 'fallback', severity: 'medium', message: 'Marqueur de fallback présent' });
      score -= 20;
    }
  }
  
  // Vérifications de qualité par type de section
  if (sectionType === 'auth') {
    // Les traductions d'auth doivent être rassurantes et claires
    if (key.includes('error') || key.includes('failed')) {
      if (value.length < 10) {
        issues.push({ type: 'too_short', severity: 'medium', message: 'Message d\'erreur trop court' });
        score -= 15;
      }
    }
    
    if (key.includes('description') && value.length < 20) {
      issues.push({ type: 'insufficient_detail', severity: 'low', message: 'Description insuffisamment détaillée' });
      score -= 10;
    }
  }
  
  if (sectionType === 'landing') {
    // Les traductions de landing doivent être engageantes
    if (key.includes('title') && value.length < 5) {
      issues.push({ type: 'too_short', severity: 'medium', message: 'Titre trop court pour être engageant' });
      score -= 15;
    }
    
    if (key.includes('description') && value.length < 30) {
      issues.push({ type: 'insufficient_marketing', severity: 'medium', message: 'Description marketing insuffisante' });
      score -= 15;
    }
  }
  
  // Vérifications de format
  if (/\s{3,}/.test(value)) {
    issues.push({ type: 'excessive_spaces', severity: 'low', message: 'Espaces excessifs' });
    score -= 5;
  }
  
  if (/[\x00-\x1F\x7F]/.test(value)) {
    issues.push({ type: 'control_chars', severity: 'medium', message: 'Caractères de contrôle' });
    score -= 10;
  }
  
  // Vérifications de cohérence
  if (language === 'fr' && value.includes('...') && !value.includes('…')) {
    if (!value.includes('Chargement')) {
      issues.push({ type: 'punctuation', severity: 'low', message: 'Points de suspension incorrects' });
      score -= 5;
    }
  }
  
  return { score: Math.max(0, score), issues };
}

// Fonction pour analyser une section complète
function auditSection(translations, sectionName, language) {
  if (!translations[sectionName]) {
    return {
      exists: false,
      totalKeys: 0,
      averageScore: 0,
      issues: [],
      recommendations: [`Créer la section ${sectionName} pour ${language}`]
    };
  }
  
  const keys = [];
  const allIssues = [];
  let totalScore = 0;
  
  function extractAndEvaluate(section, prefix = sectionName) {
    for (const [key, value] of Object.entries(section)) {
      const fullKey = `${prefix}.${key}`;
      
      if (typeof value === 'object' && value !== null) {
        extractAndEvaluate(value, fullKey);
      } else {
        const evaluation = evaluateTranslationQuality(fullKey, value, language, sectionName);
        keys.push({
          key: fullKey,
          value: value,
          score: evaluation.score,
          issues: evaluation.issues
        });
        
        totalScore += evaluation.score;
        allIssues.push(...evaluation.issues.map(issue => ({
          ...issue,
          key: fullKey,
          value: value
        })));
      }
    }
  }
  
  extractAndEvaluate(translations[sectionName]);
  
  const averageScore = keys.length > 0 ? Math.round(totalScore / keys.length) : 0;
  
  // Générer des recommandations
  const recommendations = [];
  const issueTypes = allIssues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});
  
  if (issueTypes.fallback > 0) {
    recommendations.push(`Réviser ${issueTypes.fallback} traductions avec marqueurs de fallback`);
  }
  
  if (issueTypes.no_arabic > 0) {
    recommendations.push(`Ajouter des caractères arabes à ${issueTypes.no_arabic} traductions`);
  }
  
  if (issueTypes.too_short > 0) {
    recommendations.push(`Enrichir ${issueTypes.too_short} traductions trop courtes`);
  }
  
  if (averageScore < 70) {
    recommendations.push(`Amélioration générale de la qualité requise (score: ${averageScore}%)`);
  }
  
  return {
    exists: true,
    totalKeys: keys.length,
    averageScore,
    keys,
    issues: allIssues,
    recommendations,
    issueTypes
  };
}

// Sections fondamentales à auditer
const foundationSections = ['auth', 'landing', 'nav', 'theme'];

console.log('\n📊 AUDIT DÉTAILLÉ PAR SECTION:\n');

const auditResults = {};

foundationSections.forEach(section => {
  console.log(`🔍 Audit de la section: ${section.toUpperCase()}`);
  
  // Auditer chaque langue
  const frAudit = auditSection(frTranslations, section, 'fr');
  const enAudit = auditSection(enTranslations, section, 'en');
  const arAudit = auditSection(arTranslations, section, 'ar');
  
  // Calculer les statistiques
  const maxKeys = Math.max(frAudit.totalKeys, enAudit.totalKeys, arAudit.totalKeys);
  const avgScore = Math.round((frAudit.averageScore + enAudit.averageScore + arAudit.averageScore) / 3);
  
  console.log(`   📊 Clés maximum: ${maxKeys}`);
  console.log(`   🇫🇷 Français: ${frAudit.totalKeys} clés, score ${frAudit.averageScore}% - ${frAudit.exists ? 'Existe' : 'Manquant'}`);
  console.log(`   🇬🇧 Anglais: ${enAudit.totalKeys} clés, score ${enAudit.averageScore}% - ${enAudit.exists ? 'Existe' : 'Manquant'}`);
  console.log(`   🇸🇦 Arabe: ${arAudit.totalKeys} clés, score ${arAudit.averageScore}% - ${arAudit.exists ? 'Existe' : 'Manquant'}`);
  console.log(`   📈 Score moyen: ${avgScore}%`);
  
  // Analyser les problèmes les plus fréquents
  const allIssues = [...frAudit.issues, ...enAudit.issues, ...arAudit.issues];
  const issueFrequency = allIssues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});
  
  if (Object.keys(issueFrequency).length > 0) {
    console.log(`   ⚠️  Problèmes détectés:`);
    Object.entries(issueFrequency).forEach(([type, count]) => {
      const severity = allIssues.find(i => i.type === type)?.severity || 'unknown';
      const icon = severity === 'critical' ? '🔴' : severity === 'high' ? '🟡' : severity === 'medium' ? '🟠' : '🔵';
      console.log(`      ${icon} ${type}: ${count} occurrences`);
    });
  }
  
  // Recommandations spécifiques
  const allRecommendations = [...new Set([...frAudit.recommendations, ...enAudit.recommendations, ...arAudit.recommendations])];
  if (allRecommendations.length > 0) {
    console.log(`   💡 Recommandations:`);
    allRecommendations.slice(0, 3).forEach(rec => {
      console.log(`      - ${rec}`);
    });
  }
  
  // Sauvegarder les résultats
  auditResults[section] = {
    maxKeys,
    avgScore,
    languages: {
      fr: frAudit,
      en: enAudit,
      ar: arAudit
    },
    totalIssues: allIssues.length,
    issueFrequency,
    recommendations: allRecommendations,
    priority: calculatePriority(avgScore, allIssues.length, maxKeys)
  };
  
  console.log('');
});

// Fonction pour calculer la priorité d'amélioration
function calculatePriority(avgScore, issueCount, keyCount) {
  if (avgScore < 50 || issueCount > keyCount * 0.5) return 'CRITIQUE';
  if (avgScore < 70 || issueCount > keyCount * 0.3) return 'HAUTE';
  if (avgScore < 85 || issueCount > keyCount * 0.1) return 'MOYENNE';
  return 'BASSE';
}

// Calculer les statistiques globales
const globalStats = {
  totalSections: foundationSections.length,
  sectionsWithData: Object.values(auditResults).filter(s => s.maxKeys > 0).length,
  totalKeys: Object.values(auditResults).reduce((sum, section) => sum + section.maxKeys, 0),
  averageScore: Math.round(Object.values(auditResults).reduce((sum, section) => sum + section.avgScore, 0) / foundationSections.length),
  totalIssues: Object.values(auditResults).reduce((sum, section) => sum + section.totalIssues, 0),
  priorityDistribution: Object.values(auditResults).reduce((acc, section) => {
    acc[section.priority] = (acc[section.priority] || 0) + 1;
    return acc;
  }, {})
};

console.log('🌍 STATISTIQUES GLOBALES DE L\'AUDIT:\n');
console.log(`📊 Sections auditées: ${globalStats.totalSections}`);
console.log(`📈 Sections avec données: ${globalStats.sectionsWithData}`);
console.log(`🔑 Total des clés: ${globalStats.totalKeys}`);
console.log(`📈 Score de qualité moyen: ${globalStats.averageScore}%`);
console.log(`⚠️  Total des problèmes: ${globalStats.totalIssues}`);
console.log(`🎯 Répartition par priorité:`);
Object.entries(globalStats.priorityDistribution).forEach(([priority, count]) => {
  console.log(`   ${priority}: ${count} section(s)`);
});

// Identifier les actions prioritaires
console.log('\n🎯 PLAN D\'ACTION PRIORITAIRE:\n');

const actionPlan = [];

foundationSections.forEach(section => {
  const sectionData = auditResults[section];
  const priority = sectionData.priority;
  const avgScore = sectionData.avgScore;
  const issueCount = sectionData.totalIssues;
  
  let action = '';
  let effort = '';
  
  if (priority === 'CRITIQUE') {
    action = 'Refonte complète requise';
    effort = 'Élevé';
  } else if (priority === 'HAUTE') {
    action = 'Amélioration majeure nécessaire';
    effort = 'Moyen-Élevé';
  } else if (priority === 'MOYENNE') {
    action = 'Optimisation recommandée';
    effort = 'Moyen';
  } else {
    action = 'Maintenance légère';
    effort = 'Faible';
  }
  
  actionPlan.push({
    section,
    priority,
    avgScore,
    issueCount,
    action,
    effort,
    details: sectionData
  });
});

// Trier par priorité
const priorityOrder = { 'CRITIQUE': 0, 'HAUTE': 1, 'MOYENNE': 2, 'BASSE': 3 };
actionPlan.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

actionPlan.forEach(({ section, priority, avgScore, issueCount, action, effort }) => {
  const icon = priority === 'CRITIQUE' ? '🔴' : priority === 'HAUTE' ? '🟡' : priority === 'MOYENNE' ? '🟠' : '🟢';
  console.log(`${icon} ${priority}: ${section.toUpperCase()}`);
  console.log(`   📊 Score: ${avgScore}%, ${issueCount} problèmes`);
  console.log(`   🎯 Action: ${action}`);
  console.log(`   ⚡ Effort: ${effort}`);
  console.log('');
});

// Recommandations stratégiques
console.log('💡 RECOMMANDATIONS STRATÉGIQUES:\n');

const criticalSections = actionPlan.filter(p => p.priority === 'CRITIQUE');
const highSections = actionPlan.filter(p => p.priority === 'HAUTE');

if (criticalSections.length > 0) {
  console.log('🔴 ACTIONS CRITIQUES IMMÉDIATES:');
  criticalSections.forEach(({ section, details }) => {
    console.log(`   - ${section.toUpperCase()}: Refonte complète`);
    console.log(`     • ${details.totalIssues} problèmes à résoudre`);
    console.log(`     • Score actuel: ${details.avgScore}%`);
    console.log(`     • Recommandations: ${details.recommendations.slice(0, 2).join(', ')}`);
  });
  console.log('');
}

if (highSections.length > 0) {
  console.log('🟡 ACTIONS PRIORITAIRES:');
  highSections.forEach(({ section, details }) => {
    console.log(`   - ${section.toUpperCase()}: Amélioration ciblée`);
    console.log(`     • Focus sur les ${Object.keys(details.issueFrequency).slice(0, 2).join(', ')}`);
    console.log(`     • Objectif: atteindre 85%+ de qualité`);
  });
  console.log('');
}

// Sauvegarder l'audit complet
const fullAudit = {
  timestamp: new Date().toISOString(),
  foundationSections,
  auditResults,
  globalStats,
  actionPlan,
  strategicRecommendations: {
    immediate: criticalSections.map(p => ({
      section: p.section,
      currentScore: p.avgScore,
      targetScore: 85,
      issues: p.issueCount,
      effort: p.effort
    })),
    priority: highSections.map(p => ({
      section: p.section,
      currentScore: p.avgScore,
      targetScore: 90,
      mainIssues: Object.keys(p.details.issueFrequency).slice(0, 3)
    }))
  }
};

fs.writeFileSync('foundation-sections-audit.json', JSON.stringify(fullAudit, null, 2));

console.log('💾 Audit complet sauvegardé: foundation-sections-audit.json');

console.log('\n🚀 PROCHAINES ÉTAPES:');
console.log('1. Créer un analyseur de qualité spécialisé');
console.log('2. Commencer par les sections critiques');
console.log('3. Implémenter les améliorations par ordre de priorité');
console.log('4. Valider la qualité après chaque amélioration');