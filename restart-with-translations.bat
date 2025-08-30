@echo off
echo 🔄 Redémarrage avec traductions corrigées
echo ========================================

echo.
echo 1. Arrêt du serveur en cours...
taskkill /f /im node.exe >nul 2>&1

echo.
echo 2. Nettoyage du cache Next.js...
rmdir /s /q .next >nul 2>&1
echo ✅ Cache nettoyé

echo.
echo 3. Vérification des traductions...
node fix-auth-translations-complete.cjs
node fix-common-translations.cjs

echo.
echo 4. Redémarrage du serveur...
echo 🚀 L'application va démarrer sur http://localhost:3002
echo.
echo ⚠️  Les traductions devraient maintenant s'afficher correctement
echo.
npm run dev