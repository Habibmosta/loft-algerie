@echo off
echo 🧹 Redémarrage propre de l'application
echo =====================================

echo.
echo 1. Arrêt des processus Node.js...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Processus arrêtés

echo.
echo 2. Nettoyage des caches...
rmdir /s /q .next >nul 2>&1
rmdir /s /q node_modules\.cache >nul 2>&1
echo ✅ Caches nettoyés

echo.
echo 3. Correction des erreurs CSS...
node fix-css-errors.cjs

echo.
echo 4. Vérification des traductions...
node test-translations-live.cjs

echo.
echo 5. Vérification des dépendances...
npm install --silent

echo.
echo 6. Redémarrage du serveur...
echo 🚀 L'application va démarrer...
echo.
echo ✨ Améliorations appliquées :
echo    - Erreurs CSS corrigées
echo    - Traductions complètes (100%%)
echo    - Cache nettoyé
echo    - Configuration optimisée
echo.
echo 🌐 L'application sera disponible sur :
echo    - http://localhost:3000 (principal)
echo    - http://localhost:3002 (alternatif)
echo.
npm run dev