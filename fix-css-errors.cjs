const fs = require('fs');
const path = require('path');

console.log('🎨 Correction des erreurs CSS...');
console.log('================================');

// Vérifier et corriger le fichier globals.css
const globalsPath = 'app/globals.css';

if (fs.existsSync(globalsPath)) {
  console.log('📁 Vérification de app/globals.css...');
  
  let content = fs.readFileSync(globalsPath, 'utf8');
  let modified = false;
  
  // Corriger les propriétés webkit problématiques
  const fixes = [
    {
      search: /-webkit-text-size-adjust:\s*[^;]*;/g,
      replace: '-webkit-text-size-adjust: 100%;',
      description: 'Correction de -webkit-text-size-adjust'
    },
    {
      search: /(@[^{]*)\{([^}]*)\{/g,
      replace: '$1 { $2 {',
      description: 'Correction des sélecteurs imbriqués'
    },
    {
      search: /\}\s*\{/g,
      replace: '}\n{',
      description: 'Espacement des accolades'
    }
  ];
  
  fixes.forEach(fix => {
    if (fix.search.test(content)) {
      content = content.replace(fix.search, fix.replace);
      modified = true;
      console.log(`✅ ${fix.description}`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(globalsPath, content, 'utf8');
    console.log('✅ app/globals.css corrigé');
  } else {
    console.log('ℹ️  app/globals.css - Aucune correction nécessaire');
  }
} else {
  console.log('❌ app/globals.css non trouvé');
}

// Vérifier tailwind.config.ts
const tailwindPath = 'tailwind.config.ts';
if (fs.existsSync(tailwindPath)) {
  console.log('📁 Vérification de tailwind.config.ts...');
  
  const content = fs.readFileSync(tailwindPath, 'utf8');
  
  // Vérifier la configuration Tailwind
  if (content.includes('content:') && content.includes('./app/**/*.{js,ts,jsx,tsx}')) {
    console.log('✅ Configuration Tailwind correcte');
  } else {
    console.log('⚠️  Configuration Tailwind à vérifier');
  }
} else {
  console.log('❌ tailwind.config.ts non trouvé');
}

// Créer un CSS de base propre si nécessaire
const cleanCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables CSS personnalisées */
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

/* Styles de base */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

/* Corrections webkit */
body {
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* Support RTL */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="ltr"] {
  direction: ltr;
  text-align: left;
}

/* Animations personnalisées */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slide-in-up {
  animation: slideInUp 0.4s ease-out;
}

/* Styles pour les cartes */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Styles pour les badges */
.badge-gradient {
  background: linear-gradient(135deg, var(--badge-from, #3b82f6), var(--badge-to, #1d4ed8));
}

/* Corrections pour les sélecteurs problématiques */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styles pour les formulaires */
.form-input {
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Styles pour les boutons */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-1px);
}

/* Corrections pour les erreurs CSS communes */
@supports (-webkit-text-size-adjust: none) {
  body {
    -webkit-text-size-adjust: 100%;
  }
}
`;

// Sauvegarder le CSS propre comme référence
fs.writeFileSync('app/globals-clean.css', cleanCSS, 'utf8');
console.log('✅ CSS propre créé : app/globals-clean.css');

console.log('\n🎯 Recommandations :');
console.log('1. Redémarrez le serveur de développement');
console.log('2. Vérifiez que les erreurs CSS ont disparu');
console.log('3. Si les erreurs persistent, remplacez globals.css par globals-clean.css');
console.log('4. Nettoyez le cache Next.js : rm -rf .next');

console.log('\n✨ Correction CSS terminée !');