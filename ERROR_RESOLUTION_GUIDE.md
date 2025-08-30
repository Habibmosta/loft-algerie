# 🚨 Guide de Résolution des Erreurs - Loft Manager

## 🔧 Erreurs Courantes et Solutions

### 1. `ENOENT: no such file or directory, open '.next/routes-manifest.json'`

**Cause :** Cache Next.js corrompu ou manquant

**Solution Rapide :**
```bash
emergency-recovery.bat
```

**Solution Manuelle :**
```bash
# Arrêter tous les processus Node
taskkill /f /im node.exe

# Supprimer le cache
rmdir /s /q .next
npm cache clean --force

# Reconstruire
npm run build
npm run dev
```

### 2. Erreurs de Traduction (`auth:welcomeBack`)

**Cause :** Fichiers de traduction manquants ou corrompus

**Solution :**
```bash
node fix-auth-translations-complete.cjs
node fix-common-translations.cjs
restart-with-translations.bat
```

### 3. Erreurs de Build Webpack

**Cause :** Dépendances corrompues ou cache invalide

**Solution :**
```bash
# Nettoyage complet
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### 4. Erreurs Supabase (401 Unauthorized)

**Cause :** Configuration d'authentification ou variables d'environnement

**Solution :**
1. Vérifier `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

2. Redémarrer l'application :
   ```bash
   npm run dev
   ```

### 5. Erreurs de Port (EADDRINUSE)

**Cause :** Port 3002 déjà utilisé

**Solution :**
```bash
# Tuer les processus sur le port
netstat -ano | findstr :3002
taskkill /PID [PID_NUMBER] /F

# Ou utiliser un autre port
npm run dev -- -p 3003
```

### 6. Erreurs TypeScript

**Cause :** Types manquants ou configuration incorrecte

**Solution :**
```bash
# Régénérer les types
npm run build
# ou
npx tsc --noEmit
```

### 7. Erreurs CSS/Tailwind

**Cause :** Configuration Tailwind ou cache CSS

**Solution :**
```bash
# Nettoyer et reconstruire
rm -rf .next
npm run build
```

## 🛠️ Scripts de Diagnostic

### Diagnostic Complet
```bash
node diagnose-errors.cjs
```

### Test des Traductions
```bash
node test-translations-live.cjs
```

### Vérification de l'État
```bash
# Vérifier les processus Node
tasklist | findstr node

# Vérifier les ports
netstat -ano | findstr :3002

# Vérifier les fichiers critiques
dir .next\routes-manifest.json
dir public\locales\fr\auth.json
```

## 🚀 Scripts de Récupération

### Récupération d'Urgence
```bash
emergency-recovery.bat
```

### Démarrage Rapide
```bash
quick-start.bat
```

### Redémarrage avec Traductions
```bash
restart-with-translations.bat
```

## 📋 Checklist de Dépannage

Avant de demander de l'aide, vérifiez :

- [ ] Les processus Node sont-ils arrêtés ?
- [ ] Le cache `.next` est-il présent et valide ?
- [ ] Les variables d'environnement sont-elles configurées ?
- [ ] Les fichiers de traduction existent-ils ?
- [ ] Le port 3002 est-il libre ?
- [ ] Les dépendances sont-elles installées ?
- [ ] Y a-t-il des erreurs TypeScript ?

## 🔍 Logs Utiles

### Logs Next.js
```bash
npm run dev -- --debug
```

### Logs de Build
```bash
npm run build 2>&1 | tee build.log
```

### Logs Supabase
Vérifier la console du navigateur pour les erreurs d'authentification.

## 📞 Support d'Urgence

Si aucune solution ne fonctionne :

1. **Sauvegarde** : Commitez vos changements
   ```bash
   git add .
   git commit -m "Backup before emergency fix"
   ```

2. **Reset complet** :
   ```bash
   git clean -fdx
   npm install
   npm run build
   ```

3. **Restauration** depuis GitHub :
   ```bash
   git fetch origin
   git reset --hard origin/main
   npm install
   ```

## 🎯 Prévention

### Bonnes Pratiques
- ✅ Toujours commiter avant les gros changements
- ✅ Utiliser les scripts de diagnostic régulièrement
- ✅ Nettoyer le cache périodiquement
- ✅ Vérifier les traductions après modifications
- ✅ Tester sur les 3 langues (FR/AR/EN)

### Scripts Automatiques
Ajoutez à votre routine :
```bash
# Diagnostic hebdomadaire
node diagnose-errors.cjs

# Test des traductions
node test-translations-live.cjs

# Nettoyage mensuel
npm cache clean --force
rm -rf .next
npm run build
```

## 🏆 Résolution Réussie

Une fois le problème résolu :

1. **Tester** l'application complètement
2. **Commiter** les corrections
3. **Documenter** la solution si nouvelle
4. **Mettre à jour** ce guide si nécessaire

---

**Rappel :** En cas de doute, utilisez `emergency-recovery.bat` - c'est la solution la plus fiable ! 🚨