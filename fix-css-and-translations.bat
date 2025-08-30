@echo off
echo 🔧 Correction des erreurs CSS et traductions
echo =============================================

echo.
echo 1. Nettoyage du cache Next.js...
rmdir /s /q .next 2>nul
echo ✅ Cache Next.js nettoyé

echo.
echo 2. Nettoyage du cache npm...
npm cache clean --force
echo ✅ Cache npm nettoyé

echo.
echo 3. Création des fichiers de traduction manquants...
node fix-missing-translation-files.cjs
echo ✅ Fichiers de traduction créés

echo.
echo 4. Vérification des dépendances...
npm install
echo ✅ Dépendances vérifiées

echo.
echo 5. Redémarrage du serveur de développement...
echo 🚀 Démarrage de l'application...
echo.
echo ⚠️  Si des erreurs persistent, vérifiez :
echo    - Les fichiers CSS personnalisés
echo    - La configuration Tailwind
echo    - Les imports de styles
echo.
npm run dev