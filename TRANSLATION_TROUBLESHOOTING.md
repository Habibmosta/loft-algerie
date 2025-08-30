# 🌐 Guide de Dépannage des Traductions

## 🚨 Problèmes Courants

### 1. Clés de traduction non résolues (ex: `auth:welcomeBack`)

**Symptômes :**
- Affichage de `auth:welcomeBack` au lieu de "Bon retour"
- Clés de traduction visibles dans l'interface
- Messages d'erreur i18next dans la console

**Solutions :**

#### Solution Rapide
```bash
# Corriger les traductions d'authentification
node fix-auth-translations-complete.cjs

# Corriger les traductions communes
node fix-common-translations.cjs

# Redémarrer proprement
restart-with-translations.bat
```

#### Solution Manuelle
1. Vérifier le fichier de traduction concerné :
   ```bash
   # Exemple pour auth.json français
   cat public/locales/fr/auth.json
   ```

2. Ajouter la clé manquante :
   ```json
   {
     "welcomeBack": "Bon retour",
     "signIn": "Se connecter"
   }
   ```

3. Redémarrer le serveur :
   ```bash
   npm run dev
   ```

### 2. Fichiers de traduction corrompus

**Symptômes :**
- Erreurs JSON dans la console
- Traductions qui ne se chargent pas
- Messages "failed parsing JSON"

**Solutions :**
```bash
# Diagnostiquer les fichiers JSON
node diagnose-errors.cjs

# Tester les traductions
node test-translations-live.cjs

# Recréer les fichiers manquants
node fix-missing-translation-files.cjs
```

### 3. Cache de traductions

**Symptômes :**
- Traductions qui ne se mettent pas à jour
- Anciennes traductions qui persistent
- Changements non visibles après modification

**Solutions :**
```bash
# Nettoyage complet
rm -rf .next
npm run dev

# Ou utiliser le script
fix-css-and-translations.bat
```

## 🛠️ Scripts de Diagnostic

### Test des Traductions
```bash
node test-translations-live.cjs
```
- Vérifie toutes les clés importantes
- Affiche le pourcentage de couverture
- Identifie les traductions manquantes

### Diagnostic Complet
```bash
node diagnose-errors.cjs
```
- Vérifie la structure des fichiers
- Valide la syntaxe JSON
- Contrôle les dépendances

### Correction Automatique
```bash
# Authentification
node fix-auth-translations-complete.cjs

# Traductions communes
node fix-common-translations.cjs

# Fichiers manquants
node fix-missing-translation-files.cjs
```

## 📁 Structure des Traductions

```
public/locales/
├── fr/                 # Français (défaut)
│   ├── auth.json      # Authentification
│   ├── common.json    # Traductions communes
│   ├── nav.json       # Navigation
│   └── settings.json  # Paramètres
├── ar/                # Arabe (RTL)
│   └── ...
└── en/                # Anglais
    └── ...
```

## 🔧 Configuration i18n

### Fichiers Importants
- `lib/i18n/index.ts` - Configuration principale
- `lib/i18n/settings.ts` - Paramètres
- `lib/i18n/context.tsx` - Contexte React

### Namespaces Supportés
```typescript
const NAMESPACES = [
  'common', 'auth', 'nav', 'settings',
  'dashboard', 'lofts', 'transactions',
  // ... autres namespaces
];
```

## 🌍 Langues Supportées

| Code | Langue | Direction | Statut |
|------|--------|-----------|--------|
| `fr` | Français | LTR | ✅ Complet |
| `ar` | العربية | RTL | ✅ Complet |
| `en` | English | LTR | ✅ Complet |

## 🚀 Ajout d'une Nouvelle Langue

1. **Créer les dossiers :**
   ```bash
   mkdir public/locales/es  # Exemple pour l'espagnol
   ```

2. **Copier la structure :**
   ```bash
   cp -r public/locales/fr/* public/locales/es/
   ```

3. **Traduire les fichiers JSON**

4. **Ajouter à la configuration :**
   ```typescript
   // lib/i18n/index.ts
   export const SUPPORTED_LANGUAGES = ['fr', 'ar', 'en', 'es'];
   ```

## 🔍 Débogage Avancé

### Logs i18next
```javascript
// Activer le debug temporairement
debug: true  // dans lib/i18n/index.ts
```

### Vérification des Clés
```javascript
// Dans le composant
const { t, ready } = useTranslation('auth');
console.log('Translation ready:', ready);
console.log('Welcome back:', t('welcomeBack'));
```

### Test Manuel
```bash
# Vérifier un fichier JSON spécifique
node -e "console.log(JSON.parse(require('fs').readFileSync('public/locales/fr/auth.json', 'utf8')))"
```

## 📞 Support

Si les problèmes persistent :

1. **Vérifier les logs** de la console navigateur
2. **Exécuter le diagnostic** complet
3. **Nettoyer le cache** Next.js
4. **Redémarrer** le serveur de développement
5. **Vérifier les fichiers** de traduction manuellement

## 🎯 Bonnes Pratiques

- ✅ Toujours valider le JSON après modification
- ✅ Utiliser les scripts de correction automatique
- ✅ Tester sur les 3 langues (FR/AR/EN)
- ✅ Vérifier le RTL pour l'arabe
- ✅ Commiter les changements de traduction
- ❌ Ne pas modifier directement les fichiers en production
- ❌ Ne pas oublier de redémarrer après les changements